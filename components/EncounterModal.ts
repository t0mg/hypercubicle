import { t } from '../text';
import { EncounterPayload } from '../types';

const ROOM_CHOICE_VIEW_DELAY = 1500;
const BATTLE_EVENT_DELAY = 800;

export class EncounterModal {
  private element: HTMLDivElement;
  private onDismiss: (result: { skipped: boolean }) => void;
  private payload: EncounterPayload;
  private currentEventIndex = 0;
  private battleTimeout: number | undefined;

  private constructor(
    payload: EncounterPayload,
    onDismiss: (result: { skipped: boolean }) => void
  ) {
    this.onDismiss = onDismiss;
    this.payload = payload;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
    });

    const windowEl = document.createElement('div');
    this.element = windowEl;
    windowEl.className = 'window';
    windowEl.style.width = 'min(95vw, 600px)';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-modal', 'true');
    windowEl.setAttribute('aria-labelledby', 'encounter-modal-title');

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    const titleBarText = document.createElement('div');
    titleBarText.id = 'encounter-modal-title';
    titleBarText.className = 'title-bar-text';
    titleBar.appendChild(titleBarText);
    windowEl.appendChild(titleBar);

    const windowBody = document.createElement('div');
    windowBody.className = 'window-body p-2';
    windowBody.innerHTML = this.renderInitialView();

    windowEl.appendChild(windowBody);
    overlay.appendChild(windowEl);
    document.body.appendChild(overlay);

    titleBarText.textContent = t('items_and_rooms.' + payload.room.id);
    this.element.querySelector('#skip-button')!.addEventListener('click', () => {
      this.dismiss(true);
    });

    this.start();
  }

  private start() {
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
    const roomChoiceContainer = this.element.querySelector<HTMLDivElement>('#room-choice-container')!;
    const eventMessage = this.element.querySelector<HTMLParagraphElement>('#event-message')!;
    const skipButton = this.element.querySelector<HTMLButtonElement>('#skip-button')!;

    roomChoiceContainer.classList.remove('hidden');
    const firstEvent = this.payload.log[0];
    eventMessage.textContent = t(firstEvent.messageKey, firstEvent.replacements);

    const secondEvent = this.payload.log[1];
    if (secondEvent) {
      setTimeout(() => {
        eventMessage.textContent = t(secondEvent.messageKey, secondEvent.replacements);
        skipButton.textContent = t('global.continue');
        setTimeout(() => this.dismiss(false), ROOM_CHOICE_VIEW_DELAY);
      }, ROOM_CHOICE_VIEW_DELAY);
    } else {
      skipButton.textContent = t('global.continue');
      setTimeout(() => this.dismiss(false), ROOM_CHOICE_VIEW_DELAY);
    }
  }

  private renderBattleView() {
    this.element.querySelector<HTMLDivElement>('#adventurer-status-container')!.classList.remove('hidden');
    this.element.querySelector<HTMLDivElement>('#enemy-status-container')!.classList.remove('hidden');
    this.element.querySelector<HTMLDivElement>('#progress-container')!.classList.remove('hidden');
    this.element.querySelector<HTMLButtonElement>('#skip-button')!.textContent = t('global.skip');

    this.renderNextBattleEvent();
  }

  private renderNextBattleEvent() {
    if (this.currentEventIndex >= this.payload.log.length) {
      this.element.querySelector<HTMLButtonElement>('#skip-button')!.textContent = t('global.continue');
      return;
    }

    const event = this.payload.log[this.currentEventIndex];
    this.renderAdventurerStatus(event.adventurer);
    if (event.enemy) {
      this.renderEnemyStatus(event.enemy);
    } else {
      this.element.querySelector<HTMLDivElement>('#enemy-status-container')!.innerHTML = '';
    }
    this.element.querySelector<HTMLParagraphElement>('#event-message')!.textContent = t(event.messageKey, event.replacements);
    this.updateProgressBar();

    this.currentEventIndex++;
    this.battleTimeout = setTimeout(() => this.renderNextBattleEvent(), BATTLE_EVENT_DELAY);
  }

  private renderAdventurerStatus(adventurer: import('../types').AdventurerSnapshot) {
    this.element.querySelector<HTMLDivElement>('#adventurer-status-container')!.innerHTML = `
      <div class="font-bold">${t('global.adventurer')}</div>
      <div>HP: ${adventurer.hp} / ${adventurer.maxHp}</div>
      <div>Power: ${adventurer.power}</div>
    `;
  }

  private renderEnemyStatus(enemy: import('../types').EnemySnapshot) {
    this.element.querySelector<HTMLDivElement>('#enemy-status-container')!.innerHTML = `
      <div class.font-bold">${enemy.name} (${enemy.count}/${enemy.total})</div>
      <div>HP: ${enemy.currentHp} / ${enemy.maxHp}</div>
      <div>Power: ${enemy.power}</div>
    `;
  }

  private updateProgressBar() {
    const progress = (this.currentEventIndex + 1) / this.payload.log.length;
    this.element.querySelector<HTMLDivElement>('#progress-indicator')!.style.width = `${progress * 100}%`;
  }

  private dismiss(skipped: boolean) {
    clearTimeout(this.battleTimeout);
    this.element.parentElement!.remove();
    this.onDismiss({ skipped });
  }

  public static show(payload: EncounterPayload): Promise<{ skipped: boolean }> {
    return new Promise((resolve) => {
      new EncounterModal(payload, resolve);
    });
  }
}

customElements.define(
  'encounter-modal',
  class extends HTMLElement {
    constructor() {
      super();
    }
  }
);