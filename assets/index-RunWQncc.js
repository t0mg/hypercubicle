(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const ee="modulepreload",te=function(i){return"/rogue-steward/"+i},q={},se=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){let r=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=r(t.map(u=>{if(u=te(u),u in q)return;q[u]=!0;const m=u.endsWith(".css"),h=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${h}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":ee,m||(f.as="script"),f.crossOrigin="",f.href=u,d&&f.setAttribute("nonce",d),document.head.appendChild(f),m)return new Promise((p,c)=>{f.addEventListener("load",p),f.addEventListener("error",()=>c(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return n.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})};var _=(i=>(i[i.Arousal=0]="Arousal",i[i.Flow=1]="Flow",i[i.Control=2]="Control",i[i.Relaxation=3]="Relaxation",i[i.Boredom=4]="Boredom",i[i.Apathy=5]="Apathy",i[i.Worry=6]="Worry",i[i.Anxiety=7]="Anxiety",i))(_||{});let W={};async function F(i,e){try{W=await e.loadJson(`locales/${i}.json`)}catch(t){console.warn(`Failed to load ${i} translations:`,t),i!=="en"&&await F("en",e)}}function ne(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function o(i,e={}){let s=i.split(".").reduce((n,a)=>n?n[a]:void 0,W);if(!s)return console.warn(`Translation not found for key: ${i}`),i;for(const n in e)s=s.replace(`{${n}}`,String(e[n]));return s}async function ie(i){const e=ne();await F(e,i)}class k{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return k.instance||(k.instance=new k),k.instance}on(e){this.listeners.push(e)}log(e,t="INFO",s){const n=o(`log_messages.${e}`,s),a={message:n,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(a),t!=="DEBUG"&&console.log(`[${t}] ${n}`)),this.listeners.forEach(r=>r(a))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(s=>s(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=k.getInstance();return t.loadEntries(e.entries),t}}class ae{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const S=new ae(Date.now()),Z=i=>`${i}_${S.nextFloat().toString(36).substr(2,9)}`,oe=(i,e)=>S.nextInt(i,e),V=i=>{const e=[...i];for(let t=e.length-1;t>0;t--){const s=S.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},J=(i,e,t,s)=>{const n=e.filter(h=>i.includes(h.id)),a=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},d={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(h=>{d[h]=Math.floor(t*r[h])});let u=Object.values(d).reduce((h,f)=>h+f,0);for(;u<t;)d.common+=1,u+=1;n.filter(h=>h.cost!==null).forEach(h=>{a.push(s(h)),l[h.rarity]+=1}),Object.keys(r).forEach((h,f)=>{const p=n.filter(c=>c.rarity===h);for(;l[h]<d[h]&&p.length!==0;){const c=S.nextInt(0,p.length-1),g=p[c];a.push(s(g)),l[h]+=1}});const m=n.filter(h=>h.rarity==="common");for(;a.length<t&&m.length>0;){const h=S.nextInt(0,m.length-1),f=m[h];a.push(s(f))}return V(a)},B=(i,e,t)=>J(i,e,t,s=>({...s,instanceId:Z(s.id)})),z=(i,e,t)=>J(i,e,t,n=>{const a={...n,instanceId:Z(n.id)};return a.type==="room_enemy"&&a.stats.minUnits&&a.stats.maxUnits&&(a.units=oe(a.stats.minUnits,a.stats.maxUnits)),a}),re=i=>i.roomHand.length<3&&!i.roomHand.some(e=>e.type==="room_boss"),le=i=>[...new Set(i.hand.map(t=>t.id))].length<2&&i.hand.length>0;function ce(i,e){const t=Math.max(0,Math.min(100,i)),s=Math.max(0,Math.min(100,e));return s>66?t<33?_.Anxiety:t<87?_.Arousal:_.Flow:s>33?t<33?_.Worry:t<67?_.Apathy:_.Control:t<67?_.Boredom:_.Relaxation}const T={hp:100,maxHp:100,power:5},de=3;class C{constructor(e,t){this.hp=T.hp,this.maxHp=T.maxHp,this.power=T.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=_.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=k.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>de&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=ce(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{from:o("flow_states."+_[e]),to:o("flow_states."+_[this.flowState])})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=T.power,s=T.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(n=>{t+=n.stats.power||0,s+=n.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e,t){const s=e.traits,n=new C(s);return n.hp=e.hp,n.maxHp=e.maxHp,n.power=e.power,n.inventory=e.inventory,n.activeBuffs=e.activeBuffs,n.skill=e.skill,n.challengeHistory=e.challengeHistory,n.flowState=e.flowState,n.roomHistory=e.roomHistory,n.lootHistory=e.lootHistory,n.boredomCounter=e.boredomCounter,n.firstName=e.firstName,n.lastName=e.lastName,n}}const he=99,ue=10,L=10,G=32,me=18,pe=8;var w=(i=>(i.WORKSHOP="workshop",i.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",i.HAND_SIZE_INCREASE="hand_size_increase",i.ADVENTURER_TRAITS="ADVENTURER_TRAITS",i.BP_MULTIPLIER="BP_MULTIPLIER",i.WORKSHOP_ACCESS="WORKSHOP_ACCESS",i.BP_MULTIPLIER_2="BP_MULTIPLIER_2",i))(w||{});const Y=[{feature:"workshop",runThreshold:2,title:()=>o("unlocks.workshop.title"),description:()=>o("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>o("unlocks.room_deck_size_increase.title"),description:()=>o("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>o("unlocks.hand_size_increase.title"),description:()=>o("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>o("unlocks.adventurer_traits.title"),description:()=>o("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>o("unlocks.bp_multiplier.title"),description:()=>o("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>o("unlocks.workshop_access.title"),description:()=>o("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>o("unlocks.bp_multiplier_2.title"),description:()=>o("unlocks.bp_multiplier_2.description")}],Q=10;function X(i,e){var u,m,h,f;const{traits:t,inventory:s,hp:n,maxHp:a}=i;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((u=s.weapon)==null?void 0:u.stats.power)||0,d=((m=s.armor)==null?void 0:m.stats.maxHp)||0;switch(e.type){case"item_weapon":const p=(e.stats.power||0)-l;if(p<=0&&e.id!==((h=s.weapon)==null?void 0:h.id))return-1;r+=p*(t.offense/10),p>0&&(r+=p*(i.skill/10));const c=e.stats.maxHp||0;c<0&&(r+=c*(100-t.resilience)/20);break;case"item_armor":const g=(e.stats.maxHp||0)-d;if(g<=0&&e.id!==((f=s.armor)==null?void 0:f.id))return-1;r+=g*(100-t.offense)/10,g>0&&(r+=g*(i.skill/10));const b=e.stats.power||0;b>0&&(r+=b*(t.offense/15));const v=e.stats.power||0;v<0&&(r+=v*(t.resilience/10));break;case"item_potion":const y=n/a;r+=10*(100-t.resilience)/100,y<.7&&(r+=20*(1-y)),r+=5*(i.skill/100),s.potions.length>=he&&(r*=.1);break}return r}function fe(i,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${i.traits.offense}, Resilience: ${i.traits.resilience}, Skill: ${i.skill})`);const s=e.map(r=>({item:r,score:X(i,r)})).filter(r=>r.score>0);if(s.sort((r,l)=>l.score-r.score),s.length===0||s[0].score<ue)return{choice:null,reason:o("game_engine.adventurer_declines_offer")};const n=s[0].item;t.debug(`Adventurer chooses: ${o("items_and_rooms."+n.id)} (Score: ${s[0].score.toFixed(1)})`);const a=o("game_engine.adventurer_accepts_offer",{itemName:o("items_and_rooms."+n.id)});return{choice:n,reason:a}}function ge(i,e){const{flowState:t,hp:s,maxHp:n,inventory:a,traits:r}=i,l=s/n;if(a.potions.length===0)return"attack";let d=.5;switch(t){case _.Anxiety:case _.Worry:d=.8;break;case _.Arousal:case _.Flow:d=.6;break;case _.Control:case _.Relaxation:d=.4;break;case _.Boredom:case _.Apathy:d=.2;break}return d-=r.resilience/200,l<Math.max(.1,d)?"use_potion":"attack"}function _e(i,e,t){if(e){i.lootHistory.push(e.id),i.lootHistory.filter(a=>a===e.id).length>2&&(i.modifyChallenge(i.challenge-Q),i.logger.info("info_repetitive_choice",{name:o("items_and_rooms."+e.id)}));const n=X(i,e);n>60?(i.modifySkill(10),i.modifyChallenge(i.challenge+5)):n>30?(i.modifySkill(5),i.modifyChallenge(i.challenge+2)):i.modifySkill(2)}else t.length>0?i.modifyChallenge(i.challenge-5):i.modifyChallenge(i.challenge-10);i.updateFlowState()}function ve(i,e){i.roomHistory.push(e.id),i.roomHistory.filter(n=>n===e.id).length>2&&(i.modifyChallenge(i.challenge-Q),i.logger.info("info_deja_vu",{name:o("items_and_rooms."+e.id)}));let s=0;switch(e.type){case"room_enemy":s=5;break;case"room_boss":s=15;break;case"room_trap":s=10;break;case"room_healing":s=-15;break}i.modifyChallenge(i.challenge+s),i.updateFlowState()}function be(i){i.modifySkill(-2),i.updateFlowState()}function A(i,e){switch(e){case"hit":i.modifySkill(.5);break;case"miss":i.modifySkill(-.5);break;case"take_damage":i.modifyChallenge(i.challenge+1);break}i.updateFlowState()}function ye(i,e,t,s){let n;return e>.7?(n=o("game_engine.too_close_for_comfort"),i.modifyChallenge(i.challenge+10),i.modifySkill(-3)):e>.4?(n=o("game_engine.great_battle"),i.modifyChallenge(i.challenge+5),i.modifySkill(5)):t>3&&i.traits.offense>60?(n=o("game_engine.easy_fight"),i.modifyChallenge(i.challenge-10)):(n=o("game_engine.worthy_challenge"),i.modifyChallenge(i.challenge-2),i.modifySkill(2)),t===s&&i.modifySkill(1*t),i.updateFlowState(),n}class Se{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=n=>{this.metaManager.incrementAdventurers();const a={offense:S.nextInt(10,90),resilience:S.nextInt(10,90),skill:0},r=k.getInstance();r.loadEntries([]);const l=new C(a,this._allNames),d=(n==null?void 0:n.items)||this._allItems.filter(v=>v.cost===null).map(v=>v.id),u=B(d,this._allItems,G),m=this._getHandSize(),h=u.slice(0,m),f=u.slice(m),p=(n==null?void 0:n.rooms)||this._allRooms.filter(v=>v.cost===null).map(v=>v.id),c=z(p,this._allRooms,this._getRoomDeckSize()),g=c.slice(0,m),b=c.slice(m);r.info("info_new_adventurer",{fullName:`${l.firstName} ${l.lastName}`,id:this.metaManager.metaState.adventurers.toString()}),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:d,availableDeck:f,hand:h,unlockedRoomDeck:p,availableRoomDeck:b,roomHand:g,handSize:m,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:o("game_engine.new_adventurer"),logger:r,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState.logger.debug(`Deck size: ${u.length}, Hand size: ${m}, Room Deck size: ${c.length}, Room Hand size: ${g.length}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const n=this.gameSaver.load();n?(this.gameState=n,this._emit("state-change",this.gameState)):this.startNewGame()},this.startNewRun=n=>{if(!this.gameState)return;const a=n||this.gameState.run+1;this.metaManager.updateRun(a);const r=this._getHandSize(),l=B(this.gameState.unlockedDeck,this._allItems,G),d=l.slice(0,r),u=l.slice(r),m=z(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),h=m.slice(0,r),f=m.slice(r),p=new C(this.gameState.adventurer.traits,this._allNames);p.skill=this.gameState.adventurer.skill,p.challengeHistory=[...this.gameState.adventurer.challengeHistory],p.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info("info_adventurer_returns"),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:p,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:u,hand:d,availableRoomDeck:f,roomHand:h,handSize:r,room:1,run:a,feedback:o("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const a=this.gameState.hand.filter(v=>n.includes(v.instanceId));this.gameState.offeredLoot=a;const r=this.gameState.adventurer,{choice:l,reason:d}=fe(r,this.gameState.offeredLoot,this.gameState.logger);_e(r,l,this.gameState.offeredLoot),l&&this.gameState.logger.info("info_item_chosen",{name:r.firstName,item:o("items_and_rooms."+l.id)});let u=this.gameState.hand,m=this.gameState.availableDeck;u.forEach(v=>v.justDrafted=!1);let h=u.filter(v=>!n.includes(v.instanceId));const f=this.gameState.handSize-h.length,p=m.slice(0,f);p.forEach(v=>{v.draftedRoom=this.gameState.room,v.justDrafted=!0});const c=m.slice(f);h.push(...p),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const g=this.gameState.room+1,b=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:d,availableDeck:c,hand:h,room:g,designer:{balancePoints:b}},this._emit("state-change",this.gameState)},this.runEncounter=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=n;const a=S.nextInt(0,this.gameState.offeredRooms.length-1),r=this.gameState.offeredRooms[a],{log:l,finalAdventurer:d,feedback:u}=this._generateEncounterLog(this.gameState.adventurer,r),m={room:r,log:l,finalAdventurer:d,feedback:u};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT"},this._emit("state-change",this.gameState),this._emit("show-encounter",m)},this.continueEncounter=n=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate(n.finalAdventurer,n.feedback)},this._postEncounterUpdate=(n,a)=>{if(!this.gameState)return;let r=n;r.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let l=this.gameState.roomHand,d=this.gameState.availableRoomDeck;l.forEach(c=>c.justDrafted=!1);const u=this.gameState.offeredRooms.map(c=>c.instanceId);let m=l.filter(c=>!u.includes(c.instanceId));const h=this.gameState.handSize-m.length,f=d.slice(0,h);f.forEach(c=>{c.draftedRoom=this.gameState.room,c.justDrafted=!0});const p=d.slice(h);if(m.push(...f),this.gameState.adventurer=r,r.hp<=0){this._endRun(o("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(r.boredomCounter>2){const c=r.flowState===_.Boredom?o("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):o("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(c);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("warn_empty_hand"),a.push(o("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:a,encounter:void 0,roomHand:m,availableRoomDeck:p}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:a,encounter:void 0,roomHand:m,availableRoomDeck:p},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(o("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("info_entering_workshop",{name:this.gameState.adventurer.firstName}),!this.metaManager.acls.has(w.WORKSHOP)){this.gameState.logger.info("info_workshop_not_unlocked"),this.startNewRun();return}const n=this.gameState.run+1,a=this._allItems.filter(d=>d.cost!==null).filter(d=>!this.gameState.unlockedDeck.includes(d.id)),r=this._allRooms.filter(d=>d.cost!==null).filter(d=>!this.gameState.unlockedRoomDeck.includes(d.id)),l=[...a,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:n,room:0,shopItems:V(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:o("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=n=>{if(!this.gameState)return;const a=this._allItems.find(c=>c.id===n),r=this._allRooms.find(c=>c.id===n),l=a||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let d=this.gameState.unlockedDeck,u=this.gameState.unlockedRoomDeck,m=this.gameState.availableDeck,h=this.gameState.availableRoomDeck;a?(d=[...this.gameState.unlockedDeck,n],this.isWorkshopAccessUnlocked()&&(m=[a,...this.gameState.availableDeck])):r&&(u=[...this.gameState.unlockedRoomDeck,n],this.isWorkshopAccessUnlocked()&&(h=[r,...this.gameState.availableRoomDeck]));const f=this.gameState.designer.balancePoints-l.cost,p=this.gameState.shopItems.filter(c=>c.id!==n);this.gameState.logger.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:o("items_and_rooms."+l.id)}),this.gameState={...this.gameState,designer:{balancePoints:f},unlockedDeck:d,unlockedRoomDeck:u,availableDeck:m,availableRoomDeck:h,shopItems:p},this._emit("state-change",this.gameState)},this.quitGame=(n=!0)=>{n&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(w.BP_MULTIPLIER_2)?L*4:this.metaManager.acls.has(w.BP_MULTIPLIER)?L*2:L,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(n=>n(...t))}_createAdventurerSnapshot(e){return{hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var r;const s=[],n=[],a=C.fromJSON(e.toJSON());switch(ve(a,t),s.push({messageKey:"info_encounter",replacements:{name:a.firstName,roomName:o("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(a)}),t.type){case"room_enemy":case"room_boss":{const l={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let d=0;const u=a.hp;for(let p=0;p<l.enemyCount;p++){let c=l.enemyHp;const g={currentHp:c,maxHp:l.enemyHp,power:l.enemyPower,name:o("items_and_rooms."+t.id),count:p+1,total:l.enemyCount};for(s.push({messageKey:"info_encounter_enemy",replacements:{name:a.firstName,current:p+1,total:l.enemyCount},adventurer:this._createAdventurerSnapshot(a),enemy:g});c>0&&a.hp>0;){if(ge(a)==="use_potion"){const y=a.inventory.potions.shift();if(y){const x=y.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+x),n.push(o("game_engine.adventurer_drinks_potion",{potionName:o("items_and_rooms."+y.id)})),s.push({messageKey:"info_adventurer_drinks_potion",replacements:{name:a.firstName,potionName:o("items_and_rooms."+y.id)},adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}})}}else{const y=Math.min(.95,.75+a.traits.skill/500+a.traits.offense/1e3);if(S.nextFloat()<y){const x=a.power;c-=x,A(a,"hit"),s.push({messageKey:"info_adventurer_hit",replacements:{damage:x},adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}})}else A(a,"miss"),s.push({messageKey:"info_adventurer_miss",adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}})}if(c<=0){d++,s.push({messageKey:"info_enemy_defeated",adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:0}});break}const v=Math.max(.4,.75-a.traits.skill/500-(100-a.traits.offense)/1e3);if(S.nextFloat()<v){const y=(((r=a.inventory.armor)==null?void 0:r.stats.maxHp)||0)/10,x=Math.max(1,l.enemyPower-y);a.hp-=x,A(a,"take_damage"),s.push({messageKey:"info_enemy_hit",replacements:{damage:x},adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}})}else s.push({messageKey:"info_enemy_miss",adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}})}if(a.hp<=0){s.push({messageKey:"info_adventurer_defeated",adventurer:this._createAdventurerSnapshot(a),enemy:{...g,currentHp:c}});break}}const h=(u-a.hp)/a.maxHp,f=ye(a,h,d,l.enemyCount);n.push(f);break}case"room_healing":{const l=t.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+l),n.push(o("game_engine.healing_room",{name:o("items_and_rooms."+t.id),healing:l})),s.push({messageKey:"info_healing_room",replacements:{name:a.firstName,healingRoomName:o("items_and_rooms."+t.id),healing:l},adventurer:this._createAdventurerSnapshot(a)});break}case"room_trap":{const l=t.stats.attack||0;a.hp-=l,be(a),n.push(o("game_engine.trap_room",{name:o("items_and_rooms."+t.id),damage:l})),s.push({messageKey:"info_trap_room",replacements:{name:a.firstName,trapName:o("items_and_rooms."+t.id),damage:l},adventurer:this._createAdventurerSnapshot(a)});break}}return{log:s,finalAdventurer:a,feedback:n}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),this.gameState.logger.error("info_game_over",{reason:e});const n=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:n},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:n,offense:a}=t,r=Math.min(s/100,1);if(e===_.Flow)return"continue";let l=.55;switch(e){case _.Anxiety:l+=.25-n/400;break;case _.Arousal:l-=.1-a/1e3;break;case _.Worry:l+=.2;break;case _.Control:l-=.15;break;case _.Relaxation:l+=.1;break;case _.Boredom:l+=.3;break;case _.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),S.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:S.nextInt(10,90),resilience:S.nextInt(10,90),skill:0},t=k.getInstance(),s=new C(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(w.HAND_SIZE_INCREASE)?12:pe}_getRoomDeckSize(){return this.metaManager.acls.has(w.ROOM_DECK_SIZE_INCREASE)?36:me}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(w.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(w.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||o("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class R{constructor(e,t,s,n){this.resolve=n;const a=document.createElement("div");a.dataset.testid="info-modal-overlay",Object.assign(a.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),a.addEventListener("click",g=>{if(g.target===a){const b=s.find(v=>typeof v.value=="boolean"&&v.value===!1);b&&this.dismiss(b.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const d=document.createElement("div");d.id="info-modal-title",d.className="title-bar-text",d.textContent=e,l.appendChild(d),r.appendChild(l);const u=document.createElement("div");u.className="window-body text-center p-4";const m=document.createElement("div");m.innerHTML=t,u.appendChild(m);const h=document.createElement("div");h.className="flex justify-center gap-2 mt-4",s.forEach(g=>{const b=document.createElement("button");b.textContent=g.text,b.addEventListener("click",()=>{this.dismiss(g.value)}),h.appendChild(b)}),u.appendChild(h),r.appendChild(u),a.appendChild(r),document.body.appendChild(a),this.handleKeydown=g=>{if(g.key==="Escape"){const b=s.find(v=>typeof v.value=="boolean"&&v.value===!1);b&&this.dismiss(b.value)}},document.addEventListener("keydown",this.handleKeydown);const f=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),p=f[0],c=f[f.length-1];p==null||p.focus(),r.addEventListener("keydown",g=>{g.key==="Tab"&&(g.shiftKey?document.activeElement===p&&(c.focus(),g.preventDefault()):document.activeElement===c&&(p.focus(),g.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(n=>{new R(e,t,s,n)})}static showInfo(e,t,s=o("global.continue")){const n=[{text:s,value:void 0}];return R.show(e,t,n)}}class O{static show(e,t){const s=[{text:o("global.cancel"),value:!1,variant:"secondary"},{text:o("global.confirm"),value:!0,variant:"primary"}];return R.show(e,t,s)}}const we=`<div class="w-full p-4 md:p-6 lg:p-8">
  <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
    <!-- Left Column Window -->
    <div class="lg:col-span-3 space-y-6">
      <div class="window">
        <div class="title-bar">
          <div id="game-title" class="title-bar-text"></div>
          <div class="title-bar-controls">
            <button aria-label="Close" id="quit-game-btn"></button>
          </div>
        </div>
        <div class="window-body space-y-4">
          <game-stats></game-stats>
          <log-panel></log-panel>
        </div>
      </div>
    </div>

    <!-- Right Column Window -->
    <div class="lg:col-span-2 space-y-6">
      <div class="window">
        <div class="title-bar">
          <div id="adventurer-status-title" class="title-bar-text"></div>
        </div>
        <div class="window-body">
          <adventurer-status></adventurer-status>
        </div>
        <feedback-panel></feedback-panel>
      </div>
    </div>

    <!-- Bottom Panel Window -->
    <div class="lg:col-span-5">
      <div class="window">
        <div class="title-bar">
          <div id="game-phase-title" class="title-bar-text"></div>
        </div>
        <div id="game-phase-panel" class="window-body"></div>
      </div>
    </div>
  </div>
</div>`,U=(i,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=i.hand,s.deckType="item",s.offerImpossible=le(i)):(s.choices=i.roomHand,s.deckType="room",s.roomSelectionImpossible=re(i)),s},ke=(i,e,t)=>{var m;if(!i.querySelector("adventurer-status")){i.innerHTML=we;const h=i.querySelector("#game-title");h&&(h.textContent=o("game_title"));const f=i.querySelector("#adventurer-status-title");f&&(f.textContent=o("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(m=i.querySelector("#quit-game-btn"))==null||m.addEventListener("click",async()=>{await O.show(o("global.quit"),o("global.quit_confirm"))&&t.quitGame(!1)})}const s=i.querySelector("adventurer-status"),n=i.querySelector("log-panel"),a=i.querySelector("game-stats"),r=i.querySelector("feedback-panel"),l=i.querySelector("#game-phase-panel"),d=i.querySelector("#game-phase-title");s.metaState=t.metaManager.metaState,s.adventurer=e.adventurer,a.engine=t,t.isWorkshopUnlocked()?a.setAttribute("balance-points",e.designer.balancePoints.toString()):a.removeAttribute("balance-points"),a.setAttribute("run",e.run.toString()),a.setAttribute("room",e.room.toString()),a.setAttribute("deck-size",e.availableDeck.length.toString()),a.setAttribute("room-deck-size",e.availableRoomDeck.length.toString());const u=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;switch(r.setAttribute("message",u),n.logger=e.logger,n.traits=e.adventurer.traits,l.innerHTML="",e.phase){case"RUN_OVER":{d&&(d.textContent=o("run_ended_screen.run_complete"));const h=document.createElement("run-ended-screen");h.setAttribute("final-bp",e.designer.balancePoints.toString()),h.setAttribute("reason",e.runEnded.reason),h.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&h.setAttribute("workshop-unlocked",""),e.runEnded.decision&&h.initialize(e.runEnded.decision,e.newlyUnlocked,t),l.appendChild(h);break}case"DESIGNER_CHOOSING_LOOT":d&&(d.textContent=o("choice_panel.title")),l.appendChild(U(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":d&&(d.textContent=o("choice_panel.title_room")),l.appendChild(U(e,t,"room"));break;default:d&&(d.textContent="...");break}},xe=(i,e)=>{i.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,i.appendChild(t)},Ee=(i,e,t)=>{i.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,i.appendChild(s)},Ie=(i,e,t)=>{if(!e){i.innerHTML=`<div>${o("global.loading")}</div>`;return}switch(e.phase){case"MENU":xe(i,t);break;case"SHOP":Ee(i,e,t);break;default:ke(i,e,t);break}};function Ce(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const j="rogue-steward-meta";class $e{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of Y)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(j);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(j,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const H="rogue-steward-savegame",M="1.0.1";class Re{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(H,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(H);if(e){const t=JSON.parse(e);return t.version!==M?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${M}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(H)!==null}clear(){this.storage.removeItem(H)}_serialize(e){const{adventurer:t,logger:s,...n}=e;return{version:M,...n,adventurer:t.toJSON(),logger:s.toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...n}=e,a=k.getInstance();a.loadEntries(s.entries);const r=C.fromJSON(t,a),{version:l,...d}=n;return{...d,adventurer:r,logger:a}}}class Te{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class He{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Le=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Me=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',De=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class Pe extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,s;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(s=this._metaState)==null?void 0:s.unlockedFeatures.includes(w.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${o("adventurer_status.flow_state")}</legend>
              <div id="flow-state-text" class="font-mono text-xl text-center"></div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Le()} <span>${o("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${Ae()} <span class="ml-1">${o("global.power")}</span></div>
                    <span id="power-text" class="font-mono text-lg"></span>
                </div>
            </div>

            <fieldset id="traits-section" class="${e?"":"hidden"} mt-2">
                <legend>${o("adventurer_status.traits",{defaultValue:"Traits"})}</legend>
                <div class="flex justify-around text-center">
                    <div>
                        <span class="block text-xs">${o("log_panel.offense")}</span>
                        <span id="offense-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${o("log_panel.resilience")}</span>
                        <span id="resilience-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${o("log_panel.skill")}</span>
                        <span id="skill-trait" class="font-mono"></span>
                    </div>
                </div>
            </fieldset>

            <fieldset class="mt-2">
                <legend>${o("adventurer_status.inventory")}</legend>
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div id="weapon-slot" class="sunken-panel p-1"></div>
                    <div id="armor-slot" class="sunken-panel p-1"></div>
                    <div id="buffs-slot" class="sunken-panel p-1"></div>
                    <div id="potions-slot" class="sunken-panel p-1"></div>
                </div>
            </fieldset>
        `,this._hasRendered=!0}update(){var d;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const s=this.querySelector("#flow-state-text"),n=_[this._adventurer.flowState];s.textContent=o(`flow_states.${n}`),s.className=`font-mono text-xl text-center ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s);const a=this.querySelector("#power-text");a.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(a);const r=(d=this._metaState)==null?void 0:d.unlockedFeatures.includes(w.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(r){l.classList.remove("hidden");const u=this.querySelector("#offense-trait"),m=this.querySelector("#resilience-trait"),h=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(u),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(m),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(h),u.textContent=`${this._adventurer.traits.offense}`,m.textContent=`${this._adventurer.traits.resilience}`,h.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Me(),o("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${o("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${o("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${o("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("armor-slot",Ne(),o("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${o("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${o("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${o("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Oe(),o("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(u=>`
            <div class="text-xs">
                <p>${o("items_and_rooms."+u.id)} (${o("global.duration")}: ${u.stats.duration})</p>
                <p>${Object.entries(u.stats).filter(([m])=>m!=="duration").map(([m,h])=>`${o(`global.${m}`)}: ${h}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("potions-slot",De(),o("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${o("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${o("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-pulse-once"),e.addEventListener("animationend",()=>{e.classList.remove("animate-pulse-once")},{once:!0}))}updateInventorySlot(e,t,s,n){const a=this.querySelector(`#${e}`);a.dataset.content!==n&&(a.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${n}
                </div>
            `,a.dataset.content=n)}getFlowStateColor(e){switch(e){case _.Boredom:case _.Apathy:return"text-red-500";case _.Anxiety:case _.Worry:return"text-orange-500";case _.Arousal:case _.Control:case _.Relaxation:return"text-blue";case _.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",Pe);class qe extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",qe);class Be extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=Y.find(n=>n.feature===this.newlyUnlocked[0]);if(!e)return;const t=o("unlocks.title"),s=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await R.showInfo(t,s,o("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const s=this.querySelector("#decision-container");s&&(s.innerHTML=`<p>${o("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||o("run_ended_screen.default_reason");this.innerHTML=`
            <style>
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { opacity: 0; animation: fade-in-up 0.5s ease-out forwards; }
                @keyframes dots {
                    0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
                    40% { color: initial; text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
                    60% { text-shadow: .25em 0 0 initial, .5em 0 0 rgba(0,0,0,0); }
                    80%, 100% { text-shadow: .25em 0 0 initial, .5em 0 0 initial; }
                }
                .animate-dots::after { content: '...'; animation: dots 1.5s infinite; }
            </style>
            <div class="p-4">
                <p class="text-center mb-4">${e}</p>
                <div id="decision-container" class="text-center h-24 flex flex-col justify-center items-center">
                    <p>${o("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let n="",a="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(n=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${o("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.continue_decision")}</p>
            `,a=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${o(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(n=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${o("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,a=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${o("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=n,s.innerHTML=a}}customElements.define("run-ended-screen",Be);class ze extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="status-bar">

                ${this._balancePoints!==null?`
                <p class="status-bar-field">
                    <span class="text-xs">${o("global.bp")}: ${this._balancePoints}</span>
                </p>
                `:""}
                <p class="status-bar-field">
                    <span class="text-xs">${o("global.run")}: ${this._run}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${o("global.room")}: ${this._room}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${o("global.deck")}: ${this._deckSize}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${o("global.rooms")}: ${this._roomDeckSize}</span>
                </p>

                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                    <button id="enter-workshop-btn">${o("global.workshop")}</button>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",ze);class Ge extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const s=this.querySelector("#log-container");if(s){const n=document.createElement("p");n.className=this._getLogColor(e.level),n.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,s.appendChild(n)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const n=t.map((a,r)=>`<p class="${this._getLogColor(a.level)}">[${r.toString().padStart(3,"0")}] ${a.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${n}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let n=this._renderedLogCount;n<t.length;n++)this._appendEntry(t[n],n);this._renderedLogCount=t.length}const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",Ge);const Ue={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},I=(i,e,t=!0,s=1)=>{const n=t?"text-green-600":"text-red-400",a=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${n}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${i}${s>1?o("global.units"):""}</span>
            <span class="font-mono">${a}${e}</span>
        </div>
    `};class je extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const s=this.querySelector('input[type="checkbox"]');s&&!s.disabled&&(s.checked=!s.checked,s.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Ue[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",s=`card-checkbox-${this._item.instanceId}`;let n="";this._isSelectable&&(this._isDisabled?n="opacity-50 cursor-not-allowed":n="cursor-pointer");const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${n} ${a}`;let r=o("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const u=this._item,m=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${u.stats.hp?I(o("global.health"),u.stats.hp,u.stats.hp>0):""}
            ${u.stats.maxHp?I(o("global.max_hp"),u.stats.maxHp,u.stats.maxHp>0):""}
            ${u.stats.power?I(o("global.power"),u.stats.power,u.stats.power>0):""}
            ${u.stats.duration?I(o("global.duration"),u.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${m.stats.hp?I(o("global.health"),m.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${m.stats.attack?I(o("global.attack"),m.stats.attack,!1,m.units):""}
            ${m.stats.hp?I(o("global.health"),m.stats.hp,!1,m.units):""}
          `,m.units>1&&(r=o("choice_panel.multiple_enemies_title",{name:r,count:m.units}));break}}this._stackCount>1&&(r=o("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const d=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${d} flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${o("card_types."+this._item.type)} - ${o("rarity."+this._item.rarity)}</legend>
        <div class="p-2">
            <p class="font-bold text-sm ${e}">${r}</p>
            <div class="mt-2">
                ${l}
            </div>
            ${this._isSelectable&&!this._purchaseInfo?`
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${s}" ${this._isSelected?"checked":""} ${this._isDisabled?"disabled":""}>
              <label for="${s}" class="ml-2 text-sm">${o("card.select")}</label>
            </div>
            `:""}
            ${this._purchaseInfo?`
            <div class="mt-4 text-center">
                <button
                    data-item-id="${this._item.id}"
                    ${this._purchaseInfo.canAfford?"":"disabled"}
                    class="w-full"
                >
                    ${o("global.buy")} (${this._purchaseInfo.cost} ${o("global.bp")})
                </button>
            </div>
            `:""}
        </div>
      </fieldset>
    `}}customElements.define("choice-card",je);const N=4;class Ke extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(n=>this._selectedIds.includes(n.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(n=>n.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const n=t.type==="room_boss";if(s)this._selectedIds=this._selectedIds.filter(a=>a!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");n&&this._selectedIds.length===0?this._selectedIds.push(e):!n&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);a.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!a.includes(l)):this._selectedIds.length<N&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(f=>f.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const f=e.map(p=>{const c=document.createElement("choice-card");return c.item=p,c.isSelectable=!1,c.outerHTML}).join("");R.show(o("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 cards-container">${f}</div>`,[{text:o("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(p=>p.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},n={enemy:0,trap:1,healing:2,boss:3};let a=[...this._choices];this._deckType==="item"?a.sort((f,p)=>{const c=s[f.type]-s[p.type];if(c!==0)return c;const g=t[f.rarity]||0,b=t[p.rarity]||0;return g-b}):a.sort((f,p)=>{const c=f,g=p,b=n[c.type]-n[g.type];if(b!==0)return b;const v=c.stats.hp||0,y=g.stats.hp||0;if(v!==y)return y-v;const x=c.stats.attack||0;return(g.stats.attack||0)-x});const r=this._deckType==="room";let l;if(r)l=a;else{const f=new Map;a.forEach(p=>{const c=p;f.has(c.id)?f.get(c.id).count++:f.set(c.id,{choice:c,count:1})}),l=Array.from(f.values()).map(p=>({...p.choice,stackCount:p.count}))}o(r?"choice_panel.title_room":"choice_panel.title");let d=o(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?d=o("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(d=o("choice_panel.roll_credits"));let u=!1,m=d;this._offerImpossible||this._roomSelectionImpossible?u=!0:r?this._choices.filter(c=>this._selectedIds.includes(c.instanceId)).some(c=>c.type==="room_boss")?(u=this._selectedIds.length===1,m=`${d} (1/1)`):(u=this._selectedIds.length===3,m=`${d} (${this._selectedIds.length}/3)`):(u=this._selectedIds.length>=2&&this._selectedIds.length<=N,m=`${d} (${this._selectedIds.length}/${N})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!u||this._disabled?"disabled":""}>
                    ${m}
                </button>
            </div>
        </div>
    `;const h=this.querySelector("#loot-card-container");h&&l.forEach(f=>{const p=document.createElement("choice-card");p.item=f,"stackCount"in f&&(p.stackCount=f.stackCount),p.isSelected=this._selectedIds.includes(f.instanceId);let c=this._disabled;if(this._offerImpossible)c=!0;else if(r){const g=this._choices.filter(v=>this._selectedIds.includes(v.instanceId)),b=g.some(v=>v.type==="room_boss");p.isSelected?c=!1:(b||f.type==="room_boss"&&g.length>0||g.length>=3)&&(c=!0)}else{const g=new Map(this._choices.map(y=>[y.instanceId,y.id])),b=this._selectedIds.map(y=>g.get(y));c=!p.isSelected&&b.includes(f.id)||this._disabled}p.isDisabled=c,p.isNewlyDrafted=f.justDrafted&&this._initialRender||!1,h.appendChild(p)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ke);class We extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
      <div class="window max-w-800">
        <div class="title-bar">
          <div class="title-bar-text">${o("workshop.title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-brand-text-muted">${o("workshop.description")}</p>
          <p class="text-center mt-4 text-2xl">
            ${o("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" id="item-cards">
            ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${o("workshop.no_new_items")}</p>`:""}
          </div>

          <div class="text-center">
            <button id="start-run-button">
              ${o("workshop.begin_next_run")}
            </button>
          </div>
        </div>
      </div>
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const s=document.createElement("choice-card");s.item=t,s.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(s)}}}}customElements.define("workshop-screen",We);class Fe extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await O.show(o("menu.new_game"),o("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await O.show(o("menu.reset_save"),o("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(t){const n=e.adventurers||0;s=`
        <fieldset class="mt-4 text-center">
          <legend>Progress</legend>
          <p>
            ${o("menu.max_runs",{count:e.highestRun})} | ${o("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${o("menu.adventurer_count",{count:n})}
          </p>
        </fieldset>
      `}this.innerHTML=`
      <div class="window" style="width: 400px;">
        <div class="title-bar">
          <div class="title-bar-text">${o("game_title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-xl mb-4">${o("game_subtitle")}</p>

          ${s}

          <div class="mt-4 space-y-2 flex flex-col items-center">
            ${t?`
              <button id="continue-game-button" style="width: 250px;">
                ${o("menu.continue_game")}
              </button>
            `:""}
            <button id="new-game-button" style="width: 250px;">
              ${o("menu.new_game")}
            </button>
            ${t?`
              <button id="reset-game-button" style="width: 250px;">
                ${o("menu.reset_save")}
              </button>
            `:""}
          </div>
        </div>
        <div class="status-bar">
          <p class="status-bar-field">v0.0.0</p>
          <p class="status-bar-field">build 130</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Fe);class Ze extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2000;
                pointer-events: none;
                --x-px: 16px;
                --y-px: 8px;
                --b-px: 1px;
                --bg-color: #ffffe1;
                --border-color: #000;
                --text-color: #000;
                max-width: 350px;
                font-family: 'Pixelated MS Sans Serif', sans-serif;
                font-size: 11px;
            }

            :host(.show) {
              display: block;
            }

            .content-container {
                position: relative;
                padding: var(--y-px) var(--x-px);
                background-color: var(--bg-color);
                border: var(--b-px) solid var(--border-color);
                color: var(--text-color);
                border-radius: 15px;
            }

            .content-container::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px 10px 0 10px;
                border-color: var(--border-color) transparent transparent transparent;
                bottom: -10px;
                left: calc(50% - 10px);
            }

            .content-container::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px 10px 0 10px;
                border-color: var(--bg-color) transparent transparent transparent;
                bottom: calc(-10px + var(--b-px));
                left: calc(50% - 10px);
                z-index: 1;
            }

            h3 {
                margin-top: 0;
                font-weight: bold;
                margin-bottom: 8px;
                font-size: 13px;
            }

            /* Mobile styles */
            @media (pointer: coarse) {
                :host {
                    max-width: none;
                    font-family: inherit;
                    font-size: 1.125rem;
                    filter: none;
                }

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
                }

                .content-container {
                    padding: 1.5rem;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    margin: 1rem;
                }

                .content-container::after, .content-container::before {
                    display: none;
                }

                h3 {
                    font-size: 1.5rem;
                    text-align: center;
                }
            }
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t,s){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show")}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ze);const D=1500,Ve=800;class P{constructor(e,t){this.currentEventIndex=0,this.onDismiss=t,this.payload=e;const s=document.createElement("div");Object.assign(s.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"});const n=document.createElement("div");this.element=n,n.className="window",n.style.width="min(95vw, 600px)",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-labelledby","encounter-modal-title");const a=document.createElement("div");a.className="title-bar";const r=document.createElement("div");r.id="encounter-modal-title",r.className="title-bar-text",a.appendChild(r),n.appendChild(a);const l=document.createElement("div");l.className="window-body p-2",l.innerHTML=this.renderInitialView(),n.appendChild(l),s.appendChild(n),document.body.appendChild(s),r.textContent=o("items_and_rooms."+e.room.id),this.element.querySelector("#skip-button").addEventListener("click",()=>{this.dismiss(!0)}),this.start()}start(){this.payload.room.type==="room_healing"||this.payload.room.type==="room_trap"?this.renderRoomChoiceView():this.renderBattleView()}renderInitialView(){return`
      <div id="adventurer-status-container" class="hidden">...</div>
      <div id="enemy-status-container" class="hidden">...</div>
      <div id="room-choice-container" class="hidden text-center p-4">...</div>
      <div class="sunken-panel-tl mt-2 p-1" style="height: 60px;">
        <p id="event-message" class="text-center"></p>
      </div>
      <div id="progress-container" class="hidden mt-2">
        <div class="progress-bar" style="width: 100%">
          <div id="progress-indicator" style="width: 0%"></div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button id="skip-button"></button>
      </div>
    `}renderRoomChoiceView(){const e=this.element.querySelector("#room-choice-container"),t=this.element.querySelector("#event-message"),s=this.element.querySelector("#skip-button");e.classList.remove("hidden");const n=this.payload.log[0];t.textContent=o(n.messageKey,n.replacements);const a=this.payload.log[1];a?setTimeout(()=>{t.textContent=o(a.messageKey,a.replacements),s.textContent=o("global.continue"),setTimeout(()=>this.dismiss(!1),D)},D):(s.textContent=o("global.continue"),setTimeout(()=>this.dismiss(!1),D))}renderBattleView(){this.element.querySelector("#adventurer-status-container").classList.remove("hidden"),this.element.querySelector("#enemy-status-container").classList.remove("hidden"),this.element.querySelector("#progress-container").classList.remove("hidden"),this.element.querySelector("#skip-button").textContent=o("global.skip"),this.renderNextBattleEvent()}renderNextBattleEvent(){if(this.currentEventIndex>=this.payload.log.length){this.element.querySelector("#skip-button").textContent=o("global.continue");return}const e=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(e.adventurer),e.enemy?this.renderEnemyStatus(e.enemy):this.element.querySelector("#enemy-status-container").innerHTML="",this.element.querySelector("#event-message").textContent=o(e.messageKey,e.replacements),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=setTimeout(()=>this.renderNextBattleEvent(),Ve)}renderAdventurerStatus(e){this.element.querySelector("#adventurer-status-container").innerHTML=`
      <div class="font-bold">${o("global.adventurer")}</div>
      <div>HP: ${e.hp} / ${e.maxHp}</div>
      <div>Power: ${e.power}</div>
    `}renderEnemyStatus(e){this.element.querySelector("#enemy-status-container").innerHTML=`
      <div class.font-bold">${e.name} (${e.count}/${e.total})</div>
      <div>HP: ${e.currentHp} / ${e.maxHp}</div>
      <div>Power: ${e.power}</div>
    `}updateProgressBar(){const e=(this.currentEventIndex+1)/this.payload.log.length;this.element.querySelector("#progress-indicator").style.width=`${e*100}%`}dismiss(e){clearTimeout(this.battleTimeout),this.element.parentElement.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{new P(e,t)})}}customElements.define("encounter-modal",class extends HTMLElement{constructor(){super()}});const Je=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:P},Symbol.toStringTag,{value:"Module"}));class ${constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return $.instance||($.instance=new $),$.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const n=this.getTooltipContent(s);n&&(this.tooltipBox.show(n,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const n=this.getTooltipContent(s);n&&this.tooltipBox.show(n,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=o(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=o(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=o("global.information")),{title:s,body:t}}}const K=$.getInstance(),E=document.getElementById("app");if(!E)throw new Error("Could not find app element to mount to");async function Ye(){E.innerHTML="<div>Initializing...</div>";const i=new He;await ie(i);const e=new Te,t=new $e(e),s=new Re(e),n=new Se(t,i,s);n.on("state-change",a=>{if(n.isLoading){E.innerHTML=`<div>${o("global.loading_game_data")}</div>`;return}if(n.error){E.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${o("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${n.error}</p>
                    </div>
                </div>
            `;return}Ie(E,a,n),Ce()}),n.on("show-encounter",async a=>{const{EncounterModal:r}=await se(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>Je);return{EncounterModal:l}},void 0);await r.show(a),n.continueEncounter(a)}),E.innerHTML=`<div>${o("global.initializing")}</div>`,document.body.addEventListener("mouseover",a=>K.handleMouseEnter(a)),document.body.addEventListener("click",a=>K.handleClick(a)),await n.init(),n.showMenu()}Ye().catch(i=>{console.error(i),E&&(E.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${i.message}</p>
          </div>
      </div>
    `)});
