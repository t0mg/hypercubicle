import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { Adventurer } from './adventurer';
import * as constants from './constants';
import { initLocalization, t } from '../text';
import { MetaManager } from './meta';
import { RoomChoice, LootChoice } from '../types';
import { UnlockableFeature } from './unlocks';

// Mock the items data
const mockItems: LootChoice[] = Array.from({ length: 30 }, (_, i) => {
    const rarity = i < 18 ? 'Common' : i < 27 ? 'Uncommon' : 'Rare';
    const type = i % 3 === 0 ? 'Weapon' : i % 3 === 1 ? 'Armor' : 'Potion';
    const cost = i < 5 ? null : Math.floor(Math.random() * 100) + 20; // First 5 items are free
    return {
        id: `loot_${i + 1}`,
        instanceId: `l_${i+1}`,
        name: `${rarity} ${type} ${i + 1}`,
        type: type,
        rarity: rarity,
        cost: cost,
        stats: type === 'Weapon' ? { power: 5 + i } : type === 'Armor' ? { maxHp: 10 + i } : { hp: 20 + i },
    };
});

const mockRooms: RoomChoice[] = [
    { id: 'room_1', instanceId: 'r1', name: 'Test Room', type: 'enemy', rarity: 'Common', cost: null, stats: { attack: 5, hp: 10, minUnits: 1, maxUnits: 1 } },
    { id: 'room_2', instanceId: 'r2', name: 'Test Boss Room', type: 'boss', rarity: 'Rare', cost: 100, stats: { attack: 10, hp: 50 } },
    { id: 'room_3', instanceId: 'r3', name: 'Healing Fountain', type: 'healing', rarity: 'Uncommon', cost: null, stats: { hp: 20 } },
    { id: 'room_4', instanceId: 'r4', name: 'Trap Room', type: 'trap', rarity: 'Common', cost: null, stats: { attack: 15 } },
];

// Mock fetch
global.fetch = vi.fn((url) => {
    if (url.toString().includes('items.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockItems),
        });
    }
    if (url.toString().includes('rooms.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockRooms),
        });
    }
    if (url.toString().includes('en.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                "game_engine": {
                    "new_adventurer": "A new adventurer has arrived!",
                    "adventurer_returns": "The adventurer returns for another go!",
                    "adventurer_accepts_offer": "The adventurer accepts your offer of {itemName}.",
                    "adventurer_declines_offer": "The adventurer considers your offer but declines.",
                    "adventurer_declines_empty_offer": "The adventurer seems disappointed by the lack of options.",
                    "healing_room": "The adventurer feels refreshed in the {name} and heals for {healing} HP.",
                    "trap_room": "The adventurer stumbles into the {name} and takes {damage} damage!",
                    "too_close_for_comfort": "A tough fight! The adventurer is rattled.",
                    "great_battle": "A worthy battle! The adventurer feels invigorated.",
                    "easy_fight": "An easy fight. The adventurer is a bit bored.",
                    "worthy_challenge": "A worthy challenge. The adventurer is satisfied.",
                    "adventurer_fell": "The adventurer fell in room {room} of run {run}.",
                    "adventurer_bored": "The adventurer has grown bored and left in room {room} of run {run}.",
                    "no_more_rooms": "You have no more rooms to offer. The adventurer leaves, disappointed.",
                    "welcome_to_workshop": "Welcome to the Workshop! Spend your Balance Points to unlock new items and rooms.",
                    "empty_hand": "Your hand is empty! The adventurer must press on without new items."
                },
                "global": {
                    "error_loading_items": "Failed to load game items: {statusText}",
                    "error_loading_rooms": "Failed to load game rooms: {statusText}",
                    "unknown_error": "An unknown error occurred"
                }
            }),
        });
    }
    return Promise.reject(new Error('not found'));
}) as any;


