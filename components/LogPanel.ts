import type { AdventurerTraits, LogEntry } from '../types';
import { t } from '../text';
import { Logger } from '../game/logger';

export class LogPanel extends HTMLElement {
  private _logger: Logger | null = null;
  private _traits: AdventurerTraits | null = null;
  private _renderedLogCount: number = 0;

  set logger(value: Logger) {
    this._logger = value;
    // The listener must accept the LogEntry argument, even if it's unused,
    // to match the signature expected by the Logger's `on` method.
    this._logger.on((_entry: LogEntry) => this.render());
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
        return 'text-blue-400';
      case 'INFO':
        return '';
      case 'WARN':
        return 'text-yellow-500';
      case 'ERROR':
        return 'text-red-500';
      default:
        return '';
    }
  }

  private _appendEntry(log: LogEntry, index: number) {
    const logContainer = this.querySelector('#log-container');
    if (logContainer) {
      const p = document.createElement('p');
      p.className = this._getLogColor(log.level);
      p.textContent = `[${index.toString().padStart(3, '0')}] ${log.message}`;
      logContainer.appendChild(p);
    }
  }

  render() {
    if (!this._traits || !this._logger) {
      this.innerHTML = '';
      this._renderedLogCount = 0;
      return;
    }

    const logContainer = this.querySelector('#log-container');
    const loggerEntries = this._logger.entries;

    // Full re-render if the container doesn't exist or if logs have been cleared/reset
    if (!logContainer || loggerEntries.length < this._renderedLogCount) {
      const logHtml = loggerEntries.map((log: LogEntry, index) =>
        `<p class="${this._getLogColor(log.level)}">[${index.toString().padStart(3, '0')}] ${log.message}</p>`
      ).join('');

      this.innerHTML = `
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${logHtml}
        </pre>
      `;
      this._renderedLogCount = loggerEntries.length;
    } else if (loggerEntries.length > this._renderedLogCount) {
      // Append only the new entries
      for (let i = this._renderedLogCount; i < loggerEntries.length; i++) {
        this._appendEntry(loggerEntries[i], i);
      }
      this._renderedLogCount = loggerEntries.length;
    }

    // Ensure the log scrolls to the bottom
    const finalContainer = this.querySelector('#log-container');
    if (finalContainer) {
      finalContainer.scrollTop = finalContainer.scrollHeight;
    }
  }
}

customElements.define('log-panel', LogPanel);