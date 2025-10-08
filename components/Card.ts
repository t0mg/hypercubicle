import type { LootChoice, RoomChoice } from '../types';
import { t } from '../text';

// Simplified stat display without color coding to match the XP theme.
const StatChange = (label: string, value: number, units: number = 1) => {
  const sign = value > 0 ? '+' : '';
  return `
        <div class="flex justify-between text-sm">
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
    // Animations removed to match the static XP theme.
    this._isNewlyDrafted = value;
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
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._item) return;

    // Base classes and state management for the new XP-style card.
    let stateClasses = '';
    if (this._isDisabled) {
      stateClasses = 'opacity-50 cursor-not-allowed';
    } else if (this._isSelected) {
      // Use a simple border to indicate selection.
      this.style.setProperty('border', '2px solid #0058e0');
      stateClasses = 'cursor-pointer';
    } else {
      this.style.removeProperty('border');
      stateClasses = 'cursor-pointer';
    }

    this.className = `w-full ${stateClasses}`;

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
            ${room.stats.attack ? StatChange(t('global.attack'), room.stats.attack, room.units) : ''}
            ${room.stats.hp ? StatChange(t('global.health'), room.stats.hp, room.units) : ''}
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
      <fieldset ${this._isDisabled ? 'disabled' : ''}>
        <legend>${this._item.type} - ${this._item.rarity}</legend>
        <div class="p-2">
            <p class="font-bold text-lg">${itemName}</p>
            <div class="mt-2">
                ${statsHtml}
            </div>
        </div>
      </fieldset>
    `;
  }
}

customElements.define('choice-card', Card);