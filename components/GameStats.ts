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
            <div class="status-bar flex items-center text-center px-2">
                <div class="flex-1 flex justify-start">
                    <button id="quit-game-btn">${t('global.quit')}</button>
                </div>

                <div class="flex justify-center items-center">
                    ${this._balancePoints !== null ? `
                    <p class="status-bar-field w-24">
                        <span class="text-xs">${t('global.bp')}:</span>
                        <span class="font-mono ml-1">${this._balancePoints}</span>
                    </p>
                    ` : ''}
                    <p class="status-bar-field w-24">
                        <span class="text-xs">${t('global.run')}:</span>
                        <span class="font-mono ml-1">${this._run}</span>
                    </p>
                    <p class="status-bar-field w-24">
                        <span class="text-xs">${t('global.room')}:</span>
                        <span class="font-mono ml-1">${this._room}</span>
                    </p>
                    <p class="status-bar-field w-24">
                        <span class="text-xs">${t('global.deck')}:</span>
                        <span class="font-mono ml-1">${this._deckSize}</span>
                    </p>
                    <p class="status-bar-field w-24">
                        <span class="text-xs">${t('global.rooms')}:</span>
                        <span class="font-mono ml-1">${this._roomDeckSize}</span>
                    </p>
                </div>

                <div class="flex-1 flex justify-end">
                    ${this.engine?.isWorkshopAccessUnlocked() ? `
                        <button id="enter-workshop-btn">${t('global.workshop')}</button>
                    ` : ''}
                </div>
            </div>
        `;

        this.querySelector('#enter-workshop-btn')?.addEventListener('click', () => {
            this.engine?.enterWorkshop();
        });
        this.querySelector('#quit-game-btn')?.addEventListener('click', async () => {
            if (await ConfirmModal.show(t('global.quit'), t('global.quit_confirm'))) {
                this.engine?.quitGame(false);
            }
        });
    }
}

customElements.define('game-stats', GameStats);