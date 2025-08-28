import { GameEngine } from './game/engine';
import type { GameState } from './types';
import './components/GameStats.ts';
import './components/FeedbackPanel.ts';
import type { AdventurerStatus } from './components/AdventurerStatus.ts';
import type { LootChoicePanel } from './components/LootChoicePanel.ts';
import type { DebugEncounterPanel } from './components/DebugEncounterPanel.ts';
import type { DebugLog } from './components/DebugLog.ts';
import type { Workshop } from './components/Workshop.ts';
import type { GameOverScreen } from './components/GameOverScreen.ts';
import './components/AdventurerStatus.ts';
import './components/LootChoicePanel.ts';
import './components/LoadingIndicator.ts';
import './components/DebugEncounterPanel.ts';
import './components/DebugLog.ts';
import './components/GameOverScreen.ts';
import './components/Workshop.ts';

const appElement = document.getElementById('app');

if (!appElement) {
    throw new Error("Could not find app element to mount to");
}

const engine = new GameEngine();

const getLoadingText = (state: GameState) => {
    if (!state) return "Initializing...";
    switch(state.phase) {
        case 'AWAITING_ADVENTURER_CHOICE':
            return "Adventurer is considering your offer...";
        case 'AWAITING_ENCOUNTER_FEEDBACK':
            return "Adventurer is facing the encounter...";
        default:
            return "Loading...";
    }
};

const renderGamePhasePanel = (state: GameState) => {
    switch (state.phase) {
        case 'DESIGNER_CHOOSING_LOOT':
            return `<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>`;
        case 'DESIGNER_CHOOSING_DIFFICULTY':
            return `<div class="lg:col-span-3"><debug-encounter-panel></debug-encounter-panel></div>`;
        case 'AWAITING_ADVENTURER_CHOICE':
        case 'AWAITING_ENCOUNTER_FEEDBACK':
            return `<div class="lg:col-span-3"><loading-indicator text="${getLoadingText(state)}"></loading-indicator></div>`;
        default:
            return `<div class="lg:col-span-3"><div>Unhandled game phase: ${state.phase}</div></div>`;
    }
}

const render = (state: GameState | null) => {
    if (!state) {
        appElement.innerHTML = `<div>Loading...</div>`;
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

    const gameOverHtml = state.gameOver.isOver
        ? `<game-over-screen
                final-bp="${state.designer.balancePoints}"
                reason="${state.gameOver.reason}"
                run="${state.run}"
                decision="${engine.getAdventurerEndRunDecision()}"
            ></game-over-screen>`
        : '';

    appElement.innerHTML = `
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${gameOverHtml}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <debug-log></debug-log>
                    <game-stats
                        balance-points="${state.designer.balancePoints}"
                        run="${state.run}"
                        floor="${state.floor}"
                    ></game-stats>
                    <feedback-panel message="${state.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${renderGamePhasePanel(state)}
            </div>
        </div>
    `;

    const adventurerStatusEl = document.querySelector('adventurer-status') as AdventurerStatus;
    if (adventurerStatusEl) {
        adventurerStatusEl.adventurer = state.adventurer;
    }

    const lootChoicePanelEl = document.querySelector('loot-choice-panel') as LootChoicePanel;
    if (lootChoicePanelEl) {
        lootChoicePanelEl.choices = state.hand;
        lootChoicePanelEl.disabled = false; // Or determine from state
    }

    const debugEncounterPanelEl = document.querySelector('debug-encounter-panel') as DebugEncounterPanel;
    if (debugEncounterPanelEl) {
        const defaultBaseDamage = Math.max(1, 15 - Math.floor(state.adventurer.power / 4) + Math.floor(state.floor * 1.5));
        debugEncounterPanelEl.defaultBaseDamage = defaultBaseDamage;
    }

    const debugLogEl = document.querySelector('debug-log') as DebugLog;
    if (debugLogEl) {
        debugLogEl.logs = state.log;
        debugLogEl.traits = state.adventurer.traits;
    }
};

appElement.addEventListener('present-offer', (e: Event) => {
    const { ids } = (e as CustomEvent).detail;
    engine.presentOffer(ids);
});

appElement.addEventListener('run-encounter', (e: Event) => {
    const { params } = (e as CustomEvent).detail;
    engine.runDebugEncounter(params);
});

appElement.addEventListener('enter-workshop', () => {
    engine.enterWorkshop();
});

appElement.addEventListener('purchase-item', (e: Event) => {
    const { itemId } = (e as CustomEvent).detail;
    engine.purchaseItem(itemId);
});

appElement.addEventListener('start-run', () => {
    engine.startNewRun();
});

appElement.addEventListener('start-game', () => {
    engine.startNewGame();
});

engine.on('state-change', (newState) => {
    if (engine.isLoading) {
        appElement.innerHTML = `<div>Loading Game Data...</div>`;
        return;
    }
    if (engine.error) {
        appElement.innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                     <h2 class="text-2xl font-bold text-brand-secondary mb-4">An Error Occurred</h2>
                     <p class="text-brand-text">${engine.error}</p>
                </div>
            </div>
        `;
        return;
    }
    render(newState);
});

// Initial render for loading state
appElement.innerHTML = `<div>Initializing...</div>`;
