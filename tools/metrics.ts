import { LogEntry } from '../game/logger';
import { MetaState } from '../game/meta';

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

  public handleLogEntry = (entry: LogEntry): void => {
    if (entry.data?.event === 'room_encountered') {
      const roomName = entry.data.room.name;
      this.roomUsage.set(roomName, (this.roomUsage.get(roomName) || 0) + 1);
      if (entry.data.room.type === 'enemy' || entry.data.room.type === 'boss') {
        this.battles++;
        this.monsters += entry.data.room.units || 1;
      }
    } else if (entry.data?.event === 'item_chosen') {
      const itemName = entry.data.item.name;
      this.itemUsage.set(itemName, (this.itemUsage.get(itemName) || 0) + 1);
    } else if (entry.data?.event === 'item_purchased') {
        const itemName = entry.data.item.name;
        this.purchases.set(itemName, (this.purchases.get(itemName) || 0) + 1);
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

  public getRuns(): number {
      return this.runs;
  }

  public report(): void {
    console.log("\n--- Simulation Report ---");
    console.log(`Total Runs: ${this.runs}`);
    console.log(`Total Adventurers: ${this.adventurers}`);
    console.log(`Highest Run Reached: ${this.highestRun}`);
    console.log(`Unlocked Features: ${this.unlockedFeatures.size}`);
    console.log(`\n--- Room Usage ---`);
    this.roomUsage.forEach((count, name) => console.log(`${name}: ${count}`));
    console.log(`\n--- Item Usage ---`);
    this.itemUsage.forEach((count, name) => console.log(`${name}: ${count}`));
    console.log(`\n--- Shop Purchases ---`);
    this.purchases.forEach((count, name) => console.log(`${name}: ${count}`));
    console.log(`\n--- Combat Stats ---`);
    console.log(`Total Battles: ${this.battles}`);
    console.log(`Total Monsters Defeated: ${this.monsters}`);
    console.log("-----------------------\n");
  }
}
