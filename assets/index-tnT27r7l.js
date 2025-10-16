(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const ie="modulepreload",ae=function(o){return"/rogue-steward/"+o},G={},oe=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){let r=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=r(t.map(d=>{if(d=ae(d),d in G)return;G[d]=!0;const f=d.endsWith(".css"),u=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":ie,f||(m.as="script"),m.crossOrigin="",m.href=d,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise((h,p)=>{m.addEventListener("load",h),m.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return i.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return e().catch(n)})};var b=(o=>(o.Arousal="arousal",o.Flow="flow",o.Control="control",o.Relaxation="relaxation",o.Boredom="boredom",o.Apathy="apathy",o.Worry="worry",o.Anxiety="anxiety",o))(b||{});let V={};async function J(o,e){try{V=await e.loadJson(`locales/${o}.json`)}catch(t){console.warn(`Failed to load ${o} translations:`,t),o!=="en"&&await J("en",e)}}function re(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(o,e={}){let s=o.split(".").reduce((i,n)=>i?i[n]:void 0,V);if(!s)return console.warn(`Translation not found for key: ${o}`),o;for(const i in e)s=s.replace(`{${i}}`,String(e[i]));return s}async function le(o){const e=re();await J(e,o)}class x{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return x.instance||(x.instance=new x),x.instance}on(e){this.listeners.push(e)}log(e,t="INFO",s){const i=a(`log_messages.${e}`,s),n={message:i,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(n),t!=="DEBUG"&&console.log(`[${t}] ${i}`)),this.listeners.forEach(r=>r(n))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(s=>s(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=x.getInstance();return t.loadEntries(e.entries),t}}class ce{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const S=new ce(Date.now()),Y=o=>`${o}_${S.nextFloat().toString(36).substr(2,9)}`,de=(o,e)=>S.nextInt(o,e),Q=o=>{const e=[...o];for(let t=e.length-1;t>0;t--){const s=S.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},X=(o,e,t,s)=>{const i=e.filter(u=>o.includes(u.id)),n=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},c={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(u=>{c[u]=Math.floor(t*r[u])});let d=Object.values(c).reduce((u,m)=>u+m,0);for(;d<t;)c.common+=1,d+=1;i.filter(u=>u.cost!==null).forEach(u=>{n.push(s(u)),l[u.rarity]+=1}),Object.keys(r).forEach((u,m)=>{const h=i.filter(p=>p.rarity===u);for(;l[u]<c[u]&&h.length!==0;){const p=S.nextInt(0,h.length-1),_=h[p];n.push(s(_)),l[u]+=1}});const f=i.filter(u=>u.rarity==="common");for(;n.length<t&&f.length>0;){const u=S.nextInt(0,f.length-1),m=f[u];n.push(s(m))}return Q(n)},F=(o,e,t)=>X(o,e,t,s=>({...s,instanceId:Y(s.id)})),j=(o,e,t)=>X(o,e,t,i=>{const n={...i,instanceId:Y(i.id)};return n.type==="room_enemy"&&n.stats.minUnits&&n.stats.maxUnits&&(n.units=de(n.stats.minUnits,n.stats.maxUnits)),n}),he=o=>o.roomHand.length<3&&!o.roomHand.some(e=>e.type==="room_boss"),me=o=>[...new Set(o.hand.map(t=>t.id))].length<2&&o.hand.length>0;function ue(o,e){const t=Math.max(0,Math.min(100,o)),s=Math.max(0,Math.min(100,e));return s>66?t<33?b.Anxiety:t<87?b.Arousal:b.Flow:s>33?t<33?b.Worry:t<67?b.Apathy:b.Control:t<67?b.Boredom:b.Relaxation}const N={hp:100,maxHp:100,power:5},fe=3;class C{constructor(e,t){this.hp=N.hp,this.maxHp=N.maxHp,this.power=N.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=b.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=x.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>fe&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=ue(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{name:this.firstName,from:a("flow_states."+e),to:a("flow_states."+this.flowState)})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=N.power,s=N.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(i=>{t+=i.stats.power||0,s+=i.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e){const t=e.traits,s=new C(t);return s.hp=e.hp,s.maxHp=e.maxHp,s.power=e.power,s.inventory=e.inventory,s.activeBuffs=e.activeBuffs,s.skill=e.skill,s.challengeHistory=e.challengeHistory,s.flowState=e.flowState,s.roomHistory=e.roomHistory,s.lootHistory=e.lootHistory,s.boredomCounter=e.boredomCounter,s.firstName=e.firstName,s.lastName=e.lastName,s}}const pe=99,ge=10,M=10,K=32,_e=18,ve=8;var E=(o=>(o.WORKSHOP="workshop",o.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",o.HAND_SIZE_INCREASE="hand_size_increase",o.ADVENTURER_TRAITS="ADVENTURER_TRAITS",o.BP_MULTIPLIER="BP_MULTIPLIER",o.WORKSHOP_ACCESS="WORKSHOP_ACCESS",o.BP_MULTIPLIER_2="BP_MULTIPLIER_2",o))(E||{});const ee=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],te=10;function se(o,e){var d,f,u,m;const{traits:t,inventory:s,hp:i,maxHp:n}=o;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((d=s.weapon)==null?void 0:d.stats.power)||0,c=((f=s.armor)==null?void 0:f.stats.maxHp)||0;switch(e.type){case"item_weapon":const h=(e.stats.power||0)-l;if(h<=0&&e.id!==((u=s.weapon)==null?void 0:u.id))return-1;r+=h*(t.offense/10),h>0&&(r+=h*(o.skill/10));const p=e.stats.maxHp||0;p<0&&(r+=p*(100-t.resilience)/20);break;case"item_armor":const _=(e.stats.maxHp||0)-c;if(_<=0&&e.id!==((m=s.armor)==null?void 0:m.id))return-1;r+=_*(100-t.offense)/10,_>0&&(r+=_*(o.skill/10));const g=e.stats.power||0;g>0&&(r+=g*(t.offense/15));const y=e.stats.power||0;y<0&&(r+=y*(t.resilience/10));break;case"item_potion":const w=i/n;r+=10*(100-t.resilience)/100,w<.7&&(r+=20*(1-w)),r+=5*(o.skill/100),s.potions.length>=pe&&(r*=.1);break}return r}function be(o,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${o.traits.offense}, Resilience: ${o.traits.resilience}, Skill: ${o.skill})`);const s=e.map(r=>({item:r,score:se(o,r)})).filter(r=>r.score>0);if(s.sort((r,l)=>l.score-r.score),s.length===0||s[0].score<ge)return{choice:null,reason:a("game_engine.adventurer_declines_offer")};const i=s[0].item;t.debug(`Adventurer chooses: ${a("items_and_rooms."+i.id)} (Score: ${s[0].score.toFixed(1)})`);const n=a("game_engine.adventurer_accepts_offer",{itemName:a("items_and_rooms."+i.id)});return{choice:i,reason:n}}function we(o,e){const{flowState:t,hp:s,maxHp:i,inventory:n,traits:r}=o,l=s/i;if(n.potions.length===0)return"attack";let c=.5;switch(t){case b.Anxiety:case b.Worry:c=.8;break;case b.Arousal:case b.Flow:c=.6;break;case b.Control:case b.Relaxation:c=.4;break;case b.Boredom:case b.Apathy:c=.2;break}return c-=r.resilience/200,l<Math.max(.1,c)?"use_potion":"attack"}function ye(o,e,t){if(e){o.lootHistory.push(e.id),o.lootHistory.filter(n=>n===e.id).length>2&&(o.modifyChallenge(o.challenge-te),o.logger.info("info_repetitive_choice",{name:a("items_and_rooms."+e.id)}));const i=se(o,e);i>60?(o.modifySkill(10),o.modifyChallenge(o.challenge+5)):i>30?(o.modifySkill(5),o.modifyChallenge(o.challenge+2)):o.modifySkill(2)}else t.length>0?o.modifyChallenge(o.challenge-5):o.modifyChallenge(o.challenge-10);o.updateFlowState()}function Se(o,e){o.roomHistory.push(e.id),o.roomHistory.filter(i=>i===e.id).length>2&&(o.modifyChallenge(o.challenge-te),o.logger.info("info_deja_vu",{name:a("items_and_rooms."+e.id)}));let s=0;switch(e.type){case"room_enemy":s=5;break;case"room_boss":s=15;break;case"room_trap":s=10;break;case"room_healing":s=-15;break}o.modifyChallenge(o.challenge+s),o.updateFlowState()}function ke(o){o.modifySkill(-2),o.updateFlowState()}function D(o,e){switch(e){case"hit":o.modifySkill(.5);break;case"miss":o.modifySkill(-.5);break;case"take_damage":o.modifyChallenge(o.challenge+1);break}o.updateFlowState()}function xe(o,e,t,s){let i;return e>.7?(i=a("game_engine.too_close_for_comfort"),o.modifyChallenge(o.challenge+10),o.modifySkill(-3)):e>.4?(i=a("game_engine.great_battle"),o.modifyChallenge(o.challenge+5),o.modifySkill(5)):t>3&&o.traits.offense>60?(i=a("game_engine.easy_fight"),o.modifyChallenge(o.challenge-10)):(i=a("game_engine.worthy_challenge"),o.modifyChallenge(o.challenge-2),o.modifySkill(2)),t===s&&o.modifySkill(1*t),o.updateFlowState(),i}const v=x.getInstance();class Ee{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=i=>{this.metaManager.incrementAdventurers();const n={offense:S.nextInt(10,90),resilience:S.nextInt(10,90),skill:0};v.loadEntries([]);const r=new C(n,this._allNames),l=(i==null?void 0:i.items)||this._allItems.filter(g=>g.cost===null).map(g=>g.id),c=F(l,this._allItems,K),d=this._getHandSize(),f=c.slice(0,d),u=c.slice(d),m=(i==null?void 0:i.rooms)||this._allRooms.filter(g=>g.cost===null).map(g=>g.id),h=j(m,this._allRooms,this._getRoomDeckSize()),p=h.slice(0,d),_=h.slice(d);v.info("info_new_adventurer",{fullName:`${r.firstName} ${r.lastName}`,id:this.metaManager.metaState.adventurers.toString()}),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:r,unlockedDeck:l,availableDeck:u,hand:f,unlockedRoomDeck:m,availableRoomDeck:_,roomHand:p,handSize:d,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:a("game_engine.new_adventurer"),run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},v.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),v.debug(`Deck size: ${c.length}, Hand size: ${d}, Room Deck size: ${h.length}, Room Hand size: ${p.length}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const i=this.gameSaver.load();i?(this.gameState=i,this._emit("state-change",this.gameState),this.gameState.phase==="AWAITING_ENCOUNTER_RESULT"&&this.gameState.encounterPayload&&this._emit("show-encounter",this.gameState.encounterPayload)):this.startNewGame()},this.startNewRun=i=>{if(!this.gameState)return;const n=i||this.gameState.run+1;this.metaManager.updateRun(n);const r=this._getHandSize(),l=F(this.gameState.unlockedDeck,this._allItems,K),c=l.slice(0,r),d=l.slice(r),f=j(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),u=f.slice(0,r),m=f.slice(r),h=new C(this.gameState.adventurer.traits,this._allNames);h.skill=this.gameState.adventurer.skill,h.challengeHistory=[...this.gameState.adventurer.challengeHistory],h.flowState=this.gameState.adventurer.flowState,v.info("info_adventurer_returns"),v.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:h,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:d,hand:c,availableRoomDeck:m,roomHand:u,handSize:r,room:1,run:n,feedback:a("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const n=this.gameState.hand.filter(w=>i.includes(w.instanceId));this.gameState.offeredLoot=n;const r=this.gameState.adventurer,{choice:l,reason:c}=be(r,this.gameState.offeredLoot,v),d=r.flowState;ye(r,l,this.gameState.offeredLoot),d!==r.flowState&&v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:r.flowState}),l&&(v.info("info_item_chosen",{name:r.firstName,item:a("items_and_rooms."+l.id)}),v.info("info_item_chosen_metrics",{event:"item_chosen",item:l}));let f=this.gameState.hand,u=this.gameState.availableDeck;f.forEach(w=>w.justDrafted=!1);let m=f.filter(w=>!i.includes(w.instanceId));const h=this.gameState.handSize-m.length,p=u.slice(0,h);p.forEach(w=>{w.draftedRoom=this.gameState.room,w.justDrafted=!0});const _=u.slice(h);m.push(...p),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const g=this.gameState.room+1,y=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:c,availableDeck:_,hand:m,room:g,designer:{balancePoints:y}},this._emit("state-change",this.gameState)},this.runEncounter=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=i;const n=S.nextInt(0,this.gameState.offeredRooms.length-1),r=this.gameState.offeredRooms[n];v.info("info_room_encountered_metrics",{event:"room_encountered",room:r});const{log:l,finalAdventurer:c,feedback:d}=this._generateEncounterLog(this.gameState.adventurer,r),f={room:r,log:l,finalAdventurer:c,feedback:d};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT",encounterPayload:f},this._emit("state-change",this.gameState),this._emit("show-encounter",f)},this.continueEncounter=()=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate()},this._postEncounterUpdate=()=>{if(!this.gameState)return;const i=C.fromJSON(this.gameState.encounterPayload.finalAdventurer),n=this.gameState.encounterPayload.feedback;i.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let r=this.gameState.roomHand,l=this.gameState.availableRoomDeck;r.forEach(h=>h.justDrafted=!1);const c=this.gameState.offeredRooms.map(h=>h.instanceId);let d=r.filter(h=>!c.includes(h.instanceId));const f=this.gameState.handSize-d.length,u=l.slice(0,f);u.forEach(h=>{h.draftedRoom=this.gameState.room,h.justDrafted=!0});const m=l.slice(f);if(d.push(...u),this.gameState.adventurer=i,i.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(i.boredomCounter>2){const h=i.flowState===b.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(h);return}this.gameState.hand&&this.gameState.hand.length===0?(v.warn("warn_empty_hand"),n.push(a("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:n,encounterPayload:void 0,roomHand:d,availableRoomDeck:m}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:n,encounterPayload:void 0,roomHand:d,availableRoomDeck:m},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(v.info("info_entering_workshop",{name:this.gameState.adventurer.firstName}),!this.metaManager.acls.has(E.WORKSHOP)){v.info("info_workshop_not_unlocked"),this.startNewRun();return}const i=this.gameState.run+1,n=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),r=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),l=[...n,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:i,room:0,shopItems:Q(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:a("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=i=>{if(!this.gameState)return;const n=this._allItems.find(p=>p.id===i),r=this._allRooms.find(p=>p.id===i),l=n||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let c=this.gameState.unlockedDeck,d=this.gameState.unlockedRoomDeck,f=this.gameState.availableDeck,u=this.gameState.availableRoomDeck;n?(c=[...this.gameState.unlockedDeck,i],this.isWorkshopAccessUnlocked()&&(f=[n,...this.gameState.availableDeck])):r&&(d=[...this.gameState.unlockedRoomDeck,i],this.isWorkshopAccessUnlocked()&&(u=[r,...this.gameState.availableRoomDeck]));const m=this.gameState.designer.balancePoints-l.cost,h=this.gameState.shopItems.filter(p=>p.id!==i);v.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:a("items_and_rooms."+l.id)}),v.info("info_item_purchased_metrics",{event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:m},unlockedDeck:c,unlockedRoomDeck:d,availableDeck:f,availableRoomDeck:u,shopItems:h},this._emit("state-change",this.gameState)},this.quitGame=(i=!0)=>{i&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(E.BP_MULTIPLIER_2)?M*4:this.metaManager.acls.has(E.BP_MULTIPLIER)?M*2:M,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(i=>i(...t))}_createAdventurerSnapshot(e){return{firstName:e.firstName,lastName:e.lastName,hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var l;const s=[],i=[],n=C.fromJSON(e.toJSON());v.info("info_encounter",{name:n.firstName,roomName:a("items_and_rooms."+t.id)});const r=n.flowState;switch(Se(n,t),r!==n.flowState&&v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),s.push({messageKey:"log_messages.info_encounter",replacements:{name:n.firstName,roomName:a("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(n)}),t.type){case"room_enemy":case"room_boss":{const c={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let d=0;const f=n.hp;for(let _=0;_<c.enemyCount;_++){let g=c.enemyHp;v.info("info_encounter_enemy",{name:n.firstName,current:_+1,total:c.enemyCount});const y=t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),w={currentHp:g,maxHp:c.enemyHp,power:c.enemyPower,name:y,count:_+1,total:c.enemyCount};for(s.push({messageKey:"log_messages.info_encounter_enemy",replacements:{name:n.firstName,current:_+1,total:c.enemyCount},adventurer:this._createAdventurerSnapshot(n),enemy:w});g>0&&n.hp>0;){if(we(n)==="use_potion"){const I=n.inventory.potions.shift();if(I){const k=I.stats.hp||0;n.hp=Math.min(n.maxHp,n.hp+k),v.info("info_adventurer_drinks_potion",{name:n.firstName,potionName:a("items_and_rooms."+I.id)}),i.push(a("game_engine.adventurer_drinks_potion",{potionName:a("items_and_rooms."+I.id)})),s.push({messageKey:"log_messages.info_adventurer_drinks_potion",replacements:{name:n.firstName,potionName:a("items_and_rooms."+I.id)},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g}})}}else{const I=Math.min(.95,.75+n.traits.skill/500+n.traits.offense/1e3);if(S.nextFloat()<I){const k=n.power;g-=k,v.debug(`Adventurer hits for ${k} damage.`);const H=n.flowState;D(n,"hit"),H!==n.flowState&&(v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:n.firstName,from:a(`flow_states.${H}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g}})),s.push({messageKey:"log_messages.info_adventurer_hit",replacements:{damage:k},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g},animations:[{target:"adventurer",animation:"attack"},{target:"enemy",animation:"shake"}]})}else{v.debug("Adventurer misses.");const k=n.flowState;D(n,"miss"),k!==n.flowState&&(v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:n.firstName,from:a(`flow_states.${k}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g}})),s.push({messageKey:"log_messages.info_adventurer_miss",adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g},animations:[{target:"adventurer",animation:"attack"}]})}}if(g<=0){v.info("info_enemy_defeated"),d++,s.push({messageKey:"log_messages.info_enemy_defeated",adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:0},animations:[{target:"enemy",animation:"defeat"}]});break}const U=Math.max(.4,.75-n.traits.skill/500-(100-n.traits.offense)/1e3);if(S.nextFloat()<U){const I=(((l=n.inventory.armor)==null?void 0:l.stats.maxHp)||0)/10,k=Math.max(1,c.enemyPower-I);n.hp-=k,v.debug(`Enemy hits for ${k} damage.`);const H=n.flowState;D(n,"take_damage"),H!==n.flowState&&(v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:n.firstName,from:a(`flow_states.${H}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g}})),s.push({messageKey:"log_messages.info_enemy_hit",replacements:{damage:k},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g},animations:[{target:"enemy",animation:"attack"},{target:"adventurer",animation:"shake"}]})}else v.debug("Enemy misses."),s.push({messageKey:"log_messages.info_enemy_miss",adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g},animations:[{target:"enemy",animation:"attack"}]})}if(n.hp<=0){v.warn("info_adventurer_defeated",{name:n.firstName}),s.push({messageKey:"log_messages.info_adventurer_defeated",replacements:{name:n.firstName},adventurer:this._createAdventurerSnapshot(n),enemy:{...w,currentHp:g},animations:[{target:"adventurer",animation:"defeat"}]});break}}const u=f-n.hp,m=u/n.maxHp;v.debug(`hpLost: ${u}, hpLostRatio: ${m.toFixed(2)}`);const h=n.flowState,p=xe(n,m,d,c.enemyCount);h!==n.flowState&&v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),i.push(p);break}case"room_healing":{const c=t.stats.hp||0;n.hp=Math.min(n.maxHp,n.hp+c),v.info("info_healing_room",{name:n.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:c}),i.push(a("game_engine.healing_room",{name:a("items_and_rooms."+t.id),healing:c})),s.push({messageKey:"log_messages.info_healing_room",replacements:{name:n.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:c},adventurer:this._createAdventurerSnapshot(n)});break}case"room_trap":{const c=t.stats.attack||0;n.hp-=c;const d=n.flowState;ke(n),d!==n.flowState&&v.info("info_flow_state_changed_metrics",{event:"flow_state_changed",flowState:n.flowState}),v.info("info_trap_room",{name:n.firstName,trapName:a("items_and_rooms."+t.id),damage:c}),i.push(a("game_engine.trap_room",{name:a("items_and_rooms."+t.id),damage:c})),s.push({messageKey:"log_messages.info_trap_room",replacements:{name:n.firstName,trapName:a("items_and_rooms."+t.id),damage:c},adventurer:this._createAdventurerSnapshot(n)});break}}return{log:s,finalAdventurer:n,feedback:i}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);v.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),v.info("info_run_end_metrics",{event:"run_end",bp:this.gameState.designer.balancePoints}),v.error("info_game_over",{reason:e});const i=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:i},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:i,offense:n}=t,r=Math.min(s/100,1);if(e===b.Flow)return"continue";let l=.55;switch(e){case b.Anxiety:l+=.25-i/400;break;case b.Arousal:l-=.1-n/1e3;break;case b.Worry:l+=.2;break;case b.Control:l-=.15;break;case b.Relaxation:l+=.1;break;case b.Boredom:l+=.3;break;case b.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),S.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(v.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:S.nextInt(10,90),resilience:S.nextInt(10,90),skill:0},t=new C(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(E.HAND_SIZE_INCREASE)?12:ve}_getRoomDeckSize(){return this.metaManager.acls.has(E.ROOM_DECK_SIZE_INCREASE)?36:_e}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(E.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(E.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class Ie extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t){if(this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show"),this.isDesktop&&t){const s=t.getBoundingClientRect(),i=this.getBoundingClientRect();let n=s.top-i.height-10,r=s.left+s.width/2-i.width/2;n<0&&(n=s.bottom+10),r<0?r=5:r+i.width>window.innerWidth&&(r=window.innerWidth-i.width-5),this.style.top=`${n}px`,this.style.left=`${r}px`}}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ie);class T{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return T.instance||(T.instance=new T),T.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const i=this.getTooltipContent(s);i&&(this.tooltipBox.show(i,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const i=this.getTooltipContent(s);i&&this.tooltipBox.show(i,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=a(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=a("global.information")),{title:s,body:t}}}const q=T.getInstance();class L{constructor(e,t,s,i){this.resolve=i;const n=document.createElement("div");n.dataset.testid="info-modal-overlay",Object.assign(n.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),n.addEventListener("click",_=>{if(_.target===n){const g=s.find(y=>typeof y.value=="boolean"&&y.value===!1);g&&this.dismiss(g.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const c=document.createElement("div");c.id="info-modal-title",c.className="title-bar-text",c.textContent=e,l.appendChild(c),r.appendChild(l);const d=document.createElement("div");d.className="window-body text-center p-4";const f=document.createElement("div");f.innerHTML=t,d.appendChild(f);const u=document.createElement("div");u.className="flex justify-center gap-2 mt-4",s.forEach(_=>{const g=document.createElement("button");g.textContent=_.text,g.addEventListener("click",()=>{this.dismiss(_.value)}),u.appendChild(g)}),d.appendChild(u),r.appendChild(d),n.appendChild(r),document.body.appendChild(n),this.handleKeydown=_=>{if(_.key==="Escape"){const g=s.find(y=>typeof y.value=="boolean"&&y.value===!1);g&&this.dismiss(g.value)}},document.addEventListener("keydown",this.handleKeydown);const m=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),h=m[0],p=m[m.length-1];h==null||h.focus(),r.addEventListener("keydown",_=>{_.key==="Tab"&&(_.shiftKey?document.activeElement===h&&(p.focus(),_.preventDefault()):document.activeElement===p&&(h.focus(),_.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(i=>{new L(e,t,s,i)})}static showInfo(e,t,s=a("global.continue")){const i=[{text:s,value:void 0}];return L.show(e,t,i)}}class B{static show(e,t){const s=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return L.show(e,t,s)}}const Ce=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,W=(o,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=o.hand,s.deckType="item",s.offerImpossible=me(o)):(s.choices=o.roomHand,s.deckType="room",s.roomSelectionImpossible=he(o)),s},$e=(o,e,t)=>{var f;if(!o.querySelector("adventurer-status")){o.innerHTML=Ce;const u=o.querySelector("#game-title");u&&(u.textContent=a("game_title"));const m=o.querySelector("#adventurer-status-title");m&&(m.textContent=a("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(f=o.querySelector("#quit-game-btn"))==null||f.addEventListener("click",async()=>{await B.show(a("global.quit"),a("global.quit_confirm"))&&t.quitGame(!1)})}const s=o.querySelector("adventurer-status"),i=o.querySelector("log-panel"),n=o.querySelector("game-stats"),r=o.querySelector("feedback-panel"),l=o.querySelector("#game-phase-panel"),c=o.querySelector("#game-phase-title");s.metaState=t.metaManager.metaState,s.adventurer=e.adventurer,n.engine=t,t.isWorkshopUnlocked()?n.setAttribute("balance-points",e.designer.balancePoints.toString()):n.removeAttribute("balance-points"),n.setAttribute("run",e.run.toString()),n.setAttribute("room",e.room.toString()),n.setAttribute("deck-size",e.availableDeck.length.toString()),n.setAttribute("room-deck-size",e.availableRoomDeck.length.toString());const d=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;switch(r.setAttribute("message",d),i.logger=x.getInstance(),i.traits=e.adventurer.traits,l.innerHTML="",e.phase){case"RUN_OVER":{c&&(c.textContent=a("run_ended_screen.run_complete"));const u=document.createElement("run-ended-screen");u.setAttribute("final-bp",e.designer.balancePoints.toString()),u.setAttribute("reason",e.runEnded.reason),u.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&u.setAttribute("workshop-unlocked",""),e.runEnded.decision&&u.initialize(e.runEnded.decision,e.newlyUnlocked,t),l.appendChild(u);break}case"DESIGNER_CHOOSING_LOOT":c&&(c.textContent=a("choice_panel.title")),l.appendChild(W(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":c&&(c.textContent=a("choice_panel.title_room")),l.appendChild(W(e,t,"room"));break;default:c&&(c.textContent="...");break}},Re=(o,e)=>{o.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,o.appendChild(t)},Te=(o,e,t)=>{o.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,o.appendChild(s)},Le=(o,e,t)=>{if(q.handleMouseLeave(),!e){o.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":Re(o,t);break;case"SHOP":Te(o,e,t);break;default:$e(o,e,t);break}};function He(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const Z="rogue-steward-meta";class Ne{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of ee)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(Z);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(Z,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const A="rogue-steward-savegame",O="1.0.1";class Ae{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(A,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(A);if(e){const t=JSON.parse(e);return t.version!==O?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${O}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(A)!==null}clear(){this.storage.removeItem(A)}_serialize(e){const{adventurer:t,...s}=e;return{version:O,...s,adventurer:t.toJSON(),logger:x.getInstance().toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...i}=e;x.getInstance().loadEntries(s.entries);const r=C.fromJSON(t),{version:l,...c}=i;return{...c,adventurer:r}}}class Me{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class De{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',ze=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class Ge extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,s;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(s=this._metaState)==null?void 0:s.unlockedFeatures.includes(E.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${a("adventurer_status.flow_state")}</legend>
              <div id="flow-state-text" class="font-mono text-xl text-center"></div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Oe()} <span>${a("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${Pe()} <span class="ml-1">${a("global.power")}</span></div>
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
        `,this._hasRendered=!0}update(){var l;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const s=this.querySelector("#flow-state-text");s.textContent=a(`flow_states.${this._adventurer.flowState}`),s.className=`font-mono text-xl text-center ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s);const i=this.querySelector("#power-text");i.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(i);const n=(l=this._metaState)==null?void 0:l.unlockedFeatures.includes(E.ADVENTURER_TRAITS),r=this.querySelector("#traits-section");if(n){r.classList.remove("hidden");const c=this.querySelector("#offense-trait"),d=this.querySelector("#resilience-trait"),f=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(d),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(f),c.textContent=`${this._adventurer.traits.offense}`,d.textContent=`${this._adventurer.traits.resilience}`,f.textContent=`${this._adventurer.skill}`}else r.classList.add("hidden");this.updateInventorySlot("weapon-slot",qe(),a("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("armor-slot",Be(),a("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Ue(),a("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div class="text-xs">
                <p>${a("items_and_rooms."+c.id)} (${a("global.duration")}: ${c.stats.duration})</p>
                <p>${Object.entries(c.stats).filter(([d])=>d!=="duration").map(([d,f])=>`${a(`global.${d}`)}: ${f}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("potions-slot",ze(),a("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${a("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-shake"),e.addEventListener("animationend",()=>{e.classList.remove("animate-shake")},{once:!0}))}updateInventorySlot(e,t,s,i){const n=this.querySelector(`#${e}`);n.dataset.content!==i&&(n.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${i}
                </div>
            `,n.dataset.content=i)}getFlowStateColor(e){switch(e){case b.Boredom:case b.Apathy:return"text-red-500";case b.Anxiety:case b.Worry:return"text-orange-500";case b.Arousal:case b.Control:case b.Relaxation:return"text-blue";case b.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",Ge);class Fe extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",Fe);class je extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=ee.find(i=>i.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),s=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await L.showInfo(t,s,a("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const s=this.querySelector("#decision-container");s&&(s.innerHTML=`<p>${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||a("run_ended_screen.default_reason");this.innerHTML=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let i="",n="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(i=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${a("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,n=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${a(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(i=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${a("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,n=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=i,s.innerHTML=n}}customElements.define("run-ended-screen",je);class Ke extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="status-bar">

                ${this._balancePoints!==null?`
                <p class="status-bar-field">
                    <span class="text-xs">${a("global.bp")}: ${this._balancePoints}</span>
                </p>
                `:""}
                <p class="status-bar-field">
                    <span class="text-xs">${a("global.run")}: ${this._run}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${a("global.room")}: ${this._room}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${a("global.deck")}: ${this._deckSize}</span>
                </p>
                <p class="status-bar-field">
                    <span class="text-xs">${a("global.rooms")}: ${this._roomDeckSize}</span>
                </p>

                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                    <button id="enter-workshop-btn">${a("global.workshop")}</button>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Ke);class We extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const s=this.querySelector("#log-container");if(s){const i=document.createElement("p");i.className=this._getLogColor(e.level),i.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,s.appendChild(i)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const i=t.map((n,r)=>`<p class="${this._getLogColor(n.level)}">[${r.toString().padStart(3,"0")}] ${n.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${i}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let i=this._renderedLogCount;i<t.length;i++)this._appendEntry(t[i],i);this._renderedLogCount=t.length}const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",We);const Ze={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},R=(o,e,t=!0,s=1)=>{const i=t?"text-green-600":"text-red-400",n=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${i}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${o}${s>1?a("global.units"):""}</span>
            <span class="font-mono">${n}${e}</span>
        </div>
    `};class Ve extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const s=this.querySelector('input[type="checkbox"]');s&&!s.disabled&&(s.checked=!s.checked,s.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Ze[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",s=`card-checkbox-${this._item.instanceId}`;let i="";this._isSelectable&&(this._isDisabled?i="opacity-50 cursor-not-allowed":i="cursor-pointer");const n=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${i} ${n}`;let r=a("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const d=this._item,f=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${d.stats.hp?R(a("global.health"),d.stats.hp,d.stats.hp>0):""}
            ${d.stats.maxHp?R(a("global.max_hp"),d.stats.maxHp,d.stats.maxHp>0):""}
            ${d.stats.power?R(a("global.power"),d.stats.power,d.stats.power>0):""}
            ${d.stats.duration?R(a("global.duration"),d.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${f.stats.hp?R(a("global.health"),f.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${f.stats.attack?R(a("global.attack"),f.stats.attack,!1,f.units):""}
            ${f.stats.hp?R(a("global.health"),f.stats.hp,!1,f.units):""}
          `,f.units>1&&(r=a("choice_panel.multiple_enemies_title",{name:r,count:f.units}));break}}this._stackCount>1&&(r=a("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const c=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${c} flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${a("card_types."+this._item.type)} - ${a("rarity."+this._item.rarity)}</legend>
        <div class="p-2">
            <p class="font-bold text-sm ${e}">${r}</p>
            <div class="mt-2">
                ${l}
            </div>
            ${this._isSelectable&&!this._purchaseInfo?`
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${s}" ${this._isSelected?"checked":""} ${this._isDisabled?"disabled":""}>
              <label for="${s}" class="ml-2 text-sm">${a("card.select")}</label>
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
    `}}customElements.define("choice-card",Ve);const P=4;class Je extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(i=>this._selectedIds.includes(i.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(i=>i.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const i=t.type==="room_boss";if(s)this._selectedIds=this._selectedIds.filter(n=>n!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");i&&this._selectedIds.length===0?this._selectedIds.push(e):!i&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const n=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);n.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!n.includes(l)):this._selectedIds.length<P&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(m=>m.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const m=e.map(h=>{const p=document.createElement("choice-card");return p.item=h,p.isSelectable=!1,p.outerHTML}).join("");L.show(a("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 cards-container">${m}</div>`,[{text:a("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(h=>h.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},i={enemy:0,trap:1,healing:2,boss:3};let n=[...this._choices];this._deckType==="item"?n.sort((m,h)=>{const p=s[m.type]-s[h.type];if(p!==0)return p;const _=t[m.rarity]||0,g=t[h.rarity]||0;return _-g}):n.sort((m,h)=>{const p=m,_=h,g=i[p.type]-i[_.type];if(g!==0)return g;const y=p.stats.hp||0,w=_.stats.hp||0;if(y!==w)return w-y;const z=p.stats.attack||0;return(_.stats.attack||0)-z});const r=this._deckType==="room";let l;if(r)l=n;else{const m=new Map;n.forEach(h=>{const p=h;m.has(p.id)?m.get(p.id).count++:m.set(p.id,{choice:p,count:1})}),l=Array.from(m.values()).map(h=>({...h.choice,stackCount:h.count}))}a(r?"choice_panel.title_room":"choice_panel.title");let c=a(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?c=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(c=a("choice_panel.roll_credits"));let d=!1,f=c;this._offerImpossible||this._roomSelectionImpossible?d=!0:r?this._choices.filter(p=>this._selectedIds.includes(p.instanceId)).some(p=>p.type==="room_boss")?(d=this._selectedIds.length===1,f=`${c} (1/1)`):(d=this._selectedIds.length===3,f=`${c} (${this._selectedIds.length}/3)`):(d=this._selectedIds.length>=2&&this._selectedIds.length<=P,f=`${c} (${this._selectedIds.length}/${P})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!d||this._disabled?"disabled":""}>
                    ${f}
                </button>
            </div>
        </div>
    `;const u=this.querySelector("#loot-card-container");u&&l.forEach(m=>{const h=document.createElement("choice-card");h.item=m,"stackCount"in m&&(h.stackCount=m.stackCount),h.isSelected=this._selectedIds.includes(m.instanceId);let p=this._disabled;if(this._offerImpossible)p=!0;else if(r){const _=this._choices.filter(y=>this._selectedIds.includes(y.instanceId)),g=_.some(y=>y.type==="room_boss");h.isSelected?p=!1:(g||m.type==="room_boss"&&_.length>0||_.length>=3)&&(p=!0)}else{const _=new Map(this._choices.map(w=>[w.instanceId,w.id])),g=this._selectedIds.map(w=>_.get(w));p=!h.isSelected&&g.includes(m.id)||this._disabled}h.isDisabled=p,h.isNewlyDrafted=m.justDrafted&&this._initialRender||!1,u.appendChild(h)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Je);class Ye extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
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
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const s=document.createElement("choice-card");s.item=t,s.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(s)}}}}customElements.define("workshop-screen",Ye);class Qe extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await B.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await B.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(t){const i=e.adventurers||0;s=`
        <fieldset class="mt-4 text-center">
          <legend>Progress</legend>
          <p>
            ${a("menu.max_runs",{count:e.highestRun})} | ${a("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${a("menu.adventurer_count",{count:i})}
          </p>
        </fieldset>
      `}this.innerHTML=`
      <div class="window" style="width: 400px;">
        <div class="title-bar">
          <div class="title-bar-text">${a("game_title")}</div>
        </div>
        <div class="window-body">
          <p class="text-center text-xl mb-4">${a("game_subtitle")}</p>

          ${s}

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
          <p class="status-bar-field">build 151</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Qe);const Xe=3e3,et=900;class ne extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0,this.battleSpeed=et,this.modalState="reveal"}connectedCallback(){if(!this.payload)return;this.innerHTML=`
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
    `,this.querySelector("#continue-button").addEventListener("click",()=>this.handleContinue());const e=this.querySelector("#speed-slider"),t=[1500,1200,900,600,300];e.addEventListener("input",s=>{const i=s.target.value;this.battleSpeed=t[parseInt(i,10)]}),this.start()}start(){if(!this.payload)return;this.modalState="reveal";const e=this.querySelector("#continue-button"),t=this.payload.log[0];this.appendLog(a(t.messageKey,t.replacements)),e.textContent=a("global.continue"),this.revealTimeout=window.setTimeout(()=>{this.modalState="battle",this.renderBattleView()},Xe)}handleContinue(){if(!this.payload)return;const e=this.payload.room.type==="room_enemy"||this.payload.room.type==="room_boss";if(this.modalState==="reveal")if(window.clearTimeout(this.revealTimeout),e)this.modalState="battle",this.renderBattleView();else{this.modalState="outcome";const t=this.payload.log[1];t&&this.appendLog(a(t.messageKey,t.replacements))}else this.modalState==="outcome"&&this.dismiss(!1)}renderInitialView(){return`
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
    `}renderBattleView(){this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#slider-container").classList.remove("hidden");const e=this.querySelector("#continue-button");e.id="skip-button",e.textContent=a("global.skip"),e.onclick=()=>this.dismiss(!0),this.currentEventIndex=1,this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){const n=this.querySelector("#skip-button");n&&(n.textContent=a("global.continue"),n.onclick=()=>this.dismiss(!1));return}const e=this.querySelector("#battle-adventurer"),t=this.querySelector("#battle-enemy"),s=this.querySelector("#battlefield");e.classList.remove("animate-attack","animate-shake","animate-defeat"),t.classList.remove("animate-attack","animate-shake","animate-defeat"),s.classList.remove("animate-shake");const i=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(i.adventurer),i.enemy&&this.renderEnemyStatus(i.enemy),i.animations&&i.animations.forEach(n=>{let r=null;n.target==="adventurer"?r=e:n.target==="enemy"?r=t:r=s,r.classList.add(`animate-${n.animation}`)}),this.appendLog(a(i.messageKey,i.replacements)),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=window.setTimeout(()=>this.renderNextBattleEvent(),this.battleSpeed)}renderAdventurerStatus(e){const t=e.hp/e.maxHp*100;this.querySelector("#battle-adventurer").innerHTML=`
      <div class="text-lg font-bold">${e.firstName} ${e.lastName}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.hp} / ${e.maxHp}</div>
    `}renderEnemyStatus(e){const t=e.currentHp/e.maxHp*100;this.querySelector("#battle-enemy").innerHTML=`
      <div class="text-lg font-bold">${a(e.name)}${e.total>1?` (${e.count}/${e.total})`:""}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.currentHp} / ${e.maxHp}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=this.currentEventIndex/(this.payload.log.length-1);this.querySelector("#progress-container progress").value=e*100}appendLog(e){const t=this.querySelector("#event-log"),s=document.createElement("li");s.textContent=e,t.appendChild(s),t.scrollTop=t.scrollHeight}dismiss(e){clearTimeout(this.battleTimeout),this.querySelector("#progress-container").classList.add("hidden"),this.querySelector("#slider-container").classList.add("hidden"),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const s=document.createElement("encounter-modal");s.payload=e,s.onDismiss=t,document.body.appendChild(s)})}}customElements.define("encounter-modal",ne);const tt=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:ne},Symbol.toStringTag,{value:"Module"})),$=document.getElementById("app");if(!$)throw new Error("Could not find app element to mount to");async function st(){$.innerHTML="<div>Initializing...</div>";const o=new De;await le(o);const e=new Me,t=new Ne(e),s=new Ae(e),i=new Ee(t,o,s);i.on("state-change",n=>{if(i.isLoading){$.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(i.error){$.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${i.error}</p>
                    </div>
                </div>
            `;return}Le($,n,i),He()}),i.on("show-encounter",async n=>{const{EncounterModal:r}=await oe(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>tt);return{EncounterModal:l}},void 0);await r.show(n),i.continueEncounter()}),$.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",n=>q.handleMouseEnter(n)),document.body.addEventListener("click",n=>q.handleClick(n)),await i.init(),i.showMenu()}st().catch(o=>{console.error(o),$&&($.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${o.message}</p>
          </div>
      </div>
    `)});
