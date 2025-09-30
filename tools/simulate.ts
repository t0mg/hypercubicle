import { GameEngine } from '../game/engine';
import { MetaManager } from '../game/meta';
import { rng } from '../game/random';
import { LootChoice, RoomChoice, GameState, FlowState } from '../types';
import { initLocalization } from '../text';
import { MemoryStorage } from '../game/storage';
import { GameSaver } from '../game/saver';
import { UnlockableFeature } from '../game/unlocks';
import { DataLoaderFileSystem } from './data-loader-file-system';
import { Metrics } from './metrics';

const getDesignerRoomChoice = (state: GameState): RoomChoice[] => {
  // A simple AI: returns the last three rooms.
  return state.roomHand.slice(-3);
};

const getDesignerLootChoice = (state: GameState): string[] => {
  const numToOffer = rng.nextInt(2, 4);
  const offeredLoot: LootChoice[] = [];
  const offeredIdsSet = new Set<string>();

  const shuffledHand = [...state.hand].sort(() => rng.nextFloat() - 0.5);

  for (const item of shuffledHand) {
    if (offeredLoot.length >= numToOffer) {
      break;
    }
    if (!offeredIdsSet.has(item.id)) {
      offeredLoot.push(item);
      offeredIdsSet.add(item.id);
    }
  }
  return offeredLoot.map(c => c.instanceId);
};

export const getDesignerShopChoice = (state: GameState): string | null => {
  const affordableItems = state.shopItems.filter(item => item.cost !== null && item.cost <= state.designer.balancePoints);
  if (affordableItems.length > 0) {
    return affordableItems[0].id;
  }
  return null;
}

class Simulation {
  private engine: GameEngine;
  private metaManager: MetaManager;
  private dataLoader: DataLoaderFileSystem;
  private isVerbose: boolean;

  constructor(seed: number, isVerbose: boolean) {
    this.isVerbose = isVerbose;
    rng.setSeed(seed);
    const storage = new MemoryStorage();
    const saver = new GameSaver(storage);
    this.metaManager = new MetaManager(storage);
    this.dataLoader = new DataLoaderFileSystem();
    this.engine = new GameEngine(this.metaManager, this.dataLoader, saver);
  }

  public async run(runs: number) {
    await initLocalization(this.dataLoader);
    await this.engine.init();
    console.log('Simulation started.');

    const metrics = new Metrics();

    const attachLogger = () => {
      if (this.engine.gameState) {
        this.engine.gameState.logger.on(metrics.handleLogEntry);
        if (!this.isVerbose) {
          this.engine.gameState.logger.muted = true;
        }
      }
    }

    const initialUnlocked = {
      items: (this.engine as any)._allItems.filter((item: LootChoice) => item.cost === null).map((item: LootChoice) => item.id),
      rooms: (this.engine as any)._allRooms.filter((room: RoomChoice) => room.cost === null).map((room: RoomChoice) => room.id),
    };

    this.metaManager.metaState.unlockedFeatures.push(UnlockableFeature.WORKSHOP);

    this.engine.startNewGame(initialUnlocked);
    attachLogger();

    let totalRunCount = 0;
    while (totalRunCount < runs) {
      totalRunCount++;
      while (!this.engine.gameState?.runEnded.isOver) {
        if (!this.engine.gameState) {
          break;
        }

        switch (this.engine.gameState.phase) {
          case 'DESIGNER_CHOOSING_ROOM':
            const roomChoices = getDesignerRoomChoice(this.engine.gameState);
            if (roomChoices.length < 3) {
              this.engine.forceEndRun();
            } else {
              this.engine.runEncounter(roomChoices);
            }
            break;
          case 'DESIGNER_CHOOSING_LOOT':
            const lootChoices = getDesignerLootChoice(this.engine.gameState);
            this.engine.presentOffer(lootChoices);
            break;
        }
      }
      metrics.incrementRuns();
      if (!this.engine.gameState) break;

      const { adventurer, runEnded } = this.engine.gameState;
      const flowStateName = (FlowState as any)[adventurer.flowState];
      const endReason = runEnded.reason.includes('fell') ? 'death' : 'dropout';
      metrics.recordRunEnd(flowStateName, endReason);

      const decision = this.engine.gameState.runEnded.decision;
      if (!decision) {
        break;
      }
      this.engine.handleEndOfRun(decision);

      if (this.engine.gameState.phase === 'SHOP') {
        const choice = getDesignerShopChoice(this.engine.gameState);
        if (choice) {
          this.engine.purchaseItem(choice);
        }
        this.engine.exitWorkshop(); // This will start a new run
        attachLogger();
      } else if (this.engine.gameState.phase === 'MENU') {
        this.engine.startNewGame(initialUnlocked);
        attachLogger();
      }
    }
    metrics.setMeta(this.metaManager.metaState);
    metrics.report();
  }
}

const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const runsArg = args.find(arg => !isNaN(parseInt(arg, 10)));
const runs = runsArg ? parseInt(runsArg, 10) : 10;
const seedArg = args.find(arg => arg.startsWith('--seed='));
const seed = seedArg ? parseInt(seedArg.split('=')[1], 10) : Date.now();
const simulation = new Simulation(seed, isVerbose);
simulation.run(runs);