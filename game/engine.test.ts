import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { Adventurer } from './adventurer';
import * as constants from './constants';
import { initLocalization, t } from '../text';
import { MetaManager } from './meta';

// Mock the items data
const mockItems = [
  { id: 'loot_1', name: 'Sword', type: 'Weapon', rarity: 'Common', stats: { power: 5 }, cost: null },
  { id: 'loot_2', name: 'Shield', type: 'Armor', rarity: 'Common', stats: { maxHp: 10 }, cost: null },
  { id: 'loot_3', name: 'Potion', type: 'Potion', rarity: 'Common', stats: { hp: 20 }, cost: null },
  { id: 'loot_4', name: 'Axe', type: 'Weapon', rarity: 'Uncommon', stats: { power: 10 }, cost: 50 },
  { id: 'loot_5', name: 'Helmet', type: 'Armor', rarity: 'Uncommon', stats: { maxHp: 15 }, cost: 50 },
];

const mockRooms = [
    { id: 'room_1', name: 'Test Room', type: 'enemy', rarity: 'Common', cost: null, stats: { attack: 5, hp: 10, minUnits: 1, maxUnits: 1 } },
    { id: 'room_2', name: 'Test Boss Room', type: 'boss', rarity: 'Rare', cost: 100, stats: { attack: 20, hp: 50 } },
    { id: 'room_3', name: 'Healing Fountain', type: 'healing', rarity: 'Uncommon', cost: null, stats: { hp: 20 } },
    { id: 'room_4', name: 'Trap Room', type: 'trap', rarity: 'Common', cost: null, stats: { attack: 15 } },
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
        expect(engine.gameState?.availableDeck.length).toBe(0);
        expect(engine.gameState?.hand).toHaveLength(4);
        expect(engine.gameState?.roomHand).toHaveLength(3);
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
        expect(engine.gameState?.hand.length).toBe(2);
        expect(engine.gameState?.hand).not.toEqual(initialHand);

        vi.useRealTimers();
    });

    it('should run an encounter and update adventurer state', async () => {
        vi.useFakeTimers();
        vi.spyOn(Math, 'random').mockReturnValue(0.1); // Ensure enemy hits
        engine.gameState!.adventurer.traits = { offense: 10, risk: 10, expertise: 10 }; // Defensive
        engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
        const initialHp = engine.gameState!.adventurer.hp;
        const room = mockRooms.find(r => r.type === 'enemy');

        engine.runEncounter([room!]);
        await vi.runAllTimersAsync();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_LOOT');
        expect(engine.gameState?.adventurer.hp).toBeLessThan(initialHp);
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
            vi.spyOn(constants, 'INITIAL_UNLOCKED_DECK', 'get').mockReturnValue(['loot_1', 'loot_2', 'loot_3']);
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
            vi.spyOn(constants, 'INITIAL_UNLOCKED_DECK', 'get').mockReturnValue(['loot_1', 'loot_2', 'loot_3']);
            engine.metaManager.checkForUnlocks(10); // Unlock workshop
            engine.startNewGame();

            engine.gameState!.run = 1;
            engine.gameState!.designer.balancePoints = 100;
            engine.enterWorkshop();
            const itemToBuy = engine.gameState!.shopItems[0];

            engine.purchaseItem(itemToBuy.id);

            expect(engine.gameState?.designer.balancePoints).toBe(100 - (itemToBuy.cost || 0));
            if (itemToBuy.type === 'Weapon' || itemToBuy.type === 'Armor' || itemToBuy.type === 'Potion') {
                expect(engine.gameState?.unlockedDeck).toContain(itemToBuy.id);
            } else {
                expect(engine.gameState?.unlockedRoomDeck).toContain(itemToBuy.id);
            }
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
});
