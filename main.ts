import './index.css';
import { GameEngine } from './game/engine';
import { initLocalization, t } from './text';
import { render } from './ui';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error("Could not find app element to mount to");
}

const engine = new GameEngine();
engine.on('state-change', (newState) => {
  if (engine.isLoading) {
    appElement.innerHTML = `<div>${t('global.loading_game_data')}</div>`;
    return;
  }
  if (engine.error) {
    appElement.innerHTML = `
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl font-bold text-brand-secondary mb-4">${t('global.an_error_occurred')}</h2>
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
  const { encounter } = (e as CustomEvent).detail;
  engine.runEncounter(encounter);
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

async function main() {
  await initLocalization();
  await engine.init();

  // Initial render for loading state
  appElement.innerHTML = `<div>${t('global.initializing')}</div>`;

  engine.startNewGame();
}

main();
