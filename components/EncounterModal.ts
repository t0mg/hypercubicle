import { it } from 'node:test';
import { t } from '../text';
import { EncounterPayload, AdventurerSnapshot, EnemySnapshot, FlowState } from '../types';
import { render } from '@/rendering';

const ROOM_CHOICE_VIEW_DELAY = 3000;
const BATTLE_EVENT_DELAY = 900;

export class EncounterModal extends HTMLElement {
  private onDismiss: (result: { skipped: boolean }) => void = () => { };
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
      <div id="battlefield" class="flex justify-between items-stretch h-40">
        <div id="battle-adventurer" class="w-2/5 p-2 flex flex-col justify-center"></div>
        <div id="battle-enemy" class="w-2/5 p-2 text-right flex flex-col justify-center"></div>
      </div>
      <ul id="event-log" class="tree-view" style="height: 150px; overflow-y: auto;">
      </ul>
      <div id="progress-container" class="hidden mt-2">
        <progress max="100" value="0" class="w-full"></progress>
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
      if (skipButton) {
        skipButton.textContent = t('global.continue');
        skipButton.onclick = () => this.dismiss(false);
      }
      return;
    }

    const adventurerElement = this.querySelector<HTMLDivElement>('#battle-adventurer')!;
    const enemyElement = this.querySelector<HTMLDivElement>('#battle-enemy')!;
    const battlefieldElement = this.querySelector<HTMLDivElement>('#battlefield')!;

    // Clear previous animations
    const allAnimations = ['animate-attack-right', 'animate-attack-left',
        'animate-shake', 'animate-defeat', 'animate-heal', 'animate-miss-right',
        'animate-miss-left', 'animate-spawn'];
    adventurerElement.classList.remove(...allAnimations);
    enemyElement.classList.remove(...allAnimations);
    battlefieldElement.classList.remove(...allAnimations);

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
          const missDirection = anim.target === 'adventurer' ? 'miss-right' : 'miss-left';
          targetElement.classList.add(`animate-${missDirection}`);
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
    const adventurerElement = this.querySelector<HTMLDivElement>('#battle-adventurer')!;
    const hpPercentage = (adventurer.hp / adventurer.maxHp) * 100;

    if (adventurerElement.innerHTML === '') {
      adventurerElement.innerHTML = `
        <div class="text-lg font-bold" data-name>${adventurer.firstName} ${adventurer.lastName}</div>
        <progress max="100" class="w-full" data-hp-progress></progress>
        <div data-hp-text></div>
      `;
    }

    const progress = adventurerElement.querySelector<HTMLProgressElement>('[data-hp-progress]')!;
    const hpText = adventurerElement.querySelector<HTMLDivElement>('[data-hp-text]')!;

    progress.value = hpPercentage;
    hpText.textContent = `${Math.max(0, adventurer.hp)} / ${adventurer.maxHp}`;
  }

  private renderEnemyStatus(enemy: EnemySnapshot) {
    const enemyElement = this.querySelector<HTMLDivElement>('#battle-enemy')!;
    const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;

    // One-time initialization of the enemy display structure.
    if (enemyElement.innerHTML === '') {
      enemyElement.innerHTML = `
        <div class="text-lg font-bold" data-enemy-name data-count="1"></div>
        <progress max="100" class="w-full" data-hp-progress></progress>
        <div data-hp-text></div>
      `;
    }

    const nameElement = enemyElement.querySelector<HTMLDivElement>('[data-enemy-name]')!;
    const progress = enemyElement.querySelector<HTMLProgressElement>('[data-hp-progress]')!;
    const hpText = enemyElement.querySelector<HTMLDivElement>('[data-hp-text]')!;

    const previousCount = parseInt(nameElement.dataset.count || '1', 10);
    const isNewEnemyInGroup = previousCount < enemy.count;

    // To prevent an animated transition on the health bar when a new enemy from a group appears,
    // we detach and re-attach the progress and text elements. This forces an instant redraw.
    if (isNewEnemyInGroup) {
      progress.remove();
      hpText.remove();
    }

    nameElement.dataset.count = enemy.count.toString();
    nameElement.textContent = `${enemy.name}${enemy.total > 1 ? ` (${enemy.count}/${enemy.total})` : ''}`;
    progress.value = hpPercentage;
    hpText.textContent = `${Math.max(0, enemy.currentHp)} / ${enemy.maxHp}`;

    if (isNewEnemyInGroup) {
      enemyElement.append(progress, hpText);
    }
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
