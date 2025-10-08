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
            <h3>${unlockInfo.title()}</h3>
            <p class="mb-6">${unlockInfo.description()}</p>
        `;

        await InfoModal.showInfo(
            title,
            content,
            t('global.continue')
        );
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
            this.state = 'decision-revealed';
            this.updateDecision();
            return;
        }

        // Simulate a delay for the adventurer's decision
        const decisionContainer = this.querySelector('#decision-container');
        if(decisionContainer) {
            decisionContainer.innerHTML = `<p>${t('run_ended_screen.adventurer_considers_fate')}...</p>`
        }

        setTimeout(() => {
            this.state = 'decision-revealed';
            this.updateDecision();
        }, 2000);
    }

    render() {
        const reason = this.getAttribute('reason') || t('run_ended_screen.default_reason');

        this.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="window" style="width: 450px;">
                    <div class="title-bar">
                        <div class="title-bar-text">${t('run_ended_screen.run_complete')}</div>
                    </div>
                    <div class="window-body">
                        <p class="text-center mb-4">${reason}</p>
                        <div id="decision-container" class="text-center h-24 flex flex-col justify-center items-center">
                            <!-- Decision text will be revealed here -->
                        </div>
                        <div id="button-container" class="flex justify-center gap-4 mt-4">
                            <!-- Buttons will be revealed here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateDecision() {
        const decisionContainer = this.querySelector('#decision-container');
        const buttonContainer = this.querySelector('#button-container');

        if (!decisionContainer || !buttonContainer || this.state !== 'decision-revealed') {
            return;
        }

        let decisionText = '';
        let buttonHTML = '';
        const workshopUnlocked = this.hasAttribute('workshop-unlocked');

        if (this.decision === 'continue') {
            decisionText = `
                <h3>${t('run_ended_screen.continue_quote')}</h3>
                <p>${t('run_ended_screen.continue_decision')}</p>
            `;
            buttonHTML = `
                <button id="continue-run-button">
                    ${workshopUnlocked ? t('run_ended_screen.enter_workshop') : t('run_ended_screen.start_new_run')}
                </button>
            `;
        } else { // retire
            decisionText = `
                <h3>${t('run_ended_screen.retire_quote')}</h3>
                <p>${t('run_ended_screen.retire_decision', { run: this.getAttribute('run')})}</p>
            `;
            buttonHTML = `
                <button id="retire-run-button">
                    ${t('run_ended_screen.recruit_new_adventurer')}
                </button>
            `;
        }

        decisionContainer.innerHTML = decisionText;
        buttonContainer.innerHTML = buttonHTML;
    }
}

customElements.define('run-ended-screen', RunEndedScreen);