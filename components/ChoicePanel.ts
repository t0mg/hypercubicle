import type { LootChoice, RoomChoice } from '../types';
import './Card.ts';
import { Card } from './Card.ts';
import { t } from '../text';
import { InfoModal } from './InfoModal.ts';
import { GameEngine } from '../game/engine';

const MAX_SELECTION = 4;

export class ChoicePanel extends HTMLElement {
  private _choices: (LootChoice | RoomChoice)[] = [];
  private _deckType: 'item' | 'room' = 'item';
  public engine: GameEngine | null = null;
  private _disabled: boolean = false;
  private _selectedIds: string[] = [];
  private _initialRender: boolean = true;
  private _offerImpossible: boolean = false;
  private _roomSelectionImpossible: boolean = false;

  set choices(value: (LootChoice | RoomChoice)[]) {
    this._choices = value;
    this._initialRender = true;
    this.render();
  }
  get choices(): (LootChoice | RoomChoice)[] { return this._choices; }

  set deckType(value: 'item' | 'room') {
    this._deckType = value;
    this.render();
  }
  get deckType(): 'item' | 'room' { return this._deckType; }

  set disabled(value: boolean) { this._disabled = value; this.render(); }
  get disabled(): boolean { return this._disabled; }

  set offerImpossible(value: boolean) { this._offerImpossible = value; this.render(); }
  get offerImpossible(): boolean { return this._offerImpossible; }

  set roomSelectionImpossible(value: boolean) { this._roomSelectionImpossible = value; this.render(); }
  get roomSelectionImpossible(): boolean { return this._roomSelectionImpossible; }

