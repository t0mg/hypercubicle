import { GameEngine } from '../../game/engine';
import { render } from '../../rendering';
import { GameState, GamePhase } from '../../types';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ConfirmModal } from '../../components/ConfirmModal';

// Mock the ConfirmModal
vi.mock('../../components/ConfirmModal', () => ({
  ConfirmModal: {
    show: vi.fn().mockResolvedValue(true),
  },
}));

describe('rendering', () => {
  let appElement: HTMLElement;
  let engine: GameEngine;
  let state: GameState;

  beforeEach(() => {
    // Set up a basic DOM environment
    document.body.innerHTML = '<div id="app"></div>';
    appElement = document.getElementById('app')!;

    // Create a mock engine and state
    engine = {
      quitGame: vi.fn(),
      isWorkshopUnlocked: vi.fn().mockReturnValue(false),
      metaManager: {
        metaState: {
          adventurers: 1
        }
      }
    } as any;

    state = {
      phase: 'DESIGNER_CHOOSING_LOOT' as GamePhase,
      adventurer: {} as any,
      logger: {} as any,
      run: 1,
      room: 1,
      availableDeck: [],
      availableRoomDeck: [],
      designer: { balancePoints: 100 },
      feedback: '',
      hand: [],
      roomHand: [],
    } as GameState;
  });

  it('should only register one quit-game listener after multiple renders', async () => {
    // Render multiple times to simulate game updates. The first render should add the listener.
    // Subsequent renders should not add more listeners.
    render(appElement, state, engine);
    render(appElement, state, engine);
    render(appElement, state, engine);

    // Find and click the quit button
    const quitButton = appElement.querySelector('#quit-game-btn');
    quitButton?.dispatchEvent(new MouseEvent('click'));

    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Expect the confirmation modal to have been called only once
    expect(ConfirmModal.show).toHaveBeenCalledTimes(1);
  });
});