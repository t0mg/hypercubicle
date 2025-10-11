import type { LootChoice, RoomChoice, Rarity } from '../types';
import { t } from '../text';

const rarityColorMap: Record<Rarity, string> = {
  ['common']: 'text-rarity-common',
  ['uncommon']: 'text-rarity-uncommon',
  ['rare']: 'text-rarity-rare',
  ['legendary']: 'text-rarity-legendary',
};

const StatChange = (label: string, value: number, positive: boolean = true, units: number = 1) => {
  const color = positive ? 'text-green-600' : 'text-red-400';
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
  private _isSelectable: boolean = true;

  set item(value: LootChoice | RoomChoice) { this._item = value; this.render(); }
  get item(): LootChoice | RoomChoice { return this._item!; }

  set stackCount(value: number) { this._stackCount = value; this.render(); }
  get stackCount(): number { return this._stackCount; }

  set isSelectable(value: boolean) { this._isSelectable = value; this.render(); }
  get isSelectable(): boolean { return this._isSelectable; }

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
    this.addEventListener('click', (e) => {
      if (!this._isSelectable) return;
      // If the click is on the checkbox or its label, let the default action proceed.
      // Otherwise, toggle the checkbox.
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'LABEL') {
        const checkbox = this.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (checkbox && !checkbox.disabled) {
          checkbox.checked = !checkbox.checked;
          // Manually trigger the change event
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });


    this.addEventListener('change', (e) => {
      if (!this._isSelectable) return;
      const target = e.target as HTMLInputElement;
      if (target.type === 'checkbox' && !this._isDisabled && this._item) {
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
    const baseClasses = 'relative transition-all duration-200';
    const checkboxId = `card-checkbox-${this._item.instanceId}`;


    let stateClasses = '';
    if (this._isSelectable) {
      if (this._isDisabled) {
        stateClasses = 'opacity-50 cursor-not-allowed';
      } else {
        stateClasses = 'cursor-pointer';
      }
    }

    const animationClass = this.classList.contains('animate-newly-drafted') ? ' animate-newly-drafted' : '';
    this.className = `${baseClasses} ${stateClasses} ${animationClass}`;

    let itemName = this._item.name;
    let statsHtml = '';
    if ('stats' in this._item) {
      const item = this._item as LootChoice;
      const room = this._item as RoomChoice;
      switch (this._item.type) {
        case 'item_weapon':
        case 'item_potion':
        case 'item_armor':
        case 'item_buff':
          statsHtml = `
            ${item.stats.hp ? StatChange(t('global.health'), item.stats.hp, item.stats.hp > 0) : ''}
            ${item.stats.maxHp ? StatChange(t('global.max_hp'), item.stats.maxHp, item.stats.maxHp > 0) : ''}
            ${item.stats.power ? StatChange(t('global.power'), item.stats.power, item.stats.power > 0) : ''}
            ${item.stats.duration ? StatChange(t('global.duration'), item.stats.duration, true) : ''}
          `;
          break;
        case 'room_healing':
          statsHtml = `
            ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp, true) : ''}
          `;
          break;
        case 'room_enemy':
        case 'room_boss':
        case 'room_trap':
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

    const fieldsetBorderClass = this._isSelected ? 'selected' : '';

    this.innerHTML = `
      <fieldset class="font-sans ${fieldsetBorderClass} flex flex-grow items-center" ${this._isDisabled ? 'disabled' : ''}>
        <legend class="${rarityColor}">${t('card_types.' + this._item.type)} - ${t('rarity.' + this._item.rarity)}</legend>
        <div class="p-2">
            <p class="font-bold text-sm ${rarityColor}">${itemName}</p>
            <div class="mt-2">
                ${statsHtml}
            </div>
            ${this._isSelectable ? `
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${checkboxId}" ${this._isSelected ? 'checked' : ''} ${this._isDisabled ? 'disabled' : ''}>
              <label for="${checkboxId}" class="ml-2 text-sm">${t('card.select')}</label>
            </div>
            ` : ''}
        </div>
      </fieldset>
    `;
  }
}

customElements.define('choice-card', Card);