import type { Adventurer } from './adventurer';
import type { LootChoice, RoomChoice, Encounter, BattleAction } from '../types';
import { t } from '../text';
import { CHOICE_SCORE_THRESHOLD, MAX_POTIONS } from './constants';
import { Logger } from './logger';
import { FlowState } from '../types';

const REPETITION_PENALTY = 10;

// --- Choice Scoring ---

function scoreItem(adventurer: Adventurer, item: LootChoice): number {
  const { traits, inventory, hp, maxHp } = adventurer;
  let score = (item.rarity === 'uncommon' ? 2 : item.rarity === 'rare' ? 3 : 1) * 5;
  const currentWeaponPower = inventory.weapon?.stats.power || 0;
  const currentArmorHp = inventory.armor?.stats.maxHp || 0;

  switch (item.type) {
    case 'item_weapon':
      const powerDelta = (item.stats.power || 0) - currentWeaponPower;
      if (powerDelta <= 0 && item.id !== inventory.weapon?.id) return -1;
      score += powerDelta * (traits.offense / 10);
      if (powerDelta > 0) score += powerDelta * (adventurer.skill / 10);
      const drawback = item.stats.maxHp || 0;
      if (drawback < 0) score += drawback * (100 - traits.resilience) / 20;
      break;
    case 'item_armor':
      const hpDelta = (item.stats.maxHp || 0) - currentArmorHp;
      if (hpDelta <= 0 && item.id !== inventory.armor?.id) return -1;
      score += hpDelta * (100 - traits.offense) / 10;
      if (hpDelta > 0) score += hpDelta * (adventurer.skill / 10);
      const powerBonus = item.stats.power || 0;
      if (powerBonus > 0) score += powerBonus * (traits.offense / 15);
      const armorDrawback = item.stats.power || 0;
      if (armorDrawback < 0) score += armorDrawback * (traits.resilience / 10);
      break;
    case 'item_potion':
      const healthRatio = hp / maxHp;
      score += 10 * (100 - traits.resilience) / 100;
      if (healthRatio < 0.7) score += 20 * (1 - healthRatio);
      score += 5 * (adventurer.skill / 100);
      if (inventory.potions.length >= MAX_POTIONS) score *= 0.1;
      break;
  }
  return score;
}

// --- Public AI Entry Points ---

export function getAdventurerLootChoice(adventurer: Adventurer, offeredLoot: LootChoice[], logger: Logger): LootChoice | null {
  logger.debug(`--- Adventurer Loot Decision --- (Offense: ${adventurer.traits.offense}, Resilience: ${adventurer.traits.resilience}, Skill: ${adventurer.skill})`);

  const scoredLoot = offeredLoot.map(item => ({ item, score: scoreItem(adventurer, item) })).filter(i => i.score > 0);
  scoredLoot.sort((a, b) => b.score - a.score);

  if (scoredLoot.length === 0 || scoredLoot[0].score < CHOICE_SCORE_THRESHOLD) {
    return null;
  }

  const choice = scoredLoot[0].item;
  logger.debug(`Adventurer chooses: ${t('items_and_rooms.' + choice.id)} (Score: ${scoredLoot[0].score.toFixed(1)})`);
  return choice;
}

export function getAdventurerBattleChoice(adventurer: Adventurer, _encounter: Encounter): BattleAction {
  const { flowState, hp, maxHp, inventory, traits } = adventurer;
  const healthRatio = hp / maxHp;

  if (inventory.potions.length === 0) {
    return 'attack';
  }

  let potionThreshold = 0.5; // Default threshold
  switch (flowState) {
    case FlowState.Anxiety: case FlowState.Worry:
      potionThreshold = 0.8; break;
    case FlowState.Arousal: case FlowState.Flow:
      potionThreshold = 0.6; break;
    case FlowState.Control: case FlowState.Relaxation:
      potionThreshold = 0.4; break;
    case FlowState.Boredom: case FlowState.Apathy:
      potionThreshold = 0.2; break;
  }
  potionThreshold -= (traits.resilience / 200); // Resilience makes them less likely to panic

  if (healthRatio < Math.max(0.1, potionThreshold)) {
    return 'use_potion';
  }

  return 'attack';
}


