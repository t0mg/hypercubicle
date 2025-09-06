
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

import { Adventurer } from './game/adventurer';
import { Logger } from './game/logger';
import { UnlockableFeature } from './game/unlocks';

export type { Adventurer };

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
    draftedRoom?: number;
    justDrafted?: boolean;
}

export interface RoomChoice {
    id: string,
    instanceId: string;
    name: string;
    type: 'enemy' | 'boss' | 'healing' | 'trap';
    rarity: string;
    cost: number | null;
    stats: {
        attack?: number;
        hp?: number;
        maxUnits?: number;
        minUnits?: number;
    };
    units?: number;
    justDrafted?: boolean;
    draftedRoom?: number;
}

export type GamePhase =
  | 'MENU'
  | 'LOADING'
  | 'DESIGNER_CHOOSING_LOOT'
  | 'AWAITING_ADVENTURER_CHOICE'
  | 'DESIGNER_CHOOSING_ROOM'
  | 'AWAITING_ENCOUNTER_FEEDBACK'
  | 'RUN_OVER'
  | 'SHOP'
  | 'UNLOCK_SCREEN';

export interface Encounter {
    enemyCount: number;
    enemyPower: number;
    enemyHp: number;
}

export interface GameState {
    phase: GamePhase;
    designer: {
        balancePoints: number;
    };
    adventurer: Adventurer;
    unlockedDeck: string[]; // All item IDs the player owns
    availableDeck: LootChoice[]; // Items available for the current run, becomes the draw pile
    hand: LootChoice[]; // The player's current hand of cards
    unlockedRoomDeck: string[];
    availableRoomDeck: RoomChoice[];
    roomHand: RoomChoice[];
    handSize: number;
    shopItems: (LootChoice | RoomChoice)[];
    offeredLoot: LootChoice[];
    offeredRooms: RoomChoice[];
    feedback: string | string[];
    logger: Logger;
    run: number;
    room: number;
    encounter?: Encounter;
    runEnded: {
        isOver: boolean;
        reason: string;
    };
    newlyUnlocked: UnlockableFeature[];
}
