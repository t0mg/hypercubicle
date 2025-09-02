import type { AdventurerTraits } from '../types';
import { t } from '../text';
import { LogEntry, Logger } from '../game/logger';

export class LogPanel extends HTMLElement {
    private _logger: Logger | null = null;
    private _traits: AdventurerTraits | null = null;

    set logger(value: Logger) {
        this._logger = value;
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

    private _getLogColor(level: string): string {
        switch (level) {
            case 'DEBUG':
                return 'text-gray-500';
            case 'INFO':
                return 'text-gray-400';
            case 'WARN':
                return 'text-yellow-400';
            case 'ERROR':
                return 'text-red-500';
            default:
                return 'text-gray-400';
        }
    }

    render() {
        if (!this._traits || !this._logger) {
            this.innerHTML = '';
            return;
        }

        const logHtml = this._logger.entries.map((log: LogEntry, index) =>
            `<p class="whitespace-pre-wrap ${this._getLogColor(log.level)}">[${index.toString().padStart(3, '0')}] ${log.message}</p>`
        ).join('');

        this.innerHTML = `
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${t('log_panel.title')}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 pixel-corners">
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${t('log_panel.offense')}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${t('log_panel.risk')}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${t('log_panel.expertise')}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
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

customElements.define('log-panel', LogPanel);
