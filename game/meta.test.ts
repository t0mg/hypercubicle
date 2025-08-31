import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MetaManager, MetaState } from './meta';
import { UnlockableFeature, UNLOCKS } from './unlocks';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('MetaManager', () => {
  let metaManager: MetaManager;

  beforeEach(() => {
    localStorageMock.clear();
    metaManager = new MetaManager();
  });

  it('should initialize with a default state', () => {
    expect(metaManager.metaState).toEqual({
      highestRun: 0,
      unlockedFeatures: [],
    });
  });

  it('should save and load meta state from localStorage', () => {
    const state: MetaState = {
      highestRun: 5,
      unlockedFeatures: [UnlockableFeature.WORKSHOP],
    };
    localStorageMock.setItem('rogue-steward-meta', JSON.stringify(state));

    const newMetaManager = new MetaManager();
    expect(newMetaManager.metaState).toEqual(state);
  });

  it('should reset the meta state', () => {
    metaManager.updateRun(5);
    metaManager.checkForUnlocks(2);
    metaManager.reset();

    expect(metaManager.metaState).toEqual({
      highestRun: 0,
      unlockedFeatures: [],
    });
  });

  it('should update the highest run', () => {
    metaManager.updateRun(3);
    expect(metaManager.metaState.highestRun).toBe(3);

    metaManager.updateRun(2);
    expect(metaManager.metaState.highestRun).toBe(3);

    metaManager.updateRun(5);
    expect(metaManager.metaState.highestRun).toBe(5);
  });

  it('should check for unlocks and update the meta state', () => {
    const newlyUnlocked = metaManager.checkForUnlocks(2);
    expect(newlyUnlocked).toEqual([UnlockableFeature.WORKSHOP]);
    expect(metaManager.metaState.unlockedFeatures).toEqual([UnlockableFeature.WORKSHOP]);

    const noNewUnlocks = metaManager.checkForUnlocks(2);
    expect(noNewUnlocks).toEqual([]);

    const multipleUnlocks = metaManager.checkForUnlocks(5);
    expect(multipleUnlocks).toContain(UnlockableFeature.HAND_SIZE_INCREASE);
    expect(multipleUnlocks).toContain(UnlockableFeature.BOSS_FIGHTS);
  });

  it('should return the correct acls', () => {
    metaManager.checkForUnlocks(3);
    const acls = metaManager.acls;
    expect(acls).toBeInstanceOf(Set);
    expect(acls.has(UnlockableFeature.WORKSHOP)).toBe(true);
    expect(acls.has(UnlockableFeature.HAND_SIZE_INCREASE)).toBe(true);
    expect(acls.has(UnlockableFeature.BOSS_FIGHTS)).toBe(false);
  });
});
