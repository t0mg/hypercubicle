(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const ue="modulepreload",me=function(a){return"/rogue-steward/"+a},F={},X=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){let r=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=r(t.map(u=>{if(u=me(u),u in F)return;F[u]=!0;const d=u.endsWith(".css"),h=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${h}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":ue,d||(p.as="script"),p.crossOrigin="",p.href=u,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((f,m)=>{p.addEventListener("load",f),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return n.then(r=>{for(const l of r||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};var g=(a=>(a[a.Arousal=0]="Arousal",a[a.Flow=1]="Flow",a[a.Control=2]="Control",a[a.Relaxation=3]="Relaxation",a[a.Boredom=4]="Boredom",a[a.Apathy=5]="Apathy",a[a.Worry=6]="Worry",a[a.Anxiety=7]="Anxiety",a))(g||{});const pe=Object.freeze(Object.defineProperty({__proto__:null,FlowState:g},Symbol.toStringTag,{value:"Module"}));let ee={};async function te(a,e){try{ee=await e.loadJson(`locales/${a}.json`)}catch(t){console.warn(`Failed to load ${a} translations:`,t),a!=="en"&&await te("en",e)}}function fe(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function o(a,e={}){let s=a.split(".").reduce((n,i)=>n?n[i]:void 0,ee);if(!s)return console.warn(`Translation not found for key: ${a}`),a;for(const n in e)s=s.replace(`{${n}}`,String(e[n]));return s}async function ge(a){const e=fe();await te(e,a)}class C{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return C.instance||(C.instance=new C),C.instance}on(e){this.listeners.push(e)}log(e,t="INFO",s){const n=o(`log_messages.${e}`,s),i={message:n,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(i),t!=="DEBUG"&&console.log(`[${t}] ${n}`)),this.listeners.forEach(r=>r(i))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(s=>s(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=C.getInstance();return t.loadEntries(e.entries),t}}class _e{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const k=new _e(Date.now()),se=a=>`${a}_${k.nextFloat().toString(36).substr(2,9)}`,ve=(a,e)=>k.nextInt(a,e),ne=a=>{const e=[...a];for(let t=e.length-1;t>0;t--){const s=k.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},ie=(a,e,t,s)=>{const n=e.filter(h=>a.includes(h.id)),i=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},c={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(h=>{c[h]=Math.floor(t*r[h])});let u=Object.values(c).reduce((h,p)=>h+p,0);for(;u<t;)c.common+=1,u+=1;n.filter(h=>h.cost!==null).forEach(h=>{i.push(s(h)),l[h.rarity]+=1}),Object.keys(r).forEach((h,p)=>{const f=n.filter(m=>m.rarity===h);for(;l[h]<c[h]&&f.length!==0;){const m=k.nextInt(0,f.length-1),_=f[m];i.push(s(_)),l[h]+=1}});const d=n.filter(h=>h.rarity==="common");for(;i.length<t&&d.length>0;){const h=k.nextInt(0,d.length-1),p=d[h];i.push(s(p))}return ne(i)},W=(a,e,t)=>ie(a,e,t,s=>({...s,instanceId:se(s.id)})),Z=(a,e,t)=>ie(a,e,t,n=>{const i={...n,instanceId:se(n.id)};return i.type==="room_enemy"&&i.stats.minUnits&&i.stats.maxUnits&&(i.units=ve(i.stats.minUnits,i.stats.maxUnits)),i}),be=a=>a.roomHand.length<3&&!a.roomHand.some(e=>e.type==="room_boss"),ye=a=>[...new Set(a.hand.map(t=>t.id))].length<2&&a.hand.length>0;function Se(a,e){const t=Math.max(0,Math.min(100,a)),s=Math.max(0,Math.min(100,e));return s>66?t<33?g.Anxiety:t<87?g.Arousal:g.Flow:s>33?t<33?g.Worry:t<67?g.Apathy:g.Control:t<67?g.Boredom:g.Relaxation}const D={hp:100,maxHp:100,power:5},we=3;class L{constructor(e,t){this.hp=D.hp,this.maxHp=D.maxHp,this.power=D.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=g.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=C.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>we&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=Se(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{from:o("flow_states."+g[e]),to:o("flow_states."+g[this.flowState])})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=D.power,s=D.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(n=>{t+=n.stats.power||0,s+=n.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e,t){const s=e.traits,n=new L(s);return n.hp=e.hp,n.maxHp=e.maxHp,n.power=e.power,n.inventory=e.inventory,n.activeBuffs=e.activeBuffs,n.skill=e.skill,n.challengeHistory=e.challengeHistory,n.flowState=e.flowState,n.roomHistory=e.roomHistory,n.lootHistory=e.lootHistory,n.boredomCounter=e.boredomCounter,n.firstName=e.firstName,n.lastName=e.lastName,n}}const ke=99,xe=10,q=10,V=32,Ee=18,Ie=8;var I=(a=>(a.WORKSHOP="workshop",a.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",a.HAND_SIZE_INCREASE="hand_size_increase",a.ADVENTURER_TRAITS="ADVENTURER_TRAITS",a.BP_MULTIPLIER="BP_MULTIPLIER",a.WORKSHOP_ACCESS="WORKSHOP_ACCESS",a.BP_MULTIPLIER_2="BP_MULTIPLIER_2",a))(I||{});const ae=[{feature:"workshop",runThreshold:2,title:()=>o("unlocks.workshop.title"),description:()=>o("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>o("unlocks.room_deck_size_increase.title"),description:()=>o("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>o("unlocks.hand_size_increase.title"),description:()=>o("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>o("unlocks.adventurer_traits.title"),description:()=>o("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>o("unlocks.bp_multiplier.title"),description:()=>o("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>o("unlocks.workshop_access.title"),description:()=>o("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>o("unlocks.bp_multiplier_2.title"),description:()=>o("unlocks.bp_multiplier_2.description")}],oe=10;function re(a,e){var u,d,h,p;const{traits:t,inventory:s,hp:n,maxHp:i}=a;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((u=s.weapon)==null?void 0:u.stats.power)||0,c=((d=s.armor)==null?void 0:d.stats.maxHp)||0;switch(e.type){case"item_weapon":const f=(e.stats.power||0)-l;if(f<=0&&e.id!==((h=s.weapon)==null?void 0:h.id))return-1;r+=f*(t.offense/10),f>0&&(r+=f*(a.skill/10));const m=e.stats.maxHp||0;m<0&&(r+=m*(100-t.resilience)/20);break;case"item_armor":const _=(e.stats.maxHp||0)-c;if(_<=0&&e.id!==((p=s.armor)==null?void 0:p.id))return-1;r+=_*(100-t.offense)/10,_>0&&(r+=_*(a.skill/10));const b=e.stats.power||0;b>0&&(r+=b*(t.offense/15));const v=e.stats.power||0;v<0&&(r+=v*(t.resilience/10));break;case"item_potion":const S=n/i;r+=10*(100-t.resilience)/100,S<.7&&(r+=20*(1-S)),r+=5*(a.skill/100),s.potions.length>=ke&&(r*=.1);break}return r}function Ce(a,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${a.traits.offense}, Resilience: ${a.traits.resilience}, Skill: ${a.skill})`);const s=e.map(r=>({item:r,score:re(a,r)})).filter(r=>r.score>0);if(s.sort((r,l)=>l.score-r.score),s.length===0||s[0].score<xe)return{choice:null,reason:o("game_engine.adventurer_declines_offer")};const n=s[0].item;t.debug(`Adventurer chooses: ${o("items_and_rooms."+n.id)} (Score: ${s[0].score.toFixed(1)})`);const i=o("game_engine.adventurer_accepts_offer",{itemName:o("items_and_rooms."+n.id)});return{choice:n,reason:i}}function $e(a,e){const{flowState:t,hp:s,maxHp:n,inventory:i,traits:r}=a,l=s/n;if(i.potions.length===0)return"attack";let c=.5;switch(t){case g.Anxiety:case g.Worry:c=.8;break;case g.Arousal:case g.Flow:c=.6;break;case g.Control:case g.Relaxation:c=.4;break;case g.Boredom:case g.Apathy:c=.2;break}return c-=r.resilience/200,l<Math.max(.1,c)?"use_potion":"attack"}function Re(a,e,t){if(e){a.lootHistory.push(e.id),a.lootHistory.filter(i=>i===e.id).length>2&&(a.modifyChallenge(a.challenge-oe),a.logger.info("info_repetitive_choice",{name:o("items_and_rooms."+e.id)}));const n=re(a,e);n>60?(a.modifySkill(10),a.modifyChallenge(a.challenge+5)):n>30?(a.modifySkill(5),a.modifyChallenge(a.challenge+2)):a.modifySkill(2)}else t.length>0?a.modifyChallenge(a.challenge-5):a.modifyChallenge(a.challenge-10);a.updateFlowState()}function Te(a,e){a.roomHistory.push(e.id),a.roomHistory.filter(n=>n===e.id).length>2&&(a.modifyChallenge(a.challenge-oe),a.logger.info("info_deja_vu",{name:o("items_and_rooms."+e.id)}));let s=0;switch(e.type){case"room_enemy":s=5;break;case"room_boss":s=15;break;case"room_trap":s=10;break;case"room_healing":s=-15;break}a.modifyChallenge(a.challenge+s),a.updateFlowState()}function Le(a){a.modifySkill(-2),a.updateFlowState()}function B(a,e){switch(e){case"hit":a.modifySkill(.5);break;case"miss":a.modifySkill(-.5);break;case"take_damage":a.modifyChallenge(a.challenge+1);break}a.updateFlowState()}function He(a,e,t,s){let n;return e>.7?(n=o("game_engine.too_close_for_comfort"),a.modifyChallenge(a.challenge+10),a.modifySkill(-3)):e>.4?(n=o("game_engine.great_battle"),a.modifyChallenge(a.challenge+5),a.modifySkill(5)):t>3&&a.traits.offense>60?(n=o("game_engine.easy_fight"),a.modifyChallenge(a.challenge-10)):(n=o("game_engine.worthy_challenge"),a.modifyChallenge(a.challenge-2),a.modifySkill(2)),t===s&&a.modifySkill(1*t),a.updateFlowState(),n}class Ae{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=n=>{this.metaManager.incrementAdventurers();const i={offense:k.nextInt(10,90),resilience:k.nextInt(10,90),skill:0},r=C.getInstance();r.loadEntries([]);const l=new L(i,this._allNames),c=(n==null?void 0:n.items)||this._allItems.filter(v=>v.cost===null).map(v=>v.id),u=W(c,this._allItems,V),d=this._getHandSize(),h=u.slice(0,d),p=u.slice(d),f=(n==null?void 0:n.rooms)||this._allRooms.filter(v=>v.cost===null).map(v=>v.id),m=Z(f,this._allRooms,this._getRoomDeckSize()),_=m.slice(0,d),b=m.slice(d);r.info("info_new_adventurer",{fullName:`${l.firstName} ${l.lastName}`,id:this.metaManager.metaState.adventurers.toString()}),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:c,availableDeck:p,hand:h,unlockedRoomDeck:f,availableRoomDeck:b,roomHand:_,handSize:d,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:o("game_engine.new_adventurer"),logger:r,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState.logger.debug(`Deck size: ${u.length}, Hand size: ${d}, Room Deck size: ${m.length}, Room Hand size: ${_.length}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const n=this.gameSaver.load();n?(this.gameState=n,this._emit("state-change",this.gameState)):this.startNewGame()},this.startNewRun=n=>{if(!this.gameState)return;const i=n||this.gameState.run+1;this.metaManager.updateRun(i);const r=this._getHandSize(),l=W(this.gameState.unlockedDeck,this._allItems,V),c=l.slice(0,r),u=l.slice(r),d=Z(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),h=d.slice(0,r),p=d.slice(r),f=new L(this.gameState.adventurer.traits,this._allNames);f.skill=this.gameState.adventurer.skill,f.challengeHistory=[...this.gameState.adventurer.challengeHistory],f.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info("info_adventurer_returns"),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:f,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:u,hand:c,availableRoomDeck:p,roomHand:h,handSize:r,room:1,run:i,feedback:o("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const i=this.gameState.hand.filter(v=>n.includes(v.instanceId));this.gameState.offeredLoot=i;const r=this.gameState.adventurer,{choice:l,reason:c}=Ce(r,this.gameState.offeredLoot,this.gameState.logger);Re(r,l,this.gameState.offeredLoot),l&&this.gameState.logger.info("info_item_chosen",{name:r.firstName,item:o("items_and_rooms."+l.id)});let u=this.gameState.hand,d=this.gameState.availableDeck;u.forEach(v=>v.justDrafted=!1);let h=u.filter(v=>!n.includes(v.instanceId));const p=this.gameState.handSize-h.length,f=d.slice(0,p);f.forEach(v=>{v.draftedRoom=this.gameState.room,v.justDrafted=!0});const m=d.slice(p);h.push(...f),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const _=this.gameState.room+1,b=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:c,availableDeck:m,hand:h,room:_,designer:{balancePoints:b}},this._emit("state-change",this.gameState)},this.runEncounter=n=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=n;const i=k.nextInt(0,this.gameState.offeredRooms.length-1),r=this.gameState.offeredRooms[i],{log:l,finalAdventurer:c,feedback:u}=this._generateEncounterLog(this.gameState.adventurer,r),d={room:r,log:l,finalAdventurer:c,feedback:u};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT"},this._emit("state-change",this.gameState),this._emit("show-encounter",d)},this.continueEncounter=n=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate(n.finalAdventurer,n.feedback)},this._postEncounterUpdate=(n,i)=>{if(!this.gameState)return;let r=n;r.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let l=this.gameState.roomHand,c=this.gameState.availableRoomDeck;l.forEach(m=>m.justDrafted=!1);const u=this.gameState.offeredRooms.map(m=>m.instanceId);let d=l.filter(m=>!u.includes(m.instanceId));const h=this.gameState.handSize-d.length,p=c.slice(0,h);p.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const f=c.slice(h);if(d.push(...p),this.gameState.adventurer=r,r.hp<=0){this._endRun(o("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(r.boredomCounter>2){const m=r.flowState===g.Boredom?o("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):o("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(m);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("warn_empty_hand"),i.push(o("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:i,encounter:void 0,roomHand:d,availableRoomDeck:f}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:i,encounter:void 0,roomHand:d,availableRoomDeck:f},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(o("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("info_entering_workshop",{name:this.gameState.adventurer.firstName}),!this.metaManager.acls.has(I.WORKSHOP)){this.gameState.logger.info("info_workshop_not_unlocked"),this.startNewRun();return}const n=this.gameState.run+1,i=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),r=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),l=[...i,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:n,room:0,shopItems:ne(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:o("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=n=>{if(!this.gameState)return;const i=this._allItems.find(m=>m.id===n),r=this._allRooms.find(m=>m.id===n),l=i||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let c=this.gameState.unlockedDeck,u=this.gameState.unlockedRoomDeck,d=this.gameState.availableDeck,h=this.gameState.availableRoomDeck;i?(c=[...this.gameState.unlockedDeck,n],this.isWorkshopAccessUnlocked()&&(d=[i,...this.gameState.availableDeck])):r&&(u=[...this.gameState.unlockedRoomDeck,n],this.isWorkshopAccessUnlocked()&&(h=[r,...this.gameState.availableRoomDeck]));const p=this.gameState.designer.balancePoints-l.cost,f=this.gameState.shopItems.filter(m=>m.id!==n);this.gameState.logger.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:o("items_and_rooms."+l.id)}),this.gameState={...this.gameState,designer:{balancePoints:p},unlockedDeck:c,unlockedRoomDeck:u,availableDeck:d,availableRoomDeck:h,shopItems:f},this._emit("state-change",this.gameState)},this.quitGame=(n=!0)=>{n&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(I.BP_MULTIPLIER_2)?q*4:this.metaManager.acls.has(I.BP_MULTIPLIER)?q*2:q,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(n=>n(...t))}_createAdventurerSnapshot(e){return{hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var r,l,c,u,d,h,p,f,m,_,b,v,S;const s=[],n=[],i=L.fromJSON(e.toJSON());switch((r=this.gameState)==null||r.logger.info("info_encounter",{name:i.firstName,roomName:o("items_and_rooms."+t.id)}),Te(i,t),s.push({messageKey:"info_encounter",replacements:{name:i.firstName,roomName:o("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(i)}),t.type){case"room_enemy":case"room_boss":{const y={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let P=0;const ce=i.hp;for(let N=0;N<y.enemyCount;N++){let w=y.enemyHp;(l=this.gameState)==null||l.logger.info("info_encounter_enemy",{name:i.firstName,current:N+1,total:y.enemyCount});const E={currentHp:w,maxHp:y.enemyHp,power:y.enemyPower,name:o("items_and_rooms."+t.id),count:N+1,total:y.enemyCount};for(s.push({messageKey:"info_encounter_enemy",replacements:{name:i.firstName,current:N+1,total:y.enemyCount},adventurer:this._createAdventurerSnapshot(i),enemy:E});w>0&&i.hp>0;){if($e(i)==="use_potion"){const $=i.inventory.potions.shift();if($){const x=$.stats.hp||0;i.hp=Math.min(i.maxHp,i.hp+x),(c=this.gameState)==null||c.logger.info("info_adventurer_drinks_potion",{name:i.firstName,potionName:o("items_and_rooms."+$.id)}),n.push(o("game_engine.adventurer_drinks_potion",{potionName:o("items_and_rooms."+$.id)})),s.push({messageKey:"info_adventurer_drinks_potion",replacements:{name:i.firstName,potionName:o("items_and_rooms."+$.id)},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}})}}else{const $=Math.min(.95,.75+i.traits.skill/500+i.traits.offense/1e3);if(k.nextFloat()<$){const x=i.power;w-=x,(u=this.gameState)==null||u.logger.debug(`Adventurer hits for ${x} damage.`);const M=i.flowState;B(i,"hit"),M!==i.flowState&&s.push({messageKey:"info_flow_state_changed",replacements:{from:o(`flow_states.${g[M].toLowerCase()}`),to:o(`flow_states.${g[i.flowState].toLowerCase()}`)},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}}),s.push({messageKey:"info_adventurer_hit",replacements:{damage:x},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}})}else{(d=this.gameState)==null||d.logger.debug("Adventurer misses.");const x=i.flowState;B(i,"miss"),x!==i.flowState&&s.push({messageKey:"info_flow_state_changed",replacements:{from:o(`flow_states.${g[x].toLowerCase()}`),to:o(`flow_states.${g[i.flowState].toLowerCase()}`)},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}}),s.push({messageKey:"info_adventurer_miss",adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}})}}if(w<=0){(h=this.gameState)==null||h.logger.info("info_enemy_defeated"),P++,s.push({messageKey:"info_enemy_defeated",adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:0}});break}const he=Math.max(.4,.75-i.traits.skill/500-(100-i.traits.offense)/1e3);if(k.nextFloat()<he){const $=(((p=i.inventory.armor)==null?void 0:p.stats.maxHp)||0)/10,x=Math.max(1,y.enemyPower-$);i.hp-=x,(f=this.gameState)==null||f.logger.debug(`Enemy hits for ${x} damage.`);const M=i.flowState;B(i,"take_damage"),M!==i.flowState&&s.push({messageKey:"info_flow_state_changed",replacements:{from:o(`flow_states.${g[M].toLowerCase()}`),to:o(`flow_states.${g[i.flowState].toLowerCase()}`)},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}}),s.push({messageKey:"info_enemy_hit",replacements:{damage:x},adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}})}else(m=this.gameState)==null||m.logger.debug("Enemy misses."),s.push({messageKey:"info_enemy_miss",adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}})}if(i.hp<=0){(_=this.gameState)==null||_.logger.warn("info_adventurer_defeated"),s.push({messageKey:"info_adventurer_defeated",adventurer:this._createAdventurerSnapshot(i),enemy:{...E,currentHp:w}});break}}const K=ce-i.hp,j=K/i.maxHp;(b=this.gameState)==null||b.logger.debug(`hpLost: ${K}, hpLostRatio: ${j.toFixed(2)}`);const de=He(i,j,P,y.enemyCount);n.push(de);break}case"room_healing":{const y=t.stats.hp||0;i.hp=Math.min(i.maxHp,i.hp+y),(v=this.gameState)==null||v.logger.info("info_healing_room",{name:i.firstName,healingRoomName:o("items_and_rooms."+t.id),healing:y}),n.push(o("game_engine.healing_room",{name:o("items_and_rooms."+t.id),healing:y})),s.push({messageKey:"info_healing_room",replacements:{name:i.firstName,healingRoomName:o("items_and_rooms."+t.id),healing:y},adventurer:this._createAdventurerSnapshot(i)});break}case"room_trap":{const y=t.stats.attack||0;i.hp-=y,Le(i),(S=this.gameState)==null||S.logger.info("info_trap_room",{name:i.firstName,trapName:o("items_and_rooms."+t.id),damage:y}),n.push(o("game_engine.trap_room",{name:o("items_and_rooms."+t.id),damage:y})),s.push({messageKey:"info_trap_room",replacements:{name:i.firstName,trapName:o("items_and_rooms."+t.id),damage:y},adventurer:this._createAdventurerSnapshot(i)});break}}return{log:s,finalAdventurer:i,feedback:n}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),this.gameState.logger.error("info_game_over",{reason:e});const n=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:n},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:n,offense:i}=t,r=Math.min(s/100,1);if(e===g.Flow)return"continue";let l=.55;switch(e){case g.Anxiety:l+=.25-n/400;break;case g.Arousal:l-=.1-i/1e3;break;case g.Worry:l+=.2;break;case g.Control:l-=.15;break;case g.Relaxation:l+=.1;break;case g.Boredom:l+=.3;break;case g.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),k.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:k.nextInt(10,90),resilience:k.nextInt(10,90),skill:0},t=C.getInstance(),s=new L(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(I.HAND_SIZE_INCREASE)?12:Ie}_getRoomDeckSize(){return this.metaManager.acls.has(I.ROOM_DECK_SIZE_INCREASE)?36:Ee}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(I.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(I.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||o("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class A{constructor(e,t,s,n){this.resolve=n;const i=document.createElement("div");i.dataset.testid="info-modal-overlay",Object.assign(i.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),i.addEventListener("click",_=>{if(_.target===i){const b=s.find(v=>typeof v.value=="boolean"&&v.value===!1);b&&this.dismiss(b.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const c=document.createElement("div");c.id="info-modal-title",c.className="title-bar-text",c.textContent=e,l.appendChild(c),r.appendChild(l);const u=document.createElement("div");u.className="window-body text-center p-4";const d=document.createElement("div");d.innerHTML=t,u.appendChild(d);const h=document.createElement("div");h.className="flex justify-center gap-2 mt-4",s.forEach(_=>{const b=document.createElement("button");b.textContent=_.text,b.addEventListener("click",()=>{this.dismiss(_.value)}),h.appendChild(b)}),u.appendChild(h),r.appendChild(u),i.appendChild(r),document.body.appendChild(i),this.handleKeydown=_=>{if(_.key==="Escape"){const b=s.find(v=>typeof v.value=="boolean"&&v.value===!1);b&&this.dismiss(b.value)}},document.addEventListener("keydown",this.handleKeydown);const p=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),f=p[0],m=p[p.length-1];f==null||f.focus(),r.addEventListener("keydown",_=>{_.key==="Tab"&&(_.shiftKey?document.activeElement===f&&(m.focus(),_.preventDefault()):document.activeElement===m&&(f.focus(),_.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(n=>{new A(e,t,s,n)})}static showInfo(e,t,s=o("global.continue")){const n=[{text:s,value:void 0}];return A.show(e,t,n)}}class U{static show(e,t){const s=[{text:o("global.cancel"),value:!1,variant:"secondary"},{text:o("global.confirm"),value:!0,variant:"primary"}];return A.show(e,t,s)}}const Ne=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,J=(a,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=a.hand,s.deckType="item",s.offerImpossible=ye(a)):(s.choices=a.roomHand,s.deckType="room",s.roomSelectionImpossible=be(a)),s},Me=(a,e,t)=>{var d;if(!a.querySelector("adventurer-status")){a.innerHTML=Ne;const h=a.querySelector("#game-title");h&&(h.textContent=o("game_title"));const p=a.querySelector("#adventurer-status-title");p&&(p.textContent=o("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(d=a.querySelector("#quit-game-btn"))==null||d.addEventListener("click",async()=>{await U.show(o("global.quit"),o("global.quit_confirm"))&&t.quitGame(!1)})}const s=a.querySelector("adventurer-status"),n=a.querySelector("log-panel"),i=a.querySelector("game-stats"),r=a.querySelector("feedback-panel"),l=a.querySelector("#game-phase-panel"),c=a.querySelector("#game-phase-title");s.metaState=t.metaManager.metaState,s.adventurer=e.adventurer,i.engine=t,t.isWorkshopUnlocked()?i.setAttribute("balance-points",e.designer.balancePoints.toString()):i.removeAttribute("balance-points"),i.setAttribute("run",e.run.toString()),i.setAttribute("room",e.room.toString()),i.setAttribute("deck-size",e.availableDeck.length.toString()),i.setAttribute("room-deck-size",e.availableRoomDeck.length.toString());const u=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;switch(r.setAttribute("message",u),n.logger=e.logger,n.traits=e.adventurer.traits,l.innerHTML="",e.phase){case"RUN_OVER":{c&&(c.textContent=o("run_ended_screen.run_complete"));const h=document.createElement("run-ended-screen");h.setAttribute("final-bp",e.designer.balancePoints.toString()),h.setAttribute("reason",e.runEnded.reason),h.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&h.setAttribute("workshop-unlocked",""),e.runEnded.decision&&h.initialize(e.runEnded.decision,e.newlyUnlocked,t),l.appendChild(h);break}case"DESIGNER_CHOOSING_LOOT":c&&(c.textContent=o("choice_panel.title")),l.appendChild(J(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":c&&(c.textContent=o("choice_panel.title_room")),l.appendChild(J(e,t,"room"));break;default:c&&(c.textContent="...");break}},De=(a,e)=>{a.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,a.appendChild(t)},Oe=(a,e,t)=>{a.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,a.appendChild(s)},Pe=(a,e,t)=>{if(!e){a.innerHTML=`<div>${o("global.loading")}</div>`;return}switch(e.phase){case"MENU":De(a,t);break;case"SHOP":Oe(a,e,t);break;default:Me(a,e,t);break}};function qe(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const Y="rogue-steward-meta";class Be{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of ae)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(Y);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(Y,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const O="rogue-steward-savegame",z="1.0.1";class ze{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(O,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(O);if(e){const t=JSON.parse(e);return t.version!==z?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${z}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(O)!==null}clear(){this.storage.removeItem(O)}_serialize(e){const{adventurer:t,logger:s,...n}=e;return{version:z,...n,adventurer:t.toJSON(),logger:s.toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...n}=e,i=C.getInstance();i.loadEntries(s.entries);const r=L.fromJSON(t,i),{version:l,...c}=n;return{...c,adventurer:r,logger:i}}}class Ge{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Ue{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Ke=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',je=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Fe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',We=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Ze=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Ve=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class Je extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,s;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(s=this._metaState)==null?void 0:s.unlockedFeatures.includes(I.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${o("adventurer_status.flow_state")}</legend>
              <div id="flow-state-text" class="font-mono text-xl text-center"></div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Ke()} <span>${o("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${je()} <span class="ml-1">${o("global.power")}</span></div>
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
        `,this._hasRendered=!0}update(){var c;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const s=this.querySelector("#flow-state-text"),n=g[this._adventurer.flowState];s.textContent=o(`flow_states.${n}`),s.className=`font-mono text-xl text-center ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s);const i=this.querySelector("#power-text");i.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(i);const r=(c=this._metaState)==null?void 0:c.unlockedFeatures.includes(I.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(r){l.classList.remove("hidden");const u=this.querySelector("#offense-trait"),d=this.querySelector("#resilience-trait"),h=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(u),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(d),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(h),u.textContent=`${this._adventurer.traits.offense}`,d.textContent=`${this._adventurer.traits.resilience}`,h.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Fe(),o("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${o("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${o("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${o("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("armor-slot",We(),o("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${o("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${o("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${o("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Ve(),o("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(u=>`
            <div class="text-xs">
                <p>${o("items_and_rooms."+u.id)} (${o("global.duration")}: ${u.stats.duration})</p>
                <p>${Object.entries(u.stats).filter(([d])=>d!=="duration").map(([d,h])=>`${o(`global.${d}`)}: ${h}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${o("global.none")}</p>`),this.updateInventorySlot("potions-slot",Ze(),o("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${o("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${o("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-pulse-once"),e.addEventListener("animationend",()=>{e.classList.remove("animate-pulse-once")},{once:!0}))}updateInventorySlot(e,t,s,n){const i=this.querySelector(`#${e}`);i.dataset.content!==n&&(i.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${n}
                </div>
            `,i.dataset.content=n)}getFlowStateColor(e){switch(e){case g.Boredom:case g.Apathy:return"text-red-500";case g.Anxiety:case g.Worry:return"text-orange-500";case g.Arousal:case g.Control:case g.Relaxation:return"text-blue";case g.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",Je);class Ye extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",Ye);class Qe extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=ae.find(n=>n.feature===this.newlyUnlocked[0]);if(!e)return;const t=o("unlocks.title"),s=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await A.showInfo(t,s,o("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const s=this.querySelector("#decision-container");s&&(s.innerHTML=`<p>${o("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||o("run_ended_screen.default_reason");this.innerHTML=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let n="",i="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(n=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${o("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.continue_decision")}</p>
            `,i=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${o(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(n=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${o("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${o("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,i=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${o("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=n,s.innerHTML=i}}customElements.define("run-ended-screen",Qe);class Xe extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
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
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Xe);class et extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const s=this.querySelector("#log-container");if(s){const n=document.createElement("p");n.className=this._getLogColor(e.level),n.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,s.appendChild(n)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const n=t.map((i,r)=>`<p class="${this._getLogColor(i.level)}">[${r.toString().padStart(3,"0")}] ${i.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${n}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let n=this._renderedLogCount;n<t.length;n++)this._appendEntry(t[n],n);this._renderedLogCount=t.length}const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",et);const tt={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},T=(a,e,t=!0,s=1)=>{const n=t?"text-green-600":"text-red-400",i=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${n}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${a}${s>1?o("global.units"):""}</span>
            <span class="font-mono">${i}${e}</span>
        </div>
    `};class st extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const s=this.querySelector('input[type="checkbox"]');s&&!s.disabled&&(s.checked=!s.checked,s.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=tt[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",s=`card-checkbox-${this._item.instanceId}`;let n="";this._isSelectable&&(this._isDisabled?n="opacity-50 cursor-not-allowed":n="cursor-pointer");const i=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${n} ${i}`;let r=o("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const u=this._item,d=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${u.stats.hp?T(o("global.health"),u.stats.hp,u.stats.hp>0):""}
            ${u.stats.maxHp?T(o("global.max_hp"),u.stats.maxHp,u.stats.maxHp>0):""}
            ${u.stats.power?T(o("global.power"),u.stats.power,u.stats.power>0):""}
            ${u.stats.duration?T(o("global.duration"),u.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${d.stats.hp?T(o("global.health"),d.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${d.stats.attack?T(o("global.attack"),d.stats.attack,!1,d.units):""}
            ${d.stats.hp?T(o("global.health"),d.stats.hp,!1,d.units):""}
          `,d.units>1&&(r=o("choice_panel.multiple_enemies_title",{name:r,count:d.units}));break}}this._stackCount>1&&(r=o("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const c=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${c} flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
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
    `}}customElements.define("choice-card",st);const G=4;class nt extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(n=>this._selectedIds.includes(n.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(n=>n.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const n=t.type==="room_boss";if(s)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");n&&this._selectedIds.length===0?this._selectedIds.push(e):!n&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const i=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);i.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!i.includes(l)):this._selectedIds.length<G&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(p=>p.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const p=e.map(f=>{const m=document.createElement("choice-card");return m.item=f,m.isSelectable=!1,m.outerHTML}).join("");A.show(o("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 cards-container">${p}</div>`,[{text:o("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(f=>f.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},n={enemy:0,trap:1,healing:2,boss:3};let i=[...this._choices];this._deckType==="item"?i.sort((p,f)=>{const m=s[p.type]-s[f.type];if(m!==0)return m;const _=t[p.rarity]||0,b=t[f.rarity]||0;return _-b}):i.sort((p,f)=>{const m=p,_=f,b=n[m.type]-n[_.type];if(b!==0)return b;const v=m.stats.hp||0,S=_.stats.hp||0;if(v!==S)return S-v;const y=m.stats.attack||0;return(_.stats.attack||0)-y});const r=this._deckType==="room";let l;if(r)l=i;else{const p=new Map;i.forEach(f=>{const m=f;p.has(m.id)?p.get(m.id).count++:p.set(m.id,{choice:m,count:1})}),l=Array.from(p.values()).map(f=>({...f.choice,stackCount:f.count}))}o(r?"choice_panel.title_room":"choice_panel.title");let c=o(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?c=o("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(c=o("choice_panel.roll_credits"));let u=!1,d=c;this._offerImpossible||this._roomSelectionImpossible?u=!0:r?this._choices.filter(m=>this._selectedIds.includes(m.instanceId)).some(m=>m.type==="room_boss")?(u=this._selectedIds.length===1,d=`${c} (1/1)`):(u=this._selectedIds.length===3,d=`${c} (${this._selectedIds.length}/3)`):(u=this._selectedIds.length>=2&&this._selectedIds.length<=G,d=`${c} (${this._selectedIds.length}/${G})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!u||this._disabled?"disabled":""}>
                    ${d}
                </button>
            </div>
        </div>
    `;const h=this.querySelector("#loot-card-container");h&&l.forEach(p=>{const f=document.createElement("choice-card");f.item=p,"stackCount"in p&&(f.stackCount=p.stackCount),f.isSelected=this._selectedIds.includes(p.instanceId);let m=this._disabled;if(this._offerImpossible)m=!0;else if(r){const _=this._choices.filter(v=>this._selectedIds.includes(v.instanceId)),b=_.some(v=>v.type==="room_boss");f.isSelected?m=!1:(b||p.type==="room_boss"&&_.length>0||_.length>=3)&&(m=!0)}else{const _=new Map(this._choices.map(S=>[S.instanceId,S.id])),b=this._selectedIds.map(S=>_.get(S));m=!f.isSelected&&b.includes(p.id)||this._disabled}f.isDisabled=m,f.isNewlyDrafted=p.justDrafted&&this._initialRender||!1,h.appendChild(f)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",nt);class it extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
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
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const s=document.createElement("choice-card");s.item=t,s.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(s)}}}}customElements.define("workshop-screen",it);class at extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await U.show(o("menu.new_game"),o("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await U.show(o("menu.reset_save"),o("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(t){const n=e.adventurers||0;s=`
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
          <p class="status-bar-field">build 132</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",at);class ot extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t,s){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show")}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",ot);const rt=800;class le extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0}connectedCallback(){this.payload&&(this.innerHTML=`
      <div id="encounter-overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="window" style="width: min(95vw, 600px);" role="dialog" aria-modal="true" aria-labelledby="encounter-modal-title">
          <div class="title-bar">
            <div class="title-bar-text" id="encounter-modal-title">${o("items_and_rooms."+this.payload.room.id)}</div>
          </div>
          <div class="window-body p-2">
            ${this.renderInitialView()}
          </div>
        </div>
      </div>
    `,this.querySelector("#skip-button").addEventListener("click",()=>{this.dismiss(!0)}),this.start())}start(){this.payload&&this.renderRoomChoiceView()}renderInitialView(){return`
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
    `}renderRoomChoiceView(){if(!this.payload)return;const e=this.querySelector("#room-choice-container"),t=this.querySelector("#event-message"),s=this.querySelector("#skip-button");e.classList.remove("hidden");const n=this.payload.log[0];t.textContent=o(n.messageKey,n.replacements),s.textContent=o("global.continue"),s.onclick=()=>{var i,r;if(((i=this.payload)==null?void 0:i.room.type)==="room_healing"||((r=this.payload)==null?void 0:r.room.type)==="room_trap"){const l=this.payload.log[1];l&&(t.textContent=o(l.messageKey,l.replacements)),s.onclick=()=>this.dismiss(!1)}else this.renderBattleView()}}renderBattleView(){this.querySelector("#adventurer-status-container").classList.remove("hidden"),this.querySelector("#enemy-status-container").classList.remove("hidden"),this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#skip-button").textContent=o("global.skip"),this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){this.querySelector("#skip-button").textContent=o("global.continue"),this.querySelector("#skip-button").addEventListener("click",()=>this.dismiss(!1));return}const e=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(e.adventurer),e.enemy?this.renderEnemyStatus(e.enemy):this.querySelector("#enemy-status-container").innerHTML="",this.querySelector("#event-message").textContent=o(e.messageKey,e.replacements),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=setTimeout(()=>this.renderNextBattleEvent(),rt)}renderAdventurerStatus(e){const t=`flow_states.${Object.values(X(()=>Promise.resolve().then(()=>pe),void 0).FlowState)[e.flowState].toLowerCase()}`;this.querySelector("#adventurer-status-container").innerHTML=`
      <div class="status-bar">
        <p class="status-bar-field font-bold">${o("global.adventurer")}</p>
        <p class="status-bar-field">HP: ${e.hp} / ${e.maxHp}</p>
        <p class="status-bar-field">Power: ${e.power}</p>
        <p class="status-bar-field">${o(t)}</p>
      </div>
    `}renderEnemyStatus(e){this.querySelector("#enemy-status-container").innerHTML=`
      <div class="font-bold">${o(e.name)} (${e.count}/${e.total})</div>
      <div>HP: ${e.currentHp} / ${e.maxHp}</div>
      <div>Power: ${e.power}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=(this.currentEventIndex+1)/this.payload.log.length;this.querySelector("#progress-indicator").style.width=`${e*100}%`}dismiss(e){clearTimeout(this.battleTimeout),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const s=document.createElement("encounter-modal");s.payload=e,s.onDismiss=t,document.body.appendChild(s)})}}customElements.define("encounter-modal",le);const lt=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:le},Symbol.toStringTag,{value:"Module"}));class H{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return H.instance||(H.instance=new H),H.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const n=this.getTooltipContent(s);n&&(this.tooltipBox.show(n,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const n=this.getTooltipContent(s);n&&this.tooltipBox.show(n,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=o(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=o(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=o("global.information")),{title:s,body:t}}}const Q=H.getInstance(),R=document.getElementById("app");if(!R)throw new Error("Could not find app element to mount to");async function ct(){R.innerHTML="<div>Initializing...</div>";const a=new Ue;await ge(a);const e=new Ge,t=new Be(e),s=new ze(e),n=new Ae(t,a,s);n.on("state-change",i=>{if(n.isLoading){R.innerHTML=`<div>${o("global.loading_game_data")}</div>`;return}if(n.error){R.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${o("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${n.error}</p>
                    </div>
                </div>
            `;return}Pe(R,i,n),qe()}),n.on("show-encounter",async i=>{const{EncounterModal:r}=await X(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>lt);return{EncounterModal:l}},void 0);await r.show(i),n.continueEncounter(i)}),R.innerHTML=`<div>${o("global.initializing")}</div>`,document.body.addEventListener("mouseover",i=>Q.handleMouseEnter(i)),document.body.addEventListener("click",i=>Q.handleClick(i)),await n.init(),n.showMenu()}ct().catch(a=>{console.error(a),R&&(R.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${a.message}</p>
          </div>
      </div>
    `)});
