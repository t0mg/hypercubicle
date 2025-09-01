import { t } from '../text';
import type { Encounter } from '../types';

export class BattlePanel extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const enemyCountInput = this.querySelector('#enemy-count') as HTMLInputElement;
            const enemyPowerInput = this.querySelector('#enemy-power') as HTMLInputElement;
            const enemyHpInput = this.querySelector('#enemy-hp') as HTMLInputElement;

            const encounter: Encounter = {
                enemyCount: parseInt(enemyCountInput.value, 10) || 1,
                enemyPower: parseInt(enemyPowerInput.value, 10) || 10,
                enemyHp: parseInt(enemyHpInput.value, 10) || 20,
            };

            this.dispatchEvent(new CustomEvent('run-encounter', {
                bubbles: true,
                composed: true,
                detail: { encounter }
            }));
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl  text-center mb-2 text-white">${t('battle_panel.title')}</h3>
                <p class="text-center text-brand-text-muted mb-6">${t('battle_panel.description')}</p>
                <form class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="enemy-count" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Count</label>
                        <input id="enemy-count" type="number" step="1" value="1" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-power" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Power</label>
                        <input id="enemy-power" type="number" step="1" value="10" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-hp" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy HP</label>
                        <input id="enemy-hp" type="number" step="1" value="20" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <button type="submit" class="w-full bg-brand-secondary text-white  py-2.5 px-4 rounded-lg transition-all transform hover:scale-105">
                            ${t('battle_panel.run_encounter')}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
}

customElements.define('battle-panel', BattlePanel);
