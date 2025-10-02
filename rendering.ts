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

const getLoadingText = (state: GameState) => {
    if (!state) return t('global.initializing');
    switch (state.phase) {
        case 'AWAITING_ADVENTURER_CHOICE':
            return t('main.adventurer_considering_offer');
        case 'AWAITING_ENCOUNTER_FEEDBACK':
            return t('main.adventurer_facing_encounter');
        default:
            return t('global.loading');
    }
};

const renderLoadingIndicator = (state: GameState) => {
    const loadingIndicator = document.createElement('loading-indicator');
    loadingIndicator.setAttribute('text', getLoadingText(state));
    return loadingIndicator;
}

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
    appElement.innerHTML = ''; // Clear existing content

    const mainContainer = document.createElement('div');
    mainContainer.className = 'min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center';
    appElement.appendChild(mainContainer);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6';
    mainContainer.appendChild(gridContainer);

    const leftColumn = document.createElement('div');
    leftColumn.className = 'lg:col-span-1 space-y-6';
    gridContainer.appendChild(leftColumn);

    const gameStats = document.createElement('game-stats') as GameStats;
    gameStats.engine = engine;
    if (engine.isWorkshopUnlocked()) {
        gameStats.setAttribute('balance-points', state.designer.balancePoints.toString());
    }
    gameStats.setAttribute('run', state.run.toString());
    gameStats.setAttribute('room', state.room.toString());
    gameStats.setAttribute('deck-size', state.availableDeck.length.toString());
    gameStats.setAttribute('room-deck-size', state.availableRoomDeck.length.toString());
    leftColumn.appendChild(gameStats);

    const feedbackPanel = document.createElement('feedback-panel');
    const feedbackMessage = Array.isArray(state.feedback) ? state.feedback.join(' ') : state.feedback;
    feedbackPanel.setAttribute('message', feedbackMessage);
    leftColumn.appendChild(feedbackPanel);

    const logPanel = document.createElement('log-panel') as LogPanel;
    logPanel.logger = state.logger;
    logPanel.traits = state.adventurer.traits;
    leftColumn.appendChild(logPanel);

    const rightColumn = document.createElement('div');
    rightColumn.className = 'lg:col-span-2 space-y-6';
    gridContainer.appendChild(rightColumn);

    const adventurerStatus = document.createElement('adventurer-status') as AdventurerStatus;
    adventurerStatus.metaState = engine.metaManager.metaState;
    adventurerStatus.adventurer = state.adventurer;
    rightColumn.appendChild(adventurerStatus);

    const gamePhasePanel = document.createElement('div');
    gamePhasePanel.className = 'lg:col-span-3';
    gridContainer.appendChild(gamePhasePanel);

    switch (state.phase) {
        case 'RUN_OVER': {
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
            gamePhasePanel.appendChild(renderChoicePanel(state, engine, 'item'));
            break;
        case 'DESIGNER_CHOOSING_ROOM':
            gamePhasePanel.appendChild(renderChoicePanel(state, engine, 'room'));
            break;
        case 'AWAITING_ADVENTURER_CHOICE':
        case 'AWAITING_ENCOUNTER_FEEDBACK':
            gamePhasePanel.appendChild(renderLoadingIndicator(state));
            break;
        default:
            // Don't render anything for unhandled phases, let it be blank.
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
