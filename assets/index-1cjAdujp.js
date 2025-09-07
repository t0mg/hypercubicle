(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const M={hp:100,maxHp:100,power:5};class O{constructor(e,t){this.hp=M.hp,this.maxHp=M.maxHp,this.power=M.power,this.interest=33+Math.floor(Math.random()*50),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=t}modifyInterest(e,t){const s=Math.max(.1,(1e3-this.traits.expertise)/1e3),a=(Math.random()*2-1)*t,i=(e+a)*s,o=this.interest;this.interest=Math.max(0,Math.min(100,this.interest+i)),this.logger.debug(`Interest changed from ${o.toFixed(1)} to ${this.interest.toFixed(1)} (Base: ${e}, Rand: ${a.toFixed(1)}, Total: ${i.toFixed(1)})`)}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=M.power,s=M.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(a=>{t+=a.stats.power||0,s+=a.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}}class q{constructor(){this.entries=[]}log(e,t="INFO"){this.entries.push({message:e,level:t,timestamp:Date.now()}),console.log(`[${t}] ${e}`)}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const U=15,ee=99,te=10,N=10,L=32,se=8,B=300,z=r=>`${r}_${Math.random().toString(36).substr(2,9)}`,ne=(r,e)=>Math.floor(Math.random()*(e-r+1))+r,F=r=>{const e=[...r];for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e},V=(r,e,t,s)=>{const a=e.filter(c=>r.includes(c.id)),i=[],o={Common:.6,Uncommon:.3,Rare:.1},l={Common:0,Uncommon:0,Rare:0},h={Common:0,Uncommon:0,Rare:0};Object.keys(o).forEach(c=>{h[c]=Math.floor(t*o[c])});let u=Object.values(h).reduce((c,p)=>c+p,0);for(;u<t;)h.Common+=1,u+=1;a.filter(c=>c.cost!==null).forEach(c=>{i.push(s(c)),l[c.rarity]+=1}),Object.keys(o).forEach((c,p)=>{const d=a.filter(m=>m.rarity===c);for(;l[c]<h[c]&&d.length!==0;){const m=Math.floor(Math.random()*d.length),f=d[m];i.push(s(f)),l[c]+=1}});const g=a.filter(c=>c.rarity==="Common");for(;i.length<t&&g.length>0;){const c=Math.floor(Math.random()*g.length),p=g[c];i.push(s(p))}return F(i)},j=(r,e,t)=>V(r,e,t,s=>({...s,instanceId:z(s.id)})),G=(r,e,t)=>V(r,e,t,a=>{const i={...a,instanceId:z(a.id)};return i.type==="enemy"&&i.stats.minUnits&&i.stats.maxUnits&&(i.units=ne(i.stats.minUnits,i.stats.maxUnits)),i}),ae=r=>r.roomHand.length<3&&!r.roomHand.some(e=>e.type==="boss"),ie=r=>[...new Set(r.hand.map(t=>t.id))].length<2&&r.hand.length>0;let K={};async function Q(r){try{const e=await fetch(`/rogue-steward/locales/${r}.json`);if(!e.ok)throw new Error(`Could not load ${r}.json`);K=await e.json()}catch(e){console.warn(`Failed to load ${r} translations:`,e),r!=="en"&&await Q("en")}}function re(){return navigator.language.split("-")[0]}function n(r,e={}){let s=r.split(".").reduce((a,i)=>a?a[i]:void 0,K);if(!s)return console.warn(`Translation not found for key: ${r}`),r;for(const a in e)s=s.replace(`{${a}}`,String(e[a]));return s}async function oe(){const r=re();await Q(r)}var w=(r=>(r.WORKSHOP="workshop",r.HAND_SIZE_INCREASE="hand_size_increase",r.ADVENTURER_TRAITS="ADVENTURER_TRAITS",r.BP_MULTIPLIER="BP_MULTIPLIER",r.WORKSHOP_ACCESS="WORKSHOP_ACCESS",r.BP_MULTIPLIER_2="BP_MULTIPLIER_2",r))(w||{});const Y=[{feature:"workshop",runThreshold:2,title:()=>n("unlocks.workshop.title"),description:()=>n("unlocks.workshop.description")},{feature:"hand_size_increase",runThreshold:3,title:()=>n("unlocks.hand_size_increase.title"),description:()=>n("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>n("unlocks.adventurer_traits.title"),description:()=>n("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>n("unlocks.bp_multiplier.title"),description:()=>n("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>n("unlocks.workshop_access.title"),description:()=>n("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>n("unlocks.bp_multiplier_2.title"),description:()=>n("unlocks.bp_multiplier_2.description")}];function le(r,e,t){var c,p;const{traits:s,inventory:a}=r;t.debug(`--- Adventurer Decision --- (Offense: ${s.offense}, Risk: ${s.risk})`);const i=((c=a.weapon)==null?void 0:c.stats.power)||0,o=((p=a.armor)==null?void 0:p.stats.maxHp)||0;t.debug(`Current Gear: Weapon Power(${i}), Armor HP(${o})`);const l=d=>{var f,_;let m=(d.rarity==="Uncommon"?2:d.rarity==="Rare"?3:1)*5;switch(d.type){case"Weapon":const b=(d.stats.power||0)-i;if(b<=0&&d.id!==((f=a.weapon)==null?void 0:f.id))return-1;m+=b*(s.offense/10),b>0&&(m+=b*(s.expertise/10));const I=d.stats.maxHp||0;I<0&&(m+=I*(100-s.risk)/20);break;case"Armor":const S=(d.stats.maxHp||0)-o;if(S<=0&&d.id!==((_=a.armor)==null?void 0:_.id))return-1;m+=S*(100-s.offense)/10,S>0&&(m+=S*(s.expertise/10));const E=d.stats.power||0;E>0&&(m+=E*(s.offense/15));const R=d.stats.power||0;R<0&&(m+=R*(s.risk/10));break;case"Potion":const y=r.hp/r.maxHp;m+=10*(100-s.risk)/100,y<.7&&(m+=20*(1-y)),m+=5*(s.expertise/100),a.potions.length>=ee&&(m*=.1);break}return m},h=e.map(d=>({item:d,score:l(d)})).filter(d=>d.score>0);if(h.sort((d,m)=>m.score-d.score),h.length===0||h[0].score<te)return r.modifyInterest(-15,10),{choice:null,reason:n("game_engine.adventurer_declines_offer")};const u=h[0].item;t.debug(`Adventurer chooses: ${u.name} (Score: ${h[0].score.toFixed(1)})`),h[0].score>60?r.modifyInterest(15,5):h[0].score>30?r.modifyInterest(10,8):r.modifyInterest(5,5);const g=n("game_engine.adventurer_accepts_offer",{itemName:u.name});return{choice:u,reason:g}}class ce{constructor(e){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{this.metaManager.incrementAdventurers();const t={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s=new q,a=new O(t,s),i=this._allItems.filter(m=>m.cost===null).map(m=>m.id),o=j(i,this._allItems,L),l=this._getHandSize(),h=o.slice(0,l),u=o.slice(l),g=this._allRooms.filter(m=>m.cost===null).map(m=>m.id),c=G(g,this._allRooms,L),p=c.slice(0,l),d=c.slice(l);s.info("--- Starting New Adventurer (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:a,unlockedDeck:i,availableDeck:u,hand:h,unlockedRoomDeck:g,availableRoomDeck:d,roomHand:p,handSize:l,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:n("game_engine.new_adventurer"),logger:s,run:1,room:1,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{this.startNewGame()},this.startNewRun=t=>{if(!this.gameState)return;const s=t||this.gameState.run+1;this.metaManager.updateRun(s);const a=this._getHandSize(),i=j(this.gameState.unlockedDeck,this._allItems,L),o=i.slice(0,a),l=i.slice(a),h=G(this.gameState.unlockedRoomDeck,this._allRooms,L),u=h.slice(0,a),g=h.slice(a),c=new O(this.gameState.adventurer.traits,this.gameState.logger);c.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${s} ---`),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:c,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:l,hand:o,availableRoomDeck:g,roomHand:u,handSize:a,room:1,run:s,feedback:n("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=t=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(a=>t.includes(a.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand||this.gameState.runEnded.isOver)return;let a=null,i;const o=this.gameState.adventurer;if(this.gameState.offeredLoot.length===0)o.modifyInterest(-15,5),i=n("game_engine.adventurer_declines_empty_offer");else{const f=le(o,this.gameState.offeredLoot,this.gameState.logger);a=f.choice,i=f.reason}let l=this.gameState.hand,h=this.gameState.availableDeck;l.forEach(f=>f.justDrafted=!1);let u=l.filter(f=>!t.includes(f.instanceId));const g=this.gameState.handSize-u.length,c=h.slice(0,g);c.forEach(f=>{f.draftedRoom=this.gameState.room,f.justDrafted=!0});const p=h.slice(g);u.push(...c),a?a.type==="Potion"?o.addPotion(a):a.type==="Buff"?o.applyBuff(a):o.equip(a):t.length>0&&(o.interest=Math.max(0,o.interest-10));const d=this.gameState.room+1,m=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:o,feedback:i,availableDeck:p,hand:u,room:d,designer:{balancePoints:m}},this._emit("state-change",this.gameState)},B)},this.runEncounter=t=>{!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM"||(this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.offeredRooms=t,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.offeredRooms||this.gameState.runEnded.isOver)return;let s=this.gameState.adventurer,a=[];const i=Math.floor(Math.random()*this.gameState.offeredRooms.length),o=this.gameState.offeredRooms[i];switch(this.gameState.logger.info(`--- Encountering Room: ${o.name} ---`),o.type){case"enemy":case"boss":const m={enemyCount:o.units||1,enemyPower:o.stats.attack||5,enemyHp:o.stats.hp||10},f=this._simulateEncounter(s,this.gameState.room,m);s=f.newAdventurer,a=f.feedback;break;case"healing":const _=o.stats.hp||0;s.modifyInterest(s.hp/s.maxHp<.33?20:10,3),s.hp=Math.min(s.maxHp,s.hp+_),a.push(n("game_engine.healing_room",{name:o.name,healing:_})),this.gameState.logger.info(n("game_engine.healing_room",{name:o.name,healing:_}));break;case"trap":const b=o.stats.attack||0;s.hp-=b,s.modifyInterest(s.hp<0?-25:-15,5),a.push(n("game_engine.trap_room",{name:o.name,damage:b})),this.gameState.logger.info(n("game_engine.trap_room",{name:o.name,damage:b}));break}s.updateBuffs();let l=this.gameState.roomHand,h=this.gameState.availableRoomDeck;l.forEach(m=>m.justDrafted=!1);const u=this.gameState.offeredRooms.map(m=>m.instanceId);let g=l.filter(m=>!u.includes(m.instanceId));const c=this.gameState.handSize-g.length,p=h.slice(0,c);p.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const d=h.slice(c);if(g.push(...p),this.gameState.adventurer=s,s.hp<=0){this._endRun(n("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(s.interest<=U){this._endRun(n("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}));return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),a.push(n("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:a,encounter:void 0,roomHand:g,availableRoomDeck:d}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:a,encounter:void 0,roomHand:g,availableRoomDeck:d},this._emit("state-change",this.gameState)},B))},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.interest-=30,this._endRun(n("game_engine.no_more_rooms")))},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this.metaManager.acls.has(w.WORKSHOP)){this.startNewRun();return}const t=this.gameState.run+1,s=this._allItems.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedDeck.includes(o.id)),a=this._allRooms.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedRoomDeck.includes(o.id)),i=[...s,...a];this.gameState={...this.gameState,phase:"SHOP",run:t,room:0,shopItems:F(i).slice(0,4),runEnded:{isOver:!1,reason:""},feedback:n("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.purchaseItem=t=>{if(!this.gameState)return;const s=this._allItems.find(p=>p.id===t),a=this._allRooms.find(p=>p.id===t),i=s||a;if(!i||i.cost===null||this.gameState.designer.balancePoints<i.cost)return;let o=this.gameState.unlockedDeck,l=this.gameState.unlockedRoomDeck,h=this.gameState.availableDeck,u=this.gameState.availableRoomDeck;s?(o=[...this.gameState.unlockedDeck,t],this.isWorkshopAccessUnlocked()&&(h=[s,...this.gameState.availableDeck])):a&&(l=[...this.gameState.unlockedRoomDeck,t],this.isWorkshopAccessUnlocked()&&(u=[a,...this.gameState.availableRoomDeck]));const g=this.gameState.designer.balancePoints-i.cost,c=this.gameState.shopItems.filter(p=>p.id!==t);this.gameState.logger.info(`Purchased ${i.name}.`),this.gameState={...this.gameState,designer:{balancePoints:g},unlockedDeck:o,unlockedRoomDeck:l,availableDeck:h,availableRoomDeck:u,shopItems:c},this._emit("state-change",this.gameState)},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(w.BP_MULTIPLIER_2)?N*4:this.metaManager.acls.has(w.BP_MULTIPLIER)?N*2:N,this.metaManager=e}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){const s=this._listeners[e];s&&s.forEach(a=>a(t))}_simulateEncounter(e,t,s){var c,p,d,m,f,_,b,I,S,E,R;(c=this.gameState)==null||c.logger.info(`--- Encounter: Room ${t} ---`);const a=[];let i=0,o=0;const l=e.hp;for(let y=0;y<s.enemyCount;y++){(p=this.gameState)==null||p.logger.info(`Adventurer encounters enemy ${y+1}/${s.enemyCount}.`);const J=e.hp/e.maxHp,X=1-e.traits.risk/120;if(J<X&&e.inventory.potions.length>0){const $=e.inventory.potions.shift();if($){const H=$.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+H),a.push(n("game_engine.adventurer_drinks_potion",{potionName:$.name})),(d=this.gameState)==null||d.logger.info(`Adventurer used ${$.name} and recovered ${H} HP.`)}}let D=s.enemyHp;for(;D>0&&e.hp>0;){const $=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(Math.random()<$){const C=e.power;D-=C,(m=this.gameState)==null||m.logger.debug(`Adventurer hits for ${C} damage.`)}else(f=this.gameState)==null||f.logger.debug("Adventurer misses.");if(D<=0){(_=this.gameState)==null||_.logger.info("Enemy defeated."),o++;break}const H=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(Math.random()<H){const C=(((b=e.inventory.armor)==null?void 0:b.stats.maxHp)||0)/10,A=Math.max(1,s.enemyPower-C);i+=A,e.hp-=A,(I=this.gameState)==null||I.logger.debug(`Enemy hits for ${A} damage.`)}else(S=this.gameState)==null||S.logger.debug("Enemy misses.")}if(e.hp<=0){(E=this.gameState)==null||E.logger.warn("Adventurer has been defeated.");break}}let h;const u=l-e.hp,g=u/e.maxHp;return(R=this.gameState)==null||R.logger.debug(`hpLost: ${u}, hpLostRatio: ${g.toFixed(2)}`),g>.7?(h=n("game_engine.too_close_for_comfort"),e.modifyInterest(-15,5)):g>.4?(h=n("game_engine.great_battle"),e.modifyInterest(10,5)):o>3&&e.traits.offense>60?(h=n("game_engine.easy_fight"),e.modifyInterest(0,5)):(h=n("game_engine.worthy_challenge"),e.modifyInterest(-2,3)),a.push(h),e.hp>0&&o===s.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:a,totalDamageTaken:i}}_endRun(e){if(!this.gameState)return;const t=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.error(`GAME OVER: ${e}`),this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e},newlyUnlocked:t},this._emit("state-change",this.gameState)}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,t=e-U,s=(Math.random()-.5)*20;return t+s>0?"continue":"retire"}handleEndOfRun(e){if(this.gameState){if(e==="retire"){this.showMenu();return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},t=new q,s=new O(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]}}_getHandSize(){return this.metaManager.acls.has(w.HAND_SIZE_INCREASE)?12:se}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(w.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(w.WORKSHOP)}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(n("global.error_loading_items",{statusText:e.statusText}));this._allItems=await e.json();const t=await fetch("/rogue-steward/game/rooms.json");if(!t.ok)throw new Error(n("global.error_loading_rooms",{statusText:t.statusText}));this._allRooms=await t.json()}catch(e){this.error=e.message||n("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const de=r=>{if(!r)return n("global.initializing");switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return n("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return n("main.adventurer_facing_encounter");default:return n("global.loading")}},he=r=>{const e=document.createElement("loading-indicator");return e.setAttribute("text",de(r)),e},W=(r,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=r.hand,s.deckType="item",s.offerImpossible=ie(r)):(s.choices=r.roomHand,s.deckType="room",s.roomSelectionImpossible=ae(r)),s},me=(r,e,t)=>{r.innerHTML="";const s=document.createElement("div");if(s.className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center",r.appendChild(s),e.runEnded.isOver){const d=document.createElement("run-ended-screen");d.setAttribute("final-bp",e.designer.balancePoints.toString()),d.setAttribute("reason",e.runEnded.reason),d.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&d.setAttribute("workshop-unlocked",""),d.newlyUnlocked=e.newlyUnlocked,d.engine=t,d.setDecision(t.getAdventurerEndRunDecision()),s.appendChild(d)}const a=document.createElement("div");a.className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6",s.appendChild(a);const i=document.createElement("div");i.className="lg:col-span-1 space-y-6",a.appendChild(i);const o=document.createElement("game-stats");o.engine=t,t.isWorkshopUnlocked()&&o.setAttribute("balance-points",e.designer.balancePoints.toString()),o.setAttribute("run",e.run.toString()),o.setAttribute("room",e.room.toString()),o.setAttribute("deck-size",e.availableDeck.length.toString()),i.appendChild(o);const l=document.createElement("feedback-panel"),h=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;l.setAttribute("message",h),i.appendChild(l);const u=document.createElement("log-panel");u.logger=e.logger,u.traits=e.adventurer.traits,i.appendChild(u);const g=document.createElement("div");g.className="lg:col-span-2 space-y-6",a.appendChild(g);const c=document.createElement("adventurer-status");c.metaState=t.metaManager.metaState,c.adventurer=e.adventurer,g.appendChild(c);const p=document.createElement("div");switch(p.className="lg:col-span-3",a.appendChild(p),e.phase){case"DESIGNER_CHOOSING_LOOT":p.appendChild(W(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":p.appendChild(W(e,t,"room"));break;case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":p.appendChild(he(e));break;default:const d=document.createElement("div");d.textContent=n("main.unhandled_game_phase",{phase:e.phase}),p.appendChild(d);break}},ue=(r,e)=>{r.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,r.appendChild(t)},pe=(r,e,t)=>{r.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,r.appendChild(s)},ge=(r,e,t)=>{if(!e){r.innerHTML=`<div>${n("global.loading")}</div>`;return}switch(e.phase){case"MENU":ue(r,t);break;case"SHOP":pe(r,e,t);break;default:me(r,e,t);break}},Z="rogue-steward-meta";class fe{constructor(){this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of Y)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=localStorage.getItem(Z);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{localStorage.setItem(Z,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',_e=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',xe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',ve=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',we=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Se=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',ke=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class ye extends HTMLElement{constructor(){super(),this._adventurer=null,this._metaState=null}set adventurer(e){this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){var a,i;if(!this._adventurer){this.innerHTML="";return}const e=((a=this._metaState)==null?void 0:a.adventurers)||1,t=this._adventurer.hp/this._adventurer.maxHp*100,s=(i=this._metaState)==null?void 0:i.unlockedFeatures.includes(w.ADVENTURER_TRAITS);this.innerHTML=`
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 class="text-xl font-label mb-2 text-center text-white">${n("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${be()} <span>${n("global.health")}</span></div>
                                <span class="font-label text-sm">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${t}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${xe()} <span>${n("adventurer_status.interest")}</span></div>
                                <span class="font-label text-sm">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-brand-interest h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners">
                        ${_e()}
                        <span class="mr-2">${n("global.power")}</span>
                        <span class="font-label text-lg text-white">${this._adventurer.power}</span>
                    </div>
                </div>

                ${s?`
                <div class="border-t border-gray-700 my-2"></div>
                <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                    <div>
                        <span class="text-brand-text-muted block">${n("log_panel.offense")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.offense}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${n("log_panel.risk")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.risk}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${n("log_panel.expertise")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.expertise}</span>
                    </div>
                </div>`:""}

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${n("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${ve()} <span class="ml-1">${n("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${n("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${n("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${we()} <span class="ml-1">${n("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${n("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${n("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${ke()} <span class="ml-1">${n("adventurer_status.buffs")}</span></div>
                        ${this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(o=>`
                            <div>
                                <p class="text-white text-sm">${o.name} (${n("global.duration")}: ${o.stats.duration})</p>
                                <p class="text-xs text-brand-text-muted">${Object.entries(o.stats).filter(([l])=>l!=="duration").map(([l,h])=>`${n(`global.${l}`)}: ${h}`).join(", ")}</p>
                            </div>
                        `).join(""):`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Se()} <span class="ml-1">${n("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white text-sm">${n("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",ye);class $e extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",$e);class Ie extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="unlock-dismiss-button"?this.dismissUnlock():t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}setDecision(e){this.decision=e,this.startFlow()}connectedCallback(){this.render()}startFlow(){this.newlyUnlocked.length>0?this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}renderUnlock(){const e=this.querySelector("#unlock-container");if(!e)return;const t=Y.find(s=>s.feature===this.newlyUnlocked[0]);t&&(e.innerHTML=`
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-3/4">
                    <h2 class="text-4xl font-title text-brand-secondary mb-3">${n("unlocks.title")}</h2>
                    <h3 class="font-label text-white">${t.title()}</h3>
                    <p class="text-brand-text mb-6">${t.description()}</p>
                    <button id="unlock-dismiss-button" class="bg-brand-primary text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors">
                        ${n("global.continue")}
                    </button>
                </div>
            </div>
        `)}dismissUnlock(){const e=this.querySelector("#unlock-container");e&&(e.innerHTML=""),this.state="unlock-revealed",this.revealDecision()}revealDecision(){this.state==="unlock-revealed"&&(this.state="decision-revealing",setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3))}render(){this.getAttribute("final-bp");const e=this.getAttribute("reason")||n("run_ended_screen.default_reason");this.innerHTML=`
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
            <div class="absolute inset-0 bg-black/80 flex items-center justify-center z-40 backdrop-blur-md">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full max-w-3/4">
                    <h2 class="text-4xl font-title text-brand-secondary mb-2">${n("run_ended_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${e}</p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${n("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let a="",i="";const o=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(a=`
                <h3 class="text-2xl text-green-400 ${o}">${n("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.continue_decision")}</p>
            `,i+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${n(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(a=`
                <h3 class="text-2xl text-red-400 ${o}">${n("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,i+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${n("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=a,s.innerHTML=i}}customElements.define("run-ended-screen",Ie);class Ee extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
                ${this._balancePoints!==null?`
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.bp")}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                `:""}
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.run")}</span>
                    <p class="text-2xl  text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.room")}</span>
                    <p class="text-2xl  text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.deck")}</span>
                    <p class="text-2xl  text-white">${this._deckSize}</p>
                </div>
                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${n("global.workshop")}
                    </button>
                </div>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Ee);class Re extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,s){e==="text"&&(this._text=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",Re);class Me extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(s.level)}">[${a.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${n("log_panel.title")}</h4>
                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",Me);const Te={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},x=(r,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `;class He extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Te[this._item.rarity]||"text-gray-400",t="bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let s="";this._isDisabled?s="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?s="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":s="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s}${a}`;let i=this._item.name,o="";if("stats"in this._item)if("power"in this._item.stats||"maxHp"in this._item.stats)o=`
          ${this._item.stats.hp?x(n("global.health"),this._item.stats.hp):""}
          ${this._item.stats.maxHp?x(n("global.max_hp"),this._item.stats.maxHp):""}
          ${this._item.stats.power?x(n("global.power"),this._item.stats.power):""}
        `;else{const l=this._item;switch(l.type){case"enemy":o=`
              ${l.stats.attack?x(n("global.attack"),l.stats.attack,!1):""}
              ${l.stats.hp?x(n("global.health"),l.stats.hp,!1):""}
            `,l.units>1&&(i=n("choice_panel.multiple_enemies_title",{name:l.name,count:l.units}));break;case"boss":o=`
              ${l.stats.attack?x(n("global.attack"),l.stats.attack,!1):""}
              ${l.stats.hp?x(n("global.health"),l.stats.hp,!1):""}
            `;break;case"healing":o=`
              ${l.stats.hp?x(n("global.health"),l.stats.hp):""}
            `;break;case"trap":o=`
              ${l.stats.attack?x(n("global.attack"),l.stats.attack,!1):""}
            `;break}}this.innerHTML=`
      <div>
        <div class="flex justify-between items-baseline">
          <p class=" text-2xl ${e}">${i}</p>
          <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
        </div>
        <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
        <div class="border-t border-gray-700 my-2"></div>
        <div class="space-y-1 text-brand-text text-large">
          ${o}
        </div>
      </div>
    `}}customElements.define("choice-card",He);const P=4;class Ce extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(a=>this._selectedIds.includes(a.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(a=>a.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const a=t.type==="boss";if(s)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{const o=this._choices.filter(l=>this._selectedIds.includes(l.instanceId)).some(l=>l.type==="boss");a&&this._selectedIds.length===0?this._selectedIds.push(e):!a&&!o&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=new Map(this._choices.map(i=>[i.instanceId,i.id]));if(s)this._selectedIds=this._selectedIds.filter(i=>i!==e);else{if(this._selectedIds.map(o=>a.get(o)).includes(t.id))return;this._selectedIds.length<P&&this._selectedIds.push(e)}}this.render()}render(){if(!this._choices)return;const e=this._deckType==="room",t=n(e?"choice_panel.title_room":"choice_panel.title");let s=n(e?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?s=n("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(s=n("choice_panel.roll_credits"));let a=!1,i=s;this._offerImpossible||this._roomSelectionImpossible?a=!0:e?this._choices.filter(u=>this._selectedIds.includes(u.instanceId)).some(u=>u.type==="boss")?(a=this._selectedIds.length===1,i=`${s} (1/1)`):(a=this._selectedIds.length===3,i=`${s} (${this._selectedIds.length}/3)`):(a=this._selectedIds.length>=2&&this._selectedIds.length<=P,i=`${s} (${this._selectedIds.length}/${P})`),this.innerHTML=`
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
        `;const o=this.querySelector("#loot-card-container");o&&this._choices.forEach(l=>{const h=document.createElement("choice-card");h.item=l,h.isSelected=this._selectedIds.includes(l.instanceId);let u=this._disabled;if(this._offerImpossible)u=!0;else if(e){const g=this._choices.filter(p=>this._selectedIds.includes(p.instanceId)),c=g.some(p=>p.type==="boss");h.isSelected?u=!1:(c||l.type==="boss"&&g.length>0||g.length>=3)&&(u=!0)}else{const g=new Map(this._choices.map(d=>[d.instanceId,d.id])),c=this._selectedIds.map(d=>g.get(d));u=!h.isSelected&&c.includes(l.id)||this._disabled}h.isDisabled=u,h.isNewlyDrafted=l.justDrafted&&this._initialRender||!1,o.appendChild(h)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ce);const v=(r,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,Le=(r,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${r}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,De=(r,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";let a="";if("stats"in r)if(r.type==="Weapon"||r.type==="Armor"||r.type==="Potion"){const i=r;a=`
                ${i.stats.hp?v(n("global.health"),i.stats.hp):""}
                ${i.stats.maxHp?v(n("global.max_hp"),i.stats.maxHp):""}
                ${i.stats.power?v(n("global.power"),i.stats.power,(i.stats.power||0)>0):""}
            `}else{const i=r;switch(i.type){case"enemy":a=`
                        ${i.stats.attack?v(n("global.attack"),i.stats.attack,!1):""}
                        ${i.stats.hp?v(n("global.health"),i.stats.hp,!1):""}
                        ${i.stats.minUnits&&i.stats.maxUnits?Le(n("global.units"),i.stats.minUnits,i.stats.maxUnits):""}
                    `;break;case"boss":a=`
                        ${i.stats.attack?v(n("global.attack"),i.stats.attack,!1):""}
                        ${i.stats.hp?v(n("global.health"),i.stats.hp,!1):""}
                    `;break;case"healing":a=`
                        ${i.stats.hp?v(n("global.health"),i.stats.hp):""}
                    `;break;case"trap":a=`
                        ${i.stats.attack?v(n("global.attack"),i.stats.attack,!1):""}
                    `;break}}return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${s}">${r.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${r.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${s}">${r.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${a}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${r.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${n("global.buy")} (${r.cost} ${n("global.bp")})
                </button>
            </div>
        </div>
    `};class Ae extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>De(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-label text-white">${n("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${n("workshop.description")}</p>
                    <p class="mt-4 text-2xl">
                        ${n("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${n("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 pixel-corners text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${n("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",Ae);class Oe extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?this.metaManager.metaState.highestRun>0?confirm(n("menu.new_game_confirm"))&&(this.metaManager.reset(),this.engine.startNewGame()):this.engine.startNewGame():t.id==="continue-game-button"&&this.engine.continueGame()})}connectedCallback(){this.render()}render(){if(!this.metaManager)return;const e=this.metaManager.metaState,t=e.highestRun>0;let s="";if(t){const a=e.adventurers||1;s=`
                <p class="text-lg text-gray-400 mt-4">
                    ${n("menu.max_runs",{count:e.highestRun})} | ${n("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${n("menu.adventurer_count",{count:a})}
                </p>
            `}this.innerHTML=`
            <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${n("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${n("game_subtitle")}</p>
                ${s}
                <div class="mt-8 space-y-4">
                        ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                            ${n("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                        ${n("menu.new_game")}
                    </button>
                </div>
            </div>
        `}}customElements.define("menu-screen",Oe);const T=document.getElementById("app");if(!T)throw new Error("Could not find app element to mount to");const Ne=new fe,k=new ce(Ne);k.on("state-change",r=>{if(k.isLoading){T.innerHTML=`<div>${n("global.loading_game_data")}</div>`;return}if(k.error){T.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${n("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${k.error}</p>
                    </div>
                </div>
            `;return}ge(T,r,k)});async function Pe(){await oe(),await k.init(),T.innerHTML=`<div>${n("global.initializing")}</div>`,k.showMenu()}Pe();
