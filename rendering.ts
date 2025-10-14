import type { GameState } from './types';
import type { AdventurerStatus } from './components/AdventurerStatus';
import type { ChoicePanel } from './components/ChoicePanel';
import type { LogPanel } from './components/LogPanel';
import type { Workshop } from './components/Workshop';
import type { GameStats } from './components/GameStats';
import { t } from './text';
import { GameEngine } from './game/engine';
import { Logger } from './game/logger';
import { isLootSelectionImpossible, isRoomSelectionImpossible } from './game/utils';
import { RunEndedScreen } from './components/RunEndedScreen';
import { ConfirmModal } from './components/ConfirmModal';
import mainGameTemplate from './main-game.html?raw';

const renderChoicePanel = (state: GameState, engine: GameEngine, type: 'item' | 'room') => {
  const choicePanel = document.createElement('choice-panel') as ChoicePanel;
  choicePanel.engine = engine;
  if (type === 'item') {
    choicePanel.choices = state.hand;
    choicePanel.deckType = 'item';
    choicePanel.offerImpossible = isLootSelectionImpossible(state);
  } else {
    choicePanel.choices = state.roomHand;
    choicePanel.deckType = 'room';
    choicePanel.roomSelectionImpossible = isRoomSelectionImpossible(state);
  }
  return choicePanel;
}

const renderMainGame = (appElement: HTMLElement, state: GameState, engine: GameEngine) => {
  // If the main game UI isn't rendered yet, render it from the template
  if (!appElement.querySelector('adventurer-status')) {
    appElement.innerHTML = mainGameTemplate;

    // Set static text content after the template is loaded
    const leftTitleText = appElement.querySelector('#game-title');
    if (leftTitleText) leftTitleText.textContent = t('game_title');

    const rightTitleText = appElement.querySelector('#adventurer-status-title');
    if (rightTitleText) rightTitleText.textContent = t('adventurer_status.title', { name: state.adventurer.firstName + " " + state.adventurer.lastName, id: engine.metaManager.metaState.adventurers });

    appElement.querySelector('#quit-game-btn')?.addEventListener('click', async () => {
      if (await ConfirmModal.show(t('global.quit'), t('global.quit_confirm'))) {
        engine.quitGame(false); // Pass false to preserve the save file
      }
    });
  }

  // Now, query for the elements and update them
  const adventurerStatus = appElement.querySelector('adventurer-status') as AdventurerStatus;
  const logPanel = appElement.querySelector('log-panel') as LogPanel;
  const gameStats = appElement.querySelector('game-stats') as GameStats;
  const feedbackPanel = appElement.querySelector('feedback-panel') as HTMLElement;
  const gamePhasePanel = appElement.querySelector('#game-phase-panel') as HTMLElement;
  const gamePhaseTitle = appElement.querySelector('#game-phase-title') as HTMLElement;

  // Update dynamic elements
  adventurerStatus.metaState = engine.metaManager.metaState;
  adventurerStatus.adventurer = state.adventurer;

  gameStats.engine = engine;
  if (engine.isWorkshopUnlocked()) {
    gameStats.setAttribute('balance-points', state.designer.balancePoints.toString());
  } else {
    gameStats.removeAttribute('balance-points');
  }
  gameStats.setAttribute('run', state.run.toString());
  gameStats.setAttribute('room', state.room.toString());
  gameStats.setAttribute('deck-size', state.availableDeck.length.toString());
  gameStats.setAttribute('room-deck-size', state.availableRoomDeck.length.toString());

  const feedbackMessage = Array.isArray(state.feedback) ? state.feedback.join(' ') : state.feedback;
  feedbackPanel.setAttribute('message', feedbackMessage);

  logPanel.logger = Logger.getInstance();;
  logPanel.traits = state.adventurer.traits;

  gamePhasePanel.innerHTML = ''; // Clear previous phase content

  switch (state.phase) {
    case 'RUN_OVER': {
      if (gamePhaseTitle) gamePhaseTitle.textContent = t('run_ended_screen.run_complete');
      const runEndedEl = document.createElement('run-ended-screen') as RunEndedScreen;
      runEndedEl.setAttribute('final-bp', state.designer.balancePoints.toString());
      runEndedEl.setAttribute('reason', state.runEnded.reason);
      runEndedEl.setAttribute('run', state.run.toString());
      if (engine.isWorkshopUnlocked()) {
        runEndedEl.setAttribute('workshop-unlocked', '');
      }
      if (state.runEnded.decision) {
        runEndedEl.initialize(state.runEnded.decision, state.newlyUnlocked, engine);
      }
      gamePhasePanel.appendChild(runEndedEl);
      break;
    }
    case 'DESIGNER_CHOOSING_LOOT':
      if (gamePhaseTitle) gamePhaseTitle.textContent = t('choice_panel.title');
      gamePhasePanel.appendChild(renderChoicePanel(state, engine, 'item'));
      break;
    case 'DESIGNER_CHOOSING_ROOM':
      if (gamePhaseTitle) gamePhaseTitle.textContent = t('choice_panel.title_room');
      gamePhasePanel.appendChild(renderChoicePanel(state, engine, 'room'));
      break;
    default:
      if (gamePhaseTitle) gamePhaseTitle.textContent = '...';
      break;
  }
};

const renderMenu = (appElement: HTMLElement, engine: GameEngine) => {
  appElement.innerHTML = '';
  const menuScreen = document.createElement('menu-screen') as import('./components/MenuScreen').MenuScreen;
  menuScreen.engine = engine;
  menuScreen.metaManager = engine.metaManager;
  appElement.appendChild(menuScreen);
};

const renderWorkshop = (appElement: HTMLElement, state: GameState, engine: GameEngine) => {
  appElement.innerHTML = '';
  const workshopEl = document.createElement('workshop-screen') as Workshop;
  workshopEl.items = state.shopItems;
  workshopEl.balancePoints = state.designer.balancePoints;
  workshopEl.engine = engine;
  appElement.appendChild(workshopEl);
};

export const render = (appElement: HTMLElement, state: GameState | null, engine: GameEngine) => {
  if (!state) {
    appElement.innerHTML = `<div>${t('global.loading')}</div>`;
    return;
  }

  switch (state.phase) {
    case 'MENU':
      renderMenu(appElement, engine);
      break;
    case 'SHOP':
      renderWorkshop(appElement, state, engine);
      break;
    default:
      renderMainGame(appElement, state, engine);
      break;
  }
};