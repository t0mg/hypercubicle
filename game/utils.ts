import { LootChoice, RoomChoice } from "../types";
import { MIN_DECK_SIZE } from "./constants";

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

export const generateRunDeck = (unlockedIds: string[], allItems: LootChoice[]): LootChoice[] => {
    const unlockedItems = allItems.filter(item => unlockedIds.includes(item.id));
    const deck: LootChoice[] = [];

    // Add all items with null cost
    unlockedItems.filter(item => item.cost === null).forEach(item => {
      deck.push({ ...item, instanceId: generateId(item.id) });
    });

    // Fill the rest of the deck with items that have a cost
    const potentialFillers = unlockedItems.filter(item => item.cost !== null);
    while(deck.length < MIN_DECK_SIZE && potentialFillers.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialFillers.length);
        const item = potentialFillers[randomIndex];
        deck.push({ ...item, instanceId: generateId(item.id) });
    }

    return shuffleArray(deck);
  };

export const generateRoomDeck = (unlockedIds: string[], allItems: RoomChoice[]): RoomChoice[] => {
    const unlockedItems = allItems.filter(item => unlockedIds.includes(item.id));
    const deck: RoomChoice[] = [];

    unlockedItems.filter(item => item.cost === null).forEach(item => {
        const room = { ...item, instanceId: generateId(item.id) };
        if (room.type === 'enemy' && room.stats.minUnits && room.stats.maxUnits) {
            room.units = getRandomInt(room.stats.minUnits, room.stats.maxUnits);
        }
        deck.push(room);
    });

    const potentialFillers = unlockedItems.filter(item => item.cost !== null);
    while(deck.length < MIN_DECK_SIZE && potentialFillers.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialFillers.length);
        const item = potentialFillers[randomIndex];
        const room = { ...item, instanceId: generateId(item.id) };
        if (room.type === 'enemy' && room.stats.minUnits && room.stats.maxUnits) {
            room.units = getRandomInt(room.stats.minUnits, room.stats.maxUnits);
        }
        deck.push(room);
    }

    return shuffleArray(deck);
}
