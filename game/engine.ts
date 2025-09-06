import type { GamePhase, GameState, LootChoice, AdventurerTraits, Encounter, RoomChoice } from '../types';
import { Adventurer } from './adventurer';
import { Logger } from './logger';
import { MetaManager } from './meta';
import {
  ADVENTURER_ACTION_DELAY_MS,
  BP_PER_ROOM,
  CHOICE_SCORE_THRESHOLD,
  HAND_SIZE,
  INITIAL_UNLOCKED_DECK,
  INTEREST_THRESHOLD,
  MAX_POTIONS,
} from './constants';
import { generateRunDeck, generateRoomDeck, shuffleArray } from './utils';
import { UnlockableFeature } from './unlocks';
import { t } from '../text';

type GameEngineListener = (state: GameState | null) => void;

export class GameEngine {
  public gameState: GameState | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  private _allItems: LootChoice[] = [];
  private _allRooms: RoomChoice[] = [];
  private _listeners: { [key:string]: GameEngineListener[] } = {};
  public metaManager: MetaManager;

  constructor(metaManager: MetaManager) {
    this.metaManager = metaManager;
  }

  public init = async () => {
    await this._loadGameData();
  };

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
    this.gameState?.logger.debug(`Adventurer chooses: ${choice.name} (Score: ${scoredLoot[0].score.toFixed(1)})`);
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

  private _simulateEncounter(adventurer: Adventurer, room: number, encounter: Encounter): { newAdventurer: Adventurer; feedback: string[]; totalDamageTaken: number; } {
    this.gameState?.logger.info(`--- Encounter: Room ${room} ---`);
    const feedback: string[] = [];
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
                feedback.push(t('game_engine.adventurer_drinks_potion', { potionName: potionToUse.name }));
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
    this.gameState?.logger.debug(`hpLost: ${hpLost}, hpLostRatio: ${hpLostRatio.toFixed(2)}`);
    if (hpLostRatio > 0.7) {
        battleFeedback = t('game_engine.too_close_for_comfort');
        adventurer.modifyInterest(-15, 5);
    } else if (hpLostRatio > 0.4) {
        battleFeedback = t('game_engine.great_battle');
        adventurer.modifyInterest(10, 5);
    } else if (enemiesDefeated > 3 && adventurer.traits.offense > 60) {
        battleFeedback = t('game_engine.easy_fight');
        adventurer.modifyInterest(0, 5);
    } else {
        battleFeedback = t('game_engine.worthy_challenge');
        adventurer.modifyInterest(-2, 3);
    }
    feedback.push(battleFeedback);

    if (adventurer.hp > 0 && enemiesDefeated === encounter.enemyCount) {
        adventurer.traits.expertise += 1;
    }

    return { newAdventurer: adventurer, feedback, totalDamageTaken };
  }

  // --- PUBLIC ACTIONS ---
  public startNewGame = () => {
    this.metaManager.incrementAdventurers();
    const newTraits: AdventurerTraits = {
      offense: Math.floor(Math.random() * 81) + 10,
      risk: Math.floor(Math.random() * 81) + 10,
      expertise: 0,
    };
    const logger = new Logger();
    const newAdventurer = new Adventurer(newTraits, logger);

    const unlockedDeck = INITIAL_UNLOCKED_DECK;
    const runDeck = generateRunDeck(unlockedDeck, this._allItems);
    const handSize = this._getHandSize();
    const hand = runDeck.slice(0, handSize);
    const availableDeck = runDeck.slice(handSize);

    const unlockedRoomDeck = ['room_1', 'room_2', 'room_3', 'room_4', 'room_5', 'room_6'];
    const roomRunDeck = generateRoomDeck(unlockedRoomDeck, this._allRooms);
    const roomHand = roomRunDeck.slice(0, handSize);
    const availableRoomDeck = roomRunDeck.slice(handSize);

    logger.info(`--- Starting New Game (Run 1) ---`);

    this.gameState = {
      phase: 'DESIGNER_CHOOSING_ROOM',
      designer: { balancePoints: 0 },
      adventurer: newAdventurer,
      unlockedDeck: unlockedDeck,
      availableDeck: availableDeck,
      hand: hand,
      unlockedRoomDeck: unlockedRoomDeck,
      availableRoomDeck: availableRoomDeck,
      roomHand: roomHand,
      handSize: handSize,
      shopItems: [],
      offeredLoot: [],
      offeredRooms: [],
      feedback: t('game_engine.new_adventurer'),
      logger: logger,
      run: 1,
      room: 1,
      runEnded: { isOver: false, reason: '' },
      newlyUnlocked: [],
    };
    this._emit('state-change', this.gameState);
  }

