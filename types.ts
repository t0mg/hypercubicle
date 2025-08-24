
export interface AdventurerTraits {
    offense: number; // 0-100: Defensive -> Offensive
    risk: number;    // 0-100: Conservative -> Optimistic
    expertise: number; // 0-100: Increases with runs
}

export interface AdventurerInventory {
    weapon: LootChoice | null;
    armor: LootChoice | null;
    potions: LootChoice[];
}

export interface Adventurer {
    hp: number;
    maxHp: number;
    power: number;
    interest: number; // 0-100
    traits: AdventurerTraits;
    inventory: AdventurerInventory;
}

export interface LootChoice {
    id: string;
    instanceId: string;
    name: string;
    rarity: string;
    type: 'Weapon' | 'Armor' | 'Potion';
    stats: {
        hp?: number; // For potions
        power?: number; // For equipment
        maxHp?: number; // For equipment
    };
    cost: number | null;
    minRun: number;
}

export type GamePhase = 
    | 'DESIGNER_CHOOSING_LOOT' 
    | 'AWAITING_ADVENTURER_CHOICE' 
    | 'DESIGNER_CHOOSING_DIFFICULTY'
    | 'AWAITING_ENCOUNTER_FEEDBACK'
    | 'RUN_OVER'
    | 'SHOP';

export interface GameState {
    phase: GamePhase;
    designer: {
        balancePoints: number;
    };
    adventurer: Adventurer;
    unlockedDeck: string[]; // All item IDs the player owns
    availableDeck: LootChoice[]; // Items available for the current run, becomes the draw pile
    hand: LootChoice[]; // The player's current hand of cards
    shopItems: LootChoice[];
    offeredLoot: LootChoice[];
    feedback: string;
    log: string[];
    run: number;
    floor: number;
    debugEncounterParams?: { baseDamage: number; difficultyFactor: number };
    gameOver: {
        isOver: boolean;
        reason: string;
    };
}
