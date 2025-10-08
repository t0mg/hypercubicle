import type { GameState } from './types';
import type { AdventurerStatus } from './components/AdventurerStatus';
import type { ChoicePanel } from './components/ChoicePanel';
import type { LogPanel } from './components/LogPanel';
import type { Workshop } from './components/Workshop';
import type { GameStats } from './components/GameStats';
import { t } from './text';
import { GameEngine } from './game/engine';
import { isLootSelectionImpossible, isRoomSelectionImpossible } from './game/utils';
import { RunEndedScreen } from './components/RunEndedScreen';
import { ConfirmModal } from './components/ConfirmModal';


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
    let adventurerStatus: AdventurerStatus | null = appElement.querySelector('adventurer-status');
    let logPanel: LogPanel | null = appElement.querySelector('log-panel');
    let gameStats: GameStats | null = appElement.querySelector('game-stats');

    if (!adventurerStatus) {
        appElement.innerHTML = ''; // Clear only on initial render

        const mainContainer = document.createElement('div');
        mainContainer.className = 'w-full p-4 md:p-6 lg:p-8';
        appElement.appendChild(mainContainer);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6';
        mainContainer.appendChild(gridContainer);

        // --- Left Column Window ---
        const leftColumnWrapper = document.createElement('div');
        leftColumnWrapper.className = 'lg:col-span-1 space-y-6';
        gridContainer.appendChild(leftColumnWrapper);

        const leftWindow = document.createElement('div');
        leftWindow.className = 'window';
        leftColumnWrapper.appendChild(leftWindow);
        const leftTitle = document.createElement('div');
        leftTitle.className = 'title-bar';
        const leftTitleText = document.createElement('div');
        leftTitleText.className = 'title-bar-text';
        leftTitleText.textContent = t('game_title');
        leftTitle.appendChild(leftTitleText);
        const leftTitleControls = document.createElement('div');
        leftTitleControls.className = 'title-bar-controls';
        const closeButton = document.createElement('button');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.id = 'quit-game-btn';
        leftTitleControls.appendChild(closeButton);
        leftTitle.appendChild(leftTitleControls);
        leftWindow.appendChild(leftTitle);

        const leftBody = document.createElement('div');
        leftBody.className = 'window-body space-y-4';
        leftWindow.appendChild(leftBody);

        gameStats = document.createElement('game-stats') as GameStats;
        leftBody.appendChild(gameStats);
        const feedbackPanel = document.createElement('feedback-panel');
        leftBody.appendChild(feedbackPanel);
        logPanel = document.createElement('log-panel') as LogPanel;
        leftBody.appendChild(logPanel);

        // --- Right Column Window ---
        const rightColumnWrapper = document.createElement('div');
        rightColumnWrapper.className = 'lg:col-span-2 space-y-6';
        gridContainer.appendChild(rightColumnWrapper);

        const rightWindow = document.createElement('div');
        rightWindow.className = 'window';
        rightColumnWrapper.appendChild(rightWindow);
        const rightTitle = document.createElement('div');
        rightTitle.className = 'title-bar';
        const rightTitleText = document.createElement('div');
        rightTitleText.className = 'title-bar-text';
        rightTitleText.textContent = t('adventurer_status.title', { count: engine.metaManager.metaState.adventurers });
        rightTitle.appendChild(rightTitleText);
        rightWindow.appendChild(rightTitle);
        const rightBody = document.createElement('div');
        rightBody.className = 'window-body';
        rightWindow.appendChild(rightBody);

        adventurerStatus = document.createElement('adventurer-status') as AdventurerStatus;
        rightBody.appendChild(adventurerStatus);

        // --- Bottom Panel Window ---
        const gamePhaseWrapper = document.createElement('div');
        gamePhaseWrapper.className = 'lg:col-span-3';
        gridContainer.appendChild(gamePhaseWrapper);

        const gamePhaseWindow = document.createElement('div');
        gamePhaseWindow.className = 'window';
        gamePhaseWrapper.appendChild(gamePhaseWindow);
        const gamePhaseTitle = document.createElement('div');
        gamePhaseTitle.className = 'title-bar';
        const gamePhaseTitleText = document.createElement('div');
        gamePhaseTitleText.id = 'game-phase-title';
        gamePhaseTitleText.className = 'title-bar-text';
        gamePhaseTitle.appendChild(gamePhaseTitleText);
        gamePhaseWindow.appendChild(gamePhaseTitle);

        const gamePhasePanel = document.createElement('div');
        gamePhasePanel.id = 'game-phase-panel';
        gamePhasePanel.className = 'window-body';
        gamePhaseWindow.appendChild(gamePhasePanel);
    }

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

    const feedbackPanel = appElement.querySelector('feedback-panel') as HTMLElement;
    const feedbackMessage = Array.isArray(state.feedback) ? state.feedback.join(' ') : state.feedback;
    feedbackPanel.setAttribute('message', feedbackMessage);

    logPanel.logger = state.logger;
    logPanel.traits = state.adventurer.traits;

    const gamePhasePanel = appElement.querySelector('#game-phase-panel') as HTMLElement;
    gamePhasePanel.innerHTML = ''; // Clear previous phase content

    const gamePhaseTitle = appElement.querySelector('#game-phase-title') as HTMLElement;

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

    appElement.querySelector('#quit-game-btn')?.addEventListener('click', async () => {
      if (await ConfirmModal.show(t('global.quit'), t('global.quit_confirm'))) {
          engine.quitGame(false); // Pass false to preserve the save file
      }
    });
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