// --- Event Processing ---

export function processLootChoice(adventurer: Adventurer, choice: LootChoice | null, offeredLoot: LootChoice[]): void {
  if (choice) {
    adventurer.lootHistory.push(choice.id);
    const repetitionCount = adventurer.lootHistory.filter(id => id === choice.id).length;
    if (repetitionCount > 2) {
      adventurer.modifyChallenge(adventurer.challenge - REPETITION_PENALTY);
      adventurer.logger.info('info_repetitive_choice', { name: t('items_and_rooms.' + choice.id) });
    }

    const score = scoreItem(adventurer, choice);
    if (score > 60) {
      adventurer.modifySkill(10);
      adventurer.modifyChallenge(adventurer.challenge + 5);
    } else if (score > 30) {
      adventurer.modifySkill(5);
      adventurer.modifyChallenge(adventurer.challenge + 2);
    } else {
      adventurer.modifySkill(2);
    }
  } else {
    if (offeredLoot.length > 0) {
      adventurer.modifyChallenge(adventurer.challenge - 5); // Good loot declined
    } else {
      adventurer.modifyChallenge(adventurer.challenge - 10); // No loot offered
    }
  }
  adventurer.updateFlowState();
}

export function processRoomEntry(adventurer: Adventurer, chosenRoom: RoomChoice): void {
  adventurer.roomHistory.push(chosenRoom.id);
  const repetitionCount = adventurer.roomHistory.filter(id => id === chosenRoom.id).length;
  if (repetitionCount > 2) {
    adventurer.modifyChallenge(adventurer.challenge - REPETITION_PENALTY);
    adventurer.logger.info('info_deja_vu', { name: t('items_and_rooms.' + chosenRoom.id) });
  }

  let challengeModifier = 0;
  switch (chosenRoom.type) {
    case 'room_enemy': challengeModifier = 5; break;
    case 'room_boss': challengeModifier = 15; break;
    case 'room_trap': challengeModifier = 10; break;
    case 'room_healing': challengeModifier = -15; break;
  }
  adventurer.modifyChallenge(adventurer.challenge + challengeModifier);
  adventurer.updateFlowState();
}

export function processTrap(adventurer: Adventurer): void {
  adventurer.modifySkill(-2);
  adventurer.updateFlowState();
}

export function processBattleTurn(adventurer: Adventurer, outcome: 'hit' | 'miss' | 'take_damage'): void {
  switch (outcome) {
    case 'hit':
      adventurer.modifySkill(0.5);
      break;
    case 'miss':
      adventurer.modifySkill(-0.5);
      break;
    case 'take_damage':
      adventurer.modifyChallenge(adventurer.challenge + 1);
      break;
  }
  adventurer.updateFlowState();
}

export function processBattleOutcome(adventurer: Adventurer, hpLostRatio: number, enemiesDefeated: number, totalEnemies: number): string {
  let battleFeedback: string;
  if (hpLostRatio > 0.7) {
    battleFeedback = t('game_engine.too_close_for_comfort');
    adventurer.modifyChallenge(adventurer.challenge + 10);
    adventurer.modifySkill(-3);
  } else if (hpLostRatio > 0.4) {
    battleFeedback = t('game_engine.great_battle');
    adventurer.modifyChallenge(adventurer.challenge + 5);
    adventurer.modifySkill(5);
  } else if (enemiesDefeated > 3 && adventurer.traits.offense > 60) {
    battleFeedback = t('game_engine.easy_fight');
    adventurer.modifyChallenge(adventurer.challenge - 10);
  } else {
    battleFeedback = t('game_engine.worthy_challenge');
    adventurer.modifyChallenge(adventurer.challenge - 2);
    adventurer.modifySkill(2);
  }

  if (enemiesDefeated === totalEnemies) {
    adventurer.modifySkill(1 * enemiesDefeated);
  }

  adventurer.updateFlowState();
  return battleFeedback;
}
