import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdventurerStatus } from './AdventurerStatus';
import { FlowState, Adventurer as AdventurerType } from '../types';
import { Adventurer } from '../game/adventurer';
import { MetaState } from '../game/meta';
import { UnlockableFeature } from '../game/unlocks';

// Mock t function
vi.mock('../text', () => ({
  t: (key: string, replacements?: any) => {
    if (replacements) {
      return `${key}_${Object.values(replacements).join('_')}`;
    }
    return key;
  },
}));

vi.mock('../game/logger', () => {
  const Logger = vi.fn();
  Logger.prototype.info = vi.fn();
  Logger.prototype.debug = vi.fn();
  Logger.getInstance = vi.fn(() => new Logger());
  return { Logger };
});

describe('AdventurerStatus', () => {
  let adventurer: AdventurerType;
  let metaState: MetaState;
  let element: AdventurerStatus;

  beforeEach(() => {
    if (!customElements.get('adventurer-status')) {
      customElements.define('adventurer-status', AdventurerStatus);
    }

    const traits = { offense: 5, resilience: 5, skill: 0 };
    adventurer = new Adventurer(traits);
    adventurer.hp = 80;
    adventurer.flowState = FlowState.Control;
    adventurer.skill = 50; // Set a non-zero in-run skill

    metaState = {
      adventurers: 1,
      unlockedFeatures: [],
      highestRun: 0,
    };

    element = document.createElement('adventurer-status') as AdventurerStatus;
    document.body.appendChild(element);
  });

  it('should not re-create the health bar element on update', () => {
    element.adventurer = adventurer;
    element.metaState = metaState;

    const healthBar1 = element.querySelector('#hp-bar');
    expect(healthBar1).not.toBeNull();

    const updatedAdventurer = JSON.parse(JSON.stringify(adventurer));
    updatedAdventurer.hp = 50;
    element.adventurer = updatedAdventurer;

    const healthBar2 = element.querySelector('#hp-bar');
    expect(healthBar2).not.toBeNull();
    expect(healthBar1).toBe(healthBar2);
  });

  it('should display the in-run skill, not the base trait skill', () => {
    metaState.unlockedFeatures.push(UnlockableFeature.ADVENTURER_TRAITS);
    element.adventurer = adventurer;
    element.metaState = metaState;

    const skillTraitElement = element.querySelector('#skill-trait');
    expect(skillTraitElement).not.toBeNull();
    expect(skillTraitElement!.textContent).toBe('50');
  });
});