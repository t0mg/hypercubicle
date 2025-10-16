import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../rendering';
import { tooltipManager } from '../tooltip';
import { GameEngine } from '../game/engine';
import { GameState, GamePhase } from '../types';

vi.mock('../tooltip', () => ({
  tooltipManager: {
    handleMouseLeave: vi.fn(),
  },
}));

vi.mock('../text', () => ({
  t: (key) => key,
}));

describe('render', () => {
  let appElement;
  let engine;
  let state;

  beforeEach(() => {
    appElement = document.createElement('div');
    engine = {} as GameEngine;
    state = { phase: 'MENU' } as GameState;
    vi.clearAllMocks();
  });

  it('should call tooltipManager.handleMouseLeave on every render', () => {
    render(appElement, state, engine);
    expect(tooltipManager.handleMouseLeave).toHaveBeenCalled();
  });
});