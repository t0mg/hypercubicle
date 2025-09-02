export class FeedbackPanel extends HTMLElement {
    private _message: string = '';

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['message'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue:string) {
        if (name === 'message') {
            this._message = newValue;
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `;
    }
}

customElements.define('feedback-panel', FeedbackPanel);
