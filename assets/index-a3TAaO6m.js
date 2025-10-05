(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();var f=(n=>(n[n.Arousal=0]="Arousal",n[n.Flow=1]="Flow",n[n.Control=2]="Control",n[n.Relaxation=3]="Relaxation",n[n.Boredom=4]="Boredom",n[n.Apathy=5]="Apathy",n[n.Worry=6]="Worry",n[n.Anxiety=7]="Anxiety",n))(f||{});class le{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const y=new le(Date.now()),Q=n=>`${n}_${y.nextFloat().toString(36).substr(2,9)}`,ce=(n,e)=>y.nextInt(n,e),Y=n=>{const e=[...n];for(let t=e.length-1;t>0;t--){const s=y.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},X=(n,e,t,s)=>{const i=e.filter(u=>n.includes(u.id)),a=[],r={Common:.6,Uncommon:.3,Rare:.1},l={Common:0,Uncommon:0,Rare:0},c={Common:0,Uncommon:0,Rare:0};Object.keys(r).forEach(u=>{c[u]=Math.floor(t*r[u])});let h=Object.values(c).reduce((u,b)=>u+b,0);for(;h<t;)c.Common+=1,h+=1;i.filter(u=>u.cost!==null).forEach(u=>{a.push(s(u)),l[u.rarity]+=1}),Object.keys(r).forEach((u,b)=>{const d=i.filter(m=>m.rarity===u);for(;l[u]<c[u]&&d.length!==0;){const m=y.nextInt(0,d.length-1),p=d[m];a.push(s(p)),l[u]+=1}});const g=i.filter(u=>u.rarity==="Common");for(;a.length<t&&g.length>0;){const u=y.nextInt(0,g.length-1),b=g[u];a.push(s(b))}return Y(a)},W=(n,e,t)=>X(n,e,t,s=>({...s,instanceId:Q(s.id)})),Z=(n,e,t)=>X(n,e,t,i=>{const a={...i,instanceId:Q(i.id)};return a.type==="enemy"&&a.stats.minUnits&&a.stats.maxUnits&&(a.units=ce(a.stats.minUnits,a.stats.maxUnits)),a}),de=n=>n.roomHand.length<3&&!n.roomHand.some(e=>e.type==="boss"),he=n=>[...new Set(n.hand.map(t=>t.id))].length<2&&n.hand.length>0;function me(n,e){const t=Math.max(0,Math.min(100,n)),s=Math.max(0,Math.min(100,e));return s>66?t<33?f.Anxiety:t<87?f.Arousal:f.Flow:s>33?t<33?f.Worry:t<67?f.Apathy:f.Control:t<67?f.Boredom:f.Relaxation}const L={hp:100,maxHp:100,power:5},ue=3;class H{constructor(e,t){this.hp=L.hp,this.maxHp=L.maxHp,this.power=L.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=f.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=t,this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>ue&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=me(this.skill,this.challenge),e!==this.flowState&&(this.logger.info(`Adventurer's state of mind changed from ${f[e]} to ${f[this.flowState]}`),this.logger.log(`Flow state changed to ${f[this.flowState]}`,"INFO",{event:"flow_state_changed",flowState:f[this.flowState]}))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=L.power,s=L.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(i=>{t+=i.stats.power||0,s+=i.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter}}static fromJSON(e,t){const s=e.traits,i=new H(s,t);return i.hp=e.hp,i.maxHp=e.maxHp,i.power=e.power,i.inventory=e.inventory,i.activeBuffs=e.activeBuffs,i.skill=e.skill,i.challengeHistory=e.challengeHistory,i.flowState=e.flowState,i.roomHistory=e.roomHistory,i.lootHistory=e.lootHistory,i.boredomCounter=e.boredomCounter,i}}class A{constructor(){this.entries=[],this.listeners=[],this.muted=!1}on(e){this.listeners.push(e)}log(e,t="INFO",s){const i={message:e,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(i),t!=="DEBUG"&&console.log(`[${t}] ${e}`)),this.listeners.forEach(a=>a(i))}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}toJSON(){return{entries:this.entries}}static fromJSON(e){const t=new A;return t.entries=e.entries||[],t}}const pe=99,ge=10,q=10,K=32,fe=18,be=8;let ee={};async function te(n,e){try{ee=await e.loadJson(`locales/${n}.json`)}catch(t){console.warn(`Failed to load ${n} translations:`,t),n!=="en"&&await te("en",e)}}function _e(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function o(n,e={}){let s=n.split(".").reduce((i,a)=>i?i[a]:void 0,ee);if(!s)return console.warn(`Translation not found for key: ${n}`),n;for(const i in e)s=s.replace(`{${i}}`,String(e[i]));return s}async function ve(n){const e=_e();await te(e,n)}var S=(n=>(n.WORKSHOP="workshop",n.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",n.HAND_SIZE_INCREASE="hand_size_increase",n.ADVENTURER_TRAITS="ADVENTURER_TRAITS",n.BP_MULTIPLIER="BP_MULTIPLIER",n.WORKSHOP_ACCESS="WORKSHOP_ACCESS",n.BP_MULTIPLIER_2="BP_MULTIPLIER_2",n))(S||{});const se=[{feature:"workshop",runThreshold:2,title:()=>o("unlocks.workshop.title"),description:()=>o("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>o("unlocks.room_deck_size_increase.title"),description:()=>o("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>o("unlocks.hand_size_increase.title"),description:()=>o("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>o("unlocks.adventurer_traits.title"),description:()=>o("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>o("unlocks.bp_multiplier.title"),description:()=>o("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>o("unlocks.workshop_access.title"),description:()=>o("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>o("unlocks.bp_multiplier_2.title"),description:()=>o("unlocks.bp_multiplier_2.description")}],ne=10;function ie(n,e){var h,g,u,b;const{traits:t,inventory:s,hp:i,maxHp:a}=n;let r=(e.rarity==="Uncommon"?2:e.rarity==="Rare"?3:1)*5;const l=((h=s.weapon)==null?void 0:h.stats.power)||0,c=((g=s.armor)==null?void 0:g.stats.maxHp)||0;switch(e.type){case"Weapon":const d=(e.stats.power||0)-l;if(d<=0&&e.id!==((u=s.weapon)==null?void 0:u.id))return-1;r+=d*(t.offense/10),d>0&&(r+=d*(n.skill/10));const m=e.stats.maxHp||0;m<0&&(r+=m*(100-t.resilience)/20);break;case"Armor":const p=(e.stats.maxHp||0)-c;if(p<=0&&e.id!==((b=s.armor)==null?void 0:b.id))return-1;r+=p*(100-t.offense)/10,p>0&&(r+=p*(n.skill/10));const _=e.stats.power||0;_>0&&(r+=_*(t.offense/15));const v=e.stats.power||0;v<0&&(r+=v*(t.resilience/10));break;case"Potion":const x=i/a;r+=10*(100-t.resilience)/100,x<.7&&(r+=20*(1-x)),r+=5*(n.skill/100),s.potions.length>=pe&&(r*=.1);break}return r}function xe(n,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${n.traits.offense}, Resilience: ${n.traits.resilience}, Skill: ${n.skill})`);const s=e.map(r=>({item:r,score:ie(n,r)})).filter(r=>r.score>0);if(s.sort((r,l)=>l.score-r.score),s.length===0||s[0].score<ge)return{choice:null,reason:o("game_engine.adventurer_declines_offer")};const i=s[0].item;t.debug(`Adventurer chooses: ${i.name} (Score: ${s[0].score.toFixed(1)})`);const a=o("game_engine.adventurer_accepts_offer",{itemName:i.name});return{choice:i,reason:a}}function we(n,e){const{flowState:t,hp:s,maxHp:i,inventory:a,traits:r}=n,l=s/i;if(a.potions.length===0)return"attack";let c=.5;switch(t){case f.Anxiety:case f.Worry:c=.8;break;case f.Arousal:case f.Flow:c=.6;break;case f.Control:case f.Relaxation:c=.4;break;case f.Boredom:case f.Apathy:c=.2;break}return c-=r.resilience/200,l<Math.max(.1,c)?"use_potion":"attack"}function ye(n,e,t){if(e){n.lootHistory.push(e.id),n.lootHistory.filter(a=>a===e.id).length>2&&(n.modifyChallenge(n.challenge-ne),n.logger.info(`Adventurer feels a sense of repetitiveness from seeing ${e.name} again.`));const i=ie(n,e);i>60?(n.modifySkill(10),n.modifyChallenge(n.challenge+5)):i>30?(n.modifySkill(5),n.modifyChallenge(n.challenge+2)):n.modifySkill(2)}else t.length>0?n.modifyChallenge(n.challenge-5):n.modifyChallenge(n.challenge-10);n.updateFlowState()}function Se(n,e){n.roomHistory.push(e.id),n.roomHistory.filter(i=>i===e.id).length>2&&(n.modifyChallenge(n.challenge-ne),n.logger.info(`Adventurer feels a sense of deja vu upon entering ${e.name}.`));let s=0;switch(e.type){case"enemy":s=5;break;case"boss":s=15;break;case"trap":s=10;break;case"healing":s=-15;break}n.modifyChallenge(n.challenge+s),n.updateFlowState()}function ke(n){n.modifySkill(-2),n.updateFlowState()}function U(n,e){switch(e){case"hit":n.modifySkill(.5);break;case"miss":n.modifySkill(-.5);break;case"take_damage":n.modifyChallenge(n.challenge+1);break}n.updateFlowState()}function Ee(n,e,t,s){let i;return e>.7?(i=o("game_engine.too_close_for_comfort"),n.modifyChallenge(n.challenge+10),n.modifySkill(-3)):e>.4?(i=o("game_engine.great_battle"),n.modifyChallenge(n.challenge+5),n.modifySkill(5)):t>3&&n.traits.offense>60?(i=o("game_engine.easy_fight"),n.modifyChallenge(n.challenge-10)):(i=o("game_engine.worthy_challenge"),n.modifyChallenge(n.challenge-2),n.modifySkill(2)),t===s&&n.modifySkill(1*t),n.updateFlowState(),i}class $e{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=i=>{this.metaManager.incrementAdventurers();const a={offense:y.nextInt(10,90),resilience:y.nextInt(10,90),skill:0},r=new A,l=new H(a,r),c=(i==null?void 0:i.items)||this._allItems.filter(v=>v.cost===null).map(v=>v.id),h=W(c,this._allItems,K),g=this._getHandSize(),u=h.slice(0,g),b=h.slice(g),d=(i==null?void 0:i.rooms)||this._allRooms.filter(v=>v.cost===null).map(v=>v.id),m=Z(d,this._allRooms,this._getRoomDeckSize()),p=m.slice(0,g),_=m.slice(g);r.info("--- Starting New Adventurer (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:c,availableDeck:b,hand:u,unlockedRoomDeck:d,availableRoomDeck:_,roomHand:p,handSize:g,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:o("game_engine.new_adventurer"),logger:r,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const i=this.gameSaver.load();i?(this.gameState=i,this._emit("state-change",this.gameState)):this.startNewGame()},this.startNewRun=i=>{if(!this.gameState)return;const a=i||this.gameState.run+1;this.metaManager.updateRun(a);const r=this._getHandSize(),l=W(this.gameState.unlockedDeck,this._allItems,K),c=l.slice(0,r),h=l.slice(r),g=Z(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),u=g.slice(0,r),b=g.slice(r),d=new H(this.gameState.adventurer.traits,this.gameState.logger);d.skill=this.gameState.adventurer.skill,d.challengeHistory=[...this.gameState.adventurer.challengeHistory],d.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info(`--- Starting Run ${a} ---`),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:d,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:h,hand:c,availableRoomDeck:b,roomHand:u,handSize:r,room:1,run:a,feedback:o("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const a=this.gameState.hand.filter(v=>i.includes(v.instanceId));this.gameState.offeredLoot=a;const r=this.gameState.adventurer,{choice:l,reason:c}=xe(r,this.gameState.offeredLoot,this.gameState.logger);ye(r,l,this.gameState.offeredLoot),l&&this.gameState.logger.log("Item chosen by adventurer","INFO",{event:"item_chosen",item:l});let h=this.gameState.hand,g=this.gameState.availableDeck;h.forEach(v=>v.justDrafted=!1);let u=h.filter(v=>!i.includes(v.instanceId));const b=this.gameState.handSize-u.length,d=g.slice(0,b);d.forEach(v=>{v.draftedRoom=this.gameState.room,v.justDrafted=!0});const m=g.slice(b);u.push(...d),l&&(l.type==="Potion"?r.addPotion(l):l.type==="Buff"?r.applyBuff(l):r.equip(l));const p=this.gameState.room+1,_=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:c,availableDeck:m,hand:u,room:p,designer:{balancePoints:_}},this._emit("state-change",this.gameState)},this.runEncounter=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=i;let a=this.gameState.adventurer,r=[];const l=y.nextInt(0,this.gameState.offeredRooms.length-1),c=this.gameState.offeredRooms[l];switch(a.roomHistory.push(c.id),Se(a,c),this.gameState.logger.log(`--- Encountering Room: ${c.name} ---`,"INFO",{event:"room_encountered",room:c}),c.type){case"enemy":case"boss":const _={enemyCount:c.units??1,enemyPower:c.stats.attack||5,enemyHp:c.stats.hp||10},v=this._simulateEncounter(a,this.gameState.room,_);a=v.newAdventurer,r=v.feedback;break;case"healing":const x=c.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+x),r.push(o("game_engine.healing_room",{name:c.name,healing:x})),this.gameState.logger.info(o("game_engine.healing_room",{name:c.name,healing:x}));break;case"trap":const w=c.stats.attack||0;a.hp-=w,ke(a),r.push(o("game_engine.trap_room",{name:c.name,damage:w})),this.gameState.logger.info(o("game_engine.trap_room",{name:c.name,damage:w}));break}a.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let h=this.gameState.roomHand,g=this.gameState.availableRoomDeck;h.forEach(_=>_.justDrafted=!1);const u=this.gameState.offeredRooms.map(_=>_.instanceId);let b=h.filter(_=>!u.includes(_.instanceId));const d=this.gameState.handSize-b.length,m=g.slice(0,d);m.forEach(_=>{_.draftedRoom=this.gameState.room,_.justDrafted=!0});const p=g.slice(d);if(b.push(...m),this.gameState.adventurer=a,a.hp<=0){this._endRun(o("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(a.boredomCounter>2){const _=a.flowState===f.Boredom?o("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):o("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(_);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),r.push(o("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:r,encounter:void 0,roomHand:b,availableRoomDeck:p}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:r,encounter:void 0,roomHand:b,availableRoomDeck:p},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(o("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("Entering workshop."),!this.metaManager.acls.has(S.WORKSHOP)){this.gameState.logger.info("Workshop not unlocked, starting new run."),this.startNewRun();return}const i=this.gameState.run+1,a=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),r=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),l=[...a,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:i,room:0,shopItems:Y(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:o("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=i=>{if(!this.gameState)return;const a=this._allItems.find(m=>m.id===i),r=this._allRooms.find(m=>m.id===i),l=a||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let c=this.gameState.unlockedDeck,h=this.gameState.unlockedRoomDeck,g=this.gameState.availableDeck,u=this.gameState.availableRoomDeck;a?(c=[...this.gameState.unlockedDeck,i],this.isWorkshopAccessUnlocked()&&(g=[a,...this.gameState.availableDeck])):r&&(h=[...this.gameState.unlockedRoomDeck,i],this.isWorkshopAccessUnlocked()&&(u=[r,...this.gameState.availableRoomDeck]));const b=this.gameState.designer.balancePoints-l.cost,d=this.gameState.shopItems.filter(m=>m.id!==i);this.gameState.logger.log(`Purchased ${l.name}.`,"INFO",{event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:b},unlockedDeck:c,unlockedRoomDeck:h,availableDeck:g,availableRoomDeck:u,shopItems:d},this._emit("state-change",this.gameState)},this.quitGame=(i=!0)=>{i&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(S.BP_MULTIPLIER_2)?q*4:this.metaManager.acls.has(S.BP_MULTIPLIER)?q*2:q,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(i=>i(t))}_simulateEncounter(e,t,s){var u,b,d,m,p,_,v,x,w,D,N;(u=this.gameState)==null||u.logger.log(`--- Encounter: Room ${t} ---`,"INFO",{event:"battle_started",encounter:s});const i=[];let a=0,r=0;const l=e.hp;for(let P=0;P<s.enemyCount;P++){(b=this.gameState)==null||b.logger.info(`Adventurer encounters enemy ${P+1}/${s.enemyCount}.`);let B=s.enemyHp;for(;B>0&&e.hp>0;){if(we(e)==="use_potion"){const $=e.inventory.potions.shift();if($){const k=$.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+k),i.push(o("game_engine.adventurer_drinks_potion",{potionName:$.name})),(d=this.gameState)==null||d.logger.info(`Adventurer used ${$.name} and recovered ${k} HP.`)}}else{const $=Math.min(.95,.75+e.traits.skill/500+e.traits.offense/1e3);if(y.nextFloat()<$){const k=e.power;B-=k,(m=this.gameState)==null||m.logger.debug(`Adventurer hits for ${k} damage.`),U(e,"hit")}else(p=this.gameState)==null||p.logger.debug("Adventurer misses."),U(e,"miss")}if(B<=0){(_=this.gameState)==null||_.logger.info("Enemy defeated."),r++;break}const re=Math.max(.4,.75-e.traits.skill/500-(100-e.traits.offense)/1e3);if(y.nextFloat()<re){const $=(((v=e.inventory.armor)==null?void 0:v.stats.maxHp)||0)/10,k=Math.max(1,s.enemyPower-$);a+=k,e.hp-=k,(x=this.gameState)==null||x.logger.debug(`Enemy hits for ${k} damage.`),U(e,"take_damage")}else(w=this.gameState)==null||w.logger.debug("Enemy misses.")}if(e.hp<=0){(D=this.gameState)==null||D.logger.warn("Adventurer has been defeated.");break}}const c=l-e.hp,h=c/e.maxHp;(N=this.gameState)==null||N.logger.debug(`hpLost: ${c}, hpLostRatio: ${h.toFixed(2)}`);const g=Ee(e,h,r,s.enemyCount);return i.push(g),{newAdventurer:e,feedback:i,totalDamageTaken:a}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.log(`Run ended with ${this.gameState.designer.balancePoints} BP.`,"INFO",{event:"run_end",bp:this.gameState.designer.balancePoints}),this.gameState.logger.error(`GAME OVER: ${e}`);const i=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:i},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:i,offense:a}=t,r=Math.min(s/100,1);if(e===f.Flow)return"continue";let l=.55;switch(e){case f.Anxiety:l+=.25-i/400;break;case f.Arousal:l-=.1-a/1e3;break;case f.Worry:l+=.2;break;case f.Control:l-=.15;break;case f.Relaxation:l+=.1;break;case f.Boredom:l+=.3;break;case f.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),y.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info(`Adventurer decided to ${e}.`),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:y.nextInt(10,90),resilience:y.nextInt(10,90),skill:0},t=new A,s=new H(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(S.HAND_SIZE_INCREASE)?12:be}_getRoomDeckSize(){return this.metaManager.acls.has(S.ROOM_DECK_SIZE_INCREASE)?36:fe}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(S.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(S.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json")}catch(e){this.error=e.message||o("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const J=(n,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=n.hand,s.deckType="item",s.offerImpossible=he(n)):(s.choices=n.roomHand,s.deckType="room",s.roomSelectionImpossible=de(n)),s},Ce=(n,e,t)=>{n.innerHTML="";const s=document.createElement("div");s.className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center",n.appendChild(s);const i=document.createElement("div");i.className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6",s.appendChild(i);const a=document.createElement("div");a.className="lg:col-span-1 space-y-6",i.appendChild(a);const r=document.createElement("game-stats");r.engine=t,t.isWorkshopUnlocked()&&r.setAttribute("balance-points",e.designer.balancePoints.toString()),r.setAttribute("run",e.run.toString()),r.setAttribute("room",e.room.toString()),r.setAttribute("deck-size",e.availableDeck.length.toString()),r.setAttribute("room-deck-size",e.availableRoomDeck.length.toString()),a.appendChild(r);const l=document.createElement("feedback-panel"),c=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;l.setAttribute("message",c),a.appendChild(l);const h=document.createElement("log-panel");h.logger=e.logger,h.traits=e.adventurer.traits,a.appendChild(h);const g=document.createElement("div");g.className="lg:col-span-2 space-y-6",i.appendChild(g);const u=document.createElement("adventurer-status");u.metaState=t.metaManager.metaState,u.adventurer=e.adventurer,g.appendChild(u);const b=document.createElement("div");switch(b.className="lg:col-span-3",i.appendChild(b),e.phase){case"RUN_OVER":{const d=document.createElement("run-ended-screen");d.setAttribute("final-bp",e.designer.balancePoints.toString()),d.setAttribute("reason",e.runEnded.reason),d.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&d.setAttribute("workshop-unlocked",""),e.runEnded.decision&&d.initialize(e.runEnded.decision,e.newlyUnlocked,t),b.appendChild(d);break}case"DESIGNER_CHOOSING_LOOT":b.appendChild(J(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":b.appendChild(J(e,t,"room"));break}},Ie=(n,e)=>{n.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,n.appendChild(t)},Re=(n,e,t)=>{n.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,n.appendChild(s)},He=(n,e,t)=>{if(!e){n.innerHTML=`<div>${o("global.loading")}</div>`;return}switch(e.phase){case"MENU":Ie(n,t);break;case"SHOP":Re(n,e,t);break;default:Ce(n,e,t);break}};function Te(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const V="rogue-steward-meta";class Le{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of se)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(V);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(V,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const O="rogue-steward-savegame",G="1.0.0";class Me{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(O,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(O);if(e){const t=JSON.parse(e);return t.version!==G?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${G}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(O)!==null}clear(){this.storage.removeItem(O)}_serialize(e){const{adventurer:t,logger:s,...i}=e;return{version:G,...i,adventurer:t.toJSON(),logger:s.toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...i}=e,a=A.fromJSON(s),r=H.fromJSON(t,a);return{...i,adventurer:r,logger:a}}}class Ae{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class De{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Ge=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class ze extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var s,i;if(!this._adventurer)return;const e=((s=this._metaState)==null?void 0:s.adventurers)||1,t=(i=this._metaState)==null?void 0:i.unlockedFeatures.includes(S.ADVENTURER_TRAITS);this.innerHTML=`
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 id="adventurer-title" class="text-xl font-label mb-2 text-center text-white">${o("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div data-tooltip-key="adventurer_health">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${Oe()} <span>${o("global.health")}</span></div>
                                <span id="hp-text" class="font-label text-sm"></span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div id="hp-bar" class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out"></div>
                            </div>
                        </div>
                        <div data-tooltip-key="adventurer_flow_state">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${Pe()} <span>${o("adventurer_status.flow_state")}</span></div>
                                <span id="flow-state-text" class="font-label text-sm"></span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners" data-tooltip-key="adventurer_power">
                        ${Ne()}
                        <span class="mr-2">${o("global.power")}</span>
                        <span id="power-text" class="font-label text-lg text-white"></span>
                    </div>
                </div>

                <div id="traits-section" class="${t?"":"hidden"}">
                    <div class="border-t border-gray-700 my-2"></div>
                    <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                        <div>
                            <span class="text-brand-text-muted block">${o("log_panel.offense")}</span>
                            <span id="offense-trait" class="font-mono text-white"></span>
                        </div>
                        <div>
                            <span class="text-brand-text-muted block">${o("log_panel.resilience")}</span>
                            <span id="resilience-trait" class="font-mono text-white"></span>
                        </div>
                        <div>
                            <span class="text-brand-text-muted block">${o("log_panel.skill")}</span>
                            <span id="skill-trait" class="font-mono text-white"></span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${o("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div id="weapon-slot" class="bg-brand-primary/50 p-2 pixel-corners"></div>
                    <div id="armor-slot" class="bg-brand-primary/50 p-2 pixel-corners"></div>
                    <div id="buffs-slot" class="bg-brand-primary/50 p-2 pixel-corners"></div>
                    <div id="potions-slot" class="bg-brand-primary/50 p-2 pixel-corners"></div>
                </div>
            </div>
        `,this._hasRendered=!0}update(){var l;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").style.width=`${t}%`;const s=this.querySelector("#flow-state-text");this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s),s.textContent=f[this._adventurer.flowState],s.className=`font-label text-sm ${this.getFlowStateColor(this._adventurer.flowState)}`;const i=this.querySelector("#power-text");this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(i),i.textContent=`${this._adventurer.power}`;const a=(l=this._metaState)==null?void 0:l.unlockedFeatures.includes(S.ADVENTURER_TRAITS),r=this.querySelector("#traits-section");if(a){r.classList.remove("hidden");const c=this.querySelector("#offense-trait"),h=this.querySelector("#resilience-trait"),g=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(h),this._adventurer.traits.skill!==this._previousAdventurer.traits.skill&&this._pulseElement(g),c.textContent=`${this._adventurer.traits.offense}`,h.textContent=`${this._adventurer.traits.resilience}`,g.textContent=`${this._adventurer.traits.skill}`}else r.classList.add("hidden");this.updateInventorySlot("weapon-slot",Be(),o("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${o("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${o("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`),this.updateInventorySlot("armor-slot",qe(),o("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${o("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${o("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Ge(),o("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div>
                <p class="text-white text-sm">${c.name} (${o("global.duration")}: ${c.stats.duration})</p>
                <p class="text-xs text-brand-text-muted">${Object.entries(c.stats).filter(([h])=>h!=="duration").map(([h,g])=>`${o(`global.${h}`)}: ${g}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="text-brand-text-muted italic">${o("global.none")}</p>`),this.updateInventorySlot("potions-slot",Ue(),o("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-white text-sm">${o("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-pulse-once"),e.addEventListener("animationend",()=>{e.classList.remove("animate-pulse-once")},{once:!0}))}updateInventorySlot(e,t,s,i){const a=this.querySelector(`#${e}`);a.dataset.content!==i&&(a.innerHTML=`
                <div class="flex items-center justify-center text-brand-text-muted">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper">
                    ${i}
                </div>
            `,a.dataset.content=i)}getFlowStateColor(e){switch(e){case f.Boredom:case f.Apathy:return"text-red-500";case f.Anxiety:case f.Worry:return"text-orange-500";case f.Arousal:case f.Control:case f.Relaxation:return"text-white";case f.Flow:return"text-yellow-400 animate-pulse";default:return"text-white"}}}customElements.define("adventurer-status",ze);class Fe extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",Fe);class T{constructor(e,t,s,i){this.resolve=i;const a=document.createElement("div");a.className="info-modal-overlay animate-fade-in",a.addEventListener("click",d=>{if(d.target===a){const m=s.find(p=>typeof p.value=="boolean"&&p.value===!1);m&&this.dismiss(m.value)}});const r=document.createElement("div");this.element=r,r.className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-3/4",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("h2");l.id="info-modal-title",l.className="text-4xl font-title text-brand-secondary mb-3",l.textContent=e,r.appendChild(l);const c=document.createElement("div");c.innerHTML=t,r.appendChild(c);const h=document.createElement("div");h.className="text-center mt-6",s.forEach((d,m)=>{const p=document.createElement("button"),_=d.variant==="primary"||d.variant!=="secondary"&&m===0,v="bg-brand-primary mx-4 pixel-corners text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors",x="bg-gray-600 mx-4 pixel-corners text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors";p.className=_?v:x,p.textContent=d.text,p.addEventListener("click",()=>{this.dismiss(d.value)}),h.appendChild(p)}),r.appendChild(h),a.appendChild(r),document.body.appendChild(a),this.handleKeydown=d=>{if(d.key==="Escape"){const m=s.find(p=>typeof p.value=="boolean"&&p.value===!1);m&&this.dismiss(m.value)}},document.addEventListener("keydown",this.handleKeydown);const g=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),u=g[0],b=g[g.length-1];u==null||u.focus(),r.addEventListener("keydown",d=>{d.key==="Tab"&&(d.shiftKey?document.activeElement===u&&(b.focus(),d.preventDefault()):document.activeElement===b&&(u.focus(),d.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(i=>{new T(e,t,s,i)})}static showInfo(e,t,s=o("global.continue")){const i=[{text:s,value:void 0}];return T.show(e,t,i)}}class je extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=se.find(i=>i.feature===this.newlyUnlocked[0]);if(!e)return;const t=o("unlocks.title"),s=`
            <h3 class="font-label text-white">${e.title()}</h3>
            <p class="text-brand-text mb-6">${e.description()}</p>
        `;await T.showInfo(t,s,o("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){this.getAttribute("final-bp");const e=this.getAttribute("reason")||o("run_ended_screen.default_reason");this.innerHTML=`
            <style>
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { opacity: 0; animation: fade-in-up 0.5s ease-out forwards; }
                @keyframes dots {
                    0%, 20% { color: rgba(255,255,255,0); text-shadow: .25em 0 0 rgba(255,255,255,0), .5em 0 0 rgba(255,255,255,0); }
                    40% { color: white; text-shadow: .25em 0 0 rgba(255,255,255,0), .5em 0 0 rgba(255,255,255,0); }
                    60% { text-shadow: .25em 0 0 white, .5em 0 0 rgba(255,255,255,0); }
                    80%, 100% { text-shadow: .25em 0 0 white, .5em 0 0 white; }
                }
                .animate-dots::after { content: '...'; animation: dots 1.5s infinite; }
            </style>
            <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full">
                <h2 class="text-4xl font-title text-brand-secondary mb-2">${o("run_ended_screen.run_complete")}</h2>
                <p class="text-brand-text-muted mb-4">${e}</p>
                <div id="decision-container" class="h-24">
                    <p class="text-brand-text-muted text-lg animate-fade-in-up">${o("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let i="",a="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(i=`
                <h3 class="text-2xl text-green-400 ${r}">${o("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.continue_decision")}</p>
            `,a+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1.2s;"
                >
                    ${o(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(i=`
                <h3 class="text-2xl text-red-400 ${r}">${o("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,a+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1s;"
                >
                    ${o("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=i,s.innerHTML=a}}customElements.define("run-ended-screen",je);class j{static show(e,t){const s=[{text:o("global.cancel"),value:!1,variant:"secondary"},{text:o("global.confirm"),value:!0,variant:"primary"}];return T.show(e,t,s)}}class We extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t,s;this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
                <div>
                    <button id="quit-game-btn" class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${o("global.quit")}
                    </button>
                </div>
                ${this._balancePoints!==null?`
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${o("global.bp")}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                `:""}
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${o("global.run")}</span>
                    <p class="text-2xl  text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${o("global.room")}</span>
                    <p class="text-2xl  text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${o("global.deck")}</span>
                    <p class="text-2xl  text-white">${this._deckSize}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${o("global.rooms")}</span>
                    <p class="text-2xl  text-white">${this._roomDeckSize}</p>
                </div>
                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${o("global.workshop")}
                    </button>
                </div>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var i;(i=this.engine)==null||i.enterWorkshop()}),(s=this.querySelector("#quit-game-btn"))==null||s.addEventListener("click",async()=>{var i;await j.show(o("global.quit"),o("global.quit_confirm"))&&((i=this.engine)==null||i.quitGame(!1))})}}customElements.define("game-stats",We);class Ze extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,i)=>`<p class="whitespace-pre-wrap ${this._getLogColor(s.level)}">[${i.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${o("log_panel.title")}</h4>
                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",Ze);const Ke={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},C=(n,e,t=!0,s=1)=>{const i=t?"text-green-400":"text-red-400",a=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${i}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${n}${s>1?o("global.units"):""}</span>
            <span class="font-mono">${a}${e}</span>
        </div>
    `};class Je extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Ke[this._item.rarity]||"text-gray-400",t="relative bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let s="";this._isDisabled?s="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?s="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":s="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";let i="";if(this._stackCount>1){const c=Math.min(this._stackCount-1,2);c>=1&&(i+=" stack-outline-1"),c>=2&&(i+=" stack-outline-2")}const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s}${i}${a}`;let r=this._item.name,l="";if("stats"in this._item){const c=this._item,h=this._item;switch(this._item.type.toLowerCase()){case"weapon":case"potion":case"armor":case"buff":l=`
            ${c.stats.hp?C(o("global.health"),c.stats.hp):""}
            ${c.stats.maxHp?C(o("global.max_hp"),c.stats.maxHp):""}
            ${c.stats.power?C(o("global.power"),c.stats.power):""}
            ${c.stats.duration?C(o("global.duration"),c.stats.duration):""}
          `;break;case"healing":l=`
            ${h.stats.hp?C(o("global.health"),h.stats.hp):""}
          `;break;case"enemy":case"boss":case"trap":l=`
            ${h.stats.attack?C(o("global.attack"),h.stats.attack,!1,h.units):""}
            ${h.stats.hp?C(o("global.health"),h.stats.hp,!1,h.units):""}
          `,h.units>1&&(r=o("choice_panel.multiple_enemies_title",{name:h.name,count:h.units}));break}}this._stackCount>1&&(r=o("choice_panel.stacked_items_title",{name:this._item.name,count:this._stackCount})),this.innerHTML=`
      <div class="flex justify-between items-baseline">
        <p class="font-label text-sm ${e}">${this._item.type}</p>
        <p class="text-xs uppercase tracking-wider ${e}">${this._item.rarity}</p>      
      </div>
      <p class=" text-2xl ${e} text-left">${r}</p>
      <div class="border-t border-gray-700 my-2"></div>
      <div class="space-y-1 text-brand-text text-large">
        ${l}
      </div>
    `}}customElements.define("choice-card",Je);const z=4;class Ve extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(i=>this._selectedIds.includes(i.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(i=>i.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const i=t.type==="boss";if(s)this._selectedIds=this._selectedIds.filter(a=>a!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="boss");i&&this._selectedIds.length===0?this._selectedIds.push(e):!i&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);a.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!a.includes(l)):this._selectedIds.length<z&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(d=>d.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const d=e.map(m=>{const p=document.createElement("choice-card");return p.item=m,p.outerHTML}).join("");T.show(o("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${d}</div>`,[{text:o("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(m=>m.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},i={enemy:0,trap:1,healing:2,boss:3};let a=[...this._choices];this._deckType==="item"?a.sort((d,m)=>{const p=s[d.type]-s[m.type];if(p!==0)return p;const _=t[d.rarity]||0,v=t[m.rarity]||0;return _-v}):a.sort((d,m)=>{const p=d,_=m,v=i[p.type]-i[_.type];if(v!==0)return v;const x=p.stats.hp||0,w=_.stats.hp||0;if(x!==w)return w-x;const D=p.stats.attack||0;return(_.stats.attack||0)-D});const r=this._deckType==="room";let l;if(r)l=a;else{const d=new Map;a.forEach(m=>{const p=m;d.has(p.id)?d.get(p.id).count++:d.set(p.id,{choice:p,count:1})}),l=Array.from(d.values()).map(m=>({...m.choice,stackCount:m.count}))}const c=o(r?"choice_panel.title_room":"choice_panel.title");let h=o(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?h=o("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(h=o("choice_panel.roll_credits"));let g=!1,u=h;this._offerImpossible||this._roomSelectionImpossible?g=!0:r?this._choices.filter(p=>this._selectedIds.includes(p.instanceId)).some(p=>p.type==="boss")?(g=this._selectedIds.length===1,u=`${h} (1/1)`):(g=this._selectedIds.length===3,u=`${h} (${this._selectedIds.length}/3)`):(g=this._selectedIds.length>=2&&this._selectedIds.length<=z,u=`${h} (${this._selectedIds.length}/${z})`),this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl text-center mb-4 text-white">${c}</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!g||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white py-3 px-8 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${u}
                    </button>
                </div>
            </div>
        `;const b=this.querySelector("#loot-card-container");b&&l.forEach(d=>{const m=document.createElement("choice-card");m.item=d,"stackCount"in d&&(m.stackCount=d.stackCount),m.isSelected=this._selectedIds.includes(d.instanceId);let p=this._disabled;if(this._offerImpossible)p=!0;else if(r){const _=this._choices.filter(x=>this._selectedIds.includes(x.instanceId)),v=_.some(x=>x.type==="boss");m.isSelected?p=!1:(v||d.type==="boss"&&_.length>0||_.length>=3)&&(p=!0)}else{const _=new Map(this._choices.map(w=>[w.instanceId,w.id])),v=this._selectedIds.map(w=>_.get(w));p=!m.isSelected&&v.includes(d.id)||this._disabled}m.isDisabled=p,m.isNewlyDrafted=d.justDrafted&&this._initialRender||!1,b.appendChild(m)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ve);const E=(n,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${n}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,Qe=(n,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${n}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,Ye=(n,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[n.rarity]||"text-gray-400";let i="";if("stats"in n)if(n.type==="Weapon"||n.type==="Armor"||n.type==="Potion"){const a=n;i=`
                ${a.stats.hp?E(o("global.health"),a.stats.hp):""}
                ${a.stats.maxHp?E(o("global.max_hp"),a.stats.maxHp):""}
                ${a.stats.power?E(o("global.power"),a.stats.power,(a.stats.power||0)>0):""}
            `}else{const a=n;switch(a.type){case"enemy":i=`
                        ${a.stats.attack?E(o("global.attack"),a.stats.attack,!1):""}
                        ${a.stats.hp?E(o("global.health"),a.stats.hp,!1):""}
                        ${a.stats.minUnits&&a.stats.maxUnits?Qe(o("global.units"),a.stats.minUnits,a.stats.maxUnits):""}
                    `;break;case"boss":i=`
                        ${a.stats.attack?E(o("global.attack"),a.stats.attack,!1):""}
                        ${a.stats.hp?E(o("global.health"),a.stats.hp,!1):""}
                    `;break;case"healing":i=`
                        ${a.stats.hp?E(o("global.health"),a.stats.hp):""}
                    `;break;case"trap":i=`
                        ${a.stats.attack?E(o("global.attack"),a.stats.attack,!1):""}
                    `;break}}return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${s}">${n.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${n.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${s}">${n.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${i}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${n.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${o("global.buy")} (${n.cost} ${o("global.bp")})
                </button>
            </div>
        </div>
    `};class Xe extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>Ye(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-label text-white">${o("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${o("workshop.description")}</p>
                    <p class="mt-4 text-2xl">
                        ${o("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${o("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 pixel-corners text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${o("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",Xe);class et extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await j.show(o("menu.new_game"),o("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await j.show(o("menu.reset_save"),o("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(e.adventurers>1||e.highestRun||e.unlockedFeatures.length){const i=e.adventurers||0;s=`
                <p class="text-lg text-gray-400 mt-4">
                    ${o("menu.max_runs",{count:e.highestRun})} | ${o("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${o("menu.adventurer_count",{count:i})}
                </p>
            `}this.innerHTML=`
            <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${o("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${o("game_subtitle")}</p>
                ${s}
                <div class="mt-8 space-y-4">
                        ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                            ${o("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="${t?"bg-gray-800 hover:bg-gray-600":"bg-red-500 hover:bg-red-600"} text-700 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                        ${o("menu.new_game")}
                    </button>
                    ${t?`
                        <button id="reset-game-button" class="bg-gray-800 hover:bg-gray-700 text-gray-400 py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                            ${o("menu.reset_save")}
                        </button>
                    `:""}
                </div>
                <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                    v0.0.0 (build 105)
                </div>
            </div>
        `}}customElements.define("menu-screen",et);class tt extends HTMLElement{constructor(){super(),this.rect=new DOMRect(0,0,0,0),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
            .pixel-corners {
              clip-path: polygon(0 5px, 5px 5px, 5px 0, calc(100% - 5px) 0, calc(100% - 5px) 5px, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 5px calc(100% - 5px), 0 calc(100% - 5px));
            }

            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 2000;
                pointer-events: none;
                background-color: #1a202c;
                border: 1px solid #4a5568;
                max-width: 350px;
                font-size: 1.125rem;
                color: #cbd5e0;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            :host(.show) {
              display: block;
            }

            .content-container {
                position: relative;
                padding: 1.5rem;
            }

            .close-button {
                display: none;
            }

            h3 {
                margin-top: 0;
                font-weight: bold;
                margin-bottom: 8px;
            }

            /* Mobile styles */
            @media (pointer: coarse) {
                :host(.show) {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    pointer-events: auto;
                    max-width: none; /* Override desktop max-width */
                }

                .content-container {
                    background-color: #1a202c;
                    border: 1px solid #4a5568;
                    padding: 1.5rem;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    color: #cbd5e0;
                    font-size: 1.125rem;
                    margin: 1rem;
                }

                .close-button {
                    display: block;
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 2.5rem;
                    color: #cbd5e0;
                    cursor: pointer;
                    background: none;
                    border: none;
                    line-height: 1;
                    z-index: 10;
                }

                h3 {
                    font-size: 1.5rem;
                    text-align: center;
                }
            }
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.closeButton=document.createElement("button"),this.closeButton.className="close-button",this.closeButton.innerHTML="&times;",this.closeButton.onclick=()=>this.hide(),this.contentContainer.appendChild(this.closeButton),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}connectedCallback(){window.matchMedia("(pointer: coarse)").matches?this.contentContainer.classList.add("pixel-corners"):this.classList.add("pixel-corners")}show(e,t,s){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.isDesktop?(this.style.opacity="0",this.classList.add("show"),this.rect=this.contentContainer.getBoundingClientRect(),this.updatePosition(t,s),this.style.opacity=""):(this.style.transform="",this.classList.add("show"))}hide(){this.classList.remove("show")}updatePosition(e,t){if(!this.isDesktop)return;const s=15;let i=e+s,a=t+s;i+s+this.rect.width>window.innerWidth&&(i=e-this.rect.width-s,i<0&&(i=0)),a+s+this.rect.height>window.innerHeight&&(a=t-this.rect.height-s,a<0&&(a=0)),this.style.transform=`translate3d(${i}px, ${a}px, 0)`}}customElements.define("tooltip-box",tt);class R{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return R.instance||(R.instance=new R),R.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const i=this.getTooltipContent(s);i&&(this.tooltipBox.show(i,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleMouseMove(e){this.desktopTooltipActive&&this.tooltipBox.updatePosition(e.clientX,e.clientY)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const i=this.getTooltipContent(s);i&&this.tooltipBox.show(i,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=o(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=o(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=o("global.information")),{title:s,body:t}}}const F=R.getInstance(),M=document.getElementById("app");if(!M)throw new Error("Could not find app element to mount to");const ae=new Ae,st=new Le(ae),nt=new Me(ae),oe=new De,I=new $e(st,oe,nt);I.on("state-change",n=>{if(I.isLoading){M.innerHTML=`<div>${o("global.loading_game_data")}</div>`;return}if(I.error){M.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${o("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${I.error}</p>
                    </div>
                </div>
            `;return}He(M,n,I),Te()});async function it(){await ve(oe),await I.init(),M.innerHTML=`<div>${o("global.initializing")}</div>`,document.body.addEventListener("mouseover",n=>F.handleMouseEnter(n)),document.body.addEventListener("mousemove",n=>F.handleMouseMove(n)),document.body.addEventListener("click",n=>F.handleClick(n)),I.showMenu()}it();
