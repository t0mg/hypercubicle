import './index.css';
import { GameEngine } from './game/engine';
import { initLocalization, t } from './text';
import { render } from './rendering';
import { MetaManager } from './game/meta';
import { LocalStorage } from './game/storage';
import { DataLoaderFetch } from './game/data-loader-fetch';

// Import all web components to register them
import './components/AdventurerStatus.ts';
import './components/FeedbackPanel.ts';
import './components/RunEndedScreen.ts';
import './components/GameStats.ts';
import './components/LoadingIndicator.ts';
import './components/LogPanel.ts';
import './components/Card.ts';
import './components/ChoicePanel.ts';
import './components/Workshop.ts';
import './components/MenuScreen.ts';
import './components/TooltipBox.ts';

import { tooltipManager } from './tooltip';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error("Could not find app element to mount to");
}

const storage = new LocalStorage();
const metaManager = new MetaManager(storage);
const dataLoader = new DataLoaderFetch();
const engine = new GameEngine(metaManager, dataLoader);

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

async function main() {
  await initLocalization(dataLoader);
  await engine.init();

  // Initial render for loading state
  appElement.innerHTML = `<div>${t('global.initializing')}</div>`;

  // Initialize tooltip listeners
  document.body.addEventListener('mouseover', (e) => tooltipManager.handleMouseEnter(e));
  document.body.addEventListener('mouseout', () => tooltipManager.handleMouseLeave());
  document.body.addEventListener('touchstart', (e) => tooltipManager.handleTouchStart(e));
  document.body.addEventListener('touchend', () => tooltipManager.handleTouchEnd());


  engine.showMenu();
}

main();
