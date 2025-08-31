import type { GamePhase, GameState, LootChoice, Adventurer, AdventurerTraits, Encounter } from '../types';
import { t } from '../localization';
import { Adventurer } from './adventurer';
import { Logger } from './logger';

// --- CONSTANTS ---
const INTEREST_THRESHOLD = 15;
const MAX_POTIONS = 3;
const RARITY_SCORE: Record<string, number> = { 'Common': 1, 'Uncommon': 2, 'Rare': 3 };
const CHOICE_SCORE_THRESHOLD = 10;
const BP_PER_FLOOR = 10;
const INITIAL_UNLOCKED_DECK = ['loot_1', 'loot_2', 'loot_3', 'loot_4', 'loot_5'];
const MIN_DECK_SIZE = 32;
const HAND_SIZE = 9;
const ADVENTURER_ACTION_DELAY_MS = 300;

// --- HELPER FUNCTIONS ---
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

type GameEngineListener = (state: GameState | null) => void;

export class GameEngine {
  public gameState: GameState | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  private _allItems: LootChoice[] = [];
  private _listeners: { [key: string]: GameEngineListener[] } = {};

  public init = async () => {
    await this._loadGameData();
  }

  // --- EVENT EMITTER ---
  public on(eventName: 'state-change' | 'error', listener: GameEngineListener): void {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(listener);
  }

