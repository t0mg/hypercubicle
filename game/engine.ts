import type { GamePhase, GameState, LootChoice, AdventurerTraits, Encounter, RoomChoice, DataLoader, EncounterPayload, EncounterLog, EncounterEvent, AdventurerSnapshot } from '../types';
import { FlowState } from '../types';
import { Adventurer } from './adventurer';
import { Logger } from './logger';
import { MetaManager } from './meta';
import { GameSaver } from './saver';

const logger = Logger.getInstance();
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

interface GameEvents {
  'state-change': (state: GameState | null) => void;
  'error': (state: GameState | null) => void;
  'show-encounter': (payload: EncounterPayload) => void;
}

export class GameEngine {
  public gameState: GameState | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  private _allItems: LootChoice[] = [];
  private _allRooms: RoomChoice[] = [];
  private _allNames: { firstNames: string[], lastNames: string[] } = { firstNames: [], lastNames: [] };
  private _listeners: { [K in keyof GameEvents]?: GameEvents[K][] } = {};
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
  public on<K extends keyof GameEvents>(eventName: K, listener: GameEvents[K]): void {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName]!.push(listener);
  }

  private _emit<K extends keyof GameEvents>(eventName: K, ...args: Parameters<GameEvents[K]>): void {
    if (eventName === 'state-change') {
      this.saveGame();
    }
    const listeners = this._listeners[eventName];
    if (listeners) {
      listeners.forEach(listener => (listener as any)(...args));
    }
  }

  private _createAdventurerSnapshot(adventurer: Adventurer): AdventurerSnapshot {
    return {
      firstName: adventurer.firstName,
      lastName: adventurer.lastName,
      hp: adventurer.hp,
      maxHp: adventurer.maxHp,
      power: adventurer.power,
      flowState: adventurer.flowState,
      inventory: JSON.parse(JSON.stringify(adventurer.inventory)),
    };
  }

  private _generateEncounterLog(
    adventurer: Adventurer,
    room: RoomChoice
  ): { log: EncounterLog; finalAdventurer: Adventurer } {
    const encounterLog: EncounterLog = [];
    const adventurerClone = Adventurer.fromJSON(adventurer.toJSON());

    logger.info('info_encounter', { name: adventurerClone.firstName, roomName: t('items_and_rooms.' + room.id) });
    const oldFlowState = adventurerClone.flowState;
    processRoomEntry(adventurerClone, room);
    if (oldFlowState !== adventurerClone.flowState) {
      logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
    }

    encounterLog.push({
      messageKey: 'log_messages.info_encounter',
      replacements: { name: adventurerClone.firstName, roomName: t('items_and_rooms.' + room.id) },
      adventurer: this._createAdventurerSnapshot(adventurerClone),
    });

    switch (room.type) {
      case 'room_enemy':
      case 'room_boss': {
        const encounter: Encounter = {
          enemyCount: room.units ?? 1,
          enemyPower: room.stats.attack || 5,
          enemyHp: room.stats.hp || 10,
        };
        let enemiesDefeated = 0;
        const initialHp = adventurerClone.hp;

        for (let i = 0; i < encounter.enemyCount; i++) {
          let currentEnemyHp = encounter.enemyHp;
          logger.info('info_encounter_enemy', {
            name: adventurerClone.firstName,
            enemyName: room.entity_id ? t('entities.' + room.entity_id) : t('items_and_rooms.' + room.id),
            current: i + 1,
            total: encounter.enemyCount,
          });
          const enemyName = room.entity_id ? t('entities.' + room.entity_id) : t('items_and_rooms.' + room.id);
          const enemySnapshot = {
            currentHp: currentEnemyHp,
            maxHp: encounter.enemyHp,
            power: encounter.enemyPower,
            name: enemyName,
            count: i + 1,
            total: encounter.enemyCount,
          };
          encounterLog.push({
            messageKey: 'log_messages.info_encounter_enemy',
            replacements: { 
              name: adventurerClone.firstName,
              enemyName: room.entity_id ? t('entities.' + room.entity_id) : t('items_and_rooms.' + room.id),
              current: i + 1, 
              total: encounter.enemyCount
            },
            adventurer: this._createAdventurerSnapshot(adventurerClone),
            enemy: enemySnapshot,
          });

          while (currentEnemyHp > 0 && adventurerClone.hp > 0) {
            const battleAction = getAdventurerBattleChoice(adventurerClone, encounter);
            if (battleAction === 'use_potion') {
              const potionToUse = adventurerClone.inventory.potions.shift();
              if (potionToUse) {
                const healedAmount = potionToUse.stats.hp || 0;
                adventurerClone.hp = Math.min(adventurerClone.maxHp, adventurerClone.hp + healedAmount);
                logger.info('info_adventurer_drinks_potion', { name: adventurerClone.firstName, potionName: t('items_and_rooms.' + potionToUse.id) });
                encounterLog.push({
                  messageKey: 'log_messages.info_adventurer_drinks_potion',
                  replacements: { name: adventurerClone.firstName, potionName: t('items_and_rooms.' + potionToUse.id) },
                  adventurer: this._createAdventurerSnapshot(adventurerClone),
                  enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                });
              }
            } else {
              const adventurerHitChance = Math.min(0.95, 0.75 + (adventurerClone.traits.skill / 500) + (adventurerClone.traits.offense / 1000));
              if (rng.nextFloat() < adventurerHitChance) {
                const damageDealt = adventurerClone.power;
                currentEnemyHp -= damageDealt;
                logger.debug(`Adventurer hits for ${damageDealt} damage.`);
                const oldFlowState = adventurerClone.flowState;
                processBattleTurn(adventurerClone, 'hit');
                if (oldFlowState !== adventurerClone.flowState) {
                  logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
                  encounterLog.push({
                    messageKey: 'log_messages.info_flow_state_changed',
                    replacements: { name: adventurerClone.firstName, from: t(`flow_states.${oldFlowState}`), to: t(`flow_states.${adventurerClone.flowState}`) },
                    adventurer: this._createAdventurerSnapshot(adventurerClone),
                    enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                  });
                }
                encounterLog.push({
                  messageKey: 'log_messages.info_adventurer_hit',
                  replacements: { name: adventurerClone.firstName, damage: damageDealt },
                  adventurer: this._createAdventurerSnapshot(adventurerClone),
                  enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                  animations: [{ target: 'adventurer', animation: 'attack' }, {target: 'enemy', animation: 'shake'}]
                });
              } else {
                logger.debug(`Adventurer misses.`);
                const oldFlowState = adventurerClone.flowState;
                processBattleTurn(adventurerClone, 'miss');
                if (oldFlowState !== adventurerClone.flowState) {
                  logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
                  encounterLog.push({
                    messageKey: 'log_messages.info_flow_state_changed',
                    replacements: { name: adventurerClone.firstName, from: t(`flow_states.${oldFlowState}`), to: t(`flow_states.${adventurerClone.flowState}`) },
                    adventurer: this._createAdventurerSnapshot(adventurerClone),
                    enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                  });
                }
                encounterLog.push({
                  messageKey: 'log_messages.info_adventurer_miss',
                  replacements: { name: adventurerClone.firstName },
                  adventurer: this._createAdventurerSnapshot(adventurerClone),
                  enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                  animations: [{ target: 'adventurer', animation: 'attack' }]
                });
              }
            }

            if (currentEnemyHp <= 0) {
              logger.info('info_enemy_defeated', { enemyName: enemySnapshot.name });
              enemiesDefeated++;
              encounterLog.push({
                messageKey: 'log_messages.info_enemy_defeated',
                replacements: { enemyName: enemySnapshot.name },
                adventurer: this._createAdventurerSnapshot(adventurerClone),
                enemy: { ...enemySnapshot, currentHp: 0 },
                animations: [{ target: 'enemy', animation: 'defeat' }]
              });
              break;
            }

            const enemyHitChance = Math.max(0.4, 0.75 - (adventurerClone.traits.skill / 500) - ((100 - adventurerClone.traits.offense) / 1000));
            if (rng.nextFloat() < enemyHitChance) {
              const armor = (adventurerClone.inventory.armor?.stats.maxHp || 0) / 10;
              const damageTaken = Math.max(1, encounter.enemyPower - armor);
              adventurerClone.hp -= damageTaken;
              logger.debug(`Enemy hits for ${damageTaken} damage.`);
              const oldFlowState = adventurerClone.flowState;
              processBattleTurn(adventurerClone, 'take_damage');
              if (oldFlowState !== adventurerClone.flowState) {
                logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
                encounterLog.push({
                  messageKey: 'log_messages.info_flow_state_changed',
                  replacements: { name: adventurerClone.firstName, from: t(`flow_states.${oldFlowState}`), to: t(`flow_states.${adventurerClone.flowState}`) },
                  adventurer: this._createAdventurerSnapshot(adventurerClone),
                  enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                });
              }
              encounterLog.push({
                messageKey: 'log_messages.info_enemy_hit',
                replacements: { damage: damageTaken, enemyName: enemySnapshot.name },
                adventurer: this._createAdventurerSnapshot(adventurerClone),
                enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                animations: [{ target: 'enemy', animation: 'attack' }, { target: 'adventurer', animation: 'shake' }]
              });
            } else {
              logger.debug(`Enemy misses.`);
              encounterLog.push({
                messageKey: 'log_messages.info_enemy_miss',
                replacements: { enemyName: enemySnapshot.name },
                adventurer: this._createAdventurerSnapshot(adventurerClone),
                enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
                animations: [{ target: 'enemy', animation: 'attack' }]
              });
            }
          }

          if (adventurerClone.hp <= 0) {
            logger.warn(`info_adventurer_defeated`, { name: adventurerClone.firstName });
            encounterLog.push({
              messageKey: 'log_messages.info_adventurer_defeated',
              replacements: { name: adventurerClone.firstName },
              adventurer: this._createAdventurerSnapshot(adventurerClone),
              enemy: { ...enemySnapshot, currentHp: currentEnemyHp },
              animations: [{ target: 'adventurer', animation: 'defeat' }]
            });
            break;
          }
        }
        const hpLost = initialHp - adventurerClone.hp;
        const hpLostRatio = hpLost / adventurerClone.maxHp;
        logger.debug(`hpLost: ${hpLost}, hpLostRatio: ${hpLostRatio.toFixed(2)}`);
        const oldFlowState = adventurerClone.flowState;
        const battleFeedback = processBattleOutcome(adventurerClone, hpLostRatio, enemiesDefeated, encounter.enemyCount);
        if (oldFlowState !== adventurerClone.flowState) {
          logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
        }
        logger.info('info_battle_outcome', { outcome: battleFeedback });
        break;
      }
      case 'room_healing': {
        const healing = room.stats.hp || 0;
        adventurerClone.hp = Math.min(adventurerClone.maxHp, adventurerClone.hp + healing);
        logger.info('info_healing_room', { name: adventurerClone.firstName, healingRoomName: t('items_and_rooms.' + room.id), healing: healing });
        encounterLog.push({
          messageKey: 'log_messages.info_healing_room',
          replacements: { name: adventurerClone.firstName, healingRoomName: t('items_and_rooms.' + room.id), healing: healing },
          adventurer: this._createAdventurerSnapshot(adventurerClone),
        });
        break;
      }
      case 'room_trap': {
        const damage = room.stats.attack || 0;
        adventurerClone.hp -= damage;
        const oldFlowState = adventurerClone.flowState;
        processTrap(adventurerClone);
        if (oldFlowState !== adventurerClone.flowState) {
          logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurerClone.flowState });
        }
        logger.info('info_trap_room', { name: adventurerClone.firstName, trapName: t('items_and_rooms.' + room.id), damage: damage });
        encounterLog.push({
          messageKey: 'log_messages.info_trap_room',
          replacements: { name: adventurerClone.firstName, trapName: t('items_and_rooms.' + room.id), damage: damage },
          adventurer: this._createAdventurerSnapshot(adventurerClone),
        });
        break;
      }
    }
    return { log: encounterLog, finalAdventurer: adventurerClone };
  }

  // --- PUBLIC ACTIONS ---
  public startNewGame = (initialUnlocked?: { items?: string[], rooms?: string[] }) => {
    this.metaManager.incrementAdventurers();
    const newTraits: AdventurerTraits = {
      offense: rng.nextInt(10, 90),
      resilience: rng.nextInt(10, 90),
      skill: 0,
    };
    logger.loadEntries([]);
    const newAdventurer = new Adventurer(newTraits, this._allNames);

    const unlockedDeck = initialUnlocked?.items || this._allItems.filter(item => item.cost === null).map(item => item.id);
    const runDeck = generateLootDeck(unlockedDeck, this._allItems, DECK_SIZE);
    const handSize = this._getHandSize();
    const hand = runDeck.slice(0, handSize);
    const availableDeck = runDeck.slice(handSize);

    const unlockedRoomDeck = initialUnlocked?.rooms || this._allRooms.filter(item => item.cost === null).map(item => item.id);
    const roomRunDeck = generateRoomDeck(unlockedRoomDeck, this._allRooms, this._getRoomDeckSize());
    const roomHand = roomRunDeck.slice(0, handSize);
    const availableRoomDeck = roomRunDeck.slice(handSize);

    logger.info('info_new_adventurer', {
      fullName: `${newAdventurer.firstName} ${newAdventurer.lastName}`,
      id: this.metaManager.metaState.adventurers.toString(),
    });

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
      run: 1,
      room: 1,
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      newlyUnlocked: [],
      shopReturnPhase: null,
    };
    logger.info('info_new_adventurer', {
      fullName: `${newAdventurer.firstName} ${newAdventurer.lastName}`,
      id: this.metaManager.metaState.adventurers.toString(),
    });
    this.gameState = {
      ...this.gameState,
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
      run: 1,
      room: 1,
      runEnded: { isOver: false, reason: '', success: false, decision: null },
      newlyUnlocked: [],
      shopReturnPhase: null,
    };
    logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(', ')}`);
    logger.debug(`Deck size: ${runDeck.length}, Hand size: ${handSize}, Room Deck size: ${roomRunDeck.length}, Room Hand size: ${roomHand.length}`);

    this._emit('state-change', this.gameState);
  }

  public continueGame = () => {
    const savedState = this.gameSaver.load();
    if (savedState) {
      this.gameState = savedState;
      this._emit('state-change', this.gameState);

      // If we load into a state where we're waiting for an encounter result,
      // we need to re-trigger the encounter modal.
      if (this.gameState.phase === 'AWAITING_ENCOUNTER_RESULT' && this.gameState.encounterPayload) {
        this._emit('show-encounter', this.gameState.encounterPayload);
      }
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

    const resetAdventurer = new Adventurer(this.gameState.adventurer.traits, this._allNames);
    resetAdventurer.skill = this.gameState.adventurer.skill;
    resetAdventurer.challengeHistory = [...this.gameState.adventurer.challengeHistory];
    resetAdventurer.flowState = this.gameState.adventurer.flowState;

    logger.info('info_adventurer_returns', { name: resetAdventurer.firstName });
    logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(', ')}`);
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
      runEnded: { isOver: false, reason: '', success: false, decision: null },
    };
    this._emit('state-change', this.gameState);
  }

  public presentOffer = (offeredIds: string[]) => {
    if (!this.gameState || this.gameState.phase !== 'DESIGNER_CHOOSING_LOOT' || !this.gameState.hand) return;

    const offeredLoot = this.gameState.hand.filter(item => offeredIds.includes(item.instanceId));
    this.gameState.offeredLoot = offeredLoot;

    const adventurer = this.gameState.adventurer;
    const { choice, reason: feedback } = getAdventurerLootChoice(adventurer, this.gameState.offeredLoot, logger);

    logger.info('info_loot_choice_reason', { reason: feedback });
    const oldFlowState = adventurer.flowState;
    processLootChoice(adventurer, choice, this.gameState.offeredLoot);
    if (oldFlowState !== adventurer.flowState) {
      logger.info('info_flow_state_changed_metrics', { event: 'flow_state_changed', flowState: adventurer.flowState });
    }

    if (choice) {
      logger.info('info_item_chosen', { name: adventurer.firstName, item: t('items_and_rooms.' + choice.id )});
      logger.info('info_item_chosen_metrics', { event: 'item_chosen', item: choice });
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
    const chosenRoomIndex = rng.nextInt(0, this.gameState.offeredRooms.length - 1);
    const chosenRoom = this.gameState.offeredRooms[chosenRoomIndex];

    logger.info('info_room_encountered_metrics', { event: 'room_encountered', room: chosenRoom });

    const { log, finalAdventurer } = this._generateEncounterLog(
      this.gameState.adventurer,
      chosenRoom
    );

    const payload: EncounterPayload = {
      room: chosenRoom,
      log,
      finalAdventurer,
    };

    this.gameState = {
      ...this.gameState,
      phase: 'AWAITING_ENCOUNTER_RESULT',
      encounterPayload: payload,
    };
    this._emit('state-change', this.gameState);
    this._emit('show-encounter', payload);
  }

  public continueEncounter = () => {
    if (!this.gameState || this.gameState.phase !== 'AWAITING_ENCOUNTER_RESULT') return;
    this._postEncounterUpdate();
  }

  private _postEncounterUpdate = () => {
    if (!this.gameState) return;

    const adventurer = Adventurer.fromJSON(this.gameState.encounterPayload.finalAdventurer);
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
      logger.warn("warn_empty_hand", { name: adventurer.firstName });
      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_ROOM',
        room: this.gameState.room + 1,
        designer: { balancePoints: this.gameState.designer.balancePoints + this._getBpPerRoom() },
        encounterPayload: undefined,
        roomHand: newRoomHand,
        availableRoomDeck: newRoomDeck,
      };
    } else {
      this.gameState = {
        ...this.gameState,
        phase: 'DESIGNER_CHOOSING_LOOT',
        encounterPayload: undefined,
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
    logger.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`);
    logger.info('info_run_end_metrics', { event: 'run_end', bp: this.gameState.designer.balancePoints });
    logger.error(`info_game_over`, {reason});

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

    if (!this.metaManager.acls.has(UnlockableFeature.WORKSHOP)) {
      logger.debug('Workshop not unlocked, starting new run directly.');
      this.startNewRun();
      return;
    }

    logger.info('info_entering_workshop', { name: this.gameState.adventurer.firstName });

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
    };
    logger.info('info_welcome_to_workshop');
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

    logger.info(`info_item_purchased`, { name: this.gameState.adventurer.firstName, item: t('items_and_rooms.' + itemToBuy.id) });
    logger.info('info_item_purchased_metrics', { event: 'item_purchased', item: itemToBuy });
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
    logger.info('info_adventurer_decision', { name: this.gameState.adventurer.firstName, decision });

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
    const newAdventurer = new Adventurer(newTraits, this._allNames);
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
      this._allNames = await this.dataLoader.loadJson('game/names.json');
    } catch (e: any) {
      this.error = e.message || t('global.unknown_error');
      this._emit('error', null);
    } finally {
      this.isLoading = false;
      this._emit('state-change', this.gameState);
    }
  }
}
