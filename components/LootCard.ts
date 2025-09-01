import type { LootChoice } from '../types';
import { t } from '../text';

const rarityColorMap: { [key: string]: string } = {
    Common: 'text-rarity-common',
    Uncommon: 'text-rarity-uncommon',
    Rare: 'text-rarity-rare',
};

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

export class LootCard extends HTMLElement {
    private _item: LootChoice | null = null;
    private _isSelected: boolean = false;
    private _isDisabled: boolean = false;
    private _isNewlyDrafted: boolean = false;

    set item(value: LootChoice) { this._item = value; this.render(); }
    get item(): LootChoice { return this._item!; }

    set isSelected(value: boolean) { this._isSelected = value; this.render(); }
    get isSelected(): boolean { return this._isSelected; }

    set isDisabled(value: boolean) { this._isDisabled = value; this.render(); }
    get isDisabled(): boolean { return this._isDisabled; }

    set isNewlyDrafted(value: boolean) {
        if (this._isNewlyDrafted === value) return;
        this._isNewlyDrafted = value;
        if (this._isNewlyDrafted) {
            this.classList.add('animate-newly-drafted');
        }
    }
    get isNewlyDrafted(): boolean { return this._isNewlyDrafted; }

    constructor() {
        super();
        this.addEventListener('click', () => {
            if (!this._isDisabled && this._item) {
                this.dispatchEvent(new CustomEvent('loot-card-select', {
                    bubbles: true,
                    composed: true,
                    detail: { instanceId: this._item.instanceId }
                }));
            }
        });

        this.addEventListener('animationend', (e: AnimationEvent) => {
            if (e.animationName === 'newly-drafted-animation') {
                this.classList.remove('animate-newly-drafted');
            }
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._item) return;

        const rarityColor = rarityColorMap[this._item.rarity] || 'text-gray-400';
        const baseClasses = 'bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg';

        let stateClasses = '';
        if (this._isDisabled) {
            stateClasses = 'border-gray-600 opacity-50 cursor-not-allowed';
        } else if (this._isSelected) {
            stateClasses = 'border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform';
        } else {
            stateClasses = 'border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105';
        }

        const animationClass = this.classList.contains('animate-newly-drafted') ? ' animate-newly-drafted' : '';
        this.className = `${baseClasses} ${stateClasses}${animationClass}`;

        this.innerHTML = `
            <div>
                <div class="flex justify-between items-baseline">
                    <p class=" text-2xl ${rarityColor}">${this._item.name}</p>
                    <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${rarityColor}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text text-large">
                    ${this._item.stats.hp ? StatChange(t('global.health'), this._item.stats.hp) : ''}
                    ${this._item.stats.maxHp ? StatChange(t('global.max_hp'), this._item.stats.maxHp) : ''}
                    ${this._item.stats.power ? StatChange(t('global.power'), this._item.stats.power) : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('loot-card', LootCard);
