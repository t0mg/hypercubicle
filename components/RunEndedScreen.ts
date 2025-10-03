import { t } from '../text';
import { UnlockableFeature, UNLOCKS } from '../game/unlocks';
import { GameEngine } from '../game/engine';
import { InfoModal } from './InfoModal';

export class RunEndedScreen extends HTMLElement {
    private state: 'initial' | 'unlock-revealed' | 'decision-revealing' | 'decision-revealed' = 'initial';
    public decision: 'continue' | 'retire' | null = null;
    public engine: GameEngine | null = null;
    public newlyUnlocked: UnlockableFeature[] = [];

    static get observedAttributes() {
        return ['workshop-unlocked'];
    }

    constructor() {
        super();
        this.addEventListener('click', (e: Event) => {
            const target = e.composedPath()[0] as HTMLElement;
            if (target.id === 'continue-run-button' && this.engine) {
                this.engine.handleEndOfRun('continue');
            } else if (target.id === 'retire-run-button' && this.engine) {
                this.engine.handleEndOfRun('retire');
            }
        });
    }

    public async initialize(decision: 'continue' | 'retire', newlyUnlocked: UnlockableFeature[], engine: GameEngine) {
        this.decision = decision;
        this.newlyUnlocked = newlyUnlocked;
        this.engine = engine;
        this.render();
        await this.startFlow();
    }

    async startFlow() {
        if (this.newlyUnlocked.length > 0) {
            await this.renderUnlock();
        } else {
            this.state = 'unlock-revealed'; // Skip unlock phase
            this.revealDecision();
        }
    }

    async renderUnlock() {
        const unlockInfo = UNLOCKS.find(u => u.feature === this.newlyUnlocked[0]);
        if (!unlockInfo) return;

        const title = t('unlocks.title');
        const content = `
            <h3 class="font-label text-white">${unlockInfo.title()}</h3>
            <p class="text-brand-text">${unlockInfo.description()}</p>
        `;

        await InfoModal.showInfo(title, content);
        this.dismissUnlock();
    }

    dismissUnlock() {
        this.state = 'unlock-revealed';
        this.revealDecision();
    }

    revealDecision() {
        if (this.state !== 'unlock-revealed') return;

        this.state = 'decision-revealing';
        const reason = this.getAttribute('reason') || '';
        const isBored = reason.includes('bored') || reason.includes('apathetic');

        if (isBored) {
            // If the adventurer is bored, we know the decision is to retire.
            // No need to wait for a "reveal".
            this.state = 'decision-revealed';
            this.updateDecision(false); // No animation needed
            return;
        }

        setTimeout(() => {
            this.state = 'decision-revealed';
            this.updateDecision(true);
        }, 2000);
    }

    render() {
        const finalBP = this.getAttribute('final-bp') || 0;
        const reason = this.getAttribute('reason') || t('run_ended_screen.default_reason');

        this.innerHTML = `
            <style>
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
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
            <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full">
                <h2 class="text-4xl font-title text-brand-secondary mb-2">${t('run_ended_screen.run_complete')}</h2>
                <p class="text-brand-text-muted mb-4">${reason}</p>
                <div id="decision-container" class="h-24">
                    <p class="text-brand-text-muted text-lg animate-fade-in-up">${t('run_ended_screen.adventurer_considers_fate')}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `;
    }

    updateDecision(withAnimation: boolean) {
        const decisionContainer = this.querySelector('#decision-container');
        const buttonContainer = this.querySelector('#button-container');

        if (!decisionContainer || !buttonContainer || this.state !== 'decision-revealed') {
            return;
        }

        let decisionText = '';
        let buttonHTML = '';
        const animationClass = withAnimation ? 'animate-fade-in-up' : '';
        const workshopUnlocked = this.hasAttribute('workshop-unlocked');

        if (this.decision === 'continue') {
            decisionText = `
                <h3 class="text-2xl text-green-400 ${animationClass}">${t('run_ended_screen.continue_quote')}</h3>
                <p class="text-brand-text ${animationClass}" style="animation-delay: 0.5s;">${t('run_ended_screen.continue_decision')}</p>
            `;
            buttonHTML += `
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${animationClass}"
                    style="animation-delay: 1.2s;"
                >
                    ${workshopUnlocked ? t('run_ended_screen.enter_workshop') : t('run_ended_screen.start_new_run')}
                </button>
            `;
        } else { // retire
            decisionText = `
                <h3 class="text-2xl text-red-400 ${animationClass}">${t('run_ended_screen.retire_quote')}</h3>
                <p class="text-brand-text ${animationClass}" style="animation-delay: 0.5s;">${t('run_ended_screen.retire_decision', { run: this.getAttribute('run')})}</p>
            `;
            buttonHTML += `
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${animationClass}"
                    style="animation-delay: 1s;"
                >
                    ${t('run_ended_screen.recruit_new_adventurer')}
                </button>
            `;
        }

        decisionContainer.innerHTML = decisionText;
        buttonContainer.innerHTML = buttonHTML;
    }
}

customElements.define('run-ended-screen', RunEndedScreen);
