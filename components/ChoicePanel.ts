import type { LootChoice, RoomChoice } from '../types';
import './Card.ts';
import { Card } from './Card.ts';
import { t } from '../text';

const MAX_SELECTION = 4;

export class ChoicePanel extends HTMLElement {
    private _choices: (LootChoice | RoomChoice)[] = [];
    private _deckType: 'item' | 'room' = 'item';
    private _disabled: boolean = false;
    private _selectedIds: string[] = [];
    private _initialRender: boolean = true;

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

    constructor() {
        super();
        this.addEventListener('card-select', (e: Event) => {
            const { instanceId } = (e as CustomEvent).detail;
            this.handleSelect(instanceId);
        });

        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'present-offer-button') {
                if (this._deckType === 'item') {
                    this.dispatchEvent(new CustomEvent('present-offer', {
                        bubbles: true,
                        composed: true,
                        detail: { ids: this._selectedIds }
                    }));
                } else {
                    const selectedRooms = this._choices.filter(c => this._selectedIds.includes(c.instanceId));
                    this.dispatchEvent(new CustomEvent('run-encounter', {
                        bubbles: true,
                        composed: true,
                        detail: { rooms: selectedRooms }
                    }));
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
            const instanceIdToBaseIdMap = new Map(this._choices.map(c => [c.instanceId, c.id]));
            if (isSelected) {
                this._selectedIds = this._selectedIds.filter(id => id !== instanceId);
            } else {
                const selectedBaseIds = this._selectedIds.map(id => instanceIdToBaseIdMap.get(id));
                if (selectedBaseIds.includes(itemToSelect.id)) {
                    return;
                }
                if (this._selectedIds.length < MAX_SELECTION) {
                    this._selectedIds.push(instanceId);
                }
            }
        }
        this.render();
    }

    render() {
        if (!this._choices) return;

        const isRoomSelection = this._deckType === 'room';
        const title = isRoomSelection ? t('choice_panel.title_room') : t('choice_panel.title');
        const buttonText = isRoomSelection ? t('choice_panel.begin_encounter') : t('choice_panel.present_offer');

        let canSubmit = false;
        let buttonLabel = buttonText;

        if (isRoomSelection) {
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
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
            this._choices.forEach(item => {
                const card = document.createElement('choice-card') as Card;
                card.item = item;
                card.isSelected = this._selectedIds.includes(item.instanceId);

                let isDisabled = this._disabled;
                if (isRoomSelection) {
                    const selectedItems = this._choices.filter(c => this._selectedIds.includes(c.instanceId));
                    const hasBoss = selectedItems.some(c => c.type === 'boss');
                    if(card.isSelected) {
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
