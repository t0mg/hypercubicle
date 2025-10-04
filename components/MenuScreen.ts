import { t } from '../text';
import { MetaManager } from '../game/meta';
import { GameEngine } from '../game/engine';
import { ConfirmModal } from './ConfirmModal';

export class MenuScreen extends HTMLElement {
  public engine: GameEngine | null = null;
  public metaManager: MetaManager | null = null;

  constructor() {
    super();
    this.addEventListener('click', async (e: Event) => {
      if (!this.engine || !this.metaManager) return;
      const target = e.target as HTMLElement;
      if (target.id === 'new-game-button') {
        const hasMetaState = this.metaManager.metaState.adventurers > 0 || this.metaManager.metaState.highestRun > 0;
        if (this.engine.hasSaveGame()) {
          if (
            await ConfirmModal.show(
              t('menu.new_game'),
              t('menu.new_game_confirm')
            )
          ) {
            this.engine.startNewGame();
          }
        } else {
          this.engine.startNewGame();
        }
      } else if (target.id === 'continue-game-button') {
        this.engine.continueGame();
      } else if (target.id === 'reset-game-button') {
        if (
          await ConfirmModal.show(
            t('menu.reset_save'),
            t('menu.reset_save_confirm')
          )
        ) {
          this.metaManager.reset();
          this.engine.quitGame(true);
          this.render();
        }
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.metaManager || !this.engine) return;
    const metaState = this.metaManager.metaState;
    const hasSave = this.engine.hasSaveGame();
    let metaInfo = '';
    if (metaState.adventurers > 1 || !!metaState.highestRun || !!metaState.unlockedFeatures.length) {
      const adventurers = metaState.adventurers || 0;
      metaInfo = `
                <p class="text-lg text-gray-400 mt-4">
                    ${t('menu.max_runs', { count: metaState.highestRun })} | ${t('menu.unlocked_features', { count: metaState.unlockedFeatures.length })} | ${t('menu.adventurer_count', { count: adventurers })}
                </p>
            `;
    }

    this.innerHTML = `
            <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${t('game_title')}</h1>
                <p class="text-2xl text-gray-300 mb-8">${t('game_subtitle')}</p>
                ${metaInfo}
                <div class="mt-8 space-y-4">
                        ${hasSave ? `
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                            ${t('menu.continue_game')}
                        </button>
                    ` : ''}
                    <button id="new-game-button" class="${!hasSave ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-600'} text-700 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                        ${t('menu.new_game')}
                    </button>
                    ${hasSave ? `
                        <button id="reset-game-button" class="bg-gray-800 hover:bg-gray-700 text-gray-400 py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                            ${t('menu.reset_save')}
                        </button>
                    ` : ''}
                </div>
                <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                    v${__APP_VERSION__} (build ${__BUILD_NUMBER__})
                </div>
            </div>
        `;
  }
}

customElements.define('menu-screen', MenuScreen);
