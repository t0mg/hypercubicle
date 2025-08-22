
import { useState, useEffect, useCallback } from 'react';
import type { GameState, LootChoice, Adventurer, AdventurerTraits, AdventurerInventory } from '../types';

const INTEREST_THRESHOLD = 15;
const MIN_CARDS_TO_OFFER = 3; // Minimum cards required to present a valid offer.
const MAX_POTIONS = 3;
const RARITY_SCORE: Record<string, number> = { 'Common': 1, 'Uncommon': 2, 'Rare': 3 };
const BASE_ADVENTURER_STATS = { hp: 100, maxHp: 100, power: 5 };
const CHOICE_SCORE_THRESHOLD = 10; // Min score for an adventurer to accept an item
const BP_PER_FLOOR = 10;
const INITIAL_UNLOCKED_DECK = ['loot_1', 'loot_2', 'loot_3', 'loot_4', 'loot_5'];
const MIN_DECK_SIZE = 32;

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const generateRunDeck = (unlockedItemIds: string[], allItems: LootChoice[]): LootChoice[] => {
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

    // Add multiple copies of starting items to form a base
    if (startingItems.length > 0) {
        for (const item of startingItems) {
            deck.push(createItemInstance(item), createItemInstance(item), createItemInstance(item), createItemInstance(item)); // 4 copies each
        }
    }

    // Add one copy of other unlocked items
    deck.push(...otherUnlockedItems.map(createItemInstance));
    
    // Fill up to minimum size with more starting items, cycling through them
    let i = 0;
    while (deck.length < MIN_DECK_SIZE && startingItems.length > 0) {
        deck.push(createItemInstance(startingItems[i % startingItems.length]));
        i++;
    }

    return shuffleArray(deck);
};


const _recalculateStats = (inventory: AdventurerInventory): { power: number, maxHp: number } => {
    let power = BASE_ADVENTURER_STATS.power;
    let maxHp = BASE_ADVENTURER_STATS.maxHp;

    const weapon = inventory.weapon;
    if (weapon) {
        power += weapon.stats.power || 0;
        maxHp += weapon.stats.maxHp || 0;
    }

    const armor = inventory.armor;
    if (armor) {
        power += armor.stats.power || 0;
        maxHp += armor.stats.maxHp || 0;
    }

    return { power, maxHp };
};

const _getAdventurerChoice = (adventurer: Adventurer, offeredLoot: LootChoice[]): { choice: LootChoice | null, reason: string, logs: string[] } => {
    const { traits, inventory } = adventurer;
    const logs: string[] = [`--- Adventurer Decision --- (Offense: ${traits.offense}, Risk: ${traits.risk})`];

    const currentWeaponPower = inventory.weapon?.stats.power || 0;
    const currentArmorHp = inventory.armor?.stats.maxHp || 0;
    logs.push(`Current Gear: Weapon Power(${currentWeaponPower}), Armor HP(${currentArmorHp})`);

    const scoreItem = (item: LootChoice): number => {
        let score = (RARITY_SCORE[item.rarity] || 1) * 5;

        switch (item.type) {
            case 'Weapon':
                const powerDelta = (item.stats.power || 0) - currentWeaponPower;
                if (powerDelta <= 0 && item.id !== inventory.weapon?.id) {
                    logs.push(`- ${item.name} is not a strict upgrade (powerDelta: ${powerDelta}). Rejecting.`);
                    return -1; // Never take a downgrade or sidegrade
                }
                score += powerDelta * (traits.offense / 10);
                if (powerDelta > 0) score += powerDelta * (traits.expertise / 10);
                
                const drawback = item.stats.maxHp || 0;
                if (drawback < 0) score += drawback * (100 - traits.risk) / 20;
                break;

            case 'Armor':
                const hpDelta = (item.stats.maxHp || 0) - currentArmorHp;
                if (hpDelta <= 0 && item.id !== inventory.armor?.id) {
                    logs.push(`- ${item.name} is not a strict upgrade (hpDelta: ${hpDelta}). Rejecting.`);
                    return -1; // Never take a downgrade or sidegrade
                }
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
                if (inventory.potions.length >= MAX_POTIONS) {
                    logs.push(`- Potion ${item.name} rejected, inventory is full.`);
                    score *= 0.1;
                }
                break;
        }
        
        return score + Math.random(); // Tie-breaker
    };

    const scoredLoot = offeredLoot.map(item => {
        const score = scoreItem(item);
        logs.push(`- Scoring ${item.name}: ${score.toFixed(2)}`);
        return { item, score };
    }).filter(i => i.score > 0);

    scoredLoot.sort((a, b) => b.score - a.score);
    
    if (scoredLoot.length > 0) {
        logs.push(`Sorted choices: ${scoredLoot.map(i => `${i.item.name}(${i.score.toFixed(2)})`).join(', ')}`);
    } else {
        logs.push("All offered items were rejected or scored <= 0.");
    }
    
    if (scoredLoot.length === 0 || scoredLoot[0].score < CHOICE_SCORE_THRESHOLD) {
        logs.push(`Top score is below threshold (${CHOICE_SCORE_THRESHOLD}). Rejecting all.`);
        return { choice: null, reason: "They examine your offers but decide to take nothing.", logs };
    }

    const choice = scoredLoot[0].item;
    logs.push(`Chose ${choice.name} with score ${scoredLoot[0].score.toFixed(2)}.`);
    let reason = `They pick the ${choice.name}.`;
    if(choice.type === "Weapon") reason = `"${(choice.stats.power || 0) > currentWeaponPower ? 'An excellent upgrade!' : 'This will have to do.'}" They equip the ${choice.name}.`;
    if(choice.type === "Armor") reason = `"${(choice.stats.maxHp || 0) > currentArmorHp ? 'A sturdy piece of armor.' : 'Better than nothing.'}" They equip the ${choice.name}.`;
    if(choice.type === "Potion") reason = `"A wise precaution." They stow the ${choice.name}.`;
    
    return { choice, reason, logs };
};

