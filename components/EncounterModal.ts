import { t } from '../text';
import { EncounterPayload } from '../types';

const ROOM_CHOICE_VIEW_DELAY = 1500;
const BATTLE_EVENT_DELAY = 800;

export class EncounterModal extends HTMLElement {
  private onDismiss: (result: { skipped: boolean }) => void = () => { };
  private payload: EncounterPayload | null = null;
  private currentEventIndex = 0;
  private battleTimeout: number | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.payload) return;

    this.innerHTML = `
      <div id="encounter-overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="window" style="width: min(95vw, 600px);" role="dialog" aria-modal="true" aria-labelledby="encounter-modal-title">
          <div class="title-bar">
            <div class="title-bar-text" id="encounter-modal-title">${t('items_and_rooms.' + this.payload.room.id)}</div>
          </div>
          <div class="window-body p-2">
            ${this.renderInitialView()}
          </div>
        </div>
      </div>
    `;

    this.querySelector('#skip-button')!.addEventListener('click', () => {
      this.dismiss(true);
    });

    this.start();
  }

  private start() {
    if (!this.payload) return;
    if (this.payload.room.type === 'room_healing' || this.payload.room.type === 'room_trap') {
      this.renderRoomChoiceView();
    } else {
      this.renderBattleView();
    }
  }

  private renderInitialView(): string {
    return `
      <div id="adventurer-status-container" class="hidden">...</div>
      <div id="enemy-status-container" class="hidden">...</div>
      <div id="room-choice-container" class="hidden text-center p-4">...</div>
      <div class="sunken-panel-tl mt-2 p-1" style="height: 60px;">
        <p id="event-message" class="text-center"></p>
      </div>
      <div id="progress-container" class="hidden mt-2">
        <div class="progress-bar" style="width: 100%">
          <div id="progress-indicator" style="width: 0%"></div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button id="skip-button"></button>
      </div>
    `;
  }

  private renderRoomChoiceView() {
    if (!this.payload) return;
    const roomChoiceContainer = this.querySelector<HTMLDivElement>('#room-choice-container')!;
    const eventMessage = this.querySelector<HTMLParagraphElement>('#event-message')!;
    const skipButton = this.querySelector<HTMLButtonElement>('#skip-button')!;

    roomChoiceContainer.classList.remove('hidden');
    const firstEvent = this.payload.log[0];
    eventMessage.textContent = t(firstEvent.messageKey, firstEvent.replacements);

    const secondEvent = this.payload.log[1];
    if (secondEvent) {
      setTimeout(() => {
        eventMessage.textContent = t(secondEvent.messageKey, secondEvent.replacements);
      }, ROOM_CHOICE_VIEW_DELAY);
    }
    skipButton.textContent = t('global.continue');
    skipButton.onclick = () => this.dismiss(false);
  }

  private renderBattleView() {
    this.querySelector<HTMLDivElement>('#adventurer-status-container')!.classList.remove('hidden');
    this.querySelector<HTMLDivElement>('#enemy-status-container')!.classList.remove('hidden');
    this.querySelector<HTMLDivElement>('#progress-container')!.classList.remove('hidden');
    this.querySelector<HTMLButtonElement>('#skip-button')!.textContent = t('global.skip');

    this.renderNextBattleEvent();
  }

  private renderNextBattleEvent() {
    if (!this.payload || this.currentEventIndex >= this.payload.log.length) {
      this.querySelector<HTMLButtonElement>('#skip-button')!.textContent = t('global.continue');
      this.querySelector('#skip-button')!.addEventListener('click', () => this.dismiss(false));
      return;
    }

    const event = this.payload.log[this.currentEventIndex];
    this.renderAdventurerStatus(event.adventurer);
    if (event.enemy) {
      this.renderEnemyStatus(event.enemy);
    } else {
      this.querySelector<HTMLDivElement>('#enemy-status-container')!.innerHTML = '';
    }
    this.querySelector<HTMLParagraphElement>('#event-message')!.textContent = t(event.messageKey, event.replacements);
    this.updateProgressBar();

    this.currentEventIndex++;
    this.battleTimeout = setTimeout(() => this.renderNextBattleEvent(), BATTLE_EVENT_DELAY);
  }

  private renderAdventurerStatus(adventurer: import('../types').AdventurerSnapshot) {
    const flowStateKey = `flow_states.${Object.values(import('../types').FlowState)[adventurer.flowState].toLowerCase()}`;
    this.querySelector<HTMLDivElement>('#adventurer-status-container')!.innerHTML = `
      <div class="status-bar">
        <p class="status-bar-field font-bold">${t('global.adventurer')}</p>
        <p class="status-bar-field">HP: ${adventurer.hp} / ${adventurer.maxHp}</p>
        <p class.status-bar-field">Power: ${adventurer.power}</p>
        <p class="status-bar-field">${t(flowStateKey)}</p>
      </div>
    `;
  }

  private renderEnemyStatus(enemy: import('../types').EnemySnapshot) {
    this.querySelector<HTMLDivElement>('#enemy-status-container')!.innerHTML = `
      <div class="font-bold">${t(enemy.name)} (${enemy.count}/${enemy.total})</div>
      <div>HP: ${enemy.currentHp} / ${enemy.maxHp}</div>
      <div>Power: ${enemy.power}</div>
    `;
  }

  private updateProgressBar() {
    if (!this.payload) return;
    const progress = (this.currentEventIndex + 1) / this.payload.log.length;
    this.querySelector<HTMLDivElement>('#progress-indicator')!.style.width = `${progress * 100}%`;
  }

  private dismiss(skipped: boolean) {
    clearTimeout(this.battleTimeout);
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