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
        // Colors are removed to match the neutral XP theme.
        return '';
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
            <fieldset class="w-full">
                <legend>${t('log_panel.title')}</legend>
                <div class="sunken-panel p-2 max-h-48 overflow-y-auto text-xs font-mono space-y-1" id="log-container">
                    ${logHtml}
                </div>
            </fieldset>
        `;

        const logContainer = this.querySelector('#log-container');
        if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }
}

customElements.define('log-panel', LogPanel);