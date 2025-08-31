import { t } from '../text';
import { LocalizedMessage } from '../types';

export enum UnlockableFeature {
  WORKSHOP = 'workshop',
  HAND_SIZE_INCREASE = 'hand_size_increase',
  CUSTOM_ENCOUNTERS = 'custom_encounters',
  PARTY_CONSTRAINTS = 'party_constraints',
  BOSS_FIGHTS = 'boss_fights',
}

export interface Unlock {
  feature: UnlockableFeature;
  runThreshold: number;
  title: () => LocalizedMessage;
  description: () => LocalizedMessage;
}

export const UNLOCKS: Unlock[] = [
  {
    feature: UnlockableFeature.WORKSHOP,
    runThreshold: 2,
    title: () => ({ key: 'unlocks.workshop.title' }),
    description: () => ({ key: 'unlocks.workshop.description' }),
  },
  {
    feature: UnlockableFeature.HAND_SIZE_INCREASE,
    runThreshold: 3,
    title: () => ({ key: 'unlocks.hand_size_increase.title' }),
    description: () => ({ key: 'unlocks.hand_size_increase.description' }),
  },
  {
    feature: UnlockableFeature.BOSS_FIGHTS,
    runThreshold: 5,
    title: () => ({ key: 'unlocks.boss_fights.title' }),
    description: () => ({ key: 'unlocks.boss_fights.description' }),
  },
  {
    feature: UnlockableFeature.CUSTOM_ENCOUNTERS,
    runThreshold: 8,
    title: () => ({ key: 'unlocks.custom_encounters.title' }),
    description: () => ({ key: 'unlocks.custom_encounters.description' }),
  },
  {
    feature: UnlockableFeature.PARTY_CONSTRAINTS,
    runThreshold: 12,
    title: () => ({ key: 'unlocks.party_constraints.title' }),
    description: () => ({ key: 'unlocks.party_constraints.description' }),
  },
];
