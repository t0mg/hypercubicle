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

  it('should show a reset button and confirmation modal, then reset state', async () => {
    // 1. Setup a state where a save exists
    storage.setItem('rogue-steward-meta', JSON.stringify({ highestRun: 5, unlockedFeatures: ['test-feature'], adventurers: 2 }));
    storage.setItem('rogue-steward-savegame', JSON.stringify({ version: '1.0.0', phase: 'DESIGNER_CHOOSING_ROOM', run: 5 }));

    // 2. Re-initialize managers to load the stored state
    const newMetaManager = new MetaManager(storage);
    const newSaver = new GameSaver(storage);
    const newEngine = new GameEngine(newMetaManager, dataLoader, newSaver);
    await newEngine.init(); // important to load items

    // 3. Connect the engine to the component and render
    menuScreen.engine = newEngine;
    menuScreen.metaManager = newMetaManager;
    menuScreen.render();

    // 4. Assert reset button is visible
    const resetButton = menuScreen.querySelector<HTMLButtonElement>('#reset-game-button');
    expect(resetButton).not.toBeNull();

    // 5. Click the reset button
    resetButton?.click();

    // Wait for modal to appear
    await new Promise(resolve => setTimeout(resolve, 0));

    // 6. Assert that the confirmation modal is shown
    const modal = document.body.querySelector('.info-modal-overlay');
    expect(modal).not.toBeNull();
    expect(modal?.textContent).toContain(t('menu.reset_save_confirm'));

    // 7. Find and click the confirm button in the modal
    const confirmButton = modal?.querySelector<HTMLButtonElement>('button.bg-brand-primary');
    expect(confirmButton).not.toBeNull();
    confirmButton?.click();

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // 8. Assert that the state has been reset
    expect(newSaver.hasSaveGame()).toBe(false);

    const finalMeta = newMetaManager.metaState;
    expect(finalMeta.highestRun).toBe(0);
    expect(finalMeta.unlockedFeatures.length).toBe(0);
    expect(finalMeta.adventurers).toBe(0);
    expect(newEngine.gameState?.phase).toBe('MENU');
  });
});