import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameEngine } from '../game/engine';
import { MetaManager } from '../game/meta';
import { GameSaver } from '../game/saver';
import { LocalStorage } from '../game/storage';
import { DataLoader } from '../types';
import { Adventurer } from '../game/adventurer';
import { Logger } from '../game/logger';

// Mock dependencies
vi.mock('../game/meta');
vi.mock('../game/saver');
vi.mock('../game/storage');

const mockDataLoader: DataLoader = {
  loadJson: vi.fn().mockResolvedValue({
    firstNames: ['John'],
    lastNames: ['Doe'],
  }),
};

const getInitialGameState = () => {
  const adventurer = new Adventurer({ offense: 50, resilience: 50, skill: 0 });
  const logger = Logger.getInstance();
  logger.loadEntries([]);
  return {
    phase: 'DESIGNER_CHOOSING_ROOM' as const,
    designer: { balancePoints: 100 },
    adventurer,
    unlockedDeck: [],
    availableDeck: [],
    hand: [],
    unlockedRoomDeck: ['room_enemy_1'],
    availableRoomDeck: [],
    roomHand: [{
      id: 'room_enemy_1',
      instanceId: 'r1',
      type: 'room_enemy' as const,
      rarity: 'common' as const,
      cost: 10,
      stats: { attack: 5, hp: 10 },
    }],
    handSize: 5,
    shopItems: [],
    offeredLoot: [],
    offeredRooms: [],
    feedback: '',
    logger,
    run: 1,
    room: 1,
    runEnded: { isOver: false, reason: '', success: false, decision: null },
    newlyUnlocked: [],
    shopReturnPhase: null,
  };
};

describe('GameEngine', () => {
  let storage: LocalStorage;
  let metaManager: MetaManager;
  let gameSaver: GameSaver;
  let engine: GameEngine;

  beforeEach(() => {
    storage = new LocalStorage();
    metaManager = new MetaManager(storage);
    gameSaver = new GameSaver(storage);
    engine = new GameEngine(metaManager, mockDataLoader, gameSaver);
    engine.gameState = getInitialGameState();
  });

  it('should re-emit show-encounter event when loading a game awaiting encounter result', async () => {
    // 1. Get engine into the AWAITING_ENCOUNTER_RESULT state
    engine.runEncounter([engine.gameState!.roomHand[0]]);
    expect(engine.gameState?.phase).toBe('AWAITING_ENCOUNTER_RESULT');
    expect(engine.gameState?.encounterPayload).toBeDefined();

    // 2. Simulate a reload by creating a new engine and loading from the (mocked) save
    const showEncounterListener = vi.fn();
    const newEngine = new GameEngine(metaManager, mockDataLoader, gameSaver);

    // Mock the game saver to return the state from the first engine
    (gameSaver.load as vi.Mock).mockReturnValue(engine.gameState);

    newEngine.on('show-encounter', showEncounterListener);
    newEngine.continueGame();

    // 3. Assert that the show-encounter event was fired
    expect(showEncounterListener).toHaveBeenCalledTimes(1);
    expect(showEncounterListener).toHaveBeenCalledWith(engine.gameState?.encounterPayload);
  });
});