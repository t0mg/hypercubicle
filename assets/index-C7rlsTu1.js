(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const ie="modulepreload",ae=function(a){return"/hypercubicle/"+a},F={},oe=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let o=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),h=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=o(t.map(c=>{if(c=ae(c),c in F)return;F[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":ie,u||(m.as="script"),m.crossOrigin="",m.href=c,h&&m.setAttribute("nonce",h),document.head.appendChild(m),u)return new Promise((f,v)=>{m.addEventListener("load",f),m.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})};var _=(a=>(a.Arousal="arousal",a.Flow="flow",a.Control="control",a.Relaxation="relaxation",a.Boredom="boredom",a.Apathy="apathy",a.Worry="worry",a.Anxiety="anxiety",a))(_||{});let Z={};async function J(a,e){try{Z=await e.loadJson(`locales/${a}.json`)}catch(t){console.warn(`Failed to load ${a} translations:`,t),a!=="en"&&await J("en",e)}}function re(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function i(a,e={}){let n=a.split(".").reduce((s,r)=>s?s[r]:void 0,Z);if(!n)return console.warn(`Translation not found for key: ${a}`),a;for(const s in e)n=n.replace(`{${s}}`,String(e[s]));return n}async function le(a){const e=re();await J(e,a)}class I{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return I.instance||(I.instance=new I),I.instance}on(e){this.listeners.push(e)}log(e,t="INFO",n){const s=i(`log_messages.${e}`,n),r={message:s,level:t,timestamp:Date.now(),data:n};this.muted||(this.entries.push(r),t!=="DEBUG"&&console.log(`[${t}] ${s}`)),this.listeners.forEach(o=>o(r))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(n=>n(t))}metric(e){const t={message:"metric",level:"DEBUG",timestamp:Date.now(),data:e};this.listeners.forEach(n=>n(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=I.getInstance();return t.loadEntries(e.entries),t}}class ce{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const x=new ce(Date.now()),V=a=>`${a}_${x.nextFloat().toString(36).substr(2,9)}`,de=(a,e)=>x.nextInt(a,e),Y=a=>{const e=[...a];for(let t=e.length-1;t>0;t--){const n=x.nextInt(0,t);[e[t],e[n]]=[e[n],e[t]]}return e},Q=(a,e,t,n)=>{const s=e.filter(d=>a.includes(d.id)),r=[],o={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},h={common:0,uncommon:0,rare:0,legendary:0};Object.keys(o).forEach(d=>{h[d]=Math.floor(t*o[d])});let c=Object.values(h).reduce((d,m)=>d+m,0);for(;c<t;)h.common+=1,c+=1;s.filter(d=>d.cost!==null).forEach(d=>{r.push(n(d)),l[d.rarity]+=1}),Object.keys(o).forEach((d,m)=>{const f=s.filter(v=>v.rarity===d);for(;l[d]<h[d]&&f.length!==0;){const v=x.nextInt(0,f.length-1),g=f[v];r.push(n(g)),l[d]+=1}});const u=s.filter(d=>d.rarity==="common");for(;r.length<t&&u.length>0;){const d=x.nextInt(0,u.length-1),m=u[d];r.push(n(m))}return Y(r)},G=(a,e,t)=>Q(a,e,t,n=>({...n,instanceId:V(n.id)})),U=(a,e,t)=>Q(a,e,t,s=>{const r={...s,instanceId:V(s.id)};return r.type==="room_enemy"&&r.stats.minUnits&&r.stats.maxUnits&&(r.units=de(r.stats.minUnits,r.stats.maxUnits)),r}),he=a=>a.roomHand.length<3&&!a.roomHand.some(e=>e.type==="room_boss"),me=a=>[...new Set(a.hand.map(t=>t.id))].length<2&&a.hand.length>0;function X(a,e){const t=Math.max(0,Math.min(100,a)),n=Math.max(0,Math.min(100,e));return n>66?t<33?_.Anxiety:t<87?_.Arousal:_.Flow:n>33?t<33?_.Worry:t<67?_.Apathy:_.Control:t<67?_.Boredom:_.Relaxation}const H={hp:100,maxHp:100,power:5},ue=3;class ${constructor(e,t){this.hp=H.hp,this.maxHp=H.maxHp,this.power=H.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=_.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=I.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,n)=>t+n,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,n=Math.max(0,Math.min(100,e));this.challengeHistory.push(n),this.challengeHistory.length>ue&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${n})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=X(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{name:this.firstName,from:i("flow_states."+e),to:i("flow_states."+this.flowState)})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=H.power,n=H.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,n+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,n+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(s=>{t+=s.stats.power||0,n+=s.stats.maxHp||0}),this.power=t,this.maxHp=n,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e){const t=e.traits,n=new $(t);return n.hp=e.hp,n.maxHp=e.maxHp,n.power=e.power,n.inventory=e.inventory,n.activeBuffs=e.activeBuffs,n.skill=e.skill,n.challengeHistory=e.challengeHistory,n.flowState=e.flowState,n.roomHistory=e.roomHistory,n.lootHistory=e.lootHistory,n.boredomCounter=e.boredomCounter,n.firstName=e.firstName,n.lastName=e.lastName,n}}const fe=99,pe=10,O=10,K=32,ge=18,_e=8;var C=(a=>(a.WORKSHOP="workshop",a.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",a.HAND_SIZE_INCREASE="hand_size_increase",a.ADVENTURER_TRAITS="ADVENTURER_TRAITS",a.BP_MULTIPLIER="BP_MULTIPLIER",a.WORKSHOP_ACCESS="WORKSHOP_ACCESS",a.BP_MULTIPLIER_2="BP_MULTIPLIER_2",a))(C||{});const ee=[{feature:"workshop",runThreshold:2,title:()=>i("unlocks.workshop.title"),description:()=>i("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>i("unlocks.room_deck_size_increase.title"),description:()=>i("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>i("unlocks.hand_size_increase.title"),description:()=>i("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>i("unlocks.adventurer_traits.title"),description:()=>i("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>i("unlocks.bp_multiplier.title"),description:()=>i("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>i("unlocks.workshop_access.title"),description:()=>i("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>i("unlocks.bp_multiplier_2.title"),description:()=>i("unlocks.bp_multiplier_2.description")}],te=10;function se(a,e){var c,u,d,m;const{traits:t,inventory:n,hp:s,maxHp:r}=a;let o=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((c=n.weapon)==null?void 0:c.stats.power)||0,h=((u=n.armor)==null?void 0:u.stats.maxHp)||0;switch(e.type){case"item_weapon":const f=(e.stats.power||0)-l;if(f<=0&&e.id!==((d=n.weapon)==null?void 0:d.id))return-1;o+=f*(t.offense/10),f>0&&(o+=f*(a.skill/10));const v=e.stats.maxHp||0;v<0&&(o+=v*(100-t.resilience)/20);break;case"item_armor":const g=(e.stats.maxHp||0)-h;if(g<=0&&e.id!==((m=n.armor)==null?void 0:m.id))return-1;o+=g*(100-t.offense)/10,g>0&&(o+=g*(a.skill/10));const y=e.stats.power||0;y>0&&(o+=y*(t.offense/15));const b=e.stats.power||0;b<0&&(o+=b*(t.resilience/10));break;case"item_potion":const k=s/r;o+=10*(100-t.resilience)/100,k<.7&&(o+=20*(1-k)),o+=5*(a.skill/100),n.potions.length>=fe&&(o*=.1);break}return o}function ve(a,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${a.traits.offense}, Resilience: ${a.traits.resilience}, Skill: ${a.skill})`);const n=e.map(o=>({item:o,score:se(a,o)})).filter(o=>o.score>0);if(n.sort((o,l)=>l.score-o.score),n.length===0||n[0].score<pe)return{choice:null,reason:i("game_engine.adventurer_declines_offer")};const s=n[0].item;t.debug(`Adventurer chooses: ${i("items_and_rooms."+s.id)} (Score: ${n[0].score.toFixed(1)})`);const r=i("game_engine.adventurer_accepts_offer",{itemName:i("items_and_rooms."+s.id)});return{choice:s,reason:r}}function be(a,e){const{flowState:t,hp:n,maxHp:s,inventory:r,traits:o}=a,l=n/s;if(r.potions.length===0)return"attack";let h=.5;switch(t){case _.Anxiety:case _.Worry:h=.8;break;case _.Arousal:case _.Flow:h=.6;break;case _.Control:case _.Relaxation:h=.4;break;case _.Boredom:case _.Apathy:h=.2;break}return h-=o.resilience/200,l<Math.max(.1,h)?"use_potion":"attack"}function ye(a,e,t){if(e){a.lootHistory.push(e.id),a.lootHistory.filter(r=>r===e.id).length>2&&(a.modifyChallenge(a.challenge-te),a.logger.info("info_repetitive_choice",{name:i("items_and_rooms."+e.id)}));const s=se(a,e);s>60?(a.modifySkill(10),a.modifyChallenge(a.challenge+5)):s>30?(a.modifySkill(5),a.modifyChallenge(a.challenge+2)):a.modifySkill(2)}else t.length>0?a.modifyChallenge(a.challenge-5):a.modifyChallenge(a.challenge-10);a.updateFlowState()}function we(a,e){a.roomHistory.push(e.id),a.roomHistory.filter(s=>s===e.id).length>2&&(a.modifyChallenge(a.challenge-te),a.logger.info("info_deja_vu",{name:i("items_and_rooms."+e.id)}));let n=0;switch(e.type){case"room_enemy":n=5;break;case"room_boss":n=15;break;case"room_trap":n=10;break;case"room_healing":n=-15;break}a.modifyChallenge(a.challenge+n),a.updateFlowState()}function Se(a){a.modifySkill(-2),a.updateFlowState()}function P(a,e){switch(e){case"hit":a.modifySkill(.5);break;case"miss":a.modifySkill(-.5);break;case"take_damage":a.modifyChallenge(a.challenge+1);break}a.updateFlowState()}function xe(a,e,t,n){let s;return e>.7?(s=i("game_engine.too_close_for_comfort"),a.modifyChallenge(a.challenge+10),a.modifySkill(-3)):e>.4?(s=i("game_engine.great_battle"),a.modifyChallenge(a.challenge+5),a.modifySkill(5)):t>3&&a.traits.offense>60?(s=i("game_engine.easy_fight"),a.modifyChallenge(a.challenge-10)):(s=i("game_engine.worthy_challenge"),a.modifyChallenge(a.challenge-2),a.modifySkill(2)),t===n&&a.modifySkill(1*t),a.updateFlowState(),s}const p=I.getInstance();class ke{constructor(e,t,n){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=s=>{this.metaManager.incrementAdventurers();const r={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0};p.loadEntries([]);const o=new $(r,this._allNames),l=(s==null?void 0:s.items)||this._allItems.filter(y=>y.cost===null).map(y=>y.id),h=G(l,this._allItems,K),c=this._getHandSize(),u=h.slice(0,c),d=h.slice(c),m=(s==null?void 0:s.rooms)||this._allRooms.filter(y=>y.cost===null).map(y=>y.id),f=U(m,this._allRooms,this._getRoomDeckSize()),v=f.slice(0,c),g=f.slice(c);this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:o,unlockedDeck:l,availableDeck:d,hand:u,unlockedRoomDeck:m,availableRoomDeck:g,roomHand:v,handSize:c,shopItems:[],offeredLoot:[],offeredRooms:[],run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},p.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),p.debug(`Deck size: ${h.length}, Hand size: ${c}, Room Deck size: ${f.length}, Room Hand size: ${v.length}`),p.info("info_designer_choosing_room",{name:o.firstName}),this._emit("state-change",this.gameState)},this.continueGame=()=>{const s=this.gameSaver.load();s?(this.gameState=s,this._emit("state-change",this.gameState),this.gameState.phase==="AWAITING_ENCOUNTER_RESULT"&&this.gameState.encounterPayload&&this._emit("show-encounter",this.gameState.encounterPayload)):this.startNewGame()},this.startNewRun=s=>{if(!this.gameState)return;const r=s||this.gameState.run+1;this.metaManager.updateRun(r);const o=this._getHandSize(),l=G(this.gameState.unlockedDeck,this._allItems,K),h=l.slice(0,o),c=l.slice(o),u=U(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),d=u.slice(0,o),m=u.slice(o),f=new $(this.gameState.adventurer.traits,this._allNames);f.skill=this.gameState.adventurer.skill,f.challengeHistory=[...this.gameState.adventurer.challengeHistory],f.flowState=this.gameState.adventurer.flowState,p.info("info_adventurer_returns",{name:f.firstName}),p.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:f,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:c,hand:h,availableRoomDeck:m,roomHand:d,handSize:o,room:1,run:r,runEnded:{isOver:!1,reason:"",success:!1,decision:null}},p.info("info_designer_choosing_room",{name:f.firstName}),this._emit("state-change",this.gameState)},this.presentOffer=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const r=this.gameState.hand.filter(w=>s.includes(w.instanceId));this.gameState.offeredLoot=r;const o=this.gameState.adventurer,{choice:l,reason:h}=ve(o,this.gameState.offeredLoot,p),c=this.gameState.offeredLoot.map(w=>i("items_and_rooms."+w.id)).join(", ");p.info("info_loot_chosen",{name:o.firstName,items:c}),p.info("info_loot_choice_reason",{reason:h});const u=o.flowState;ye(o,l,this.gameState.offeredLoot),u!==o.flowState&&p.metric({event:"flow_state_changed",flowState:o.flowState}),l?(p.info("info_item_chosen",{name:o.firstName,item:i("items_and_rooms."+l.id)}),p.metric({event:"item_chosen",item:l})):p.info("info_loot_declined",{name:o.firstName});let d=this.gameState.hand,m=this.gameState.availableDeck;d.forEach(w=>w.justDrafted=!1);let f=d.filter(w=>!s.includes(w.instanceId));const v=this.gameState.handSize-f.length,g=m.slice(0,v);g.forEach(w=>{w.draftedRoom=this.gameState.room,w.justDrafted=!0});const y=m.slice(v);f.push(...g),l&&(l.type==="item_potion"?o.addPotion(l):l.type==="item_buff"?o.applyBuff(l):o.equip(l));const b=this.gameState.room+1,k=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:o,availableDeck:y,hand:f,room:b,designer:{balancePoints:k}},this._emit("state-change",this.gameState)},this.runEncounter=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=s;const r=x.nextInt(0,this.gameState.offeredRooms.length-1),o=this.gameState.offeredRooms[r];if(this.gameState.offeredRooms.length===1&&o.type==="room_boss")p.info("info_boss_room_chosen",{name:this.gameState.adventurer.firstName,chosenRoom:i("items_and_rooms."+o.id)});else{const u=this.gameState.offeredRooms.map(d=>i("items_and_rooms."+d.id)).join(", ");p.info("info_room_chosen",{name:this.gameState.adventurer.firstName,rooms:u,chosenRoom:i("items_and_rooms."+o.id)})}p.metric({event:"room_encountered",room:o});const{log:l,finalAdventurer:h}=this._generateEncounterLog(this.gameState.adventurer,o),c={room:o,log:l,finalAdventurer:h};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT",encounterPayload:c},this._emit("state-change",this.gameState),this._emit("show-encounter",c)},this.continueEncounter=()=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate()},this._postEncounterUpdate=()=>{if(!this.gameState)return;const s=$.fromJSON(this.gameState.encounterPayload.finalAdventurer);s.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let r=this.gameState.roomHand,o=this.gameState.availableRoomDeck;r.forEach(m=>m.justDrafted=!1);const l=this.gameState.offeredRooms.map(m=>m.instanceId);let h=r.filter(m=>!l.includes(m.instanceId));const c=this.gameState.handSize-h.length,u=o.slice(0,c);u.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const d=o.slice(c);if(h.push(...u),this.gameState.adventurer=s,s.hp<=0){this._endRun(i("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(s.boredomCounter>2){const m=s.flowState===_.Boredom?i("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):i("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(m);return}this.gameState.hand&&this.gameState.hand.length===0?(p.warn("warn_empty_hand",{name:s.firstName}),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},encounterPayload:void 0,roomHand:h,availableRoomDeck:d},p.info("info_designer_choosing_room",{name:s.firstName})):(this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",encounterPayload:void 0,roomHand:h,availableRoomDeck:d},p.info("info_designer_choosing_loot",{name:s.firstName})),this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(i("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this.metaManager.acls.has(C.WORKSHOP)){p.debug("Workshop not unlocked, starting new run directly."),this.startNewRun();return}p.info("info_entering_workshop",{name:this.gameState.adventurer.firstName});const s=this.gameState.run+1,r=this._allItems.filter(h=>h.cost!==null).filter(h=>!this.gameState.unlockedDeck.includes(h.id)),o=this._allRooms.filter(h=>h.cost!==null).filter(h=>!this.gameState.unlockedRoomDeck.includes(h.id)),l=[...r,...o];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:s,room:0,shopItems:Y(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},p.info("info_welcome_to_workshop"),this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=s=>{if(!this.gameState)return;const r=this._allItems.find(v=>v.id===s),o=this._allRooms.find(v=>v.id===s),l=r||o;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let h=this.gameState.unlockedDeck,c=this.gameState.unlockedRoomDeck,u=this.gameState.availableDeck,d=this.gameState.availableRoomDeck;r?(h=[...this.gameState.unlockedDeck,s],this.isWorkshopAccessUnlocked()&&(u=[r,...this.gameState.availableDeck])):o&&(c=[...this.gameState.unlockedRoomDeck,s],this.isWorkshopAccessUnlocked()&&(d=[o,...this.gameState.availableRoomDeck]));const m=this.gameState.designer.balancePoints-l.cost,f=this.gameState.shopItems.filter(v=>v.id!==s);p.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:i("items_and_rooms."+l.id)}),p.metric({event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:m},unlockedDeck:h,unlockedRoomDeck:c,availableDeck:u,availableRoomDeck:d,shopItems:f},this._emit("state-change",this.gameState)},this.quitGame=(s=!0)=>{s&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(C.BP_MULTIPLIER_2)?O*4:this.metaManager.acls.has(C.BP_MULTIPLIER)?O*2:O,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=n}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const n=this._listeners[e];n&&n.forEach(s=>s(...t))}_createAdventurerSnapshot(e){return{firstName:e.firstName,lastName:e.lastName,hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var o;const n=[],s=$.fromJSON(e.toJSON());p.info("info_encounter",{name:s.firstName,roomName:i("items_and_rooms."+t.id)});const r=s.flowState;switch(we(s,t),r!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_encounter",replacements:{name:s.firstName,roomName:i("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(s)}),t.type){case"room_enemy":case"room_boss":{const l={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let h=0;const c=s.hp;for(let v=0;v<l.enemyCount;v++){let g=l.enemyHp;p.info("info_encounter_enemy",{name:s.firstName,enemyName:t.entity_id?i("entities."+t.entity_id):i("items_and_rooms."+t.id),current:v+1,total:l.enemyCount});const y=t.entity_id?i("entities."+t.entity_id):i("items_and_rooms."+t.id),b={currentHp:g,maxHp:l.enemyHp,power:l.enemyPower,name:y,count:v+1,total:l.enemyCount};for(n.push({messageKey:"log_messages.info_encounter_enemy",replacements:{name:s.firstName,enemyName:t.entity_id?i("entities."+t.entity_id):i("items_and_rooms."+t.id),current:v+1,total:l.enemyCount},adventurer:this._createAdventurerSnapshot(s),enemy:b});g>0&&s.hp>0;){if(be(s)==="use_potion"){const S=s.inventory.potions.shift();if(S){const E=S.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+E),p.info("info_adventurer_drinks_potion",{name:s.firstName,potionName:i("items_and_rooms."+S.id)}),n.push({messageKey:"log_messages.info_adventurer_drinks_potion",replacements:{name:s.firstName,potionName:i("items_and_rooms."+S.id)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})}}else{const S=Math.min(.95,.75+s.traits.skill/500+s.traits.offense/1e3);if(x.nextFloat()<S){const E=s.power;g-=E,p.debug(`Adventurer hits for ${E} damage.`);const N=s.flowState;P(s,"hit"),N!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:i(`flow_states.${N}`),to:i(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_adventurer_hit",replacements:{name:s.firstName,damage:E},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"attack"},{target:"enemy",animation:"shake"}]})}else{p.debug("Adventurer misses.");const E=s.flowState;P(s,"miss"),E!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:i(`flow_states.${E}`),to:i(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_adventurer_miss",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"attack"}]})}}if(g<=0){p.info("info_enemy_defeated",{enemyName:b.name}),h++,n.push({messageKey:"log_messages.info_enemy_defeated",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:0},animations:[{target:"enemy",animation:"defeat"}]});break}const w=Math.max(.4,.75-s.traits.skill/500-(100-s.traits.offense)/1e3);if(x.nextFloat()<w){const S=(((o=s.inventory.armor)==null?void 0:o.stats.maxHp)||0)/10,E=Math.max(1,l.enemyPower-S);s.hp-=E,p.debug(`Enemy hits for ${E} damage.`);const N=s.flowState;P(s,"take_damage"),N!==s.flowState&&(p.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:i(`flow_states.${N}`),to:i(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g}})),n.push({messageKey:"log_messages.info_enemy_hit",replacements:{damage:E,enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"enemy",animation:"attack"},{target:"adventurer",animation:"shake"}]})}else p.debug("Enemy misses."),n.push({messageKey:"log_messages.info_enemy_miss",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"enemy",animation:"attack"}]})}if(s.hp<=0){p.warn("info_adventurer_defeated",{name:s.firstName}),n.push({messageKey:"log_messages.info_adventurer_defeated",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:g},animations:[{target:"adventurer",animation:"defeat"}]});break}}const u=c-s.hp,d=u/s.maxHp;p.debug(`hpLost: ${u}, hpLostRatio: ${d.toFixed(2)}`);const m=s.flowState,f=xe(s,d,h,l.enemyCount);m!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),p.info("info_battle_outcome",{outcome:f});break}case"room_healing":{const l=t.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+l),p.info("info_healing_room",{name:s.firstName,healingRoomName:i("items_and_rooms."+t.id),healing:l}),n.push({messageKey:"log_messages.info_healing_room",replacements:{name:s.firstName,healingRoomName:i("items_and_rooms."+t.id),healing:l},adventurer:this._createAdventurerSnapshot(s)});break}case"room_trap":{const l=t.stats.attack||0;s.hp-=l;const h=s.flowState;Se(s),h!==s.flowState&&p.metric({event:"flow_state_changed",flowState:s.flowState}),p.info("info_trap_room",{name:s.firstName,trapName:i("items_and_rooms."+t.id),damage:l}),n.push({messageKey:"log_messages.info_trap_room",replacements:{name:s.firstName,trapName:i("items_and_rooms."+t.id),damage:l},adventurer:this._createAdventurerSnapshot(s)});break}}return{log:n,finalAdventurer:s}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const n=this.metaManager.checkForUnlocks(this.gameState.run);p.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),p.metric({event:"run_end",bp:this.gameState.designer.balancePoints}),p.error("info_game_over",{reason:e});const s=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:s},newlyUnlocked:n},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:n}=this.gameState.adventurer,{resilience:s,offense:r}=t,o=Math.min(n/100,1);if(e===_.Flow)return"continue";let l=.55;switch(e){case _.Anxiety:l+=.25-s/400;break;case _.Arousal:l-=.1-r/1e3;break;case _.Worry:l+=.2;break;case _.Control:l-=.15;break;case _.Relaxation:l+=.1;break;case _.Boredom:l+=.3;break;case _.Apathy:l+=.4;break}return l-=o*.1,l=Math.max(.05,Math.min(.95,l)),x.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(p.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0},t=new $(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(C.HAND_SIZE_INCREASE)?12:_e}_getRoomDeckSize(){return this.metaManager.acls.has(C.ROOM_DECK_SIZE_INCREASE)?36:ge}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(C.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(C.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||i("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class M{constructor(e,t,n,s){this.resolve=s;const r=document.createElement("div");r.dataset.testid="info-modal-overlay",Object.assign(r.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),r.addEventListener("click",g=>{if(g.target===r){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}});const o=document.createElement("div");this.element=o,o.className="window",o.style.width="min(90vw, 800px)",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const h=document.createElement("div");h.id="info-modal-title",h.className="title-bar-text",h.textContent=e,l.appendChild(h),o.appendChild(l);const c=document.createElement("div");c.className="window-body text-center p-4";const u=document.createElement("div");u.innerHTML=t,c.appendChild(u);const d=document.createElement("div");d.className="flex justify-center gap-2 mt-4",n.forEach(g=>{const y=document.createElement("button");y.textContent=g.text,y.addEventListener("click",()=>{this.dismiss(g.value)}),d.appendChild(y)}),c.appendChild(d),o.appendChild(c),r.appendChild(o),document.body.appendChild(r),this.handleKeydown=g=>{if(g.key==="Escape"){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}},document.addEventListener("keydown",this.handleKeydown);const m=o.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),f=m[0],v=m[m.length-1];f==null||f.focus(),o.addEventListener("keydown",g=>{g.key==="Tab"&&(g.shiftKey?document.activeElement===f&&(v.focus(),g.preventDefault()):document.activeElement===v&&(f.focus(),g.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,n){return new Promise(s=>{new M(e,t,n,s)})}static showInfo(e,t,n=i("global.continue")){const s=[{text:n,value:void 0}];return M.show(e,t,s)}}class z{static show(e,t){const n=[{text:i("global.cancel"),value:!1,variant:"secondary"},{text:i("global.confirm"),value:!0,variant:"primary"}];return M.show(e,t,n)}}class Ee extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t){if(this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show"),this.isDesktop&&t){const n=t.getBoundingClientRect(),s=this.getBoundingClientRect();let r=n.top-s.height-10,o=n.left+n.width/2-s.width/2;r<0?(r=n.bottom+10,this.contentContainer.classList.add("flipped")):this.contentContainer.classList.remove("flipped"),o<0?o=5:o+s.width>window.innerWidth&&(o=window.innerWidth-s.width-5),this.style.top=`${r}px`,this.style.left=`${o}px`}}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ee);class L{constructor(){this.showTimeout=null,this.hideTimeout=null,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox),this.mutationObserver=new MutationObserver(()=>{this.tooltipBox.hide(),this.activeToolipKey=""})}static getInstance(){return L.instance||(L.instance=new L),L.instance}initializeTooltipIcons(){document.querySelectorAll("[data-tooltip-key]").forEach(t=>{if(t.querySelector(".tooltip-icon"))return;const n=document.createElement("span");n.textContent="?",n.className="tooltip-icon",t.appendChild(n)})}handleMouseEnter(e){if(this.isTouchDevice())return;const t=this.findTooltipKeyElement(e.target),n=t&&t.getAttribute("data-tooltip-key");this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),n&&this.activeToolipKey!==n&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=n;const s=this.getTooltipContent(n);s&&(this.mutationObserver.observe(document,{childList:!0,subtree:!0}),this.tooltipBox.show(s,t))},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.mutationObserver.disconnect(),this.tooltipBox.hide(),this.activeToolipKey="")}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const n=this.findTooltipKeyElement(t.parentElement),s=n.getAttribute("data-tooltip-key");if(s){const r=this.getTooltipContent(s);r&&this.tooltipBox.show(r,n)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKeyElement(e){return e?e.hasAttribute("data-tooltip-key")?e:this.findTooltipKeyElement(e.parentElement):null}getTooltipContent(e){const t=i(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let n=i(`tooltips.${e}.title`);return n.includes("tooltips.")&&(n=i("global.information")),{title:n,body:t}}}const D=L.getInstance(),Ie=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,Ce=(a,e,t)=>{if(D.handleMouseLeave(),!e){a.innerHTML=`<div>${i("global.loading")}</div>`;return}switch(e.phase){case"MENU":Re(a,t);break;case"SHOP":Te(a,e,t);break;default:$e(a,e,t);break}D.initializeTooltipIcons()},j=(a,e,t)=>{const n=document.createElement("choice-panel");return n.engine=e,t==="item"?(n.choices=a.hand,n.deckType="item",n.offerImpossible=me(a)):(n.choices=a.roomHand,n.deckType="room",n.roomSelectionImpossible=he(a)),n},$e=(a,e,t)=>{var h;if(!a.querySelector("adventurer-status")){a.innerHTML=Ie;const c=a.querySelector("#game-title");c&&(c.textContent=i("game_title"));const u=a.querySelector("#adventurer-status-title");u&&(u.textContent=i("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(h=a.querySelector("#quit-game-btn"))==null||h.addEventListener("click",async()=>{await z.show(i("global.quit"),i("global.quit_confirm"))&&t.quitGame(!1)})}const n=a.querySelector("adventurer-status"),s=a.querySelector("log-panel"),r=a.querySelector("game-stats"),o=a.querySelector("#game-phase-panel"),l=a.querySelector("#game-phase-title");switch(n.metaState=t.metaManager.metaState,n.adventurer=e.adventurer,r.engine=t,t.isWorkshopUnlocked()?r.setAttribute("balance-points",e.designer.balancePoints.toString()):r.removeAttribute("balance-points"),r.setAttribute("run",e.run.toString()),r.setAttribute("room",e.room.toString()),r.setAttribute("deck-size",e.availableDeck.length.toString()),r.setAttribute("room-deck-size",e.availableRoomDeck.length.toString()),s.logger=I.getInstance(),s.traits=e.adventurer.traits,o.innerHTML="",e.phase){case"RUN_OVER":{l&&(l.textContent=i("run_ended_screen.run_complete"));const c=document.createElement("run-ended-screen");c.setAttribute("final-bp",e.designer.balancePoints.toString()),c.setAttribute("reason",e.runEnded.reason),c.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&c.setAttribute("workshop-unlocked",""),e.runEnded.decision&&c.initialize(e.runEnded.decision,e.newlyUnlocked,t),o.appendChild(c);break}case"DESIGNER_CHOOSING_LOOT":l&&(l.textContent=i("choice_panel.title")),o.appendChild(j(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":l&&(l.textContent=i("choice_panel.title_room")),o.appendChild(j(e,t,"room"));break;default:l&&(l.textContent="...");break}},Re=(a,e)=>{a.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,a.appendChild(t)},Te=(a,e,t)=>{a.innerHTML="";const n=document.createElement("workshop-screen");n.items=e.shopItems,n.balancePoints=e.designer.balancePoints,n.engine=t,a.appendChild(n)},W="hypercubicle-meta";class Le{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const n of ee)e>=n.runThreshold&&!this._metaState.unlockedFeatures.includes(n.feature)&&(this._metaState.unlockedFeatures.push(n.feature),t.push(n.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(W);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(W,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const A="hypercubicle-savegame",q="1.0.1";class Ne{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(A,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(A);if(e){const t=JSON.parse(e);return t.version!==q?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${q}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(A)!==null}clear(){this.storage.removeItem(A)}_serialize(e){const{adventurer:t,...n}=e;return{version:q,...n,adventurer:t.toJSON(),logger:I.getInstance().toJSON()}}_deserialize(e){const{adventurer:t,logger:n,...s}=e;I.getInstance().loadEntries(n.entries);const o=$.fromJSON(t),{version:l,...h}=s;return{...h,adventurer:o}}}class He{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Me{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',De=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class ze extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,n;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(n=this._metaState)==null?void 0:n.unlockedFeatures.includes(C.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${i("adventurer_status.flow_state")}</legend>
              <div class="flex gap-2 items-center">
                <div id="flow-state-text" class="font-mono text-xl text-center flex-grow"></div>
                <flow-chart></flow-chart>
              </div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Ae()} <span>${i("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${De()} <span class="ml-1">${i("global.power")}</span></div>
                    <span id="power-text" class="font-mono text-lg"></span>
                </div>
            </div>

            <fieldset id="traits-section" class="${e?"":"hidden"} mt-2">
                <legend>${i("adventurer_status.traits",{defaultValue:"Traits"})}</legend>
                <div class="flex justify-around text-center">
                    <div>
                        <span class="block text-xs">${i("log_panel.offense")}</span>
                        <span id="offense-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${i("log_panel.resilience")}</span>
                        <span id="resilience-trait" class="font-mono"></span>
                    </div>
                    <div>
                        <span class="block text-xs">${i("log_panel.skill")}</span>
                        <span id="skill-trait" class="font-mono"></span>
                    </div>
                </div>
            </fieldset>

            <fieldset class="mt-2">
                <legend>${i("adventurer_status.inventory")}</legend>
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div id="weapon-slot" class="sunken-panel p-1"></div>
                    <div id="armor-slot" class="sunken-panel p-1"></div>
                    <div id="buffs-slot" class="sunken-panel p-1"></div>
                    <div id="potions-slot" class="sunken-panel p-1"></div>
                </div>
            </fieldset>
        `,this._hasRendered=!0}update(){var h;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const n=this.querySelector("#flow-state-text");n.textContent=i(`flow_states.${this._adventurer.flowState}`),n.className=`font-mono text-xl text-center flex-grow ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(n);const s=this.querySelector("flow-chart");s.setAttribute("skill",`${this._adventurer.skill}`),s.setAttribute("challenge",`${this._adventurer.challenge}`);const r=this.querySelector("#power-text");r.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(r);const o=(h=this._metaState)==null?void 0:h.unlockedFeatures.includes(C.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(o){l.classList.remove("hidden");const c=this.querySelector("#offense-trait"),u=this.querySelector("#resilience-trait"),d=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(u),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(d),c.textContent=`${this._adventurer.traits.offense}`,u.textContent=`${this._adventurer.traits.resilience}`,d.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Oe(),i("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${i("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${i("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${i("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${i("global.none")}</p>`),this.updateInventorySlot("armor-slot",Pe(),i("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${i("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${i("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${i("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${i("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Be(),i("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div class="text-xs">
                <p>${i("items_and_rooms."+c.id)} (${i("global.duration")}: ${c.stats.duration})</p>
                <p>${Object.entries(c.stats).filter(([u])=>u!=="duration").map(([u,d])=>`${i(`global.${u}`)}: ${d}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${i("global.none")}</p>`),this.updateInventorySlot("potions-slot",qe(),i("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${i("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${i("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-shake"),e.addEventListener("animationend",()=>{e.classList.remove("animate-shake")},{once:!0}))}updateInventorySlot(e,t,n,s){const r=this.querySelector(`#${e}`);r.dataset.content!==s&&(r.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${n}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${s}
                </div>
            `,r.dataset.content=s)}getFlowStateColor(e){switch(e){case _.Boredom:case _.Apathy:return"text-red-500";case _.Anxiety:case _.Worry:return"text-orange-500";case _.Arousal:case _.Control:case _.Relaxation:return"text-blue";case _.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",ze);class Fe extends HTMLElement{constructor(){super(),this._skill=50,this._challenge=50,this._canvas=null,this._ctx=null,this._backgroundRendered=!1}static get observedAttributes(){return["skill","challenge"]}connectedCallback(){this.innerHTML=`
      <div class="relative" style="width: 100px; height: 100px;">
        <canvas width="100" height="100" style="image-rendering: pixelated;"></canvas>
        <div id="flow-chart-dot" style="position: absolute; width: 8px; height: 8px; background-color: white; border: 1px solid black; border-radius: 50%; transform: translate(-50%, -50%); transition-delay: 0.5s; transition: 0.5s ease;"></div>
      </div>
    `,this._canvas=this.querySelector("canvas"),this._ctx=this._canvas.getContext("2d"),this.render()}attributeChangedCallback(e,t,n){t!==n&&(e==="skill"&&(this._skill=parseFloat(n)),e==="challenge"&&(this._challenge=parseFloat(n)),this.render())}render(){if(!this._ctx||!this._canvas)return;this._backgroundRendered||this._renderBackground();const e=this.querySelector("#flow-chart-dot"),t=Math.max(0,Math.min(100,this._skill)),n=100-Math.max(0,Math.min(100,this._challenge));e.style.left=`${t}%`,e.style.top=`${n}%`}_renderBackground(){if(!this._ctx||!this._canvas)return;const e=this._ctx;for(let t=0;t<100;t++)for(let n=0;n<100;n++){const s=X(t,100-n);e.fillStyle=this.getFlowStateCanvasColor(s),e.fillRect(t,n,1,1)}e.font='12px "Pixelated MS Sans Serif"',e.fillStyle="black",e.strokeStyle="white",e.lineWidth=2,e.textAlign="center",e.strokeText("Skill",50,95),e.fillText("Skill",50,95),e.save(),e.translate(12,50),e.rotate(-Math.PI/2),e.strokeText("Challenge",0,0),e.fillText("Challenge",0,0),e.restore(),this._backgroundRendered=!0}getFlowStateCanvasColor(e){switch(e){case _.Apathy:return"rgba(239, 68, 68, 0.2)";case _.Boredom:return"rgba(239, 68, 68, 0.6)";case _.Anxiety:return"rgba(249, 115, 22, 0.6)";case _.Worry:return"rgba(249, 115, 22, 0.2)";case _.Arousal:return"rgba(59, 130, 246, 0.8)";case _.Control:return"rgba(59, 130, 246, 0.4)";case _.Relaxation:return"rgba(59, 130, 246, 0.2)";case _.Flow:return"#eab308";default:return"#000000"}}}customElements.define("flow-chart",Fe);class Ge extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,n){this.decision=e,this.newlyUnlocked=t,this.engine=n,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=ee.find(s=>s.feature===this.newlyUnlocked[0]);if(!e)return;const t=i("unlocks.title"),n=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await M.showInfo(t,n,i("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const n=this.querySelector("#decision-container");n&&(n.innerHTML=`<p>${i("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||i("run_ended_screen.default_reason");this.innerHTML=`
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
                    <p>${i("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                </div>
                <div id="button-container" class="flex justify-center gap-4 mt-4">
                    <!-- Buttons will be revealed here -->
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),n=this.querySelector("#button-container");if(!t||!n||this.state!=="decision-revealed")return;let s="",r="";const o=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(s=`
                <h3 class="${o}" style="color: var(--color-stat-positive);">${i("run_ended_screen.continue_quote")}</h3>
                <p class="${o}" style="animation-delay: 0.5s;">${i("run_ended_screen.continue_decision")}</p>
            `,r=`
                <button id="continue-run-button" class="${o}" style="animation-delay: 1.2s;">
                    ${i(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(s=`
                <h3 class="${o}" style="color: var(--color-stat-negative);">${i("run_ended_screen.retire_quote")}</h3>
                <p class="${o}" style="animation-delay: 0.5s;">${i("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,r=`
                <button id="retire-run-button" class="${o}" style="animation-delay: 1s;">
                    ${i("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=s,n.innerHTML=r}}customElements.define("run-ended-screen",Ge);class Ue extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,n){switch(e){case"balance-points":this._balancePoints=Number(n);break;case"run":this._run=Number(n);break;case"room":this._room=Number(n);break;case"deck-size":this._deckSize=Number(n);break;case"room-deck-size":this._roomDeckSize=Number(n);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="status-bar">

                ${this._balancePoints!==null?`
                <p class="status-bar-field" data-tooltip-key="status_bar_balance_points">
                    <span class="text-xs">${i("global.bp")}: ${this._balancePoints}</span>
                </p>
                `:""}
                <p class="status-bar-field" data-tooltip-key="status_bar_current_run">
                    <span class="text-xs">${i("global.run")}: ${this._run}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_current_room">
                    <span class="text-xs">${i("global.room")}: ${this._room}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_deck_size">
                    <span class="text-xs">${i("global.deck")}: ${this._deckSize}</span>
                </p>
                <p class="status-bar-field" data-tooltip-key="status_bar_room_deck_size">
                    <span class="text-xs">${i("global.rooms")}: ${this._roomDeckSize}</span>
                </p>

                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                    <button id="enter-workshop-btn">${i("global.workshop")}</button>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var n;(n=this.engine)==null||n.enterWorkshop()})}}customElements.define("game-stats",Ue);class Ke extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const n=this.querySelector("#log-container");if(n){const s=document.createElement("p");s.className=this._getLogColor(e.level),s.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,n.appendChild(s)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const s=t.map((r,o)=>`<p class="${this._getLogColor(r.level)}">[${o.toString().padStart(3,"0")}] ${r.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${s}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let s=this._renderedLogCount;s<t.length;s++)this._appendEntry(t[s],s);this._renderedLogCount=t.length}const n=this.querySelector("#log-container");n&&(n.scrollTop=n.scrollHeight)}}customElements.define("log-panel",Ke);const je={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},T=(a,e,t=!0,n=1)=>{const s=t?"text-green-600":"text-red-400",r=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${s}">
            <span ${n>1?'data-tooltip-key="multiple_units"':""}>${a}${n>1?i("global.units"):""}</span>
            <span class="font-mono">${r}${e}</span>
        </div>
    `};class We extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const n=this.querySelector('input[type="checkbox"]');n&&!n.disabled&&(n.checked=!n.checked,n.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=je[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",n=`card-checkbox-${this._item.instanceId}`;let s="";this._isSelectable&&(this._isDisabled?s="opacity-50 cursor-not-allowed":s="cursor-pointer");const r=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s} ${r}`;let o=i("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const c=this._item,u=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${c.stats.hp?T(i("global.health"),c.stats.hp,c.stats.hp>0):""}
            ${c.stats.maxHp?T(i("global.max_hp"),c.stats.maxHp,c.stats.maxHp>0):""}
            ${c.stats.power?T(i("global.power"),c.stats.power,c.stats.power>0):""}
            ${c.stats.duration?T(i("global.duration"),c.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${u.stats.hp?T(i("global.health"),u.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${u.stats.attack?T(i("global.attack"),u.stats.attack,!1,u.units):""}
            ${u.stats.hp?T(i("global.health"),u.stats.hp,!1,u.units):""}
          `,u.units>1&&(o=i("choice_panel.multiple_enemies_title",{name:o,count:u.units}));break}}this._stackCount>1&&(o=i("choice_panel.stacked_items_title",{name:o,count:this._stackCount}));const h=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${h} text-left flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${i("card_types."+this._item.type)} - ${i("rarity."+this._item.rarity)}</legend>
        <div class="p-2 grow">
            <p class="font-bold text-sm ${e}">${o}</p>
            <div class="mt-2">
                ${l}
            </div>
            ${this._isSelectable&&!this._purchaseInfo?`
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${n}" ${this._isSelected?"checked":""} ${this._isDisabled?"disabled":""}>
              <label for="${n}" class="ml-2 text-sm">${i("card.select")}</label>
            </div>
            `:""}
            ${this._purchaseInfo?`
            <div class="mt-4 text-center">
                <button
                    data-item-id="${this._item.id}"
                    ${this._purchaseInfo.canAfford?"":"disabled"}
                    class="w-full"
                >
                    ${i("global.buy")} (${this._purchaseInfo.cost} ${i("global.bp")})
                </button>
            </div>
            `:""}
        </div>
      </fieldset>
    `}}customElements.define("choice-card",We);const B=4;class Ze extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const n=this._choices.filter(s=>this._selectedIds.includes(s.instanceId));this.engine.runEncounter(n)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(s=>s.instanceId===e);if(!t)return;const n=this._selectedIds.includes(e);if(this._deckType==="room"){const s=t.type==="room_boss";if(n)this._selectedIds=this._selectedIds.filter(r=>r!==e);else{const o=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");s&&this._selectedIds.length===0?this._selectedIds.push(e):!s&&!o&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const r=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);r.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!r.includes(l)):this._selectedIds.length<B&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e={item_weapon:0,item_armor:1,item_potion:2,item_buff:3},t={room_healing:0,room_trap:1,room_enemy:2,room_boss:3},n=["attack","hp","power","maxHp"],s=[...this._choices].sort((d,m)=>{var y,b;const f=this._deckType==="item"?e:t,v=d.type,g=m.type;if(v in f&&g in f){const k=f[v]-f[g];if(k!==0)return k}for(const k of n){let w=((y=d.stats)==null?void 0:y[k])??null,S=((b=m.stats)==null?void 0:b[k])??null;if(k=="attack"&&this._deckType==="room"&&(w*=d.units||1,S*=m.units||1),w!==null&&S!==null){if(w!==S)return w-S}else{if(w!==null)return 1;if(S!==null)return-1}}return 0}),r=this._deckType==="room";let o;if(r)o=s;else{const d=new Map;s.forEach(m=>{const f=m;d.has(f.id)?d.get(f.id).count++:d.set(f.id,{choice:f,count:1})}),o=Array.from(d.values()).map(m=>({...m.choice,stackCount:m.count}))}i(r?"choice_panel.title_room":"choice_panel.title");let l=i(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?l=i("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(l=i("choice_panel.roll_credits"));let h=!1,c=l;this._offerImpossible||this._roomSelectionImpossible?h=!0:r?this._choices.filter(f=>this._selectedIds.includes(f.instanceId)).some(f=>f.type==="room_boss")?(h=this._selectedIds.length===1,c=`${l} (1/1)`):(h=this._selectedIds.length===3,c=`${l} (${this._selectedIds.length}/3)`):(h=this._selectedIds.length>=2&&this._selectedIds.length<=B,c=`${l} (${this._selectedIds.length}/${B})`),this.innerHTML=`
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
    `;const u=this.querySelector("#loot-card-container");u&&o.forEach(d=>{const m=document.createElement("choice-card");m.item=d,"stackCount"in d&&(m.stackCount=d.stackCount),m.isSelected=this._selectedIds.includes(d.instanceId);let f=this._disabled;if(this._offerImpossible)f=!0;else if(r){const v=this._choices.filter(y=>this._selectedIds.includes(y.instanceId)),g=v.some(y=>y.type==="room_boss");m.isSelected?f=!1:(g||d.type==="room_boss"&&v.length>0||v.length>=3)&&(f=!0)}else{const v=new Map(this._choices.map(b=>[b.instanceId,b.id])),g=this._selectedIds.map(b=>v.get(b));f=!m.isSelected&&g.includes(d.id)||this._disabled}m.isDisabled=f,m.isNewlyDrafted=d.justDrafted&&this._initialRender||!1,u.appendChild(m)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ze);class Je extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,n=t.dataset.itemId;n&&this.engine&&this.engine.purchaseItem(n),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
      <div class="window max-w-800">
        <div class="title-bar">
          <div class="title-bar-text">${i("workshop.title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-brand-text-muted">${i("workshop.description")}</p>
          <p class="text-center mt-4 text-2xl">
            ${i("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" id="item-cards">
            ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${i("workshop.no_new_items")}</p>`:""}
          </div>

          <div class="text-center">
            <button id="start-run-button">
              ${i("workshop.begin_next_run")}
            </button>
          </div>
        </div>
      </div>
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const n=document.createElement("choice-card");n.item=t,n.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(n)}}}}customElements.define("workshop-screen",Je);class Ve extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await z.show(i("menu.new_game"),i("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await z.show(i("menu.reset_save"),i("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let n="";if(t){const s=e.adventurers||0;n=`
        <fieldset class="mt-4 text-center">
          <legend>Progress</legend>
          <p>
            ${i("menu.max_runs",{count:e.highestRun})} | ${i("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${i("menu.adventurer_count",{count:s})}
          </p>
        </fieldset>
      `}this.innerHTML=`
      <div class="window" style="width: 400px;">
        <div class="title-bar">
          <div class="title-bar-text">${i("game_title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-xl mb-4">${i("game_subtitle")}</p>

          ${n}

          <div class="mt-4 space-y-2 flex flex-col items-center">
            ${t?`
              <button id="continue-game-button" style="width: 250px;">
                ${i("menu.continue_game")}
              </button>
            `:""}
            <button id="new-game-button" style="width: 250px;">
              ${i("menu.new_game")}
            </button>
            ${t?`
              <button id="reset-game-button" style="width: 250px;">
                ${i("menu.reset_save")}
              </button>
            `:""}
          </div>
        </div>
        <div class="status-bar">
          <p class="status-bar-field">v0.0.0</p>
          <p class="status-bar-field">build 176</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Ve);const Ye=3e3,Qe=900;class ne extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0,this.battleSpeed=Qe,this.modalState="reveal"}connectedCallback(){if(!this.payload)return;this.innerHTML=`
      <div id="encounter-overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="window" style="width: min(95vw, 600px);" role="dialog" aria-modal="true" aria-labelledby="encounter-modal-title">
          <div class="title-bar">
            <div class="title-bar-text" id="encounter-modal-title">${i("global.encounter_window_title")}</div>
          </div>
          <div class="window-body p-2">
            ${this.renderInitialView()}
          </div>
        </div>
      </div>
    `,this.querySelector("#continue-button").addEventListener("click",()=>this.handleContinue());const e=this.querySelector("#speed-slider"),t=[1500,1200,900,600,300];e.addEventListener("input",n=>{const s=n.target.value;this.battleSpeed=t[parseInt(s,10)]}),this.start()}start(){if(!this.payload)return;this.modalState="reveal";const e=this.querySelector("#continue-button"),t=this.payload.log[0];this.appendLog(i(t.messageKey,t.replacements)),e.textContent=i("global.continue"),this.revealTimeout=window.setTimeout(()=>{this.modalState="battle",this.renderBattleView()},Ye)}handleContinue(){if(!this.payload)return;const e=this.payload.room.type==="room_enemy"||this.payload.room.type==="room_boss";if(this.modalState==="reveal")if(window.clearTimeout(this.revealTimeout),e)this.modalState="battle",this.renderBattleView();else{this.modalState="outcome";const t=this.payload.log[1];t&&this.appendLog(i(t.messageKey,t.replacements))}else this.modalState==="outcome"&&this.dismiss(!1)}renderInitialView(){return`
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
          <legend>${i("global.speed")}</legend>
          <div class="field-row" style="justify-content: center">
            <label for="speed-slider">${i("global.slow")}</label>
            <input id="speed-slider" type="range" min="0" max="4" value="2" />
            <label for="speed-slider">${i("global.fast")}</label>
          </div>
        </fieldset>
      </div>
      <div class="flex justify-end mt-4">
        <button id="continue-button"></button>
      </div>
    `}renderBattleView(){this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#slider-container").classList.remove("hidden");const e=this.querySelector("#continue-button");e.id="skip-button",e.textContent=i("global.skip"),e.onclick=()=>this.dismiss(!0),this.currentEventIndex=1,this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){const r=this.querySelector("#skip-button");r&&(r.textContent=i("global.continue"),r.onclick=()=>this.dismiss(!1));return}const e=this.querySelector("#battle-adventurer"),t=this.querySelector("#battle-enemy"),n=this.querySelector("#battlefield");e.classList.remove("animate-attack","animate-shake","animate-defeat"),t.classList.remove("animate-attack","animate-shake","animate-defeat"),n.classList.remove("animate-shake");const s=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(s.adventurer),s.enemy&&this.renderEnemyStatus(s.enemy),s.animations&&s.animations.forEach(r=>{let o=null;r.target==="adventurer"?o=e:r.target==="enemy"?o=t:o=n,o.classList.add(`animate-${r.animation}`)}),this.appendLog(i(s.messageKey,s.replacements)),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=window.setTimeout(()=>this.renderNextBattleEvent(),this.battleSpeed)}renderAdventurerStatus(e){const t=e.hp/e.maxHp*100;this.querySelector("#battle-adventurer").innerHTML=`
      <div class="text-lg font-bold">${e.firstName} ${e.lastName}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.hp} / ${e.maxHp}</div>
    `}renderEnemyStatus(e){const t=e.currentHp/e.maxHp*100;this.querySelector("#battle-enemy").innerHTML=`
      <div class="text-lg font-bold">${i(e.name)}${e.total>1?` (${e.count}/${e.total})`:""}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.currentHp} / ${e.maxHp}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=this.currentEventIndex/(this.payload.log.length-1);this.querySelector("#progress-container progress").value=e*100}appendLog(e){const t=this.querySelector("#event-log"),n=document.createElement("li");n.textContent=e,t.appendChild(n),t.scrollTop=t.scrollHeight}dismiss(e){clearTimeout(this.battleTimeout),this.querySelector("#progress-container").classList.add("hidden"),this.querySelector("#slider-container").classList.add("hidden"),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const n=document.createElement("encounter-modal");n.payload=e,n.onDismiss=t,document.body.appendChild(n)})}}customElements.define("encounter-modal",ne);const Xe=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:ne},Symbol.toStringTag,{value:"Module"})),R=document.getElementById("app");if(!R)throw new Error("Could not find app element to mount to");async function et(){R.innerHTML="<div>Initializing...</div>";const a=new Me;await le(a);const e=new He,t=new Le(e),n=new Ne(e),s=new ke(t,a,n);s.on("state-change",r=>{if(s.isLoading){R.innerHTML=`<div>${i("global.loading_game_data")}</div>`;return}if(s.error){R.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${i("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${s.error}</p>
                    </div>
                </div>
            `;return}Ce(R,r,s)}),s.on("show-encounter",async r=>{const{EncounterModal:o}=await oe(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>Xe);return{EncounterModal:l}},void 0);await o.show(r),s.continueEncounter()}),R.innerHTML=`<div>${i("global.initializing")}</div>`,document.body.addEventListener("mouseover",r=>D.handleMouseEnter(r)),document.body.addEventListener("click",r=>D.handleClick(r)),await s.init(),s.showMenu()}et().catch(a=>{console.error(a),R&&(R.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${a.message}</p>
          </div>
      </div>
    `)});
