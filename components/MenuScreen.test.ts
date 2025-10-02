import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { MenuScreen } from './MenuScreen';
import { GameEngine } from '../game/engine';
import { MetaManager } from '../game/meta';
import { GameSaver } from '../game/saver';
import { MemoryStorage } from '../game/storage';
import { DataLoaderFileSystem } from '../tools/data-loader-file-system';
import { initLocalization, t } from '../text';
import { GameState } from '../types';

describe('MenuScreen', () => {
  let menuScreen: MenuScreen;
  let engine: GameEngine;
  let metaManager: MetaManager;
  let storage: MemoryStorage;
  let saver: GameSaver;
  let dataLoader: DataLoaderFileSystem;

  beforeAll(async () => {
    dataLoader = new DataLoaderFileSystem();
    await initLocalization(dataLoader);
  });

  beforeEach(async () => {
    storage = new MemoryStorage();
    metaManager = new MetaManager(storage);
    saver = new GameSaver(storage);
    engine = new GameEngine(metaManager, dataLoader, saver);
    await engine.init();

    menuScreen = new MenuScreen();
    document.body.appendChild(menuScreen);
  });

  it('should display meta info when a save game exists, even if adventurer count is 0', () => {
    // 1. Setup a state where a save exists but meta adventurers are 0
    storage.setItem('rogue-steward-meta', JSON.stringify({ highestRun: 5, unlockedFeatures: [], adventurers: 0 }));
    storage.setItem('rogue-steward-savegame', JSON.stringify({ version: '1.0.0', phase: 'DESIGNER_CHOOSING_ROOM', run: 5 }));

    // 2. Re-initialize managers to load the stored state
    const newMetaManager = new MetaManager(storage);
    const newSaver = new GameSaver(storage);
    const newEngine = new GameEngine(newMetaManager, dataLoader, newSaver);

    // 3. Connect the engine to the component and render
    menuScreen.engine = newEngine;
    menuScreen.metaManager = newMetaManager;
    menuScreen.render();

    // 4. Assertions
    const metaInfo = menuScreen.querySelector('p.text-lg');
    expect(metaInfo).not.toBeNull();
    expect(metaInfo?.textContent).toContain(t('menu.max_runs', { count: 5 }));

    const continueButton = menuScreen.querySelector('#continue-game-button');
    expect(continueButton).not.toBeNull();
  });
});