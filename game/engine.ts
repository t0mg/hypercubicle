import type { GamePhase, GameState, LootChoice, AdventurerTraits, Encounter, RoomChoice, DataLoader } from '../types';
import { FlowState } from '../types';
import { Adventurer } from './adventurer';
import { Logger } from './logger';
import { MetaManager } from './meta';
import { GameSaver } from './saver';
import {
  ADVENTURER_ACTION_DELAY_MS,
  BP_PER_ROOM,
  CHOICE_SCORE_THRESHOLD,
  HAND_SIZE,
  INTEREST_THRESHOLD,
  DECK_SIZE,
  ROOM_DECK_SIZE,
  MAX_POTIONS,
} from './constants';
import { generateLootDeck, generateRoomDeck, shuffleArray } from './utils';
import { UnlockableFeature } from './unlocks';
import { t } from '../text';
import {
  getAdventurerLootChoice,
  getAdventurerBattleChoice,
  processLootChoice,
  processRoomEntry,
  processTrap,
  processBattleTurn,
  processBattleOutcome
} from './ai';
import { rng } from './random';

type GameEngineListener = (state: GameState | null) => void;

export class GameEngine {
  public gameState: GameState | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  private _allItems: LootChoice[] = [];
  private _allRooms: RoomChoice[] = [];
  private _listeners: { [key: string]: GameEngineListener[] } = {};
  public metaManager: MetaManager;
  private dataLoader: DataLoader;
  private gameSaver: GameSaver;

