import type { LootChoice } from '../types';
import './LootCard.ts';
import { LootCard } from './LootCard.ts';

export class LootChoicePanel extends HTMLElement {
    private _choices: LootChoice[] = [];
    private _disabled: boolean = false;
    private _selectedIds: string[] = [];

    set choices(value: LootChoice[]) { this._choices = value; this.render(); }
    get choices(): LootChoice[] { return this._choices; }

    set disabled(value: boolean) { this._disabled = value; this.render(); }
    get disabled(): boolean { return this._disabled; }

    constructor() {
        super();
        this.addEventListener('loot-card-select', (e: Event) => {
            const { instanceId } = (e as CustomEvent).detail;
            this.handleSelect(instanceId);
        });

        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'present-offer-button') {
                this.dispatchEvent(new CustomEvent('present-offer', {
                    bubbles: true,
                    composed: true,
                    detail: { ids: this._selectedIds }
                }));
            }
        });
    }

    connectedCallback() {
        this.render();
    }

    private handleSelect(instanceId: string) {
        if (this._disabled) return;

        const instanceIdToBaseIdMap = new Map(this._choices.map(c => [c.instanceId, c.id]));
        const itemToSelect = this._choices.find(c => c.instanceId === instanceId);
        if (!itemToSelect) return;

        const isSelected = this._selectedIds.includes(instanceId);

        if (isSelected) {
            this._selectedIds = this._selectedIds.filter(id => id !== instanceId);
        } else {
            const selectedBaseIds = this._selectedIds.map(id => instanceIdToBaseIdMap.get(id));
            if (selectedBaseIds.includes(itemToSelect.id)) {
                return; // Already have a version of this item
            }
            if (this._selectedIds.length < 3) {
                this._selectedIds.push(instanceId);
            }
        }
        this.render();
    }

    render() {
        if (!this._choices) return;

        const instanceIdToBaseIdMap = new Map(this._choices.map(c => [c.instanceId, c.id]));
        const selectedBaseIds = this._selectedIds.map(id => instanceIdToBaseIdMap.get(id));
        const canSubmit = this._selectedIds.length >= 2 && this._selectedIds.length <= 3;

        this.innerHTML = `
            <div class="w-full">
                <h3 class="text-xl font-bold text-center mb-4 text-white">Offer Rewards (Choose 2 to 3)</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!canSubmit || this._disabled ? 'disabled' : ''}
                        class="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Present Offer (${this._selectedIds.length}/3)
                    </button>
                </div>
            </div>
        `;

        const container = this.querySelector('#loot-card-container');
        if (container) {
            this._choices.forEach(item => {
                const lootCard = document.createElement('loot-card') as LootCard;
                lootCard.item = item;
                lootCard.isSelected = this._selectedIds.includes(item.instanceId);
                const isSameIdSelected = !lootCard.isSelected && selectedBaseIds.includes(item.id);
                lootCard.isDisabled = isSameIdSelected || this._disabled;
                container.appendChild(lootCard);
            });
        }
    }
}

customElements.define('loot-choice-panel', LootChoicePanel);
