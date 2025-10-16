import { describe, it, expect, beforeEach } from 'vitest';
import { GameSaver } from './saver';
import { GameState, GamePhase } from '../types';
import { Adventurer } from './adventurer';
import { Logger } from './logger';
import { MemoryStorage } from './storage';

describe('GameSaver', () => {
  let storage: MemoryStorage;
  let saver: GameSaver;
  let gameState: GameState;

  beforeEach(() => {
    storage = new MemoryStorage();
    saver = new GameSaver(storage);
    Logger.getInstance().loadEntries([]);
    const adventurer = new Adventurer({ offense: 50, resilience: 50, skill: 10 });

    // Create a complex game state to test serialization
    gameState = {
      phase: 'DESIGNER_CHOOSING_LOOT' as GamePhase,
      adventurer: adventurer,
      run: 2,
      room: 5,
      designer: { balancePoints: 100 },
      unlockedDeck: ['item1', 'item2'],
      availableDeck: [{ id: 'item3', instanceId: 'i3', type: 'item_weapon', cost: null, stats: {}, rarity: 'common' }],
      hand: [{ id: 'item4', instanceId: 'i4', type: 'item_armor', cost: null, stats: {}, rarity: 'common' }],
      unlockedRoomDeck: ['room1'],
      availableRoomDeck: [{ id: 'room2', instanceId: 'r2', type: 'room_enemy', cost: null, stats: {}, rarity: 'common' }],
      roomHand: [{ id: 'room3', instanceId: 'r3', type: 'room_trap', cost: null, stats: {}, rarity: 'common' }],
      handSize: 10,
      shopItems: [],
      offeredLoot: [],
      offeredRooms: [],
      feedback: 'Initial state',
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      newlyUnlocked: [],
      shopReturnPhase: null,
    };
  });

  it('should save and load a game state correctly', () => {
    // Modify state before saving
    gameState.adventurer.hp = 80;
    gameState.adventurer.power = 15;
    Logger.getInstance().info('test_entry');
    gameState.designer.balancePoints = 150;

    saver.save(gameState);

    const loadedState = saver.load();

    expect(loadedState).not.toBeNull();
    if (!loadedState) return;

    // Verify root-level properties
    expect(loadedState.run).toBe(gameState.run);
    expect(loadedState.room).toBe(gameState.room);
    expect(loadedState.phase).toBe(gameState.phase);
    expect(loadedState.designer.balancePoints).toBe(150);

    // Verify complex properties (deep equality)
    expect(loadedState.hand).toEqual(gameState.hand);
    expect(loadedState.availableDeck).toEqual(gameState.availableDeck);

    // Verify deserialized Adventurer
    expect(loadedState.adventurer).toBeInstanceOf(Adventurer);
    expect(loadedState.adventurer.hp).toBe(80);
    expect(loadedState.adventurer.power).toBe(15);
    expect(loadedState.adventurer.traits).toEqual(gameState.adventurer.traits);

    // Verify deserialized Logger
    expect(Logger.getInstance().entries.length).toBe(1);
    expect(Logger.getInstance().entries[0].message).toBe('log_messages.test_entry');
  });

  it('should return null if no save game exists', () => {
    const loadedState = saver.load();
    expect(loadedState).toBeNull();
  });

  it('should clear the save game', () => {
    saver.save(gameState);
    expect(saver.hasSaveGame()).toBe(true);
    saver.clear();
    expect(saver.hasSaveGame()).toBe(false);
    expect(saver.load()).toBeNull();
  });

  it('should handle version mismatch by clearing the save', () => {
    // Manually save with a different version
    const oldState = { version: '0.0.1', ...gameState };
    storage.setItem('hypercubicle-savegame', JSON.stringify(oldState));

    const loadedState = saver.load();
    expect(loadedState).toBeNull();
    expect(saver.hasSaveGame()).toBe(false); // It should have cleared the invalid save
  });
});