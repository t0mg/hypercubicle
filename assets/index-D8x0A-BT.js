(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var g=(s=>(s[s.Arousal=0]="Arousal",s[s.Flow=1]="Flow",s[s.Control=2]="Control",s[s.Relaxation=3]="Relaxation",s[s.Boredom=4]="Boredom",s[s.Apathy=5]="Apathy",s[s.Worry=6]="Worry",s[s.Anxiety=7]="Anxiety",s))(g||{});class le{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const y=new le(Date.now()),Q=s=>`${s}_${y.nextFloat().toString(36).substr(2,9)}`,ce=(s,e)=>y.nextInt(s,e),Y=s=>{const e=[...s];for(let t=e.length-1;t>0;t--){const n=y.nextInt(0,t);[e[t],e[n]]=[e[n],e[t]]}return e},X=(s,e,t,n)=>{const i=e.filter(m=>s.includes(m.id)),o=[],r={Common:.6,Uncommon:.3,Rare:.1},l={Common:0,Uncommon:0,Rare:0},c={Common:0,Uncommon:0,Rare:0};Object.keys(r).forEach(m=>{c[m]=Math.floor(t*r[m])});let f=Object.values(c).reduce((m,b)=>m+b,0);for(;f<t;)c.Common+=1,f+=1;i.filter(m=>m.cost!==null).forEach(m=>{o.push(n(m)),l[m.rarity]+=1}),Object.keys(r).forEach((m,b)=>{const d=i.filter(h=>h.rarity===m);for(;l[m]<c[m]&&d.length!==0;){const h=y.nextInt(0,d.length-1),u=d[h];o.push(n(u)),l[m]+=1}});const p=i.filter(m=>m.rarity==="Common");for(;o.length<t&&p.length>0;){const m=y.nextInt(0,p.length-1),b=p[m];o.push(n(b))}return Y(o)},W=(s,e,t)=>X(s,e,t,n=>({...n,instanceId:Q(n.id)})),Z=(s,e,t)=>X(s,e,t,i=>{const o={...i,instanceId:Q(i.id)};return o.type==="enemy"&&o.stats.minUnits&&o.stats.maxUnits&&(o.units=ce(o.stats.minUnits,o.stats.maxUnits)),o}),de=s=>s.roomHand.length<3&&!s.roomHand.some(e=>e.type==="boss"),he=s=>[...new Set(s.hand.map(t=>t.id))].length<2&&s.hand.length>0;function me(s,e){const t=Math.max(0,Math.min(100,s)),n=Math.max(0,Math.min(100,e));return n>66?t<33?g.Anxiety:t<87?g.Arousal:g.Flow:n>33?t<33?g.Worry:t<67?g.Apathy:g.Control:t<67?g.Boredom:g.Relaxation}const L={hp:100,maxHp:100,power:5},ue=3;class H{constructor(e,t){this.hp=L.hp,this.maxHp=L.maxHp,this.power=L.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=g.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=t,this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,n)=>t+n,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,n=Math.max(0,Math.min(100,e));this.challengeHistory.push(n),this.challengeHistory.length>ue&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${n})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=me(this.skill,this.challenge),e!==this.flowState&&(this.logger.info(`Adventurer's state of mind changed from ${g[e]} to ${g[this.flowState]}`),this.logger.log(`Flow state changed to ${g[this.flowState]}`,"INFO",{event:"flow_state_changed",flowState:g[this.flowState]}))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=L.power,n=L.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,n+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,n+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(i=>{t+=i.stats.power||0,n+=i.stats.maxHp||0}),this.power=t,this.maxHp=n,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter}}static fromJSON(e,t){const n=e.traits,i=new H(n,t);return i.hp=e.hp,i.maxHp=e.maxHp,i.power=e.power,i.inventory=e.inventory,i.activeBuffs=e.activeBuffs,i.skill=e.skill,i.challengeHistory=e.challengeHistory,i.flowState=e.flowState,i.roomHistory=e.roomHistory,i.lootHistory=e.lootHistory,i.boredomCounter=e.boredomCounter,i}}class A{constructor(){this.entries=[],this.listeners=[],this.muted=!1}on(e){this.listeners.push(e)}log(e,t="INFO",n){const i={message:e,level:t,timestamp:Date.now(),data:n};this.muted||(this.entries.push(i),t!=="DEBUG"&&console.log(`[${t}] ${e}`)),this.listeners.forEach(o=>o(i))}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}toJSON(){return{entries:this.entries}}static fromJSON(e){const t=new A;return t.entries=e.entries||[],t}}const pe=99,ge=10,q=10,K=32,fe=18,be=8;let ee={};async function te(s,e){try{ee=await e.loadJson(`locales/${s}.json`)}catch(t){console.warn(`Failed to load ${s} translations:`,t),s!=="en"&&await te("en",e)}}function _e(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(s,e={}){let n=s.split(".").reduce((i,o)=>i?i[o]:void 0,ee);if(!n)return console.warn(`Translation not found for key: ${s}`),s;for(const i in e)n=n.replace(`{${i}}`,String(e[i]));return n}async function xe(s){const e=_e();await te(e,s)}var $=(s=>(s.WORKSHOP="workshop",s.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",s.HAND_SIZE_INCREASE="hand_size_increase",s.ADVENTURER_TRAITS="ADVENTURER_TRAITS",s.BP_MULTIPLIER="BP_MULTIPLIER",s.WORKSHOP_ACCESS="WORKSHOP_ACCESS",s.BP_MULTIPLIER_2="BP_MULTIPLIER_2",s))($||{});const se=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],ne=10;function ie(s,e){var f,p,m,b;const{traits:t,inventory:n,hp:i,maxHp:o}=s;let r=(e.rarity==="Uncommon"?2:e.rarity==="Rare"?3:1)*5;const l=((f=n.weapon)==null?void 0:f.stats.power)||0,c=((p=n.armor)==null?void 0:p.stats.maxHp)||0;switch(e.type){case"Weapon":const d=(e.stats.power||0)-l;if(d<=0&&e.id!==((m=n.weapon)==null?void 0:m.id))return-1;r+=d*(t.offense/10),d>0&&(r+=d*(s.skill/10));const h=e.stats.maxHp||0;h<0&&(r+=h*(100-t.resilience)/20);break;case"Armor":const u=(e.stats.maxHp||0)-c;if(u<=0&&e.id!==((b=n.armor)==null?void 0:b.id))return-1;r+=u*(100-t.offense)/10,u>0&&(r+=u*(s.skill/10));const _=e.stats.power||0;_>0&&(r+=_*(t.offense/15));const x=e.stats.power||0;x<0&&(r+=x*(t.resilience/10));break;case"Potion":const v=i/o;r+=10*(100-t.resilience)/100,v<.7&&(r+=20*(1-v)),r+=5*(s.skill/100),n.potions.length>=pe&&(r*=.1);break}return r}function ve(s,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${s.traits.offense}, Resilience: ${s.traits.resilience}, Skill: ${s.skill})`);const n=e.map(r=>({item:r,score:ie(s,r)})).filter(r=>r.score>0);if(n.sort((r,l)=>l.score-r.score),n.length===0||n[0].score<ge)return{choice:null,reason:a("game_engine.adventurer_declines_offer")};const i=n[0].item;t.debug(`Adventurer chooses: ${i.name} (Score: ${n[0].score.toFixed(1)})`);const o=a("game_engine.adventurer_accepts_offer",{itemName:i.name});return{choice:i,reason:o}}function we(s,e){const{flowState:t,hp:n,maxHp:i,inventory:o,traits:r}=s,l=n/i;if(o.potions.length===0)return"attack";let c=.5;switch(t){case g.Anxiety:case g.Worry:c=.8;break;case g.Arousal:case g.Flow:c=.6;break;case g.Control:case g.Relaxation:c=.4;break;case g.Boredom:case g.Apathy:c=.2;break}return c-=r.resilience/200,l<Math.max(.1,c)?"use_potion":"attack"}function ye(s,e,t){if(e){s.lootHistory.push(e.id),s.lootHistory.filter(o=>o===e.id).length>2&&(s.modifyChallenge(s.challenge-ne),s.logger.info(`Adventurer feels a sense of repetitiveness from seeing ${e.name} again.`));const i=ie(s,e);i>60?(s.modifySkill(10),s.modifyChallenge(s.challenge+5)):i>30?(s.modifySkill(5),s.modifyChallenge(s.challenge+2)):s.modifySkill(2)}else t.length>0?s.modifyChallenge(s.challenge-5):s.modifyChallenge(s.challenge-10);s.updateFlowState()}function ke(s,e){s.roomHistory.push(e.id),s.roomHistory.filter(i=>i===e.id).length>2&&(s.modifyChallenge(s.challenge-ne),s.logger.info(`Adventurer feels a sense of deja vu upon entering ${e.name}.`));let n=0;switch(e.type){case"enemy":n=5;break;case"boss":n=15;break;case"trap":n=10;break;case"healing":n=-15;break}s.modifyChallenge(s.challenge+n),s.updateFlowState()}function Se(s){s.modifySkill(-2),s.updateFlowState()}function U(s,e){switch(e){case"hit":s.modifySkill(.5);break;case"miss":s.modifySkill(-.5);break;case"take_damage":s.modifyChallenge(s.challenge+1);break}s.updateFlowState()}function Ee(s,e,t,n){let i;return e>.7?(i=a("game_engine.too_close_for_comfort"),s.modifyChallenge(s.challenge+10),s.modifySkill(-3)):e>.4?(i=a("game_engine.great_battle"),s.modifyChallenge(s.challenge+5),s.modifySkill(5)):t>3&&s.traits.offense>60?(i=a("game_engine.easy_fight"),s.modifyChallenge(s.challenge-10)):(i=a("game_engine.worthy_challenge"),s.modifyChallenge(s.challenge-2),s.modifySkill(2)),t===n&&s.modifySkill(1*t),s.updateFlowState(),i}class $e{constructor(e,t,n){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=i=>{this.metaManager.incrementAdventurers();const o={offense:y.nextInt(10,90),resilience:y.nextInt(10,90),skill:0},r=new A,l=new H(o,r),c=(i==null?void 0:i.items)||this._allItems.filter(x=>x.cost===null).map(x=>x.id),f=W(c,this._allItems,K),p=this._getHandSize(),m=f.slice(0,p),b=f.slice(p),d=(i==null?void 0:i.rooms)||this._allRooms.filter(x=>x.cost===null).map(x=>x.id),h=Z(d,this._allRooms,this._getRoomDeckSize()),u=h.slice(0,p),_=h.slice(p);r.info("--- Starting New Adventurer (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:c,availableDeck:b,hand:m,unlockedRoomDeck:d,availableRoomDeck:_,roomHand:u,handSize:p,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:a("game_engine.new_adventurer"),logger:r,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const i=this.gameSaver.load();i?(this.gameState=i,this._emit("state-change",this.gameState)):this.startNewGame()},this.startNewRun=i=>{if(!this.gameState)return;const o=i||this.gameState.run+1;this.metaManager.updateRun(o);const r=this._getHandSize(),l=W(this.gameState.unlockedDeck,this._allItems,K),c=l.slice(0,r),f=l.slice(r),p=Z(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),m=p.slice(0,r),b=p.slice(r),d=new H(this.gameState.adventurer.traits,this.gameState.logger);d.skill=this.gameState.adventurer.skill,d.challengeHistory=[...this.gameState.adventurer.challengeHistory],d.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info(`--- Starting Run ${o} ---`),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:d,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:f,hand:c,availableRoomDeck:b,roomHand:m,handSize:r,room:1,run:o,feedback:a("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const o=this.gameState.hand.filter(x=>i.includes(x.instanceId));this.gameState.offeredLoot=o;const r=this.gameState.adventurer,{choice:l,reason:c}=ve(r,this.gameState.offeredLoot,this.gameState.logger);ye(r,l,this.gameState.offeredLoot),l&&this.gameState.logger.log("Item chosen by adventurer","INFO",{event:"item_chosen",item:l});let f=this.gameState.hand,p=this.gameState.availableDeck;f.forEach(x=>x.justDrafted=!1);let m=f.filter(x=>!i.includes(x.instanceId));const b=this.gameState.handSize-m.length,d=p.slice(0,b);d.forEach(x=>{x.draftedRoom=this.gameState.room,x.justDrafted=!0});const h=p.slice(b);m.push(...d),l&&(l.type==="Potion"?r.addPotion(l):l.type==="Buff"?r.applyBuff(l):r.equip(l));const u=this.gameState.room+1,_=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:c,availableDeck:h,hand:m,room:u,designer:{balancePoints:_}},this._emit("state-change",this.gameState)},this.runEncounter=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=i;let o=this.gameState.adventurer,r=[];const l=y.nextInt(0,this.gameState.offeredRooms.length-1),c=this.gameState.offeredRooms[l];switch(o.roomHistory.push(c.id),ke(o,c),this.gameState.logger.log(`--- Encountering Room: ${c.name} ---`,"INFO",{event:"room_encountered",room:c}),c.type){case"enemy":case"boss":const _={enemyCount:c.units??1,enemyPower:c.stats.attack||5,enemyHp:c.stats.hp||10},x=this._simulateEncounter(o,this.gameState.room,_);o=x.newAdventurer,r=x.feedback;break;case"healing":const v=c.stats.hp||0;o.hp=Math.min(o.maxHp,o.hp+v),r.push(a("game_engine.healing_room",{name:c.name,healing:v})),this.gameState.logger.info(a("game_engine.healing_room",{name:c.name,healing:v}));break;case"trap":const w=c.stats.attack||0;o.hp-=w,Se(o),r.push(a("game_engine.trap_room",{name:c.name,damage:w})),this.gameState.logger.info(a("game_engine.trap_room",{name:c.name,damage:w}));break}o.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let f=this.gameState.roomHand,p=this.gameState.availableRoomDeck;f.forEach(_=>_.justDrafted=!1);const m=this.gameState.offeredRooms.map(_=>_.instanceId);let b=f.filter(_=>!m.includes(_.instanceId));const d=this.gameState.handSize-b.length,h=p.slice(0,d);h.forEach(_=>{_.draftedRoom=this.gameState.room,_.justDrafted=!0});const u=p.slice(d);if(b.push(...h),this.gameState.adventurer=o,o.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(o.boredomCounter>2){const _=o.flowState===g.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(_);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),r.push(a("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:r,encounter:void 0,roomHand:b,availableRoomDeck:u}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:r,encounter:void 0,roomHand:b,availableRoomDeck:u},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("Entering workshop."),!this.metaManager.acls.has($.WORKSHOP)){this.gameState.logger.info("Workshop not unlocked, starting new run."),this.startNewRun();return}const i=this.gameState.run+1,o=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),r=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),l=[...o,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:i,room:0,shopItems:Y(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:a("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=i=>{if(!this.gameState)return;const o=this._allItems.find(h=>h.id===i),r=this._allRooms.find(h=>h.id===i),l=o||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let c=this.gameState.unlockedDeck,f=this.gameState.unlockedRoomDeck,p=this.gameState.availableDeck,m=this.gameState.availableRoomDeck;o?(c=[...this.gameState.unlockedDeck,i],this.isWorkshopAccessUnlocked()&&(p=[o,...this.gameState.availableDeck])):r&&(f=[...this.gameState.unlockedRoomDeck,i],this.isWorkshopAccessUnlocked()&&(m=[r,...this.gameState.availableRoomDeck]));const b=this.gameState.designer.balancePoints-l.cost,d=this.gameState.shopItems.filter(h=>h.id!==i);this.gameState.logger.log(`Purchased ${l.name}.`,"INFO",{event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:b},unlockedDeck:c,unlockedRoomDeck:f,availableDeck:p,availableRoomDeck:m,shopItems:d},this._emit("state-change",this.gameState)},this.quitGame=(i=!0)=>{i&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has($.BP_MULTIPLIER_2)?q*4:this.metaManager.acls.has($.BP_MULTIPLIER)?q*2:q,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=n}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){e==="state-change"&&this.saveGame();const n=this._listeners[e];n&&n.forEach(i=>i(t))}_simulateEncounter(e,t,n){var m,b,d,h,u,_,x,v,w,D,N;(m=this.gameState)==null||m.logger.log(`--- Encounter: Room ${t} ---`,"INFO",{event:"battle_started",encounter:n});const i=[];let o=0,r=0;const l=e.hp;for(let P=0;P<n.enemyCount;P++){(b=this.gameState)==null||b.logger.info(`Adventurer encounters enemy ${P+1}/${n.enemyCount}.`);let B=n.enemyHp;for(;B>0&&e.hp>0;){if(we(e)==="use_potion"){const C=e.inventory.potions.shift();if(C){const k=C.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+k),i.push(a("game_engine.adventurer_drinks_potion",{potionName:C.name})),(d=this.gameState)==null||d.logger.info(`Adventurer used ${C.name} and recovered ${k} HP.`)}}else{const C=Math.min(.95,.75+e.traits.skill/500+e.traits.offense/1e3);if(y.nextFloat()<C){const k=e.power;B-=k,(h=this.gameState)==null||h.logger.debug(`Adventurer hits for ${k} damage.`),U(e,"hit")}else(u=this.gameState)==null||u.logger.debug("Adventurer misses."),U(e,"miss")}if(B<=0){(_=this.gameState)==null||_.logger.info("Enemy defeated."),r++;break}const re=Math.max(.4,.75-e.traits.skill/500-(100-e.traits.offense)/1e3);if(y.nextFloat()<re){const C=(((x=e.inventory.armor)==null?void 0:x.stats.maxHp)||0)/10,k=Math.max(1,n.enemyPower-C);o+=k,e.hp-=k,(v=this.gameState)==null||v.logger.debug(`Enemy hits for ${k} damage.`),U(e,"take_damage")}else(w=this.gameState)==null||w.logger.debug("Enemy misses.")}if(e.hp<=0){(D=this.gameState)==null||D.logger.warn("Adventurer has been defeated.");break}}const c=l-e.hp,f=c/e.maxHp;(N=this.gameState)==null||N.logger.debug(`hpLost: ${c}, hpLostRatio: ${f.toFixed(2)}`);const p=Ee(e,f,r,n.enemyCount);return i.push(p),{newAdventurer:e,feedback:i,totalDamageTaken:o}}_endRun(e,t=!1){if(!this.gameState)return;const n=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.log(`Run ended with ${this.gameState.designer.balancePoints} BP.`,"INFO",{event:"run_end",bp:this.gameState.designer.balancePoints}),this.gameState.logger.error(`GAME OVER: ${e}`);const i=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:i},newlyUnlocked:n},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:n}=this.gameState.adventurer,{resilience:i,offense:o}=t,r=Math.min(n/100,1);if(e===g.Flow)return"continue";let l=.55;switch(e){case g.Anxiety:l+=.25-i/400;break;case g.Arousal:l-=.1-o/1e3;break;case g.Worry:l+=.2;break;case g.Control:l-=.15;break;case g.Relaxation:l+=.1;break;case g.Boredom:l+=.3;break;case g.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),y.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info(`Adventurer decided to ${e}.`),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:y.nextInt(10,90),resilience:y.nextInt(10,90),skill:0},t=new A,n=new H(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:n,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has($.HAND_SIZE_INCREASE)?12:be}_getRoomDeckSize(){return this.metaManager.acls.has($.ROOM_DECK_SIZE_INCREASE)?36:fe}isWorkshopAccessUnlocked(){return this.metaManager.acls.has($.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has($.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const Ce=s=>{if(!s)return a("global.initializing");switch(s.phase){case"AWAITING_ADVENTURER_CHOICE":return a("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return a("main.adventurer_facing_encounter");default:return a("global.loading")}},Ie=s=>{const e=document.createElement("loading-indicator");return e.setAttribute("text",Ce(s)),e},V=(s,e,t)=>{const n=document.createElement("choice-panel");return n.engine=e,t==="item"?(n.choices=s.hand,n.deckType="item",n.offerImpossible=he(s)):(n.choices=s.roomHand,n.deckType="room",n.roomSelectionImpossible=de(s)),n},Re=(s,e,t)=>{s.innerHTML="";const n=document.createElement("div");n.className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center",s.appendChild(n);const i=document.createElement("div");i.className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6",n.appendChild(i);const o=document.createElement("div");o.className="lg:col-span-1 space-y-6",i.appendChild(o);const r=document.createElement("game-stats");r.engine=t,t.isWorkshopUnlocked()&&r.setAttribute("balance-points",e.designer.balancePoints.toString()),r.setAttribute("run",e.run.toString()),r.setAttribute("room",e.room.toString()),r.setAttribute("deck-size",e.availableDeck.length.toString()),r.setAttribute("room-deck-size",e.availableRoomDeck.length.toString()),o.appendChild(r);const l=document.createElement("feedback-panel"),c=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;l.setAttribute("message",c),o.appendChild(l);const f=document.createElement("log-panel");f.logger=e.logger,f.traits=e.adventurer.traits,o.appendChild(f);const p=document.createElement("div");p.className="lg:col-span-2 space-y-6",i.appendChild(p);const m=document.createElement("adventurer-status");m.metaState=t.metaManager.metaState,m.adventurer=e.adventurer,p.appendChild(m);const b=document.createElement("div");switch(b.className="lg:col-span-3",i.appendChild(b),e.phase){case"RUN_OVER":{const d=document.createElement("run-ended-screen");d.setAttribute("final-bp",e.designer.balancePoints.toString()),d.setAttribute("reason",e.runEnded.reason),d.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&d.setAttribute("workshop-unlocked",""),e.runEnded.decision&&d.initialize(e.runEnded.decision,e.newlyUnlocked,t),b.appendChild(d);break}case"DESIGNER_CHOOSING_LOOT":b.appendChild(V(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":b.appendChild(V(e,t,"room"));break;case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":b.appendChild(Ie(e));break}},He=(s,e)=>{s.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,s.appendChild(t)},Te=(s,e,t)=>{s.innerHTML="";const n=document.createElement("workshop-screen");n.items=e.shopItems,n.balancePoints=e.designer.balancePoints,n.engine=t,s.appendChild(n)},Le=(s,e,t)=>{if(!e){s.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":He(s,t);break;case"SHOP":Te(s,e,t);break;default:Re(s,e,t);break}};function Me(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const J="rogue-steward-meta";class Ae{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const n of se)e>=n.runThreshold&&!this._metaState.unlockedFeatures.includes(n.feature)&&(this._metaState.unlockedFeatures.push(n.feature),t.push(n.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(J);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(J,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const O="rogue-steward-savegame",G="1.0.0";class De{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(O,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(O);if(e){const t=JSON.parse(e);return t.version!==G?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${G}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(O)!==null}clear(){this.storage.setItem(O,"")}_serialize(e){const{adventurer:t,logger:n,...i}=e;return{version:G,...i,adventurer:t.toJSON(),logger:n.toJSON()}}_deserialize(e){const{adventurer:t,logger:n,...i}=e,o=A.fromJSON(n),r=H.fromJSON(t,o);return{...i,adventurer:r,logger:o}}}class Oe{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}}class Ne{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',Ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Ge=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',ze=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Fe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class je extends HTMLElement{constructor(){super(),this._adventurer=null,this._metaState=null}set adventurer(e){this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){var o,r;if(!this._adventurer){this.innerHTML="";return}const e=((o=this._metaState)==null?void 0:o.adventurers)||1,t=Math.max(0,this._adventurer.hp),n=t/this._adventurer.maxHp*100,i=(r=this._metaState)==null?void 0:r.unlockedFeatures.includes($.ADVENTURER_TRAITS);this.innerHTML=`
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 class="text-xl font-label mb-2 text-center text-white">${a("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div data-tooltip-key="adventurer_health">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${Pe()} <span>${a("global.health")}</span></div>
                                <span class="font-label text-sm">${t} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${n}%"></div>
                            </div>
                        </div>
                        <div data-tooltip-key="adventurer_flow_state">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${qe()} <span>${a("adventurer_status.flow_state")}</span></div>
                                <span class="font-label text-sm ${this.getFlowStateColor(this._adventurer.flowState)}">${g[this._adventurer.flowState]}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners" data-tooltip-key="adventurer_power">
                        ${Be()}
                        <span class="mr-2">${a("global.power")}</span>
                        <span class="font-label text-lg text-white">${this._adventurer.power}</span>
                    </div>
                </div>

                ${i?`
                <div class="border-t border-gray-700 my-2"></div>
                <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                    <div>
                        <span class="text-brand-text-muted block">${a("log_panel.offense")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.offense}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${a("log_panel.risk")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.risk}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${a("log_panel.expertise")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.expertise}</span>
                    </div>
                </div>`:""}

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${a("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Ue()} <span class="ml-1">${a("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${a("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Ge()} <span class="ml-1">${a("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${a("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Fe()} <span class="ml-1">${a("adventurer_status.buffs")}</span></div>
                        ${this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(l=>`
                            <div>
                                <p class="text-white text-sm">${l.name} (${a("global.duration")}: ${l.stats.duration})</p>
                                <p class="text-xs text-brand-text-muted">${Object.entries(l.stats).filter(([c])=>c!=="duration").map(([c,f])=>`${a(`global.${c}`)}: ${f}`).join(", ")}</p>
                            </div>
                        `).join(""):`<p class="text-brand-text-muted italic">${a("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${ze()} <span class="ml-1">${a("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${a("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}getFlowStateColor(e){switch(e){case g.Boredom:case g.Apathy:return"text-red-500";case g.Anxiety:case g.Worry:return"text-orange-500";case g.Arousal:case g.Control:case g.Relaxation:return"text-white";case g.Flow:return"text-yellow-400 animate-pulse";default:return"text-white"}}}customElements.define("adventurer-status",je);class We extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,n){e==="message"&&(this._message=n,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",We);class T{constructor(e,t,n,i){this.resolve=i;const o=document.createElement("div");o.className="info-modal-overlay animate-fade-in",o.addEventListener("click",d=>{if(d.target===o){const h=n.find(u=>typeof u.value=="boolean"&&u.value===!1);h&&this.dismiss(h.value)}});const r=document.createElement("div");this.element=r,r.className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-3/4",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("h2");l.id="info-modal-title",l.className="text-4xl font-title text-brand-secondary mb-3",l.textContent=e,r.appendChild(l);const c=document.createElement("div");c.innerHTML=t,r.appendChild(c);const f=document.createElement("div");f.className="text-center mt-6",n.forEach((d,h)=>{const u=document.createElement("button"),_=d.variant==="primary"||d.variant!=="secondary"&&h===0,x="bg-brand-primary text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors",v="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors";u.className=_?x:v,u.textContent=d.text,u.addEventListener("click",()=>{this.dismiss(d.value)}),f.appendChild(u)}),r.appendChild(f),o.appendChild(r),document.body.appendChild(o),this.handleKeydown=d=>{if(d.key==="Escape"){const h=n.find(u=>typeof u.value=="boolean"&&u.value===!1);h&&this.dismiss(h.value)}},document.addEventListener("keydown",this.handleKeydown);const p=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),m=p[0],b=p[p.length-1];m==null||m.focus(),r.addEventListener("keydown",d=>{d.key==="Tab"&&(d.shiftKey?document.activeElement===m&&(b.focus(),d.preventDefault()):document.activeElement===b&&(m.focus(),d.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,n){return new Promise(i=>{new T(e,t,n,i)})}static showInfo(e,t,n=a("global.continue")){const i=[{text:n,value:void 0}];return T.show(e,t,i)}}class Ze extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,n){this.decision=e,this.newlyUnlocked=t,this.engine=n,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=se.find(i=>i.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),n=`
            <h3 class="font-label text-white">${e.title()}</h3>
            <p class="text-brand-text mb-6">${e.description()}</p>
        `;await T.showInfo(t,n,a("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){this.getAttribute("final-bp");const e=this.getAttribute("reason")||a("run_ended_screen.default_reason");this.innerHTML=`
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
                <h2 class="text-4xl font-title text-brand-secondary mb-2">${a("run_ended_screen.run_complete")}</h2>
                <p class="text-brand-text-muted mb-4">${e}</p>
                <div id="decision-container" class="h-24">
                    <p class="text-brand-text-muted text-lg animate-fade-in-up">${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),n=this.querySelector("#button-container");if(!t||!n||this.state!=="decision-revealed")return;let i="",o="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(i=`
                <h3 class="text-2xl text-green-400 ${r}">${a("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,o+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1.2s;"
                >
                    ${a(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(i=`
                <h3 class="text-2xl text-red-400 ${r}">${a("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,o+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1s;"
                >
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=i,n.innerHTML=o}}customElements.define("run-ended-screen",Ze);class j{static show(e,t){const n=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return T.show(e,t,n)}}class Ke extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,n){switch(e){case"balance-points":this._balancePoints=Number(n);break;case"run":this._run=Number(n);break;case"room":this._room=Number(n);break;case"deck-size":this._deckSize=Number(n);break;case"room-deck-size":this._roomDeckSize=Number(n);break}this.render()}connectedCallback(){this.render()}render(){var e,t,n;this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
                ${this._balancePoints!==null?`
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${a("global.bp")}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                `:""}
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${a("global.run")}</span>
                    <p class="text-2xl  text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${a("global.room")}</span>
                    <p class="text-2xl  text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${a("global.deck")}</span>
                    <p class="text-2xl  text-white">${this._deckSize}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${a("global.rooms")}</span>
                    <p class="text-2xl  text-white">${this._roomDeckSize}</p>
                </div>
                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${a("global.workshop")}
                    </button>
                </div>
                `:""}
                <div>
                    <button id="quit-game-btn" class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${a("global.quit")}
                    </button>
                </div>
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var i;(i=this.engine)==null||i.enterWorkshop()}),(n=this.querySelector("#quit-game-btn"))==null||n.addEventListener("click",async()=>{var i;await j.show(a("global.quit"),a("global.quit_confirm"))&&((i=this.engine)==null||i.quitGame(!1))})}}customElements.define("game-stats",Ke);class Ve extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,n){e==="text"&&(this._text=n,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",Ve);class Je extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((n,i)=>`<p class="whitespace-pre-wrap ${this._getLogColor(n.level)}">[${i.toString().padStart(3,"0")}] ${n.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${a("log_panel.title")}</h4>
                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",Je);const Qe={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},S=(s,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${s}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `;class Ye extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Qe[this._item.rarity]||"text-gray-400",t="relative bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let n="";this._isDisabled?n="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?n="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":n="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";let i="";if(this._stackCount>1){const c=Math.min(this._stackCount-1,2);c>=1&&(i+=" stack-outline-1"),c>=2&&(i+=" stack-outline-2")}const o=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${n}${i}${o}`;let r=this._item.name,l="";if("stats"in this._item)if("power"in this._item.stats||"maxHp"in this._item.stats)l=`
          ${this._item.stats.hp?S(a("global.health"),this._item.stats.hp):""}
          ${this._item.stats.maxHp?S(a("global.max_hp"),this._item.stats.maxHp):""}
          ${this._item.stats.power?S(a("global.power"),this._item.stats.power):""}
        `;else{const c=this._item;switch(c.type){case"enemy":l=`
              ${c.stats.attack?S(a("global.attack"),c.stats.attack,!1):""}
              ${c.stats.hp?S(a("global.health"),c.stats.hp,!1):""}
            `,c.units>1&&(r=a("choice_panel.multiple_enemies_title",{name:c.name,count:c.units}));break;case"boss":l=`
              ${c.stats.attack?S(a("global.attack"),c.stats.attack,!1):""}
              ${c.stats.hp?S(a("global.health"),c.stats.hp,!1):""}
            `;break;case"healing":l=`
              ${c.stats.hp?S(a("global.health"),c.stats.hp):""}
            `;break;case"trap":l=`
              ${c.stats.attack?S(a("global.attack"),c.stats.attack,!1):""}
            `;break}}this._stackCount>1&&(r=a("choice_panel.stacked_items_title",{name:this._item.name,count:this._stackCount})),this.innerHTML=`
      <div>
        <div class="flex justify-between items-baseline">
          <p class=" text-2xl ${e}">${r}</p>
          <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
        </div>
        <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
        <div class="border-t border-gray-700 my-2"></div>
        <div class="space-y-1 text-brand-text text-large">
          ${l}
        </div>
      </div>
    `}}customElements.define("choice-card",Ye);const z=4;class Xe extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const n=this._choices.filter(i=>this._selectedIds.includes(i.instanceId));this.engine.runEncounter(n)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(i=>i.instanceId===e);if(!t)return;const n=this._selectedIds.includes(e);if(this._deckType==="room"){const i=t.type==="boss";if(n)this._selectedIds=this._selectedIds.filter(o=>o!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="boss");i&&this._selectedIds.length===0?this._selectedIds.push(e):!i&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const o=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);o.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!o.includes(l)):this._selectedIds.length<z&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(d=>d.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const d=e.map(h=>{const u=document.createElement("choice-card");return u.item=h,u.outerHTML}).join("");T.show(a("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${d}</div>`,[{text:a("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(h=>h.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},n={Weapon:0,Armor:1,Potion:2,Buff:3},i={enemy:0,trap:1,healing:2,boss:3};let o=[...this._choices];this._deckType==="item"?o.sort((d,h)=>{const u=n[d.type]-n[h.type];if(u!==0)return u;const _=t[d.rarity]||0,x=t[h.rarity]||0;return _-x}):o.sort((d,h)=>{const u=d,_=h,x=i[u.type]-i[_.type];if(x!==0)return x;const v=u.stats.hp||0,w=_.stats.hp||0;if(v!==w)return w-v;const D=u.stats.attack||0;return(_.stats.attack||0)-D});const r=this._deckType==="room";let l;if(r)l=o;else{const d=new Map;o.forEach(h=>{const u=h;d.has(u.id)?d.get(u.id).count++:d.set(u.id,{choice:u,count:1})}),l=Array.from(d.values()).map(h=>({...h.choice,stackCount:h.count}))}const c=a(r?"choice_panel.title_room":"choice_panel.title");let f=a(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?f=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(f=a("choice_panel.roll_credits"));let p=!1,m=f;this._offerImpossible||this._roomSelectionImpossible?p=!0:r?this._choices.filter(u=>this._selectedIds.includes(u.instanceId)).some(u=>u.type==="boss")?(p=this._selectedIds.length===1,m=`${f} (1/1)`):(p=this._selectedIds.length===3,m=`${f} (${this._selectedIds.length}/3)`):(p=this._selectedIds.length>=2&&this._selectedIds.length<=z,m=`${f} (${this._selectedIds.length}/${z})`),this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl text-center mb-4 text-white">${c}</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!p||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white py-3 px-8 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${m}
                    </button>
                </div>
            </div>
        `;const b=this.querySelector("#loot-card-container");b&&l.forEach(d=>{const h=document.createElement("choice-card");h.item=d,"stackCount"in d&&(h.stackCount=d.stackCount),h.isSelected=this._selectedIds.includes(d.instanceId);let u=this._disabled;if(this._offerImpossible)u=!0;else if(r){const _=this._choices.filter(v=>this._selectedIds.includes(v.instanceId)),x=_.some(v=>v.type==="boss");h.isSelected?u=!1:(x||d.type==="boss"&&_.length>0||_.length>=3)&&(u=!0)}else{const _=new Map(this._choices.map(w=>[w.instanceId,w.id])),x=this._selectedIds.map(w=>_.get(w));u=!h.isSelected&&x.includes(d.id)||this._disabled}h.isDisabled=u,h.isNewlyDrafted=d.justDrafted&&this._initialRender||!1,b.appendChild(h)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Xe);const E=(s,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${s}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,et=(s,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${s}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,tt=(s,e)=>{const n={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[s.rarity]||"text-gray-400";let i="";if("stats"in s)if(s.type==="Weapon"||s.type==="Armor"||s.type==="Potion"){const o=s;i=`
                ${o.stats.hp?E(a("global.health"),o.stats.hp):""}
                ${o.stats.maxHp?E(a("global.max_hp"),o.stats.maxHp):""}
                ${o.stats.power?E(a("global.power"),o.stats.power,(o.stats.power||0)>0):""}
            `}else{const o=s;switch(o.type){case"enemy":i=`
                        ${o.stats.attack?E(a("global.attack"),o.stats.attack,!1):""}
                        ${o.stats.hp?E(a("global.health"),o.stats.hp,!1):""}
                        ${o.stats.minUnits&&o.stats.maxUnits?et(a("global.units"),o.stats.minUnits,o.stats.maxUnits):""}
                    `;break;case"boss":i=`
                        ${o.stats.attack?E(a("global.attack"),o.stats.attack,!1):""}
                        ${o.stats.hp?E(a("global.health"),o.stats.hp,!1):""}
                    `;break;case"healing":i=`
                        ${o.stats.hp?E(a("global.health"),o.stats.hp):""}
                    `;break;case"trap":i=`
                        ${o.stats.attack?E(a("global.attack"),o.stats.attack,!1):""}
                    `;break}}return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${n}">${s.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${s.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${n}">${s.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${i}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${s.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${a("global.buy")} (${s.cost} ${a("global.bp")})
                </button>
            </div>
        </div>
    `};class st extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,n=t.dataset.itemId;n&&this.engine&&this.engine.purchaseItem(n),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>tt(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-label text-white">${a("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${a("workshop.description")}</p>
                    <p class="mt-4 text-2xl">
                        ${a("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${a("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 pixel-corners text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${a("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",st);class nt extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;if(t.id==="new-game-button"){const n=this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0;this.engine.hasSaveGame()||n?await j.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()}else t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await j.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0))})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let n="";if(e.adventurers||e.highestRun||e.unlockedFeatures.length){const i=e.adventurers||0;n=`
                <p class="text-lg text-gray-400 mt-4">
                    ${a("menu.max_runs",{count:e.highestRun})} | ${a("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${a("menu.adventurer_count",{count:i})}
                </p>
            `}this.innerHTML=`
            <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${a("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${a("game_subtitle")}</p>
                ${n}
                <div class="mt-8 space-y-4">
                        ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                            ${a("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 pixel-corners min-w-[250px] transition-colors">
                        ${a("menu.new_game")}
                    </button>
                    ${t?`
                        <button id="reset-game-button" class="bg-gray-800 hover:bg-gray-700 text-gray-400 py-2 px-4 pixel-corners min-w-[250px] transition-colors text-sm">
                            ${a("menu.reset_save")}
                        </button>
                    `:""}
                </div>
                <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                    v0.0.0 (build 97)
                </div>
            </div>
        `}}customElements.define("menu-screen",nt);class it extends HTMLElement{constructor(){super(),this.rect=new DOMRect(0,0,0,0),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
            .pixel-corners {
              clip-path: polygon(0 5px, 5px 5px, 5px 0, calc(100% - 5px) 0, calc(100% - 5px) 5px, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 5px calc(100% - 5px), 0 calc(100% - 5px));
            }

            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.closeButton=document.createElement("button"),this.closeButton.className="close-button",this.closeButton.innerHTML="&times;",this.closeButton.onclick=()=>this.hide(),this.contentContainer.appendChild(this.closeButton),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}connectedCallback(){window.matchMedia("(pointer: coarse)").matches?this.contentContainer.classList.add("pixel-corners"):this.classList.add("pixel-corners")}show(e,t,n){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.isDesktop?(this.style.opacity="0",this.classList.add("show"),this.rect=this.contentContainer.getBoundingClientRect(),this.updatePosition(t,n),this.style.opacity=""):(this.style.transform="",this.classList.add("show"))}hide(){this.classList.remove("show")}updatePosition(e,t){if(!this.isDesktop)return;const n=15;let i=e+n,o=t+n;i+n+this.rect.width>window.innerWidth&&(i=e-this.rect.width-n,i<0&&(i=0)),o+n+this.rect.height>window.innerHeight&&(o=t-this.rect.height-n,o<0&&(o=0)),this.style.transform=`translate3d(${i}px, ${o}px, 0)`}}customElements.define("tooltip-box",it);class R{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return R.instance||(R.instance=new R),R.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,n=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),n&&this.activeToolipKey!==n&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=n;const i=this.getTooltipContent(n);i&&(this.tooltipBox.show(i,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleMouseMove(e){this.desktopTooltipActive&&this.tooltipBox.updatePosition(e.clientX,e.clientY)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const n=this.findTooltipKey(t.parentElement);if(n){const i=this.getTooltipContent(n);i&&this.tooltipBox.show(i,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let n=a(`tooltips.${e}.title`);return n.includes("tooltips.")&&(n=a("global.information")),{title:n,body:t}}}const F=R.getInstance(),M=document.getElementById("app");if(!M)throw new Error("Could not find app element to mount to");const ae=new Oe,at=new Ae(ae),ot=new De(ae),oe=new Ne,I=new $e(at,oe,ot);I.on("state-change",s=>{if(I.isLoading){M.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(I.error){M.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${I.error}</p>
                    </div>
                </div>
            `;return}Le(M,s,I),Me()});async function rt(){await xe(oe),await I.init(),M.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",s=>F.handleMouseEnter(s)),document.body.addEventListener("mousemove",s=>F.handleMouseMove(s)),document.body.addEventListener("click",s=>F.handleClick(s)),I.showMenu()}rt();