  constructor() {
    super();
    this.addEventListener('card-select', (e: Event) => {
      const { instanceId } = (e as CustomEvent).detail;
      this.handleSelect(instanceId);
    });

    this.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === 'present-offer-button' && this.engine) {
        if (this._deckType === 'item') {
          this.engine.presentOffer(this._selectedIds);
        } else {
          if (this._roomSelectionImpossible) {
            this.engine.forceEndRun();
          } else {
            const selectedRooms = this._choices.filter(c => this._selectedIds.includes(c.instanceId)) as RoomChoice[];
            this.engine.runEncounter(selectedRooms);
          }
        }
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  private handleSelect(instanceId: string) {
    if (this._disabled) return;

    const itemToSelect = this._choices.find(c => c.instanceId === instanceId);
    if (!itemToSelect) return;

    const isSelected = this._selectedIds.includes(instanceId);

    if (this._deckType === 'room') {
      const isBoss = itemToSelect.type === 'boss';
      if (isSelected) {
        this._selectedIds = this._selectedIds.filter(id => id !== instanceId);
      } else {
        const selectedItems = this._choices.filter(c => this._selectedIds.includes(c.instanceId));
        const hasBoss = selectedItems.some(c => c.type === 'boss');

        if (isBoss && this._selectedIds.length === 0) {
          this._selectedIds.push(instanceId);
        } else if (!isBoss && !hasBoss && this._selectedIds.length < 3) {
          this._selectedIds.push(instanceId);
        }
      }
    } else {
      // For items, selection is based on the base item ID, due to stacking.
      const allInstancesOfBaseId = this._choices.filter(c => c.id === itemToSelect.id);
      const allInstanceIds = allInstancesOfBaseId.map(c => c.instanceId);
      const isAnySelected = allInstanceIds.some(id => this._selectedIds.includes(id));

      if (isAnySelected) {
        // Deselect all instances of this item.
        this._selectedIds = this._selectedIds.filter(id => !allInstanceIds.includes(id));
      } else {
        // Select the first instance of this item. The offer is for unique items.
        if (this._selectedIds.length < MAX_SELECTION) {
           // We only add one instanceId to the selection, as the offer is for unique items.
           // The original logic of preventing multiple selections of the same base item is preserved.
          this._selectedIds.push(instanceId);
        }
      }
    }
    this.render();
  }

  render() {
    if (!this._choices) return;

    const newlyDrafted = this._choices.filter(c => c.justDrafted && this._initialRender);
    if (newlyDrafted.length > 0 && this._initialRender) {
      this._initialRender = false; // prevent re-triggering
      
      const modalContent = newlyDrafted.map(item => {
        const card = document.createElement('choice-card') as Card;
        card.item = item;
        return card.outerHTML;
      }).join('');

      InfoModal.show({
        title: t('choice_panel.new_items_title'),
        content: `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${modalContent}</div>`,
        buttons: [{ text: t('global.continue'), value: undefined }]
      }).then(() => {
        this._choices.forEach(c => c.justDrafted = false);
        this.render();
      });

      return; // Stop rendering the main panel until modal is closed
    }

    const rarityOrder: { [key: string]: number } = { 'Common': 0, 'Uncommon': 1, 'Rare': 2 };
    const itemTypeOrder: { [key: string]: number } = { 'Weapon': 0, 'Armor': 1, 'Potion': 2, 'Buff': 3 };
    const roomTypeOrder: { [key: string]: number } = { 'enemy': 0, 'trap': 1, 'healing': 2, 'boss': 3 };

    let sortedChoices = [...this._choices];

    if (this._deckType === 'item') {
      sortedChoices.sort((a, b) => {
        const typeComparison = itemTypeOrder[a.type] - itemTypeOrder[b.type];
        if (typeComparison !== 0) return typeComparison;

        const rarityA = rarityOrder[a.rarity] || 0;
        const rarityB = rarityOrder[b.rarity] || 0;
        return rarityA - rarityB;
      });
    } else {
      sortedChoices.sort((a, b) => {
        const roomA = a as RoomChoice;
        const roomB = b as RoomChoice;

        const typeComparison = roomTypeOrder[roomA.type] - roomTypeOrder[roomB.type];
        if (typeComparison !== 0) return typeComparison;

        const hpA = roomA.stats.hp || 0;
        const hpB = roomB.stats.hp || 0;
        if (hpA !== hpB) return hpB - hpA;

        const attackA = roomA.stats.attack || 0;
        const attackB = roomB.stats.attack || 0;
        return attackB - attackA;
      });
    }

    const isRoomSelection = this._deckType === 'room';

    interface StackedLootChoice extends LootChoice {
      stackCount: number;
    }
    let displayChoices: (StackedLootChoice | RoomChoice)[];

    if (isRoomSelection) {
      displayChoices = sortedChoices as RoomChoice[];
    } else {
      const itemStacks = new Map<string, { choice: LootChoice; count: number }>();
      sortedChoices.forEach(c => {
        const choice = c as LootChoice;
        if (itemStacks.has(choice.id)) {
          itemStacks.get(choice.id)!.count++;
        } else {
          itemStacks.set(choice.id, { choice, count: 1 });
        }
      });
      displayChoices = Array.from(itemStacks.values()).map(stack => ({
        ...stack.choice,
        stackCount: stack.count,
      }));
    }

    const title = isRoomSelection ? t('choice_panel.title_room') : t('choice_panel.title');
    let buttonText = isRoomSelection ? t('choice_panel.begin_encounter') : t('choice_panel.present_offer');
    if (this._offerImpossible) {
      buttonText = t('choice_panel.continue_without_loot');
    }
    else if (this._roomSelectionImpossible) {
      buttonText = t('choice_panel.roll_credits');
    }

    let canSubmit = false;
    let buttonLabel = buttonText;

    if (this._offerImpossible || this._roomSelectionImpossible) {
      canSubmit = true;
    } else if (isRoomSelection) {
      const selectedItems = this._choices.filter(c => this._selectedIds.includes(c.instanceId));
      const hasBoss = selectedItems.some(c => c.type === 'boss');
      if (hasBoss) {
        canSubmit = this._selectedIds.length === 1;
        buttonLabel = `${buttonText} (1/1)`;
      } else {
        canSubmit = this._selectedIds.length === 3;
        buttonLabel = `${buttonText} (${this._selectedIds.length}/3)`;
      }
    } else {
      canSubmit = this._selectedIds.length >= 2 && this._selectedIds.length <= MAX_SELECTION;
      buttonLabel = `${buttonText} (${this._selectedIds.length}/${MAX_SELECTION})`;
    }

    this.innerHTML = `
            <div class="w-full">
                <h3 class="text-xl text-center mb-4 text-white">${title}</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!canSubmit || this._disabled ? 'disabled' : ''}
                        class="bg-brand-secondary text-white py-3 px-8 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${buttonLabel}
                    </button>
                </div>
            </div>
        `;

    const container = this.querySelector('#loot-card-container');
    if (container) {
      displayChoices.forEach(item => {
        const card = document.createElement('choice-card') as Card;
        card.item = item;
        if ('stackCount' in item) {
          card.stackCount = (item as StackedLootChoice).stackCount;
        }
        card.isSelected = this._selectedIds.includes(item.instanceId);

        let isDisabled = this._disabled;
        if (this._offerImpossible) {
          isDisabled = true;
        } else if (isRoomSelection) {
          const selectedItems = this._choices.filter(c => this._selectedIds.includes(c.instanceId));
          const hasBoss = selectedItems.some(c => c.type === 'boss');
          if (card.isSelected) {
            isDisabled = false;
          } else if (hasBoss) {
            isDisabled = true;
          } else if (item.type === 'boss' && selectedItems.length > 0) {
            isDisabled = true;
          } else if (selectedItems.length >= 3) {
            isDisabled = true;
          }
        } else {
          const instanceIdToBaseIdMap = new Map(this._choices.map(c => [c.instanceId, c.id]));
          const selectedBaseIds = this._selectedIds.map(id => instanceIdToBaseIdMap.get(id));
          const isSameIdSelected = !card.isSelected && selectedBaseIds.includes(item.id);
          isDisabled = isSameIdSelected || this._disabled;
        }
        card.isDisabled = isDisabled;

        card.isNewlyDrafted = (item.justDrafted && this._initialRender) || false;
        container.appendChild(card);
      });
    }
    setTimeout(() => { this._initialRender = false; }, 0);
  }
}

customElements.define('choice-panel', ChoicePanel);
