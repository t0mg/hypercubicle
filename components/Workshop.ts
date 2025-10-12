import type { LootChoice, RoomChoice } from '../types';
import { t } from '../text';
import { GameEngine } from '../game/engine';

const StatChange = (label: string, value: number, positive: boolean = true) => {
  const color = positive ? 'text-green-400' : 'text-red-400';
  const sign = positive ? '+' : '';
  return `
        <div class="flex justify-between text-sm ${color}">
            <span>${label}</span>
            <span class="font-mono">${sign}${value}</span>
        </div>
    `;
};

const StatRange = (label: string, min: number, max: number) => {
  return `
        <div class="flex justify-between text-sm text-gray-400">
            <span>${label}</span>
            <span class="font-mono">${min}-${max}</span>
        </div>
    `;
}

const ShopItemCard = (item: LootChoice | RoomChoice, canAfford: boolean) => {
  const rarityColorMap: { [key: string]: string } = {
    Common: 'text-rarity-common',
    Uncommon: 'text-rarity-uncommon',
    Rare: 'text-rarity-rare',
  };
  const rarityColor = rarityColorMap[item.rarity] || 'text-gray-400';

  let statsHtml = '';
  if ('stats' in item) {
    if (item.type === 'item_weapon' || item.type === 'item_armor' || item.type === 'item_potion') {
      const loot = item as LootChoice;
      statsHtml = `
                ${loot.stats.hp ? StatChange(t('global.health'), loot.stats.hp) : ''}
                ${loot.stats.maxHp ? StatChange(t('global.max_hp'), loot.stats.maxHp) : ''}
                ${loot.stats.power ? StatChange(t('global.power'), loot.stats.power, (loot.stats.power || 0) > 0) : ''}
            `;
    } else {
      const room = item as RoomChoice;
      switch (room.type) {
        case 'room_enemy':
          statsHtml = `
                        ${room.stats.attack ? StatChange(t('global.attack'), room.stats.attack, false) : ''}
                        ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp, false) : ''}
                        ${room.stats.minUnits && room.stats.maxUnits ? StatRange(t('global.units'), room.stats.minUnits, room.stats.maxUnits) : ''}
                    `;
          break;
        case 'room_boss':
          statsHtml = `
                        ${room.stats.attack ? StatChange(t('global.attack'), room.stats.attack, false) : ''}
                        ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp, false) : ''}
                    `;
          break;
        case 'room_healing':
          statsHtml = `
                        ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp) : ''}
                    `;
          break;
        case 'room_trap':
          statsHtml = `
                        ${room.stats.attack ? StatChange(t('global.attack'), room.stats.attack, false) : ''}
                    `;
          break;
      }
    }
  }

  return `
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${rarityColor}">${t('items_and_rooms.' + item.id)}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${rarityColor}">${item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${statsHtml}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${item.id}"
                    ${!canAfford ? 'disabled' : ''}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${t('global.buy')} (${item.cost} ${t('global.bp')})
                </button>
            </div>
        </div>
    `;
};

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

  render() {
    const itemCardsHtml = this._items.map(item =>
      ShopItemCard(item, this._balancePoints >= (item.cost || 0))
    ).join('');

    this.innerHTML = `
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-label text-white">${t('workshop.title')}</h1>
                    <p class="text-brand-text-muted">${t('workshop.description')}</p>
                    <p class="mt-4 text-2xl">
                        ${t('workshop.balance_points')}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${itemCardsHtml}
                    ${this._items.length === 0 ? `<p class="text-center text-brand--muted col-span-full">${t('workshop.no_new_items')}</p>` : ''}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 pixel-corners text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${t('workshop.begin_next_run')}
                    </button>
                </div>
            </div>
        `;
  }
}

customElements.define('workshop-screen', Workshop);
