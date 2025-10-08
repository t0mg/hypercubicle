import { t } from '../text';
import { GameEngine } from '../game/engine';
import { ConfirmModal } from './ConfirmModal';

export class GameStats extends HTMLElement {
    private _balancePoints: number | null = null;
    private _run: number = 0;
    private _room: number = 0;
    private _deckSize: number = 0;
    private _roomDeckSize: number = 0;
    public engine?: GameEngine;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['balance-points', 'run', 'room', 'deck-size', 'room-deck-size'];
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
            case 'room-deck-size':
                this._roomDeckSize = Number(newValue);
                break;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
                <div>
                    <button id="quit-game-btn" class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${t('global.quit')}
                    </button>
                </div>
                ${this._balancePoints !== null ? `
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.bp')}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                ` : ''}
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
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${t('global.rooms')}</span>
                    <p class="text-2xl  text-white">${this._roomDeckSize}</p>
                </div>
                ${this.engine?.isWorkshopAccessUnlocked() ? `
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${t('global.workshop')}
                    </button>
                </div>
                ` : ''}
            </div>
        `;

        this.querySelector('#enter-workshop-btn')?.addEventListener('click', () => {
            this.engine?.enterWorkshop();
        });
        this.querySelector('#quit-game-btn')?.addEventListener('click', async () => {
            if (await ConfirmModal.show(t('global.quit'), t('global.quit_confirm'))) {
                this.engine?.quitGame(false); // Pass false to preserve the save file
            }
        });
    }
}

customElements.define('game-stats', GameStats);
