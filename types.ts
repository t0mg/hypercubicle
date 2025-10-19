
export enum FlowState {
  Arousal = 'arousal',
  Flow = 'flow',
  Control = 'control',
  Relaxation = 'relaxation',
  Boredom = 'boredom',
  Apathy = 'apathy',
  Worry = 'worry',
  Anxiety = 'anxiety',
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

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface LootChoice {
  id: string;
  instanceId: string;
  rarity: Rarity;
  type: 'item_weapon' | 'item_armor' | 'item_potion' | 'item_buff';
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
  id: string;
  entity_id?: string;
  instanceId: string;
  type: 'room_enemy' | 'room_boss' | 'room_healing' | 'room_trap';
  rarity: Rarity;
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
  | 'AWAITING_ENCOUNTER_RESULT'
  | 'RUN_OVER'
  | 'SHOP'
  | 'UNLOCK_SCREEN';

export interface Encounter {
  enemyCount: number;
  enemyPower: number;
  enemyHp: number;
}

export interface AdventurerSnapshot {
  firstName: string;
  lastName: string;
  hp: number;
  maxHp: number;
  power: number;
  flowState: FlowState;
  inventory: AdventurerInventory;
}

export interface EnemySnapshot {
  currentHp: number;
  maxHp: number;
  power: number;
  name: string;
  count: number;
  total: number;
}

export type EncounterAnimationTarget = 'adventurer' | 'enemy';

export interface EncounterAnimation {
  target?: EncounterAnimationTarget;
  animation: 'attack' | 'shake' | 'defeat';
}

export interface EncounterEvent {
  messageKey: string;
  replacements?: { [key: string]: string | number };
  adventurer: AdventurerSnapshot;
  enemy?: EnemySnapshot;
  animations?: EncounterAnimation[];
}

export type EncounterLog = EncounterEvent[];

export interface EncounterPayload {
  room: RoomChoice;
  log: EncounterLog;
  finalAdventurer: Adventurer;
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
  run: number;
  room: number;
  encounterPayload?: EncounterPayload;
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
  removeItem(key: string): void;
}

export interface DataLoader {
  loadJson(path: string): Promise<any>;
}
