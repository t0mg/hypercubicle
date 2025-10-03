
export enum FlowState {
    Arousal,
    Flow,
    Control,
    Relaxation,
    Boredom,
    Apathy,
    Worry,
    Anxiety,
}

export interface AdventurerTraits {
    offense: number; // 0-100: Defensive -> Offensive
    resilience: number; // 0-100: Copes with adversity
    skill: number; // 0-100: Increases with runs
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
    type: 'Weapon' | 'Armor' | 'Potion' | 'Buff';
    stats: {
        hp?: number; // For potions
        power?: number; // For equipment
        maxHp?: number; // For equipment
        duration?: number; // For buffs
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

export type BattleAction = 'attack' | 'use_potion';

export type GamePhase =
  | 'MENU'
  | 'LOADING'
  | 'DESIGNER_CHOOSING_LOOT'
  | 'DESIGNER_CHOOSING_ROOM'
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
        success: boolean;
        decision: 'continue' | 'retire' | null;
    };
    newlyUnlocked: UnlockableFeature[];
    shopReturnPhase?: GamePhase | null;
}

export interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export interface DataLoader {
    loadJson(path: string): Promise<any>;
}