const _getDebugEncounterOutcome = (adventurer: Adventurer, floor: number, debugParams: { baseDamage: number, difficultyFactor: number }): {
    newAdventurer: Adventurer;
    feedback: string;
    damageTaken: number;
    logs: string[];
} => {
    const logs: string[] = [`--- DEBUG Encounter: Floor ${floor} ---`];
    let modifiableAdventurer = JSON.parse(JSON.stringify(adventurer));
    let preBattleFeedback = "";

    const healthPercentage = modifiableAdventurer.hp / modifiableAdventurer.maxHp;
    const potionUseThreshold = 1 - (modifiableAdventurer.traits.risk / 120);
    
    if (healthPercentage < potionUseThreshold && modifiableAdventurer.inventory.potions.length > 0) {
        const potionToUse = modifiableAdventurer.inventory.potions.shift();
        const healedAmount = potionToUse.stats.hp || 0;
        modifiableAdventurer.hp = Math.min(modifiableAdventurer.maxHp, modifiableAdventurer.hp + healedAmount);
        preBattleFeedback = `Sensing danger, they drink a ${potionToUse.name}. `;
        logs.push(`Health (${(healthPercentage * 100).toFixed(1)}%) is below risk threshold (${(potionUseThreshold * 100).toFixed(1)}%). Used ${potionToUse.name} to heal ${healedAmount} HP.`);
    }

    let damageTaken = Math.round(debugParams.baseDamage * debugParams.difficultyFactor);
    damageTaken = Math.max(0, damageTaken);
    logs.push(`Debug Damage calc: base(${debugParams.baseDamage}) * factor(${debugParams.difficultyFactor}) = ${damageTaken} damage.`);
    modifiableAdventurer.hp -= damageTaken;

    let interestChange = 0;
    let battleFeedback = "";
    const damageRatio = damageTaken / modifiableAdventurer.maxHp;

    let pseudoDifficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal';
    if (debugParams.difficultyFactor <= 0.8) pseudoDifficulty = 'Easy';
    else if (debugParams.difficultyFactor >= 1.3) pseudoDifficulty = 'Hard';
    
    logs.push(`Using pseudo-difficulty '${pseudoDifficulty}' for interest calculation.`);

    if (pseudoDifficulty === 'Easy') {
        interestChange = -5 - Math.floor((100 - modifiableAdventurer.traits.risk) / 20);
        battleFeedback = "An easy fight. Too easy...";
    } else if (damageRatio < 0.1) {
        interestChange = -2;
        battleFeedback = "A worthy, but simple challenge.";
    } else if (damageRatio < 0.35) {
        interestChange = 5 + Math.floor(modifiableAdventurer.traits.offense / 20) + (pseudoDifficulty === 'Hard' ? 5 : 0);
        battleFeedback = "A great battle! They feel alive!";
    } else {
        interestChange = -10 - Math.floor((100 - modifiableAdventurer.traits.risk) / 10);
        battleFeedback = "That was far too close for comfort.";
    }
    
    logs.push(`Interest change: ${interestChange > 0 ? '+' : ''}${interestChange}. Reason: ${battleFeedback}`);
    modifiableAdventurer.interest = Math.max(0, Math.min(100, modifiableAdventurer.interest + interestChange));
    return { newAdventurer: modifiableAdventurer, feedback: preBattleFeedback + battleFeedback, damageTaken, logs };
};


