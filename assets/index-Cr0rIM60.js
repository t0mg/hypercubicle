(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var v=(n=>(n[n.Arousal=0]="Arousal",n[n.Flow=1]="Flow",n[n.Control=2]="Control",n[n.Relaxation=3]="Relaxation",n[n.Boredom=4]="Boredom",n[n.Apathy=5]="Apathy",n[n.Worry=6]="Worry",n[n.Anxiety=7]="Anxiety",n))(v||{});let V={};async function Q(n,e){try{V=await e.loadJson(`locales/${n}.json`)}catch(t){console.warn(`Failed to load ${n} translations:`,t),n!=="en"&&await Q("en",e)}}function ae(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function a(n,e={}){let s=n.split(".").reduce((i,o)=>i?i[o]:void 0,V);if(!s)return console.warn(`Translation not found for key: ${n}`),n;for(const i in e)s=s.replace(`{${i}}`,String(e[i]));return s}async function oe(n){const e=ae();await Q(e,n)}class x{constructor(){this.entries=[],this.listeners=[],this.muted=!1}static getInstance(){return x.instance||(x.instance=new x),x.instance}on(e){this.listeners.push(e)}log(e,t="INFO",s){const i=a(`log_messages.${e}`,s),o={message:i,level:t,timestamp:Date.now(),data:s};this.muted||(this.entries.push(o),t!=="DEBUG"&&console.log(`[${t}] ${i}`)),this.listeners.forEach(r=>r(o))}debug(e){const t={message:e,level:"DEBUG",timestamp:Date.now()};this.muted||this.entries.push(t),this.listeners.forEach(s=>s(t))}info(e,t){this.log(e,"INFO",t)}warn(e,t){this.log(e,"WARN",t)}error(e,t){this.log(e,"ERROR",t)}toJSON(){return{entries:this.entries}}loadEntries(e){this.entries=e||[]}static fromJSON(e){const t=x.getInstance();return t.loadEntries(e.entries),t}}class re{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const w=new re(Date.now()),Y=n=>`${n}_${w.nextFloat().toString(36).substr(2,9)}`,le=(n,e)=>w.nextInt(n,e),X=n=>{const e=[...n];for(let t=e.length-1;t>0;t--){const s=w.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},ee=(n,e,t,s)=>{const i=e.filter(d=>n.includes(d.id)),o=[],r={common:.6,uncommon:.3,rare:.1,legendary:0},l={common:0,uncommon:0,rare:0,legendary:0},c={common:0,uncommon:0,rare:0,legendary:0};Object.keys(r).forEach(d=>{c[d]=Math.floor(t*r[d])});let u=Object.values(c).reduce((d,g)=>d+g,0);for(;u<t;)c.common+=1,u+=1;i.filter(d=>d.cost!==null).forEach(d=>{o.push(s(d)),l[d.rarity]+=1}),Object.keys(r).forEach((d,g)=>{const h=i.filter(p=>p.rarity===d);for(;l[d]<c[d]&&h.length!==0;){const p=w.nextInt(0,h.length-1),f=h[p];o.push(s(f)),l[d]+=1}});const m=i.filter(d=>d.rarity==="common");for(;o.length<t&&m.length>0;){const d=w.nextInt(0,m.length-1),g=m[d];o.push(s(g))}return X(o)},j=(n,e,t)=>ee(n,e,t,s=>({...s,instanceId:Y(s.id)})),F=(n,e,t)=>ee(n,e,t,i=>{const o={...i,instanceId:Y(i.id)};return o.type==="room_enemy"&&o.stats.minUnits&&o.stats.maxUnits&&(o.units=le(o.stats.minUnits,o.stats.maxUnits)),o}),ce=n=>n.roomHand.length<3&&!n.roomHand.some(e=>e.type==="room_boss"),de=n=>[...new Set(n.hand.map(t=>t.id))].length<2&&n.hand.length>0;function he(n,e){const t=Math.max(0,Math.min(100,n)),s=Math.max(0,Math.min(100,e));return s>66?t<33?v.Anxiety:t<87?v.Arousal:v.Flow:s>33?t<33?v.Worry:t<67?v.Apathy:v.Control:t<67?v.Boredom:v.Relaxation}const M={hp:100,maxHp:100,power:5},me=3;class H{constructor(e){this.hp=M.hp,this.maxHp=M.maxHp,this.power=M.power,this.skill=e.skill,this.challengeHistory=[50],this.flowState=v.Boredom,this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=x.getInstance(),this.roomHistory=[],this.lootHistory=[],this.boredomCounter=0}get challenge(){return this.challengeHistory.length===0?50:this.challengeHistory.reduce((t,s)=>t+s,0)/this.challengeHistory.length}modifySkill(e){const t=this.skill;this.skill=Math.max(0,Math.min(100,this.skill+e)),t.toFixed(1)!==this.skill.toFixed(1)&&this.logger.debug(`Skill changed from ${t.toFixed(1)} to ${this.skill.toFixed(1)}`),this.updateFlowState()}modifyChallenge(e){const t=this.challenge,s=Math.max(0,Math.min(100,e));this.challengeHistory.push(s),this.challengeHistory.length>me&&this.challengeHistory.shift(),this.logger.debug(`Challenge changed from ${t.toFixed(1)} to ${this.challenge.toFixed(1)} (new value: ${s})`),this.updateFlowState()}updateFlowState(){const e=this.flowState;this.flowState=he(this.skill,this.challenge),e!==this.flowState&&this.logger.info("info_flow_state_changed",{from:v[e],to:v[this.flowState]})}equip(e){e.type==="item_weapon"?this.inventory.weapon=e:e.type==="item_armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="item_potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=M.power,s=M.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(i=>{t+=i.stats.power||0,s+=i.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}toJSON(){return{hp:this.hp,maxHp:this.maxHp,power:this.power,traits:this.traits,inventory:this.inventory,activeBuffs:this.activeBuffs,skill:this.skill,challengeHistory:this.challengeHistory,flowState:this.flowState,roomHistory:this.roomHistory,lootHistory:this.lootHistory,boredomCounter:this.boredomCounter}}static fromJSON(e,t){const s=e.traits,i=new H(s);return i.hp=e.hp,i.maxHp=e.maxHp,i.power=e.power,i.inventory=e.inventory,i.activeBuffs=e.activeBuffs,i.skill=e.skill,i.challengeHistory=e.challengeHistory,i.flowState=e.flowState,i.roomHistory=e.roomHistory,i.lootHistory=e.lootHistory,i.boredomCounter=e.boredomCounter,i}}const ue=99,pe=10,P=10,W=32,ge=18,fe=8;var S=(n=>(n.WORKSHOP="workshop",n.ROOM_DECK_SIZE_INCREASE="room_deck_size_increase",n.HAND_SIZE_INCREASE="hand_size_increase",n.ADVENTURER_TRAITS="ADVENTURER_TRAITS",n.BP_MULTIPLIER="BP_MULTIPLIER",n.WORKSHOP_ACCESS="WORKSHOP_ACCESS",n.BP_MULTIPLIER_2="BP_MULTIPLIER_2",n))(S||{});const te=[{feature:"workshop",runThreshold:2,title:()=>a("unlocks.workshop.title"),description:()=>a("unlocks.workshop.description")},{feature:"room_deck_size_increase",runThreshold:3,title:()=>a("unlocks.room_deck_size_increase.title"),description:()=>a("unlocks.room_deck_size_increase.description")},{feature:"hand_size_increase",runThreshold:4,title:()=>a("unlocks.hand_size_increase.title"),description:()=>a("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>a("unlocks.adventurer_traits.title"),description:()=>a("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>a("unlocks.bp_multiplier.title"),description:()=>a("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>a("unlocks.workshop_access.title"),description:()=>a("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>a("unlocks.bp_multiplier_2.title"),description:()=>a("unlocks.bp_multiplier_2.description")}],se=10;function ne(n,e){var u,m,d,g;const{traits:t,inventory:s,hp:i,maxHp:o}=n;let r=(e.rarity==="uncommon"?2:e.rarity==="rare"?3:1)*5;const l=((u=s.weapon)==null?void 0:u.stats.power)||0,c=((m=s.armor)==null?void 0:m.stats.maxHp)||0;switch(e.type){case"item_weapon":const h=(e.stats.power||0)-l;if(h<=0&&e.id!==((d=s.weapon)==null?void 0:d.id))return-1;r+=h*(t.offense/10),h>0&&(r+=h*(n.skill/10));const p=e.stats.maxHp||0;p<0&&(r+=p*(100-t.resilience)/20);break;case"item_armor":const f=(e.stats.maxHp||0)-c;if(f<=0&&e.id!==((g=s.armor)==null?void 0:g.id))return-1;r+=f*(100-t.offense)/10,f>0&&(r+=f*(n.skill/10));const _=e.stats.power||0;_>0&&(r+=_*(t.offense/15));const b=e.stats.power||0;b<0&&(r+=b*(t.resilience/10));break;case"item_potion":const y=i/o;r+=10*(100-t.resilience)/100,y<.7&&(r+=20*(1-y)),r+=5*(n.skill/100),s.potions.length>=ue&&(r*=.1);break}return r}function _e(n,e,t){t.debug(`--- Adventurer Loot Decision --- (Offense: ${n.traits.offense}, Resilience: ${n.traits.resilience}, Skill: ${n.skill})`);const s=e.map(r=>({item:r,score:ne(n,r)})).filter(r=>r.score>0);if(s.sort((r,l)=>l.score-r.score),s.length===0||s[0].score<pe)return{choice:null,reason:a("game_engine.adventurer_declines_offer")};const i=s[0].item;t.debug(`Adventurer chooses: ${a("items_and_rooms."+i.id)} (Score: ${s[0].score.toFixed(1)})`);const o=a("game_engine.adventurer_accepts_offer",{itemName:a("items_and_rooms."+i.id)});return{choice:i,reason:o}}function be(n,e){const{flowState:t,hp:s,maxHp:i,inventory:o,traits:r}=n,l=s/i;if(o.potions.length===0)return"attack";let c=.5;switch(t){case v.Anxiety:case v.Worry:c=.8;break;case v.Arousal:case v.Flow:c=.6;break;case v.Control:case v.Relaxation:c=.4;break;case v.Boredom:case v.Apathy:c=.2;break}return c-=r.resilience/200,l<Math.max(.1,c)?"use_potion":"attack"}function ve(n,e,t){if(e){n.lootHistory.push(e.id),n.lootHistory.filter(o=>o===e.id).length>2&&(n.modifyChallenge(n.challenge-se),n.logger.info("info_repetitive_choice",{name:a("items_and_rooms."+e.id)}));const i=ne(n,e);i>60?(n.modifySkill(10),n.modifyChallenge(n.challenge+5)):i>30?(n.modifySkill(5),n.modifyChallenge(n.challenge+2)):n.modifySkill(2)}else t.length>0?n.modifyChallenge(n.challenge-5):n.modifyChallenge(n.challenge-10);n.updateFlowState()}function ye(n,e){n.roomHistory.push(e.id),n.roomHistory.filter(i=>i===e.id).length>2&&(n.modifyChallenge(n.challenge-se),n.logger.info("info_deja_vu",{name:a("items_and_rooms."+e.id)}));let s=0;switch(e.type){case"room_enemy":s=5;break;case"room_boss":s=15;break;case"room_trap":s=10;break;case"room_healing":s=-15;break}n.modifyChallenge(n.challenge+s),n.updateFlowState()}function we(n){n.modifySkill(-2),n.updateFlowState()}function B(n,e){switch(e){case"hit":n.modifySkill(.5);break;case"miss":n.modifySkill(-.5);break;case"take_damage":n.modifyChallenge(n.challenge+1);break}n.updateFlowState()}function Se(n,e,t,s){let i;return e>.7?(i=a("game_engine.too_close_for_comfort"),n.modifyChallenge(n.challenge+10),n.modifySkill(-3)):e>.4?(i=a("game_engine.great_battle"),n.modifyChallenge(n.challenge+5),n.modifySkill(5)):t>3&&n.traits.offense>60?(i=a("game_engine.easy_fight"),n.modifyChallenge(n.challenge-10)):(i=a("game_engine.worthy_challenge"),n.modifyChallenge(n.challenge-2),n.modifySkill(2)),t===s&&n.modifySkill(1*t),n.updateFlowState(),i}class xe{constructor(e,t,s){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=i=>{this.metaManager.incrementAdventurers();const o={offense:w.nextInt(10,90),resilience:w.nextInt(10,90),skill:0},r=x.getInstance();r.loadEntries([]);const l=new H(o),c=(i==null?void 0:i.items)||this._allItems.filter(b=>b.cost===null).map(b=>b.id),u=j(c,this._allItems,W),m=this._getHandSize(),d=u.slice(0,m),g=u.slice(m),h=(i==null?void 0:i.rooms)||this._allRooms.filter(b=>b.cost===null).map(b=>b.id),p=F(h,this._allRooms,this._getRoomDeckSize()),f=p.slice(0,m),_=p.slice(m);r.info("info_new_adventurer"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:c,availableDeck:g,hand:d,unlockedRoomDeck:h,availableRoomDeck:_,roomHand:f,handSize:m,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:a("game_engine.new_adventurer"),logger:r,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState.logger.debug(`Deck size: ${u.length}, Hand size: ${m}, Room Deck size: ${p.length}, Room Hand size: ${f.length}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{const i=this.gameSaver.load();i?(this.gameState=i,this._emit("state-change",this.gameState)):this.startNewGame()},this.startNewRun=i=>{if(!this.gameState)return;const o=i||this.gameState.run+1;this.metaManager.updateRun(o);const r=this._getHandSize(),l=j(this.gameState.unlockedDeck,this._allItems,W),c=l.slice(0,r),u=l.slice(r),m=F(this.gameState.unlockedRoomDeck,this._allRooms,this._getRoomDeckSize()),d=m.slice(0,r),g=m.slice(r),h=new H(this.gameState.adventurer.traits);h.skill=this.gameState.adventurer.skill,h.challengeHistory=[...this.gameState.adventurer.challengeHistory],h.flowState=this.gameState.adventurer.flowState,this.gameState.logger.info("info_adventurer_returns"),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:h,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:u,hand:c,availableRoomDeck:g,roomHand:d,handSize:r,room:1,run:o,feedback:a("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const o=this.gameState.hand.filter(b=>i.includes(b.instanceId));this.gameState.offeredLoot=o;const r=this.gameState.adventurer,{choice:l,reason:c}=_e(r,this.gameState.offeredLoot,this.gameState.logger);ve(r,l,this.gameState.offeredLoot),l&&this.gameState.logger.info("info_item_chosen",{item:a("items_and_rooms."+l.id)});let u=this.gameState.hand,m=this.gameState.availableDeck;u.forEach(b=>b.justDrafted=!1);let d=u.filter(b=>!i.includes(b.instanceId));const g=this.gameState.handSize-d.length,h=m.slice(0,g);h.forEach(b=>{b.draftedRoom=this.gameState.room,b.justDrafted=!0});const p=m.slice(g);d.push(...h),l&&(l.type==="item_potion"?r.addPotion(l):l.type==="item_buff"?r.applyBuff(l):r.equip(l));const f=this.gameState.room+1,_=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:r,feedback:c,availableDeck:p,hand:d,room:f,designer:{balancePoints:_}},this._emit("state-change",this.gameState)},this.runEncounter=i=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=i;let o=this.gameState.adventurer,r=[];const l=w.nextInt(0,this.gameState.offeredRooms.length-1),c=this.gameState.offeredRooms[l];switch(o.roomHistory.push(c.id),ye(o,c),this.gameState.logger.info("info_encounter",{name:a("items_and_rooms."+c.id)}),c.type){case"room_enemy":case"room_boss":const _={enemyCount:c.units??1,enemyPower:c.stats.attack||5,enemyHp:c.stats.hp||10},b=this._simulateEncounter(o,this.gameState.room,_);o=b.newAdventurer,r=b.feedback;break;case"room_healing":const y=c.stats.hp||0;o.hp=Math.min(o.maxHp,o.hp+y),r.push(a("game_engine.healing_room",{name:a("items_and_rooms."+c.id),healing:y})),this.gameState.logger.info("info_healing_room",{name:a("items_and_rooms."+c.id),healing:y});break;case"room_trap":const E=c.stats.attack||0;o.hp-=E,we(o),r.push(a("game_engine.trap_room",{name:a("items_and_rooms."+c.id),damage:E})),this.gameState.logger.info("info_trap_room",{name:a("items_and_rooms."+c.id),damage:E});break}o.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let u=this.gameState.roomHand,m=this.gameState.availableRoomDeck;u.forEach(_=>_.justDrafted=!1);const d=this.gameState.offeredRooms.map(_=>_.instanceId);let g=u.filter(_=>!d.includes(_.instanceId));const h=this.gameState.handSize-g.length,p=m.slice(0,h);p.forEach(_=>{_.draftedRoom=this.gameState.room,_.justDrafted=!0});const f=m.slice(h);if(g.push(...p),this.gameState.adventurer=o,o.hp<=0){this._endRun(a("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(o.boredomCounter>2){const _=o.flowState===v.Boredom?a("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}):a("game_engine.adventurer_apathy",{room:this.gameState.room,run:this.gameState.run});this._endRun(_);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("warn_empty_hand"),r.push(a("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:r,encounter:void 0,roomHand:g,availableRoomDeck:f}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:r,encounter:void 0,roomHand:g,availableRoomDeck:f},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.modifyChallenge(-20),this.gameState.adventurer.updateFlowState(),this._endRun(a("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("info_entering_workshop"),!this.metaManager.acls.has(S.WORKSHOP)){this.gameState.logger.info("info_workshop_not_unlocked"),this.startNewRun();return}const i=this.gameState.run+1,o=this._allItems.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedDeck.includes(c.id)),r=this._allRooms.filter(c=>c.cost!==null).filter(c=>!this.gameState.unlockedRoomDeck.includes(c.id)),l=[...o,...r];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:i,room:0,shopItems:X(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:a("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=i=>{if(!this.gameState)return;const o=this._allItems.find(p=>p.id===i),r=this._allRooms.find(p=>p.id===i),l=o||r;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let c=this.gameState.unlockedDeck,u=this.gameState.unlockedRoomDeck,m=this.gameState.availableDeck,d=this.gameState.availableRoomDeck;o?(c=[...this.gameState.unlockedDeck,i],this.isWorkshopAccessUnlocked()&&(m=[o,...this.gameState.availableDeck])):r&&(u=[...this.gameState.unlockedRoomDeck,i],this.isWorkshopAccessUnlocked()&&(d=[r,...this.gameState.availableRoomDeck]));const g=this.gameState.designer.balancePoints-l.cost,h=this.gameState.shopItems.filter(p=>p.id!==i);this.gameState.logger.info("info_item_purchased",{item:a("items_and_rooms."+l.id)}),this.gameState={...this.gameState,designer:{balancePoints:g},unlockedDeck:c,unlockedRoomDeck:u,availableDeck:m,availableRoomDeck:d,shopItems:h},this._emit("state-change",this.gameState)},this.quitGame=(i=!0)=>{i&&this.gameSaver.clear(),this.showMenu()},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(S.BP_MULTIPLIER_2)?P*4:this.metaManager.acls.has(S.BP_MULTIPLIER)?P*2:P,this.saveGame=()=>{this.gameState&&this.gameState.phase!=="MENU"&&this.gameState.phase!=="RUN_OVER"&&this.gameSaver.save(this.gameState)},this.metaManager=e,this.dataLoader=t,this.gameSaver=s}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){e==="state-change"&&this.saveGame();const s=this._listeners[e];s&&s.forEach(i=>i(t))}_simulateEncounter(e,t,s){var d,g,h,p,f,_,b,y,E,A,U;(d=this.gameState)==null||d.logger.debug(`--- Encounter: Room ${t} - ${s.enemyCount} enemies (Power: ${s.enemyPower}, HP: ${s.enemyHp}) ---`);const i=[];let o=0,r=0;const l=e.hp;for(let O=0;O<s.enemyCount;O++){(g=this.gameState)==null||g.logger.info("info_encounter_enemy",{current:O+1,total:s.enemyCount});let N=s.enemyHp;for(;N>0&&e.hp>0;){if(be(e)==="use_potion"){const $=e.inventory.potions.shift();if($){const I=$.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+I),i.push(a("game_engine.adventurer_drinks_potion",{potionName:a("items_and_rooms."+$.id)})),(h=this.gameState)==null||h.logger.info("info_adventurer_drinks_potion",{potionName:a("items_and_rooms."+$.id)})}}else{const $=Math.min(.95,.75+e.traits.skill/500+e.traits.offense/1e3);if(w.nextFloat()<$){const I=e.power;N-=I,(p=this.gameState)==null||p.logger.debug(`Adventurer hits for ${I} damage.`),B(e,"hit")}else(f=this.gameState)==null||f.logger.debug("Adventurer misses."),B(e,"miss")}if(N<=0){(_=this.gameState)==null||_.logger.info("info_enemy_defeated"),r++;break}const ie=Math.max(.4,.75-e.traits.skill/500-(100-e.traits.offense)/1e3);if(w.nextFloat()<ie){const $=(((b=e.inventory.armor)==null?void 0:b.stats.maxHp)||0)/10,I=Math.max(1,s.enemyPower-$);o+=I,e.hp-=I,(y=this.gameState)==null||y.logger.debug(`Enemy hits for ${I} damage.`),B(e,"take_damage")}else(E=this.gameState)==null||E.logger.debug("Enemy misses.")}if(e.hp<=0){(A=this.gameState)==null||A.logger.warn("info_adventurer_defeated");break}}const c=l-e.hp,u=c/e.maxHp;(U=this.gameState)==null||U.logger.debug(`hpLost: ${c}, hpLostRatio: ${u.toFixed(2)}`);const m=Se(e,u,r,s.enemyCount);return i.push(m),{newAdventurer:e,feedback:i,totalDamageTaken:o}}_endRun(e,t=!1){if(!this.gameState)return;this.metaManager.updateRun(this.gameState.run);const s=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.debug(`Run ended with ${this.gameState.designer.balancePoints} BP.`),this.gameState.logger.error("info_game_over",{reason:e});const i=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:i},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{flowState:e,traits:t,skill:s}=this.gameState.adventurer,{resilience:i,offense:o}=t,r=Math.min(s/100,1);if(e===v.Flow)return"continue";let l=.55;switch(e){case v.Anxiety:l+=.25-i/400;break;case v.Arousal:l-=.1-o/1e3;break;case v.Worry:l+=.2;break;case v.Control:l-=.15;break;case v.Relaxation:l+=.1;break;case v.Boredom:l+=.3;break;case v.Apathy:l+=.4;break}return l-=r*.1,l=Math.max(.05,Math.min(.95,l)),w.nextFloat()<l?"retire":"continue"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info("info_adventurer_decision",{decision:e}),e==="retire"){this.quitGame(!0);return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:w.nextInt(10,90),resilience:w.nextInt(10,90),skill:0},t=x.getInstance(),s=new H(e);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(S.HAND_SIZE_INCREASE)?12:fe}_getRoomDeckSize(){return this.metaManager.acls.has(S.ROOM_DECK_SIZE_INCREASE)?36:ge}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(S.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(S.WORKSHOP)}hasSaveGame(){return this.gameSaver.hasSaveGame()}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json")}catch(e){this.error=e.message||a("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class L{constructor(e,t,s,i){this.resolve=i;const o=document.createElement("div");o.dataset.testid="info-modal-overlay",Object.assign(o.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0, 0, 0, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"1000"}),o.addEventListener("click",f=>{if(f.target===o){const _=s.find(b=>typeof b.value=="boolean"&&b.value===!1);_&&this.dismiss(_.value)}});const r=document.createElement("div");this.element=r,r.className="window",r.style.width="min(90vw, 800px)",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-labelledby","info-modal-title");const l=document.createElement("div");l.className="title-bar";const c=document.createElement("div");c.id="info-modal-title",c.className="title-bar-text",c.textContent=e,l.appendChild(c),r.appendChild(l);const u=document.createElement("div");u.className="window-body text-center p-4";const m=document.createElement("div");m.innerHTML=t,u.appendChild(m);const d=document.createElement("div");d.className="flex justify-center gap-2 mt-4",s.forEach(f=>{const _=document.createElement("button");_.textContent=f.text,_.addEventListener("click",()=>{this.dismiss(f.value)}),d.appendChild(_)}),u.appendChild(d),r.appendChild(u),o.appendChild(r),document.body.appendChild(o),this.handleKeydown=f=>{if(f.key==="Escape"){const _=s.find(b=>typeof b.value=="boolean"&&b.value===!1);_&&this.dismiss(_.value)}},document.addEventListener("keydown",this.handleKeydown);const g=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),h=g[0],p=g[g.length-1];h==null||h.focus(),r.addEventListener("keydown",f=>{f.key==="Tab"&&(f.shiftKey?document.activeElement===h&&(p.focus(),f.preventDefault()):document.activeElement===p&&(h.focus(),f.preventDefault()))})}dismiss(e){this.element.parentElement.remove(),document.removeEventListener("keydown",this.handleKeydown),this.resolve(e)}static show(e,t,s){return new Promise(i=>{new L(e,t,s,i)})}static showInfo(e,t,s=a("global.continue")){const i=[{text:s,value:void 0}];return L.show(e,t,i)}}class G{static show(e,t){const s=[{text:a("global.cancel"),value:!1,variant:"secondary"},{text:a("global.confirm"),value:!0,variant:"primary"}];return L.show(e,t,s)}}const ke=`<div class="w-full p-4 md:p-6 lg:p-8">
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
</div>`,K=(n,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=n.hand,s.deckType="item",s.offerImpossible=de(n)):(s.choices=n.roomHand,s.deckType="room",s.roomSelectionImpossible=ce(n)),s},Ee=(n,e,t)=>{var m;if(!n.querySelector("adventurer-status")){n.innerHTML=ke;const d=n.querySelector("#game-title");d&&(d.textContent=a("game_title"));const g=n.querySelector("#adventurer-status-title");g&&(g.textContent=a("adventurer_status.title",{count:t.metaManager.metaState.adventurers}))}const s=n.querySelector("adventurer-status"),i=n.querySelector("log-panel"),o=n.querySelector("game-stats"),r=n.querySelector("feedback-panel"),l=n.querySelector("#game-phase-panel"),c=n.querySelector("#game-phase-title");s.metaState=t.metaManager.metaState,s.adventurer=e.adventurer,o.engine=t,t.isWorkshopUnlocked()?o.setAttribute("balance-points",e.designer.balancePoints.toString()):o.removeAttribute("balance-points"),o.setAttribute("run",e.run.toString()),o.setAttribute("room",e.room.toString()),o.setAttribute("deck-size",e.availableDeck.length.toString()),o.setAttribute("room-deck-size",e.availableRoomDeck.length.toString());const u=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;switch(r.setAttribute("message",u),i.logger=e.logger,i.traits=e.adventurer.traits,l.innerHTML="",e.phase){case"RUN_OVER":{c&&(c.textContent=a("run_ended_screen.run_complete"));const d=document.createElement("run-ended-screen");d.setAttribute("final-bp",e.designer.balancePoints.toString()),d.setAttribute("reason",e.runEnded.reason),d.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&d.setAttribute("workshop-unlocked",""),e.runEnded.decision&&d.initialize(e.runEnded.decision,e.newlyUnlocked,t),l.appendChild(d);break}case"DESIGNER_CHOOSING_LOOT":c&&(c.textContent=a("choice_panel.title")),l.appendChild(K(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":c&&(c.textContent=a("choice_panel.title_room")),l.appendChild(K(e,t,"room"));break;default:c&&(c.textContent="...");break}(m=n.querySelector("#quit-game-btn"))==null||m.addEventListener("click",async()=>{await G.show(a("global.quit"),a("global.quit_confirm"))&&t.quitGame(!1)})},$e=(n,e)=>{n.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,n.appendChild(t)},Ie=(n,e,t)=>{n.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,n.appendChild(s)},Ce=(n,e,t)=>{if(!e){n.innerHTML=`<div>${a("global.loading")}</div>`;return}switch(e.phase){case"MENU":$e(n,t);break;case"SHOP":Ie(n,e,t);break;default:Ee(n,e,t);break}};function Re(){document.querySelectorAll("[data-tooltip-key]").forEach(e=>{const t=document.createElement("span");t.textContent="?",t.className="tooltip-icon",e.appendChild(t)})}const Z="rogue-steward-meta";class Te{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of te)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(Z);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(Z,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const D="rogue-steward-savegame",q="1.0.1";class He{constructor(e){this.storage=e}save(e){try{const t=this._serialize(e);this.storage.setItem(D,JSON.stringify(t))}catch(t){console.error("Failed to save game state:",t)}}load(){try{const e=this.storage.getItem(D);if(e){const t=JSON.parse(e);return t.version!==q?(console.warn(`Save game version mismatch. Found ${t.version}, expected ${q}. Discarding save.`),this.clear(),null):this._deserialize(t)}}catch(e){console.error("Failed to load game state:",e),this.clear()}return null}hasSaveGame(){return this.storage.getItem(D)!==null}clear(){this.storage.removeItem(D)}_serialize(e){const{adventurer:t,logger:s,...i}=e;return{version:q,...i,adventurer:t.toJSON(),logger:s.toJSON()}}_deserialize(e){const{adventurer:t,logger:s,...i}=e,o=x.getInstance();o.loadEntries(s.entries);const r=H.fromJSON(t,o),{version:l,...c}=i;return{...c,adventurer:r,logger:o}}}class Le{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}}class Me{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const De=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 mr-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="h-5 w-5"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',Oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',Ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class qe extends HTMLElement{constructor(){super(),this._adventurer=null,this._previousAdventurer=null,this._metaState=null,this._hasRendered=!1}set adventurer(e){this._adventurer?this._previousAdventurer=JSON.parse(JSON.stringify(this._adventurer)):this._previousAdventurer=e,this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="",this._hasRendered=!1;return}this._hasRendered||this.initialRender(),this.update()}initialRender(){var t,s;if(!this._adventurer)return;(t=this._metaState)!=null&&t.adventurers;const e=(s=this._metaState)==null?void 0:s.unlockedFeatures.includes(S.ADVENTURER_TRAITS);this.innerHTML=`
            <fieldset class="mt-2" data-tooltip-key="adventurer_flow_state">
              <legend>${a("adventurer_status.flow_state")}</legend>
              <div id="flow-state-text" class="font-mono text-xl text-center"></div>
            </fieldset>
            <div class="flex gap-2">
                <div class="flex-grow space-y-2">
                    <div data-tooltip-key="adventurer_health">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">${De()} <span>${a("global.health")}</span></div>
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
        `,this._hasRendered=!0}update(){var c;if(!this._adventurer||!this._previousAdventurer)return;const e=Math.max(0,this._adventurer.hp),t=e/this._adventurer.maxHp*100;this.querySelector("#hp-text").textContent=`${e} / ${this._adventurer.maxHp}`,this.querySelector("#hp-bar").value=t;const s=this.querySelector("#flow-state-text"),i=v[this._adventurer.flowState];s.textContent=a(`flow_states.${i}`),s.className=`font-mono text-xl text-center ${this.getFlowStateColor(this._adventurer.flowState)}`,this._adventurer.flowState!==this._previousAdventurer.flowState&&this._pulseElement(s);const o=this.querySelector("#power-text");o.textContent=`${this._adventurer.power}`,this._adventurer.power!==this._previousAdventurer.power&&this._pulseElement(o);const r=(c=this._metaState)==null?void 0:c.unlockedFeatures.includes(S.ADVENTURER_TRAITS),l=this.querySelector("#traits-section");if(r){l.classList.remove("hidden");const u=this.querySelector("#offense-trait"),m=this.querySelector("#resilience-trait"),d=this.querySelector("#skill-trait");this._adventurer.traits.offense!==this._previousAdventurer.traits.offense&&this._pulseElement(u),this._adventurer.traits.resilience!==this._previousAdventurer.traits.resilience&&this._pulseElement(m),this._adventurer.traits.skill!==this._previousAdventurer.traits.skill&&this._pulseElement(d),u.textContent=`${this._adventurer.traits.offense}`,m.textContent=`${this._adventurer.traits.resilience}`,d.textContent=`${this._adventurer.traits.skill}`}else l.classList.add("hidden");this.updateInventorySlot("weapon-slot",Oe(),a("adventurer_status.weapon"),this._adventurer.inventory.weapon?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.weapon.id)}</p><p class="text-xs">${a("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${a("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("armor-slot",Ne(),a("adventurer_status.armor"),this._adventurer.inventory.armor?`<div><p class="text-sm">${a("items_and_rooms."+this._adventurer.inventory.armor.id)}</p><p class="text-xs">${a("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${a("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("buffs-slot",Be(),a("adventurer_status.buffs"),this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(u=>`
            <div class="text-xs">
                <p>${a("items_and_rooms."+u.id)} (${a("global.duration")}: ${u.stats.duration})</p>
                <p>${Object.entries(u.stats).filter(([m])=>m!=="duration").map(([m,d])=>`${a(`global.${m}`)}: ${d}`).join(", ")}</p>
            </div>
        `).join(""):`<p class="italic text-xs">${a("global.none")}</p>`),this.updateInventorySlot("potions-slot",Pe(),a("adventurer_status.potions"),this._adventurer.inventory.potions.length>0?`<p class="text-sm">${a("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="italic text-xs">${a("global.none")}</p>`)}_pulseElement(e){e&&(e.classList.add("animate-pulse-once"),e.addEventListener("animationend",()=>{e.classList.remove("animate-pulse-once")},{once:!0}))}updateInventorySlot(e,t,s,i){const o=this.querySelector(`#${e}`);o.dataset.content!==i&&(o.innerHTML=`
                <div class="flex items-center justify-center text-xs">${t} <span class="ml-1">${s}</span></div>
                <div class="inventory-content-wrapper mt-1">
                    ${i}
                </div>
            `,o.dataset.content=i)}getFlowStateColor(e){switch(e){case v.Boredom:case v.Apathy:return"text-red-500";case v.Anxiety:case v.Worry:return"text-orange-500";case v.Arousal:case v.Control:case v.Relaxation:return"text-blue";case v.Flow:return"text-yellow-500 animate-pulse";default:return"text-black"}}}customElements.define("adventurer-status",qe);class ze extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="sunken-panel p-2 text-center text-sm italic">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",ze);class Ge extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}async initialize(e,t,s){this.decision=e,this.newlyUnlocked=t,this.engine=s,this.render(),await this.startFlow()}async startFlow(){this.newlyUnlocked.length>0?await this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}async renderUnlock(){const e=te.find(i=>i.feature===this.newlyUnlocked[0]);if(!e)return;const t=a("unlocks.title"),s=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let i="",o="";const r=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(i=`
                <h3 class="${r}" style="color: var(--color-stat-positive);">${a("run_ended_screen.continue_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.continue_decision")}</p>
            `,o=`
                <button id="continue-run-button" class="${r}" style="animation-delay: 1.2s;">
                    ${a(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(i=`
                <h3 class="${r}" style="color: var(--color-stat-negative);">${a("run_ended_screen.retire_quote")}</h3>
                <p class="${r}" style="animation-delay: 0.5s;">${a("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,o=`
                <button id="retire-run-button" class="${r}" style="animation-delay: 1s;">
                    ${a("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=i,s.innerHTML=o}}customElements.define("run-ended-screen",Ge);class Ue extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0,this._roomDeckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size","room-deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break;case"room-deck-size":this._roomDeckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
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
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Ue);class je extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"";case"WARN":return"text-yellow-500";case"ERROR":return"text-red-500";default:return""}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,i)=>`<p class="${this._getLogColor(s.level)}">[${i.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <pre class="m-2 mt-6 max-h-[100px] md:max-h-[280px] overflow-y-auto space-y-1" id="log-container">
                ${e}
            </pre>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",je);const Fe={common:"text-rarity-common",uncommon:"text-rarity-uncommon",rare:"text-rarity-rare",legendary:"text-rarity-legendary"},R=(n,e,t=!0,s=1)=>{const i=t?"text-green-600":"text-red-400",o=t&&e>0?"+":"";return`
        <div class="flex justify-between text-sm ${i}">
            <span ${s>1?'data-tooltip-key="multiple_units"':""}>${n}${s>1?a("global.units"):""}</span>
            <span class="font-mono">${o}${e}</span>
        </div>
    `};class We extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this._stackCount=1,this._isSelectable=!0,this.addEventListener("click",e=>{if(!this._isSelectable)return;const t=e.target;if(t.tagName!=="INPUT"&&t.tagName!=="LABEL"){const s=this.querySelector('input[type="checkbox"]');s&&!s.disabled&&(s.checked=!s.checked,s.dispatchEvent(new Event("change",{bubbles:!0})))}}),this.addEventListener("change",e=>{if(!this._isSelectable)return;e.target.type==="checkbox"&&!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set stackCount(e){this._stackCount=e,this.render()}get stackCount(){return this._stackCount}set isSelectable(e){this._isSelectable=e,this.render()}get isSelectable(){return this._isSelectable}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Fe[this._item.rarity]||"text-gray-400",t="relative transition-all duration-200",s=`card-checkbox-${this._item.instanceId}`;let i="";this._isSelectable&&(this._isDisabled?i="opacity-50 cursor-not-allowed":i="cursor-pointer");const o=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${i} ${o}`;let r=a("items_and_rooms."+this._item.id),l="";if("stats"in this._item){const u=this._item,m=this._item;switch(this._item.type){case"item_weapon":case"item_potion":case"item_armor":case"item_buff":l=`
            ${u.stats.hp?R(a("global.health"),u.stats.hp,u.stats.hp>0):""}
            ${u.stats.maxHp?R(a("global.max_hp"),u.stats.maxHp,u.stats.maxHp>0):""}
            ${u.stats.power?R(a("global.power"),u.stats.power,u.stats.power>0):""}
            ${u.stats.duration?R(a("global.duration"),u.stats.duration,!0):""}
          `;break;case"room_healing":l=`
            ${m.stats.hp?R(a("global.health"),m.stats.hp,!0):""}
          `;break;case"room_enemy":case"room_boss":case"room_trap":l=`
            ${m.stats.attack?R(a("global.attack"),m.stats.attack,!1,m.units):""}
            ${m.stats.hp?R(a("global.health"),m.stats.hp,!1,m.units):""}
          `,m.units>1&&(r=a("choice_panel.multiple_enemies_title",{name:r,count:m.units}));break}}this._stackCount>1&&(r=a("choice_panel.stacked_items_title",{name:r,count:this._stackCount}));const c=this._isSelected?"selected":"";this.innerHTML=`
      <fieldset class="font-sans ${c} flex flex-grow items-center" ${this._isDisabled?"disabled":""}>
        <legend class="${e}">${a("card_types."+this._item.type)} - ${a("rarity."+this._item.rarity)}</legend>
        <div class="p-2">
            <p class="font-bold text-sm ${e}">${r}</p>
            <div class="mt-2">
                ${l}
            </div>
            ${this._isSelectable?`
            <div class="mt-4 flex items-center">
              <input type="checkbox" id="${s}" ${this._isSelected?"checked":""} ${this._isDisabled?"disabled":""}>
              <label for="${s}" class="ml-2 text-sm">${a("card.select")}</label>
            </div>
            `:""}
        </div>
      </fieldset>
    `}}customElements.define("choice-card",We);const z=4;class Ke extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(i=>this._selectedIds.includes(i.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(i=>i.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const i=t.type==="room_boss";if(s)this._selectedIds=this._selectedIds.filter(o=>o!==e);else{const r=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="room_boss");i&&this._selectedIds.length===0?this._selectedIds.push(e):!i&&!r&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const o=this._choices.filter(l=>l.id===t.id).map(l=>l.instanceId);o.some(l=>this._selectedIds.includes(l))?this._selectedIds=this._selectedIds.filter(l=>!o.includes(l)):this._selectedIds.length<z&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=this._choices.filter(g=>g.justDrafted&&this._initialRender);if(e.length>0&&this._initialRender){this._initialRender=!1;const g=e.map(h=>{const p=document.createElement("choice-card");return p.item=h,p.isSelectable=!1,p.outerHTML}).join("");L.show(a("choice_panel.new_items_title"),`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 cards-container">${g}</div>`,[{text:a("global.continue"),value:void 0}]).then(()=>{this._choices.forEach(h=>h.justDrafted=!1),this.render()});return}const t={Common:0,Uncommon:1,Rare:2},s={Weapon:0,Armor:1,Potion:2,Buff:3},i={enemy:0,trap:1,healing:2,boss:3};let o=[...this._choices];this._deckType==="item"?o.sort((g,h)=>{const p=s[g.type]-s[h.type];if(p!==0)return p;const f=t[g.rarity]||0,_=t[h.rarity]||0;return f-_}):o.sort((g,h)=>{const p=g,f=h,_=i[p.type]-i[f.type];if(_!==0)return _;const b=p.stats.hp||0,y=f.stats.hp||0;if(b!==y)return y-b;const E=p.stats.attack||0;return(f.stats.attack||0)-E});const r=this._deckType==="room";let l;if(r)l=o;else{const g=new Map;o.forEach(h=>{const p=h;g.has(p.id)?g.get(p.id).count++:g.set(p.id,{choice:p,count:1})}),l=Array.from(g.values()).map(h=>({...h.choice,stackCount:h.count}))}a(r?"choice_panel.title_room":"choice_panel.title");let c=a(r?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?c=a("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(c=a("choice_panel.roll_credits"));let u=!1,m=c;this._offerImpossible||this._roomSelectionImpossible?u=!0:r?this._choices.filter(p=>this._selectedIds.includes(p.instanceId)).some(p=>p.type==="room_boss")?(u=this._selectedIds.length===1,m=`${c} (1/1)`):(u=this._selectedIds.length===3,m=`${c} (${this._selectedIds.length}/3)`):(u=this._selectedIds.length>=2&&this._selectedIds.length<=z,m=`${c} (${this._selectedIds.length}/${z})`),this.innerHTML=`
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
    `;const d=this.querySelector("#loot-card-container");d&&l.forEach(g=>{const h=document.createElement("choice-card");h.item=g,"stackCount"in g&&(h.stackCount=g.stackCount),h.isSelected=this._selectedIds.includes(g.instanceId);let p=this._disabled;if(this._offerImpossible)p=!0;else if(r){const f=this._choices.filter(b=>this._selectedIds.includes(b.instanceId)),_=f.some(b=>b.type==="room_boss");h.isSelected?p=!1:(_||g.type==="room_boss"&&f.length>0||f.length>=3)&&(p=!0)}else{const f=new Map(this._choices.map(y=>[y.instanceId,y.id])),_=this._selectedIds.map(y=>f.get(y));p=!h.isSelected&&_.includes(g.id)||this._disabled}h.isDisabled=p,h.isNewlyDrafted=g.justDrafted&&this._initialRender||!1,d.appendChild(h)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ke);const k=(n,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${n}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,Ze=(n,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${n}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,Je=(n,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[n.rarity]||"text-gray-400";let i="";if("stats"in n)if(n.type==="item_weapon"||n.type==="item_armor"||n.type==="item_potion"){const o=n;i=`
                ${o.stats.hp?k(a("global.health"),o.stats.hp):""}
                ${o.stats.maxHp?k(a("global.max_hp"),o.stats.maxHp):""}
                ${o.stats.power?k(a("global.power"),o.stats.power,(o.stats.power||0)>0):""}
            `}else{const o=n;switch(o.type){case"room_enemy":i=`
                        ${o.stats.attack?k(a("global.attack"),o.stats.attack,!1):""}
                        ${o.stats.hp?k(a("global.health"),o.stats.hp,!1):""}
                        ${o.stats.minUnits&&o.stats.maxUnits?Ze(a("global.units"),o.stats.minUnits,o.stats.maxUnits):""}
                    `;break;case"room_boss":i=`
                        ${o.stats.attack?k(a("global.attack"),o.stats.attack,!1):""}
                        ${o.stats.hp?k(a("global.health"),o.stats.hp,!1):""}
                    `;break;case"room_healing":i=`
                        ${o.stats.hp?k(a("global.health"),o.stats.hp):""}
                    `;break;case"room_trap":i=`
                        ${o.stats.attack?k(a("global.attack"),o.stats.attack,!1):""}
                    `;break}}return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${s}">${a("items_and_rooms."+n.id)}</p>
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
                    ${a("global.buy")} (${n.cost} ${a("global.bp")})
                </button>
            </div>
        </div>
    `};class Ve extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>Je(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
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
        `}}customElements.define("workshop-screen",Ve);class Qe extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",async e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?(this.metaManager.metaState.adventurers>0||this.metaManager.metaState.highestRun>0,this.engine.hasSaveGame()?await G.show(a("menu.new_game"),a("menu.new_game_confirm"))&&this.engine.startNewGame():this.engine.startNewGame()):t.id==="continue-game-button"?this.engine.continueGame():t.id==="reset-game-button"&&await G.show(a("menu.reset_save"),a("menu.reset_save_confirm"))&&(this.metaManager.reset(),this.engine.quitGame(!0),this.render())})}connectedCallback(){this.render()}render(){if(!this.metaManager||!this.engine)return;const e=this.metaManager.metaState,t=this.engine.hasSaveGame();let s="";if(t){const i=e.adventurers||0;s=`
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
          <p class="status-bar-field">build 114</p>
        </div>
      </div>
    `}}customElements.define("menu-screen",Qe);class Ye extends HTMLElement{constructor(){super(),this.isDesktop=!0,this.attachShadow({mode:"open"}),this.onclick=t=>{window.matchMedia("(pointer: coarse)").matches&&t.target===this&&this.hide()};const e=document.createElement("style");e.textContent=`
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
        `,this.contentContainer=document.createElement("div"),this.contentContainer.className="content-container",this.titleElement=document.createElement("h3"),this.bodyElement=document.createElement("div"),this.contentContainer.appendChild(this.titleElement),this.contentContainer.appendChild(this.bodyElement),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.contentContainer)}show(e,t,s){this.titleElement.textContent=e.title,this.bodyElement.innerHTML=e.body,this.isDesktop=!window.matchMedia("(pointer: coarse)").matches,this.classList.add("show")}hide(){this.classList.remove("show")}}customElements.define("tooltip-box",Ye);class T{constructor(){this.showTimeout=null,this.hideTimeout=null,this.desktopTooltipActive=!1,this.tooltipBox=document.createElement("tooltip-box"),document.body.appendChild(this.tooltipBox)}static getInstance(){return T.instance||(T.instance=new T),T.instance}handleMouseEnter(e){if(this.isTouchDevice())return;const t=e.target,s=this.findTooltipKey(t);this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),s&&this.activeToolipKey!==s&&(this.showTimeout=window.setTimeout(()=>{t.addEventListener("mouseleave",this.handleMouseLeave.bind(this),{once:!0}),this.activeToolipKey=s;const i=this.getTooltipContent(s);i&&(this.tooltipBox.show(i,e.clientX,e.clientY),this.desktopTooltipActive=!0)},300))}handleMouseLeave(){this.isTouchDevice()||(this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=null),this.tooltipBox.hide(),this.activeToolipKey="",this.desktopTooltipActive=!1)}handleClick(e){const t=e.target;if(t.classList.contains("tooltip-icon")){const s=this.findTooltipKey(t.parentElement);if(s){const i=this.getTooltipContent(s);i&&this.tooltipBox.show(i,0,0)}}}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}findTooltipKey(e){return e?e.getAttribute("data-tooltip-key")||this.findTooltipKey(e.parentElement):null}getTooltipContent(e){const t=a(`tooltips.${e}.body`);if(t.includes("tooltips."))return null;let s=a(`tooltips.${e}.title`);return s.includes("tooltips.")&&(s=a("global.information")),{title:s,body:t}}}const J=T.getInstance(),C=document.getElementById("app");if(!C)throw new Error("Could not find app element to mount to");async function Xe(){C.innerHTML="<div>Initializing...</div>";const n=new Me;await oe(n);const e=new Le,t=new Te(e),s=new He(e),i=new xe(t,n,s);i.on("state-change",o=>{if(i.isLoading){C.innerHTML=`<div>${a("global.loading_game_data")}</div>`;return}if(i.error){C.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${a("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${i.error}</p>
                    </div>
                </div>
            `;return}Ce(C,o,i),Re()}),C.innerHTML=`<div>${a("global.initializing")}</div>`,document.body.addEventListener("mouseover",o=>J.handleMouseEnter(o)),document.body.addEventListener("click",o=>J.handleClick(o)),await i.init(),i.showMenu()}Xe().catch(n=>{console.error(n),C&&(C.innerHTML=`
      <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
               <h2 class="text-2xl text-brand-secondary mb-4">A critical error occurred</h2>
               <p class="text-brand-text">${n.message}</p>
          </div>
      </div>
    `)});
