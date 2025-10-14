import { t } from '../text';
import { EncounterPayload, AdventurerSnapshot, EnemySnapshot, FlowState } from '../types';

const ROOM_CHOICE_VIEW_DELAY = 3000;
const BATTLE_EVENT_DELAY = 900;

export class EncounterModal extends HTMLElement {
  private onDismiss: (result: { skipped: boolean }) => void = () => {};
  private payload: EncounterPayload | null = null;
  private currentEventIndex = 0;
  private revealTimeout: number | undefined;
  private battleTimeout: number | undefined;
  private battleSpeed: number = BATTLE_EVENT_DELAY;
  private modalState: 'reveal' | 'outcome' | 'battle' = 'reveal';

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.payload) return;

    this.innerHTML = `
      <div id="encounter-overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="window" style="width: min(95vw, 600px);" role="dialog" aria-modal="true" aria-labelledby="encounter-modal-title">
          <div class="title-bar">
            <div class="title-bar-text" id="encounter-modal-title">${t('global.encounter_window_title')}</div>
          </div>
          <div class="window-body p-2">
            ${this.renderInitialView()}
          </div>
        </div>
      </div>
    `;

    this.querySelector('#continue-button')!.addEventListener('click', () => this.handleContinue());

    const speedSlider = this.querySelector<HTMLInputElement>('#speed-slider');
    const speeds = [1500, 1200, 900, 600, 300];
    speedSlider!.addEventListener('input', (event) => {
        const value = (event.target as HTMLInputElement).value;
        this.battleSpeed = speeds[parseInt(value, 10)];
    });

    this.start();
  }

  private start() {
    if (!this.payload) return;

    this.modalState = 'reveal';
    const eventMessage = this.querySelector<HTMLParagraphElement>('#event-message')!;
    const continueButton = this.querySelector<HTMLButtonElement>('#continue-button')!;

    // Always start by showing the room reveal.
    const roomRevealEvent = this.payload.log[0];
    eventMessage.textContent = t(roomRevealEvent.messageKey, roomRevealEvent.replacements);
    continueButton.textContent = t('global.continue');
    this.revealTimeout = window.setTimeout(() => {
      this.modalState = 'battle';
      this.renderBattleView();
    }, ROOM_CHOICE_VIEW_DELAY);
  }

  private handleContinue() {
    if (!this.payload) return;

    const eventMessage = this.querySelector<HTMLParagraphElement>('#event-message')!;
    const isBattle = this.payload.room.type === 'room_enemy' || this.payload.room.type === 'room_boss';

    if (this.modalState === 'reveal') {
      if (isBattle) {
        this.modalState = 'battle';
        this.renderBattleView();
      } else {
        // For non-battle rooms, show the outcome.
        this.modalState = 'outcome';
        const outcomeEvent = this.payload.log[1];
        if (outcomeEvent) {
          eventMessage.textContent = t(outcomeEvent.messageKey, outcomeEvent.replacements);
        }
        // The button's next click will dismiss the modal.
      }
    } else if (this.modalState === 'outcome') {
      this.dismiss(false);
    }
  }

  private renderInitialView(): string {
    return `
      <div id="adventurer-status-container" class="hidden"></div>
      <div id="enemy-status-container" class="hidden"></div>
      <div class="sunken-panel-tl mt-2 p-1" style="height: 60px;">
        <p id="event-message" class="text-center"></p>
      </div>
      <div id="progress-container" class="hidden mt-2">
        <div class="progress-bar" style="width: 100%;">
          <div id="progress-indicator" style="width: 0%; height: 100%;"></div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button id="continue-button"></button>
      </div>
      <div id="slider-container" class="hidden justify-end mt-4">
        <fieldset class="w-1/2">
          <legend>Playback Speed</legend>
          <div class="field-row" style="justify-content: center">
            <label for="speed-slider">Slower</label>
            <input id="speed-slider" type="range" min="0" max="4" value="2" />
            <label for="speed-slider">Faster</label>
          </div>
        </fieldset>
      </div>
    `;
  }

  private renderBattleView() {
    this.querySelector<HTMLDivElement>('#adventurer-status-container')!.classList.remove('hidden');
    this.querySelector<HTMLDivElement>('#enemy-status-container')!.classList.remove('hidden');
    this.querySelector<HTMLDivElement>('#progress-container')!.classList.remove('hidden');
    this.querySelector<HTMLDivElement>('#slider-container')!.classList.remove('hidden');

    const button = this.querySelector<HTMLButtonElement>('#continue-button')!;
    button.id = 'skip-button';
    button.textContent = t('global.skip');
    button.onclick = () => this.dismiss(true);

    this.currentEventIndex = 1; // Start from the first battle event
    this.renderNextBattleEvent();
  }

  private renderNextBattleEvent() {
    if (!this.payload || this.currentEventIndex >= this.payload.log.length) {
      const skipButton = this.querySelector<HTMLButtonElement>('#skip-button')!;
      if(skipButton) {
        skipButton.textContent = t('global.continue');
        skipButton.onclick = () => this.dismiss(false);
      }
      return;
    }

    const event = this.payload.log[this.currentEventIndex];
    this.renderAdventurerStatus(event.adventurer);
    if (event.enemy) {
      this.renderEnemyStatus(event.enemy);
    }
    this.querySelector<HTMLParagraphElement>('#event-message')!.textContent = t(event.messageKey, event.replacements);
    this.updateProgressBar();

    this.currentEventIndex++;
    this.battleTimeout = window.setTimeout(() => this.renderNextBattleEvent(), this.battleSpeed);
  }

  private renderAdventurerStatus(adventurer: AdventurerSnapshot) {
    const flowStateKey = `flow_states.${adventurer.flowState}`;
    this.querySelector<HTMLDivElement>('#adventurer-status-container')!.innerHTML = `
      <div class="status-bar">
        <p class="status-bar-field font-bold">${t('global.adventurer')}</p>
        <p class="status-bar-field">HP: ${adventurer.hp} / ${adventurer.maxHp}</p>
        <p class="status-bar-field">Power: ${adventurer.power}</p>
        <p class="status-bar-field">${t(flowStateKey)}</p>
      </div>
    `;
  }

  private renderEnemyStatus(enemy: EnemySnapshot) {
    this.querySelector<HTMLDivElement>('#enemy-status-container')!.innerHTML = `
      <div class="font-bold">${t(enemy.name)} (${enemy.count}/${enemy.total})</div>
      <div>HP: ${enemy.currentHp} / ${enemy.maxHp}</div>
      <div>Power: ${enemy.power}</div>
    `;
  }

  private updateProgressBar() {
    if (!this.payload) return;
    const progress = (this.currentEventIndex) / (this.payload.log.length - 1);
    this.querySelector<HTMLDivElement>('#progress-indicator')!.style.width = `${progress * 100}%`;
  }

  private dismiss(skipped: boolean) {
    clearTimeout(this.battleTimeout);
    this.querySelector<HTMLDivElement>('#progress-container')!.classList.add('hidden');
    this.querySelector<HTMLDivElement>('#slider-container')!.classList.add('hidden');
    this.remove();
    this.onDismiss({ skipped });
  }

  public static show(payload: EncounterPayload): Promise<{ skipped: boolean }> {
    return new Promise((resolve) => {
      const modal = document.createElement('encounter-modal') as EncounterModal;
      modal.payload = payload;
      modal.onDismiss = resolve;
      document.body.appendChild(modal);
    });
  }
}

customElements.define('encounter-modal', EncounterModal);