export class LoadingIndicator extends HTMLElement {
    private _text: string = 'Loading...';

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'text') {
            this._text = newValue;
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `;
    }
}

customElements.define('loading-indicator', LoadingIndicator);
