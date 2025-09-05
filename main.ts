import './index.css';
import { GameEngine } from './game/engine';
import { initLocalization, t } from './text';
import { render } from './ui';
import { MetaManager } from './game/meta';

// Import all web components to register them
import './components/AdventurerStatus.ts';
import './components/BattlePanel.ts';
import './components/FeedbackPanel.ts';
import './components/RunEndedScreen.ts';
import './components/GameStats.ts';
import './components/LoadingIndicator.ts';
import './components/LogPanel.ts';
import './components/Card.ts';
import './components/ChoicePanel.ts';
import './components/Workshop.ts';
import './components/MenuScreen.ts';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error("Could not find app element to mount to");
}

const metaManager = new MetaManager();
const engine = new GameEngine(metaManager);

engine.on('state-change', (newState) => {
  if (engine.isLoading) {
    appElement.innerHTML = `<div>${t('global.loading_game_data')}</div>`;
    return;
  }
  if (engine.error) {
    appElement.innerHTML = `
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${t('global.an_error_occurred')}</h2>
                         <p class="text-brand-text">${engine.error}</p>
                    </div>
                </div>
            `;
    return;
  }
  render(appElement, newState, engine);
});

appElement.addEventListener('present-offer', (e: Event) => {
  const { ids } = (e as CustomEvent).detail;
  engine.presentOffer(ids);
});

appElement.addEventListener('run-encounter', (e: Event) => {
  const { rooms } = (e as CustomEvent).detail;
  engine.runEncounter(rooms);
});

appElement.addEventListener('run-decision', (e: Event) => {
  const { decision } = (e as CustomEvent).detail;
  engine.handleEndOfRun(decision);
});

appElement.addEventListener('purchase-item', (e: Event) => {
  const { itemId } = (e as CustomEvent).detail;
  engine.purchaseItem(itemId);
});

appElement.addEventListener('start-game', () => {
  engine.startNewGame();
});

appElement.addEventListener('start-run', () => {
    engine.startNewRun();
});

appElement.addEventListener('continue-game', () => {
  engine.continueGame();
});

appElement.addEventListener('reset-game', () => {
  metaManager.reset();
  engine.startNewGame();
});

async function main() {
  await initLocalization();
  await engine.init();

  // Initial render for loading state
  appElement.innerHTML = `<div>${t('global.initializing')}</div>`;

  engine.showMenu();
}

main();
