import { t } from '../text';

export class TooltipBox extends HTMLElement {
    private titleElement: HTMLElement;
    private bodyElement: HTMLElement;

    private overlayElement: HTMLElement;
    private closeButton: HTMLElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: none;
                position: fixed;
                z-index: 1000;
                pointer-events: none;
                background-color: #1a202c;
                border: 1px solid #4a5568;
                padding: 1rem;
                border-radius: 0.25rem;
                max-width: 350px;
                font-size: 0.875rem;
                color: #cbd5e0;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 999;
            }

            .close-button {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                color: #cbd5e0;
                cursor: pointer;
                background: none;
                border: none;
            }

            @media (pointer: coarse) {
                :host(.show) {
                    display: flex;
                    flex-direction: column;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 500px;
                    font-size: 1.125rem; /* text-lg */
                    pointer-events: auto;
                }

                :host(.show) .overlay {
                    display: block;
                }

                h3 {
                    font-size: 1.5rem; /* text-2xl */
                }
            }
        `;

        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'overlay';
        this.overlayElement.onclick = () => this.hide();

        const container = document.createElement('div');
        this.titleElement = document.createElement('h3');
        this.titleElement.style.fontWeight = 'bold';
        this.titleElement.style.marginBottom = '8px';

        this.bodyElement = document.createElement('div');

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.onclick = () => this.hide();

        container.appendChild(this.closeButton);
        container.appendChild(this.titleElement);
        container.appendChild(this.bodyElement);

        this.shadowRoot!.appendChild(style);
        this.shadowRoot!.appendChild(this.overlayElement);
        this.shadowRoot!.appendChild(container);
    }

    show(content: { title: string, body: string }, x: number, y: number) {
        this.titleElement.textContent = content.title;
        this.bodyElement.innerHTML = content.body;

        if (window.matchMedia('(pointer: coarse)').matches) {
            this.style.display = ''; // Clear inline style to allow class to take over
            this.classList.add('show');
            this.overlayElement.style.display = 'block';
            this.closeButton.style.display = 'block';
        } else {
            this.style.display = 'block';
            this.style.left = `${x + 15}px`;
            this.style.top = `${y + 15}px`;
        }
    }

    hide() {
        this.style.display = 'none';
        this.classList.remove('show');
        this.overlayElement.style.display = 'none';
        this.closeButton.style.display = 'none';
    }
}

customElements.define('tooltip-box', TooltipBox);