  public continueGame = () => {
    this.startNewGame();
  }

  public startNewRun = (runNumber?: number) => {
    if (!this.gameState) return;
    const nextRun = runNumber || this.gameState.run + 1;
    this.metaManager.updateRun(nextRun);

    const handSize = this._getHandSize();
    const runDeck = generateRunDeck(this.gameState.unlockedDeck, this._allItems);
    const hand = runDeck.slice(0, handSize);
    const availableDeck = runDeck.slice(handSize);

    const roomRunDeck = generateRoomDeck(this.gameState.unlockedRoomDeck, this._allRooms);
    const roomHand = roomRunDeck.slice(0, handSize);
    const availableRoomDeck = roomRunDeck.slice(handSize);

    const resetAdventurer = new Adventurer(this.gameState.adventurer.traits, this.gameState.logger);
    resetAdventurer.interest = this.gameState.adventurer.interest;

    this.gameState.logger.info(`--- Starting Run ${nextRun} ---`);
    this.gameState = {
      ...this.gameState,
      adventurer: resetAdventurer,
      phase: 'DESIGNER_CHOOSING_ROOM',
      availableDeck: availableDeck,
      hand: hand,
      availableRoomDeck: availableRoomDeck,
      roomHand: roomHand,
      handSize: handSize,
      room: 1,
      run: nextRun,
      feedback: t('game_engine.adventurer_returns'),
      runEnded: { isOver: false, reason: '' },
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

      const { choice, reason: feedback } = this._getAdventurerChoice(this.gameState.adventurer, this.gameState.offeredLoot);
      const adventurer = this.gameState.adventurer;

      // --- Hand and Deck Update Logic ---
      let currentHand = this.gameState.hand;
      let currentDeck = this.gameState.availableDeck;

      // Clear justDrafted flag from existing cards
      currentHand.forEach(c => c.justDrafted = false);

      // Remove offered items from hand
      let newHand = currentHand.filter(item => !offeredIds.includes(item.instanceId));

      // Replenish hand from deck
      const numToDraw = this.gameState.handSize - newHand.length;
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
      const newBalancePoints = this.gameState.designer.balancePoints + BP_PER_ROOM;

      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_ROOM',
        adventurer: adventurer,
        feedback: feedback,
        availableDeck: newDeck,
        hand: newHand,
        room: newRoom,
        designer: { balancePoints: newBalancePoints },
      };
      this._emit('state-change', this.gameState);
    }, ADVENTURER_ACTION_DELAY_MS);
  }

  public runEncounter = (roomChoices: RoomChoice[]) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_ROOM') return;

    this.gameState.phase = 'AWAITING_ENCOUNTER_FEEDBACK';
    this.gameState.offeredRooms = roomChoices;
    this._emit('state-change', this.gameState);

    setTimeout(() => {
      if (!this.gameState || this.gameState.phase !== 'AWAITING_ENCOUNTER_FEEDBACK' || !this.gameState.offeredRooms) return;

      let adventurer = this.gameState.adventurer;
      let feedback: string[] = [];

      const chosenRoomIndex = Math.floor(Math.random() * this.gameState.offeredRooms.length);
      const chosenRoom = this.gameState.offeredRooms[chosenRoomIndex];

      this.gameState.logger.info(`--- Encountering Room: ${chosenRoom.name} ---`);

      switch (chosenRoom.type) {
        case 'enemy':
        case 'boss':
          const encounter: Encounter = {
            enemyCount: chosenRoom.units || 1,
            enemyPower: chosenRoom.stats.attack || 5,
            enemyHp: chosenRoom.stats.hp || 10,
          };
          const battleResult = this._simulateEncounter(adventurer, this.gameState.room, encounter);
          adventurer = battleResult.newAdventurer;
          feedback = battleResult.feedback;
          break;

        case 'healing':
          const healing = chosenRoom.stats.hp || 0;
          adventurer.hp = Math.min(adventurer.maxHp, adventurer.hp + healing);
          feedback.push(t('game_engine.healing_room', { healing: healing }));
          this.gameState.logger.info(`Adventurer found a healing fountain and recovered ${healing} HP.`);
          break;

        case 'trap':
          const damage = chosenRoom.stats.attack || 0;
          adventurer.hp -= damage;
          feedback.push(t('game_engine.trap_room', { damage: damage }));
          this.gameState.logger.info(`Adventurer fell into a trap and lost ${damage} HP.`);
          break;
      }

      // --- Room Hand and Deck Update Logic ---
      let currentRoomHand = this.gameState.roomHand;
      let currentRoomDeck = this.gameState.availableRoomDeck;

      currentRoomHand.forEach(c => c.justDrafted = false);

      const offeredRoomIds = this.gameState.offeredRooms.map(r => r.instanceId);
      let newRoomHand = currentRoomHand.filter(room => !offeredRoomIds.includes(room.instanceId));

      const numToDraw = this.gameState.handSize - newRoomHand.length;
      const drawnCards = currentRoomDeck.slice(0, numToDraw);

      drawnCards.forEach(c => {
          c.draftedRoom = this.gameState!.room;
          c.justDrafted = true;
      });

      const newRoomDeck = currentRoomDeck.slice(numToDraw);
      newRoomHand.push(...drawnCards);
      // --- End Room Hand and Deck Update ---

      const endRun = (reason: string) => {
        const newlyUnlocked = this.metaManager.checkForUnlocks(this.gameState!.run);
        this.gameState!.logger.error(`GAME OVER: ${reason}`);
        this.gameState = {
            ...this.gameState!,
            adventurer: adventurer,
            designer: { balancePoints: this.gameState!.designer.balancePoints + BP_PER_ROOM },
            phase: 'RUN_OVER',
            runEnded: { isOver: true, reason: reason },
            newlyUnlocked: newlyUnlocked,
        };
        this._emit('state-change', this.gameState);
      }

      if (adventurer.hp <= 0) {
        endRun(t('game_engine.adventurer_fell', { room: this.gameState.room, run: this.gameState.run }));
        return;
      }
      if (adventurer.interest <= INTEREST_THRESHOLD) {
        endRun(t('game_engine.adventurer_bored', { room: this.gameState.room, run: this.gameState.run }));
        return;
      }

      if (this.gameState.hand && this.gameState.hand.length === 0) {
        this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items.");
        feedback.push(t('game_engine.empty_hand'));
        this.gameState = {
          ...this.gameState,
          phase: 'DESIGNER_CHOOSING_ROOM',
          adventurer: adventurer,
          room: this.gameState.room + 1,
          designer: { balancePoints: this.gameState.designer.balancePoints + BP_PER_ROOM },
          feedback: feedback,
          encounter: undefined,
          roomHand: newRoomHand,
          availableRoomDeck: newRoomDeck,
        };
      } else {
        this.gameState = {
          ...this.gameState,
          phase: 'DESIGNER_CHOOSING_LOOT',
          adventurer: adventurer,
          feedback: feedback,
          encounter: undefined,
          roomHand: newRoomHand,
          availableRoomDeck: newRoomDeck,
        };
      }

      this._emit('state-change', this.gameState);
    }, ADVENTURER_ACTION_DELAY_MS);
  }

  public enterWorkshop = () => {
    if (!this.gameState) return;

    if (!this.metaManager.acls.has(UnlockableFeature.WORKSHOP)) {
        this.startNewRun();
        return;
    }

    const nextRun = this.gameState.run + 1;
    const shopItems = this._allItems
      .filter(item => item.cost !== null)
      .filter(item => !this.gameState!.unlockedDeck.includes(item.id));

    const shopRooms = this._allRooms
        .filter(room => room.cost !== null)
        .filter(room => !this.gameState!.unlockedRoomDeck.includes(room.id));

    const allShopItems = [...shopItems, ...shopRooms];

    this.gameState = {
      ...this.gameState,
      phase: 'SHOP',
      run: nextRun,
      room: 0,
      shopItems: shuffleArray(allShopItems).slice(0, 4),
      runEnded: { isOver: false, reason: '' },
      feedback: t('game_engine.welcome_to_workshop')
    };
    this._emit('state-change', this.gameState);
  }

  public purchaseItem = (itemId: string) => {
    if (!this.gameState) return;

    const item = this._allItems.find(i => i.id === itemId);
    const room = this._allRooms.find(r => r.id === itemId);
    const itemToBuy = item || room;

    if (!itemToBuy || itemToBuy.cost === null || this.gameState.designer.balancePoints < itemToBuy.cost) return;

    let newUnlockedDeck = this.gameState.unlockedDeck;
    let newUnlockedRoomDeck = this.gameState.unlockedRoomDeck;

    if (item) {
        newUnlockedDeck = [...this.gameState.unlockedDeck, itemId];
    } else if (room) {
        newUnlockedRoomDeck = [...this.gameState.unlockedRoomDeck, itemId];
    }

    const newBalancePoints = this.gameState.designer.balancePoints - itemToBuy.cost;
    const newShopItems = this.gameState.shopItems.filter(i => i.id !== itemId);

    this.gameState.logger.info(`Purchased ${itemToBuy.name}.`);
    this.gameState = {
      ...this.gameState,
      designer: { balancePoints: newBalancePoints },
      unlockedDeck: newUnlockedDeck,
      unlockedRoomDeck: newUnlockedRoomDeck,
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

  public handleEndOfRun(decision: 'continue' | 'retire') {
    if (!this.gameState) return;

    if (decision === 'retire') {
      this.showMenu();
      return;
    }

    // Player chose to continue, so we enter the workshop (or start a new run if not unlocked)
    this.enterWorkshop();
  }

  public showMenu = () => {
    this.gameState = {
      // We need a baseline gamestate object even for the menu
      ...(this.gameState || this._getInitialGameState()),
      phase: 'MENU',
    };
    this._emit('state-change', this.gameState);
  }

  private _getInitialGameState(): GameState {
    const newTraits: AdventurerTraits = {
      offense: Math.floor(Math.random() * 81) + 10,
      risk: Math.floor(Math.random() * 81) + 10,
      expertise: 0,
    };
    const logger = new Logger();
    const newAdventurer = new Adventurer(newTraits, logger);
    return {
      phase: 'MENU',
      designer: { balancePoints: 0 },
      adventurer: newAdventurer,
      unlockedDeck: INITIAL_UNLOCKED_DECK,
      availableDeck: [],
      hand: [],
      unlockedRoomDeck: [],
      availableRoomDeck: [],
      roomHand: [],
      handSize: this._getHandSize(),
      shopItems: [],
      offeredLoot: [],
      offeredRooms: [],
      feedback: '',
      logger: logger,
      run: 0,
      room: 0,
      runEnded: { isOver: false, reason: '' },
      newlyUnlocked: [],
    };
  }

  private _getHandSize(): number {
    if (this.metaManager.acls.has(UnlockableFeature.HAND_SIZE_INCREASE)) {
      return 12;
    }
    return HAND_SIZE;
  }

  public isWorkshopUnlocked(): boolean {
    return this.metaManager.acls.has(UnlockableFeature.WORKSHOP);
  }

  // --- INITIALIZATION ---
  private async _loadGameData() {
    try {
      const itemResponse = await fetch(`${import.meta.env.BASE_URL}game/items.json`);
      if (!itemResponse.ok) {
        throw new Error(t('global.error_loading_items', { statusText: itemResponse.statusText }));
      }
      this._allItems = await itemResponse.json();

      const roomResponse = await fetch(`${import.meta.env.BASE_URL}game/rooms.json`);
      if (!roomResponse.ok) {
        throw new Error(t('global.error_loading_rooms', { statusText: roomResponse.statusText }));
      }
      this._allRooms = await roomResponse.json();
    } catch (e: any) {
      this.error = e.message || t('global.unknown_error');
      this._emit('error', null);
    } finally {
      this.isLoading = false;
      this._emit('state-change', this.gameState);
    }
  }
}