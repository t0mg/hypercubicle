import { UnlockableFeature, UNLOCKS } from './unlocks';

export interface MetaState {
  highestRun: number;
  unlockedFeatures: UnlockableFeature[];
}

const META_STORAGE_KEY = 'rogue-steward-meta';

export class MetaManager {
  private _metaState: MetaState;

  constructor() {
    this._metaState = this._load();
  }

  public get metaState(): MetaState {
    return this._metaState;
  }

  public get acls(): Set<UnlockableFeature> {
    return new Set(this._metaState.unlockedFeatures);
  }

  public checkForUnlocks(run: number): UnlockableFeature[] {
    const newlyUnlocked: UnlockableFeature[] = [];
    for (const unlock of UNLOCKS) {
      if (run >= unlock.runThreshold && !this._metaState.unlockedFeatures.includes(unlock.feature)) {
        this._metaState.unlockedFeatures.push(unlock.feature);
        newlyUnlocked.push(unlock.feature);
      }
    }
    if (newlyUnlocked.length > 0) {
      this.save();
    }
    return newlyUnlocked;
  }

  public updateRun(run: number): void {
    if (run > this._metaState.highestRun) {
      this._metaState.highestRun = run;
      this.save();
    }
  }

  private _load(): MetaState {
    try {
      const saved = localStorage.getItem(META_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation
        if (typeof parsed.highestRun === 'number' && Array.isArray(parsed.unlockedFeatures)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load meta state:", error);
    }
    return this._defaultState();
  }

  public save(): void {
    try {
      localStorage.setItem(META_STORAGE_KEY, JSON.stringify(this._metaState));
    } catch (error) {
      console.error("Failed to save meta state:", error);
    }
  }

  public reset(): void {
    this._metaState = this._defaultState();
    this.save();
  }

  private _defaultState(): MetaState {
    return {
      highestRun: 0,
      unlockedFeatures: [],
    };
  }
}
