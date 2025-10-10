import { t } from '../text';

export class TooltipBox extends HTMLElement {
  private titleElement: HTMLElement;
  private bodyElement: HTMLElement;
  private closeButton: HTMLElement;
  private contentContainer: HTMLElement;
  private isDesktop: boolean = true;

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
            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2000;
                pointer-events: none;
                --x-px: 8px;
                --y-px: 4px;
                --b-px: 1px;
                --bg-color: #ffffe1;
                --border-color: #000;
                --text-color: #000;
                max-width: 350px;
                font-family: 'Pixelated MS Sans Serif', sans-serif;
                font-size: 11px;
            }

            :host(.show) {
              display: block;
            }

            .content-container {
                position: relative;
                padding: var(--y-px) var(--x-px);
                background-color: var(--bg-color);
                border: var(--b-px) solid var(--border-color);
                color: var(--text-color);
                border-radius: 15px;
            }

            .content-container::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px 10px 0 10px;
                border-color: var(--border-color) transparent transparent transparent;
                bottom: -10px;
                left: calc(50% - 10px);
            }

            .content-container::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px 10px 0 10px;
                border-color: var(--bg-color) transparent transparent transparent;
                bottom: calc(-10px + var(--b-px));
                left: calc(50% - 10px);
                z-index: 1;
            }

            .close-button {
                display: none;
            }

            h3 {
                margin-top: 0;
                font-weight: bold;
                margin-bottom: 8px;
                font-size: 13px;
            }

            /* Mobile styles */
            @media (pointer: coarse) {
                :host {
                    --bg-color: #1a202c;
                    --border-color: #4a5568;
                    --text-color: #cbd5e0;
                    max-width: none;
                    font-family: inherit;
                    font-size: 1.125rem;
                    filter: none;
                }

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
                }

                .content-container {
                    padding: 1.5rem;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    margin: 1rem;
                }

                .content-container::after, .content-container::before {
                    display: none;
                }

                .close-button {
                    display: block;
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 2.5rem;
                    color: var(--text-color);
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

  show(content: { title: string, body: string }, x: number, y: number) {
    this.titleElement.textContent = content.title;
    this.bodyElement.innerHTML = content.body;
    this.isDesktop = !window.matchMedia('(pointer: coarse)').matches;
    this.classList.add('show');
  }

  hide() {
    this.classList.remove('show');
  }
}

customElements.define('tooltip-box', TooltipBox);