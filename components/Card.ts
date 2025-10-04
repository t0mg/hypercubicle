import type { LootChoice, RoomChoice } from '../types';
import { t } from '../text';

const rarityColorMap: { [key: string]: string } = {
  Common: 'text-rarity-common',
  Uncommon: 'text-rarity-uncommon',
  Rare: 'text-rarity-rare',
};

const StatChange = (label: string, value: number, positive: boolean = true, units: number = 1) => {
  const color = positive ? 'text-green-400' : 'text-red-400';
  const sign = positive && value > 0 ? '+' : '';
  return `
        <div class="flex justify-between text-sm ${color}">
            <span ${units > 1 ? 'data-tooltip-key="multiple_units"' : ''}>${label}${units > 1 ? t('global.units') : ''}</span>
            <span class="font-mono">${sign}${value}</span>
        </div>
    `;
};

export class Card extends HTMLElement {
  private _item: LootChoice | RoomChoice | null = null;
  private _isSelected: boolean = false;
  private _isDisabled: boolean = false;
  private _isNewlyDrafted: boolean = false;
  private _stackCount: number = 1;

  set item(value: LootChoice | RoomChoice) { this._item = value; this.render(); }
  get item(): LootChoice | RoomChoice { return this._item!; }

  set stackCount(value: number) { this._stackCount = value; this.render(); }
  get stackCount(): number { return this._stackCount; }

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
        this.dispatchEvent(new CustomEvent('card-select', {
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
    const baseClasses = 'relative bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg';

    let stateClasses = '';
    if (this._isDisabled) {
      stateClasses = 'border-gray-600 opacity-50 cursor-not-allowed';
    } else if (this._isSelected) {
      stateClasses = 'border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform';
    } else {
      stateClasses = 'border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105';
    }

    let stackClasses = '';
    if (this._stackCount > 1) {
      const outlineCount = Math.min(this._stackCount - 1, 2); // Max 2 outlines for now
      if (outlineCount >= 1) stackClasses += ' stack-outline-1';
      if (outlineCount >= 2) stackClasses += ' stack-outline-2';
    }

    const animationClass = this.classList.contains('animate-newly-drafted') ? ' animate-newly-drafted' : '';
    this.className = `${baseClasses} ${stateClasses}${stackClasses}${animationClass}`;

    let itemName = this._item.name;
    let statsHtml = '';
    if ('stats' in this._item) {
      const item = this._item as LootChoice;
      const room = this._item as RoomChoice;
      switch (this._item.type.toLowerCase()) {
        case 'weapon':
        case 'potion':
        case 'armor':
        case 'buff':
          statsHtml = `
            ${item.stats.hp ? StatChange(t('global.health'), item.stats.hp) : ''}
            ${item.stats.maxHp ? StatChange(t('global.max_hp'), item.stats.maxHp) : ''}
            ${item.stats.power ? StatChange(t('global.power'), item.stats.power) : ''}
            ${item.stats.duration ? StatChange(t('global.duration'), item.stats.duration) : ''}
          `;
          break;
        case 'healing':
          statsHtml = `
            ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp) : ''}
          `;
          break;
        case 'enemy':
        case 'boss':
        case 'trap':
          statsHtml = `
            ${room.stats.attack ? StatChange(t('global.attack'), room.stats.attack, false, room.units) : ''}
            ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp, false, room.units) : ''}
          `;
          if (room.units > 1) {
            itemName = t('choice_panel.multiple_enemies_title', { name: room.name, count: room.units });
          }
          break;
      }
    }

    if (this._stackCount > 1) {
      itemName = t('choice_panel.stacked_items_title', { name: this._item.name, count: this._stackCount });
    }

    this.innerHTML = `
      <div class="flex justify-between items-baseline">
        <p class="font-label text-sm ${rarityColor}">${this._item.type}</p>
        <p class="text-xs uppercase tracking-wider ${rarityColor}">${this._item.rarity}</p>      
      </div>
      <p class=" text-2xl ${rarityColor} text-left">${itemName}</p>
      <div class="border-t border-gray-700 my-2"></div>
      <div class="space-y-1 text-brand-text text-large">
        ${statsHtml}
      </div>
    `;
  }
}

customElements.define('choice-card', Card);
