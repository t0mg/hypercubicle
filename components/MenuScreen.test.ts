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
  let appElement: HTMLElement;

  beforeAll(async () => {
    dataLoader = new DataLoaderFileSystem();
    await initLocalization(dataLoader);
  });

  beforeEach(async () => {
    storage = new MemoryStorage();
    metaManager = new MetaManager(storage);
    saver = new GameSaver(storage);
    appElement = document.createElement('div');
    document.body.appendChild(appElement);
    engine = new GameEngine(metaManager, dataLoader, saver);
    await engine.init();

    menuScreen = new MenuScreen();
    appElement.appendChild(menuScreen);
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
    const metaInfo = menuScreen.querySelector('fieldset p');
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
    await newEngine.init();

    // 3. Connect the engine to the component and render
    menuScreen.engine = newEngine;
    menuScreen.metaManager = newMetaManager;
    menuScreen.render();

    // 4. Assert reset button is visible
    const resetButton = menuScreen.querySelector<HTMLButtonElement>('#reset-game-button');
    expect(resetButton).not.toBeNull();

    // 5. Click the reset button
    resetButton?.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    // 6. Assert that the confirmation modal is shown
    const modal = document.body.querySelector('[data-testid="info-modal-overlay"]');
    expect(modal).not.toBeNull();
    expect(modal?.textContent).toContain(t('menu.reset_save_confirm'));

    // 7. Find and click the confirm button in the modal
    const buttons = modal?.querySelectorAll('button');
    const confirmButton = Array.from(buttons || []).find(btn => btn.textContent === t('global.confirm'));
    expect(confirmButton).not.toBeNull();
    confirmButton?.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    // 8. Assert that the state has been reset
    expect(newSaver.hasSaveGame()).toBe(false);
    const finalMeta = newMetaManager.metaState;
    expect(finalMeta.highestRun).toBe(0);
    expect(finalMeta.unlockedFeatures.length).toBe(0);
    expect(finalMeta.adventurers).toBe(0);
  });

  it('should hide continue and reset buttons after resetting the game', async () => {
    // 1. Setup: Start a new game, which creates a save file.
    engine.startNewGame();
    expect(saver.hasSaveGame()).toBe(true);

    // 2. Render: Go back to the menu and render.
    engine.quitGame(false);
    menuScreen.engine = engine;
    menuScreen.metaManager = metaManager;
    menuScreen.render();

    // 3. Assert Initial State: Buttons should be visible.
    let continueButton = menuScreen.querySelector('#continue-game-button');
    let resetButton = menuScreen.querySelector<HTMLButtonElement>('#reset-game-button');
    expect(continueButton, 'Continue button should be visible before reset').not.toBeNull();
    expect(resetButton, 'Reset button should be visible before reset').not.toBeNull();

    // 4. Action: Click the reset button and confirm.
    resetButton?.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    const modal = document.body.querySelector('[data-testid="info-modal-overlay"]');
    const confirmButton = Array.from(modal?.querySelectorAll('button') || []).find(btn => btn.textContent === t('global.confirm'));
    confirmButton?.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    // 5. Assert Final State: Re-query for the menu screen and check that buttons are gone.
    const newMenuScreen = appElement.querySelector('menu-screen') as MenuScreen;
    continueButton = newMenuScreen.querySelector('#continue-game-button');
    resetButton = newMenuScreen.querySelector('#reset-game-button');
    expect(continueButton, 'Continue button should be hidden after reset').toBeNull();
    expect(resetButton, 'Reset button should be hidden after reset').toBeNull();
  });
});