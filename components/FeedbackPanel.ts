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
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `;
    }
}

customElements.define('feedback-panel', FeedbackPanel);