import { t } from '../text';

export class UnlockScreen extends HTMLElement {
    private _title: string = '';
    private _description: string = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'continue-button') {
                this.dispatchEvent(new CustomEvent('continue-from-unlock', { bubbles: true, composed: true }));
            }
        });
    }

    set title(value: string) {
        this._title = value;
        this.render();
    }

    set description(value: string) {
        this._description = value;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .unlock-container {
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
                .panel {
                    background-color: var(--color-brand-surface);
                    border: 1px solid var(--color-brand-secondary);
                    border-radius: 1rem;
                    padding: 3rem;
                    max-width: 600px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                .congratulations {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    color: var(--color-brand-primary);
                    margin-bottom: 1rem;
                }
                .feature-title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                }
                .feature-description {
                    font-size: 1.2rem;
                    margin-bottom: 2.5rem;
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
                }
                .button:hover {
                    background-color: #c0392b;
                }
            </style>
            <div class="unlock-container">
                <div class="panel">
                    <h2 class="congratulations">${t('unlocks.congratulations')}</h2>
                    <h3 class="feature-title">${this._title}</h3>
                    <p class="feature-description">${this._description}</p>
                    <button id="continue-button" class="button">
                        ${t('unlocks.continue')}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('unlock-screen', UnlockScreen);
