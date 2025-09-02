import type { LootChoice } from '../types';
import { t } from '../text';

const StatChange = (label: string, value: number) => {
    const isPositive = value > 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    const sign = isPositive ? '+' : '';
    return `
        <div class="flex justify-between text-sm ${color}">
            <span>${label}</span>
            <span class="font-mono">${sign}${value}</span>
        </div>
    `;
};

const ShopItemCard = (item: LootChoice, canAfford: boolean) => {
    const rarityColorMap: { [key: string]: string } = {
        Common: 'text-rarity-common',
        Uncommon: 'text-rarity-uncommon',
        Rare: 'text-rarity-rare',
    };
    const rarityColor = rarityColorMap[item.rarity] || 'text-gray-400';

    return `
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${rarityColor}">${item.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${rarityColor}">${item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${item.stats.hp ? StatChange(t('global.health'), item.stats.hp) : ''}
                    ${item.stats.maxHp ? StatChange(t('global.max_hp'), item.stats.maxHp) : ''}
                    ${item.stats.power ? StatChange(t('global.power'), item.stats.power) : ''}
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
    private _items: LootChoice[] = [];
    private _balancePoints: number = 0;

    set items(value: LootChoice[]) { this._items = value; this.render(); }
    set balancePoints(value: number) { this._balancePoints = value; this.render(); }

    constructor() {
        super();
        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const itemId = target.dataset.itemId;
            if (itemId) {
                this.dispatchEvent(new CustomEvent('purchase-item', {
                    bubbles: true,
                    composed: true,
                    detail: { itemId }
                }));
            }
            if (target.id === 'start-run-button') {
                this.dispatchEvent(new CustomEvent('start-run', {
                    bubbles: true,
                    composed: true
                }));
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
                    ${this._items.length === 0 ? `<p class="text-center text-brand-text-muted col-span-full">${t('workshop.no_new_items')}</p>` : ''}
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
