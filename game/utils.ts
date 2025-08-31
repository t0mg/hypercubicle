import type { LootChoice } from '../types';
import { MIN_DECK_SIZE } from './constants';

export const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

export const generateRunDeck = (unlockedItemIds: string[], allItems: LootChoice[]): LootChoice[] => {
    let instanceCounter = 0;
    const allItemsMap = new Map(allItems.map(i => [i.id, i]));
    const unlockedItems = unlockedItemIds.map(id => allItemsMap.get(id)).filter(Boolean) as LootChoice[];

    const createItemInstance = (item: LootChoice): LootChoice => {
        instanceCounter++;
        return { ...item, instanceId: `${item.id}-${instanceCounter}` };
    };

    const startingItems = unlockedItems.filter(item => item.cost === null);
    const otherUnlockedItems = unlockedItems.filter(item => item.cost !== null);

    let deck: LootChoice[] = [];

    if (startingItems.length > 0) {
        for (const item of startingItems) {
            deck.push(createItemInstance(item), createItemInstance(item), createItemInstance(item), createItemInstance(item));
        }
    }

    deck.push(...otherUnlockedItems.map(createItemInstance));

    let i = 0;
    while (deck.length < MIN_DECK_SIZE && startingItems.length > 0) {
        deck.push(createItemInstance(startingItems[i % startingItems.length]));
        i++;
    }

    return shuffleArray(deck);
};
