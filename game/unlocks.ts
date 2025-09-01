import { t } from '../text';

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
    feature: UnlockableFeature.HAND_SIZE_INCREASE,
    runThreshold: 3,
    title: () => t('unlocks.hand_size_increase.title'),
    description: () => t('unlocks.hand_size_increase.description'),
  },
  {
    feature: UnlockableFeature.BOSS_FIGHTS,
    runThreshold: 5,
    title: () => t('unlocks.boss_fights.title'),
    description: () => t('unlocks.boss_fights.description'),
  },
  {
    feature: UnlockableFeature.CUSTOM_ENCOUNTERS,
    runThreshold: 8,
    title: () => t('unlocks.custom_encounters.title'),
    description: () => t('unlocks.custom_encounters.description'),
  },
  {
    feature: UnlockableFeature.PARTY_CONSTRAINTS,
    runThreshold: 12,
    title: () => t('unlocks.party_constraints.title'),
    description: () => t('unlocks.party_constraints.description'),
  },
];
