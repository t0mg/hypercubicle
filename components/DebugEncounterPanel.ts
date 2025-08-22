export class DebugEncounterPanel extends HTMLElement {
    private _defaultBaseDamage: number = 10;

    set defaultBaseDamage(value: number) {
        this._defaultBaseDamage = value;
        const input = this.querySelector('#base-damage') as HTMLInputElement;
        if (input) {
            input.value = this._defaultBaseDamage.toString();
        }
    }

    constructor() {
        super();
        this.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const baseDamageInput = this.querySelector('#base-damage') as HTMLInputElement;
            const difficultyFactorInput = this.querySelector('#difficulty-factor') as HTMLInputElement;

            const params = {
                baseDamage: parseFloat(baseDamageInput.value) || 0,
                difficultyFactor: parseFloat(difficultyFactorInput.value) || 0,
            };

            this.dispatchEvent(new CustomEvent('run-encounter', {
                bubbles: true,
                composed: true,
                detail: { params }
            }));
        });
    }

    connectedCallback() {
        this.render();
        this.defaultBaseDamage = this._defaultBaseDamage;
    }

    render() {
        this.innerHTML = `
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl font-bold text-center mb-2 text-white">Debug Encounter</h3>
                <p class="text-center text-brand-text-muted mb-6">Override encounter parameters for testing.</p>
                <form class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="base-damage" class="block text-sm font-medium text-brand-text-muted mb-1">Base Damage</label>
                        <input
                            id="base-damage"
                            type="number"
                            step="1"
                            value="${this._defaultBaseDamage}"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="Base Damage"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <label for="difficulty-factor" class="block text-sm font-medium text-brand-text-muted mb-1">Difficulty Factor</label>
                        <input
                            id="difficulty-factor"
                            type="number"
                            step="0.1"
                            value="1.0"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="Difficulty Factor"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <button
                            type="submit"
                            class="w-full bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            Run Encounter
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
}

customElements.define('debug-encounter-panel', DebugEncounterPanel);
