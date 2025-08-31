import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { Adventurer } from './adventurer';
import * as constants from './constants';

// Mock the items data
const mockItems = [
  { id: 'loot_1', name: 'Sword', type: 'Weapon', rarity: 'Common', stats: { power: 5 }, cost: null, minRun: 0 },
  { id: 'loot_2', name: 'Shield', type: 'Armor', rarity: 'Common', stats: { maxHp: 10 }, cost: null, minRun: 0 },
  { id: 'loot_3', name: 'Potion', type: 'Potion', rarity: 'Common', stats: { hp: 20 }, cost: null, minRun: 0 },
  { id: 'loot_4', name: 'Axe', type: 'Weapon', rarity: 'Uncommon', stats: { power: 10 }, cost: 50, minRun: 1 },
  { id: 'loot_5', name: 'Helmet', type: 'Armor', rarity: 'Uncommon', stats: { maxHp: 15 }, cost: 50, minRun: 1 },
];

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockItems),
  })
) as any;

describe('GameEngine', () => {
    let engine: GameEngine;

    beforeAll(async () => {
        engine = new GameEngine();
        await engine.init();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        // Reset the game state before each test
        engine.startNewGame();
    });

    it('should initialize a new game state correctly', () => {
        expect(engine.gameState).not.toBeNull();
        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_DIFFICULTY');
        expect(engine.gameState?.run).toBe(1);
        expect(engine.gameState?.room).toBe(1);
        expect(engine.gameState?.designer.balancePoints).toBe(0);
        expect(engine.gameState?.adventurer).toBeInstanceOf(Adventurer);
        expect(engine.gameState?.unlockedDeck).toHaveLength(5);
        expect(engine.gameState?.availableDeck.length).toBeGreaterThan(0);
        expect(engine.gameState?.hand).toHaveLength(9);
    });

    it('should start a new run correctly', () => {
        engine.gameState!.run = 2;
        engine.gameState!.designer.balancePoints = 100;
        const previousAdventurer = engine.gameState!.adventurer;
        engine.startNewRun();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_DIFFICULTY');
        expect(engine.gameState?.run).toBe(2); // Should not be incremented here
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
        const weaponToOffer = initialHand.find(item => item.type === 'Weapon')!;
        const armorToOffer = initialHand.find(item => item.type === 'Armor')!;
        const offerIds = [weaponToOffer.instanceId, armorToOffer.instanceId];

        engine.presentOffer(offerIds);

        await vi.advanceTimersToNextTimerAsync();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_DIFFICULTY');
        expect(engine.gameState?.feedback).toEqual(expect.objectContaining({
            key: 'game_engine.adventurer_accepts_offer'
        }));
        // With high offense, adventurer should choose the weapon
        expect(engine.gameState?.adventurer.inventory.weapon?.id).toBe(weaponToOffer.id);
        expect(engine.gameState?.hand.length).toBe(9);
        expect(engine.gameState?.hand).not.toEqual(initialHand);

        vi.useRealTimers();
    });

    it('should run an encounter and update adventurer state', async () => {
        vi.useFakeTimers();
        engine.gameState!.adventurer.traits = { offense: 10, risk: 10, expertise: 10 }; // Defensive
        engine.gameState!.phase = 'DESIGNER_CHOOSING_DIFFICULTY';
        const initialHp = engine.gameState!.adventurer.hp;
        const encounter = { enemyCount: 1, enemyPower: 5, enemyHp: 20 };

        engine.runEncounter(encounter);
        await vi.advanceTimersToNextTimerAsync();

        expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_LOOT');
        expect(engine.gameState?.adventurer.hp).toBeLessThan(initialHp);
        vi.useRealTimers();
    });

    it('should end the game if adventurer hp drops to 0', async () => {
        vi.useFakeTimers();
        engine.gameState!.adventurer.traits = { offense: 90, risk: 90, expertise: 0 }; // Risky
        engine.gameState!.phase = 'DESIGNER_CHOOSING_DIFFICULTY';
        const encounter = { enemyCount: 1, enemyPower: 1000, enemyHp: 1000 }; // A very strong enemy

        engine.runEncounter(encounter);
        await vi.advanceTimersToNextTimerAsync();

        expect(engine.gameState?.gameOver.isOver).toBe(true);
        expect(engine.gameState?.phase).toBe('RUN_OVER');
        expect(engine.gameState?.gameOver.reason).toEqual(expect.objectContaining({
            key: 'game_engine.adventurer_fell'
        }));
        vi.useRealTimers();
    });

    describe('Workshop', () => {
        beforeEach(() => {
            vi.spyOn(constants, 'INITIAL_UNLOCKED_DECK', 'get').mockReturnValue(['loot_1', 'loot_2', 'loot_3']);
            engine.startNewGame(); // Rerun with the mock
        });

        it('should transition to the SHOP phase correctly', () => {
            engine.gameState!.run = 1;
            engine.enterWorkshop();
            expect(engine.gameState?.phase).toBe('SHOP');
            expect(engine.gameState?.shopItems.length).toBeGreaterThan(0);
        });

        it('should allow purchasing an item from the shop', () => {
            engine.gameState!.run = 1;
            engine.gameState!.designer.balancePoints = 100;
            engine.enterWorkshop();
            const itemToBuy = engine.gameState!.shopItems[0];

            engine.purchaseItem(itemToBuy.id);

            expect(engine.gameState?.designer.balancePoints).toBe(100 - (itemToBuy.cost || 0));
            expect(engine.gameState?.unlockedDeck).toContain(itemToBuy.id);
            expect(engine.gameState?.shopItems).not.toContain(itemToBuy);
        });
    });
});
