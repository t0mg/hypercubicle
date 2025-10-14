(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const te="modulepreload",se=function(o){return"/rogue-steward/"+o},q={},ne=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){let l=function(h){return Promise.all(h.map(p=>Promise.resolve(p).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));i=l(t.map(h=>{if(h=se(h),h in q)return;q[h]=!0;const p=h.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${u}`))return;const f=document.createElement("link");if(f.rel=p?"stylesheet":te,p||(f.as="script"),f.crossOrigin="",f.href=h,c&&f.setAttribute("nonce",c),document.head.appendChild(f),p)return new Promise((m,d)=>{f.addEventListener("load",m),f.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${h}`)))})}))}function n(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return i.then(l=>{for(const r of l||[])r.status==="rejected"&&n(r.reason);return e().catch(n)})};var _=(o=>(o.Arousal="arousal",o.Flow="flow",o.Control="control",o.Relaxation="relaxation",o.Boredom="boredom",o.Apathy="apathy",o.Worry="worry",o.Anxiety="anxiety",o))(_||{});let j={};async function W(o,e){try{j=await e.loadJson(`locales/${o}.json`)}catch(t){console.warn(`Failed to load ${o} translations:`,t),o!=="en"&&await W("en",e)}}function ie(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(o,e={}){let s=o.split(".").reduce((i,n)=>i?i[n]:void 0,j);if(!s)return console.warn(`Translation not found for key: ${o}`),o;for(const i in e)s=s.replace(`{${i}}`,String(e[i]));return s}async function ae(o){const e=ie();await W(e,o)}class E{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return E.instance||(E.instance=new E),E.instance}on(e){this.listeners.push(e)}log(e,t="INFO",s){const i=a(`log_messages.${e}`,s),n={message:i,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(n),t!=="DEBUG"&&console.log(`[${t}] ${i}`)),this.listeners.forEach(l=>l(n))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(s=>s(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=E.getInstance();return t.loadEntries(e.entries),t}}class oe{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const k=new oe(Date.now()),Z=o=>`${o}_${k.nextFloat().toString(36).substr(2,9)}`,re=(o,e)=>k.nextInt(o,e),V=o=>{const e=[...o];for(let t=e.length-1;t>0;t--){const s=k.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},J=(o,e,t,s)=>{const i=e.filter(u=>o.includes(u.id)),n=[],l={common:.6,uncommon:.3,rare:.1,legendary:0},r={common:0,uncommon:0,rare:0,legendary:0},c={common:0,uncommon:0,rare:0,legendary:0};Object.keys(l).forEach(u=>{c[u]=Math.floor(t*l[u])});let h=Object.values(c).reduce((u,f)=>u+f,0);for(;h<t;)c.common+=1,h+=1;i.filter(u=>u.cost!==null).forEach(u=>{n.push(s(u)),r[u.rarity]+=1}),Object.keys(l).forEach((u,f)=>{const m=i.filter(d=>d.rarity===u);for(;r[u]<c[u]&&m.length!==0;){const d=k.nextInt(0,m.length-1),g=m[d];n.push(s(g)),r[u]+=1}});const p=i.filter(u=>u.rarity==="common");for(;n.length<t&&p.length>0;){const u=k.nextInt(0,p.length-1),f=p[u];n.push(s(f))}return V(n)},B=(o,e,t)=>J(o,e,t,s=>({...s,instanceId:Z(s.id)})),z=(o,e,t)=>J(o,e,t,i=>{const n={...i,instanceId:Z(i.id)};return n.type==="room_enemy"&&n.stats.minUnits&&n.stats.maxUnits&&(n.units=re(n.stats.minUnits,n.stats.maxUnits)),n}),le=o=>o.roomHand.length<3&&!o.roomHand.some(e=>e.type==="room_boss"),ce=o=>[...new Set(o.hand.map(t=>t.id))].length<2&&o.hand.length>0;function de(o,e){const t=Math.max(0,Math.min(100,o)),s=Math.max(0,Math.min(100,e));return s>66?t<33?_.Anxiety:t<87?_.Arousal:_.Flow:s>33?t<33?_.Worry:t<67?_.Apathy:_.Control:t<67?_.Boredom:_.Relaxation}const L={hp:100,maxHp:100,power:5},he=3;class ${constructor(e,t){this.hp=L.hp,this.maxHp=L.maxHp,this.power=L.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=_.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=E.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0,this.firstName=t?t.firstNames[Math.floor(Math.random()*t.firstNames.length)]:"Testy",this.lastName=t?t.lastNames[Math.floor(Math.random()*t.lastNames.length)]:"McTest"}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>he&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=de(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{from:a("flow_states."+_[e]),to:a("flow_states."+_[this.flowState])})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=L.power,s=L.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(i=>{t+=i.stats.power||0,s+=i.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter,firstName:this.firstName,lastName:this.lastName}}static fromJSON(e){const t=e.traits,s=new $(t);return s.hp=e.hp,s.maxHp=e.maxHp,s.power=e.power,s.inventory=e.inventory,s.activeBuffs=e.activeBuffs,s.skill=e.skill,s.challengeHistory=e.challengeHistory,s.flowState=e.flowState,s.roomHistory=e.roomHistory,s.lootHistory=e.lootHistory,s.boredomCounter=e.boredomCounter,s.firstName=e.firstName,s.lastName=e.lastName,s}}const ue=99,me=10,A=10,U=32,pe=18,fe=8;var x=(o=>(o.WORKSHOP="workshop",o.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",o.HAND_SIZE_INCREASE="hand_size_increase",o.ADVENTURER_TRAITS="ADVENTURER_TRAITS",o.BP_MULTIPLIER="BP_MULTIPLIER",o.WORKSHOP_ACCESS="WORKSHOP_ACCESS",o.BP_MULTIPLIER_2="BP_MULTIPLIER_2",o))(x||{});const Y=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],Q=10;function X(o,e){var h,p,u,f;const{traits:t,inventory:s,hp:i,maxHp:n}=o;let l=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const r=((h=s.weapon)==null?void 0:h.stats.power)||0,c=((p=s.armor)==null?void 0:p.stats.maxHp)||0;switch(e.type){case"item_weapon":const m=(e.stats.power||0)-r;if(m<=0&&e.id!==((u=s.weapon)==null?void 0:u.id))return-1;l+=m*(t.offense/10),m>0&&(l+=m*(o.skill/10));const d=e.stats.maxHp||0;d<0&&(l+=d*(100-t.resilience)/20);break;case"item_armor":const g=(e.stats.maxHp||0)-c;if(g<=0&&e.id!==((f=s.armor)==null?void 0:f.id))return-1;l+=g*(100-t.offense)/10,g>0&&(l+=g*(o.skill/10));const v=e.stats.power||0;v>0&&(l+=v*(t.offense/15));const b=e.stats.power||0;b<0&&(l+=b*(t.resilience/10));break;case"item_potion":const S=i/n;l+=10*(100-t.resilience)/100,S<.7&&(l+=20*(1-S)),l+=5*(o.skill/100),s.potions.length>=ue&&(l*=.1);break}return l}function ge(o,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${o.traits.offense}, Resilience: ${o.traits.resilience}, Skill: ${o.skill})`);const s=e.map(l=>({item:l,score:X(o,l)})).filter(l=>l.score>0);if(s.sort((l,r)=>r.score-l.score),s.length===0||s[0].score<me)return{choice:null,reason:a("game_engine.adventurer_declines_offer")};const i=s[0].item;t.debug(`Adventurer chooses: ${a("items_and_rooms."+i.id)} (Score: ${s[0].score.toFixed(1)})`);const n=a("game_engine.adventurer_accepts_offer",{itemName:a("items_and_rooms."+i.id)});return{choice:i,reason:n}}function _e(o,e){const{flowState:t,hp:s,maxHp:i,inventory:n,traits:l}=o,r=s/i;if(n.potions.length===0)return"attack";let c=.5;switch(t){case _.Anxiety:case _.Worry:c=.8;break;case _.Arousal:case _.Flow:c=.6;break;case _.Control:case _.Relaxation:c=.4;break;case _.Boredom:case _.Apathy:c=.2;break}return c-=l.resilience/200,r<Math.max(.1,c)?"use_potion":"attack"}function ve(o,e,t){if(e){o.lootHistory.push(e.id),o.lootHistory.filter(n=>n===e.id).length>2&&(o.modifyChallenge(o.challenge-Q),o.logger.info("info_repetitive_choice",{name:a("items_and_rooms."+e.id)}));const i=X(o,e);i>60?(o.modifySkill(10),o.modifyChallenge(o.challenge+5)):i>30?(o.modifySkill(5),o.modifyChallenge(o.challenge+2)):o.modifySkill(2)}else t.length>0?o.modifyChallenge(o.challenge-5):o.modifyChallenge(o.challenge-10);o.updateFlowState()}function be(o,e){o.roomHistory.push(e.id),o.roomHistory.filter(i=>i===e.id).length>2&&(o.modifyChallenge(o.challenge-Q),o.logger.info("info_deja_vu",{name:a("items_and_rooms."+e.id)}));let s=0;switch(e.type){case"room_enemy":s=5;break;case"room_boss":s=15;break;case"room_trap":s=10;break;case"room_healing":s=-15;break}o.modifyChallenge(o.challenge+s),o.updateFlowState()}function ye(o){o.modifySkill(-2),o.updateFlowState()}function M(o,e){switch(e){case"hit":o.modifySkill(.5);break;case"miss":o.modifySkill(-.5);break;case"take_damage":o.modifyChallenge(o.challenge+1);break}o.updateFlowState()}function Se(o,e,t,s){let i;return e>.7?(i=a("game_engine.too_close_for_comfort"),o.modifyChallenge(o.challenge+10),o.modifySkill(-3)):e>.4?(i=a("game_engine.great_battle"),o.modifyChallenge(o.challenge+5),o.modifySkill(5)):t>3&&o.traits.offense>60?(i=a("game_engine.easy_fight"),o.modifyChallenge(o.challenge-10)):(i=a("game_engine.worthy_challenge"),o.modifyChallenge(o.challenge-2),o.modifySkill(2)),t===s&&o.modifySkill(1*t),o.updateFlowState(),i}const y=E.getInstance();class we{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._allNames={firstNames:[],lastNames:[]},this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=i=>{this.metaManager.incrementAdventurers();const n={offense:k.nextInt(10,90),resilience:k.nextInt(10,90),skill:0};y.loadEntries([]);const l=new $(n,this._allNames),r=(i==null?void 0:i.items)||this._allItems.filter(v=>v.cost===null).map(v=>v.id),c=B(r,this._allItems,U),h=this._getHandSize(),p=c.slice(0,h),u=c.slice(h),f=(i==null?void 0:i.rooms)||this._allRooms.filter(v=>v.cost===null).map(v=>v.id),m=z(f,this._allRooms,this._getRoomDeckSize()),d=m.slice(0,h),g=m.slice(h);y.info("info_new_adventurer",{fullName:`${l.firstName} ${l.lastName}`,id:this.metaManager.metaState.adventurers.toString()}),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:r,availableDeck:u,hand:p,unlockedRoomDeck:f,availableRoomDeck:g,roomHand:d,handSize:h,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:a("game_engine.new_adventurer"),run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},y.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),y.debug(`Deck size: ${c.length}, Hand size: ${h}, Room Deck size: ${m.length}, Room Hand size: ${d.length}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const i=this.gameSaver.load();i?(this.gameState=i,this._emit("state-change",this.gameState),this.gameState.phase==="AWAITING_ENCOUNTER_RESULT"&&this.gameState.encounterPayload&&this._emit("show-encounter",this.gameState.encounterPayload)):this.startNewGame()},this.startNewRun=i=>{if(!this.gameState)return;const n=i||this.gameState.run+1;this.metaManager.updateRun(n);const l=this._getHandSize(),r=B(this.gameState.unlockedDeck,this._allItems,U),c=r.slice(0,l),h=r.slice(l),p=z(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),u=p.slice(0,l),f=p.slice(l),m=new $(this.gameState.adventurer.traits,this._allNames);m.skill=this.gameState.adventurer.skill,m.challengeHistory=[...this.gameState.adventurer.challengeHistory],m.flowState=this.gameState.adventurer.flowState,y.info("info_adventurer_returns"),y.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:m,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:h,hand:c,availableRoomDeck:f,roomHand:u,handSize:l,room:1,run:n,feedback:a("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const n=this.gameState.hand.filter(b=>i.includes(b.instanceId));this.gameState.offeredLoot=n;const l=this.gameState.adventurer,{choice:r,reason:c}=ge(l,this.gameState.offeredLoot,y);ve(l,r,this.gameState.offeredLoot),r&&y.info("info_item_chosen",{name:l.firstName,item:a("items_and_rooms."+r.id)});let h=this.gameState.hand,p=this.gameState.availableDeck;h.forEach(b=>b.justDrafted=!1);let u=h.filter(b=>!i.includes(b.instanceId));const f=this.gameState.handSize-u.length,m=p.slice(0,f);m.forEach(b=>{b.draftedRoom=this.gameState.room,b.justDrafted=!0});const d=p.slice(f);u.push(...m),r&&(r.type==="item_potion"?l.addPotion(r):r.type==="item_buff"?l.applyBuff(r):l.equip(r));const g=this.gameState.room+1,v=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:l,feedback:c,availableDeck:d,hand:u,room:g,designer:{balancePoints:v}},this._emit("state-change",this.gameState)},this.runEncounter=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=i;const n=k.nextInt(0,this.gameState.offeredRooms.length-1),l=this.gameState.offeredRooms[n],{log:r,finalAdventurer:c,feedback:h}=this._generateEncounterLog(this.gameState.adventurer,l),p={room:l,log:r,finalAdventurer:c,feedback:h};this.gameState={...this.gameState,phase:"AWAITING_ENCOUNTER_RESULT",encounterPayload:p},this._emit("state-change",this.gameState),this._emit("show-encounter",p)},this.continueEncounter=i=>{!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_RESULT"||this._postEncounterUpdate(i.finalAdventurer,i.feedback)},this._postEncounterUpdate=(i,n)=>{if(!this.gameState)return;let l=i;l.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let r=this.gameState.roomHand,c=this.gameState.availableRoomDeck;r.forEach(d=>d.justDrafted=!1);const h=this.gameState.offeredRooms.map(d=>d.instanceId);let p=r.filter(d=>!h.includes(d.instanceId));const u=this.gameState.handSize-p.length,f=c.slice(0,u);f.forEach(d=>{d.draftedRoom=this.gameState.room,d.justDrafted=!0});const m=c.slice(u);if(p.push(...f),this.gameState.adventurer=l,l.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(l.boredomCounter>2){const d=l.flowState===_.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(d);return}this.gameState.hand&&this.gameState.hand.length===0?(y.warn("warn_empty_hand"),n.push(a("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:n,encounterPayload:void 0,roomHand:p,availableRoomDeck:m}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:n,encounterPayload:void 0,roomHand:p,availableRoomDeck:m},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(y.info("info_entering_workshop",{name:this.gameState.adventurer.firstName}),!this.metaManager.acls.has(x.WORKSHOP)){y.info("info_workshop_not_unlocked"),this.startNewRun();return}const i=this.gameState.run+1,n=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),l=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),r=[...n,...l];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:i,room:0,shopItems:V(r).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:a("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=i=>{if(!this.gameState)return;const n=this._allItems.find(d=>d.id===i),l=this._allRooms.find(d=>d.id===i),r=n||l;if(!r||r.cost===null||this.gameState.designer.balancePoints<r.cost)return;let c=this.gameState.unlockedDeck,h=this.gameState.unlockedRoomDeck,p=this.gameState.availableDeck,u=this.gameState.availableRoomDeck;n?(c=[...this.gameState.unlockedDeck,i],this.isWorkshopAccessUnlocked()&&(p=[n,...this.gameState.availableDeck])):l&&(h=[...this.gameState.unlockedRoomDeck,i],this.isWorkshopAccessUnlocked()&&(u=[l,...this.gameState.availableRoomDeck]));const f=this.gameState.designer.balancePoints-r.cost,m=this.gameState.shopItems.filter(d=>d.id!==i);y.info("info_item_purchased",{name:this.gameState.adventurer.firstName,item:a("items_and_rooms."+r.id)}),this.gameState={...this.gameState,designer:{balancePoints:f},unlockedDeck:c,unlockedRoomDeck:h,availableDeck:p,availableRoomDeck:u,shopItems:m},this._emit("state-change",this.gameState)},this.quitGame=(i=!0)=>{i&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(x.BP_MULTIPLIER_2)?A*4:this.metaManager.acls.has(x.BP_MULTIPLIER)?A*2:A,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,...t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(i=>i(...t))}_createAdventurerSnapshot(e){return{hp:e.hp,maxHp:e.maxHp,power:e.power,flowState:e.flowState,inventory:JSON.parse(JSON.stringify(e.inventory))}}_generateEncounterLog(e,t){var l;const s=[],i=[],n=$.fromJSON(e.toJSON());switch(y.info("info_encounter",{name:n.firstName,roomName:a("items_and_rooms."+t.id)}),be(n,t),s.push({messageKey:"log_messages.info_encounter",replacements:{name:n.firstName,roomName:a("items_and_rooms."+t.id)},adventurer:this._createAdventurerSnapshot(n)}),t.type){case"room_enemy":case"room_boss":{const r={enemyCount:t.units??1,enemyPower:t.stats.attack||5,enemyHp:t.stats.hp||10};let c=0;const h=n.hp;for(let m=0;m<r.enemyCount;m++){let d=r.enemyHp;y.info("info_encounter_enemy",{name:n.firstName,current:m+1,total:r.enemyCount});const g={currentHp:d,maxHp:r.enemyHp,power:r.enemyPower,name:a("items_and_rooms."+t.id),count:m+1,total:r.enemyCount};for(s.push({messageKey:"log_messages.info_encounter_enemy",replacements:{name:n.firstName,current:m+1,total:r.enemyCount},adventurer:this._createAdventurerSnapshot(n),enemy:g});d>0&&n.hp>0;){if(_e(n)==="use_potion"){const S=n.inventory.potions.shift();if(S){const w=S.stats.hp||0;n.hp=Math.min(n.maxHp,n.hp+w),y.info("info_adventurer_drinks_potion",{name:n.firstName,potionName:a("items_and_rooms."+S.id)}),i.push(a("game_engine.adventurer_drinks_potion",{potionName:a("items_and_rooms."+S.id)})),s.push({messageKey:"log_messages.info_adventurer_drinks_potion",replacements:{name:n.firstName,potionName:a("items_and_rooms."+S.id)},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}})}}else{const S=Math.min(.95,.75+n.traits.skill/500+n.traits.offense/1e3);if(k.nextFloat()<S){const w=n.power;d-=w,y.debug(`Adventurer hits for ${w} damage.`);const R=n.flowState;M(n,"hit"),R!==n.flowState&&s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{from:a(`flow_states.${R}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}}),s.push({messageKey:"log_messages.info_adventurer_hit",replacements:{damage:w},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}})}else{y.debug("Adventurer misses.");const w=n.flowState;M(n,"miss"),w!==n.flowState&&s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{from:a(`flow_states.${w}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}}),s.push({messageKey:"log_messages.info_adventurer_miss",adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}})}}if(d<=0){y.info("info_enemy_defeated"),c++,s.push({messageKey:"log_messages.info_enemy_defeated",adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:0}});break}const b=Math.max(.4,.75-n.traits.skill/500-(100-n.traits.offense)/1e3);if(k.nextFloat()<b){const S=(((l=n.inventory.armor)==null?void 0:l.stats.maxHp)||0)/10,w=Math.max(1,r.enemyPower-S);n.hp-=w,y.debug(`Enemy hits for ${w} damage.`);const R=n.flowState;M(n,"take_damage"),R!==n.flowState&&s.push({messageKey:"log_messages.info_flow_state_changed",replacements:{from:a(`flow_states.${R}`),to:a(`flow_states.${n.flowState}`)},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}}),s.push({messageKey:"log_messages.info_enemy_hit",replacements:{damage:w},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}})}else y.debug("Enemy misses."),s.push({messageKey:"log_messages.info_enemy_miss",adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}})}if(n.hp<=0){y.warn("info_adventurer_defeated",{name:n.firstName}),s.push({messageKey:"log_messages.info_adventurer_defeated",replacements:{name:n.firstName},adventurer:this._createAdventurerSnapshot(n),enemy:{...g,currentHp:d}});break}}const p=h-n.hp,u=p/n.maxHp;y.debug(`hpLost: ${p}, hpLostRatio: ${u.toFixed(2)}`);const f=Se(n,u,c,r.enemyCount);i.push(f);break}case"room_healing":{const r=t.stats.hp||0;n.hp=Math.min(n.maxHp,n.hp+r),y.info("info_healing_room",{name:n.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:r}),i.push(a("game_engine.healing_room",{name:a("items_and_rooms."+t.id),healing:r})),s.push({messageKey:"log_messages.info_healing_room",replacements:{name:n.firstName,healingRoomName:a("items_and_rooms."+t.id),healing:r},adventurer:this._createAdventurerSnapshot(n)});break}case"room_trap":{const r=t.stats.attack||0;n.hp-=r,ye(n),y.info("info_trap_room",{name:n.firstName,trapName:a("items_and_rooms."+t.id),damage:r}),i.push(a("game_engine.trap_room",{name:a("items_and_rooms."+t.id),damage:r})),s.push({messageKey:"log_messages.info_trap_room",replacements:{name:n.firstName,trapName:a("items_and_rooms."+t.id),damage:r},adventurer:this._createAdventurerSnapshot(n)});break}}return{log:s,finalAdventurer:n,feedback:i}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);y.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),y.error("info_game_over",{reason:e});const i=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:i},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:i,offense:n}=t,l=Math.min(s/100,1);if(e===_.Flow)return"continue";let r=.55;switch(e){case _.Anxiety:r+=.25-i/400;break;case _.Arousal:r-=.1-n/1e3;break;case _.Worry:r+=.2;break;case _.Control:r-=.15;break;case _.Relaxation:r+=.1;break;case _.Boredom:r+=.3;break;case _.Apathy:r+=.4;break}return r-=l*.1,r=Math.max(.05,Math.min(.95,r)),k.nextFloat()<r?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(y.info("info_adventurer_decision",{name:this.gameState.adventurer.firstName,decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:k.nextInt(10,90),resilience:k.nextInt(10,90),skill:0},t=new $(e,this._allNames);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(x.HAND_SIZE_INCREASE)?12:fe}_getRoomDeckSize(){return this.metaManager.acls.has(x.ROOM_DECK_SIZE_INCREASE)?36:pe}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(x.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(x.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json"),this._allNames=await this.dataLoader.loadJson("game/names.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class H{constructor(e,t,s,i){this.resolve=i;const n=document.createElement("div");n.dataset.testid="info-modal-overlay",Object.assign(n.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),n.addEventListener("click",g=>{if(g.target===n){const v=s.find(b=>typeof b.value=="boolean"&&b.value===!1);v&&this.dismiss(v.value)}});const l=document.createElement("div");this.element=l,l.className="window",l.style.width="min(90vw, 800px)",l.setAttribute("role","dialog"),l.setAttribute("aria-modal","true"),l.setAttribute("aria-labelledby","info-modal-title");const r=document.createElement("div");r.className="title-bar";const c=document.createElement("div");c.id="info-modal-title",c.className="title-bar-text",c.textContent=e,r.appendChild(c),l.appendChild(r);const h=document.createElement("div");h.className="window-body text-center p-4";const p=document.createElement("div");p.innerHTML=t,h.appendChild(p);const u=document.createElement("div");u.className="flex justify-center gap-2 mt-4",s.forEach(g=>{const v=document.createElement("button");v.textContent=g.text,v.addEventListener("click",()=>{this.dismiss(g.value)}),u.appendChild(v)}),h.appendChild(u),l.appendChild(h),n.appendChild(l),document.body.appendChild(n),this.handleKeydown=g=>{if(g.key==="Escape"){const v=s.find(b=>typeof b.value=="boolean"&&b.value===!1);v&&this.dismiss(v.value)}},document.addEventListener("keydown",this.handleKeydown);const f=l.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),m=f[0],d=f[f.length-1];m==null||m.focus(),l.addEventListener("keydown",g=>{g.key==="Tab"&&(g.shiftKey?document.activeElement===m&&(d.focus(),g.preventDefault()):document.activeElement===d&&(m.focus(),g.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(i=>{new H(e,t,s,i)})}static showInfo(e,t,s=a("global.continue")){const i=[{text:s,value:void 0}];return H.show(e,t,i)}}class P{static show(e,t){const s=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return H.show(e,t,s)}}const ke=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,G=(o,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=o.hand,s.deckType="item",s.offerImpossible=ce(o)):(s.choices=o.roomHand,s.deckType="room",s.roomSelectionImpossible=le(o)),s},xe=(o,e,t)=>{var p;if(!o.querySelector("adventurer-status")){o.innerHTML=ke;const u=o.querySelector("#game-title");u&&(u.textContent=a("game_title"));const f=o.querySelector("#adventurer-status-title");f&&(f.textContent=a("adventurer_status.title",{name:e.adventurer.firstName+" "+e.adventurer.lastName,id:t.metaManager.metaState.adventurers})),(p=o.querySelector("#quit-game-btn"))==null||p.addEventListener("click",async()=>{await P.show(a("global.quit"),a("global.quit_confirm"))&&t.quitGame(!1)})}const s=o.querySelector("adventurer-status"),i=o.querySelector("log-panel"),n=o.querySelector("game-stats"),l=o.querySelector("feedback-panel"),r=o.querySelector("#game-phase-panel"),c=o.querySelector("#game-phase-title");s.metaState=t.metaManager.metaState,s.adventurer=e.adventurer,n.engine=t,t.isWorkshopUnlocked()?n.setAttribute("balance-points",e.designer.balancePoints.toString()):n.removeAttribute("balance-points"),n.setAttribute("run",e.run.toString()),n.setAttribute("room",e.room.toString()),n.setAttribute("deck-size",e.availableDeck.length.toString()),n.setAttribute("room-deck-size",e.availableRoomDeck.length.toString());const h=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;switch(l.setAttribute("message",h),i.logger=e.logger,i.traits=e.adventurer.traits,r.innerHTML="",e.phase){case"RUN_OVER":{c&&(c.textContent=a("run_ended_screen.run_complete"));const u=document.createElement("run-ended-screen");u.setAttribute("final-bp",e.designer.balancePoints.toString()),u.setAttribute("reason",e.runEnded.reason),u.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&u.setAttribute("workshop-unlocked",""),e.runEnded.decision&&u.initialize(e.runEnded.decision,e.newlyUnlocked,t),r.appendChild(u);break}case"DESIGNER_CHOOSING_LOOT":c&&(c.textContent=a("choice_panel.title")),r.appendChild(G(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":c&&(c.textContent=a("choice_panel.title_room")),r.appendChild(G(e,t,"room"));break;default:c&&(c.textContent="...");break}},Ee=(o,e)=>{o.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,o.appendChild(t)},Ie=(o,e,t)=>{o.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,o.appendChild(s)},Ce=(o,e,t)=>{if(!e){o.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":Ee(o,t);break;case"SHOP":Ie(o,e,t);break;default:xe(o,e,t);break}};function $e(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const F="rogue-steward-meta";class Re{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of Y)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(F);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(F,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const N="rogue-steward-savegame",D="1.0.1";class Te{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(N,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(N);if(e){const t=JSON.parse(e);return t.version!==D?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${D}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(N)!==null}clear(){this.storage.removeItem(N)}_serialize(e){const{adventurer:t,...s}=e;return{version:D,...s,adventurer:t.toJSON(),logger:E.getInstance().toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...i}=e;E.getInstance().loadEntries(s.entries);const l=$.fromJSON(t),{version:r,...c}=i;return{...c,adventurer:l}}}class He{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Le{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const Ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Me=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',De=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class qe extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,s;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(s=this._metaState)==null?void 0:s.unlockedFeatures.includes(x.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${a("adventurer_status.flow_state")}</legend>
              <div id="flow-state-text" class="font-mono text-xl text-center"></div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${Ne()} <span>${a("global.health")}</span></div>
                            <span id="hp-text" class="font-mono text-sm"></span>
                        </div>
                        <progress id="hp-bar" max="100" value="100" class="w-full"></progress>
                    </div>
                </div>
                <div class="sunken-panel p-2 flex flex-col items-center justify-center" data-tooltip-key="adventurer_power">
                    <div class="flex items-center">${Ae()} <span class="ml-1">${a("global.power")}</span></div>
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
        `,this._hasRendered=!0}update(){var r;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const s=this.querySelector("#flow-state-text");s.textContent=a(`flow_states.${this._adventurer.flowState}`),s.className=`font-mono text-xl text-center ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s);const i=this.querySelector("#power-text");i.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(i);const n=(r=this._metaState)==null?void 0:r.unlockedFeatures.includes(x.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(n){l.classList.remove("hidden");const c=this.querySelector("#offense-trait"),h=this.querySelector("#resilience-trait"),p=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(c),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(h),this._adventurer.skill!==this._previousAdventurer.skill&&this._pulseElement(p),c.textContent=`${this._adventurer.traits.offense}`,h.textContent=`${this._adventurer.traits.resilience}`,p.textContent=`${this._adventurer.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Me(),a("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("armor-slot",De(),a("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Pe(),a("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(c=>`
            <div class="text-xs">
                <p>${a("items_and_rooms."+c.id)} (${a("global.duration")}: ${c.stats.duration})</p>
                <p>${Object.entries(c.stats).filter(([h])=>h!=="duration").map(([h,p])=>`${a(`global.${h}`)}: ${p}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("potions-slot",Oe(),a("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${a("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-pulse-once"),e.addEventListener("animationend",()=>{e.classList.remove("animate-pulse-once")},{once:!0}))}updateInventorySlot(e,t,s,i){const n=this.querySelector(`#${e}`);n.dataset.content!==i&&(n.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${i}
                </div>
            `,n.dataset.content=i)}getFlowStateColor(e){switch(e){case _.Boredom:case _.Apathy:return"text-red-500";case _.Anxiety:case _.Worry:return"text-orange-500";case _.Arousal:case _.Control:case _.Relaxation:return"text-blue";case _.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",qe);class Be extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",Be);class ze extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=Y.find(i=>i.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),s=`
            <h3>${e.title()}</h3>
            <p class="mb-6">${e.description()}</p>
        `;await H.showInfo(t,s,a("global.continue")),this.dismissUnlock()}dismissUnlock(){this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.getAttribute("reason")||"";if(e.includes("bored")||e.includes("apathetic")){this.state="decision-revealed",this.updateDecision(!1);return}const s=this.querySelector("#decision-container");s&&(s.innerHTML=`<p>${a("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>`),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("reason")||a("run_ended_screen.default_reason");this.innerHTML=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let i="",n="";const l=e?"animate-fade-in-up":"",r=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(i=`
                <h3 class="${l}" style="color: var(--color-stat-positive);">${a("run_ended_screen.continue_quote")}</h3>
                <p class="${l}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,n=`
                <button id="continue-run-button" class="${l}" style="animation-delay: 1.2s;">
                    ${a(r?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(i=`
                <h3 class="${l}" style="color: var(--color-stat-negative);">${a("run_ended_screen.retire_quote")}</h3>
                <p class="${l}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,n=`
                <button id="retire-run-button" class="${l}" style="animation-delay: 1s;">
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=i,s.innerHTML=n}}customElements.define("run-ended-screen",ze);class Ue extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
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
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Ue);class Ge extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null,this._renderedLogCount=0}set logger(e){this._logger=e,this._logger.on(t=>this.render()),this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}_appendEntry(e,t){const s=this.querySelector("#log-container");if(s){const i=document.createElement("p");i.className=this._getLogColor(e.level),i.textContent=`[${t.toString().padStart(3,"0")}] ${e.message}`,s.appendChild(i)}}render(){if(!this._traits||!this._logger){this.innerHTML="",this._renderedLogCount=0;return}const e=this.querySelector("#log-container"),t=this._logger.entries;if(!e||t.length<this._renderedLogCount){const i=t.map((n,l)=>`<p class="${this._getLogColor(n.level)}">[${l.toString().padStart(3,"0")}] ${n.message}</p>`).join("");this.innerHTML=`
        <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
            ${i}
        </pre>
      `,this._renderedLogCount=t.length}else if(t.length>this._renderedLogCount){for(let i=this._renderedLogCount;i<t.length;i++)this._appendEntry(t[i],i);this._renderedLogCount=t.length}const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",Ge);const Fe={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},C=(o,e,t=!0,s=1)=>{const i=t?"text-green-600":"text-red-400",n=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${i}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${o}${s>1?a("global.units"):""}</span>
            <span class="font-mono">${n}${e}</span>
        </div>
    `};class Ke extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this._purchaseInfo=null,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"&&!this._purchaseInfo){const s=this.querySelector('input[type="checkbox"]');s&&!s.disabled&&(s.checked=!s.checked,s.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set purchaseInfo(e){this._purchaseInfo=e,this.render()}get purchaseInfo(){return this._purchaseInfo}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Fe[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",s=`card-checkbox-${this._item.instanceId}`;let i="";this._isSelectable&&(this._isDisabled?i="opacity-50 cursor-not-allowed":i="cursor-pointer");const n=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${i} ${n}`;let l=a("items_and_rooms."+this._item.id),r="";if("stats"in this._item){const h=this._item,p=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":r=`
            ${h.stats.hp?C(a("global.health"),h.stats.hp,h.stats.hp>0):""}
            ${h.stats.maxHp?C(a("global.max_hp"),h.stats.maxHp,h.stats.maxHp>0):""}
            ${h.stats.power?C(a("global.power"),h.stats.power,h.stats.power>0):""}
            ${h.stats.duration?C(a("global.duration"),h.stats.duration,!0):""}
          `;break;case"room_healing":r=`
            ${p.stats.hp?C(a("global.health"),p.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":r=`
            ${p.stats.attack?C(a("global.attack"),p.stats.attack,!1,p.units):""}
            ${p.stats.hp?C(a("global.health"),p.stats.hp,!1,p.units):""}
          `,p.units>1&&(l=a("choice_panel.multiple_enemies_title",{name:l,count:p.units}));break}}this._stackCount>1&&(l=a("choice_panel.stacked_items_title",{name:l,count:this._stackCount}));const c=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${c} flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${a("card_types."+this._item.type)} - ${a("rarity."+this._item.rarity)}</legend>
        <div class="p-2">
            <p class="font-bold text-sm ${e}">${l}</p>
            <div class="mt-2">
                ${r}
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
    `}}customElements.define("choice-card",Ke);const O=4;class je extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(i=>this._selectedIds.includes(i.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(i=>i.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const i=t.type==="room_boss";if(s)this._selectedIds=this._selectedIds.filter(n=>n!==e);else{const l=this._choices.filter(r=>this._selectedIds.includes(r.instanceId)).some(r=>r.type==="room_boss");i&&this._selectedIds.length===0?this._selectedIds.push(e):!i&&!l&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const n=this._choices.filter(r=>r.id===t.id).map(r=>r.instanceId);n.some(r=>this._selectedIds.includes(r))?this._selectedIds=this._selectedIds.filter(r=>!n.includes(r)):this._selectedIds.length<O&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(f=>f.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const f=e.map(m=>{const d=document.createElement("choice-card");return d.item=m,d.isSelectable=!1,d.outerHTML}).join("");H.show(a("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 cards-container">${f}</div>`,[{text:a("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(m=>m.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},i={enemy:0,trap:1,healing:2,boss:3};let n=[...this._choices];this._deckType==="item"?n.sort((f,m)=>{const d=s[f.type]-s[m.type];if(d!==0)return d;const g=t[f.rarity]||0,v=t[m.rarity]||0;return g-v}):n.sort((f,m)=>{const d=f,g=m,v=i[d.type]-i[g.type];if(v!==0)return v;const b=d.stats.hp||0,S=g.stats.hp||0;if(b!==S)return S-b;const w=d.stats.attack||0;return(g.stats.attack||0)-w});const l=this._deckType==="room";let r;if(l)r=n;else{const f=new Map;n.forEach(m=>{const d=m;f.has(d.id)?f.get(d.id).count++:f.set(d.id,{choice:d,count:1})}),r=Array.from(f.values()).map(m=>({...m.choice,stackCount:m.count}))}a(l?"choice_panel.title_room":"choice_panel.title");let c=a(l?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?c=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(c=a("choice_panel.roll_credits"));let h=!1,p=c;this._offerImpossible||this._roomSelectionImpossible?h=!0:l?this._choices.filter(d=>this._selectedIds.includes(d.instanceId)).some(d=>d.type==="room_boss")?(h=this._selectedIds.length===1,p=`${c} (1/1)`):(h=this._selectedIds.length===3,p=`${c} (${this._selectedIds.length}/3)`):(h=this._selectedIds.length>=2&&this._selectedIds.length<=O,p=`${c} (${this._selectedIds.length}/${O})`),this.innerHTML=`
        <div class="p-2">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="loot-card-container">
                <!-- Cards will be inserted here -->
            </div>
            <div class="text-center mt-6">
                <button id="present-offer-button" ${!h||this._disabled?"disabled":""}>
                    ${p}
                </button>
            </div>
        </div>
    `;const u=this.querySelector("#loot-card-container");u&&r.forEach(f=>{const m=document.createElement("choice-card");m.item=f,"stackCount"in f&&(m.stackCount=f.stackCount),m.isSelected=this._selectedIds.includes(f.instanceId);let d=this._disabled;if(this._offerImpossible)d=!0;else if(l){const g=this._choices.filter(b=>this._selectedIds.includes(b.instanceId)),v=g.some(b=>b.type==="room_boss");m.isSelected?d=!1:(v||f.type==="room_boss"&&g.length>0||g.length>=3)&&(d=!0)}else{const g=new Map(this._choices.map(S=>[S.instanceId,S.id])),v=this._selectedIds.map(S=>g.get(S));d=!m.isSelected&&v.includes(f.id)||this._disabled}m.isDisabled=d,m.isNewlyDrafted=f.justDrafted&&this._initialRender||!1,u.appendChild(m)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",je);class We extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}async render(){this.innerHTML=`
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
    `;const e=this.querySelector("#item-cards");if(e){e.innerHTML="";for(const t of this._items){const s=document.createElement("choice-card");s.item=t,s.purchaseInfo={cost:t.cost||0,canAfford:this._balancePoints>=(t.cost||0)},e.appendChild(s)}}}}customElements.define("workshop-screen",We);class Ze extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await P.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await P.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(t){const i=e.adventurers||0;s=`
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
          <p class="status-bar-field">build 140</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Ze);class Ve extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t,s){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show")}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ve);const Je=3e3,Ye=900;class ee extends HTMLElement{constructor(){super(),this.onDismiss=()=>{},this.payload=null,this.currentEventIndex=0,this.battleSpeed=Ye,this.modalState="reveal"}connectedCallback(){if(!this.payload)return;this.innerHTML=`
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
    `,this.querySelector("#continue-button").addEventListener("click",()=>this.handleContinue());const e=this.querySelector("#speed-slider"),t=[1500,1200,900,600,300];e.addEventListener("input",s=>{const i=s.target.value;this.battleSpeed=t[parseInt(i,10)]}),this.start()}start(){if(!this.payload)return;this.modalState="reveal";const e=this.querySelector("#event-message"),t=this.querySelector("#continue-button"),s=this.payload.log[0];e.textContent=a(s.messageKey,s.replacements),t.textContent=a("global.continue"),this.revealTimeout=window.setTimeout(()=>{this.modalState="battle",this.renderBattleView()},Je)}handleContinue(){if(!this.payload)return;const e=this.querySelector("#event-message"),t=this.payload.room.type==="room_enemy"||this.payload.room.type==="room_boss";if(this.modalState==="reveal")if(t)this.modalState="battle",this.renderBattleView();else{this.modalState="outcome";const s=this.payload.log[1];s&&(e.textContent=a(s.messageKey,s.replacements))}else this.modalState==="outcome"&&this.dismiss(!1)}renderInitialView(){return`
      <div id="adventurer-status-container" class="hidden"></div>
      <div id="enemy-status-container" class="hidden"></div>
      <div class="sunken-panel-tl mt-2 p-1" style="height: 60px;">
        <p id="event-message" class="text-center"></p>
      </div>
      <div id="progress-container" class="hidden mt-2">
        <div class="progress-bar" style="width: 100%;">
          <div id="progress-indicator" style="width: 0%; height: 100%;"></div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button id="continue-button"></button>
      </div>
      <div id="slider-container" class="hidden justify-end mt-4">
        <fieldset class="w-1/2">
          <legend>Playback Speed</legend>
          <div class="field-row" style="justify-content: center">
            <label for="speed-slider">Slower</label>
            <input id="speed-slider" type="range" min="0" max="4" value="2" />
            <label for="speed-slider">Faster</label>
          </div>
        </fieldset>
      </div>
    `}renderBattleView(){this.querySelector("#adventurer-status-container").classList.remove("hidden"),this.querySelector("#enemy-status-container").classList.remove("hidden"),this.querySelector("#progress-container").classList.remove("hidden"),this.querySelector("#slider-container").classList.remove("hidden");const e=this.querySelector("#continue-button");e.id="skip-button",e.textContent=a("global.skip"),e.onclick=()=>this.dismiss(!0),this.currentEventIndex=1,this.renderNextBattleEvent()}renderNextBattleEvent(){if(!this.payload||this.currentEventIndex>=this.payload.log.length){const t=this.querySelector("#skip-button");t&&(t.textContent=a("global.continue"),t.onclick=()=>this.dismiss(!1));return}const e=this.payload.log[this.currentEventIndex];this.renderAdventurerStatus(e.adventurer),e.enemy&&this.renderEnemyStatus(e.enemy),this.querySelector("#event-message").textContent=a(e.messageKey,e.replacements),this.updateProgressBar(),this.currentEventIndex++,this.battleTimeout=window.setTimeout(()=>this.renderNextBattleEvent(),this.battleSpeed)}renderAdventurerStatus(e){const t=`flow_states.${e.flowState}`;this.querySelector("#adventurer-status-container").innerHTML=`
      <div class="status-bar">
        <p class="status-bar-field font-bold">${a("global.adventurer")}</p>
        <p class="status-bar-field">HP: ${e.hp} / ${e.maxHp}</p>
        <p class="status-bar-field">Power: ${e.power}</p>
        <p class="status-bar-field">${a(t)}</p>
      </div>
    `}renderEnemyStatus(e){this.querySelector("#enemy-status-container").innerHTML=`
      <div class="font-bold">${a(e.name)} (${e.count}/${e.total})</div>
      <div>HP: ${e.currentHp} / ${e.maxHp}</div>
      <div>Power: ${e.power}</div>
    `}updateProgressBar(){if(!this.payload)return;const e=this.currentEventIndex/(this.payload.log.length-1);this.querySelector("#progress-indicator").style.width=`${e*100}%`}dismiss(e){clearTimeout(this.battleTimeout),this.querySelector("#progress-container").classList.add("hidden"),this.querySelector("#slider-container").classList.add("hidden"),this.remove(),this.onDismiss({skipped:e})}static show(e){return new Promise(t=>{const s=document.createElement("encounter-modal");s.payload=e,s.onDismiss=t,document.body.appendChild(s)})}}customElements.define("encounter-modal",ee);const Qe=Object.freeze(Object.defineProperty({__proto__:null,EncounterModal:ee},Symbol.toStringTag,{value:"Module"}));class T{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return T.instance||(T.instance=new T),T.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const i=this.getTooltipContent(s);i&&(this.tooltipBox.show(i,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const i=this.getTooltipContent(s);i&&this.tooltipBox.show(i,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=a(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=a("global.information")),{title:s,body:t}}}const K=T.getInstance(),I=document.getElementById("app");if(!I)throw new Error("Could not find app element to mount to");async function Xe(){I.innerHTML="<div>Initializing...</div>";const o=new Le;await ae(o);const e=new He,t=new Re(e),s=new Te(e),i=new we(t,o,s);i.on("state-change",n=>{if(i.isLoading){I.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(i.error){I.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${i.error}</p>
                    </div>
                </div>
            `;return}Ce(I,n,i),$e()}),i.on("show-encounter",async n=>{const{EncounterModal:l}=await ne(async()=>{const{EncounterModal:r}=await Promise.resolve().then(()=>Qe);return{EncounterModal:r}},void 0);await l.show(n),i.continueEncounter(n)}),I.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",n=>K.handleMouseEnter(n)),document.body.addEventListener("click",n=>K.handleClick(n)),await i.init(),i.showMenu()}Xe().catch(o=>{console.error(o),I&&(I.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${o.message}</p>
          </div>
      </div>
    `)});
