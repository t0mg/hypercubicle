import { t } from '../text';
import { MetaManager } from '../game/meta';

export class MenuScreen extends HTMLElement {
  private metaManager: MetaManager;

  constructor() {
    super();
    this.metaManager = new MetaManager();
    this.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === 'new-game-button') {
        if (this.metaManager.metaState.highestRun > 0) {
          if (confirm(t('menu.new_game_confirm'))) {
            this._dispatch('reset-game');
          }
        } else {
          this._dispatch('start-game');
        }
      } else if (target.id === 'continue-game-button') {
        this._dispatch('continue-game');
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  private _dispatch(eventName: string) {
    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
  }

  render() {
    const metaState = this.metaManager.metaState;
    const hasSave = metaState.highestRun > 0;

    let metaInfo = '';
    if (hasSave) {
      const adventurers = metaState.adventurers || 1;
      metaInfo = `
                <p class="text-lg text-gray-400 mt-4">
                    ${t('menu.adventurer_count', { count: adventurers })} | ${t('menu.max_runs', { count: metaState.highestRun })} | ${t('menu.unlocked_features', { count: metaState.unlockedFeatures.length })}
                </p>
            `;
    }

    this.innerHTML = `
            <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${t('game_title')}</h1>
                <p class="text-2xl text-gray-300 mb-8">${t('game_subtitle')}</p>
                ${metaInfo}
                <div class="mt-8 space-y-4">
                        ${hasSave ? `
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                            ${t('menu.continue_game')}
                        </button>
                    ` : ''}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                        ${t('menu.new_game')}
                    </button>
                </div>
            </div>
        `;
  }
}

customElements.define('menu-screen', MenuScreen);