(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();var p=(s=>(s[s.Arousal=0]="Arousal",s[s.Flow=1]="Flow",s[s.Control=2]="Control",s[s.Relaxation=3]="Relaxation",s[s.Boredom=4]="Boredom",s[s.Apathy=5]="Apathy",s[s.Worry=6]="Worry",s[s.Anxiety=7]="Anxiety",s))(p||{});class ae{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const x=new ae(Date.now()),z=s=>`${s}_${x.nextFloat().toString(36).substr(2,9)}`,ie=(s,e)=>x.nextInt(s,e),K=s=>{const e=[...s];for(let t=e.length-1;t>0;t--){const n=x.nextInt(0,t);[e[t],e[n]]=[e[n],e[t]]}return e},V=(s,e,t,n)=>{const a=e.filter(c=>s.includes(c.id)),i=[],r={Common:.6,Uncommon:.3,Rare:.1},l={Common:0,Uncommon:0,Rare:0},d={Common:0,Uncommon:0,Rare:0};Object.keys(r).forEach(c=>{d[c]=Math.floor(t*r[c])});let h=Object.values(d).reduce((c,u)=>c+u,0);for(;h<t;)d.Common+=1,h+=1;a.filter(c=>c.cost!==null).forEach(c=>{i.push(n(c)),l[c.rarity]+=1}),Object.keys(r).forEach((c,u)=>{const m=a.filter(_=>_.rarity===c);for(;l[c]<d[c]&&m.length!==0;){const _=x.nextInt(0,m.length-1),f=m[_];i.push(n(f)),l[c]+=1}});const g=a.filter(c=>c.rarity==="Common");for(;i.length<t&&g.length>0;){const c=x.nextInt(0,g.length-1),u=g[c];i.push(n(u))}return K(i)},F=(s,e,t)=>V(s,e,t,n=>({...n,instanceId:z(n.id)})),G=(s,e,t)=>V(s,e,t,a=>{const i={...a,instanceId:z(a.id)};return i.type==="enemy"&&i.stats.minUnits&&i.stats.maxUnits&&(i.units=ie(i.stats.minUnits,i.stats.maxUnits)),i}),oe=s=>s.roomHand.length<3&&!s.roomHand.some(e=>e.type==="boss"),re=s=>[...new Set(s.hand.map(t=>t.id))].length<2&&s.hand.length>0;function le(s,e){const t=Math.max(0,Math.min(100,s)),n=Math.max(0,Math.min(100,e));return n>66?t<33?p.Anxiety:t<67?p.Arousal:p.Flow:n>33?t<33?p.Worry:t<67?p.Apathy:p.Control:t<67?p.Boredom:p.Relaxation}const T={hp:100,maxHp:100,power:5},ce=3;class D{constructor(e,t){this.hp=T.hp,this.maxHp=T.maxHp,this.power=T.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=p.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=t,this.roomHistory=[],this.lootHistory=[]}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,n)=>t+n,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,n=Math.max(0,Math.min(100,e));this.challengeHistory.push(n),this.challengeHistory.length>ce&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${n})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=le(this.skill,this.challenge),e!==this.flowState&&(this.logger.info(`Adventurer's state of mind changed from ${p[e]} to ${p[this.flowState]}`),this.logger.log(`Flow state changed to ${p[this.flowState]}`,"INFO",{event:"flow_state_changed",flowState:p[this.flowState]}))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=T.power,n=T.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,n+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,n+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(a=>{t+=a.stats.power||0,n+=a.stats.maxHp||0}),this.power=t,this.maxHp=n,this.hp=Math.round(this.maxHp*e)}}class j{constructor(){this.entries=[],this.listeners=[],this.muted=!1}on(e){this.listeners.push(e)}log(e,t="INFO",n){const a={message:e,level:t,timestamp:Date.now(),data:n};this.muted||(this.entries.push(a),t!=="DEBUG"&&console.log(`[${t}] ${e}`)),this.listeners.forEach(i=>i(a))}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const de=99,he=10,O=10,H=32,me=8;let Q={};async function Y(s,e){try{Q=await e.loadJson(`locales/${s}.json`)}catch(t){console.warn(`Failed to load ${s} translations:`,t),s!=="en"&&await Y("en",e)}}function ue(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function o(s,e={}){let n=s.split(".").reduce((a,i)=>a?a[i]:void 0,Q);if(!n)return console.warn(`Translation not found for key: ${s}`),s;for(const a in e)n=n.replace(`{${a}}`,String(e[a]));return n}async function pe(s){const e=ue();await Y(e,s)}var $=(s=>(s.WORKSHOP="workshop",s.HAND_SIZE_INCREASE="hand_size_increase",s.ADVENTURER_TRAITS="ADVENTURER_TRAITS",s.BP_MULTIPLIER="BP_MULTIPLIER",s.WORKSHOP_ACCESS="WORKSHOP_ACCESS",s.BP_MULTIPLIER_2="BP_MULTIPLIER_2",s))($||{});const J=[{feature:"workshop",runThreshold:2,title:()=>o("unlocks.workshop.title"),description:()=>o("unlocks.workshop.description")},{feature:"hand_size_increase",runThreshold:3,title:()=>o("unlocks.hand_size_increase.title"),description:()=>o("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>o("unlocks.adventurer_traits.title"),description:()=>o("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>o("unlocks.bp_multiplier.title"),description:()=>o("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>o("unlocks.workshop_access.title"),description:()=>o("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>o("unlocks.bp_multiplier_2.title"),description:()=>o("unlocks.bp_multiplier_2.description")}],X=10;function ee(s,e){var h,g,c,u;const{traits:t,inventory:n,hp:a,maxHp:i}=s;let r=(e.rarity==="Uncommon"?2:e.rarity==="Rare"?3:1)*5;const l=((h=n.weapon)==null?void 0:h.stats.power)||0,d=((g=n.armor)==null?void 0:g.stats.maxHp)||0;switch(e.type){case"Weapon":const m=(e.stats.power||0)-l;if(m<=0&&e.id!==((c=n.weapon)==null?void 0:c.id))return-1;r+=m*(t.offense/10),m>0&&(r+=m*(s.skill/10));const _=e.stats.maxHp||0;_<0&&(r+=_*(100-t.resilience)/20);break;case"Armor":const f=(e.stats.maxHp||0)-d;if(f<=0&&e.id!==((u=n.armor)==null?void 0:u.id))return-1;r+=f*(100-t.offense)/10,f>0&&(r+=f*(s.skill/10));const b=e.stats.power||0;b>0&&(r+=b*(t.offense/15));const v=e.stats.power||0;v<0&&(r+=v*(t.resilience/10));break;case"Potion":const w=a/i;r+=10*(100-t.resilience)/100,w<.7&&(r+=20*(1-w)),r+=5*(s.skill/100),n.potions.length>=de&&(r*=.1);break}return r}function ge(s,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${s.traits.offense}, Resilience: ${s.traits.resilience}, Skill: ${s.skill})`);const n=e.map(r=>({item:r,score:ee(s,r)})).filter(r=>r.score>0);if(n.sort((r,l)=>l.score-r.score),n.length===0||n[0].score<he)return{choice:null,reason:o("game_engine.adventurer_declines_offer")};const a=n[0].item;t.debug(`Adventurer chooses: ${a.name} (Score: ${n[0].score.toFixed(1)})`);const i=o("game_engine.adventurer_accepts_offer",{itemName:a.name});return{choice:a,reason:i}}function fe(s,e){const{flowState:t,hp:n,maxHp:a,inventory:i,traits:r}=s,l=n/a;if(i.potions.length===0)return"attack";let d=.5;switch(t){case p.Anxiety:case p.Worry:d=.8;break;case p.Arousal:case p.Flow:d=.6;break;case p.Control:case p.Relaxation:d=.4;break;case p.Boredom:case p.Apathy:d=.2;break}return d-=r.resilience/200,l<Math.max(.1,d)?"use_potion":"attack"}function be(s,e,t){if(e){s.lootHistory.push(e.id),s.lootHistory.filter(i=>i===e.id).length>2&&(s.modifyChallenge(s.challenge-X),s.logger.info(`Adventurer feels a sense of repetitiveness from seeing ${e.name} again.`));const a=ee(s,e);a>60?(s.modifySkill(10),s.modifyChallenge(s.challenge+5)):a>30?(s.modifySkill(5),s.modifyChallenge(s.challenge+2)):s.modifySkill(2)}else t.length>0?s.modifyChallenge(s.challenge-5):s.modifyChallenge(s.challenge-10);s.updateFlowState()}function _e(s,e){s.roomHistory.push(e.id),s.roomHistory.filter(a=>a===e.id).length>2&&(s.modifyChallenge(s.challenge-X),s.logger.info(`Adventurer feels a sense of deja vu upon entering ${e.name}.`));let n=0;switch(e.type){case"enemy":n=5;break;case"boss":n=15;break;case"trap":n=10;break;case"healing":n=-15;break}s.modifyChallenge(s.challenge+n),s.updateFlowState()}function xe(s){s.modifySkill(-2),s.updateFlowState()}function N(s,e){switch(e){case"hit":s.modifySkill(.5);break;case"miss":s.modifySkill(-.5);break;case"take_damage":s.modifyChallenge(s.challenge+1);break}s.updateFlowState()}function ve(s,e,t,n){let a;return e>.7?(a=o("game_engine.too_close_for_comfort"),s.modifyChallenge(s.challenge+10),s.modifySkill(-3)):e>.4?(a=o("game_engine.great_battle"),s.modifyChallenge(s.challenge+5),s.modifySkill(5)):t>3&&s.traits.offense>60?(a=o("game_engine.easy_fight"),s.modifyChallenge(s.challenge-10)):(a=o("game_engine.worthy_challenge"),s.modifyChallenge(s.challenge-2),s.modifySkill(2)),t===n&&s.modifySkill(1*t),s.updateFlowState(),a}class we{constructor(e,t){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=n=>{this.metaManager.incrementAdventurers();const a={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0},i=new j,r=new D(a,i),l=(n==null?void 0:n.items)||this._allItems.filter(b=>b.cost===null).map(b=>b.id),d=F(l,this._allItems,H),h=this._getHandSize(),g=d.slice(0,h),c=d.slice(h),u=(n==null?void 0:n.rooms)||this._allRooms.filter(b=>b.cost===null).map(b=>b.id),m=G(u,this._allRooms,H),_=m.slice(0,h),f=m.slice(h);i.info("--- Starting New Adventurer (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:r,unlockedDeck:l,availableDeck:c,hand:g,unlockedRoomDeck:u,availableRoomDeck:f,roomHand:_,handSize:h,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:o("game_engine.new_adventurer"),logger:i,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{this.startNewGame()},this.startNewRun=n=>{if(!this.gameState)return;const a=n||this.gameState.run+1;this.metaManager.updateRun(a);const i=this._getHandSize(),r=F(this.gameState.unlockedDeck,this._allItems,H),l=r.slice(0,i),d=r.slice(i),h=G(this.gameState.unlockedRoomDeck,this._allRooms,H),g=h.slice(0,i),c=h.slice(i),u=new D(this.gameState.adventurer.traits,this.gameState.logger);u.skill=this.gameState.adventurer.skill,u.challengeHistory=[...this.gameState.adventurer.challengeHistory],u.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info(`--- Starting Run ${a} ---`),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:u,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:d,hand:l,availableRoomDeck:c,roomHand:g,handSize:i,room:1,run:a,feedback:o("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const a=this.gameState.hand.filter(b=>n.includes(b.instanceId));this.gameState.offeredLoot=a;const i=this.gameState.adventurer,{choice:r,reason:l}=ge(i,this.gameState.offeredLoot,this.gameState.logger);be(i,r,this.gameState.offeredLoot),r&&this.gameState.logger.log("Item chosen by adventurer","INFO",{event:"item_chosen",item:r});let d=this.gameState.hand,h=this.gameState.availableDeck;d.forEach(b=>b.justDrafted=!1);let g=d.filter(b=>!n.includes(b.instanceId));const c=this.gameState.handSize-g.length,u=h.slice(0,c);u.forEach(b=>{b.draftedRoom=this.gameState.room,b.justDrafted=!0});const m=h.slice(c);g.push(...u),r&&(r.type==="Potion"?i.addPotion(r):r.type==="Buff"?i.applyBuff(r):i.equip(r));const _=this.gameState.room+1,f=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:i,feedback:l,availableDeck:m,hand:g,room:_,designer:{balancePoints:f}},this._emit("state-change",this.gameState)},this.runEncounter=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=n;let a=this.gameState.adventurer,i=[];const r=x.nextInt(0,this.gameState.offeredRooms.length-1),l=this.gameState.offeredRooms[r];switch(a.roomHistory.push(l.id),_e(a,l),this.gameState.logger.log(`--- Encountering Room: ${l.name} ---`,"INFO",{event:"room_encountered",room:l}),l.type){case"enemy":case"boss":const f={enemyCount:l.units??1,enemyPower:l.stats.attack||5,enemyHp:l.stats.hp||10},b=this._simulateEncounter(a,this.gameState.room,f);a=b.newAdventurer,i=b.feedback;break;case"healing":const v=l.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+v),i.push(o("game_engine.healing_room",{name:l.name,healing:v})),this.gameState.logger.info(o("game_engine.healing_room",{name:l.name,healing:v}));break;case"trap":const w=l.stats.attack||0;a.hp-=w,xe(a),i.push(o("game_engine.trap_room",{name:l.name,damage:w})),this.gameState.logger.info(o("game_engine.trap_room",{name:l.name,damage:w}));break}a.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let d=this.gameState.roomHand,h=this.gameState.availableRoomDeck;d.forEach(f=>f.justDrafted=!1);const g=this.gameState.offeredRooms.map(f=>f.instanceId);let c=d.filter(f=>!g.includes(f.instanceId));const u=this.gameState.handSize-c.length,m=h.slice(0,u);m.forEach(f=>{f.draftedRoom=this.gameState.room,f.justDrafted=!0});const _=h.slice(u);if(c.push(...m),this.gameState.adventurer=a,a.hp<=0){this._endRun(o("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(a.boredomCounter>2){const f=a.flowState===p.Boredom?o("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):o("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(f);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),i.push(o("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:i,encounter:void 0,roomHand:c,availableRoomDeck:_}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:i,encounter:void 0,roomHand:c,availableRoomDeck:_},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(o("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("Entering workshop."),!this.metaManager.acls.has($.WORKSHOP)){this.gameState.logger.info("Workshop not unlocked, starting new run."),this.startNewRun();return}const n=this.gameState.run+1,a=this._allItems.filter(l=>l.cost!==null).filter(l=>!this.gameState.unlockedDeck.includes(l.id)),i=this._allRooms.filter(l=>l.cost!==null).filter(l=>!this.gameState.unlockedRoomDeck.includes(l.id)),r=[...a,...i];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:n,room:0,shopItems:K(r).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:o("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=n=>{if(!this.gameState)return;const a=this._allItems.find(m=>m.id===n),i=this._allRooms.find(m=>m.id===n),r=a||i;if(!r||r.cost===null||this.gameState.designer.balancePoints<r.cost)return;let l=this.gameState.unlockedDeck,d=this.gameState.unlockedRoomDeck,h=this.gameState.availableDeck,g=this.gameState.availableRoomDeck;a?(l=[...this.gameState.unlockedDeck,n],this.isWorkshopAccessUnlocked()&&(h=[a,...this.gameState.availableDeck])):i&&(d=[...this.gameState.unlockedRoomDeck,n],this.isWorkshopAccessUnlocked()&&(g=[i,...this.gameState.availableRoomDeck]));const c=this.gameState.designer.balancePoints-r.cost,u=this.gameState.shopItems.filter(m=>m.id!==n);this.gameState.logger.log(`Purchased ${r.name}.`,"INFO",{event:"item_purchased",item:r}),this.gameState={...this.gameState,designer:{balancePoints:c},unlockedDeck:l,unlockedRoomDeck:d,availableDeck:h,availableRoomDeck:g,shopItems:u},this._emit("state-change",this.gameState)},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has($.BP_MULTIPLIER_2)?O*4:this.metaManager.acls.has($.BP_MULTIPLIER)?O*2:O,this.metaManager=e,this.dataLoader=t}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){const n=this._listeners[e];n&&n.forEach(a=>a(t))}_simulateEncounter(e,t,n){var c,u,m,_,f,b,v,w,B,q,U;(c=this.gameState)==null||c.logger.log(`--- Encounter: Room ${t} ---`,"INFO",{event:"battle_started",encounter:n});const a=[];let i=0,r=0;const l=e.hp;for(let M=0;M<n.enemyCount;M++){(u=this.gameState)==null||u.logger.info(`Adventurer encounters enemy ${M+1}/${n.enemyCount}.`);let A=n.enemyHp;for(;A>0&&e.hp>0;){if(fe(e)==="use_potion"){const y=e.inventory.potions.shift();if(y){const I=y.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+I),a.push(o("game_engine.adventurer_drinks_potion",{potionName:y.name})),(m=this.gameState)==null||m.logger.info(`Adventurer used ${y.name} and recovered ${I} HP.`)}}const se=Math.min(.95,.75+e.traits.skill/500+e.traits.offense/1e3);if(x.nextFloat()<se){const y=e.power;A-=y,(_=this.gameState)==null||_.logger.debug(`Adventurer hits for ${y} damage.`),N(e,"hit")}else(f=this.gameState)==null||f.logger.debug("Adventurer misses."),N(e,"miss");if(A<=0){(b=this.gameState)==null||b.logger.info("Enemy defeated."),r++;break}const ne=Math.max(.4,.75-e.traits.skill/500-(100-e.traits.offense)/1e3);if(x.nextFloat()<ne){const y=(((v=e.inventory.armor)==null?void 0:v.stats.maxHp)||0)/10,I=Math.max(1,n.enemyPower-y);i+=I,e.hp-=I,(w=this.gameState)==null||w.logger.debug(`Enemy hits for ${I} damage.`),N(e,"take_damage")}else(B=this.gameState)==null||B.logger.debug("Enemy misses.")}if(e.hp<=0){(q=this.gameState)==null||q.logger.warn("Adventurer has been defeated.");break}}const d=l-e.hp,h=d/e.maxHp;(U=this.gameState)==null||U.logger.debug(`hpLost: ${d}, hpLostRatio: ${h.toFixed(2)}`);const g=ve(e,h,r,n.enemyCount);return a.push(g),{newAdventurer:e,feedback:a,totalDamageTaken:i}}_endRun(e,t=!1){if(!this.gameState)return;const n=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.log(`Run ended with ${this.gameState.designer.balancePoints} BP.`,"INFO",{event:"run_end",bp:this.gameState.designer.balancePoints}),this.gameState.logger.error(`GAME OVER: ${e}`);const a=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:a},newlyUnlocked:n},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t}=this.gameState.adventurer;if(e===p.Boredom||e===p.Apathy)return"retire";if(e===p.Worry||e===p.Anxiety){const n=t.resilience/100,a=t.offense/100,i=x.nextFloat(),r=.5-n*.25-a*.25;return i>r?"continue":"retire"}return"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info(`Adventurer decided to ${e}.`),e==="retire"){this.showMenu();return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0},t=new j,n=new D(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:n,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has($.HAND_SIZE_INCREASE)?12:me}isWorkshopAccessUnlocked(){return this.metaManager.acls.has($.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has($.WORKSHOP)}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json")}catch(e){this.error=e.message||o("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const ye=s=>{if(!s)return o("global.initializing");switch(s.phase){case"AWAITING_ADVENTURER_CHOICE":return o("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return o("main.adventurer_facing_encounter");default:return o("global.loading")}},ke=s=>{const e=document.createElement("loading-indicator");return e.setAttribute("text",ye(s)),e},W=(s,e,t)=>{const n=document.createElement("choice-panel");return n.engine=e,t==="item"?(n.choices=s.hand,n.deckType="item",n.offerImpossible=re(s)):(n.choices=s.roomHand,n.deckType="room",n.roomSelectionImpossible=oe(s)),n},Se=(s,e,t)=>{s.innerHTML="";const n=document.createElement("div");n.className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center",s.appendChild(n);const a=document.createElement("div");a.className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6",n.appendChild(a);const i=document.createElement("div");i.className="lg:col-span-1 space-y-6",a.appendChild(i);const r=document.createElement("game-stats");r.engine=t,t.isWorkshopUnlocked()&&r.setAttribute("balance-points",e.designer.balancePoints.toString()),r.setAttribute("run",e.run.toString()),r.setAttribute("room",e.room.toString()),r.setAttribute("deck-size",e.availableDeck.length.toString()),i.appendChild(r);const l=document.createElement("feedback-panel"),d=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;l.setAttribute("message",d),i.appendChild(l);const h=document.createElement("log-panel");h.logger=e.logger,h.traits=e.adventurer.traits,i.appendChild(h);const g=document.createElement("div");g.className="lg:col-span-2 space-y-6",a.appendChild(g);const c=document.createElement("adventurer-status");c.metaState=t.metaManager.metaState,c.adventurer=e.adventurer,g.appendChild(c);const u=document.createElement("div");switch(u.className="lg:col-span-3",a.appendChild(u),e.phase){case"RUN_OVER":{const m=document.createElement("run-ended-screen");m.setAttribute("final-bp",e.designer.balancePoints.toString()),m.setAttribute("reason",e.runEnded.reason),m.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&m.setAttribute("workshop-unlocked",""),m.newlyUnlocked=e.newlyUnlocked,m.engine=t,e.runEnded.decision&&m.setDecision(e.runEnded.decision),u.appendChild(m);break}case"DESIGNER_CHOOSING_LOOT":u.appendChild(W(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":u.appendChild(W(e,t,"room"));break;case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":u.appendChild(ke(e));break}},$e=(s,e)=>{s.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,s.appendChild(t)},Ee=(s,e,t)=>{s.innerHTML="";const n=document.createElement("workshop-screen");n.items=e.shopItems,n.balancePoints=e.designer.balancePoints,n.engine=t,s.appendChild(n)},Ie=(s,e,t)=>{if(!e){s.innerHTML=`<div>${o("global.loading")}</div>`;return}switch(e.phase){case"MENU":$e(s,t);break;case"SHOP":Ee(s,e,t);break;default:Se(s,e,t);break}},Z="rogue-steward-meta";class Re{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const n of J)e>=n.runThreshold&&!this._metaState.unlockedFeatures.includes(n.feature)&&(this._metaState.unlockedFeatures.push(n.feature),t.push(n.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this._metaState.adventurers>1&&this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(Z);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(Z,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}class Te{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}}class Ce{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const He=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Le=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Me=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',De=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class Pe extends HTMLElement{constructor(){super(),this._adventurer=null,this._metaState=null}set adventurer(e){this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){var i,r;if(!this._adventurer){this.innerHTML="";return}const e=((i=this._metaState)==null?void 0:i.adventurers)||1,t=Math.max(0,this._adventurer.hp),n=t/this._adventurer.maxHp*100,a=(r=this._metaState)==null?void 0:r.unlockedFeatures.includes($.ADVENTURER_TRAITS);this.innerHTML=`
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 class="text-xl font-label mb-2 text-center text-white">${o("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div data-tooltip-key="adventurer_health">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${He()} <span>${o("global.health")}</span></div>
                                <span class="font-label text-sm">${t} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${n}%"></div>
                            </div>
                        </div>
                        <div data-tooltip-key="adventurer_flow_state">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${Me()} <span>${o("adventurer_status.flow_state")}</span></div>
                                <span class="font-label text-sm ${this.getFlowStateColor(this._adventurer.flowState)}">${p[this._adventurer.flowState]}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners" data-tooltip-key="adventurer_power">
                        ${Le()}
                        <span class="mr-2">${o("global.power")}</span>
                        <span class="font-label text-lg text-white">${this._adventurer.power}</span>
                    </div>
                </div>

                ${a?`
                <div class="border-t border-gray-700 my-2"></div>
                <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                    <div>
                        <span class="text-brand-text-muted block">${o("log_panel.offense")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.offense}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${o("log_panel.risk")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.risk}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${o("log_panel.expertise")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.expertise}</span>
                    </div>
                </div>`:""}

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${o("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Ae()} <span class="ml-1">${o("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${o("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${o("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${De()} <span class="ml-1">${o("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${o("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${o("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Ne()} <span class="ml-1">${o("adventurer_status.buffs")}</span></div>
                        ${this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(l=>`
                            <div>
                                <p class="text-white text-sm">${l.name} (${o("global.duration")}: ${l.stats.duration})</p>
                                <p class="text-xs text-brand-text-muted">${Object.entries(l.stats).filter(([d])=>d!=="duration").map(([d,h])=>`${o(`global.${d}`)}: ${h}`).join(", ")}</p>
                            </div>
                        `).join(""):`<p class="text-brand-text-muted italic">${o("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Oe()} <span class="ml-1">${o("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white text-sm">${o("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${o("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}getFlowStateColor(e){switch(e){case p.Boredom:case p.Apathy:return"text-red-500";case p.Anxiety:case p.Worry:return"text-orange-500";case p.Arousal:case p.Control:case p.Relaxation:return"text-white";case p.Flow:return"text-yellow-400 animate-pulse";default:return"text-white"}}}customElements.define("adventurer-status",Pe);class Be extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,n){e==="message"&&(this._message=n,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",Be);class qe extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="unlock-dismiss-button"?this.dismissUnlock():t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}setDecision(e){this.decision=e,this.startFlow()}connectedCallback(){this.render()}startFlow(){this.newlyUnlocked.length>0?this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}renderUnlock(){const e=this.querySelector("#unlock-container");if(!e)return;const t=J.find(n=>n.feature===this.newlyUnlocked[0]);t&&(e.innerHTML=`
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-3/4">
                    <h2 class="text-4xl font-title text-brand-secondary mb-3">${o("unlocks.title")}</h2>
                    <h3 class="font-label text-white">${t.title()}</h3>
                    <p class="text-brand-text mb-6">${t.description()}</p>
                    <button id="unlock-dismiss-button" class="bg-brand-primary text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors">
                        ${o("global.continue")}
                    </button>
                </div>
            </div>
        `)}dismissUnlock(){const e=this.querySelector("#unlock-container");e&&(e.innerHTML=""),this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}this.state="decision-revealed",this.updateDecision(!0)}render(){this.getAttribute("final-bp");const e=this.getAttribute("reason")||o("run_ended_screen.default_reason");this.innerHTML=`
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
            <div id="unlock-container"></div>
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),n=this.querySelector("#button-container");if(!t||!n||this.state!=="decision-revealed")return;let a="",i="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(a=`
                <h3 class="text-2xl text-green-400 ${r}">${o("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.continue_decision")}</p>
            `,i+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1.2s;"
                >
                    ${o(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(a=`
                <h3 class="text-2xl text-red-400 ${r}">${o("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,i+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${r}"
                    style="animation-delay: 1s;"
                >
                    ${o("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=a,n.innerHTML=i}}customElements.define("run-ended-screen",qe);class Ue extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,t,n){switch(e){case"balance-points":this._balancePoints=Number(n);break;case"run":this._run=Number(n);break;case"room":this._room=Number(n);break;case"deck-size":this._deckSize=Number(n);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
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
                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${o("global.workshop")}
                    </button>
                </div>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var n;(n=this.engine)==null||n.enterWorkshop()})}}customElements.define("game-stats",Ue);class Fe extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,n){e==="text"&&(this._text=n,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",Fe);class Ge extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((n,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(n.level)}">[${a.toString().padStart(3,"0")}] ${n.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${o("log_panel.title")}</h4>
                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",Ge);const je={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},k=(s,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${s}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `;class We extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=je[this._item.rarity]||"text-gray-400",t="bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let n="";this._isDisabled?n="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?n="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":n="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${n}${a}`;let i=this._item.name,r="";if("stats"in this._item)if("power"in this._item.stats||"maxHp"in this._item.stats)r=`
          ${this._item.stats.hp?k(o("global.health"),this._item.stats.hp):""}
          ${this._item.stats.maxHp?k(o("global.max_hp"),this._item.stats.maxHp):""}
          ${this._item.stats.power?k(o("global.power"),this._item.stats.power):""}
        `;else{const l=this._item;switch(l.type){case"enemy":r=`
              ${l.stats.attack?k(o("global.attack"),l.stats.attack,!1):""}
              ${l.stats.hp?k(o("global.health"),l.stats.hp,!1):""}
            `,l.units>1&&(i=o("choice_panel.multiple_enemies_title",{name:l.name,count:l.units}));break;case"boss":r=`
              ${l.stats.attack?k(o("global.attack"),l.stats.attack,!1):""}
              ${l.stats.hp?k(o("global.health"),l.stats.hp,!1):""}
            `;break;case"healing":r=`
              ${l.stats.hp?k(o("global.health"),l.stats.hp):""}
            `;break;case"trap":r=`
              ${l.stats.attack?k(o("global.attack"),l.stats.attack,!1):""}
            `;break}}this.innerHTML=`
      <div>
        <div class="flex justify-between items-baseline">
          <p class=" text-2xl ${e}">${i}</p>
          <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
        </div>
        <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
        <div class="border-t border-gray-700 my-2"></div>
        <div class="space-y-1 text-brand-text text-large">
          ${r}
        </div>
      </div>
    `}}customElements.define("choice-card",We);const P=4;class Ze extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const n=this._choices.filter(a=>this._selectedIds.includes(a.instanceId));this.engine.runEncounter(n)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(a=>a.instanceId===e);if(!t)return;const n=this._selectedIds.includes(e);if(this._deckType==="room"){const a=t.type==="boss";if(n)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="boss");a&&this._selectedIds.length===0?this._selectedIds.push(e):!a&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=new Map(this._choices.map(i=>[i.instanceId,i.id]));if(n)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{if(this._selectedIds.map(r=>a.get(r)).includes(t.id))return;this._selectedIds.length<P&&this._selectedIds.push(e)}}this.render()}render(){if(!this._choices)return;const e=this._deckType==="room",t=o(e?"choice_panel.title_room":"choice_panel.title");let n=o(e?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?n=o("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(n=o("choice_panel.roll_credits"));let a=!1,i=n;this._offerImpossible||this._roomSelectionImpossible?a=!0:e?this._choices.filter(h=>this._selectedIds.includes(h.instanceId)).some(h=>h.type==="boss")?(a=this._selectedIds.length===1,i=`${n} (1/1)`):(a=this._selectedIds.length===3,i=`${n} (${this._selectedIds.length}/3)`):(a=this._selectedIds.length>=2&&this._selectedIds.length<=P,i=`${n} (${this._selectedIds.length}/${P})`),this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl text-center mb-4 text-white">${t}</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!a||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white py-3 px-8 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${i}
                    </button>
                </div>
            </div>
        `;const r=this.querySelector("#loot-card-container");r&&this._choices.forEach(l=>{const d=document.createElement("choice-card");d.item=l,d.isSelected=this._selectedIds.includes(l.instanceId);let h=this._disabled;if(this._offerImpossible)h=!0;else if(e){const g=this._choices.filter(u=>this._selectedIds.includes(u.instanceId)),c=g.some(u=>u.type==="boss");d.isSelected?h=!1:(c||l.type==="boss"&&g.length>0||g.length>=3)&&(h=!0)}else{const g=new Map(this._choices.map(m=>[m.instanceId,m.id])),c=this._selectedIds.map(m=>g.get(m));h=!d.isSelected&&c.includes(l.id)||this._disabled}d.isDisabled=h,d.isNewlyDrafted=l.justDrafted&&this._initialRender||!1,r.appendChild(d)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ze);const S=(s,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${s}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,ze=(s,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${s}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,Ke=(s,e)=>{const n={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[s.rarity]||"text-gray-400";let a="";if("stats"in s)if(s.type==="Weapon"||s.type==="Armor"||s.type==="Potion"){const i=s;a=`
                ${i.stats.hp?S(o("global.health"),i.stats.hp):""}
                ${i.stats.maxHp?S(o("global.max_hp"),i.stats.maxHp):""}
                ${i.stats.power?S(o("global.power"),i.stats.power,(i.stats.power||0)>0):""}
            `}else{const i=s;switch(i.type){case"enemy":a=`
                        ${i.stats.attack?S(o("global.attack"),i.stats.attack,!1):""}
                        ${i.stats.hp?S(o("global.health"),i.stats.hp,!1):""}
                        ${i.stats.minUnits&&i.stats.maxUnits?ze(o("global.units"),i.stats.minUnits,i.stats.maxUnits):""}
                    `;break;case"boss":a=`
                        ${i.stats.attack?S(o("global.attack"),i.stats.attack,!1):""}
                        ${i.stats.hp?S(o("global.health"),i.stats.hp,!1):""}
                    `;break;case"healing":a=`
                        ${i.stats.hp?S(o("global.health"),i.stats.hp):""}
                    `;break;case"trap":a=`
                        ${i.stats.attack?S(o("global.attack"),i.stats.attack,!1):""}
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
                    ${a}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${s.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${o("global.buy")} (${s.cost} ${o("global.bp")})
                </button>
            </div>
        </div>
    `};class Ve extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,n=t.dataset.itemId;n&&this.engine&&this.engine.purchaseItem(n),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>Ke(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
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
        `}}customElements.define("workshop-screen",Ve);class Qe extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?this.metaManager.metaState.adventurers>0?confirm(o("menu.new_game_confirm"))&&(this.metaManager.reset(),this.engine.startNewGame()):this.engine.startNewGame():t.id==="continue-game-button"&&this.engine.continueGame()})}connectedCallback(){this.render()}render(){if(!this.metaManager)return;const e=this.metaManager.metaState,t=e.adventurers>0;let n="";if(t){const a=e.adventurers||1;n=`
                <p class="text-lg text-gray-400 mt-4">
                    ${o("menu.max_runs",{count:e.highestRun})} | ${o("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${o("menu.adventurer_count",{count:a})}
                </p>
            `}this.innerHTML=`
            <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${o("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${o("game_subtitle")}</p>
                ${n}
                <div class="mt-8 space-y-4">
                        ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                            ${o("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                        ${o("menu.new_game")}
                    </button>
                </div>
                <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                    v0.0.0 (build 69)
                </div>
            </div>
        `}}customElements.define("menu-screen",Qe);class Ye extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
            :host {
                display: none;
                position: fixed;
                z-index: 1000;
                pointer-events: none;
                background-color: #1a202c;
                border: 1px solid #4a5568;
                padding: 1rem;
                border-radius: 0.25rem;
                max-width: 350px;
                font-size: 0.875rem;
                color: #cbd5e0;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 999;
            }

            .close-button {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                color: #cbd5e0;
                cursor: pointer;
                background: none;
                border: none;
            }

            @media (pointer: coarse) {
                :host(.show) {
                    display: flex;
                    flex-direction: column;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 500px;
                    font-size: 1.125rem; /* text-lg */
                    pointer-events: auto;
                }

                :host(.show) .overlay {
                    display: block;
                }

                h3 {
                    font-size: 1.5rem; /* text-2xl */
                }
            }
        `,this.overlayElement=document.createElement("div"),this.overlayElement.className="overlay",this.overlayElement.onclick=()=>this.hide();const t=document.createElement("div");this.titleElement=document.createElement("h3"),this.titleElement.style.fontWeight="bold",this.titleElement.style.marginBottom="8px",this.bodyElement=document.createElement("div"),this.closeButton=document.createElement("button"),this.closeButton.className="close-button",this.closeButton.innerHTML="&times;",this.closeButton.onclick=()=>this.hide(),t.appendChild(this.closeButton),t.appendChild(this.titleElement),t.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.overlayElement),this.shadowRoot.appendChild(t)}show(e,t,n){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,window.matchMedia("(pointer: coarse)").matches?(this.style.display="",this.classList.add("show"),this.overlayElement.style.display="block",this.closeButton.style.display="block"):(this.style.display="block",this.style.left=`${t+15}px`,this.style.top=`${n+15}px`)}hide(){this.style.display="none",this.classList.remove("show"),this.overlayElement.style.display="none",this.closeButton.style.display="none"}}customElements.define("tooltip-box",Ye);class R{constructor(){this.showTimeout=null,this.hideTimeout=null,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return R.instance||(R.instance=new R),R.instance}handleMouseEnter(e){if(this.isTouchDevice())return;this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=null);const t=e.target,n=this.findTooltipKey(t);n&&(this.showTimeout=window.setTimeout(()=>{const a=this.getTooltipContent(n);a&&this.tooltipBox.show(a,e.clientX,e.clientY)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.hideTimeout=window.setTimeout(()=>{this.tooltipBox.hide()},100))}handleTouchStart(e){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null);const t=e.target,n=this.findTooltipKey(t);n&&(e.preventDefault(),this.showTimeout=window.setTimeout(()=>{const a=this.getTooltipContent(n);a&&this.tooltipBox.show(a,0,0)},300))}handleTouchEnd(){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null)}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=o(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let n=o(`tooltips.${e}.title`);return n.includes("tooltips.")&&(n=o("global.information")),{title:n,body:t}}}const L=R.getInstance(),C=document.getElementById("app");if(!C)throw new Error("Could not find app element to mount to");const Je=new Te,Xe=new Re(Je),te=new Ce,E=new we(Xe,te);E.on("state-change",s=>{if(E.isLoading){C.innerHTML=`<div>${o("global.loading_game_data")}</div>`;return}if(E.error){C.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${o("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${E.error}</p>
                    </div>
                </div>
            `;return}Ie(C,s,E)});async function et(){await pe(te),await E.init(),C.innerHTML=`<div>${o("global.initializing")}</div>`,document.body.addEventListener("mouseover",s=>L.handleMouseEnter(s)),document.body.addEventListener("mouseout",()=>L.handleMouseLeave()),document.body.addEventListener("touchstart",s=>L.handleTouchStart(s)),document.body.addEventListener("touchend",()=>L.handleTouchEnd()),E.showMenu()}et();
