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
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="window w-full max-w-sm">
          <div class="title-bar">
            <div class="title-bar-text">${t('game_title')}</div>
          </div>
          <div class="window-body text-center">
            <p class="text-lg mb-6">${t('game_subtitle')}</p>
            <div data-testid="meta-info">${metaInfo}</div>
            <div class="mt-6 space-y-3 flex flex-col items-center">
              ${hasSave ? `
                <button id="continue-game-button" class="w-full">
                  ${t('menu.continue_game')}
                </button>
              ` : ''}
              <button id="new-game-button" class="w-full">
                ${t('menu.new_game')}
              </button>
              ${hasSave ? `
                <button id="reset-game-button" class="w-full">
                  ${t('menu.reset_save')}
                </button>
              ` : ''}
            </div>
          </div>
        </div>
        <div class="absolute bottom-2 right-2 text-xs text-white text-shadow-sm">
          v${__APP_VERSION__} (build ${__BUILD_NUMBER__})
        </div>
      </div>
    `;
  }
}

customElements.define('menu-screen', MenuScreen);
