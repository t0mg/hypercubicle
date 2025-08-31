import { AdventurerTraits, AdventurerInventory, LootChoice } from '../types';

const BASE_ADVENTURER_STATS = { hp: 100, maxHp: 100, power: 5 };

export class Adventurer {
    public hp: number;
    public maxHp: number;
    public power: number;
    public interest: number;
    public traits: AdventurerTraits;
    public inventory: AdventurerInventory;

    constructor(traits: AdventurerTraits) {
        this.hp = BASE_ADVENTURER_STATS.hp;
        this.maxHp = BASE_ADVENTURER_STATS.maxHp;
        this.power = BASE_ADVENTURER_STATS.power;
        this.interest = 33 + Math.floor(Math.random() * 50);
        this.traits = traits;
        this.inventory = { weapon: null, armor: null, potions: [] };
    }

    public modifyInterest(base: number, randomDeviation: number): void {
        const expertiseDampening = Math.max(0.1, (1000 - this.traits.expertise) / 1000);
        const randomValue = (Math.random() * 2 - 1) * randomDeviation;
        const totalModification = (base + randomValue) * expertiseDampening;

        this.interest = Math.max(0, Math.min(100, this.interest + totalModification));
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

    public recalculateStats(): void {
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

        const hpDiff = maxHp - this.maxHp;
        this.power = power;
        this.maxHp = maxHp;
        this.hp += Math.max(0, hpDiff);
    }
}
