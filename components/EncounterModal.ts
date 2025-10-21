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

    document.body.style.overflow = 'hidden';
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
    const continueButton = this.querySelector<HTMLButtonElement>('#continue-button')!;

    // Always start by showing the room reveal.
    const roomRevealEvent = this.payload.log[0];
    this.appendLog(t(roomRevealEvent.messageKey, roomRevealEvent.replacements));
    continueButton.textContent = t('global.continue');
    this.revealTimeout = window.setTimeout(() => {
      this.modalState = 'battle';
      this.renderBattleView();
    }, ROOM_CHOICE_VIEW_DELAY);
  }

  private handleContinue() {
    if (!this.payload) return;

    const isBattle = this.payload.room.type === 'room_enemy' || this.payload.room.type === 'room_boss';

    if (this.modalState === 'reveal') {
      window.clearTimeout(this.revealTimeout);
      if (isBattle) {
        this.modalState = 'battle';
        this.renderBattleView();
      } else {
        // For non-battle rooms, show the outcome.
        this.modalState = 'outcome';
        const outcomeEvent = this.payload.log[1];
        if (outcomeEvent) {
          this.appendLog(t(outcomeEvent.messageKey, outcomeEvent.replacements));
        }
        // The button's next click will dismiss the modal.
      }
    } else if (this.modalState === 'outcome') {
      this.dismiss(false);
    }
  }

  private renderInitialView(): string {
    return `
      <div id="battlefield" class="flex justify-between items-center h-40">
        <div id="battle-adventurer" class="w-1/3 p-2"></div>
        <div id="battle-enemy" class="w-1/3 p-2 text-right"></div>
      </div>
      <ul id="event-log" class="tree-view" style="height: 150px; overflow-y: auto;">
      </ul>
      <div id="progress-container" class="hidden mt-2">
        <progress max="100" value="0" style="width:100%"></progress>
      </div>
      <div id="slider-container" class="hidden justify-end mt-4">
        <fieldset class="w-1/2">
          <legend>${t('global.speed')}</legend>
          <div class="field-row" style="justify-content: center">
            <label for="speed-slider">${t('global.slow')}</label>
            <input id="speed-slider" type="range" min="0" max="4" value="2" />
            <label for="speed-slider">${t('global.fast')}</label>
          </div>
        </fieldset>
      </div>
      <div class="flex justify-end mt-4">
        <button id="continue-button"></button>
      </div>
    `;
  }

  private renderBattleView() {
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

    const adventurerElement = this.querySelector<HTMLDivElement>('#battle-adventurer')!;
    const enemyElement = this.querySelector<HTMLDivElement>('#battle-enemy')!;
    const battlefieldElement = this.querySelector<HTMLDivElement>('#battlefield')!;

    // Clear previous animations
    adventurerElement.classList.remove('animate-attack-right', 'animate-attack-left', 'animate-shake', 'animate-defeat', 'animate-miss');
    enemyElement.classList.remove('animate-attack-right', 'animate-attack-left', 'animate-shake', 'animate-defeat', 'animate-miss');
    battlefieldElement.classList.remove('animate-shake');

    const event = this.payload.log[this.currentEventIndex];
    this.renderAdventurerStatus(event.adventurer);
    if (event.enemy) {
      this.renderEnemyStatus(event.enemy);
    }

    if (event.animations) {
      event.animations.forEach(anim => {
        let targetElement: HTMLElement | null = null;
        if (anim.target === 'adventurer') {
          targetElement = adventurerElement;
        } else if (anim.target === 'enemy') {
          targetElement = enemyElement;
        } else {
          targetElement = battlefieldElement;
        }

        if (anim.animation === 'attack') {
          const attackDirection = anim.target === 'adventurer' ? 'attack-right' : 'attack-left';
          targetElement.classList.add(`animate-${attackDirection}`);
        } else if (anim.animation === 'miss') {
          const missTarget = anim.target === 'adventurer' ? enemyElement : adventurerElement;
          missTarget.classList.add('animate-miss');
        } else {
          targetElement.classList.add(`animate-${anim.animation}`);
        }
      });
    }

    this.appendLog(t(event.messageKey, event.replacements));
    this.updateProgressBar();

    this.currentEventIndex++;
    this.battleTimeout = window.setTimeout(() => this.renderNextBattleEvent(), this.battleSpeed);
  }

  private renderAdventurerStatus(adventurer: AdventurerSnapshot) {
    const hpPercentage = (adventurer.hp / adventurer.maxHp) * 100;
    this.querySelector<HTMLDivElement>('#battle-adventurer')!.innerHTML = `
      <div class="text-lg font-bold">${adventurer.firstName} ${adventurer.lastName}</div>
      <progress max="100" value="${hpPercentage}" style-width="100%"></progress>
      <div>${adventurer.hp} / ${adventurer.maxHp}</div>
    `;
  }

  private renderEnemyStatus(enemy: EnemySnapshot) {
    const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;
    this.querySelector<HTMLDivElement>('#battle-enemy')!.innerHTML = `
      <div class="text-lg font-bold">${enemy.name}${enemy.total > 1 ? ` (${enemy.count}/${enemy.total})`:''}</div>
      <progress max="100" value="${hpPercentage}" style-width="100%"></progress>
      <div>${enemy.currentHp} / ${enemy.maxHp}</div>
    `;
  }

  private updateProgressBar() {
    if (!this.payload) return;
    const progress = (this.currentEventIndex) / (this.payload.log.length - 1);
    this.querySelector<HTMLProgressElement>('#progress-container progress')!.value = progress * 100;
  }

  private appendLog(message: string) {
    const logContainer = this.querySelector<HTMLUListElement>('#event-log')!;
    const li = document.createElement('li');
    li.textContent = message;
    logContainer.appendChild(li);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  private dismiss(skipped: boolean) {
    clearTimeout(this.battleTimeout);
    this.querySelector<HTMLDivElement>('#progress-container')!.classList.add('hidden');
    this.querySelector<HTMLDivElement>('#slider-container')!.classList.add('hidden');
    this.remove();
    document.body.style.overflow = '';
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
