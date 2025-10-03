import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RunEndedScreen } from './RunEndedScreen';
import { GameEngine } from '../game/engine';
import { MetaManager } from '../game/meta';
import { GameSaver } from '../game/saver';
import { MemoryStorage } from '../game/storage';
import { DataLoaderFileSystem } from '../tools/data-loader-file-system';
import { initLocalization, t } from '../text';
import { UnlockableFeature, UNLOCKS } from '../game/unlocks';
import * as InfoModalModule from './InfoModal';

// Mock the InfoModal
vi.mock('./InfoModal', () => ({
  InfoModal: {
    showInfo: vi.fn().mockResolvedValue(undefined),
  }
}));

describe('RunEndedScreen', () => {
  let runEndedScreen: RunEndedScreen;
  let engine: GameEngine;
  let metaManager: MetaManager;
  let storage: MemoryStorage;
  let saver: GameSaver;
  let dataLoader: DataLoaderFileSystem;

  beforeEach(async () => {
    await initLocalization(new DataLoaderFileSystem());
    storage = new MemoryStorage();
    metaManager = new MetaManager(storage);
    saver = new GameSaver(storage);
    dataLoader = new DataLoaderFileSystem();
    engine = new GameEngine(metaManager, dataLoader, saver);
    await engine.init();

    runEndedScreen = new RunEndedScreen();
    document.body.appendChild(runEndedScreen);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should display the info modal when a new feature is unlocked', async () => {
    const showInfoSpy = vi.spyOn(InfoModalModule.InfoModal, 'showInfo');
    const workshopUnlock = UNLOCKS.find(u => u.feature === UnlockableFeature.WORKSHOP)!;

    // Initialize with a newly unlocked feature
    runEndedScreen.initialize('continue', [UnlockableFeature.WORKSHOP], engine);

    // Allow the async renderUnlock to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assert that InfoModal.showInfo was called
    expect(showInfoSpy).toHaveBeenCalled();

    const callArgs = showInfoSpy.mock.calls[0];
    const expectedTitle = t('unlocks.title');
    const expectedContentTitle = workshopUnlock.title();
    const expectedContentDescription = workshopUnlock.description();

    expect(callArgs[0]).toBe(expectedTitle);
    expect(callArgs[1]).toContain(expectedContentTitle);
    expect(callArgs[1]).toContain(expectedContentDescription);
  });
});