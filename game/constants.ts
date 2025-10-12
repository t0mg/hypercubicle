import { Rarity } from "@/types";

export const INTEREST_THRESHOLD = 15;
export const MAX_POTIONS = 99;
export const RARITY_SCORE: Record<Rarity, number> = { 'common': 1, 'uncommon': 2, 'rare': 3, 'legendary': 5 };
export const CHOICE_SCORE_THRESHOLD = 10;
export const BP_PER_ROOM = 10;
export const DECK_SIZE = 32;
export const ROOM_DECK_SIZE = 18;
export const HAND_SIZE = 8;
export const ADVENTURER_ACTION_DELAY_MS = 300;
