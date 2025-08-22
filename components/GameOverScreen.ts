export class GameOverScreen extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'enter-workshop-button') {
                this.dispatchEvent(new CustomEvent('enter-workshop', {
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const finalBP = this.getAttribute('final-bp') || 0;
        const reason = this.getAttribute('reason') || 'The run has ended.';

        this.innerHTML = `
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in">
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">Run Complete!</h2>
                    <p class="text-brand-text-muted mb-4">${reason}</p>
                    <p class="text-lg text-white mb-6">Final BP: <span class="font-bold text-2xl text-amber-400">${finalBP}</span></p>
                    <button
                        id="enter-workshop-button"
                        class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105"
                    >
                        Enter Workshop
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('game-over-screen', GameOverScreen);
