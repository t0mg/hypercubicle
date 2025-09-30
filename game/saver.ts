import { GameState, Storage } from '../types';
import { Adventurer } from './adventurer';
import { Logger } from './logger';

const SAVE_GAME_KEY = 'rogue-steward-savegame';

// A version number to handle future migrations if the save format changes.
const SAVE_VERSION = '1.0.0';

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
    this.storage.setItem(SAVE_GAME_KEY, ''); // Use setItem with empty string to effectively clear it
  }

  private _serialize(state: GameState): SerializableGameState {
    const { adventurer, logger, ...restOfState } = state;
    return {
      version: SAVE_VERSION,
      ...restOfState,
      adventurer: adventurer.toJSON(), // Will need to add toJSON() to Adventurer
      logger: logger.toJSON(),         // Will need to add toJSON() to Logger
    };
  }

  private _deserialize(data: SerializableGameState): GameState {
    const { adventurer: adventurerData, logger: loggerData, ...restOfState } = data;

    const logger = Logger.fromJSON(loggerData); // Need a static fromJSON method
    const adventurer = Adventurer.fromJSON(adventurerData, logger); // Need a static fromJSON method

    return {
      ...restOfState,
      adventurer,
      logger,
    } as GameState;
  }
}