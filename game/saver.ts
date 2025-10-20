import { GameState, Storage } from '../types';
import { Adventurer } from './adventurer';
import { DungeonHistory } from './dungeonHistory';
import { Logger } from './logger';

const SAVE_GAME_KEY = 'hypercubicle-savegame';

// A version number to handle future migrations if the save format changes.
const SAVE_VERSION = '1.0.1';

interface SerializableGameState {
  version: string;
  // All properties of GameState, but with Adventurer and Logger as plain objects
  [key: string]: any;
}

export class GameSaver {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  public save(state: GameState): void {
    try {
      const serializableState = this._serialize(state);
      this.storage.setItem(SAVE_GAME_KEY, JSON.stringify(serializableState));
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  }

  public load(): GameState | null {
    try {
      const saved = this.storage.getItem(SAVE_GAME_KEY);
      if (saved) {
        const parsed: SerializableGameState = JSON.parse(saved);
        if (parsed.version !== SAVE_VERSION) {
          console.warn(`Save game version mismatch. Found ${parsed.version}, expected ${SAVE_VERSION}. Discarding save.`);
          this.clear();
          return null;
        }
        return this._deserialize(parsed);
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
      // If loading fails, clear the potentially corrupted save data.
      this.clear();
    }
    return null;
  }

  public hasSaveGame(): boolean {
    return this.storage.getItem(SAVE_GAME_KEY) !== null;
  }

  public clear(): void {
    this.storage.removeItem(SAVE_GAME_KEY);
  }

  private _serialize(state: GameState): SerializableGameState {
    const { adventurer, dungeonHistory, ...restOfState } = state;
    return {
      version: SAVE_VERSION,
      ...restOfState,
      adventurer: adventurer.toJSON(),
      logger: Logger.getInstance().toJSON(),
      dungeonHistory: dungeonHistory?.toJSON(),
    };
  }

  private _deserialize(data: SerializableGameState): GameState {
    const { adventurer: adventurerData, logger: loggerData, dungeonHistory: dungeonHistoryData, ...restOfState } = data;

    const logger = Logger.getInstance();
    logger.loadEntries(loggerData.entries);
    const adventurer = Adventurer.fromJSON(adventurerData);
    const dungeonHistory = dungeonHistoryData ? DungeonHistory.fromJSON(dungeonHistoryData) : undefined;

    // Exclude 'version' from restOfState before returning
    const { version, ...gameStateRest } = restOfState;
    return {
      ...gameStateRest,
      adventurer,
      dungeonHistory,
    } as GameState;
  }
}