export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allItems, setAllItems] = useState<LootChoice[] | null>(null);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const response = await fetch('/game/items.json');
                if (!response.ok) {
                    throw new Error(`Failed to load items.json: ${response.statusText}`);
                }
                const items: LootChoice[] = await response.json();
                setAllItems(items);
                
                // Directly start the first run, skipping the workshop and starting with 0 BP.
                const run = 1;
                const unlockedDeck = INITIAL_UNLOCKED_DECK;

                const newTraits: AdventurerTraits = {
                    offense: Math.floor(Math.random() * 81) + 10, // 10-90
                    risk: Math.floor(Math.random() * 81) + 10, // 10-90
                    expertise: 0,
                };

                const newAdventurer: Adventurer = {
                    ...BASE_ADVENTURER_STATS,
                    interest: 100,
                    traits: newTraits,
                    inventory: { weapon: null, armor: null, potions: [] },
                };

                const runDeck = generateRunDeck(unlockedDeck, items);

                setGameState({
                    phase: 'DESIGNER_CHOOSING_LOOT',
                    designer: { balancePoints: 0 },
                    adventurer: newAdventurer,
                    unlockedDeck: unlockedDeck,
                    availableDeck: runDeck,
                    shopItems: [],
                    offeredLoot: [],
                    feedback: 'A new adventurer enters the dungeon!',
                    log: [`--- Starting Run ${run} ---`],
                    run: run,
                    floor: 1,
                    gameOver: { isOver: false, reason: '' },
                });
            } catch (e: any) {
                setError(e.message || "An unknown error occurred while loading game data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadGameData();
    }, []);

    const startNewRun = useCallback(() => {
        if (!gameState || !allItems) return;

        const newTraits: AdventurerTraits = {
            offense: Math.floor(Math.random() * 81) + 10, // 10-90
            risk: Math.floor(Math.random() * 81) + 10, // 10-90
            expertise: Math.min(100, gameState.adventurer.traits.expertise + 5 * (gameState.run - 1)),
        };

        const newAdventurer: Adventurer = {
            ...BASE_ADVENTURER_STATS,
            interest: 100,
            traits: newTraits,
            inventory: { weapon: null, armor: null, potions: [] },
        };
        
        const runDeck = generateRunDeck(gameState.unlockedDeck, allItems);

        setGameState(prev => ({
            ...prev!,
            phase: 'DESIGNER_CHOOSING_LOOT',
            adventurer: newAdventurer,
            availableDeck: runDeck,
            floor: 1,
            feedback: 'A new adventurer enters the dungeon!',
            log: [`--- Starting Run ${prev!.run} ---`],
            gameOver: { isOver: false, reason: '' },
        }));
    }, [gameState, allItems]);

    const presentOffer = useCallback((offeredIds: string[]) => {
        if (!gameState || gameState.phase !== 'DESIGNER_CHOOSING_LOOT') return;
        
        const offeredLoot = gameState.availableDeck.filter(item => offeredIds.includes(item.instanceId));
        
        setGameState(prev => ({ ...prev!, phase: 'AWAITING_ADVENTURER_CHOICE', offeredLoot }));

        setTimeout(() => {
            setGameState(prev => {
                if (!prev || prev.phase !== 'AWAITING_ADVENTURER_CHOICE') return prev;

                const { choice, reason, logs } = _getAdventurerChoice(prev.adventurer, prev.offeredLoot);
                let newAdventurer = { ...prev.adventurer };
                let newInterest = newAdventurer.interest;

                const newAvailableDeck = prev.availableDeck.filter(item => !offeredIds.includes(item.instanceId));

                if (choice) {
                    let inventory = { ...newAdventurer.inventory, potions: [...newAdventurer.inventory.potions] };
                    if (choice.type === 'Weapon') inventory.weapon = choice;
                    else if (choice.type === 'Armor') inventory.armor = choice;
                    else if (choice.type === 'Potion') inventory.potions.push(choice);
                    
                    const { power, maxHp } = _recalculateStats(inventory);
                    const hpDiff = maxHp - newAdventurer.maxHp;
                    newAdventurer.inventory = inventory;
                    newAdventurer.power = power;
                    newAdventurer.maxHp = maxHp;
                    newAdventurer.hp += Math.max(0, hpDiff); // Gain HP if maxHP increases, don't lose it
                } else {
                    newInterest = Math.max(0, prev.adventurer.interest - 10);
                }

                return {
                    ...prev,
                    phase: 'DESIGNER_CHOOSING_DIFFICULTY',
                    adventurer: { ...newAdventurer, interest: newInterest },
                    feedback: reason,
                    availableDeck: newAvailableDeck,
                    log: [...prev.log, ...logs],
                };
            });
        }, 2000);
    }, [gameState]);

    const runDebugEncounter = useCallback((debugParams: { baseDamage: number; difficultyFactor: number }) => {
        if (!gameState || gameState.phase !== 'DESIGNER_CHOOSING_DIFFICULTY') return;

        setGameState(prev => ({ ...prev!, phase: 'AWAITING_ENCOUNTER_FEEDBACK', debugEncounterParams: debugParams }));

        setTimeout(() => {
            setGameState(prev => {
                if (!prev || prev.phase !== 'AWAITING_ENCOUNTER_FEEDBACK' || !prev.debugEncounterParams) return prev;

                const { newAdventurer, feedback: encounterFeedback, logs: encounterLogs } = _getDebugEncounterOutcome(prev.adventurer, prev.floor, prev.debugEncounterParams);
                
                const newFloor = prev.floor + 1;
                const newBalancePoints = prev.designer.balancePoints + BP_PER_FLOOR;
                const newLog = [...prev.log, ...encounterLogs];

                // --- GAME OVER CHECKS ---
                if (newAdventurer.hp <= 0) {
                    newLog.push("GAME OVER: Adventurer has fallen in battle.");
                    return {
                        ...prev,
                        adventurer: newAdventurer,
                        designer: { balancePoints: newBalancePoints },
                        phase: 'RUN_OVER',
                        gameOver: { isOver: true, reason: `The adventurer fell on floor ${prev.floor}.` },
                        log: newLog
                    };
                }
                if (newAdventurer.interest <= INTEREST_THRESHOLD) {
                    newLog.push("GAME OVER: Adventurer lost interest and left.");
                     return {
                        ...prev,
                        adventurer: newAdventurer,
                        designer: { balancePoints: newBalancePoints },
                        phase: 'RUN_OVER',
                        gameOver: { isOver: true, reason: `The adventurer grew bored on floor ${prev.floor} and left.` },
                        log: newLog
                    };
                }

                // --- DECK REPLENISHMENT LOGIC ---
                let finalDeck = prev.availableDeck;
                if (finalDeck.length < MIN_CARDS_TO_OFFER && allItems) {
                    newLog.push("Deck ran low! Reshuffling and continuing the run with all unlocked items.");
                    finalDeck = generateRunDeck(prev.unlockedDeck, allItems);
                }
                
                return {
                    ...prev,
                    phase: 'DESIGNER_CHOOSING_LOOT',
                    adventurer: newAdventurer,
                    floor: newFloor,
                    designer: { balancePoints: newBalancePoints },
                    availableDeck: finalDeck,
                    feedback: encounterFeedback,
                    log: newLog,
                    debugEncounterParams: undefined,
                };
            });
        }, 2000);
    }, [gameState, allItems]);

    const enterWorkshop = useCallback(() => {
        if (!gameState || !allItems) return;

        const nextRun = gameState.run + 1;
        const shopItems = allItems
            .filter(item => item.cost !== null)
            .filter(item => !gameState.unlockedDeck.includes(item.id))
            .filter(item => nextRun >= item.minRun);

        setGameState(prev => ({
            ...prev!,
            phase: 'SHOP',
            run: nextRun,
            floor: 0,
            shopItems: shuffleArray(shopItems).slice(0, 4), // Offer up to 4 new items
            gameOver: { isOver: false, reason: '' },
            feedback: "Welcome back. Spend your Balance Points wisely."
        }));
    }, [gameState, allItems]);

    const purchaseItem = useCallback((itemId: string) => {
        if (!gameState || !allItems) return;
        const item = allItems.find(i => i.id === itemId);
        if (!item || item.cost === null || gameState.designer.balancePoints < item.cost) return;

        const newUnlockedDeck = [...gameState.unlockedDeck, itemId];
        const newBalancePoints = gameState.designer.balancePoints - item.cost;
        const newShopItems = gameState.shopItems.filter(i => i.id !== itemId);

        setGameState(prev => ({
            ...prev!,
            designer: { balancePoints: newBalancePoints },
            unlockedDeck: newUnlockedDeck,
            shopItems: newShopItems,
            log: [...prev!.log, `Purchased ${item.name}.`]
        }));
    }, [gameState, allItems]);
    
    return { gameState, isLoading, error, presentOffer, startNewRun, enterWorkshop, purchaseItem, runDebugEncounter };
};
