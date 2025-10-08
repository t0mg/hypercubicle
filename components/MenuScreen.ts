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
    if (hasSave) {
      const adventurers = metaState.adventurers || 0;
      metaInfo = `
        <fieldset class="mt-4 text-center">
          <legend>Progress</legend>
          <p>
            ${t('menu.max_runs', { count: metaState.highestRun })} | ${t('menu.unlocked_features', { count: metaState.unlockedFeatures.length })} | ${t('menu.adventurer_count', { count: adventurers })}
          </p>
        </fieldset>
      `;
    }

    this.innerHTML = `
      <div class="flex items-center justify-center p-4" style="height: 100vh;">
        <div class="window" style="width: 400px;">
          <div class="title-bar">
            <div class="title-bar-text">${t('game_title')}</div>
          </div>
          <div class="window-body">
            <p class="text-center text-xl mb-4">${t('game_subtitle')}</p>

            ${metaInfo}

            <div class="mt-4 space-y-2 flex flex-col items-center">
              ${hasSave ? `
                <button id="continue-game-button" style="width: 250px;">
                  ${t('menu.continue_game')}
                </button>
              ` : ''}
              <button id="new-game-button" style="width: 250px;">
                ${t('menu.new_game')}
              </button>
              ${hasSave ? `
                <button id="reset-game-button" style="width: 250px;">
                  ${t('menu.reset_save')}
                </button>
              ` : ''}
            </div>
          </div>
          <div class="status-bar">
            <p class="status-bar-field">v${__APP_VERSION__}</p>
            <p class="status-bar-field">build ${__BUILD_NUMBER__}</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('menu-screen', MenuScreen);
