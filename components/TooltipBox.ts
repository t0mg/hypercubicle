import { t } from '../text';

export class TooltipBox extends HTMLElement {
    private titleElement: HTMLElement;
    private bodyElement: HTMLElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // I am not using tailwind classes directly in the shadow DOM,
        // as it would require a more complex setup.
        // I will use standard CSS that matches the look and feel of the app.
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: none;
                position: fixed;
                z-index: 1000;
                pointer-events: none;
                background-color: #1a202c; /* bg-brand-surface */
                border: 1px solid #4a5568; /* border-brand-secondary */
                padding: 1rem; /* p-4 */
                border-radius: 0.25rem; /* rounded */
                max-width: 350px;
                font-size: 0.875rem; /* text-sm */
                color: #cbd5e0; /* text-brand-text */
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
            }

            /* On touch devices, display as a modal */
            @media (pointer: coarse) {
                :host(.show) {
                    display: block;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 500px;
                    pointer-events: auto;
                }
            }
        `;

        const container = document.createElement('div');
        this.titleElement = document.createElement('h3');
        this.titleElement.style.fontWeight = 'bold';
        this.titleElement.style.marginBottom = '4px';

        this.bodyElement = document.createElement('div');

        container.appendChild(this.titleElement);
        container.appendChild(this.bodyElement);

        this.shadowRoot!.appendChild(style);
        this.shadowRoot!.appendChild(container);
    }

    show(content: { title: string, body: string }, x: number, y: number) {
        this.titleElement.textContent = content.title;
        this.bodyElement.innerHTML = content.body; // Using innerHTML to support formatted text

        // For touch devices, we add a class to trigger the modal display style
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.classList.add('show');
        } else {
            this.style.display = 'block';
            this.style.left = `${x + 15}px`;
            this.style.top = `${y + 15}px`;
        }
    }

    hide() {
        this.style.display = 'none';
        this.classList.remove('show');
    }
}

customElements.define('tooltip-box', TooltipBox);
