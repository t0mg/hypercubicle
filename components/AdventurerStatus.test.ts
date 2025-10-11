import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdventurerStatus } from './AdventurerStatus';
import { FlowState } from '../types';
import { Adventurer } from '../game/adventurer';
import { MetaState } from '../game/meta';
import { Logger } from '../game/logger';

// Mock t function
vi.mock('../text', () => ({
  t: (key: string) => key,
}));

describe('AdventurerStatus', () => {
  let adventurer: Adventurer;
  let metaState: MetaState;
  let element: AdventurerStatus;

  beforeEach(() => {
    // Define the custom element if it's not already defined
    if (!customElements.get('adventurer-status')) {
      customElements.define('adventurer-status', AdventurerStatus);
    }
    const logger = new Logger();

    adventurer = new Adventurer({ offense: 5, resilience: 5, skill: 5 }, logger);
    adventurer.hp = 80;
    adventurer.flowState = FlowState.Control;

    metaState = {
      adventurers: 1,
      unlockedFeatures: [],
      highestRun: 0,
    };

    element = document.createElement('adventurer-status') as AdventurerStatus;
    document.body.appendChild(element);
  });

  it('should not re-create the health bar element on update', () => {
    // Initial render
    element.adventurer = adventurer;
    element.metaState = metaState;

    const healthBar1 = element.querySelector('#hp-bar');
    expect(healthBar1).not.toBeNull();

    // Update health
    const updatedAdventurer = { ...adventurer, hp: 50 } as Adventurer;
    element.adventurer = updatedAdventurer;

    const healthBar2 = element.querySelector('#hp-bar');
    expect(healthBar2).not.toBeNull();

    // Assert that the element instance is the same
    expect(healthBar1).toBe(healthBar2);
  });
});