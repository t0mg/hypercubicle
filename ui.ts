import type { GameState } from './types';
import type { AdventurerStatus } from './components/AdventurerStatus';
import type { LootChoicePanel } from './components/LootChoicePanel';
import type { BattlePanel } from './components/BattlePanel';
import type { LogPanel } from './components/LogPanel';
import type { Workshop } from './components/Workshop';
import { t } from './text';
import { GameEngine } from './game/engine';

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

const renderGamePhasePanel = (state: GameState) => {
    switch (state.phase) {
        case 'DESIGNER_CHOOSING_LOOT':
            return `<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>`;
        case 'DESIGNER_CHOOSING_DIFFICULTY':
            return `<div class="lg:col-span-3"><battle-panel></battle-panel></div>`;
        case 'AWAITING_ADVENTURER_CHOICE':
        case 'AWAITING_ENCOUNTER_FEEDBACK':
            return `<div class="lg:col-span-3"><loading-indicator text="${getLoadingText(state)}"></loading-indicator></div>`;
        default:
            return `<div class="lg:col-span-3"><div>${t('main.unhandled_game_phase', { phase: state.phase })}</div></div>`;
    }
}

import { MenuScreen } from './components/MenuScreen';

export const render = (appElement: HTMLElement, state: GameState | null, engine: GameEngine) => {
    if (!state) {
        appElement.innerHTML = `<div>${t('global.loading')}</div>`;
        return;
    }

    if (state.phase === 'MENU') {
        appElement.innerHTML = `<menu-screen></menu-screen>`;
        return;
    }

    if (state.phase === 'SHOP') {
        appElement.innerHTML = `<workshop-screen></workshop-screen>`;
        const workshopEl = document.querySelector('workshop-screen') as Workshop;
        if (workshopEl) {
            workshopEl.items = state.shopItems;
            workshopEl.balancePoints = state.designer.balancePoints;
        }
        return;
    }

        const runEndedHtml = state.runEnded.isOver
        ? `<run-ended-screen
                final-bp="${state.designer.balancePoints}"
                reason="${state.runEnded.reason}"
                run="${state.run}"
                ${engine.isWorkshopUnlocked() ? 'workshop-unlocked' : ''}
            ></run-ended-screen>`
        : '';

    appElement.innerHTML = `
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${runEndedHtml}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <log-panel></log-panel>
                    <game-stats
                        balance-points="${state.designer.balancePoints}"
                        run="${state.run}"
                        room="${state.room}"
                        deck-size="${state.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${Array.isArray(state.feedback) ? state.feedback.join(' ') : state.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${renderGamePhasePanel(state)}
            </div>
        </div>
    `;

    if (state.runEnded.isOver) {
        const runEndedEl = document.querySelector('run-ended-screen') as import('./components/RunEndedScreen').RunEndedScreen;
        if (runEndedEl) {
            runEndedEl.newlyUnlocked = state.newlyUnlocked;
            runEndedEl.setDecision(engine.getAdventurerEndRunDecision());
        }
    }

    const adventurerStatusEl = document.querySelector('adventurer-status') as AdventurerStatus;
    if (adventurerStatusEl) {
        adventurerStatusEl.adventurer = state.adventurer;
    }

    const lootChoicePanelEl = document.querySelector('loot-choice-panel') as LootChoicePanel;
    if (lootChoicePanelEl) {
        lootChoicePanelEl.choices = state.hand;
        lootChoicePanelEl.disabled = false; // Or determine from state
    }


    const logPanelEl = document.querySelector('log-panel') as LogPanel;
    if (logPanelEl) {
        logPanelEl.logger = state.logger;
        logPanelEl.traits = state.adventurer.traits;
    }
};
