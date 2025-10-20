(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const le="modulepreload",ce=function(o){return"/hypercubicle/"+o},K={},de=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(m=>Promise.resolve(m).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=r(t.map(c=>{if(c=ce(c),c in K)return;K[c]=!0;const m=c.endsWith(".css"),h=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":le,m||(u.as="script"),u.crossOrigin="",u.href=c,d&&u.setAttribute("nonce",d),document.head.appendChild(u),m)return new Promise((p,g)=>{u.addEventListener("load",p),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};var v=(o=>(o.Arousal="arousal",o.Flow="flow",o.Control="control",o.Relaxation="relaxation",o.Boredom="boredom",o.Apathy="apathy",o.Worry="worry",o.Anxiety="anxiety",o))(v||{});let X={};async function Q(o,e){try{X=await e.loadJson(`locales/${o}.json`)}catch(t){console.warn(`Failed to load ${o} translations:`,t),o!=="en"&&await Q("en",e)}}function he(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(o,e={}){let n=o.split(".").reduce((s,i)=>s?s[i]:void 0,X);if(!n)return console.warn(`Translation not found for key: ${o}`),o;for(const s in e)n=n.replace(`{${s}}`,String(e[s]));return n}async function me(o){const e=he();await Q(e,o)}class E{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return E.instance||(E.instance=new E),E.instance}on(e){this.listeners.push(e)}log(e,t="INFO",n){const s=a(`log_messages.${e}`,n),i={message:s,level:t,timestamp:Date.now(),data:n};this.muted||(this.entries.push(i),t!=="DEBUG"&&console.log(`[${t}] ${s}`)),this.listeners.forEach(r=>r(i))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(n=>n(t))}metric(e){const t={message:"metric",level:"DEBUG",timestamp:Date.now(),data:e};this.listeners.forEach(n=>n(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=E.getInstance();return t.loadEntries(e.entries),t}}class ue{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const x=new ue(Date.now()),ee=o=>`${o}_${x.nextFloat().toString(36).substr(2,9)}`,pe=(o,e)=>x.nextInt(o,e),te=o=>{const e=[...o];for(let t=e.length-1;t>0;t--){const n=x.nextInt(0,t);[e[t],e[n]]=[e[n],e[t]]}return e},se=(o,e,t,n)=>{const s=e.filter(h=>o.includes(h.id)),i=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},d={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(h=>{d[h]=Math.floor(t*r[h])});let c=Object.values(d).reduce((h,u)=>h+u,0);for(;c<t;)d.common+=1,c+=1;s.filter(h=>h.cost!==null).forEach(h=>{i.push(n(h)),l[h.rarity]+=1}),Object.keys(r).forEach((h,u)=>{const p=s.filter(g=>g.rarity===h);for(;l[h]<d[h]&&p.length!==0;){const g=x.nextInt(0,p.length-1),f=p[g];i.push(n(f)),l[h]+=1}});const m=s.filter(h=>h.rarity==="common");for(;i.length<t&&m.length>0;){const h=x.nextInt(0,m.length-1),u=m[h];i.push(n(u))}return te(i)},W=(o,e,t)=>se(o,e,t,n=>({...n,instanceId:ee(n.id)})),V=(o,e,t)=>se(o,e,t,s=>{const i={...s,instanceId:ee(s.id)};return i.type==="room_enemy"&&i.stats.minUnits&&i.stats.maxUnits&&(i.units=pe(i.stats.minUnits,i.stats.maxUnits)),i}),fe=o=>o.roomHand.length<3&&!o.roomHand.some(e=>e.type==="room_boss"),ge=o=>[...new Set(o.hand.map(t=>t.id))].length<2&&o.hand.length>0;function ne(o,e){const t=Math.max(0,Math.min(100,o)),n=Math.max(0,Math.min(100,e));return n>66?t<33?v.Anxiety:t<87?v.Arousal:v.Flow:n>33?t<33?v.Worry:t<67?v.Apathy:v.Control:t<67?v.Boredom:v.Relaxation}const M={hp:100,maxHp:100,power:5},_e=3;class I{constructor(e,t){this.hp=M.hp,this.maxHp=M.maxHp,this.power=M.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=v.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=E.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,n)=>t+n,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,n=Math.max(0,Math.min(100,e));this.challengeHistory.push(n),this.challengeHistory.length>_e&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${n})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=ne(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{name:this.firstName,from:a("flow_states."+e),to:a("flow_states."+this.flowState)})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=M.power,n=M.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,n+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,n+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(s=>{t+=s.stats.power||0,n+=s.stats.maxHp||0}),this.power=t,this.maxHp=n,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e){const t=e.traits,n=new I(t);return n.hp=e.hp,n.maxHp=e.maxHp,n.power=e.power,n.inventory=e.inventory,n.activeBuffs=e.activeBuffs,n.skill=e.skill,n.challengeHistory=e.challengeHistory,n.flowState=e.flowState,n.roomHistory=e.roomHistory,n.lootHistory=e.lootHistory,n.boredomCounter=e.boredomCounter,n.firstName=e.firstName,n.lastName=e.lastName,n}}class H{constructor(){this._path=["start"],this._linkLabels={},this._nodes={id:"start",label:"Dungeon Entrance",children:[]},this._currentNode=this._nodes}addRoomSelection(e,t){e.forEach(n=>{this._currentNode.children.push({id:n.instanceId,label:`Floor ${this._path.length}: ${a("items_and_rooms."+n.id)}`,children:[]})}),this._currentNode=this._currentNode.children.find(n=>n.id===t.instanceId),this._path.push(t.instanceId)}generateChartData(){return{nodes:this._nodes,path:this._path,linkLabels:this._linkLabels}}toJSON(){return{nodes:this._nodes,path:this._path,linkLabels:this._linkLabels,currentNodePath:this._getNodePath(this._nodes,this._currentNode)}}_getNodePath(e,t){const n=[];function s(i){if(i.id===t.id)return n.push(i.id),!0;for(const r of i.children)if(s(r))return n.push(i.id),!0;return!1}return s(e),n.reverse()}static fromJSON(e){const t=new H;t._nodes=e.nodes,t._path=e.path,t._linkLabels=e.linkLabels;let n=t._nodes;for(let s=1;s<e.currentNodePath.length;s++)n=n.children.find(i=>i.id===e.currentNodePath[s]);return t._currentNode=n,t}}const ve=99,ye=10,q=10,Z=32,be=18,we=8;var C=(o=>(o.WORKSHOP="workshop",o.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",o.HAND_SIZE_INCREASE="hand_size_increase",o.ADVENTURER_TRAITS="ADVENTURER_TRAITS",o.BP_MULTIPLIER="BP_MULTIPLIER",o.WORKSHOP_ACCESS="WORKSHOP_ACCESS",o.BP_MULTIPLIER_2="BP_MULTIPLIER_2",o))(C||{});const ie=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],oe=10;function ae(o,e){var c,m,h,u;const{traits:t,inventory:n,hp:s,maxHp:i}=o;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((c=n.weapon)==null?void 0:c.stats.power)||0,d=((m=n.armor)==null?void 0:m.stats.maxHp)||0;switch(e.type){case"item_weapon":const p=(e.stats.power||0)-l;if(p<=0&&e.id!==((h=n.weapon)==null?void 0:h.id))return-1;r+=p*(t.offense/10),p>0&&(r+=p*(o.skill/10));const g=e.stats.maxHp||0;g<0&&(r+=g*(100-t.resilience)/20);break;case"item_armor":const f=(e.stats.maxHp||0)-d;if(f<=0&&e.id!==((u=n.armor)==null?void 0:u.id))return-1;r+=f*(100-t.offense)/10,f>0&&(r+=f*(o.skill/10));const y=e.stats.power||0;y>0&&(r+=y*(t.offense/15));const b=e.stats.power||0;b<0&&(r+=b*(t.resilience/10));break;case"item_potion":const w=s/i;r+=10*(100-t.resilience)/100,w<.7&&(r+=20*(1-w)),r+=5*(o.skill/100),n.potions.length>=ve&&(r*=.1);break}return r}function Se(o,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${o.traits.offense}, Resilience: ${o.traits.resilience}, Skill: ${o.skill})`);const n=e.map(i=>({item:i,score:ae(o,i)})).filter(i=>i.score>0);if(n.sort((i,r)=>r.score-i.score),n.length===0||n[0].score<ye)return null;const s=n[0].item;return t.debug(`Adventurer chooses: ${a("items_and_rooms."+s.id)} (Score: ${n[0].score.toFixed(1)})`),s}function xe(o,e){const{flowState:t,hp:n,maxHp:s,inventory:i,traits:r}=o,l=n/s;if(i.potions.length===0)return"attack";let d=.5;switch(t){case v.Anxiety:case v.Worry:d=.8;break;case v.Arousal:case v.Flow:d=.6;break;case v.Control:case v.Relaxation:d=.4;break;case v.Boredom:case v.Apathy:d=.2;break}return d-=r.resilience/200,l<Math.max(.1,d)?"use_potion":"attack"}function ke(o,e,t){if(e){o.lootHistory.push(e.id),o.lootHistory.filter(i=>i===e.id).length>2&&(o.modifyChallenge(o.challenge-oe),o.logger.info("info_repetitive_choice",{name:a("items_and_rooms."+e.id)}));const s=ae(o,e);s>60?(o.modifySkill(10),o.modifyChallenge(o.challenge+5)):s>30?(o.modifySkill(5),o.modifyChallenge(o.challenge+2)):o.modifySkill(2)}else t.length>0?o.modifyChallenge(o.challenge-5):o.modifyChallenge(o.challenge-10);o.updateFlowState()}function Ee(o,e){o.roomHistory.push(e.id),o.roomHistory.filter(s=>s===e.id).length>2&&(o.modifyChallenge(o.challenge-oe),o.logger.info("info_deja_vu",{name:a("items_and_rooms."+e.id)}));let n=0;switch(e.type){case"room_enemy":n=5;break;case"room_boss":n=15;break;case"room_trap":n=10;break;case"room_healing":n=-15;break}o.modifyChallenge(o.challenge+n),o.updateFlowState()}function Ce(o){o.modifySkill(-2),o.updateFlowState()}function G(o,e){switch(e){case"hit":o.modifySkill(.5);break;case"miss":o.modifySkill(-.5);break;case"take_damage":o.modifyChallenge(o.challenge+1);break}o.updateFlowState()}function Ie(o,e,t,n){let s;return e>.7?(s=a("game_engine.too_close_for_comfort"),o.modifyChallenge(o.challenge+10),o.modifySkill(-3)):e>.4?(s=a("game_engine.great_battle"),o.modifyChallenge(o.challenge+5),o.modifySkill(5)):t>3&&o.traits.offense>60?(s=a("game_engine.easy_fight"),o.modifyChallenge(o.challenge-10)):(s=a("game_engine.worthy_challenge"),o.modifyChallenge(o.challenge-2),o.modifySkill(2)),t===n&&o.modifySkill(1*t),o.updateFlowState(),s}const _=E.getInstance();class $e{constructor(e,t,n){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=s=>{this.dungeonHistory=new H,this.metaManager.incrementAdventurers();const i={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0};_.loadEntries([]);const r=new I(i,this._allNames),l=(s==null?void 0:s.items)||this._allItems.filter(y=>y.cost===null).map(y=>y.id),d=W(l,this._allItems,Z),c=this._getHandSize(),m=d.slice(0,c),h=d.slice(c),u=(s==null?void 0:s.rooms)||this._allRooms.filter(y=>y.cost===null).map(y=>y.id),p=V(u,this._allRooms,this._getRoomDeckSize()),g=p.slice(0,c),f=p.slice(c);this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:r,unlockedDeck:l,availableDeck:h,hand:m,unlockedRoomDeck:u,availableRoomDeck:f,roomHand:g,handSize:c,shopItems:[],offeredLoot:[],offeredRooms:[],run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},_.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),_.debug(`Deck size: ${d.length}, Hand size: ${c}, Room Deck size: ${p.length}, Room Hand size: ${g.length}`),_.info("info_designer_choosing_room",{name:r.firstName}),this._emit("state-change",this.gameState)},this.continueGame=()=>{const s=this.gameSaver.load();s?(this.gameState=s,s.dungeonHistory&&(this.dungeonHistory=s.dungeonHistory),this._emit("state-change",this.gameState),this.gameState.phase==="AWAITING_ENCOUNTER_RESULT"&&this.gameState.encounterPayload&&this._emit("show-encounter",this.gameState.encounterPayload)):this.startNewGame()},this.startNewRun=s=>{if(!this.gameState)return;this.dungeonHistory=new H;const i=s||this.gameState.run+1;this.metaManager.updateRun(i);const r=this._getHandSize(),l=W(this.gameState.unlockedDeck,this._allItems,Z),d=l.slice(0,r),c=l.slice(r),m=V(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),h=m.slice(0,r),u=m.slice(r),p=new I(this.gameState.adventurer.traits,this._allNames);p.skill=this.gameState.adventurer.skill,p.challengeHistory=[...this.gameState.adventurer.challengeHistory],p.flowState=this.gameState.adventurer.flowState,_.info("info_adventurer_returns",{name:p.firstName}),_.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:p,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:c,hand:d,availableRoomDeck:u,roomHand:h,handSize:r,room:1,run:i,runEnded:{isOver:!1,reason:"",success:!1,decision:null}},_.info("info_designer_choosing_room",{name:p.firstName}),this._emit("state-change",this.gameState)},this.presentOffer=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const i=this.gameState.hand.filter(w=>s.includes(w.instanceId));this.gameState.offeredLoot=i;const r=this.gameState.adventurer,l=Se(r,this.gameState.offeredLoot,_),d=this.gameState.offeredLoot.map(w=>a("items_and_rooms."+w.id)).join(", ");_.info("info_loot_chosen",{name:r.firstName,items:d});const c=r.flowState;ke(r,l,this.gameState.offeredLoot),c!==r.flowState&&_.metric({event:"flow_state_changed",flowState:r.flowState}),l?(_.info("info_item_chosen",{name:r.firstName,item:a("items_and_rooms."+l.id)}),_.metric({event:"item_chosen",item:l})):_.info("info_loot_declined",{name:r.firstName});let m=this.gameState.hand,h=this.gameState.availableDeck;m.forEach(w=>w.justDrafted=!1);let u=m.filter(w=>!s.includes(w.instanceId));const p=this.gameState.handSize-u.length,g=h.slice(0,p);g.forEach(w=>{w.draftedRoom=this.gameState.room,w.justDrafted=!0});const f=h.slice(p);u.push(...g),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const y=this.gameState.room+1,b=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,availableDeck:f,hand:u,room:y,designer:{balancePoints:b}},_.info("info_designer_choosing_room",{name:r.firstName}),this._emit("state-change",this.gameState)},this.runEncounter=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=s;const i=x.nextInt(0,this.gameState.offeredRooms.length-1),r=this.gameState.offeredRooms[i];if(this.dungeonHistory.addRoomSelection(s,r),this.gameState.offeredRooms.length===1&&r.type==="room_boss")_.info("info_boss_room_chosen",{name:this.gameState.adventurer.firstName,chosenRoom:a("items_and_rooms."+r.id)});else{const m=this.gameState.offeredRooms.map(h=>a("items_and_rooms."+h.id)).join(", ");_.info("info_room_chosen",{name:this.gameState.adventurer.firstName,rooms:m})}_.metric({event:"room_encountered",room:r});const{log:l,finalAdventurer:d}=this._generateEncounterLog(this.gameState.adventurer,r),c={room:r,log:l,finalAdventurer:d};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT",encounterPayload:c},this._emit("state-change",this.gameState),this._emit("show-encounter",c)},this.continueEncounter=()=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate()},this._postEncounterUpdate=()=>{if(!this.gameState)return;const s=I.fromJSON(this.gameState.encounterPayload.finalAdventurer);s.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let i=this.gameState.roomHand,r=this.gameState.availableRoomDeck;i.forEach(u=>u.justDrafted=!1);const l=this.gameState.offeredRooms.map(u=>u.instanceId);let d=i.filter(u=>!l.includes(u.instanceId));const c=this.gameState.handSize-d.length,m=r.slice(0,c);m.forEach(u=>{u.draftedRoom=this.gameState.room,u.justDrafted=!0});const h=r.slice(c);if(d.push(...m),this.gameState.adventurer=s,s.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(s.boredomCounter>2){const u=s.flowState===v.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(u);return}this.gameState.hand&&this.gameState.hand.length===0?(_.warn("warn_empty_hand",{name:s.firstName}),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},encounterPayload:void 0,roomHand:d,availableRoomDeck:h},_.info("info_designer_choosing_room",{name:s.firstName})):(this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",encounterPayload:void 0,roomHand:d,availableRoomDeck:h},_.info("info_designer_choosing_loot",{name:s.firstName})),this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this.metaManager.acls.has(C.WORKSHOP)){_.debug("Workshop not unlocked, starting new run directly."),this.startNewRun();return}_.info("info_entering_workshop",{name:this.gameState.adventurer.firstName});const s=this.gameState.run+1,i=this._allItems.filter(d=>d.cost!==null).filter(d=>!this.gameState.unlockedDeck.includes(d.id)),r=this._allRooms.filter(d=>d.cost!==null).filter(d=>!this.gameState.unlockedRoomDeck.includes(d.id)),l=[...i,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:s,room:0,shopItems:te(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},_.info("info_welcome_to_workshop"),this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=s=>{if(!this.gameState)return;const i=this._allItems.find(g=>g.id===s),r=this._allRooms.find(g=>g.id===s),l=i||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let d=this.gameState.unlockedDeck,c=this.gameState.unlockedRoomDeck,m=this.gameState.availableDeck,h=this.gameState.availableRoomDeck;i?(d=[...this.gameState.unlockedDeck,s],this.isWorkshopAccessUnlocked()&&(m=[i,...this.gameState.availableDeck])):r&&(c=[...this.gameState.unlockedRoomDeck,s],this.isWorkshopAccessUnlocked()&&(h=[r,...this.gameState.availableRoomDeck]));const u=this.gameState.designer.balancePoints-l.cost,p=this.gameState.shopItems.filter(g=>g.id!==s);_.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:a("items_and_rooms."+l.id)}),_.metric({event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:u},unlockedDeck:d,unlockedRoomDeck:c,availableDeck:m,availableRoomDeck:h,shopItems:p},this._emit("state-change",this.gameState)},this.quitGame=(s=!0)=>{s&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(C.BP_MULTIPLIER_2)?q*4:this.metaManager.acls.has(C.BP_MULTIPLIER)?q*2:q,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=n,this.dungeonHistory=new H}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const n=this._listeners[e];n&&n.forEach(s=>s(...t))}_createAdventurerSnapshot(e){return{firstName:e.firstName,lastName:e.lastName,hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var r;const n=[],s=I.fromJSON(e.toJSON());_.info("info_encounter",{name:s.firstName,roomName:a("items_and_rooms."+t.id)});const i=s.flowState;switch(Ee(s,t),i!==s.flowState&&_.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_encounter",replacements:{name:s.firstName,roomName:a("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(s)}),t.type){case"room_enemy":case"room_boss":{const l={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let d=0;const c=s.hp;for(let g=0;g<l.enemyCount;g++){let f=l.enemyHp;_.info("info_encounter_enemy",{name:s.firstName,enemyName:t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),current:g+1,total:l.enemyCount});const y=t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),b={currentHp:f,maxHp:l.enemyHp,power:l.enemyPower,name:y,count:g+1,total:l.enemyCount};for(n.push({messageKey:"log_messages.info_encounter_enemy",replacements:{name:s.firstName,enemyName:t.entity_id?a("entities."+t.entity_id):a("items_and_rooms."+t.id),current:g+1,total:l.enemyCount},adventurer:this._createAdventurerSnapshot(s),enemy:b});f>0&&s.hp>0;){if(xe(s)==="use_potion"){const S=s.inventory.potions.shift();if(S){const k=S.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+k),_.info("info_adventurer_drinks_potion",{name:s.firstName,potionName:a("items_and_rooms."+S.id)}),n.push({messageKey:"log_messages.info_adventurer_drinks_potion",replacements:{name:s.firstName,potionName:a("items_and_rooms."+S.id)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f}})}}else{const S=Math.min(.95,.75+s.traits.skill/500+s.traits.offense/1e3);if(x.nextFloat()<S){const k=s.power;f-=k,_.debug(`Adventurer hits for ${k} damage.`);const D=s.flowState;G(s,"hit"),D!==s.flowState&&(_.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${D}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f}})),n.push({messageKey:"log_messages.info_adventurer_hit",replacements:{name:s.firstName,damage:k},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f},animations:[{target:"adventurer",animation:"attack"},{target:"enemy",animation:"shake"}]})}else{_.debug("Adventurer misses.");const k=s.flowState;G(s,"miss"),k!==s.flowState&&(_.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${k}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f}})),n.push({messageKey:"log_messages.info_adventurer_miss",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f},animations:[{target:"adventurer",animation:"attack"}]})}}if(f<=0){_.info("info_enemy_defeated",{enemyName:b.name}),d++,n.push({messageKey:"log_messages.info_enemy_defeated",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:0},animations:[{target:"enemy",animation:"defeat"}]});break}const R=Math.max(.4,.75-s.traits.skill/500-(100-s.traits.offense)/1e3);if(x.nextFloat()<R){const S=(((r=s.inventory.armor)==null?void 0:r.stats.maxHp)||0)/10,k=Math.max(1,l.enemyPower-S);s.hp-=k,_.debug(`Enemy hits for ${k} damage.`);const D=s.flowState;G(s,"take_damage"),D!==s.flowState&&(_.metric({event:"flow_state_changed",flowState:s.flowState}),n.push({messageKey:"log_messages.info_flow_state_changed",replacements:{name:s.firstName,from:a(`flow_states.${D}`),to:a(`flow_states.${s.flowState}`)},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f}})),n.push({messageKey:"log_messages.info_enemy_hit",replacements:{damage:k,enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f},animations:[{target:"enemy",animation:"attack"},{target:"adventurer",animation:"shake"}]})}else _.debug("Enemy misses."),n.push({messageKey:"log_messages.info_enemy_miss",replacements:{enemyName:b.name},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f},animations:[{target:"enemy",animation:"attack"}]})}if(s.hp<=0){_.warn("info_adventurer_defeated",{name:s.firstName}),n.push({messageKey:"log_messages.info_adventurer_defeated",replacements:{name:s.firstName},adventurer:this._createAdventurerSnapshot(s),enemy:{...b,currentHp:f},animations:[{target:"adventurer",animation:"defeat"}]});break}}const m=c-s.hp,h=m/s.maxHp;_.debug(`hpLost: ${m}, hpLostRatio: ${h.toFixed(2)}`);const u=s.flowState,p=Ie(s,h,d,l.enemyCount);u!==s.flowState&&_.metric({event:"flow_state_changed",flowState:s.flowState}),_.info("info_battle_outcome",{outcome:p});break}case"room_healing":{const l=t.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+l),_.info("info_healing_room",{name:s.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:l}),n.push({messageKey:"log_messages.info_healing_room",replacements:{name:s.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:l},adventurer:this._createAdventurerSnapshot(s)});break}case"room_trap":{const l=t.stats.attack||0;s.hp-=l;const d=s.flowState;Ce(s),d!==s.flowState&&_.metric({event:"flow_state_changed",flowState:s.flowState}),_.info("info_trap_room",{name:s.firstName,trapName:a("items_and_rooms."+t.id),damage:l}),n.push({messageKey:"log_messages.info_trap_room",replacements:{name:s.firstName,trapName:a("items_and_rooms."+t.id),damage:l},adventurer:this._createAdventurerSnapshot(s)});break}}return{log:n,finalAdventurer:s}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const n=this.metaManager.checkForUnlocks(this.gameState.run);_.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),_.metric({event:"run_end",bp:this.gameState.designer.balancePoints}),_.error("info_game_over",{reason:e});const s=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:s},newlyUnlocked:n},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:n}=this.gameState.adventurer,{resilience:s,offense:i}=t,r=Math.min(n/100,1);if(e===v.Flow)return"continue";let l=.55;switch(e){case v.Anxiety:l+=.25-s/400;break;case v.Arousal:l-=.1-i/1e3;break;case v.Worry:l+=.2;break;case v.Control:l-=.15;break;case v.Relaxation:l+=.1;break;case v.Boredom:l+=.3;break;case v.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),x.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(_.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:x.nextInt(10,90),resilience:x.nextInt(10,90),skill:0},t=new I(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(C.HAND_SIZE_INCREASE)?12:we}_getRoomDeckSize(){return this.metaManager.acls.has(C.ROOM_DECK_SIZE_INCREASE)?36:be}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(C.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(C.WORKSHOP)}getDungeonChartData(){return this.dungeonHistory.generateChartData()}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class A{constructor(e,t,n,s){this.resolve=s;const i=document.createElement("div");i.dataset.testid="info-modal-overlay",Object.assign(i.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),i.addEventListener("click",f=>{if(f.target===i){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const d=document.createElement("div");d.id="info-modal-title",d.className="title-bar-text",d.textContent=e,l.appendChild(d),r.appendChild(l);const c=document.createElement("div");c.className="window-body text-center p-4";const m=document.createElement("div");m.innerHTML=t,c.appendChild(m);const h=document.createElement("div");h.className="flex justify-center gap-2 mt-4",n.forEach(f=>{const y=document.createElement("button");y.textContent=f.text,y.addEventListener("click",()=>{this.dismiss(f.value)}),h.appendChild(y)}),c.appendChild(h),r.appendChild(c),i.appendChild(r),document.body.appendChild(i),this.handleKeydown=f=>{if(f.key==="Escape"){const y=n.find(b=>typeof b.value=="boolean"&&b.value===!1);y&&this.dismiss(y.value)}},document.addEventListener("keydown",this.handleKeydown);const u=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),p=u[0],g=u[u.length-1];p==null||p.focus(),r.addEventListener("keydown",f=>{f.key==="Tab"&&(f.shiftKey?document.activeElement===p&&(g.focus(),f.preventDefault()):document.activeElement===g&&(p.focus(),f.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,n){return new Promise(s=>{new A(e,t,n,s)})}static showInfo(e,t,n=a("global.continue")){const s=[{text:n,value:void 0}];return A.show(e,t,s)}}class j{static show(e,t){const n=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return A.show(e,t,n)}}class Re extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t){if(this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show"),this.isDesktop&&t){const n=t.getBoundingClientRect(),s=this.getBoundingClientRect();let i=n.top-s.height-10,r=n.left+n.width/2-s.width/2;i<0?(i=n.bottom+10,this.contentContainer.classList.add("flipped")):this.contentContainer.classList.remove("flipped"),r<0?r=5:r+s.width>window.innerWidth&&(r=window.innerWidth-s.width-5),this.style.top=`${i}px`,this.style.left=`${r}px`}}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Re);class T{constructor(){this.showTimeout=null,this.hideTimeout=null,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox),this.mutationObserver=new MutationObserver(()=>{this.tooltipBox.hide(),this.activeToolipKey=""})}static getInstance(){return T.instance||(T.instance=new T),T.instance}initializeTooltipIcons(){document.querySelectorAll("[data-tooltip-key]").forEach(t=>{if(t.querySelector(".tooltip-icon"))return;const n=document.createElement("span");n.textContent="?",n.className="tooltip-icon",t.appendChild(n)})}handleMouseEnter(e){if(this.isTouchDevice())return;const t=this.findTooltipKeyElement(e.target),n=t&&t.getAttribute("data-tooltip-key");this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),n&&this.activeToolipKey!==n&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=n;const s=this.getTooltipContent(n);s&&(this.mutationObserver.observe(document,{childList:!0,subtree:!0}),this.tooltipBox.show(s,t))},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.mutationObserver.disconnect(),this.tooltipBox.hide(),this.activeToolipKey="")}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const n=this.findTooltipKeyElement(t.parentElement),s=n.getAttribute("data-tooltip-key");if(s){const i=this.getTooltipContent(s);i&&this.tooltipBox.show(i,n)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKeyElement(e){return e?e.hasAttribute("data-tooltip-key")?e:this.findTooltipKeyElement(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let n=a(`tooltips.${e}.title`);return n.includes("tooltips.")&&(n=a("global.information")),{title:n,body:t}}}const B=T.getInstance(),Ne=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,Le=(o,e,t)=>{if(B.handleMouseLeave(),!e){o.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":He(o,t);break;case"SHOP":Ae(o,e,t);break;default:Te(o,e,t);break}B.initializeTooltipIcons()},J=(o,e,t)=>{const n=document.createElement("choice-panel");return n.engine=e,t==="item"?(n.choices=o.hand,n.deckType="item",n.offerImpossible=ge(o)):(n.choices=o.roomHand,n.deckType="room",n.roomSelectionImpossible=fe(o)),n},Te=(o,e,t)=>{var d;if(!o.querySelector("adventurer-status")){o.innerHTML=Ne;const c=o.querySelector("#game-title");c&&(c.textContent=a("game_title"));const m=o.querySelector("#adventurer-status-title");m&&(m.textContent=a("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(d=o.querySelector("#quit-game-btn"))==null||d.addEventListener("click",async()=>{await j.show(a("global.quit"),a("global.quit_confirm"))&&t.quitGame(!1)})}const n=o.querySelector("adventurer-status"),s=o.querySelector("log-panel"),i=o.querySelector("game-stats"),r=o.querySelector("#game-phase-panel"),l=o.querySelector("#game-phase-title");switch(n.metaState=t.metaManager.metaState,n.adventurer=e.adventurer,i.engine=t,t.isWorkshopUnlocked()?i.setAttribute("balance-points",e.designer.balancePoints.toString()):i.removeAttribute("balance-points"),i.setAttribute("run",e.run.toString()),i.setAttribute("room",e.room.toString()),i.setAttribute("deck-size",e.availableDeck.length.toString()),i.setAttribute("room-deck-size",e.availableRoomDeck.length.toString()),s.logger=E.getInstance(),s.traits=e.adventurer.traits,r.innerHTML="",e.phase){case"RUN_OVER":{l&&(l.textContent=a("run_ended_screen.run_complete"));const c=document.createElement("run-ended-screen");c.setAttribute("final-bp",e.designer.balancePoints.toString()),c.setAttribute("reason",e.runEnded.reason),c.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&c.setAttribute("workshop-unlocked",""),e.runEnded.decision&&c.initialize(e.runEnded.decision,e.newlyUnlocked,t),r.appendChild(c);break}case"DESIGNER_CHOOSING_LOOT":l&&(l.textContent=a("choice_panel.title")),r.appendChild(J(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":l&&(l.textContent=a("choice_panel.title_room")),r.appendChild(J(e,t,"room"));break;default:l&&(l.textContent="...");break}},He=(o,e)=>{o.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,o.appendChild(t)},Ae=(o,e,t)=>{o.innerHTML="";const n=document.createElement("workshop-screen");n.items=e.shopItems,n.balancePoints=e.designer.balancePoints,n.engine=t,o.appendChild(n)},Y="hypercubicle-meta";class De{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const n of ie)e>=n.runThreshold&&!this._metaState.unlockedFeatures.includes(n.feature)&&(this._metaState.unlockedFeatures.push(n.feature),t.push(n.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(Y);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(Y,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const P="hypercubicle-savegame",z="1.0.1";class Me{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(P,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(P);if(e){const t=JSON.parse(e);return t.version!==z?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${z}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(P)!==null}clear(){this.storage.removeItem(P)}_serialize(e){const{adventurer:t,dungeonHistory:n,...s}=e;return{version:z,...s,adventurer:t.toJSON(),logger:E.getInstance().toJSON(),dungeonHistory:n==null?void 0:n.toJSON()}}_deserialize(e){const{adventurer:t,logger:n,dungeonHistory:s,...i}=e;E.getInstance().loadEntries(n.entries);const l=I.fromJSON(t),d=s?H.fromJSON(s):void 0,{version:c,...m}=i;return{...m,adventurer:l,dungeonHistory:d}}}class Oe{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Pe{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',qe=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Ge=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',ze=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Fe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class je extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,n;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(n=this._metaState)==null?void 0:n.unlockedFeatures.includes(C.ADVENTURER_TRAITS);this.innerHTML=`
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
                            <div class="flex items-center">${Be()} <span>${a("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${qe()} <span class="ml-1">${a("global.power")}</span></div>
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
        `,this._hasRendered=!0}update(){var d;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const n=this.querySelector("#flow-state-text");n.textContent=a(`flow_states.${this._adventurer.flowState}`),n.className=`font-mono text-xl text-center flex-grow ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(n);const s=this.querySelector("flow-chart");s.setAttribute("skill",`${this._adventurer.skill}`),s.setAttribute("challenge",`${this._adventurer.challenge}`);const i=this.querySelector("#power-text");i.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(i);const r=(d=this._metaState)==null?void 0:d.unlockedFeatures.includes(C.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(r){l.classList.remove("hidden");const c=this.querySelector("#offense-trait"),m=this.querySelector("#resilience-trait"),h=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(m),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(h),c.textContent=`${this._adventurer.traits.offense}`,m.textContent=`${this._adventurer.traits.resilience}`,h.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Ge(),a("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("armor-slot",ze(),a("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Ue(),a("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div class="text-xs">
                <p>${a("items_and_rooms."+c.id)} (${a("global.duration")}: ${c.stats.duration})</p>
                <p>${Object.entries(c.stats).filter(([m])=>m!=="duration").map(([m,h])=>`${a(`global.${m}`)}: ${h}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("potions-slot",Fe(),a("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${a("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-shake"),e.addEventListener("animationend",()=>{e.classList.remove("animate-shake")},{once:!0}))}updateInventorySlot(e,t,n,s){const i=this.querySelector(`#${e}`);i.dataset.content!==s&&(i.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${n}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${s}
                </div>
            `,i.dataset.content=s)}getFlowStateColor(e){switch(e){case v.Boredom:case v.Apathy:return"text-red-500";case v.Anxiety:case v.Worry:return"text-orange-500";case v.Arousal:case v.Control:case v.Relaxation:return"text-blue";case v.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",je);class Ke extends HTMLElement{constructor(){super(),this._skill=50,this._challenge=50,this._canvas=null,this._ctx=null,this._backgroundRendered=!1}static get observedAttributes(){return["skill","challenge"]}connectedCallback(){this.innerHTML=`
      <div class="relative" style="width: 100px; height: 100px;">
        <canvas width="100" height="100" style="image-rendering: pixelated;"></canvas>
        <div id="flow-chart-dot" style="position: absolute; width: 8px; height: 8px; background-color: white; border: 1px solid black; border-radius: 50%; transform: translate(-50%, -50%); transition-delay: 0.5s; transition: 0.5s ease;"></div>
      </div>
    `,this._canvas=this.querySelector("canvas"),this._ctx=this._canvas.getContext("2d"),this.render()}attributeChangedCallback(e,t,n){t!==n&&(e==="skill"&&(this._skill=parseFloat(n)),e==="challenge"&&(this._challenge=parseFloat(n)),this.render())}render(){if(!this._ctx||!this._canvas)return;this._backgroundRendered||this._renderBackground();const e=this.querySelector("#flow-chart-dot"),t=Math.max(0,Math.min(100,this._skill)),n=100-Math.max(0,Math.min(100,this._challenge));e.style.left=`${t}%`,e.style.top=`${n}%`}_renderBackground(){if(!this._ctx||!this._canvas)return;const e=this._ctx;for(let t=0;t<100;t++)for(let n=0;n<100;n++){const s=ne(t,100-n);e.fillStyle=this.getFlowStateCanvasColor(s),e.fillRect(t,n,1,1)}e.font='12px "Pixelated MS Sans Serif"',e.fillStyle="black",e.strokeStyle="white",e.lineWidth=2,e.textAlign="center",e.strokeText("Skill",50,95),e.fillText("Skill",50,95),e.save(),e.translate(12,50),e.rotate(-Math.PI/2),e.strokeText("Challenge",0,0),e.fillText("Challenge",0,0),e.restore(),this._backgroundRendered=!0}getFlowStateCanvasColor(e){switch(e){case v.Apathy:return"rgba(239, 68, 68, 0.2)";case v.Boredom:return"rgba(239, 68, 68, 0.6)";case v.Anxiety:return"rgba(249, 115, 22, 0.6)";case v.Worry:return"rgba(249, 115, 22, 0.2)";case v.Arousal:return"rgba(59, 130, 246, 0.8)";case v.Control:return"rgba(59, 130, 246, 0.4)";case v.Relaxation:return"rgba(59, 130, 246, 0.2)";case v.Flow:return"#eab308";default:return"#000000"}}}customElements.define("flow-chart",Ke);class We extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,n){this.decision=e,this.newlyUnlocked=t,this.engine=n,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=ie.find(s=>s.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),n=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await A.showInfo(t,n,a("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const n=this.querySelector("#decision-container");n&&(n.innerHTML=`<p>${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||a("run_ended_screen.default_reason");this.innerHTML=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),n=this.querySelector("#button-container");if(!t||!n||this.state!=="decision-revealed")return;let s="",i="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(s=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${a("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,i=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${a(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(s=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${a("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,i=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=s,n.innerHTML=i}}customElements.define("run-ended-screen",We);class Ve extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,n){switch(e){case"balance-points":this._balancePoints=Number(n);break;case"run":this._run=Number(n);break;case"room":this._room=Number(n);break;case"deck-size":this._deckSize=Number(n);break;case"room-deck-size":this._roomDeckSize=Number(n);break}this.render()}connectedCallback(){this.render()}render(){var e,t,n;this.innerHTML=`
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

                <button id="dungeon-chart-btn">Dungeon Chart</button>
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()}),(n=this.querySelector("#dungeon-chart-btn"))==null||n.addEventListener("click",async()=>{var i;await A.show("Dungeon Chart","<dungeon-chart></dungeon-chart>",[{text:"Close",value:!1}]);const s=document.querySelector("dungeon-chart");s&&(s.data=(i=this.engine)==null?void 0:i.getDungeonChartData())})}}customElements.define("game-stats",Ve);class Ze extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const n=this.querySelector("#log-container");if(n){const s=document.createElement("p");s.className=this._getLogColor(e.level),s.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,n.appendChild(s)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const s=t.map((i,r)=>`<p class="${this._getLogColor(i.level)}">[${r.toString().padStart(3,"0")}] ${i.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${s}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let s=this._renderedLogCount;s<t.length;s++)this._appendEntry(t[s],s);this._renderedLogCount=t.length}const n=this.querySelector("#log-container");n&&(n.scrollTop=n.scrollHeight)}}customElements.define("log-panel",Ze);const Je={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},N=(o,e,t=!0,n=1)=>{const s=t?"text-green-600":"text-red-400",i=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${s}">
            <span ${n>1?'data-tooltip-key="multiple_units"':""}>${o}${n>1?a("global.units"):""}</span>
            <span class="font-mono">${i}${e}</span>
        </div>
    `};class Ye extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const n=this.querySelector('input[type="checkbox"]');n&&!n.disabled&&(n.checked=!n.checked,n.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Je[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",n=`card-checkbox-${this._item.instanceId}`;let s="";this._isSelectable&&(this._isDisabled?s="opacity-50 cursor-not-allowed":s="cursor-pointer");const i=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s} ${i}`;let r=a("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const c=this._item,m=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${c.stats.hp?N(a("global.health"),c.stats.hp,c.stats.hp>0):""}
            ${c.stats.maxHp?N(a("global.max_hp"),c.stats.maxHp,c.stats.maxHp>0):""}
            ${c.stats.power?N(a("global.power"),c.stats.power,c.stats.power>0):""}
            ${c.stats.duration?N(a("global.duration"),c.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${m.stats.hp?N(a("global.health"),m.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${m.stats.attack?N(a("global.attack"),m.stats.attack,!1,m.units):""}
            ${m.stats.hp?N(a("global.health"),m.stats.hp,!1,m.units):""}
          `,m.units>1&&(r=a("choice_panel.multiple_enemies_title",{name:r,count:m.units}));break}}this._stackCount>1&&(r=a("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const d=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${d} text-left flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
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
    `}}customElements.define("choice-card",Ye);const F=4;class Xe extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const n=this._choices.filter(s=>this._selectedIds.includes(s.instanceId));this.engine.runEncounter(n)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(s=>s.instanceId===e);if(!t)return;const n=this._selectedIds.includes(e);if(this._deckType==="room"){const s=t.type==="room_boss";if(n)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");s&&this._selectedIds.length===0?this._selectedIds.push(e):!s&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const i=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);i.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!i.includes(l)):this._selectedIds.length<F&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e={item_weapon:0,item_armor:1,item_potion:2,item_buff:3},t={room_healing:0,room_trap:1,room_enemy:2,room_boss:3},n=["attack","hp","power","maxHp"],s=[...this._choices].sort((h,u)=>{var y,b;const p=this._deckType==="item"?e:t,g=h.type,f=u.type;if(g in p&&f in p){const w=p[g]-p[f];if(w!==0)return w}for(const w of n){let R=((y=h.stats)==null?void 0:y[w])??null,S=((b=u.stats)==null?void 0:b[w])??null;if(w=="attack"&&this._deckType==="room"&&(R*=h.units||1,S*=u.units||1),R!==null&&S!==null){if(R!==S)return R-S}else{if(R!==null)return 1;if(S!==null)return-1}}return 0}),i=this._deckType==="room";let r;if(i)r=s;else{const h=new Map;s.forEach(u=>{const p=u;h.has(p.id)?h.get(p.id).count++:h.set(p.id,{choice:p,count:1})}),r=Array.from(h.values()).map(u=>({...u.choice,stackCount:u.count}))}a(i?"choice_panel.title_room":"choice_panel.title");let l=a(i?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?l=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(l=a("choice_panel.roll_credits"));let d=!1,c=l;this._offerImpossible||this._roomSelectionImpossible?d=!0:i?this._choices.filter(p=>this._selectedIds.includes(p.instanceId)).some(p=>p.type==="room_boss")?(d=this._selectedIds.length===1,c=`${l} (1/1)`):(d=this._selectedIds.length===3,c=`${l} (${this._selectedIds.length}/3)`):(d=this._selectedIds.length>=2&&this._selectedIds.length<=F,c=`${l} (${this._selectedIds.length}/${F})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!d||this._disabled?"disabled":""}>
                    ${c}
                </button>
            </div>
        </div>
    `;const m=this.querySelector("#loot-card-container");m&&r.forEach(h=>{const u=document.createElement("choice-card");u.item=h,"stackCount"in h&&(u.stackCount=h.stackCount),u.isSelected=this._selectedIds.includes(h.instanceId);let p=this._disabled;if(this._offerImpossible)p=!0;else if(i){const g=this._choices.filter(y=>this._selectedIds.includes(y.instanceId)),f=g.some(y=>y.type==="room_boss");u.isSelected?p=!1:(f||h.type==="room_boss"&&g.length>0||g.length>=3)&&(p=!0)}else{const g=new Map(this._choices.map(b=>[b.instanceId,b.id])),f=this._selectedIds.map(b=>g.get(b));p=!u.isSelected&&f.includes(h.id)||this._disabled}u.isDisabled=p,u.isNewlyDrafted=h.justDrafted&&this._initialRender||!1,m.appendChild(u)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Xe);class Qe extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,n=t.dataset.itemId;n&&this.engine&&this.engine.purchaseItem(n),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
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
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const n=document.createElement("choice-card");n.item=t,n.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(n)}}}}customElements.define("workshop-screen",Qe);class et extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await j.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await j.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let n="";if(t){const s=e.adventurers||0;n=`
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
          <p class="status-bar-field">build 184</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",et);const tt=3e3,st=900;class re extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0,this.battleSpeed=st,this.modalState="reveal"}connectedCallback(){if(!this.payload)return;this.innerHTML=`
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
    `,this.querySelector("#continue-button").addEventListener("click",()=>this.handleContinue());const e=this.querySelector("#speed-slider"),t=[1500,1200,900,600,300];e.addEventListener("input",n=>{const s=n.target.value;this.battleSpeed=t[parseInt(s,10)]}),this.start()}start(){if(!this.payload)return;this.modalState="reveal";const e=this.querySelector("#continue-button"),t=this.payload.log[0];this.appendLog(a(t.messageKey,t.replacements)),e.textContent=a("global.continue"),this.revealTimeout=window.setTimeout(()=>{this.modalState="battle",this.renderBattleView()},tt)}handleContinue(){if(!this.payload)return;const e=this.payload.room.type==="room_enemy"||this.payload.room.type==="room_boss";if(this.modalState==="reveal")if(window.clearTimeout(this.revealTimeout),e)this.modalState="battle",this.renderBattleView();else{this.modalState="outcome";const t=this.payload.log[1];t&&this.appendLog(a(t.messageKey,t.replacements))}else this.modalState==="outcome"&&this.dismiss(!1)}renderInitialView(){return`
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
    `}renderBattleView(){this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#slider-container").classList.remove("hidden");const e=this.querySelector("#continue-button");e.id="skip-button",e.textContent=a("global.skip"),e.onclick=()=>this.dismiss(!0),this.currentEventIndex=1,this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){const i=this.querySelector("#skip-button");i&&(i.textContent=a("global.continue"),i.onclick=()=>this.dismiss(!1));return}const e=this.querySelector("#battle-adventurer"),t=this.querySelector("#battle-enemy"),n=this.querySelector("#battlefield");e.classList.remove("animate-attack","animate-shake","animate-defeat"),t.classList.remove("animate-attack","animate-shake","animate-defeat"),n.classList.remove("animate-shake");const s=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(s.adventurer),s.enemy&&this.renderEnemyStatus(s.enemy),s.animations&&s.animations.forEach(i=>{let r=null;i.target==="adventurer"?r=e:i.target==="enemy"?r=t:r=n,r.classList.add(`animate-${i.animation}`)}),this.appendLog(a(s.messageKey,s.replacements)),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=window.setTimeout(()=>this.renderNextBattleEvent(),this.battleSpeed)}renderAdventurerStatus(e){const t=e.hp/e.maxHp*100;this.querySelector("#battle-adventurer").innerHTML=`
      <div class="text-lg font-bold">${e.firstName} ${e.lastName}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.hp} / ${e.maxHp}</div>
    `}renderEnemyStatus(e){const t=e.currentHp/e.maxHp*100;this.querySelector("#battle-enemy").innerHTML=`
      <div class="text-lg font-bold">${e.name}${e.total>1?` (${e.count}/${e.total})`:""}</div>
      <progress max="100" value="${t}" style-width="100%"></progress>
      <div>${e.currentHp} / ${e.maxHp}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=this.currentEventIndex/(this.payload.log.length-1);this.querySelector("#progress-container progress").value=e*100}appendLog(e){const t=this.querySelector("#event-log"),n=document.createElement("li");n.textContent=e,t.appendChild(n),t.scrollTop=t.scrollHeight}dismiss(e){clearTimeout(this.battleTimeout),this.querySelector("#progress-container").classList.add("hidden"),this.querySelector("#slider-container").classList.add("hidden"),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const n=document.createElement("encounter-modal");n.payload=e,n.onDismiss=t,document.body.appendChild(n)})}}customElements.define("encounter-modal",re);const nt=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:re},Symbol.toStringTag,{value:"Module"})),L=140,O=60,U=80,it=20;class ot extends HTMLElement{constructor(){super(),this._data=null,this._positions=new Map,this._maxDepth=0,this._allNodes=[],this._transform={scale:1,tx:0,ty:0},this.attachShadow({mode:"open"})}get data(){return this._data}set data(e){this._data=JSON.parse(JSON.stringify(e)),this.render()}connectedCallback(){this._injectStyles(),this.render()}_injectStyles(){const e=document.createElement("style");e.textContent=`
:host {
  --bg-color: #f0f4f8;
  --text-color: #333;
  --node-bg: #ffffff;
  --node-border: #b0bec5;
  --node-shadow: rgba(0, 0, 0, 0.08);
  --path-node-bg: #e8f5e9;
  --path-node-border: #66bb6a;
  --connector-color: #b0bec5;
  --path-connector-color: #66bb6a;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  font-family: "Pixelated MS Sans Serif", Arial;
}

svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

svg:active {
    cursor: grabbing;
}

.node-rect {
  stroke-width: 1.5px;
  rx: 8;
  ry: 8;
  transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;
}

.node-text {
  font-size: 12px;
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--text-color);
  pointer-events: none; /* Allow events to pass through text to the rect */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.connector-label {
  font-size: 11px;
  font-weight: 500;
  fill: #546e7a;
  text-anchor: middle;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
    `,this.shadowRoot.appendChild(e)}_createSVGElement(e,t={}){const n=document.createElementNS("http://www.w3.org/2000/svg",e);for(const s in t)n.setAttribute(s,t[s]);return n}_prepareTree(e,t=0,n=null){const s=e,i=n;if(s.depth=t,s.parent=i,this._maxDepth=Math.max(this._maxDepth,t),this._allNodes.push(s),!s.children||s.children.length===0)return s.leafCount=1,1;let r=0;for(const l of s.children)r+=this._prepareTree(l,t+1,s);return s.leafCount=r,r}_calculatePositions(e,t,n){const i=this._maxDepth*(O+U)-e.depth*(O+U),r=t+(n-t)/2-L/2;if(this._positions.set(e.id,{x:r,y:i}),!e.children||e.children.length===0)return;let l=t;for(const d of e.children){const c=(n-t)*d.leafCount/e.leafCount;this._calculatePositions(d,l,l+c),l+=c}}_drawConnector(e,t){const n=this._positions.get(e.id),s=this._positions.get(t.id),i=this._data.path.includes(t.id)&&this._data.path.includes(e.id),r=n.x+L/2,l=n.y,d=s.x+L/2,c=s.y+O,m=l-U/2,h=this._createSVGElement("g"),u=this._createSVGElement("path",{d:`M ${r} ${l} V ${m} H ${d} V ${c}`,stroke:i?"var(--path-connector-color)":"var(--connector-color)","stroke-width":i?"2.5":"1.5",fill:"none"});h.appendChild(u);const p=this._data.linkLabels[t.id];if(p){const g=this._createSVGElement("text",{class:"connector-label",x:d+"",y:m+"",dy:"-4px"});g.textContent=p,i&&(g.style.fill="var(--path-connector-color)",g.style.fontWeight="700"),h.appendChild(g)}this._groupEl.prepend(h)}_drawNode(e){const t=this._positions.get(e.id),n=this._data.path.includes(e.id),s=this._createSVGElement("g"),i=this._createSVGElement("rect",{x:t.x,y:t.y,width:L+"",height:O+"",fill:n?"var(--path-node-bg)":"var(--node-bg)",stroke:n?"var(--path-node-border)":"var(--node-border)",class:"node-rect",filter:"url(#shadow)"});s.appendChild(i);const r=this._createSVGElement("text",{class:"node-text"}),l=e.label.split(" ");let d="";const c=[],m=L-20;for(let p=0;p<l.length;p++){const g=d+l[p]+" ",f=this._createSVGElement("text",{class:"node-text",style:"visibility: hidden;"});f.textContent=g,this._svgEl.appendChild(f);const y=f.getComputedTextLength();this._svgEl.removeChild(f),y>m&&p>0?(c.push(d),d=l[p]+" "):d=g}c.push(d);const h=16,u=t.y+O/2-(c.length-1)*h/2;r.setAttribute("y",u+""),c.forEach((p,g)=>{const f=this._createSVGElement("tspan",{x:t.x+L/2,dy:g===0?"0":`${h}px`});f.textContent=p.trim(),r.appendChild(f)}),s.appendChild(r),this._groupEl.appendChild(s)}_createDefs(){const e=this._createSVGElement("defs"),t=this._createSVGElement("filter",{id:"shadow",x:"-50%",y:"-50%",width:"200%",height:"200%"}),n=this._createSVGElement("feDropShadow",{dx:"2",dy:"2",stdDeviation:"3","flood-color":"var(--node-shadow)"});t.appendChild(n),e.appendChild(t),this._groupEl.parentElement.appendChild(e)}_setupZoomAndPan(){let e=!1,t={x:0,y:0};const n=()=>{this._groupEl.setAttribute("transform",`translate(${this._transform.tx}, ${this._transform.ty}) scale(${this._transform.scale})`)};this._svgEl.addEventListener("wheel",i=>{i.preventDefault();const r=1.1,l=i.deltaY<0?r:1/r,d=this._svgEl.getBoundingClientRect(),c=i.clientX-d.left,m=i.clientY-d.top;this._transform.tx=c-(c-this._transform.tx)*l,this._transform.ty=m-(m-this._transform.ty)*l,this._transform.scale*=l,n()}),this._svgEl.addEventListener("mousedown",i=>{e=!0,t={x:i.clientX,y:i.clientY},this._svgEl.style.cursor="grabbing"}),this._svgEl.addEventListener("mousemove",i=>{if(!e)return;const r={x:i.clientX,y:i.clientY},l=r.x-t.x,d=r.y-t.y;this._transform.tx+=l,this._transform.ty+=d,t=r,n()});const s=()=>{e&&(e=!1,this._svgEl.style.cursor="grab")};this._svgEl.addEventListener("mouseup",s),this._svgEl.addEventListener("mouseleave",s)}_centerChart(){const e=this._groupEl.getBBox(),t=this.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=80,s=t.width/(e.width+n),i=t.height/(e.height+n),r=Math.min(s,i,1);this._transform.scale=r,this._transform.tx=t.width/2-(e.x+e.width/2)*r,this._transform.ty=t.height/2-(e.y+e.height/2)*r,this._groupEl.setAttribute("transform",`translate(${this._transform.tx}, ${this._transform.ty}) scale(${this._transform.scale})`)}render(){if(this._svgEl&&this.shadowRoot.removeChild(this._svgEl),!this._data)return;this._svgEl=this._createSVGElement("svg"),this.shadowRoot.appendChild(this._svgEl),this._groupEl=this._createSVGElement("g"),this._svgEl.appendChild(this._groupEl),this._createDefs(),this._prepareTree(this._data.nodes);const e=this._data.nodes.leafCount*(L+it);this._calculatePositions(this._data.nodes,0,e);for(const t of this._allNodes)t.parent&&this._drawConnector(t.parent,t);for(const t of this._allNodes)this._drawNode(t);this._centerChart(),this._setupZoomAndPan()}}customElements.define("dungeon-chart",ot);const $=document.getElementById("app");if(!$)throw new Error("Could not find app element to mount to");async function at(){$.innerHTML="<div>Initializing...</div>";const o=new Pe;await me(o);const e=new Oe,t=new De(e),n=new Me(e),s=new $e(t,o,n);s.on("state-change",i=>{if(s.isLoading){$.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(s.error){$.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${s.error}</p>
                    </div>
                </div>
            `;return}Le($,i,s)}),s.on("show-encounter",async i=>{const{EncounterModal:r}=await de(async()=>{const{EncounterModal:l}=await Promise.resolve().then(()=>nt);return{EncounterModal:l}},void 0);await r.show(i),s.continueEncounter()}),$.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",i=>B.handleMouseEnter(i)),document.body.addEventListener("click",i=>B.handleClick(i)),await s.init(),s.showMenu()}at().catch(o=>{console.error(o),$&&($.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${o.message}</p>
          </div>
      </div>
    `)});
