import { t } from '../text';

export class TooltipBox extends HTMLElement {
    private titleElement: HTMLElement;
    private bodyElement: HTMLElement;
    private closeButton: HTMLElement;
    private contentContainer: HTMLElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.onclick = (e) => {
            if (window.matchMedia('(pointer: coarse)').matches && e.target === this) {
                this.hide();
            }
        };

        const style = document.createElement('style');
        style.textContent = `
            .pixel-corners {
              clip-path: polygon(0 5px, 5px 5px, 5px 0, calc(100% - 5px) 0, calc(100% - 5px) 5px, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 5px calc(100% - 5px), 0 calc(100% - 5px));
            }

            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
                z-index: 1000;
                pointer-events: none;
                background-color: #1a202c;
                border: 1px solid #4a5568;
                max-width: 350px;
                font-size: 0.875rem;
                color: #cbd5e0;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            .content-container {
                position: relative;
                padding: 1.5rem;
            }

            .close-button {
                display: none;
            }

            h3 {
                margin-top: 0;
                font-weight: bold;
                margin-bottom: 8px;
            }

            /* Mobile styles */
            @media (pointer: coarse) {
                :host(.show) {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    pointer-events: auto;
                    max-width: none; /* Override desktop max-width */
                }

                .content-container {
                    background-color: #1a202c;
                    border: 1px solid #4a5568;
                    padding: 1.5rem;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    color: #cbd5e0;
                    font-size: 1.125rem;
                }

                .close-button {
                    display: block;
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 2.5rem;
                    color: #cbd5e0;
                    cursor: pointer;
                    background: none;
                    border: none;
                    line-height: 1;
                    z-index: 10;
                }

                h3 {
                    font-size: 1.5rem;
                    text-align: center;
                }
            }
        `;

        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'content-container';

        this.titleElement = document.createElement('h3');
        this.bodyElement = document.createElement('div');

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.onclick = () => this.hide();

        this.contentContainer.appendChild(this.closeButton);
        this.contentContainer.appendChild(this.titleElement);
        this.contentContainer.appendChild(this.bodyElement);

        this.shadowRoot!.appendChild(style);
        this.shadowRoot!.appendChild(this.contentContainer);
    }

    connectedCallback() {
      // Apply pixel-corners class after the element is in the DOM.
      if (window.matchMedia('(pointer: coarse)').matches) {
        this.contentContainer.classList.add('pixel-corners');
      } else {
        this.classList.add('pixel-corners');
      }
    }

    show(content: { title: string, body: string }, x: number, y: number) {
        this.titleElement.textContent = content.title;
        this.bodyElement.innerHTML = content.body;

        if (window.matchMedia('(pointer: coarse)').matches) {
            this.style.display = '';
            this.classList.add('show');
        } else {
            this.style.display = 'block';
            this.style.left = `${x + 15}px`;
            this.style.top = `${y + 15}px`;
        }
    }

    hide() {
        this.classList.remove('show');
        this.style.display = 'none';
    }

    updatePosition(x: number, y: number) {
        // This should only affect desktop tooltips, as mobile is not positioned this way.
        if (!window.matchMedia('(pointer: coarse)').matches) {
            this.style.left = `${x + 15}px`;
            this.style.top = `${y + 15}px`;
        }
    }
}

customElements.define('tooltip-box', TooltipBox);