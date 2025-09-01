import { t } from '../text';

export class GameStats extends HTMLElement {
    private _balancePoints: number = 0;
    private _run: number = 0;
    private _room: number = 0;
    private _deckSize: number = 0;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['balance-points', 'run', 'room', 'deck-size'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'balance-points':
                this._balancePoints = Number(newValue);
                break;
            case 'run':
                this._run = Number(newValue);
                break;
            case 'room':
                this._room = Number(newValue);
                break;
            case 'deck-size':
                this._deckSize = Number(newValue);
                break;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.bp')}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.run')}</span>
                    <p class="text-2xl  text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.room')}</span>
                    <p class="text-2xl  text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.deck')}</span>
                    <p class="text-2xl  text-white">${this._deckSize}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('game-stats', GameStats);
