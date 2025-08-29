import type { AdventurerTraits } from '../types';
import { t } from '../localization';

export class DebugLog extends HTMLElement {
    private _logs: string[] = [];
    private _traits: AdventurerTraits | null = null;

    set logs(value: string[]) {
        this._logs = value;
        this.render();
    }

    set traits(value: AdventurerTraits) {
        this._traits = value;
        this.render();
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._traits) {
            this.innerHTML = '';
            return;
        }

        const logHtml = this._logs.map((log, index) =>
            `<p class="whitespace-pre-wrap">[${index.toString().padStart(3, '0')}] ${log}</p>`
        ).join('');

        this.innerHTML = `
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">${t('debug_log.title')}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${t('debug_log.offense')}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${t('debug_log.risk')}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${t('debug_log.expertise')}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono text-gray-400 space-y-1 pr-2" id="log-container">
                    ${logHtml}
                </div>
            </div>
        `;

        const logContainer = this.querySelector('#log-container');
        if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }
}

customElements.define('debug-log', DebugLog);