  private _emit(eventName: 'state-change' | 'error', data: GameState | null): void {
    const listeners = this._listeners[eventName];
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  // --- PRIVATE LOGIC ---

  private _getAdventurerChoice(adventurer: Adventurer, offeredLoot: LootChoice[]): { choice: LootChoice | null, reason: string } {
    const { traits, inventory } = adventurer;
    this.gameState?.logger.debug(`--- Adventurer Decision --- (Offense: ${traits.offense}, Risk: ${traits.risk})`);
    const currentWeaponPower = inventory.weapon?.stats.power || 0;
    const currentArmorHp = inventory.armor?.stats.maxHp || 0;
    this.gameState?.logger.debug(`Current Gear: Weapon Power(${currentWeaponPower}), Armor HP(${currentArmorHp})`);

    const scoreItem = (item: LootChoice): number => {
      let score = (RARITY_SCORE[item.rarity] || 1) * 5;
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
      return score + Math.random();
    };

    const scoredLoot = offeredLoot.map(item => ({ item, score: scoreItem(item) })).filter(i => i.score > 0);
    scoredLoot.sort((a, b) => b.score - a.score);

    if (scoredLoot.length === 0 || scoredLoot[0].score < CHOICE_SCORE_THRESHOLD) {
      return { choice: null, reason: t('game_engine.adventurer_declines_offer') };
    }
    const choice = scoredLoot[0].item;
    let reason = t('game_engine.adventurer_accepts_offer', { itemName: choice.name });
    return { choice, reason };
  }

  private _simulateEncounter(adventurer: Adventurer, room: number, encounter: Encounter): { newAdventurer: Adventurer; feedback: string; totalDamageTaken: number; } {
    this.gameState?.logger.info(`--- Encounter: Room ${room} ---`);
    let preBattleFeedback = "";
    let totalDamageTaken = 0;
    let enemiesDefeated = 0;
    const initialHp = adventurer.hp;

    for (let i = 0; i < encounter.enemyCount; i++) {
        this.gameState?.logger.info(`Adventurer encounters enemy ${i + 1}/${encounter.enemyCount}.`);

        const healthPercentage = adventurer.hp / adventurer.maxHp;
        const potionUseThreshold = 1 - (adventurer.traits.risk / 120);
        if (healthPercentage < potionUseThreshold && adventurer.inventory.potions.length > 0) {
            const potionToUse = adventurer.inventory.potions.shift();
            if (potionToUse) {
                const healedAmount = potionToUse.stats.hp || 0;
                adventurer.hp = Math.min(adventurer.maxHp, adventurer.hp + healedAmount);
                preBattleFeedback += t('game_engine.adventurer_drinks_potion', { potionName: potionToUse.name });
                this.gameState?.logger.info(`Adventurer used ${potionToUse.name} and recovered ${healedAmount} HP.`);
            }
        }

        let currentEnemyHp = encounter.enemyHp;
        while (currentEnemyHp > 0 && adventurer.hp > 0) {
            // Adventurer's turn
            const adventurerHitChance = Math.min(0.95, 0.75 + (adventurer.traits.expertise / 500) + (adventurer.traits.offense / 1000));
            if (Math.random() < adventurerHitChance) {
                const damageDealt = adventurer.power;
                currentEnemyHp -= damageDealt;
                this.gameState?.logger.debug(`Adventurer hits for ${damageDealt} damage.`);
            } else {
                this.gameState?.logger.debug(`Adventurer misses.`);
            }

            if (currentEnemyHp <= 0) {
                this.gameState?.logger.info(`Enemy defeated.`);
                enemiesDefeated++;
                break;
            }

            // Enemy's turn
            const enemyHitChance = Math.max(0.4, 0.75 - (adventurer.traits.expertise / 500) - ((100 - adventurer.traits.offense) / 1000));
            if (Math.random() < enemyHitChance) {
                const armor = (adventurer.inventory.armor?.stats.maxHp || 0) / 10;
                const damageTaken = Math.max(1, encounter.enemyPower - armor);
                totalDamageTaken += damageTaken;
                adventurer.hp -= damageTaken;
                this.gameState?.logger.debug(`Enemy hits for ${damageTaken} damage.`);
            } else {
                this.gameState?.logger.debug(`Enemy misses.`);
            }
        }

        if (adventurer.hp <= 0) {
            this.gameState?.logger.warn(`Adventurer has been defeated.`);
            break;
        }
    }

    let battleFeedback: string;
    const hpLost = initialHp - adventurer.hp;
    const hpLostRatio = hpLost / adventurer.maxHp;

    if (hpLostRatio > 0.7) {
        battleFeedback = t('game_engine.too_close_for_comfort');
        adventurer.modifyInterest(-15, 5);
    } else if (hpLostRatio > 0.4) {
        battleFeedback = t('game_engine.great_battle');
        adventurer.modifyInterest(10, 5);
    } else if (enemiesDefeated > 3 && adventurer.traits.offense > 60) {
        battleFeedback = t('game_engine.easy_fight');
        adventurer.modifyInterest(5, 5);
    } else {
        battleFeedback = t('game_engine.worthy_challenge');
        adventurer.modifyInterest(-2, 3);
    }

    if (adventurer.hp > 0 && enemiesDefeated === encounter.enemyCount) {
        adventurer.traits.expertise += 1;
    }

    return { newAdventurer: adventurer, feedback: preBattleFeedback + battleFeedback, totalDamageTaken };
}

  // --- PUBLIC ACTIONS ---
  public startNewGame = () => {
    const newTraits: AdventurerTraits = {
      offense: Math.floor(Math.random() * 81) + 10,
      risk: Math.floor(Math.random() * 81) + 10,
      expertise: 0,
    };
    const newAdventurer = new Adventurer(newTraits);
    const unlockedDeck = INITIAL_UNLOCKED_DECK;
    const runDeck = generateRunDeck(unlockedDeck, this._allItems);
    const hand = runDeck.slice(0, HAND_SIZE);
    const availableDeck = runDeck.slice(HAND_SIZE);

    const logger = new Logger();
    logger.info(`--- Starting New Game (Run 1) ---`);

    if (this.gameState && this.gameState.logger) {
      console.log("previous game log dump:", this.gameState.logger.entries);
    }

    this.gameState = {
      phase: 'DESIGNER_CHOOSING_DIFFICULTY',
      designer: { balancePoints: 0 },
      adventurer: newAdventurer,
      unlockedDeck: unlockedDeck,
      availableDeck: availableDeck,
      hand: hand,
      shopItems: [],
      offeredLoot: [],
      feedback: t('game_engine.new_adventurer'),
      logger: logger,
      run: 1,
      room: 1,
      gameOver: { isOver: false, reason: '' },
    };
    this._emit('state-change', this.gameState);
  }

  public startNewRun = () => {
    if (!this.gameState) return;

    const runDeck = generateRunDeck(this.gameState.unlockedDeck, this._allItems);
    const hand = runDeck.slice(0, HAND_SIZE);
    const availableDeck = runDeck.slice(HAND_SIZE);

    const resetAdventurer = new Adventurer(this.gameState.adventurer.traits);
    resetAdventurer.interest = this.gameState.adventurer.interest;

    this.gameState.logger.info(`--- Starting Run ${this.gameState.run} ---`);
    this.gameState = {
      ...this.gameState,
      adventurer: resetAdventurer,
      phase: 'DESIGNER_CHOOSING_DIFFICULTY',
      availableDeck: availableDeck,
      hand: hand,
      room: 1,
      feedback: t('game_engine.adventurer_returns'),
      gameOver: { isOver: false, reason: '' },
    };
    this._emit('state-change', this.gameState);
  }

  public presentOffer = (offeredIds: string[]) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_LOOT' || !this.gameState.hand) return;

    const offeredLoot = this.gameState.hand.filter(item => offeredIds.includes(item.instanceId));
    this.gameState.phase = 'AWAITING_ADVENTURER_CHOICE';
    this.gameState.offeredLoot = offeredLoot;
    this._emit('state-change', this.gameState);

    setTimeout(() => {
      if (!this.gameState || this.gameState.phase !== 'AWAITING_ADVENTURER_CHOICE' || !this.gameState.hand) return;

      const { choice, reason } = this._getAdventurerChoice(this.gameState.adventurer, this.gameState.offeredLoot);
      const adventurer = this.gameState.adventurer;

      // --- Hand and Deck Update Logic ---
      let currentHand = this.gameState.hand;
      let currentDeck = this.gameState.availableDeck;

      // Clear justDrafted flag from existing cards
      currentHand.forEach(c => c.justDrafted = false);

      // Remove offered items from hand
      let newHand = currentHand.filter(item => !offeredIds.includes(item.instanceId));

      // Replenish hand from deck
      const numToDraw = HAND_SIZE - newHand.length;
      const drawnCards = currentDeck.slice(0, numToDraw);

      // Mark new cards
      drawnCards.forEach(c => {
        c.draftedRoom = this.gameState!.room;
        c.justDrafted = true;
      });

      const newDeck = currentDeck.slice(numToDraw);
      newHand.push(...drawnCards);
      // --- End Hand and Deck Update ---

      if (choice) {
        if (choice.type === 'Potion') {
            adventurer.addPotion(choice);
        } else {
            adventurer.equip(choice);
        }
      } else {
        adventurer.interest = Math.max(0, adventurer.interest - 10);
      }

      const newRoom = this.gameState.room + 1;
      const newBalancePoints = this.gameState.designer.balancePoints + BP_PER_FLOOR;

      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_DIFFICULTY',
        adventurer: adventurer,
        feedback: reason,
        availableDeck: newDeck,
        hand: newHand,
        room: newRoom,
        designer: { balancePoints: newBalancePoints },
      };
      this._emit('state-change', this.gameState);
    }, ADVENTURER_ACTION_DELAY_MS);
  }

  public runEncounter = (encounter: Encounter) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_DIFFICULTY') return;

    let finalEncounter = { ...encounter };
    let isBossFight = false;
    if (this.gameState.room > 0 && this.gameState.room % 5 === 0) {
      isBossFight = true;
      const bossPower = Math.max(encounter.enemyPower, 20 + this.gameState.room);
      const bossHp = Math.max(encounter.enemyHp, 50 + this.gameState.room * 5);
      finalEncounter = {
        enemyCount: 1,
        enemyPower: bossPower,
        enemyHp: bossHp,
      };
    }

    this.gameState.phase = 'AWAITING_ENCOUNTER_FEEDBACK';
    this.gameState.encounter = finalEncounter;
    this._emit('state-change', this.gameState);

    setTimeout(() => {
      if (!this.gameState || this.gameState.phase !== 'AWAITING_ENCOUNTER_FEEDBACK' || !this.gameState.encounter) return;

      if (isBossFight) {
        this.gameState.logger.info("--- BOSS FIGHT ---");
      }
      const { newAdventurer, feedback: encounterFeedback } = this._simulateEncounter(this.gameState.adventurer, this.gameState.room, this.gameState.encounter);

      if (newAdventurer.hp <= 0) {
        this.gameState.logger.error("GAME OVER: Adventurer has fallen in battle.");
        this.gameState = {
          ...this.gameState,
          adventurer: newAdventurer,
          designer: { balancePoints: this.gameState.designer.balancePoints + BP_PER_FLOOR },
          phase: 'RUN_OVER',
          gameOver: { isOver: true, reason: t('game_engine.adventurer_fell', { room: this.gameState.room, run: this.gameState.run }) },
        };
        this._emit('state-change', this.gameState);
        return;
      }
      if (newAdventurer.interest <= INTEREST_THRESHOLD) {
        this.gameState.logger.error("GAME OVER: Adventurer lost interest and quit.");
        this.gameState = {
          ...this.gameState,
          adventurer: newAdventurer,
          designer: { balancePoints: this.gameState.designer.balancePoints + BP_PER_FLOOR },
          phase: 'RUN_OVER',
          gameOver: { isOver: true, reason: t('game_engine.adventurer_bored', { room: this.gameState.room, run: this.gameState.run }) },
        };
        this._emit('state-change', this.gameState);
        return;
      }

      let feedback = encounterFeedback;
      if (this.gameState.hand && this.gameState.hand.length === 0) {
        this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items.");
        feedback = t('game_engine.empty_hand');
        this.gameState = {
          ...this.gameState,
          phase: 'DESIGNER_CHOOSING_DIFFICULTY',
          adventurer: newAdventurer,
          room: this.gameState.room + 1,
          designer: { balancePoints: this.gameState.designer.balancePoints + BP_PER_FLOOR },
          feedback: feedback,
          encounter: undefined,
        };
      } else {
        this.gameState = {
          ...this.gameState,
          phase: 'DESIGNER_CHOOSING_LOOT',
          adventurer: newAdventurer,
          feedback: feedback,
          encounter: undefined,
        };
      }

      this._emit('state-change', this.gameState);
    }, ADVENTURER_ACTION_DELAY_MS);
  }

  public enterWorkshop = () => {
    if (!this.gameState) return;
    const nextRun = this.gameState.run + 1;
    const shopItems = this._allItems
      .filter(item => item.cost !== null)
      .filter(item => !this.gameState!.unlockedDeck.includes(item.id))
      .filter(item => nextRun >= item.minRun);

    this.gameState = {
      ...this.gameState,
      phase: 'SHOP',
      run: nextRun,
      room: 0,
      shopItems: shuffleArray(shopItems).slice(0, 4),
      gameOver: { isOver: false, reason: '' },
      feedback: t('game_engine.welcome_to_workshop')
    };
    this._emit('state-change', this.gameState);
  }

  public purchaseItem = (itemId: string) => {
    if (!this.gameState) return;
    const item = this._allItems.find(i => i.id === itemId);
    if (!item || item.cost === null || this.gameState.designer.balancePoints < item.cost) return;

    const newUnlockedDeck = [...this.gameState.unlockedDeck, itemId];
    const newBalancePoints = this.gameState.designer.balancePoints - item.cost;
    const newShopItems = this.gameState.shopItems.filter(i => i.id !== itemId);

    this.gameState.logger.info(`Purchased ${item.name}.`);
    this.gameState = {
      ...this.gameState,
      designer: { balancePoints: newBalancePoints },
      unlockedDeck: newUnlockedDeck,
      shopItems: newShopItems
    };
    this._emit('state-change', this.gameState);
  }

  public getAdventurerEndRunDecision(): 'continue' | 'retire' {
    if (!this.gameState) {
      return 'retire';
    }
    const { interest } = this.gameState.adventurer;
    const interestDifference = interest - INTEREST_THRESHOLD;

    // Ponder factor to add randomness. Range: -10 to 10
    const ponder = (Math.random() - 0.5) * 20;

    const finalScore = interestDifference + ponder;

    if (finalScore > 0) {
      return 'continue';
    } else {
      return 'retire';
    }
  }

  // --- INITIALIZATION ---
  private async _loadGameData() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}game/items.json`);
      if (!response.ok) {
        throw new Error(t('global.error_loading_items', { statusText: response.statusText }));
      }
      this._allItems = await response.json();
      this.startNewGame();
    } catch (e: any) {
      this.error = e.message || t('global.unknown_error');
      this._emit('error', null);
    } finally {
      this.isLoading = false;
      this._emit('state-change', this.gameState);
    }
  }
}