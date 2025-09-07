import { AdventurerTraits, AdventurerInventory, LootChoice } from '../types';
import { Logger } from './logger';

const BASE_ADVENTURER_STATS = { hp: 100, maxHp: 100, power: 5 };

export class Adventurer {
    public hp: number;
    public maxHp: number;
    public power: number;
    public interest: number;
    public traits: AdventurerTraits;
    public inventory: AdventurerInventory;
    public activeBuffs: LootChoice[];
    public logger: Logger;

    constructor(traits: AdventurerTraits, logger: Logger) {
        this.hp = BASE_ADVENTURER_STATS.hp;
        this.maxHp = BASE_ADVENTURER_STATS.maxHp;
        this.power = BASE_ADVENTURER_STATS.power;
        this.interest = 33 + Math.floor(Math.random() * 50);
        this.traits = traits;
        this.inventory = { weapon: null, armor: null, potions: [] };
        this.activeBuffs = [];
        this.logger = logger;
    }

    public modifyInterest(base: number, randomDeviation: number): void {
        const expertiseDampening = Math.max(0.1, (1000 - this.traits.expertise) / 1000);
        const randomValue = (Math.random() * 2 - 1) * randomDeviation;
        const totalModification = (base + randomValue) * expertiseDampening;

        const oldInterest = this.interest;
        this.interest = Math.max(0, Math.min(100, this.interest + totalModification));
        this.logger.debug(`Interest changed from ${oldInterest.toFixed(1)} to ${this.interest.toFixed(1)} (Base: ${base}, Rand: ${randomValue.toFixed(1)}, Total: ${totalModification.toFixed(1)})`);
    }

    public equip(item: LootChoice): void {
        if (item.type === 'Weapon') {
            this.inventory.weapon = item;
        } else if (item.type === 'Armor') {
            this.inventory.armor = item;
        }
        this.recalculateStats();
    }

    public addPotion(item: LootChoice): void {
        if (item.type === 'Potion') {
            this.inventory.potions.push(item);
        }
    }

    public applyBuff(item: LootChoice): void {
        this.activeBuffs.push(item);
        this.recalculateStats();
    }

    public updateBuffs(): void {
        const expiredBuffs = this.activeBuffs.filter(b => b.stats.duration !== undefined && b.stats.duration <= 1);

        this.activeBuffs = this.activeBuffs.map(b => {
            if (b.stats.duration) {
                b.stats.duration -= 1;
            }
            return b;
        }).filter(b => b.stats.duration === undefined || b.stats.duration > 0);

        if (expiredBuffs.length > 0) {
            this.recalculateStats();
        }
    }

    public recalculateStats(): void {
        const healthPercentage = this.hp / this.maxHp;

        let power = BASE_ADVENTURER_STATS.power;
        let maxHp = BASE_ADVENTURER_STATS.maxHp;

        if (this.inventory.weapon) {
            power += this.inventory.weapon.stats.power || 0;
            maxHp += this.inventory.weapon.stats.maxHp || 0;
        }
        if (this.inventory.armor) {
            power += this.inventory.armor.stats.power || 0;
            maxHp += this.inventory.armor.stats.maxHp || 0;
        }

        this.activeBuffs.forEach(buff => {
            power += buff.stats.power || 0;
            maxHp += buff.stats.maxHp || 0;
        });

        this.power = power;
        this.maxHp = maxHp;
        this.hp = Math.round(this.maxHp * healthPercentage);
    }
}
