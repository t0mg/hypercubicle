import type { Adventurer } from './adventurer';
import type { LootChoice } from '../types';
import { t } from '../text';
import { CHOICE_SCORE_THRESHOLD, MAX_POTIONS } from './constants';
import { Logger } from './logger';

export function getAdventurerChoice(adventurer: Adventurer, offeredLoot: LootChoice[], logger: Logger): { choice: LootChoice | null, reason: string } {
  const { traits, inventory } = adventurer;
  logger.debug(`--- Adventurer Decision --- (Offense: ${traits.offense}, Risk: ${traits.risk})`);
  const currentWeaponPower = inventory.weapon?.stats.power || 0;
  const currentArmorHp = inventory.armor?.stats.maxHp || 0;
  logger.debug(`Current Gear: Weapon Power(${currentWeaponPower}), Armor HP(${currentArmorHp})`);

  const scoreItem = (item: LootChoice): number => {
    let score = (item.rarity === 'Uncommon' ? 2 : item.rarity === 'Rare' ? 3 : 1) * 5;
    switch (item.type) {
      case 'Weapon':
        const powerDelta = (item.stats.power || 0) - currentWeaponPower;
        if (powerDelta <= 0 && item.id !== inventory.weapon?.id) return -1;
        score += powerDelta * (traits.offense / 10);
        if (powerDelta > 0) score += powerDelta * (traits.expertise / 10);
        const drawback = item.stats.maxHp || 0;
        if (drawback < 0) score += drawback * (100 - traits.risk) / 20;
        break;
      case 'Armor':
        const hpDelta = (item.stats.maxHp || 0) - currentArmorHp;
        if (hpDelta <= 0 && item.id !== inventory.armor?.id) return -1;
        score += hpDelta * (100 - traits.offense) / 10;
        if (hpDelta > 0) score += hpDelta * (traits.expertise / 10);
        const powerBonus = item.stats.power || 0;
        if (powerBonus > 0) score += powerBonus * (traits.offense / 15);
        const armorDrawback = item.stats.power || 0;
        if (armorDrawback < 0) score += armorDrawback * (traits.risk / 10);
        break;
      case 'Potion':
        const healthRatio = adventurer.hp / adventurer.maxHp;
        score += 10 * (100 - traits.risk) / 100;
        if (healthRatio < 0.7) score += 20 * (1 - healthRatio);
        score += 5 * (traits.expertise / 100);
        if (inventory.potions.length >= MAX_POTIONS) score *= 0.1;
        break;
    }
    return score;
  };

  const scoredLoot = offeredLoot.map(item => ({ item, score: scoreItem(item) })).filter(i => i.score > 0);
  scoredLoot.sort((a, b) => b.score - a.score);

  if (scoredLoot.length === 0 || scoredLoot[0].score < CHOICE_SCORE_THRESHOLD) {
    adventurer.modifyInterest(-15, 10);
    return { choice: null, reason: t('game_engine.adventurer_declines_offer') };
  }
  const choice = scoredLoot[0].item;
  logger.debug(`Adventurer chooses: ${choice.name} (Score: ${scoredLoot[0].score.toFixed(1)})`);
  if (scoredLoot[0].score > 60) {
    adventurer.modifyInterest(15, 5);
  } else if (scoredLoot[0].score > 30) {
    adventurer.modifyInterest(10, 8);
  } else {
    adventurer.modifyInterest(5, 5);
  }
  const reason: string = t('game_engine.adventurer_accepts_offer', { itemName: choice.name });
  return { choice, reason };
}
