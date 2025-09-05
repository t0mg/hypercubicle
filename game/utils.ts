import { LootChoice } from "../types";

export const generateId = (baseId: string) => `${baseId}_${Math.random().toString(36).substr(2, 9)}`;

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const generateRunDeck = (unlockedIds: string[], allItems: LootChoice[]): LootChoice[] => {
    const unlockedItems = allItems.filter(item => unlockedIds.includes(item.id));
    const deck: LootChoice[] = [];

    // Add all items with null cost
    unlockedItems.filter(item => item.cost === null).forEach(item => {
      deck.push({ ...item, instanceId: generateId(item.id) });
    });

    // Fill the rest of the deck with items that have a cost
    const potentialFillers = unlockedItems.filter(item => item.cost !== null);
    while(deck.length < 4 && potentialFillers.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialFillers.length);
        const item = potentialFillers[randomIndex];
        deck.push({ ...item, instanceId: generateId(item.id) });
        potentialFillers.splice(randomIndex, 1);
    }

    return shuffleArray(deck);
  };
