export class GameStats extends HTMLElement {
    private _balancePoints: number = 0;
    private _run: number = 0;
    private _floor: number = 0;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['balance-points', 'run', 'floor'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'balance-points':
                this._balancePoints = Number(newValue);
                break;
            case 'run':
                this._run = Number(newValue);
                break;
            case 'floor':
                this._floor = Number(newValue);
                break;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">BP</span>
                    <p class="text-2xl font-bold text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">Run</span>
                    <p class="text-2xl font-bold text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">Floor</span>
                    <p class="text-2xl font-bold text-white">${this._floor}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('game-stats', GameStats);
