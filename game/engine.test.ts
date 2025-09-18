import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { Adventurer } from './adventurer';
import * as constants from './constants';
import { initLocalization, t } from '../text';
import { MetaManager } from './meta';
import { RoomChoice, LootChoice, FlowState } from '../types';
import { UnlockableFeature } from './unlocks';
import * as ai from './ai';
import { rng } from './random';
import { MemoryStorage } from './storage';
import { DataLoaderFileSystem } from '../tools/data-loader-file-system';

// Mock the items data
const mockItems: LootChoice[] = Array.from({ length: 30 }, (_, i) => {
    const rarity = i < 18 ? 'Common' : i < 27 ? 'Uncommon' : 'Rare';
    const type = i % 3 === 0 ? 'Weapon' : i % 3 === 1 ? 'Armor' : 'Potion';
    const cost = i < 5 ? null : rng.nextInt(20, 120); // First 5 items are free
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
    { id: 'room_5', instanceId: 'r5', name: 'Harmless Room', type: 'enemy', rarity: 'Common', cost: null, units: 0, stats: { attack: 0, hp: 10 } },
];

describe('GameEngine', () => {
    let engine: GameEngine;
    let metaManager: MetaManager;
    let storage: MemoryStorage;
    let dataLoader: DataLoaderFileSystem;

    beforeAll(async () => {
        dataLoader = new DataLoaderFileSystem();
        await initLocalization(dataLoader);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    beforeEach(async () => {
        rng.setSeed(12345);
        storage = new MemoryStorage();
        metaManager = new MetaManager(storage);
        engine = new GameEngine(metaManager, dataLoader);
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
        engine.gameState!.adventurer.traits = { offense: 90, resilience: 10, skill: 10 };

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
        engine.gameState!.adventurer.traits = { offense: 10, resilience: 10, skill: 10 }; // Defensive
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
        engine.gameState!.adventurer.traits = { offense: 90, resilience: 10, skill: 0 }; // High offense, low resilience
        engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
        const room = { ...mockRooms.find(r => r.type === 'trap')!, stats: { attack: 1000 } };

        engine.runEncounter([room]);
        await vi.runAllTimersAsync();

        expect(engine.gameState?.runEnded.isOver).toBe(true);
        expect(engine.gameState?.phase).toBe('RUN_OVER');
        expect(engine.gameState?.runEnded.reason).toEqual(t('game_engine.adventurer_fell', { room: engine.gameState?.room, run: engine.gameState?.run }));
        vi.useRealTimers();
    });

    it('should apply a buff immediately upon selection, decrement its duration, and preserve health percentage', async () => {
        vi.useFakeTimers();

        const buffItem: LootChoice = {
            id: 'buff_1', instanceId: 'b_1', name: 'Test Buff', type: 'Buff', rarity: 'Rare', cost: 100,
            stats: { power: 10, maxHp: -20, duration: 2 },
        };
        (engine as any)._allItems.push(buffItem);

        // Mock getAdventurerLootChoice to always choose the buff
        vi.spyOn(ai, 'getAdventurerLootChoice').mockReturnValue({ choice: buffItem, reason: 'test' });

        engine.gameState!.adventurer.hp = 80;
        const initialPower = engine.gameState!.adventurer.power;

        // --- Present the buff as an offer ---
        engine.gameState!.phase = 'DESIGNER_CHOOSING_LOOT';
        engine.gameState!.hand = [buffItem]; // Put buff in hand to be offered
        engine.presentOffer([buffItem.instanceId]);
        await vi.runAllTimersAsync();

        // Check that buff was applied immediately
        expect(engine.gameState!.adventurer.activeBuffs).toHaveLength(1);
        expect(engine.gameState!.adventurer.activeBuffs[0].id).toBe('buff_1');
        expect(engine.gameState!.adventurer.power).toBe(initialPower + 10);
        // Check health percentage was maintained (80% of 80 is 64)
        expect(engine.gameState!.adventurer.maxHp).toBe(80);
        expect(engine.gameState!.adventurer.hp).toBe(64);

        const harmlessRoom = mockRooms.find(r => r.name === 'Harmless Room')!;

        // --- Run Encounter 1 (buff duration ticks down) ---
        // phase is now DESIGNER_CHOOSING_ROOM
        engine.runEncounter([{ ...harmlessRoom, instanceId: 'r5_1' }]);
        await vi.runAllTimersAsync();
        expect(engine.gameState!.adventurer.activeBuffs[0].stats.duration).toBe(1);
        expect(engine.gameState!.adventurer.hp).toBe(64); // Health should be unchanged

        // --- Run Encounter 2 (buff expires) ---
        // phase is now DESIGNER_CHOOSING_LOOT, but we need to be in DESIGNER_CHOOSING_ROOM
        engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
        engine.runEncounter([{ ...harmlessRoom, instanceId: 'r5_2' }]);
        await vi.runAllTimersAsync();

        // Buff should have expired
        expect(engine.gameState!.adventurer.activeBuffs).toHaveLength(0);
        expect(engine.gameState!.adventurer.power).toBe(initialPower);
        expect(engine.gameState!.adventurer.maxHp).toBe(100);
        expect(engine.gameState!.adventurer.hp).toBe(80);

        vi.useRealTimers();
    });

    describe('Workshop', () => {
        it('should transition to the SHOP phase correctly', async () => {
            const storage = new MemoryStorage();
            const metaManager = new MetaManager(storage);
            const dataLoader = new DataLoaderFileSystem();
            const engine = new GameEngine(metaManager, dataLoader);
            await engine.init();
            engine.metaManager.checkForUnlocks(10); // Unlock workshop
            engine.startNewGame();

            engine.gameState!.run = 1;
            engine.enterWorkshop();
            expect(engine.gameState?.phase).toBe('SHOP');
            expect(engine.gameState?.shopItems.length).toBeGreaterThan(0);
        });

        it('should allow purchasing an item from the shop', async () => {
            const storage = new MemoryStorage();
            const metaManager = new MetaManager(storage);
            const dataLoader = new DataLoaderFileSystem();
            const engine = new GameEngine(metaManager, dataLoader);
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
            const storage = new MemoryStorage();
            const metaManager = new MetaManager(storage);
            const dataLoader = new DataLoaderFileSystem();
            const engine = new GameEngine(metaManager, dataLoader);

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
            const storage = new MemoryStorage();
            const metaManager = new MetaManager(storage);
            const dataLoader = new DataLoaderFileSystem();
            const engine = new GameEngine(metaManager, dataLoader);
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

    it('should preserve flow state between runs', () => {
        // Manually set the flow state to something other than Boredom
        engine.gameState!.adventurer.flowState = FlowState.Control;

        // End the current run
        engine.handleEndOfRun('continue');

        // Start a new run
        engine.startNewRun();

        // Check if the flow state is preserved
        expect(engine.gameState!.adventurer.flowState).toBe(FlowState.Control);
    });
});
