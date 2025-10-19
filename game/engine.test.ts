import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { Adventurer } from './adventurer';
import { Logger } from './logger';
import * as constants from './constants';
import { initLocalization, t } from '../text';
import { MetaManager } from './meta';
import { RoomChoice, LootChoice, FlowState } from '../types';
import { UnlockableFeature } from './unlocks';
import * as ai from './ai';
import { rng } from './random';
import { MemoryStorage } from './storage';
import { GameSaver } from './saver';
import { DataLoaderFileSystem } from '../tools/data-loader-file-system';

const mockRooms: RoomChoice[] = [
  { id: 'room_1', instanceId: 'r1', type: 'room_enemy', rarity: 'common', cost: null, stats: { attack: 5, hp: 10, minUnits: 1, maxUnits: 1 } },
  { id: 'room_2', instanceId: 'r2', type: 'room_boss', rarity: 'rare', cost: 100, stats: { attack: 10, hp: 50 } },
  { id: 'room_3', instanceId: 'r3', type: 'room_healing', rarity: 'uncommon', cost: null, stats: { hp: 20 } },
  { id: 'room_4', instanceId: 'r4', type: 'room_trap', rarity: 'common', cost: null, stats: { attack: 15 } },
  { id: 'room_5', instanceId: 'r5', type: 'room_enemy', rarity: 'common', cost: null, units: 0, stats: { attack: 0, hp: 10 } },
];
const harmlessRoom = mockRooms.find(r => r.id === 'room_5')!;
const deadlyRoom = { ...mockRooms.find(r => r.type === 'room_trap')!, stats: { attack: 1000 } };


