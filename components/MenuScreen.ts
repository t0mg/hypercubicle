import { t } from '../text';

export class MenuScreen extends HTMLElement {
    private _hasSave = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'start-game-button') {
                this._dispatch('start-game');
            } else if (target.id === 'continue-game-button') {
                this._dispatch('continue-game');
            } else if (target.id === 'reset-game-button') {
                this._dispatch('reset-game');
            }
        });
    }

    static get observedAttributes() {
        return ['has-save'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'has-save') {
            this._hasSave = newValue !== null;
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    private _dispatch(eventName: string) {
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .menu-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: var(--color-brand-bg);
                    color: var(--color-brand-text);
                    padding: 2rem;
                    text-align: center;
                }
                .title {
                    font-family: 'Playfair Display', serif;
                    font-size: 4rem;
                    color: var(--color-brand-primary);
                    margin-bottom: 1rem;
                }
                .subtitle {
                    font-size: 1.5rem;
                    margin-bottom: 3rem;
                }
                .button {
                    background-color: var(--color-brand-primary);
                    color: var(--color-brand-bg);
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    margin: 0.5rem;
                    min-width: 200px;
                }
                .button:hover {
                    background-color: #c0392b;
                }
                .button.secondary {
                    background-color: var(--color-brand-surface);
                    color: var(--color-brand-primary);
                    border: 2px solid var(--color-brand-primary);
                }
                .button.secondary:hover {
                    background-color: var(--color-brand-primary);
                    color: var(--color-brand-bg);
                }
                .button:disabled {
                    background-color: #95a5a6;
                    cursor: not-allowed;
                }
            </style>
            <div class="menu-container">
                <h1 class="title">${t('game_title')}</h1>
                <p class="subtitle">${t('game_subtitle')}</p>
                <button id="start-game-button" class="button">
                    ${t('menu.new_game')}
                </button>
                <button
                    id="continue-game-button"
                    class="button"
                    ${!this._hasSave ? 'disabled' : ''}
                >
                    ${t('menu.continue_game')}
                </button>
                <button
                    id="reset-game-button"
                    class="button secondary"
                    ${!this._hasSave ? 'disabled' : ''}
                >
                    ${t('menu.reset_save')}
                </button>
            </div>
        `;
    }
}

customElements.define('menu-screen', MenuScreen);
