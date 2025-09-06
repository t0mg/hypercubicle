import { LootChoice, RoomChoice, GameState } from "../types";

export const generateId = (baseId: string) => `${baseId}_${Math.random().toString(36).substr(2, 9)}`;

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateDeck = <T extends { id: string; cost: number | null, rarity: string }>(
  unlockedIds: string[],
  allItems: T[],
  deckSize: number,
  itemFactory: (item: T) => T
): T[] => {
  const unlockedItems = allItems.filter(item => unlockedIds.includes(item.id));
  const deck: T[] = [];

  // Compute how many common, uncommon and rare items we want in the deck based on deck size
  const rarityDistribution: Record<string, number> = { 'Common': 0.6, 'Uncommon': 0.3, 'Rare': 0.1 };
  const rarityCounts: Record<string, number> = { 'Common': 0, 'Uncommon': 0, 'Rare': 0 };

  const distributionTarget: Record<string, number> = { 'Common': 0, 'Uncommon': 0, 'Rare': 0 };
  Object.keys(rarityDistribution).forEach(rarity => {
    distributionTarget[rarity] = Math.floor(deckSize * rarityDistribution[rarity]);
  });
  // Adjust for rounding errors
  let totalAssigned = Object.values(distributionTarget).reduce((a, b) => a + b, 0);
  while (totalAssigned < deckSize) {
    distributionTarget['Common'] += 1; // Add to common by default
    totalAssigned += 1;
  }

  // Add all purchased items once
  unlockedItems.filter(item => item.cost !== null).forEach(item => {
    deck.push(itemFactory(item));
    rarityCounts[item.rarity] += 1;
  });

  // Fill the rest of the deck to match rarity counts
  Object.keys(rarityDistribution).forEach((rarity, _) => {
    const candidates = unlockedItems.filter(item => item.rarity === rarity);
    while (rarityCounts[rarity] < distributionTarget[rarity]) {
      if (candidates.length === 0) break; // No more candidates of this rarity
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const item = candidates[randomIndex];
      deck.push(itemFactory(item));
      rarityCounts[rarity] += 1;
    }
  });

  // Backfill with common items if deck is not full
  const commonCandidates = unlockedItems.filter(item => item.rarity === 'Common');
  while (deck.length < deckSize && commonCandidates.length > 0) {
    const randomIndex = Math.floor(Math.random() * commonCandidates.length);
    const item = commonCandidates[randomIndex];
    deck.push(itemFactory(item));
  }

  return shuffleArray(deck);
};

export const generateLootDeck = (unlockedIds: string[], allItems: LootChoice[], deckSize: number): LootChoice[] => {
  return generateDeck(unlockedIds, allItems, deckSize, (item) => ({ ...item, instanceId: generateId(item.id) }));
};

export const generateRoomDeck = (unlockedIds: string[], allItems: RoomChoice[], deckSize: number): RoomChoice[] => {
  const deck = generateDeck(unlockedIds, allItems, deckSize, (item) => {
    const room = { ...item, instanceId: generateId(item.id) } as RoomChoice;
    if (room.type === 'enemy' && room.stats.minUnits && room.stats.maxUnits) {
      room.units = getRandomInt(room.stats.minUnits, room.stats.maxUnits);
    }
    return room;
  });
  return deck;
}

export const isRoomSelectionImpossible = (state: GameState): boolean => {
  return state.roomHand.length < 3 && !state.roomHand.some((room: RoomChoice) => room.type === 'boss');
}

export const isLootSelectionImpossible = (state: GameState): boolean => {
  const uniqueLootIds = [...new Set(state.hand.map(item => item.id))];
  return uniqueLootIds.length < 2 && state.hand.length > 0;
}