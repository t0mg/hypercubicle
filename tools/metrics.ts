import { LogEntry } from '../game/logger';
import { MetaState } from '../game/meta';
import { t } from '../text';

export class Metrics {
  private runs: number = 0;
  private adventurers: number = 0;
  private highestRun: number = 0;
  private unlockedFeatures: Set<string> = new Set();
  private roomUsage: Map<string, number> = new Map();
  private itemUsage: Map<string, number> = new Map();
  private purchases: Map<string, number> = new Map();
  private battles: number = 0;
  private monsters: number = 0;
  private totalBP: number = 0;
  private finalFlowStateCounts: Map<string, number> = new Map();
  private flowStateOccurrences: Map<string, number> = new Map();
  private runEndCounts: { death: number, dropout: number } = { death: 0, dropout: 0 };

  public recordRunEnd(flowState: string, reason: 'death' | 'dropout'): void {
    this.finalFlowStateCounts.set(flowState, (this.finalFlowStateCounts.get(flowState) || 0) + 1);
    if (reason === 'death') {
      this.runEndCounts.death++;
    } else {
      this.runEndCounts.dropout++;
    }
  }

  public recordFlowState(flowState: string): void {
    this.flowStateOccurrences.set(flowState, (this.flowStateOccurrences.get(flowState) || 0) + 1);
  }

  public handleLogEntry = (entry: LogEntry): void => {
    if (entry.data?.event === 'room_encountered') {
      const roomName = t('items_and_rooms.' + entry.data.room.id);
      this.roomUsage.set(roomName, (this.roomUsage.get(roomName) || 0) + 1);
      if (entry.data.room.type === 'enemy' || entry.data.room.type === 'boss') {
        this.battles++;
        this.monsters += entry.data.room.units || 1;
      }
    } else if (entry.data?.event === 'item_chosen') {
      const itemName = t('items_and_rooms.' + entry.data.item.id);
      this.itemUsage.set(itemName, (this.itemUsage.get(itemName) || 0) + 1);
    } else if (entry.data?.event === 'item_purchased') {
      const itemName = t('items_and_rooms.' + entry.data.item.id);
      this.purchases.set(itemName, (this.purchases.get(itemName) || 0) + 1);
    } else if (entry.data?.event === 'run_end') {
      this.totalBP += entry.data.bp;
    } else if (entry.data?.event === 'flow_state_changed') {
      this.recordFlowState(entry.data.flowState);
    }
  };

  public setMeta(meta: MetaState) {
    this.adventurers = meta.adventurers;
    this.highestRun = meta.highestRun;
    meta.unlockedFeatures.forEach(f => this.unlockedFeatures.add(f));
  }

  public incrementRuns() {
    this.runs++;
  }

  private _printSortedMap(title: string, map: Map<string, number>): void {
    console.log(title);
    const sortedEntries = [...map.entries()].sort((a, b) => b[1] - a[1]);
    sortedEntries.forEach(([name, count]) => console.log(`${name}: ${count}`));
  }

  public report(): void {
    console.log("\n--- Simulation Report ---");
    console.log(`Total Runs: ${this.runs}`);
    console.log(`Total Adventurers: ${this.adventurers}`);
    console.log(`Highest Run Reached: ${this.highestRun}`);
    console.log(`Unlocked Features: ${this.unlockedFeatures.size}`);
    console.log(`Average BP per Adventurer: ${this.adventurers > 0 ? (this.totalBP / this.adventurers).toFixed(2) : 'N/A'}`);

    this._printSortedMap("\n--- Room Usage ---", this.roomUsage);
    this._printSortedMap("\n--- Item Usage ---", this.itemUsage);
    this._printSortedMap("\n--- Shop Purchases ---", this.purchases);

    console.log(`\n--- Combat Stats ---`);
    console.log(`Total Battles: ${this.battles}`);
    console.log(`Total Monsters Defeated: ${this.monsters}`);

    this._printSortedMap("\n--- Flow State Occurrences ---", this.flowStateOccurrences);
    this._printSortedMap("\n--- Final Flow States ---", this.finalFlowStateCounts);

    console.log(`\n--- Run End Reasons ---`);
    console.log(`Death: ${this.runEndCounts.death}`);
    console.log(`Dropout: ${this.runEndCounts.dropout}`);
    console.log("-----------------------\n");
  }
}