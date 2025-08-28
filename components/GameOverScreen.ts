export class GameOverScreen extends HTMLElement {
    private state: 'initial' | 'revealing' | 'revealed' = 'initial';
    private decision: 'continue' | 'retire' | null = null;

    constructor() {
        super();
        this.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'enter-workshop-button') {
                this.dispatchEvent(new CustomEvent('enter-workshop', { bubbles: true, composed: true }));
            } else if (target.id === 'new-adventurer-button') {
                this.dispatchEvent(new CustomEvent('start-run', { bubbles: true, composed: true }));
            }
        });
    }

    connectedCallback() {
        if (this.state === 'initial') {
            this.render();
            this.revealDecision();
        }
    }

    revealDecision() {
        this.state = 'revealing';
        setTimeout(() => {
            this.decision = Math.random() > 0.5 ? 'continue' : 'retire';
            this.state = 'revealed';
            this.updateDecision(true);
        }, 2000);
    }

    render() {
        const finalBP = this.getAttribute('final-bp') || 0;
        const reason = this.getAttribute('reason') || 'The run has ended.';

        this.innerHTML = `
            <style>
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { opacity: 0; animation: fade-in-up 0.5s ease-out forwards; }
                @keyframes dots {
                    0%, 20% { color: rgba(255,255,255,0); text-shadow: .25em 0 0 rgba(255,255,255,0), .5em 0 0 rgba(255,255,255,0); }
                    40% { color: white; text-shadow: .25em 0 0 rgba(255,255,255,0), .5em 0 0 rgba(255,255,255,0); }
                    60% { text-shadow: .25em 0 0 white, .5em 0 0 rgba(255,255,255,0); }
                    80%, 100% { text-shadow: .25em 0 0 white, .5em 0 0 white; }
                }
                .animate-dots::after { content: '...'; animation: dots 1.5s infinite; }
            </style>
            <div class="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full max-w-lg">
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">Run Complete!</h2>
                    <p class="text-brand-text-muted mb-4">${reason}</p>
                    <p class="text-lg text-white mb-6">Final BP: <span class="font-bold text-2xl text-amber-400">${finalBP}</span></p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">The adventurer considers their fate<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `;
    }

    updateDecision(withAnimation: boolean) {
        const decisionContainer = this.querySelector('#decision-container');
        const buttonContainer = this.querySelector('#button-container');

        if (!decisionContainer || !buttonContainer) {
            return;
        }

        let decisionText = '';
        let buttonHTML = '';
        const animationClass = withAnimation ? 'animate-fade-in-up' : '';

        if (this.decision === 'continue') {
            decisionText = `
                <h3 class="text-2xl font-bold text-green-400 mb-2 ${animationClass}">"I will go on."</h3>
                <p class="text-brand-text mb-4 ${animationClass}" style="animation-delay: 0.5s;">The adventurer decides to press on, ready for another run!</p>
            `;
            buttonHTML += `
                <button
                    id="enter-workshop-button"
                    class="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 ${animationClass}"
                    style="animation-delay: 1.2s;"
                >
                    Enter Workshop
                </button>
            `;
        } else { // retire
            decisionText = `
                <h3 class="text-2xl font-bold text-red-400 mb-2 ${animationClass}">"I have seen enough."</h3>
                <p class="text-brand-text mb-4 ${animationClass}" style="animation-delay: 0.5s;">The adventurer has lost motivation, and decides to retire.</p>
            `;
            buttonHTML += `
                <button
                    id="new-adventurer-button"
                    class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105 ${animationClass}"
                    style="animation-delay: 1s;"
                >
                    Recruit New Adventurer
                </button>
            `;
        }

        decisionContainer.innerHTML = decisionText;
        buttonContainer.innerHTML = buttonHTML;
    }
}

customElements.define('game-over-screen', GameOverScreen);
