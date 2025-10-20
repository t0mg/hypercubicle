import { t } from '../text';
import { GameEngine } from '../game/engine';
import { ConfirmModal } from './ConfirmModal';
import { InfoModal } from './InfoModal';
import { DungeonChart } from './DungeonChart';

export class GameStats extends HTMLElement {
  private _balancePoints: number | null = null;
  private _run: number = 0;
  private _room: number = 0;
  private _deckSize: number = 0;
  private _roomDeckSize: number = 0;
  public engine?: GameEngine;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['balance-points', 'run', 'room', 'deck-size', 'room-deck-size'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'balance-points':
        this._balancePoints = Number(newValue);
        break;
      case 'run':
        this._run = Number(newValue);
        break;
      case 'room':
        this._room = Number(newValue);
        break;
      case 'deck-size':
        this._deckSize = Number(newValue);
        break;
      case 'room-deck-size':
        this._roomDeckSize = Number(newValue);
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="status-bar">

                ${this._balancePoints !== null ? `
                <p class="status-bar-field" data-tooltip-key="status_bar_balance_points">
                    <span class="text-xs">${t('global.bp')}: ${this._balancePoints}</span>
                </p>
                ` : ''}
                <p class="status-bar-field" data-tooltip-key="status_bar_current_run">
                    <span class="text-xs">${t('global.run')}: ${this._run}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_current_room">
                    <span class="text-xs">${t('global.room')}: ${this._room}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_deck_size">
                    <span class="text-xs">${t('global.deck')}: ${this._deckSize}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_room_deck_size">
                    <span class="text-xs">${t('global.rooms')}: ${this._roomDeckSize}</span>
                </p>

                ${this.engine?.isWorkshopAccessUnlocked() ? `
                    <button id="enter-workshop-btn">${t('global.workshop')}</button>
                ` : ''}

                <button id="dungeon-chart-btn">Dungeon Chart</button>
            </div>
        `;

    this.querySelector('#enter-workshop-btn')?.addEventListener('click', () => {
      this.engine?.enterWorkshop();
    });

    this.querySelector('#dungeon-chart-btn')?.addEventListener('click', async () => {
      await InfoModal.show(
        'Dungeon Chart',
        '<dungeon-chart style="width: 100%; height: 400px; display: block;"></dungeon-chart>',
        [{ text: 'Close', value: false }],
        (modalElement) => {
          const chart = modalElement.querySelector('dungeon-chart') as DungeonChart;
          if (chart) {
            chart.data = this.engine?.getDungeonChartData();
          }
        }
      );
    });
  }
}

customElements.define('game-stats', GameStats);
