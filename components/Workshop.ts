import type { LootChoice, RoomChoice } from '../types';
import { t } from '../text';
import { GameEngine } from '../game/engine';
import './Card';

export class Workshop extends HTMLElement {
  private _items: (LootChoice | RoomChoice)[] = [];
  private _balancePoints: number = 0;
  public engine: GameEngine | null = null;

  set items(value: (LootChoice | RoomChoice)[]) { this._items = value; this.render(); }
  set balancePoints(value: number) { this._balancePoints = value; this.render(); }

  constructor() {
    super();
    this.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const itemId = target.dataset.itemId;
      if (itemId && this.engine) {
        this.engine.purchaseItem(itemId);
      }
      if (target.id === 'start-run-button' && this.engine) {
        this.engine.startNewRun();
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    this.innerHTML = `
      <div class="window" style="max-w-800">
        <div class="title-bar">
          <div class="title-bar-text">${t('workshop.title')}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-brand-text-muted">${t('workshop.description')}</p>
          <p class="text-center mt-4 text-2xl">
            ${t('workshop.balance_points')}<span class="text-amber-400">${this._balancePoints}</span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8" id="item-cards">
            ${this._items.length === 0 ? `<p class="text-center text-brand--muted col-span-full">${t('workshop.no_new_items')}</p>` : ''}
          </div>

          <div class="text-center">
            <button id="start-run-button">
              ${t('workshop.begin_next_run')}
            </button>
          </div>
        </div>
      </div>
    `;

    const itemCardsContainer = this.querySelector('#item-cards');
    if (itemCardsContainer) {
      itemCardsContainer.innerHTML = '';
      for (const item of this._items) {
        const card = document.createElement('choice-card');
        card.item = item;
        card.purchaseInfo = {
          cost: item.cost || 0,
          canAfford: this._balancePoints >= (item.cost || 0),
        };
        itemCardsContainer.appendChild(card);
      }
    }
  }
}

customElements.define('workshop-screen', Workshop);
