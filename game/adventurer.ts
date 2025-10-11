import { AdventurerTraits, AdventurerInventory, LootChoice, FlowState } from '../types';
import { Logger } from './logger';
import { getFlowState } from './utils';

const BASE_ADVENTURER_STATS = { hp: 100, maxHp: 100, power: 5 };
const CHALLENGE_HISTORY_MAX_LENGTH = 3;

export class Adventurer {
    public hp: number;
    public maxHp: number;
    public power: number;
    public traits: AdventurerTraits;
    public inventory: AdventurerInventory;
    public activeBuffs: LootChoice[];
    public logger: Logger;
    public skill: number;
    public challengeHistory: number[];
    public flowState: FlowState;
    public roomHistory: string[];
    public lootHistory: string[];
    public boredomCounter: number;

    constructor(traits: AdventurerTraits, logger: Logger) {
        this.hp = BASE_ADVENTURER_STATS.hp;
        this.maxHp = BASE_ADVENTURER_STATS.maxHp;
        this.power = BASE_ADVENTURER_STATS.power;
        this.skill = traits.skill;
        this.challengeHistory = [50]; // Starting challenge
        this.flowState = FlowState.Boredom; // Initial state
        this.traits = traits;
        this.inventory = { weapon: null, armor: null, potions: [] };
        this.activeBuffs = [];
        this.logger = logger;
        this.roomHistory = [];
        this.lootHistory = [];
        this.boredomCounter = 0;
    }

    public get challenge(): number {
        if (this.challengeHistory.length === 0) {
            return 50; // Default challenge
        }
        const sum = this.challengeHistory.reduce((a, b) => a + b, 0);
        return sum / this.challengeHistory.length;
    }

    public modifySkill(amount: number): void {
        const oldSkill = this.skill;
        this.skill = Math.max(0, Math.min(100, this.skill + amount));
        if (oldSkill.toFixed(1) !== this.skill.toFixed(1)) {
            this.logger.debug(`Skill changed from ${oldSkill.toFixed(1)} to ${this.skill.toFixed(1)}`);
        }
        this.updateFlowState();
    }

    public modifyChallenge(value: number): void {
        const oldChallenge = this.challenge;
        const newChallengeValue = Math.max(0, Math.min(100, value));
        this.challengeHistory.push(newChallengeValue);
        if (this.challengeHistory.length > CHALLENGE_HISTORY_MAX_LENGTH) {
            this.challengeHistory.shift(); // Keep the array size fixed
        }
        this.logger.debug(`Challenge changed from ${oldChallenge.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${newChallengeValue})`);
        this.updateFlowState();
    }

    public updateFlowState(): void {
        const oldFlowState = this.flowState;
        this.flowState = getFlowState(this.skill, this.challenge);
        if (oldFlowState !== this.flowState) {
            this.logger.info('info_flow_state_changed', { from: FlowState[oldFlowState], to: FlowState[this.flowState] });
            this.logger.log(`Flow state changed to ${FlowState[this.flowState]}`, 'INFO', { event: 'flow_state_changed', flowState: FlowState[this.flowState] });
        }
    }

    public equip(item: LootChoice): void {
        if (item.type === 'item_weapon') {
            this.inventory.weapon = item;
        } else if (item.type === 'item_armor') {
            this.inventory.armor = item;
        }
        this.recalculateStats();
    }

    public addPotion(item: LootChoice): void {
        if (item.type === 'item_potion') {
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

    public toJSON(): any {
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            power: this.power,
            traits: this.traits,
            inventory: this.inventory,
            activeBuffs: this.activeBuffs,
            skill: this.skill,
            challengeHistory: this.challengeHistory,
            flowState: this.flowState,
            roomHistory: this.roomHistory,
            lootHistory: this.lootHistory,
            boredomCounter: this.boredomCounter,
        };
    }

    public static fromJSON(data: any, logger: Logger): Adventurer {
        const traits = data.traits;
        const adventurer = new Adventurer(traits, logger);

        adventurer.hp = data.hp;
        adventurer.maxHp = data.maxHp;
        adventurer.power = data.power;
        adventurer.inventory = data.inventory;
        adventurer.activeBuffs = data.activeBuffs;
        adventurer.skill = data.skill;
        adventurer.challengeHistory = data.challengeHistory;
        adventurer.flowState = data.flowState;
        adventurer.roomHistory = data.roomHistory;
        adventurer.lootHistory = data.lootHistory;
        adventurer.boredomCounter = data.boredomCounter;

        return adventurer;
    }
}
