import { t } from '../text';

export enum UnlockableFeature {
  WORKSHOP = 'workshop',  // Gives access to the workshop where players can puchase items and rooms.
  ROOM_DECK_SIZE_INCREASE = 'room_deck_size_increase', // Increases the room deck size to 36.
  HAND_SIZE_INCREASE = 'hand_size_increase', // Increases the hand size to 12 items and 12 rooms.
  ADVENTURER_TRAITS = "ADVENTURER_TRAITS", // Reveals the offense/risk/expertise traits of the adventurer.
  BP_MULTIPLIER = "BP_MULTIPLIER", // Doubles the base BP gain.
  WORKSHOP_ACCESS = "WORKSHOP_ACCESS", // Allows players to access the workshop at any time, puts the purchase at the top of their deck.
  BP_MULTIPLIER_2 = "BP_MULTIPLIER_2", // Doubles the base BP gain again, for a total of 4x.
}

export interface Unlock {
  feature: UnlockableFeature;
  runThreshold: number;
  title: () => string;
  description: () => string;
}

export const UNLOCKS: Unlock[] = [
  {
    feature: UnlockableFeature.WORKSHOP,
    runThreshold: 2,
    title: () => t('unlocks.workshop.title'),
    description: () => t('unlocks.workshop.description'),
  },
  {
    feature: UnlockableFeature.ROOM_DECK_SIZE_INCREASE,
    runThreshold: 3,
    title: () => t('unlocks.room_deck_size_increase.title'),
    description: () => t('unlocks.room_deck_size_increase.description'),
  },
  {
    feature: UnlockableFeature.HAND_SIZE_INCREASE,
    runThreshold: 4,
    title: () => t('unlocks.hand_size_increase.title'),
    description: () => t('unlocks.hand_size_increase.description'),
  },
  {
    feature: UnlockableFeature.ADVENTURER_TRAITS,
    runThreshold: 5,
    title: () => t('unlocks.adventurer_traits.title'),
    description: () => t('unlocks.adventurer_traits.description'),
  },
  {
    feature: UnlockableFeature.BP_MULTIPLIER,
    runThreshold: 8,
    title: () => t('unlocks.bp_multiplier.title'),
    description: () => t('unlocks.bp_multiplier.description'),
  },
  {
    feature: UnlockableFeature.WORKSHOP_ACCESS,
    runThreshold: 13,
    title: () => t('unlocks.workshop_access.title'),
    description: () => t('unlocks.workshop_access.description'),
  },
  {
    feature: UnlockableFeature.BP_MULTIPLIER_2,
    runThreshold: 21,
    title: () => t('unlocks.bp_multiplier_2.title'),
    description: () => t('unlocks.bp_multiplier_2.description'),
  },
];