describe('GameEngine', () => {
  let engine: GameEngine;
  let metaManager: MetaManager;
  let storage: MemoryStorage;
  let dataLoader: DataLoaderFileSystem;
  let saver: GameSaver;

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
    saver = new GameSaver(storage);
    engine = new GameEngine(metaManager, dataLoader, saver);
    Logger.getInstance().loadEntries([]);
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
    expect(engine.gameState?.run).toBe(3);
    expect(engine.gameState?.room).toBe(1);
    expect(engine.gameState?.designer.balancePoints).toBe(100);
    expect(engine.gameState?.adventurer).not.toBe(previousAdventurer);
    expect(engine.gameState?.adventurer.hp).toBe(engine.gameState?.adventurer.maxHp);
  });

  it('should process a loot offer and update the game state', () => {
    engine.gameState!.adventurer.traits = { offense: 90, resilience: 10, skill: 10 };

    engine.gameState!.phase = 'DESIGNER_CHOOSING_LOOT';
    const initialHand = [...engine.gameState!.hand];
    const offerIds = initialHand.slice(0, 2).map(item => item.instanceId);

    engine.presentOffer(offerIds);

    expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_ROOM');
    expect(engine.gameState?.hand.length).toBe(constants.HAND_SIZE);
    expect(engine.gameState?.hand).not.toEqual(initialHand);
  });

  it('should run an encounter and update adventurer state', () => {
    engine.gameState!.adventurer.traits = { offense: 10, resilience: 10, skill: 10 };
    engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
    const initialHp = engine.gameState!.adventurer.hp;

    const damagingRoom = engine.gameState!.roomHand.find(r => r.type === 'room_enemy' || r.type === 'room_trap' || r.type === 'room_boss');
    expect(damagingRoom).toBeDefined();
    const initialRoomHand = [...engine.gameState!.roomHand];
    const offeredRooms = [damagingRoom!];

    engine.on('show-encounter', (payload) => {
      engine.continueEncounter();
    });
    engine.runEncounter(offeredRooms);

    expect(engine.gameState?.phase).toBe('DESIGNER_CHOOSING_LOOT');
    expect(engine.gameState?.adventurer.hp).toBeLessThan(initialHp);
    expect(engine.gameState?.roomHand.length).toBe(constants.HAND_SIZE);
    expect(engine.gameState?.roomHand).not.toEqual(initialRoomHand);
  });

  it('should end the game if adventurer hp drops to 0', () => {
    engine.gameState!.adventurer.traits = { offense: 90, resilience: 10, skill: 0 };
    engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
    engine.gameState!.adventurer.hp = 1;

    engine.on('show-encounter', (payload) => {
      engine.continueEncounter();
    });
    engine.runEncounter([{ ...deadlyRoom, instanceId: 'r4_1' }]);

    expect(engine.gameState?.runEnded.isOver).toBe(true);
    expect(engine.gameState?.phase).toBe('RUN_OVER');
    expect(engine.gameState?.runEnded.reason).toEqual(t('game_engine.adventurer_fell', { room: 1, run: 1 }));
  });

  it('should apply a buff immediately upon selection, decrement its duration, and preserve health percentage', () => {
    const buffItem: LootChoice = {
      id: 'buff_1', instanceId: 'b_1', type: 'item_buff', rarity: 'rare', cost: 100,
      stats: { power: 10, maxHp: -20, duration: 2 },
    };
    (engine as any)._allItems.push(buffItem);
    vi.spyOn(ai, 'getAdventurerLootChoice').mockReturnValue(buffItem);

    engine.gameState!.adventurer.hp = 80;
    const initialPower = engine.gameState!.adventurer.power;

    engine.gameState!.phase = 'DESIGNER_CHOOSING_LOOT';
    engine.gameState!.hand = [buffItem];
    engine.presentOffer([buffItem.instanceId]);

    expect(engine.gameState!.adventurer.activeBuffs).toHaveLength(1);
    expect(engine.gameState!.adventurer.power).toBe(initialPower + 10);
    expect(engine.gameState!.adventurer.maxHp).toBe(80);
    expect(engine.gameState!.adventurer.hp).toBe(64);

    engine.on('show-encounter', (payload) => {
      engine.continueEncounter();
    });

    engine.runEncounter([{ ...harmlessRoom, instanceId: 'r5_1' }]);
    expect(engine.gameState!.adventurer.activeBuffs[0].stats.duration).toBe(1);
    expect(engine.gameState!.adventurer.hp).toBe(64);

    engine.gameState!.phase = 'DESIGNER_CHOOSING_ROOM';
    engine.runEncounter([{ ...harmlessRoom, instanceId: 'r5_2' }]);
    expect(engine.gameState!.adventurer.activeBuffs).toHaveLength(0);
    expect(engine.gameState!.adventurer.power).toBe(initialPower);
    expect(engine.gameState!.adventurer.maxHp).toBe(100);
    expect(engine.gameState!.adventurer.hp).toBe(80);
  });

  describe('Workshop', () => {
    it('should transition to the SHOP phase correctly', async () => {
      metaManager.checkForUnlocks(10);
      engine.startNewGame();
      engine.gameState!.run = 1;
      engine.enterWorkshop();
      expect(engine.gameState?.phase).toBe('SHOP');
      expect(engine.gameState?.shopItems.length).toBeGreaterThan(0);
    });

    it('should allow purchasing an item from the shop', async () => {
      metaManager.checkForUnlocks(10);
      engine.startNewGame();
      engine.gameState!.run = 1;
      engine.gameState!.designer.balancePoints = 100;
      const itemToBuy: LootChoice = { id: 'buyable_item', instanceId: 'bi_1', type: 'item_weapon', rarity: 'uncommon', cost: 75, stats: { power: 15 } };
      (engine as any)._allItems.push(itemToBuy);
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
      metaManager.checkForUnlocks(10);
      engine.gameState!.run = 1;
      engine.handleEndOfRun('continue');
      expect(engine.gameState?.phase).toBe('SHOP');
    });

    it('should handle the run-decision event and transition to the menu', () => {
      engine.gameState!.run = 1;
      engine.handleEndOfRun('retire');
      expect(engine.gameState?.phase).toBe('MENU');
    });

    it('should update meta progression when a run ends', () => {
      expect(metaManager.metaState.highestRun).toBe(0);
      engine.startNewGame();
      expect(engine.gameState?.run).toBe(1);
      engine.on('show-encounter', (payload) => engine.continueEncounter());
      (engine as any)._endRun('test reason', true);
      expect(metaManager.metaState.highestRun).toBe(1);
    });
  });

  describe('Unlocks', () => {
    it('should return correct BP based on unlocks', () => {
      expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM);
      metaManager.metaState.unlockedFeatures.push(UnlockableFeature.BP_MULTIPLIER);
      expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM * 2);
      metaManager.metaState.unlockedFeatures.push(UnlockableFeature.BP_MULTIPLIER_2);
      expect((engine as any)._getBpPerRoom()).toBe(constants.BP_PER_ROOM * 4);
    });

    it('should add purchased item to top of deck with WORKSHOP_ACCESS', async () => {
      metaManager.checkForUnlocks(100);
      engine.startNewGame();
      engine.gameState!.run = 1;
      engine.gameState!.designer.balancePoints = 100;
      const itemToBuy: LootChoice = { id: 'buyable_item_2', instanceId: 'bi_2', type: 'item_weapon', rarity: 'uncommon', cost: 75, stats: { power: 15 } };
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
    engine.gameState!.adventurer.flowState = FlowState.Control;
    engine.handleEndOfRun('continue');
    engine.startNewRun();
    expect(engine.gameState!.adventurer.flowState).toBe(FlowState.Control);
  });

  it('should not attack in the same turn a potion is used', () => {
    const adventurer = engine.gameState!.adventurer;
    const potion: LootChoice = { id: 'p_1', instanceId: 'p_1', type: 'item_potion', rarity: 'common', cost: 10, stats: { hp: 50 } };
    adventurer.inventory.potions.push(potion);
    adventurer.hp = 10;
    vi.spyOn(ai, 'getAdventurerBattleChoice').mockReturnValue('use_potion');
    const { log } = (engine as any)._generateEncounterLog(adventurer, mockRooms[0]);
    const attackLog = log.find((e: any) => e.messageKey === 'info_adventurer_hit');
    expect(attackLog).toBeUndefined();
  });

  describe('_getAdventurerEndRunDecision', () => {
    it('should allow a bored adventurer to continue with a lucky roll', () => {
      const adventurer = engine.gameState!.adventurer;
      adventurer.flowState = FlowState.Boredom;
      adventurer.skill = 50;
      const rngSpy = vi.spyOn(rng, 'nextFloat').mockReturnValue(0.85);
      const decision = (engine as any)._getAdventurerEndRunDecision();
      expect(decision).toBe('continue');
      expect(rngSpy).toHaveBeenCalled();
    });
  });
});