  constructor(metaManager: MetaManager, dataLoader: DataLoader, gameSaver: GameSaver) {
    this.metaManager = metaManager;
    this.dataLoader = dataLoader;
    this.gameSaver = gameSaver;
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
    if (eventName === 'state-change') {
      this.saveGame();
    }
    const listeners = this._listeners[eventName];
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  private _simulateEncounter(adventurer: Adventurer, room: number, encounter: Encounter): { newAdventurer: Adventurer; feedback: string[]; totalDamageTaken: number; } {
    this.gameState?.logger.debug(`--- Encounter: Room ${room} - ${encounter.enemyCount} enemies (Power: ${encounter.enemyPower}, HP: ${encounter.enemyHp}) ---`);
    const feedback: string[] = [];
    let totalDamageTaken = 0;
    let enemiesDefeated = 0;
    const initialHp = adventurer.hp;

    for (let i = 0; i < encounter.enemyCount; i++) {
      this.gameState?.logger.info('info_encounter_enemy', {
        current: i + 1,
        total: encounter.enemyCount,
      });

      let currentEnemyHp = encounter.enemyHp;
      while (currentEnemyHp > 0 && adventurer.hp > 0) {
        const battleAction = getAdventurerBattleChoice(adventurer, encounter);
        if (battleAction === 'use_potion') {
          const potionToUse = adventurer.inventory.potions.shift();
          if (potionToUse) {
            const healedAmount = potionToUse.stats.hp || 0;
            adventurer.hp = Math.min(adventurer.maxHp, adventurer.hp + healedAmount);
            feedback.push(t('game_engine.adventurer_drinks_potion', { potionName: t('items_and_rooms.' + potionToUse.id) }));
            this.gameState?.logger.info('info_adventurer_drinks_potion', { potionName: t('items_and_rooms.' + potionToUse.id) });
          }
        } else {
          // Adventurer's turn
          const adventurerHitChance = Math.min(0.95, 0.75 + (adventurer.traits.skill / 500) + (adventurer.traits.offense / 1000));
          if (rng.nextFloat() < adventurerHitChance) {
            const damageDealt = adventurer.power;
            currentEnemyHp -= damageDealt;
            this.gameState?.logger.debug(`Adventurer hits for ${damageDealt} damage.`);
            processBattleTurn(adventurer, 'hit');
          } else {
            this.gameState?.logger.debug(`Adventurer misses.`);
            processBattleTurn(adventurer, 'miss');
          }
        }

        if (currentEnemyHp <= 0) {
          this.gameState?.logger.info('info_enemy_defeated');
          enemiesDefeated++;
          break;
        }

        // Enemy's turn
        const enemyHitChance = Math.max(0.4, 0.75 - (adventurer.traits.skill / 500) - ((100 - adventurer.traits.offense) / 1000));
        if (rng.nextFloat() < enemyHitChance) {
          const armor = (adventurer.inventory.armor?.stats.maxHp || 0) / 10;
          const damageTaken = Math.max(1, encounter.enemyPower - armor);
          totalDamageTaken += damageTaken;
          adventurer.hp -= damageTaken;
          this.gameState?.logger.debug(`Enemy hits for ${damageTaken} damage.`);
          processBattleTurn(adventurer, 'take_damage');
        } else {
          this.gameState?.logger.debug(`Enemy misses.`);
        }
      }

      if (adventurer.hp <= 0) {
        this.gameState?.logger.warn(`info_adventurer_defeated`);
        break;
      }
    }

    const hpLost = initialHp - adventurer.hp;
    const hpLostRatio = hpLost / adventurer.maxHp;
    this.gameState?.logger.debug(`hpLost: ${hpLost}, hpLostRatio: ${hpLostRatio.toFixed(2)}`);

    const battleFeedback = processBattleOutcome(adventurer, hpLostRatio, enemiesDefeated, encounter.enemyCount);
    feedback.push(battleFeedback);

    return { newAdventurer: adventurer, feedback, totalDamageTaken };
  }

  // --- PUBLIC ACTIONS ---
  public startNewGame = (initialUnlocked?: { items?: string[], rooms?: string[] }) => {
    this.metaManager.incrementAdventurers();
    const newTraits: AdventurerTraits = {
      offense: rng.nextInt(10, 90),
      resilience: rng.nextInt(10, 90),
      skill: 0,
    };
    const logger = new Logger();
    const newAdventurer = new Adventurer(newTraits, logger);

    const unlockedDeck = initialUnlocked?.items || this._allItems.filter(item => item.cost === null).map(item => item.id);
    const runDeck = generateLootDeck(unlockedDeck, this._allItems, DECK_SIZE);
    const handSize = this._getHandSize();
    const hand = runDeck.slice(0, handSize);
    const availableDeck = runDeck.slice(handSize);

    const unlockedRoomDeck = initialUnlocked?.rooms || this._allRooms.filter(item => item.cost === null).map(item => item.id);
    const roomRunDeck = generateRoomDeck(unlockedRoomDeck, this._allRooms, this._getRoomDeckSize());
    const roomHand = roomRunDeck.slice(0, handSize);
    const availableRoomDeck = roomRunDeck.slice(handSize);

    logger.info('info_new_adventurer');

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
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      newlyUnlocked: [],
      shopReturnPhase: null,
    };
    this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(', ')}`);
    this.gameState.logger.debug(`Deck size: ${runDeck.length}, Hand size: ${handSize}, Room Deck size: ${roomRunDeck.length}, Room Hand size: ${roomHand.length}`);

    this._emit('state-change', this.gameState);
  }

  public continueGame = () => {
    const savedState = this.gameSaver.load();
    if (savedState) {
      this.gameState = savedState;
      this._emit('state-change', this.gameState);
    } else {
      // Fallback to a new game if there's no save file
      this.startNewGame();
    }
  }

  public startNewRun = (runNumber?: number) => {
    if (!this.gameState) return;
    const nextRun = runNumber || this.gameState.run + 1;
    this.metaManager.updateRun(nextRun);

    const handSize = this._getHandSize();
    const runDeck = generateLootDeck(this.gameState.unlockedDeck, this._allItems, DECK_SIZE);
    const hand = runDeck.slice(0, handSize);
    const availableDeck = runDeck.slice(handSize);

    const roomRunDeck = generateRoomDeck(this.gameState.unlockedRoomDeck, this._allRooms, this._getRoomDeckSize());
    const roomHand = roomRunDeck.slice(0, handSize);
    const availableRoomDeck = roomRunDeck.slice(handSize);

    const resetAdventurer = new Adventurer(this.gameState.adventurer.traits, this.gameState.logger);
    resetAdventurer.skill = this.gameState.adventurer.skill;
    resetAdventurer.challengeHistory = [...this.gameState.adventurer.challengeHistory];
    resetAdventurer.flowState = this.gameState.adventurer.flowState;

    this.gameState.logger.info('info_adventurer_returns');
    this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(', ')}`);
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
      runEnded: { isOver: false, reason: '', success: false, decision: null },
    };
    this._emit('state-change', this.gameState);
  }

  public presentOffer = (offeredIds: string[]) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_LOOT' || !this.gameState.hand) return;

    const offeredLoot = this.gameState.hand.filter(item => offeredIds.includes(item.instanceId));
    this.gameState.offeredLoot = offeredLoot;

    const adventurer = this.gameState.adventurer;
    const { choice, reason: feedback } = getAdventurerLootChoice(adventurer, this.gameState.offeredLoot, this.gameState.logger);

    processLootChoice(adventurer, choice, this.gameState.offeredLoot);

    if (choice) {
      this.gameState.logger.info('info_item_chosen', { item: t('items_and_rooms.' + choice.id )});
    }

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
      if (choice.type === 'item_potion') {
        adventurer.addPotion(choice);
      } else if (choice.type === 'item_buff') {
        adventurer.applyBuff(choice);
      } else {
        adventurer.equip(choice);
      }
    }

    const newRoom = this.gameState.room + 1;
    const newBalancePoints = this.gameState.designer.balancePoints + this._getBpPerRoom();

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
  }

  public runEncounter = (roomChoices: RoomChoice[]) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_ROOM') return;

    this.gameState.offeredRooms = roomChoices;

    let adventurer = this.gameState.adventurer;
    let feedback: string[] = [];

    const chosenRoomIndex = rng.nextInt(0, this.gameState.offeredRooms.length - 1);
    const chosenRoom = this.gameState.offeredRooms[chosenRoomIndex];

    adventurer.roomHistory.push(chosenRoom.id);
    processRoomEntry(adventurer, chosenRoom);

    this.gameState.logger.info('info_encounter', { name: t('items_and_rooms.' + chosenRoom.id) });

    switch (chosenRoom.type) {
      case 'room_enemy':
      case 'room_boss':
        const encounter: Encounter = {
          enemyCount: chosenRoom.units ?? 1,
          enemyPower: chosenRoom.stats.attack || 5,
          enemyHp: chosenRoom.stats.hp || 10,
        };
        const battleResult = this._simulateEncounter(adventurer, this.gameState.room, encounter);
        adventurer = battleResult.newAdventurer;
        feedback = battleResult.feedback;
        break;

      case 'room_healing':
        const healing = chosenRoom.stats.hp || 0;
        adventurer.hp = Math.min(adventurer.maxHp, adventurer.hp + healing);
        feedback.push(t('game_engine.healing_room', { name: t('items_and_rooms.' + chosenRoom.id), healing: healing }));
        this.gameState.logger.info('info_healing_room', { name: t('items_and_rooms.' + chosenRoom.id), healing: healing });
        break;

      case 'room_trap':
        const damage = chosenRoom.stats.attack || 0;
        adventurer.hp -= damage;
        processTrap(adventurer);
        feedback.push(t('game_engine.trap_room', { name: t('items_and_rooms.' + chosenRoom.id), damage: damage }));
        this.gameState.logger.info('info_trap_room', { name: t('items_and_rooms.' + chosenRoom.id), damage: damage });
        break;
    }

    adventurer.updateBuffs();
    this.gameState.designer.balancePoints += this._getBpPerRoom();

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

    this.gameState.adventurer = adventurer;

    if (adventurer.hp <= 0) {
      this._endRun(t('game_engine.adventurer_fell', { room: this.gameState.room, run: this.gameState.run }));
      return;
    }
    if (adventurer.boredomCounter > 2) {
      const reason = adventurer.flowState === FlowState.Boredom
        ? t('game_engine.adventurer_bored', { room: this.gameState.room, run: this.gameState.run })
        : t('game_engine.adventurer_apathy', { room: this.gameState.room, run: this.gameState.run });
      this._endRun(reason);
      return;
    }

    if (this.gameState.hand && this.gameState.hand.length === 0) {
      this.gameState.logger.warn("warn_empty_hand");
      feedback.push(t('game_engine.empty_hand'));
      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_ROOM',
        room: this.gameState.room + 1,
        designer: { balancePoints: this.gameState.designer.balancePoints + this._getBpPerRoom() },
        feedback: feedback,
        encounter: undefined,
        roomHand: newRoomHand,
        availableRoomDeck: newRoomDeck,
      };
    } else {
      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_LOOT',
        feedback: feedback,
        encounter: undefined,
        roomHand: newRoomHand,
        availableRoomDeck: newRoomDeck,
      };
    }

    this._emit('state-change', this.gameState);
  }

  public forceEndRun = () => {
    if (!this.gameState) return;
    this.gameState.adventurer.modifyChallenge(-20);
    this.gameState.adventurer.updateFlowState();
    this._endRun(t('game_engine.no_more_rooms'), true);
  }

  private _endRun(reason: string, success: boolean = false) {
    if (!this.gameState) return;
    this.metaManager.updateRun(this.gameState.run);
    const newlyUnlocked = this.metaManager.checkForUnlocks(this.gameState.run);
    this.gameState.logger.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`);
    this.gameState.logger.error(`info_game_over`, {reason});

    const decision = this._getAdventurerEndRunDecision();

    this.gameState = {
      ...this.gameState,
      phase: 'RUN_OVER',
      runEnded: { isOver: true, reason: reason, success, decision },
      newlyUnlocked: newlyUnlocked,
    };
    this._emit('state-change', this.gameState);
  }

  public enterWorkshop = () => {
    if (!this.gameState) return;
    this.gameState.logger.info('info_entering_workshop');

    if (!this.metaManager.acls.has(UnlockableFeature.WORKSHOP)) {
      this.gameState.logger.info('info_workshop_not_unlocked');
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
      shopReturnPhase: this.gameState.phase,
      run: nextRun,
      room: 0,
      shopItems: shuffleArray(allShopItems).slice(0, 4),
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      feedback: t('game_engine.welcome_to_workshop')
    };
    this._emit('state-change', this.gameState);
  }

  public exitWorkshop = () => {
    if (!this.gameState) return;
    this.startNewRun();
  }

  public purchaseItem = (itemId: string) => {
    if (!this.gameState) return;

    const item = this._allItems.find(i => i.id === itemId);
    const room = this._allRooms.find(r => r.id === itemId);
    const itemToBuy = item || room;

    if (!itemToBuy || itemToBuy.cost === null || this.gameState.designer.balancePoints < itemToBuy.cost) return;

    let newUnlockedDeck = this.gameState.unlockedDeck;
    let newUnlockedRoomDeck = this.gameState.unlockedRoomDeck;
    let newAvailableDeck = this.gameState.availableDeck;
    let newAvailableRoomDeck = this.gameState.availableRoomDeck;

    if (item) {
      newUnlockedDeck = [...this.gameState.unlockedDeck, itemId];
      if (this.isWorkshopAccessUnlocked()) {
        newAvailableDeck = [item, ...this.gameState.availableDeck];
      }
    } else if (room) {
      newUnlockedRoomDeck = [...this.gameState.unlockedRoomDeck, itemId];
      if (this.isWorkshopAccessUnlocked()) {
        newAvailableRoomDeck = [room, ...this.gameState.availableRoomDeck];
      }
    }

    const newBalancePoints = this.gameState.designer.balancePoints - itemToBuy.cost;
    const newShopItems = this.gameState.shopItems.filter(i => i.id !== itemId);

    this.gameState.logger.info(`info_item_purchased`, { item: t('items_and_rooms.' + itemToBuy.id) });
    this.gameState = {
      ...this.gameState,
      designer: { balancePoints: newBalancePoints },
      unlockedDeck: newUnlockedDeck,
      unlockedRoomDeck: newUnlockedRoomDeck,
      availableDeck: newAvailableDeck,
      availableRoomDeck: newAvailableRoomDeck,
      shopItems: newShopItems
    };
    this._emit('state-change', this.gameState);
  }

  private _getAdventurerEndRunDecision(): 'continue' | 'retire' {
    if (!this.gameState) {
      return 'retire';
    }
    const { flowState, traits, skill } = this.gameState.adventurer;
    const { resilience, offense } = traits;

    // The adventurers experience, capped at 100
    const experienceFactor = Math.min(skill / 100, 1);

    if (flowState === FlowState.Flow) {
      return 'continue';
    }

    // Base retire chance: 55%
    let retireChance = 0.55;

    switch (flowState) {
      case FlowState.Anxiety:
        // High challenge, low skill. High retire chance, but resilient adventurers might push through.
        retireChance += 0.25 - (resilience / 400);
        break;
      case FlowState.Arousal:
        // High challenge, medium skill. Exciting, but risky. Offensive adventurers might enjoy the risk.
        retireChance -= 0.1 - (offense / 1000);
        break;
      case FlowState.Worry:
        // Medium challenge, low skill. Cautious state.
        retireChance += 0.2;
        break;
      case FlowState.Control:
        // Medium challenge, high skill. Confident, but might get cocky or decide they've proven enough.
        retireChance -= 0.15;
        break;
      case FlowState.Relaxation:
        // Low challenge, high skill. Content, good chance of retiring.
        retireChance += 0.1;
        break;
      case FlowState.Boredom:
        // Low challenge, medium skill. Very high chance of retiring.
        retireChance += 0.3;
        break;
      case FlowState.Apathy:
        // Low challenge, low skill. Almost guaranteed to retire.
        retireChance += 0.4;
        break;
    }

    // Experience makes adventurers slightly less likely to retire
    retireChance -= experienceFactor * 0.1;

    // Ensure retireChance is within a reasonable range (e.g., 5% to 95%)
    retireChance = Math.max(0.05, Math.min(0.95, retireChance));

    if (rng.nextFloat() < retireChance) {
      return 'retire';
    } else {
      return 'continue';
    }
  }

  public handleEndOfRun(decision: 'continue' | 'retire') {
    if (!this.gameState) return;
    this.gameState.logger.info('info_adventurer_decision', { decision });

    if (decision === 'retire') {
      this.quitGame(true); // Clear save on retire, only meta progression is kept.
      return;
    }

    // Player chose to continue, so we enter the workshop (or start a new run if not unlocked)
    this.enterWorkshop();
  }

  public quitGame = (clearSave: boolean = true) => {
    if (clearSave) {
      this.gameSaver.clear();
    }
    this.showMenu();
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
      offense: rng.nextInt(10, 90),
      resilience: rng.nextInt(10, 90),
      skill: 0,
    };
    const logger = new Logger();
    const newAdventurer = new Adventurer(newTraits, logger);
    return {
      phase: 'MENU',
      designer: { balancePoints: 0 },
      adventurer: newAdventurer,
      unlockedDeck: [],
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
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      newlyUnlocked: [],
      shopReturnPhase: null,
    };
  }

  private _getHandSize(): number {
    if (this.metaManager.acls.has(UnlockableFeature.HAND_SIZE_INCREASE)) {
      return 12;
    }
    return HAND_SIZE;
  }

  private _getRoomDeckSize(): number {
    if (this.metaManager.acls.has(UnlockableFeature.ROOM_DECK_SIZE_INCREASE)) {
      return 36;
    }
    return ROOM_DECK_SIZE;
  }

  private _getBpPerRoom = (): number => {
    if (this.metaManager.acls.has(UnlockableFeature.BP_MULTIPLIER_2)) {
      return BP_PER_ROOM * 4;
    }
    if (this.metaManager.acls.has(UnlockableFeature.BP_MULTIPLIER)) {
      return BP_PER_ROOM * 2;
    }
    return BP_PER_ROOM;
  }

  public isWorkshopAccessUnlocked(): boolean {
    return this.metaManager.acls.has(UnlockableFeature.WORKSHOP_ACCESS);
  }

  public isWorkshopUnlocked(): boolean {
    return this.metaManager.acls.has(UnlockableFeature.WORKSHOP);
  }

  public hasSaveGame(): boolean {
    return this.gameSaver.hasSaveGame();
  }

  private saveGame = () => {
    // We don't save in the menu or on the run over screen.
    if (this.gameState && this.gameState.phase !== 'MENU' && this.gameState.phase !== 'RUN_OVER') {
      this.gameSaver.save(this.gameState);
    }
  }

  // --- INITIALIZATION ---
  private async _loadGameData() {
    try {
      this._allItems = await this.dataLoader.loadJson('game/items.json');
      this._allRooms = await this.dataLoader.loadJson('game/rooms.json');
    } catch (e: any) {
      this.error = e.message || t('global.unknown_error');
      this._emit('error', null);
    } finally {
      this.isLoading = false;
      this._emit('state-change', this.gameState);
    }
  }
}