describe('GameEngine', () => {
    let engine: GameEngine;
    let metaManager: MetaManager;

    beforeAll(async () => {
        await initLocalization();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    beforeEach(async () => {
        metaManager = new MetaManager();
        engine = new GameEngine(metaManager);
        await engine.init();
        engine.startNewGame();
    });

    it('should initialize a new game state correctly', () => {
        expect(engine.gameState).not.toBeNull();
        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_ROOM');
        expect(engine.gameState?.run).toBe(1);
        expect(engine.gameState?.room).toBe(1);
        expect(engine.gameState?.designer.balancePoints).toBe(0);
        expect(engine.gameState?.adventurer).toBeInstanceOf(Adventurer);
        expect(engine.gameState?.unlockedDeck).toHaveLength(5);
        expect(engine.gameState?.availableDeck.length).toBe(constants.DECK_SIZE - engine.gameState.handSize);
        expect(engine.gameState?.hand).toHaveLength(engine.gameState.handSize);
        expect(engine.gameState?.roomHand).toHaveLength(constants.HAND_SIZE);
    });

    it('should start a new run correctly', () => {
        engine.gameState!.run = 2;
        engine.gameState!.designer.balancePoints = 100;
        const previousAdventurer = engine.gameState!.adventurer;
        engine.startNewRun();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_ROOM');
        expect(engine.gameState?.run).toBe(3); // Should be incremented
        expect(engine.gameState?.room).toBe(1);
        expect(engine.gameState?.designer.balancePoints).toBe(100); // Should not be reset
        expect(engine.gameState?.adventurer).not.toBe(previousAdventurer);
        expect(engine.gameState?.adventurer.hp).toBe(engine.gameState?.adventurer.maxHp);
    });

    it('should process a loot offer and update the game state', async () => {
        vi.useFakeTimers();
        engine.gameState!.adventurer.traits = { offense: 90, risk: 10, expertise: 10 };
        vi.spyOn(Math, 'random').mockReturnValue(0.1); // Low randomness

        engine.gameState!.phase = 'DESIGNER_CHOOSING_LOOT';
        const initialHand = [...engine.gameState!.hand];
        const offerIds = initialHand.slice(0, 2).map(item => item.instanceId);

        engine.presentOffer(offerIds);

        await vi.runAllTimersAsync();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_ROOM');
        expect(engine.gameState?.hand.length).toBe(constants.HAND_SIZE);
        expect(engine.gameState?.hand).not.toEqual(initialHand);

        vi.useRealTimers();
    });

    it('should run an encounter and update adventurer state', async () => {
        vi.useFakeTimers();
        vi.spyOn(Math, 'random').mockReturnValue(0.1); // Ensure enemy hits
        engine.gameState!.adventurer.traits = { offense: 10, risk: 10, expertise: 10 }; // Defensive
        engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
        const initialHp = engine.gameState!.adventurer.hp;

        // Find a damaging room in the hand to ensure the test is deterministic
        const damagingRoom = engine.gameState!.roomHand.find(r => r.type === 'enemy' || r.type === 'trap' || r.type === 'boss');
        expect(damagingRoom).toBeDefined();
        const initialRoomHand = [...engine.gameState!.roomHand];
        const offeredRooms = [damagingRoom!];

        engine.runEncounter(offeredRooms);
        await vi.runAllTimersAsync();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_LOOT');
        expect(engine.gameState?.adventurer.hp).toBeLessThan(initialHp);
        expect(engine.gameState?.roomHand.length).toBe(constants.HAND_SIZE);
        expect(engine.gameState?.roomHand).not.toEqual(initialRoomHand);
        vi.useRealTimers();
    });

    it('should end the game if adventurer hp drops to 0', async () => {
        vi.useFakeTimers();
        engine.gameState!.adventurer.traits = { offense: 90, risk: 90, expertise: 0 }; // Risky
        engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
        const room = { ...mockRooms.find(r => r.type === 'trap')!, stats: { attack: 1000 } };

        engine.runEncounter([room]);
        await vi.runAllTimersAsync();

        expect(engine.gameState?.runEnded.isOver).toBe(true);
        expect(engine.gameState?.phase).toBe('RUN_OVER');
        expect(engine.gameState?.runEnded.reason).toEqual(t('game_engine.adventurer_fell', { room: engine.gameState?.room, run: engine.gameState?.run }));
        vi.useRealTimers();
    });

    describe('Workshop', () => {
        it('should transition to the SHOP phase correctly', async () => {
            const metaManager = new MetaManager();
            const engine = new GameEngine(metaManager);
            await engine.init();
            engine.metaManager.checkForUnlocks(10); // Unlock workshop
            engine.startNewGame();

            engine.gameState!.run = 1;
            engine.enterWorkshop();
            expect(engine.gameState?.phase).toBe('SHOP');
            expect(engine.gameState?.shopItems.length).toBeGreaterThan(0);
        });

        it('should allow purchasing an item from the shop', async () => {
            const metaManager = new MetaManager();
            const engine = new GameEngine(metaManager);
            await engine.init();
            engine.metaManager.checkForUnlocks(10); // Unlock workshop
            engine.startNewGame();

            engine.gameState!.run = 1;
            engine.gameState!.designer.balancePoints = 100;

            // Manually set shop items for deterministic test and add it to the engine's items
            const itemToBuy: LootChoice = { id: 'buyable_item', instanceId: 'bi_1', name: 'Test Buyable', type: 'Weapon', rarity: 'Uncommon', cost: 75, stats: { power: 15 } };
            (engine as any)._allItems.push(itemToBuy); // Inject item
            engine.gameState!.shopItems = [itemToBuy];

            engine.purchaseItem(itemToBuy.id);

            expect(engine.gameState?.designer.balancePoints).toBe(25);
            expect(engine.gameState?.unlockedDeck).toContain(itemToBuy.id);
            expect(engine.gameState?.shopItems).not.toContain(itemToBuy);
        });
    });

    describe('Meta Progression', () => {
        beforeEach(() => {
            metaManager.reset();
        });

        it('should start the game in the MENU phase', () => {
            engine.showMenu();
            expect(engine.gameState?.phase).toBe('MENU');
        });

        it('should handle the continue-game event', () => {
            metaManager.updateRun(3);
            engine.continueGame();
            expect(engine.gameState?.run).toBe(1);
            expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_ROOM');
        });

        it('should handle the run-decision event and transition to the workshop', () => {
            engine.metaManager.checkForUnlocks(10); // Unlock everything
            engine.gameState!.run = 1;
            engine.handleEndOfRun('continue');
            expect(engine.gameState?.phase).toBe('SHOP');
        });


        it('should handle the run-decision event and transition to the menu', () => {
            engine.gameState!.run = 1;
            engine.handleEndOfRun('retire');
            expect(engine.gameState?.phase).toBe('MENU');
        });
    });

    describe('Unlocks', () => {
        it('should return correct BP based on unlocks', () => {
            const metaManager = new MetaManager();
            const engine = new GameEngine(metaManager);

            // No unlocks
            expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM);

            // BP_MULTIPLIER
            metaManager.metaState.unlockedFeatures.push(UnlockableFeature.BP_MULTIPLIER);
            expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM * 2);

            // BP_MULTIPLIER_2
            metaManager.metaState.unlockedFeatures.push(UnlockableFeature.BP_MULTIPLIER_2);
            expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM * 4);
        });

        it('should add purchased item to top of deck with WORKSHOP_ACCESS', async () => {
            const metaManager = new MetaManager();
            const engine = new GameEngine(metaManager);
            await engine.init();
            engine.metaManager.checkForUnlocks(100); // Unlock everything
            engine.startNewGame();

            engine.gameState!.run = 1;
            engine.gameState!.designer.balancePoints = 100;
            const itemToBuy: LootChoice = { id: 'buyable_item_2', instanceId: 'bi_2', name: 'Test Buyable 2', type: 'Weapon', rarity: 'Uncommon', cost: 75, stats: { power: 15 } };
            (engine as any)._allItems.push(itemToBuy);
            engine.gameState!.shopItems = [itemToBuy];

            engine.purchaseItem(itemToBuy.id);

            expect(engine.gameState?.designer.balancePoints).toBe(25);
            expect(engine.gameState?.unlockedDeck).toContain(itemToBuy.id);
            expect(engine.gameState?.shopItems).not.toContain(itemToBuy);
            expect(engine.gameState?.availableDeck[0].id).toBe(itemToBuy.id);
        });
    });
});
