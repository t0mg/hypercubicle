import { GameEngine } from '../game/engine';
import { MetaManager } from '../game/meta';
import { rng } from '../game/random';
import { LootChoice, RoomChoice, GameState, FlowState } from '../types';
import { initLocalization } from '../text';
import { MemoryStorage } from '../game/storage';
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
  private isSilent: boolean;

  constructor(seed: number, isSilent: boolean) {
    this.isSilent = isSilent;
    rng.setSeed(seed);
    const storage = new MemoryStorage();
    this.metaManager = new MetaManager(storage);
    this.dataLoader = new DataLoaderFileSystem();
    this.engine = new GameEngine(this.metaManager, this.dataLoader);
  }

  public async run(runs: number) {
    await initLocalization(this.dataLoader);
    await this.engine.init();
    console.log('Simulation started.');

    const metrics = new Metrics();

    const initialUnlocked = {
        items: (this.engine as any)._allItems.filter((item: LootChoice) => item.cost === null).map((item: LootChoice) => item.id),
        rooms: (this.engine as any)._allRooms.filter((room: RoomChoice) => room.cost === null).map((room: RoomChoice) => room.id),
    };

    this.metaManager.metaState.unlockedFeatures.push(UnlockableFeature.WORKSHOP);

    for (let i = 0; i < runs; i++) {
        this.engine.startNewGame(initialUnlocked);
        if (this.engine.gameState) {
            this.engine.gameState.logger.on(metrics.handleLogEntry);
            if (this.isSilent) {
                this.engine.gameState.logger.muted = true;
            }
        }

        let runCount = 0;
        while(true) {
            runCount++;
            while (!this.engine.gameState?.runEnded.isOver) {
                if (!this.engine.gameState) {
                break;
                }

                switch (this.engine.gameState.phase) {
                case 'DESIGNER_CHOOSING_ROOM':
                    const roomChoices = getDesignerRoomChoice(this.engine.gameState);
                    if (roomChoices.length === 0) {
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

            // Record metrics before handling the end of the run
            const { adventurer, runEnded } = this.engine.gameState;
            const flowStateName = (FlowState as any)[adventurer.flowState];
            const endReason = runEnded.reason.includes('fell') ? 'death' : 'dropout';
            metrics.recordRunEnd(flowStateName, endReason);

            const decision = this.engine.gameState.runEnded.decision;
            if (!decision) {
                // Should not happen
                break;
            }
            this.engine.handleEndOfRun(decision);

            if (this.engine.gameState.phase === 'SHOP') {
                const choice = getDesignerShopChoice(this.engine.gameState);
                if (choice) {
                    this.engine.purchaseItem(choice);
                }
                this.engine.exitWorkshop(); // This will start a new run
            } else {
                // Adventurer retired or died
                break;
            }
        }
    }
    metrics.setMeta(this.metaManager.metaState);
    if (!this.isSilent) {
        metrics.report();
    }
  }
}

const args = process.argv.slice(2);
const isSilent = !args.includes('--verbose');
const runsArg = args.find(arg => !isNaN(parseInt(arg, 10)));
const runs = runsArg ? parseInt(runsArg, 10) : 10;
const seedArg = args.find(arg => arg.startsWith('--seed='));
const seed = seedArg ? parseInt(seedArg.split('=')[1], 10) : Date.now();
const simulation = new Simulation(seed, isSilent);
simulation.run(runs);
