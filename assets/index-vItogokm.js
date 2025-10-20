(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const ie="modulepreload",ae=function(i){return"/hypercubicle/"+i},F={},oe=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),h=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=r(t.map(c=>{if(c=ae(c),c in F)return;F[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":ie,u||(m.as="script"),m.crossOrigin="",m.href=c,h&&m.setAttribute("nonce",h),document.head.appendChild(m),u)return new Promise((f,v)=>{m.addEventListener("load",f),m.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})};var _=(i=>(i.Arousal="arousal",i.Flow="flow",i.Control="control",i.Relaxation="relaxation",i.Boredom="boredom",i.Apathy="apathy",i.Worry="worry",i.Anxiety="anxiety",i))(_||{});let Z={};async function J(i,e){try{Z=await e.loadJson(`locales/${i}.json`)}catch(t){console.warn(`Failed to load ${i} translations:`,t),i!=="en"&&await J("en",e)}}function re(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(i,e={}){let n=i.split(".").reduce((s,o)=>s?s[o]:void 0,Z);if(!n)return console.warn(`Translation not found for key: ${i}`),i;for(const s in e)n=n.replace(`{${s}}`,String(e[s]));return n}async function le(i){const e=re();await J(e,i)}class E{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return E.instance||(E.instance=new E),E.instance}on(e){this.listeners.push(e)}log(e,t="INFO",n){const s=a(`log_messages.${e}`,n),o={message:s,level:t,timestamp:Date.now(),data:n};this.muted||(this.entries.push(o),t!=="DEBUG"&&console.log(`[${t}] ${s}`)),this.listeners.forEach(r=>r(o))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(n=>n(t))}metric(e){const t={message:"metric",level:"DEBUG",timestamp:Date.now(),data:e};this.listeners.forEach(n=>n(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=E.getInstance();return t.loadEntries(e.entries),t}}class ce{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const x=new ce(Date.now()),V=i=>`${i}_${x.nextFloat().toString(36).substr(2,9)}`,de=(i,e)=>x.nextInt(i,e),Y=i=>{const e=[...i];for(let t=e.length-1;t>0;t--){const n=x.nextInt(0,t);[e[t],e[n]]=[e[n],e[t]]}return e},Q=(i,e,t,n)=>{const s=e.filter(d=>i.includes(d.id)),o=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},h={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(d=>{h[d]=Math.floor(t*r[d])});let c=Object.values(h).reduce((d,m)=>d+m,0);for(;c<t;)h.common+=1,c+=1;s.filter(d=>d.cost!==null).forEach(d=>{o.push(n(d)),l[d.rarity]+=1}),Object.keys(r).forEach((d,m)=>{const f=s.filter(v=>v.rarity===d);for(;l[d]<h[d]&&f.length!==0;){const v=x.nextInt(0,f.length-1),g=f[v];o.push(n(g)),l[d]+=1}});const u=s.filter(d=>d.rarity==="common");for(;o.length<t&&u.length>0;){const d=x.nextInt(0,u.length-1),m=u[d];o.push(n(m))}return Y(o)},G=(i,e,t)=>Q(i,e,t,n=>({...n,instanceId:V(n.id)})),U=(i,e,t)=>Q(i,e,t,s=>{const o={...s,instanceId:V(s.id)};return o.type==="room_enemy"&&o.stats.minUnits&&o.stats.maxUnits&&(o.units=de(o.stats.minUnits,o.stats.maxUnits)),o}),he=i=>i.roomHand.length<3&&!i.roomHand.some(e=>e.type==="room_boss"),me=i=>[...new Set(i.hand.map(t=>t.id))].length<2&&i.hand.length>0;function X(i,e){const t=Math.max(0,Math.min(100,i)),n=Math.max(0,Math.min(100,e));return n>66?t<33?_.Anxiety:t<87?_.Arousal:_.Flow:n>33?t<33?_.Worry:t<67?_.Apathy:_.Control:t<67?_.Boredom:_.Relaxation}const H={hp:100,maxHp:100,power:5},ue=3;class C{constructor(e,t){this.hp=H.hp,this.maxHp=H.maxHp,this.power=H.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=_.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=E.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,n)=>t+n,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,n=Math.max(0,Math.min(100,e));this.challengeHistory.push(n),this.challengeHistory.length>ue&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${n})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=X(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{name:this.firstName,from:a("flow_states."+e),to:a("flow_states."+this.flowState)})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=H.power,n=H.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,n+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,n+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(s=>{t+=s.stats.power||0,n+=s.stats.maxHp||0}),this.power=t,this.maxHp=n,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e){const t=e.traits,n=new C(t);return n.hp=e.hp,n.maxHp=e.maxHp,n.power=e.power,n.inventory=e.inventory,n.activeBuffs=e.activeBuffs,n.skill=e.skill,n.challengeHistory=e.challengeHistory,n.flowState=e.flowState,n.roomHistory=e.roomHistory,n.lootHistory=e.lootHistory,n.boredomCounter=e.boredomCounter,n.firstName=e.firstName,n.lastName=e.lastName,n}}const fe=99,pe=10,O=10,K=32,ge=18,_e=8;var I=(i=>(i.WORKSHOP="workshop",i.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",i.HAND_SIZE_INCREASE="hand_size_increase",i.ADVENTURER_TRAITS="ADVENTURER_TRAITS",i.BP_MULTIPLIER="BP_MULTIPLIER",i.WORKSHOP_ACCESS="WORKSHOP_ACCESS",i.BP_MULTIPLIER_2="BP_MULTIPLIER_2",i))(I||{});const ee=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],te=10;function se(i,e){var c,u,d,m;const{traits:t,inventory:n,hp:s,maxHp:o}=i;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((c=n.weapon)==null?void 0:c.stats.power)||0,h=((u=n.armor)==null?void 0:u.stats.maxHp)||0;switch(e.type){case"item_weapon":const f=(e.stats.power||0)-l;if(f<=0&&e.id!==((d=n.weapon)==null?void 0:d.id))return-1;r+=f*(t.offense/10),f>0&&(r+=f*(i.skill/10));const v=e.stats.maxHp||0;v<0&&(r+=v*(100-t.resilience)/20);break;case"item_armor":const g=(e.stats.maxHp||0)-h;if(g<=0&&e.id!==((m=n.armor)==null?void 0:m.id))return-1;r+=g*(100-t.offense)/10,g>0&&(r+=g*(i.skill/10));const y=e.stats.power||0;y>0&&(r+=y*(t.offense/15));const b=e.stats.power||0;b<0&&(r+=b*(t.resilience/10));break;case"item_potion":const w=s/o;r+=10*(100-t.resilience)/100,w<.7&&(r+=20*(1-w)),r+=5*(i.skill/100),n.potions.length>=fe&&(r*=.1);break}return r}function ve(i,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${i.traits.offense}, Resilience: ${i.traits.resilience}, Skill: ${i.skill})`);const n=e.map(o=>({item:o,score:se(i,o)})).filter(o=>o.score>0);if(n.sort((o,r)=>r.score-o.score),n.length===0||n[0].score<pe)return null;const s=n[0].item;return t.debug(`Adventurer chooses: ${a("items_and_rooms."+s.id)} (Score: ${n[0].score.toFixed(1)})`),s}function be(i,e){const{flowState:t,hp:n,maxHp:s,inventory:o,traits:r}=i,l=n/s;if(o.potions.length===0)return"attack";let h=.5;switch(t){case _.Anxiety:case _.Worry:h=.8;break;case _.Arousal:case _.Flow:h=.6;break;case _.Control:case _.Relaxation:h=.4;break;case _.Boredom:case _.Apathy:h=.2;break}return h-=r.resilience/200,l<Math.max(.1,h)?"use_potion":"attack"}function ye(i,e,t){if(e){i.lootHistory.push(e.id),i.lootHistory.filter(o=>o===e.id).length>2&&(i.modifyChallenge(i.challenge-te),i.logger.info("info_repetitive_choice",{name:a("items_and_rooms."+e.id)}));const s=se(i,e);s>60?(i.modifySkill(10),i.modifyChallenge(i.challenge+5)):s>30?(i.modifySkill(5),i.modifyChallenge(i.challenge+2)):i.modifySkill(2)}else t.length>0?i.modifyChallenge(i.challenge-5):i.modifyChallenge(i.challenge-10);i.updateFlowState()}function we(i,e){i.roomHistory.push(e.id),i.roomHistory.filter(s=>s===e.id).length>2&&(i.modifyChallenge(i.challenge-te),i.logger.info("info_deja_vu",{name:a("items_and_rooms."+e.id)}));let n=0;switch(e.type){case"room_enemy":n=5;break;case"room_boss":n=15;break;case"room_trap":n=10;break;case"room_healing":n=-15;break}i.modifyChallenge(i.challenge+n),i.updateFlowState()}function Se(i){i.modifySkill(-2),i.updateFlowState()}function P(i,e){switch(e){case"hit":i.modifySkill(.5);break;case"miss":i.modifySkill(-.5);break;case"take_damage":i.modifyChallenge(i.challenge+1);break}i.updateFlowState()}function xe(i,e,t,n){let s;return e>.7?(s=a("game_engine.too_close_for_comfort"),i.modifyChallenge(i.challenge+10),i.modifySkill(-3)):e>.4?(s=a("game_engine.great_battle"),i.modifyChallenge(i.challenge+5),i.modifySkill(5)):t>3&&i.traits.offense>60?(s=a("game_engine.easy_fight"),i.modifyChallenge(i.challenge-10)):(s=a("game_engine.worthy_challenge"),i.modifyChallenge(i.challenge-2),i.modifySkill(2)),t===n&&i.modifySkill(1*t),i.updateFlowState(),s}const p=E.getInstance();class ke{constructor(e,t,n){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=s=>{this.metaManager.incrementAdventurers();const o={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0};p.loadEntries([]);const r=new C(o,this._allNames),l=(s==null?void 0:s.items)||this._allItems.filter(y=>y.cost===null).map(y=>y.id),h=G(l,this._allItems,K),c=this._getHandSize(),u=h.slice(0,c),d=h.slice(c),m=(s==null?void 0:s.rooms)||this._allRooms.filter(y=>y.cost===null).map(y=>y.id),f=U(m,this._allRooms,this._getRoomDeckSize()),v=f.slice(0,c),g=f.slice(c);this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:r,unlockedDeck:l,availableDeck:d,hand:u,unlockedRoomDeck:m,availableRoomDeck:g,roomHand:v,handSize:c,shopItems:[],offeredLoot:[],offeredRooms:[],run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},p.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),p.debug(`Deck size: ${h.length}, Hand size: ${c}, Room Deck size: ${f.length}, Room Hand size: ${v.length}`),p.info("info_designer_choosing_room",{name:r.firstName}),this._emit("state-change",this.gameState)},this.continueGame=()=>{const s=this.gameSaver.load();s?(this.gameState=s,this._emit("state-change",this.gameState),this.gameState.phase==="AWAITING_ENCOUNTER_RESULT"&&this.gameState.encounterPayload&&this._emit("show-encounter",this.gameState.encounterPayload)):this.startNewGame()},this.startNewRun=s=>{if(!this.gameState)return;const o=s||this.gameState.run+1;this.metaManager.updateRun(o);const r=this._getHandSize(),l=G(this.gameState.unlockedDeck,this._allItems,K),h=l.slice(0,r),c=l.slice(r),u=U(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),d=u.slice(0,r),m=u.slice(r),f=new C(this.gameState.adventurer.traits,this._allNames);f.skill=this.gameState.adventurer.skill,f.challengeHistory=[...this.gameState.adventurer.challengeHistory],f.flowState=this.gameState.adventurer.flowState,p.info("info_adventurer_returns",{name:f.firstName}),p.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:f,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:c,hand:h,availableRoomDeck:m,roomHand:d,handSize:r,room:1,run:o,runEnded:{isOver:!1,reason:"",success:!1,decision:null}},p.info("info_designer_choosing_room",{name:f.firstName}),this._emit("state-change",this.gameState)},this.presentOffer=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const o=this.gameState.hand.filter(w=>s.includes(w.instanceId));this.gameState.offeredLoot=o;const r=this.gameState.adventurer,l=ve(r,this.gameState.offeredLoot,p),h=this.gameState.offeredLoot.map(w=>a("items_and_rooms."+w.id)).join(", ");p.info("info_loot_chosen",{name:r.firstName,items:h});const c=r.flowState;ye(r,l,this.gameState.offeredLoot),c!==r.flowState&&p.metric({event:"flow_state_changed",flowState:r.flowState}),l?(p.info("info_item_chosen",{name:r.firstName,item:a("items_and_rooms."+l.id)}),p.metric({event:"item_chosen",item:l})):p.info("info_loot_declined",{name:r.firstName});let u=this.gameState.hand,d=this.gameState.availableDeck;u.forEach(w=>w.justDrafted=!1);let m=u.filter(w=>!s.includes(w.instanceId));const f=this.gameState.handSize-m.length,v=d.slice(0,f);v.forEach(w=>{w.draftedRoom=this.gameState.room,w.justDrafted=!0});const g=d.slice(f);m.push(...v),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const y=this.gameState.room+1,b=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,availableDeck:g,hand:m,room:y,designer:{balancePoints:b}},p.info("info_designer_choosing_room",{name:r.firstName}),this._emit("state-change",this.gameState)},this.runEncounter=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=s;const o=x.nextInt(0,this.gameState.offeredRooms.length-1),r=this.gameState.offeredRooms[o];if(this.gameState.offeredRooms.length===1&&r.type==="room_boss")p.info("info_boss_room_chosen",{name:this.gameState.adventurer.firstName,chosenRoom:a("items_and_rooms."+r.id)});else{const u=this.gameState.offeredRooms.map(d=>a("items_and_rooms."+d.id)).join(", ");p.info("info_room_chosen",{name:this.gameState.adventurer.firstName,rooms:u})}p.metric({event:"room_encountered",room:r});const{log:l,finalAdventurer:h}=this._generateEncounterLog(this.gameState.adventurer,r),c={room:r,log:l,finalAdventurer:h};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT",encounterPayload:c},this._emit("state-change",this.gameState),this._emit("show-encounter",c)},this.continueEncounter=()=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate()},this._postEncounterUpdate=()=>{if(!this.gameState)return;const s=C.fromJSON(this.gameState.encounterPayload.finalAdventurer);s.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let o=this.gameState.roomHand,r=this.gameState.availableRoomDeck;o.forEach(m=>m.justDrafted=!1);const l=this.gameState.offeredRooms.map(m=>m.instanceId);let h=o.filter(m=>!l.includes(m.instanceId));const c=this.gameState.handSize-h.length,u=r.slice(0,c);u.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const d=r.slice(c);if(h.push(...u),this.gameState.adventurer=s,s.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(s.boredomCounter>2){const m=s.flowState===_.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(m);return}this.gameState.hand&&this.gameState.hand.length===0?(p.warn("warn_empty_hand",{name:s.firstName}),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},encounterPayload:void 0,roomHand:h,availableRoomDeck:d},p.info("info_designer_choosing_room",{name:s.firstName})):(this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",encounterPayload:void 0,roomHand:h,availableRoomDeck:d},p.info("info_designer_choosing_loot",{name:s.firstName})),this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this.metaManager.acls.has(I.WORKSHOP)){p.debug("Workshop not unlocked, starting new run directly."),this.startNewRun();return}p.info("info_entering_workshop",{name:this.gameState.adventurer.firstName});const s=this.gameState.run+1,o=this._allItems.filter(h=>h.cost!==null).filter(h=>!this.gameState.unlockedDeck.includes(h.id)),r=this._allRooms.filter(h=>h.cost!==null).filter(h=>!this.gameState.unlockedRoomDeck.includes(h.id)),l=[...o,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:s,room:0,shopItems:Y(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},p.info("info_welcome_to_workshop"),this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=s=>{if(!this.gameState)return;const o=this._allItems.find(v=>v.id===s),r=this._allRooms.find(v=>v.id===s),l=o||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let h=this.gameState.unlockedDeck,c=this.gameState.unlockedRoomDeck,u=this.gameState.availableDeck,d=this.gameState.availableRoomDeck;o?(h=[...this.gameState.unlockedDeck,s],this.isWorkshopAccessUnlocked()&&(u=[o,...this.gameState.availableDeck])):r&&(c=[...this.gameState.unlockedRoomDeck,s],this.isWorkshopAccessUnlocked()&&(d=[r,...this.gameState.availableRoomDeck]));const m=this.gameState.designer.balancePoints-l.cost,f=this.gameState.shopItems.filter(v=>v.id!==s);p.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:a("items_and_rooms."+l.id)}),p.metric({event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:m},unlockedDeck:h,unlockedRoomDeck:c,availableDeck:u,availableRoomDeck:d,shopItems:f},this._emit("state-change",this.gameState)},this.quitGame=(s=!0)=>{s&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(I.BP_MULTIPLIER_2)?O*4:this.metaManager.acls.has(I.BP_MULTIPLIER)?O*2:O,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=n}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const n=this._listeners[e];n&&n.forEach(s=>s(...t))}_createAdventurerSnapshot(e){return{firstName:e.firstName,lastName:e.lastName,hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var r;const n=[],s=C.fromJSON(e.toJSON());p.info("info_encounter",{name:s.firstName,roomName:a("items_and_rooms."+t.id)});const o=s.flowState;switch(we(s,t),o!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_encounter",replacements:{name:s.firstName,roomName:a("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(s)}),t.type){case"room_enemy":case"room_boss":{const l={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let h=0;const c=s.hp;for(let v=0;v<l.enemyCount;v++){let g=l.enemyHp;p.info("info_encounter_enemy",{name:s.firstName,enemyName:t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),current:v+1,total:l.enemyCount});const y=t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),b={currentHp:g,maxHp:l.enemyHp,power:l.enemyPower,name:y,count:v+1,total:l.enemyCount};for(n.push({messageKey:"log_messages.info_encounter_enemy",replacements:{name:s.firstName,enemyName:t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),current:v+1,total:l.enemyCount},adventurer:this._createAdventurerSnapshot(s),enemy:b});g>0&&s.hp>0;){if(be(s)==="use_potion"){const S=s.inventory.potions.shift();if(S){const k=S.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+k),p.info("info_adventurer_drinks_potion",{name:s.firstName,potionName:a("items_and_rooms."+S.id)}),n.push({messageKey:"log_messages.info_adventurer_drinks_potion",replacements:{name:s.firstName,potionName:a("items_and_rooms."+S.id)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})}}else{const S=Math.min(.95,.75+s.traits.skill/500+s.traits.offense/1e3);if(x.nextFloat()<S){const k=s.power;g-=k,p.debug(`Adventurer hits for ${k} damage.`);const N=s.flowState;P(s,"hit"),N!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${N}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_adventurer_hit",replacements:{name:s.firstName,damage:k},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"attack"},{target:"enemy",animation:"shake"}]})}else{p.debug("Adventurer misses.");const k=s.flowState;P(s,"miss"),k!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${k}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_adventurer_miss",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"attack"}]})}}if(g<=0){p.info("info_enemy_defeated",{enemyName:b.name}),h++,n.push({messageKey:"log_messages.info_enemy_defeated",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:0},animations:[{target:"enemy",animation:"defeat"}]});break}const R=Math.max(.4,.75-s.traits.skill/500-(100-s.traits.offense)/1e3);if(x.nextFloat()<R){const S=(((r=s.inventory.armor)==null?void 0:r.stats.maxHp)||0)/10,k=Math.max(1,l.enemyPower-S);s.hp-=k,p.debug(`Enemy hits for ${k} damage.`);const N=s.flowState;P(s,"take_damage"),N!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${N}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_enemy_hit",replacements:{damage:k,enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"enemy",animation:"attack"},{target:"adventurer",animation:"shake"}]})}else p.debug("Enemy misses."),n.push({messageKey:"log_messages.info_enemy_miss",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"enemy",animation:"attack"}]})}if(s.hp<=0){p.warn("info_adventurer_defeated",{name:s.firstName}),n.push({messageKey:"log_messages.info_adventurer_defeated",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"defeat"}]});break}}const u=c-s.hp,d=u/s.maxHp;p.debug(`hpLost: ${u}, hpLostRatio: ${d.toFixed(2)}`);const m=s.flowState,f=xe(s,d,h,l.enemyCount);m!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),p.info("info_battle_outcome",{outcome:f});break}case"room_healing":{const l=t.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+l),p.info("info_healing_room",{name:s.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:l}),n.push({messageKey:"log_messages.info_healing_room",replacements:{name:s.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:l},adventurer:this._createAdventurerSnapshot(s)});break}case"room_trap":{const l=t.stats.attack||0;s.hp-=l;const h=s.flowState;Se(s),h!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),p.info("info_trap_room",{name:s.firstName,trapName:a("items_and_rooms."+t.id),damage:l}),n.push({messageKey:"log_messages.info_trap_room",replacements:{name:s.firstName,trapName:a("items_and_rooms."+t.id),damage:l},adventurer:this._createAdventurerSnapshot(s)});break}}return{log:n,finalAdventurer:s}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const n=this.metaManager.checkForUnlocks(this.gameState.run);p.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),p.metric({event:"run_end",bp:this.gameState.designer.balancePoints}),p.error("info_game_over",{reason:e});const s=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:s},newlyUnlocked:n},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:n}=this.gameState.adventurer,{resilience:s,offense:o}=t,r=Math.min(n/100,1);if(e===_.Flow)return"continue";let l=.55;switch(e){case _.Anxiety:l+=.25-s/400;break;case _.Arousal:l-=.1-o/1e3;break;case _.Worry:l+=.2;break;case _.Control:l-=.15;break;case _.Relaxation:l+=.1;break;case _.Boredom:l+=.3;break;case _.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),x.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(p.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0},t=new C(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(I.HAND_SIZE_INCREASE)?12:_e}_getRoomDeckSize(){return this.metaManager.acls.has(I.ROOM_DECK_SIZE_INCREASE)?36:ge}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(I.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(I.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class M{constructor(e,t,n,s){this.resolve=s;const o=document.createElement("div");o.dataset.testid="info-modal-overlay",Object.assign(o.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),o.addEventListener("click",g=>{if(g.target===o){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const h=document.createElement("div");h.id="info-modal-title",h.className="title-bar-text",h.textContent=e,l.appendChild(h),r.appendChild(l);const c=document.createElement("div");c.className="window-body text-center p-4";const u=document.createElement("div");u.innerHTML=t,c.appendChild(u);const d=document.createElement("div");d.className="flex justify-center gap-2 mt-4",n.forEach(g=>{const y=document.createElement("button");y.textContent=g.text,y.addEventListener("click",()=>{this.dismiss(g.value)}),d.appendChild(y)}),c.appendChild(d),r.appendChild(c),o.appendChild(r),document.body.appendChild(o),this.handleKeydown=g=>{if(g.key==="Escape"){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}},document.addEventListener("keydown",this.handleKeydown);const m=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),f=m[0],v=m[m.length-1];f==null||f.focus(),r.addEventListener("keydown",g=>{g.key==="Tab"&&(g.shiftKey?document.activeElement===f&&(v.focus(),g.preventDefault()):document.activeElement===v&&(f.focus(),g.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,n){return new Promise(s=>{new M(e,t,n,s)})}static showInfo(e,t,n=a("global.continue")){const s=[{text:n,value:void 0}];return M.show(e,t,s)}}class z{static show(e,t){const n=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return M.show(e,t,n)}}class Ee extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
            /* Default desktop styles */
            :host {
                display: none;
                position: fixed;
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

            .content-container.flipped::after {
                border-width: 0 10px 10px 10px;
                border-color: transparent transparent var(--border-color) transparent;
                top: -10px;
                bottom: auto;
            }

            .content-container.flipped::before {
                border-width: 0 10px 10px 10px;
                border-color: transparent transparent var(--bg-color) transparent;
                top: calc(-10px + var(--b-px));
                bottopm: auto;
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t){if(this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show"),this.isDesktop&&t){const n=t.getBoundingClientRect(),s=this.getBoundingClientRect();let o=n.top-s.height-10,r=n.left+n.width/2-s.width/2;o<0?(o=n.bottom+10,this.contentContainer.classList.add("flipped")):this.contentContainer.classList.remove("flipped"),r<0?r=5:r+s.width>window.innerWidth&&(r=window.innerWidth-s.width-5),this.style.top=`${o}px`,this.style.left=`${r}px`}}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ee);class L{constructor(){this.showTimeout=null,this.hideTimeout=null,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox),this.mutationObserver=new MutationObserver(()=>{this.tooltipBox.hide(),this.activeToolipKey=""})}static getInstance(){return L.instance||(L.instance=new L),L.instance}initializeTooltipIcons(){document.querySelectorAll("[data-tooltip-key]").forEach(t=>{if(t.querySelector(".tooltip-icon"))return;const n=document.createElement("span");n.textContent="?",n.className="tooltip-icon",t.appendChild(n)})}handleMouseEnter(e){if(this.isTouchDevice())return;const t=this.findTooltipKeyElement(e.target),n=t&&t.getAttribute("data-tooltip-key");this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),n&&this.activeToolipKey!==n&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=n;const s=this.getTooltipContent(n);s&&(this.mutationObserver.observe(document,{childList:!0,subtree:!0}),this.tooltipBox.show(s,t))},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.mutationObserver.disconnect(),this.tooltipBox.hide(),this.activeToolipKey="")}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const n=this.findTooltipKeyElement(t.parentElement),s=n.getAttribute("data-tooltip-key");if(s){const o=this.getTooltipContent(s);o&&this.tooltipBox.show(o,n)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKeyElement(e){return e?e.hasAttribute("data-tooltip-key")?e:this.findTooltipKeyElement(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let n=a(`tooltips.${e}.title`);return n.includes("tooltips.")&&(n=a("global.information")),{title:n,body:t}}}const D=L.getInstance(),Ie=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,Ce=(i,e,t)=>{if(D.handleMouseLeave(),!e){i.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":Re(i,t);break;case"SHOP":Te(i,e,t);break;default:$e(i,e,t);break}D.initializeTooltipIcons()},j=(i,e,t)=>{const n=document.createElement("choice-panel");return n.engine=e,t==="item"?(n.choices=i.hand,n.deckType="item",n.offerImpossible=me(i)):(n.choices=i.roomHand,n.deckType="room",n.roomSelectionImpossible=he(i)),n},$e=(i,e,t)=>{var h;if(!i.querySelector("adventurer-status")){i.innerHTML=Ie;const c=i.querySelector("#game-title");c&&(c.textContent=a("game_title"));const u=i.querySelector("#adventurer-status-title");u&&(u.textContent=a("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(h=i.querySelector("#quit-game-btn"))==null||h.addEventListener("click",async()=>{await z.show(a("global.quit"),a("global.quit_confirm"))&&t.quitGame(!1)})}const n=i.querySelector("adventurer-status"),s=i.querySelector("log-panel"),o=i.querySelector("game-stats"),r=i.querySelector("#game-phase-panel"),l=i.querySelector("#game-phase-title");switch(n.metaState=t.metaManager.metaState,n.adventurer=e.adventurer,o.engine=t,t.isWorkshopUnlocked()?o.setAttribute("balance-points",e.designer.balancePoints.toString()):o.removeAttribute("balance-points"),o.setAttribute("run",e.run.toString()),o.setAttribute("room",e.room.toString()),o.setAttribute("deck-size",e.availableDeck.length.toString()),o.setAttribute("room-deck-size",e.availableRoomDeck.length.toString()),s.logger=E.getInstance(),s.traits=e.adventurer.traits,r.innerHTML="",e.phase){case"RUN_OVER":{l&&(l.textContent=a("run_ended_screen.run_complete"));const c=document.createElement("run-ended-screen");c.setAttribute("final-bp",e.designer.balancePoints.toString()),c.setAttribute("reason",e.runEnded.reason),c.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&c.setAttribute("workshop-unlocked",""),e.runEnded.decision&&c.initialize(e.runEnded.decision,e.newlyUnlocked,t),r.appendChild(c);break}case"DESIGNER_CHOOSING_LOOT":l&&(l.textContent=a("choice_panel.title")),r.appendChild(j(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":l&&(l.textContent=a("choice_panel.title_room")),r.appendChild(j(e,t,"room"));break;default:l&&(l.textContent="...");break}},Re=(i,e)=>{i.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,i.appendChild(t)},Te=(i,e,t)=>{i.innerHTML="";const n=document.createElement("workshop-screen");n.items=e.shopItems,n.balancePoints=e.designer.balancePoints,n.engine=t,i.appendChild(n)},W="hypercubicle-meta";class Le{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const n of ee)e>=n.runThreshold&&!this._metaState.unlockedFeatures.includes(n.feature)&&(this._metaState.unlockedFeatures.push(n.feature),t.push(n.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(W);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(W,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const A="hypercubicle-savegame",q="1.0.1";class Ne{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(A,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(A);if(e){const t=JSON.parse(e);return t.version!==q?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${q}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(A)!==null}clear(){this.storage.removeItem(A)}_serialize(e){const{adventurer:t,...n}=e;return{version:q,...n,adventurer:t.toJSON(),logger:E.getInstance().toJSON()}}_deserialize(e){const{adventurer:t,logger:n,...s}=e;E.getInstance().loadEntries(n.entries);const r=C.fromJSON(t),{version:l,...h}=s;return{...h,adventurer:r}}}class He{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Me{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',De=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class ze extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,n;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(n=this._metaState)==null?void 0:n.unlockedFeatures.includes(I.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${a("adventurer_status.flow_state")}</legend>
              <div class="flex gap-2 items-center">
                <div id="flow-state-text" class="font-mono text-xl text-center flex-grow"></div>
                <flow-chart></flow-chart>
              </div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Ae()} <span>${a("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${De()} <span class="ml-1">${a("global.power")}</span></div>
                    <span id="power-text" class="font-mono text-lg"></span>
                </div>
            </div>

            <fieldset id="traits-section" class="${e?"":"hidden"} mt-2">
                <legend>${a("adventurer_status.traits",{defaultValue:"Traits"})}</legend>
                <div class="flex justify-around text-center">
                    <div>
                        <span class="block text-xs">${a("log_panel.offense")}</span>
                        <span id="offense-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${a("log_panel.resilience")}</span>
                        <span id="resilience-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${a("log_panel.skill")}</span>
                        <span id="skill-trait" class="font-mono"></span>
                    </div>
                </div>
            </fieldset>

            <fieldset class="mt-2">
                <legend>${a("adventurer_status.inventory")}</legend>
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div id="weapon-slot" class="sunken-panel p-1"></div>
                    <div id="armor-slot" class="sunken-panel p-1"></div>
                    <div id="buffs-slot" class="sunken-panel p-1"></div>
                    <div id="potions-slot" class="sunken-panel p-1"></div>
                </div>
            </fieldset>
        `,this._hasRendered=!0}update(){var h;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const n=this.querySelector("#flow-state-text");n.textContent=a(`flow_states.${this._adventurer.flowState}`),n.className=`font-mono text-xl text-center flex-grow ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(n);const s=this.querySelector("flow-chart");s.setAttribute("skill",`${this._adventurer.skill}`),s.setAttribute("challenge",`${this._adventurer.challenge}`);const o=this.querySelector("#power-text");o.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(o);const r=(h=this._metaState)==null?void 0:h.unlockedFeatures.includes(I.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(r){l.classList.remove("hidden");const c=this.querySelector("#offense-trait"),u=this.querySelector("#resilience-trait"),d=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(u),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(d),c.textContent=`${this._adventurer.traits.offense}`,u.textContent=`${this._adventurer.traits.resilience}`,d.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Oe(),a("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("armor-slot",Pe(),a("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Be(),a("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div class="text-xs">
                <p>${a("items_and_rooms."+c.id)} (${a("global.duration")}: ${c.stats.duration})</p>
                <p>${Object.entries(c.stats).filter(([u])=>u!=="duration").map(([u,d])=>`${a(`global.${u}`)}: ${d}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("potions-slot",qe(),a("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${a("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-shake"),e.addEventListener("animationend",()=>{e.classList.remove("animate-shake")},{once:!0}))}updateInventorySlot(e,t,n,s){const o=this.querySelector(`#${e}`);o.dataset.content!==s&&(o.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${n}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${s}
                </div>
            `,o.dataset.content=s)}getFlowStateColor(e){switch(e){case _.Boredom:case _.Apathy:return"text-red-500";case _.Anxiety:case _.Worry:return"text-orange-500";case _.Arousal:case _.Control:case _.Relaxation:return"text-blue";case _.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",ze);class Fe extends HTMLElement{constructor(){super(),this._skill=50,this._challenge=50,this._canvas=null,this._ctx=null,this._backgroundRendered=!1}static get observedAttributes(){return["skill","challenge"]}connectedCallback(){this.innerHTML=`
      <div class="relative" style="width: 100px; height: 100px;">
        <canvas width="100" height="100" style="image-rendering: pixelated;"></canvas>
        <div id="flow-chart-dot" style="position: absolute; width: 8px; height: 8px; background-color: white; border: 1px solid black; border-radius: 50%; transform: translate(-50%, -50%); transition-delay: 0.5s; transition: 0.5s ease;"></div>
      </div>
    `,this._canvas=this.querySelector("canvas"),this._ctx=this._canvas.getContext("2d"),this.render()}attributeChangedCallback(e,t,n){t!==n&&(e==="skill"&&(this._skill=parseFloat(n)),e==="challenge"&&(this._challenge=parseFloat(n)),this.render())}render(){if(!this._ctx||!this._canvas)return;this._backgroundRendered||this._renderBackground();const e=this.querySelector("#flow-chart-dot"),t=Math.max(0,Math.min(100,this._skill)),n=100-Math.max(0,Math.min(100,this._challenge));e.style.left=`${t}%`,e.style.top=`${n}%`}_renderBackground(){if(!this._ctx||!this._canvas)return;const e=this._ctx;for(let t=0;t<100;t++)for(let n=0;n<100;n++){const s=X(t,100-n);e.fillStyle=this.getFlowStateCanvasColor(s),e.fillRect(t,n,1,1)}e.font='12px "Pixelated MS Sans Serif"',e.fillStyle="black",e.strokeStyle="white",e.lineWidth=2,e.textAlign="center",e.strokeText("Skill",50,95),e.fillText("Skill",50,95),e.save(),e.translate(12,50),e.rotate(-Math.PI/2),e.strokeText("Challenge",0,0),e.fillText("Challenge",0,0),e.restore(),this._backgroundRendered=!0}getFlowStateCanvasColor(e){switch(e){case _.Apathy:return"rgba(239, 68, 68, 0.2)";case _.Boredom:return"rgba(239, 68, 68, 0.6)";case _.Anxiety:return"rgba(249, 115, 22, 0.6)";case _.Worry:return"rgba(249, 115, 22, 0.2)";case _.Arousal:return"rgba(59, 130, 246, 0.8)";case _.Control:return"rgba(59, 130, 246, 0.4)";case _.Relaxation:return"rgba(59, 130, 246, 0.2)";case _.Flow:return"#eab308";default:return"#000000"}}}customElements.define("flow-chart",Fe);class Ge extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,n){this.decision=e,this.newlyUnlocked=t,this.engine=n,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=ee.find(s=>s.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),n=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await M.showInfo(t,n,a("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const n=this.querySelector("#decision-container");n&&(n.innerHTML=`<p>${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||a("run_ended_screen.default_reason");this.innerHTML=`
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
                    <p>${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),n=this.querySelector("#button-container");if(!t||!n||this.state!=="decision-revealed")return;let s="",o="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(s=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${a("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,o=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${a(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(s=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${a("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,o=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=s,n.innerHTML=o}}customElements.define("run-ended-screen",Ge);class Ue extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,n){switch(e){case"balance-points":this._balancePoints=Number(n);break;case"run":this._run=Number(n);break;case"room":this._room=Number(n);break;case"deck-size":this._deckSize=Number(n);break;case"room-deck-size":this._roomDeckSize=Number(n);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="status-bar">

                ${this._balancePoints!==null?`
                <p class="status-bar-field" data-tooltip-key="status_bar_balance_points">
                    <span class="text-xs">${a("global.bp")}: ${this._balancePoints}</span>
                </p>
                `:""}
                <p class="status-bar-field" data-tooltip-key="status_bar_current_run">
                    <span class="text-xs">${a("global.run")}: ${this._run}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_current_room">
                    <span class="text-xs">${a("global.room")}: ${this._room}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_deck_size">
                    <span class="text-xs">${a("global.deck")}: ${this._deckSize}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_room_deck_size">
                    <span class="text-xs">${a("global.rooms")}: ${this._roomDeckSize}</span>
                </p>

                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                    <button id="enter-workshop-btn">${a("global.workshop")}</button>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var n;(n=this.engine)==null||n.enterWorkshop()})}}customElements.define("game-stats",Ue);class Ke extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const n=this.querySelector("#log-container");if(n){const s=document.createElement("p");s.className=this._getLogColor(e.level),s.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,n.appendChild(s)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const s=t.map((o,r)=>`<p class="${this._getLogColor(o.level)}">[${r.toString().padStart(3,"0")}] ${o.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${s}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let s=this._renderedLogCount;s<t.length;s++)this._appendEntry(t[s],s);this._renderedLogCount=t.length}const n=this.querySelector("#log-container");n&&(n.scrollTop=n.scrollHeight)}}customElements.define("log-panel",Ke);const je={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},T=(i,e,t=!0,n=1)=>{const s=t?"text-green-600":"text-red-400",o=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${s}">
            <span ${n>1?'data-tooltip-key="multiple_units"':""}>${i}${n>1?a("global.units"):""}</span>
            <span class="font-mono">${o}${e}</span>
        </div>
    `};class We extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const n=this.querySelector('input[type="checkbox"]');n&&!n.disabled&&(n.checked=!n.checked,n.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=je[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",n=`card-checkbox-${this._item.instanceId}`;let s="";this._isSelectable&&(this._isDisabled?s="opacity-50 cursor-not-allowed":s="cursor-pointer");const o=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s} ${o}`;let r=a("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const c=this._item,u=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${c.stats.hp?T(a("global.health"),c.stats.hp,c.stats.hp>0):""}
            ${c.stats.maxHp?T(a("global.max_hp"),c.stats.maxHp,c.stats.maxHp>0):""}
            ${c.stats.power?T(a("global.power"),c.stats.power,c.stats.power>0):""}
            ${c.stats.duration?T(a("global.duration"),c.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${u.stats.hp?T(a("global.health"),u.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${u.stats.attack?T(a("global.attack"),u.stats.attack,!1,u.units):""}
            ${u.stats.hp?T(a("global.health"),u.stats.hp,!1,u.units):""}
          `,u.units>1&&(r=a("choice_panel.multiple_enemies_title",{name:r,count:u.units}));break}}this._stackCount>1&&(r=a("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const h=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${h} text-left flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${a("card_types."+this._item.type)} - ${a("rarity."+this._item.rarity)}</legend>
        <div class="p-2 grow">
            <p class="font-bold text-sm ${e}">${r}</p>
            <div class="mt-2">
                ${l}
            </div>
            ${this._isSelectable&&!this._purchaseInfo?`
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${n}" ${this._isSelected?"checked":""} ${this._isDisabled?"disabled":""}>
              <label for="${n}" class="ml-2 text-sm">${a("card.select")}</label>
            </div>
            `:""}
            ${this._purchaseInfo?`
            <div class="mt-4 text-center">
                <button
                    data-item-id="${this._item.id}"
                    ${this._purchaseInfo.canAfford?"":"disabled"}
                    class="w-full"
                >
                    ${a("global.buy")} (${this._purchaseInfo.cost} ${a("global.bp")})
                </button>
            </div>
            `:""}
        </div>
      </fieldset>
    `}}customElements.define("choice-card",We);const B=4;class Ze extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const n=this._choices.filter(s=>this._selectedIds.includes(s.instanceId));this.engine.runEncounter(n)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(s=>s.instanceId===e);if(!t)return;const n=this._selectedIds.includes(e);if(this._deckType==="room"){const s=t.type==="room_boss";if(n)this._selectedIds=this._selectedIds.filter(o=>o!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");s&&this._selectedIds.length===0?this._selectedIds.push(e):!s&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const o=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);o.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!o.includes(l)):this._selectedIds.length<B&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e={item_weapon:0,item_armor:1,item_potion:2,item_buff:3},t={room_healing:0,room_trap:1,room_enemy:2,room_boss:3},n=["attack","hp","power","maxHp"],s=[...this._choices].sort((d,m)=>{var y,b;const f=this._deckType==="item"?e:t,v=d.type,g=m.type;if(v in f&&g in f){const w=f[v]-f[g];if(w!==0)return w}for(const w of n){let R=((y=d.stats)==null?void 0:y[w])??null,S=((b=m.stats)==null?void 0:b[w])??null;if(w=="attack"&&this._deckType==="room"&&(R*=d.units||1,S*=m.units||1),R!==null&&S!==null){if(R!==S)return R-S}else{if(R!==null)return 1;if(S!==null)return-1}}return 0}),o=this._deckType==="room";let r;if(o)r=s;else{const d=new Map;s.forEach(m=>{const f=m;d.has(f.id)?d.get(f.id).count++:d.set(f.id,{choice:f,count:1})}),r=Array.from(d.values()).map(m=>({...m.choice,stackCount:m.count}))}a(o?"choice_panel.title_room":"choice_panel.title");let l=a(o?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?l=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(l=a("choice_panel.roll_credits"));let h=!1,c=l;this._offerImpossible||this._roomSelectionImpossible?h=!0:o?this._choices.filter(f=>this._selectedIds.includes(f.instanceId)).some(f=>f.type==="room_boss")?(h=this._selectedIds.length===1,c=`${l} (1/1)`):(h=this._selectedIds.length===3,c=`${l} (${this._selectedIds.length}/3)`):(h=this._selectedIds.length>=2&&this._selectedIds.length<=B,c=`${l} (${this._selectedIds.length}/${B})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!h||this._disabled?"disabled":""}>
                    ${c}
                </button>
            </div>
        </div>
    `;const u=this.querySelector("#loot-card-container");u&&r.forEach(d=>{const m=document.createElement("choice-card");m.item=d,"stackCount"in d&&(m.stackCount=d.stackCount),m.isSelected=this._selectedIds.includes(d.instanceId);let f=this._disabled;if(this._offerImpossible)f=!0;else if(o){const v=this._choices.filter(y=>this._selectedIds.includes(y.instanceId)),g=v.some(y=>y.type==="room_boss");m.isSelected?f=!1:(g||d.type==="room_boss"&&v.length>0||v.length>=3)&&(f=!0)}else{const v=new Map(this._choices.map(b=>[b.instanceId,b.id])),g=this._selectedIds.map(b=>v.get(b));f=!m.isSelected&&g.includes(d.id)||this._disabled}m.isDisabled=f,m.isNewlyDrafted=d.justDrafted&&this._initialRender||!1,u.appendChild(m)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ze);class Je extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,n=t.dataset.itemId;n&&this.engine&&this.engine.purchaseItem(n),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
      <div class="window max-w-800">
        <div class="title-bar">
          <div class="title-bar-text">${a("workshop.title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-brand-text-muted">${a("workshop.description")}</p>
          <p class="text-center mt-4 text-2xl">
            ${a("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" id="item-cards">
            ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${a("workshop.no_new_items")}</p>`:""}
          </div>

          <div class="text-center">
            <button id="start-run-button">
              ${a("workshop.begin_next_run")}
            </button>
          </div>
        </div>
      </div>
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const n=document.createElement("choice-card");n.item=t,n.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(n)}}}}customElements.define("workshop-screen",Je);class Ve extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await z.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await z.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let n="";if(t){const s=e.adventurers||0;n=`
        <fieldset class="mt-4 text-center">
          <legend>Progress</legend>
          <p>
            ${a("menu.max_runs",{count:e.highestRun})} | ${a("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${a("menu.adventurer_count",{count:s})}
          </p>
        </fieldset>
      `}this.innerHTML=`
      <div class="window" style="width: 400px;">
        <div class="title-bar">
          <div class="title-bar-text">${a("game_title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-xl mb-4">${a("game_subtitle")}</p>

          ${n}

          <div class="mt-4 space-y-2 flex flex-col items-center">
            ${t?`
              <button id="continue-game-button" style="width: 250px;">
                ${a("menu.continue_game")}
              </button>
            `:""}
            <button id="new-game-button" style="width: 250px;">
              ${a("menu.new_game")}
            </button>
            ${t?`
              <button id="reset-game-button" style="width: 250px;">
                ${a("menu.reset_save")}
              </button>
            `:""}
          </div>
        </div>
        <div class="status-bar">
          <p class="status-bar-field">v0.0.0</p>
          <p class="status-bar-field">build 180</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Ve);const Ye=3e3,Qe=900;class ne extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0,this.battleSpeed=Qe,this.modalState="reveal"}connectedCallback(){if(!this.payload)return;this.innerHTML=`
      <div id="encounter-overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="window" style="width: min(95vw, 600px);" role="dialog" aria-modal="true" aria-labelledby="encounter-modal-title">
          <div class="title-bar">
            <div class="title-bar-text" id="encounter-modal-title">${a("global.encounter_window_title")}</div>
          </div>
          <div class="window-body p-2">
            ${this.renderInitialView()}
          </div>
        </div>
      </div>
    `,this.querySelector("#continue-button").addEventListener("click",()=>this.handleContinue());const e=this.querySelector("#speed-slider"),t=[1500,1200,900,600,300];e.addEventListener("input",n=>{const s=n.target.value;this.battleSpeed=t[parseInt(s,10)]}),this.start()}start(){if(!this.payload)return;this.modalState="reveal";const e=this.querySelector("#continue-button"),t=this.payload.log[0];this.appendLog(a(t.messageKey,t.replacements)),e.textContent=a("global.continue"),this.revealTimeout=window.setTimeout(()=>{this.modalState="battle",this.renderBattleView()},Ye)}handleContinue(){if(!this.payload)return;const e=this.payload.room.type==="room_enemy"||this.payload.room.type==="room_boss";if(this.modalState==="reveal")if(window.clearTimeout(this.revealTimeout),e)this.modalState="battle",this.renderBattleView();else{this.modalState="outcome";const t=this.payload.log[1];t&&this.appendLog(a(t.messageKey,t.replacements))}else this.modalState==="outcome"&&this.dismiss(!1)}renderInitialView(){return`
      <div id="battlefield" class="flex justify-between items-center h-40">
        <div id="battle-adventurer" class="w-1/3 p-2"></div>
        <div id="battle-enemy" class="w-1/3 p-2 text-right"></div>
      </div>
      <ul id="event-log" class="tree-view" style="height: 150px; overflow-y: auto;">
      </ul>
      <div id="progress-container" class="hidden mt-2">
        <progress max="100" value="0" style="width:100%"></progress>
      </div>
      <div id="slider-container" class="hidden justify-end mt-4">
        <fieldset class="w-1/2">
          <legend>${a("global.speed")}</legend>
          <div class="field-row" style="justify-content: center">
            <label for="speed-slider">${a("global.slow")}</label>
            <input id="speed-slider" type="range" min="0" max="4" value="2" />
            <label for="speed-slider">${a("global.fast")}</label>
          </div>
        </fieldset>
      </div>
      <div class="flex justify-end mt-4">
        <button id="continue-button"></button>
      </div>
    `}renderBattleView(){this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#slider-container").classList.remove("hidden");const e=this.querySelector("#continue-button");e.id="skip-button",e.textContent=a("global.skip"),e.onclick=()=>this.dismiss(!0),this.currentEventIndex=1,this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){const o=this.querySelector("#skip-button");o&&(o.textContent=a("global.continue"),o.onclick=()=>this.dismiss(!1));return}const e=this.querySelector("#battle-adventurer"),t=this.querySelector("#battle-enemy"),n=this.querySelector("#battlefield");e.classList.remove("animate-attack","animate-shake","animate-defeat"),t.classList.remove("animate-attack","animate-shake","animate-defeat"),n.classList.remove("animate-shake");const s=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(s.adventurer),s.enemy&&this.renderEnemyStatus(s.enemy),s.animations&&s.animations.forEach(o=>{let r=null;o.target==="adventurer"?r=e:o.target==="enemy"?r=t:r=n,r.classList.add(`animate-${o.animation}`)}),this.appendLog(a(s.messageKey,s.replacements)),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=window.setTimeout(()=>this.renderNextBattleEvent(),this.battleSpeed)}renderAdventurerStatus(e){const t=e.hp/e.maxHp*100;this.querySelector("#battle-adventurer").innerHTML=`
      <div class="text-lg font-bold">${e.firstName} ${e.lastName}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.hp} / ${e.maxHp}</div>
    `}renderEnemyStatus(e){const t=e.currentHp/e.maxHp*100;this.querySelector("#battle-enemy").innerHTML=`
      <div class="text-lg font-bold">${e.name}${e.total>1?` (${e.count}/${e.total})`:""}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.currentHp} / ${e.maxHp}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=this.currentEventIndex/(this.payload.log.length-1);this.querySelector("#progress-container progress").value=e*100}appendLog(e){const t=this.querySelector("#event-log"),n=document.createElement("li");n.textContent=e,t.appendChild(n),t.scrollTop=t.scrollHeight}dismiss(e){clearTimeout(this.battleTimeout),this.querySelector("#progress-container").classList.add("hidden"),this.querySelector("#slider-container").classList.add("hidden"),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const n=document.createElement("encounter-modal");n.payload=e,n.onDismiss=t,document.body.appendChild(n)})}}customElements.define("encounter-modal",ne);const Xe=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:ne},Symbol.toStringTag,{value:"Module"})),$=document.getElementById("app");if(!$)throw new Error("Could not find app element to mount to");async function et(){$.innerHTML="<div>Initializing...</div>";const i=new Me;await le(i);const e=new He,t=new Le(e),n=new Ne(e),s=new ke(t,i,n);s.on("state-change",o=>{if(s.isLoading){$.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(s.error){$.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${s.error}</p>
                    </div>
                </div>
            `;return}Ce($,o,s)}),s.on("show-encounter",async o=>{const{EncounterModal:r}=await oe(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>Xe);return{EncounterModal:l}},void 0);await r.show(o),s.continueEncounter()}),$.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",o=>D.handleMouseEnter(o)),document.body.addEventListener("click",o=>D.handleClick(o)),await s.init(),s.showMenu()}et().catch(i=>{console.error(i),$&&($.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${i.message}</p>
          </div>
      </div>
    `)});
