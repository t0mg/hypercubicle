(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class te{constructor(e){this.seed=e}setSeed(e){this.seed=e}nextFloat(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.nextFloat()*(t-e+1))+e}}const _=new te(Date.now()),L={hp:100,maxHp:100,power:5};class P{constructor(e,t){this.hp=L.hp,this.maxHp=L.maxHp,this.power=L.power,this.interest=33+_.nextInt(0,49),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.activeBuffs=[],this.logger=t}modifyInterest(e,t){const s=Math.max(.1,(1e3-this.traits.expertise)/1e3),a=(_.nextFloat()*2-1)*t,n=(e+a)*s,l=this.interest;this.interest=Math.max(0,Math.min(100,this.interest+n)),this.logger.debug(`Interest changed from ${l.toFixed(1)} to ${this.interest.toFixed(1)} (Base: ${e}, Rand: ${a.toFixed(1)}, Total: ${n.toFixed(1)})`)}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}applyBuff(e){this.activeBuffs.push(e),this.recalculateStats()}updateBuffs(){const e=this.activeBuffs.filter(t=>t.stats.duration!==void 0&&t.stats.duration<=1);this.activeBuffs=this.activeBuffs.map(t=>(t.stats.duration&&(t.stats.duration-=1),t)).filter(t=>t.stats.duration===void 0||t.stats.duration>0),e.length>0&&this.recalculateStats()}recalculateStats(){const e=this.hp/this.maxHp;let t=L.power,s=L.maxHp;this.inventory.weapon&&(t+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(t+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0),this.activeBuffs.forEach(a=>{t+=a.stats.power||0,s+=a.stats.maxHp||0}),this.power=t,this.maxHp=s,this.hp=Math.round(this.maxHp*e)}}class U{constructor(){this.entries=[],this.listeners=[]}on(e){this.listeners.push(e)}log(e,t="INFO",s){const a={message:e,level:t,timestamp:Date.now(),data:s};this.entries.push(a),t!=="DEBUG"&&console.log(`[${t}] ${e}`),this.listeners.forEach(n=>n(a))}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const N=15,se=99,ne=10,q=10,D=32,ae=8,Z=r=>`${r}_${_.nextFloat().toString(36).substr(2,9)}`,ie=(r,e)=>_.nextInt(r,e),z=r=>{const e=[...r];for(let t=e.length-1;t>0;t--){const s=_.nextInt(0,t);[e[t],e[s]]=[e[s],e[t]]}return e},V=(r,e,t,s)=>{const a=e.filter(d=>r.includes(d.id)),n=[],l={Common:.6,Uncommon:.3,Rare:.1},o={Common:0,Uncommon:0,Rare:0},h={Common:0,Uncommon:0,Rare:0};Object.keys(l).forEach(d=>{h[d]=Math.floor(t*l[d])});let m=Object.values(h).reduce((d,u)=>d+u,0);for(;m<t;)h.Common+=1,m+=1;a.filter(d=>d.cost!==null).forEach(d=>{n.push(s(d)),o[d.rarity]+=1}),Object.keys(l).forEach((d,u)=>{const c=a.filter(g=>g.rarity===d);for(;o[d]<h[d]&&c.length!==0;){const g=_.nextInt(0,c.length-1),b=c[g];n.push(s(b)),o[d]+=1}});const p=a.filter(d=>d.rarity==="Common");for(;n.length<t&&p.length>0;){const d=_.nextInt(0,p.length-1),u=p[d];n.push(s(u))}return z(n)},j=(r,e,t)=>V(r,e,t,s=>({...s,instanceId:Z(s.id)})),G=(r,e,t)=>V(r,e,t,a=>{const n={...a,instanceId:Z(a.id)};return n.type==="enemy"&&n.stats.minUnits&&n.stats.maxUnits&&(n.units=ie(n.stats.minUnits,n.stats.maxUnits)),n}),re=r=>r.roomHand.length<3&&!r.roomHand.some(e=>e.type==="boss"),oe=r=>[...new Set(r.hand.map(t=>t.id))].length<2&&r.hand.length>0;let Q={};async function K(r,e){try{Q=await e.loadJson(`locales/${r}.json`)}catch(t){console.warn(`Failed to load ${r} translations:`,t),r!=="en"&&await K("en",e)}}function le(){return typeof navigator<"u"&&navigator.language?navigator.language.split("-")[0]:"en"}function i(r,e={}){let s=r.split(".").reduce((a,n)=>a?a[n]:void 0,Q);if(!s)return console.warn(`Translation not found for key: ${r}`),r;for(const a in e)s=s.replace(`{${a}}`,String(e[a]));return s}async function ce(r){const e=le();await K(e,r)}var y=(r=>(r.WORKSHOP="workshop",r.HAND_SIZE_INCREASE="hand_size_increase",r.ADVENTURER_TRAITS="ADVENTURER_TRAITS",r.BP_MULTIPLIER="BP_MULTIPLIER",r.WORKSHOP_ACCESS="WORKSHOP_ACCESS",r.BP_MULTIPLIER_2="BP_MULTIPLIER_2",r))(y||{});const J=[{feature:"workshop",runThreshold:2,title:()=>i("unlocks.workshop.title"),description:()=>i("unlocks.workshop.description")},{feature:"hand_size_increase",runThreshold:3,title:()=>i("unlocks.hand_size_increase.title"),description:()=>i("unlocks.hand_size_increase.description")},{feature:"ADVENTURER_TRAITS",runThreshold:5,title:()=>i("unlocks.adventurer_traits.title"),description:()=>i("unlocks.adventurer_traits.description")},{feature:"BP_MULTIPLIER",runThreshold:8,title:()=>i("unlocks.bp_multiplier.title"),description:()=>i("unlocks.bp_multiplier.description")},{feature:"WORKSHOP_ACCESS",runThreshold:13,title:()=>i("unlocks.workshop_access.title"),description:()=>i("unlocks.workshop_access.description")},{feature:"BP_MULTIPLIER_2",runThreshold:21,title:()=>i("unlocks.bp_multiplier_2.title"),description:()=>i("unlocks.bp_multiplier_2.description")}];function de(r,e,t){var d,u;const{traits:s,inventory:a}=r;t.debug(`--- Adventurer Decision --- (Offense: ${s.offense}, Risk: ${s.risk})`);const n=((d=a.weapon)==null?void 0:d.stats.power)||0,l=((u=a.armor)==null?void 0:u.stats.maxHp)||0;t.debug(`Current Gear: Weapon Power(${n}), Armor HP(${l})`);const o=c=>{var b,f;let g=(c.rarity==="Uncommon"?2:c.rarity==="Rare"?3:1)*5;switch(c.type){case"Weapon":const x=(c.stats.power||0)-n;if(x<=0&&c.id!==((b=a.weapon)==null?void 0:b.id))return-1;g+=x*(s.offense/10),x>0&&(g+=x*(s.expertise/10));const v=c.stats.maxHp||0;v<0&&(g+=v*(100-s.risk)/20);break;case"Armor":const k=(c.stats.maxHp||0)-l;if(k<=0&&c.id!==((f=a.armor)==null?void 0:f.id))return-1;g+=k*(100-s.offense)/10,k>0&&(g+=k*(s.expertise/10));const E=c.stats.power||0;E>0&&(g+=E*(s.offense/15));const H=c.stats.power||0;H<0&&(g+=H*(s.risk/10));break;case"Potion":const I=r.hp/r.maxHp;g+=10*(100-s.risk)/100,I<.7&&(g+=20*(1-I)),g+=5*(s.expertise/100),a.potions.length>=se&&(g*=.1);break}return g},h=e.map(c=>({item:c,score:o(c)})).filter(c=>c.score>0);if(h.sort((c,g)=>g.score-c.score),h.length===0||h[0].score<ne)return r.modifyInterest(-15,10),{choice:null,reason:i("game_engine.adventurer_declines_offer")};const m=h[0].item;t.debug(`Adventurer chooses: ${m.name} (Score: ${h[0].score.toFixed(1)})`),h[0].score>60?r.modifyInterest(15,5):h[0].score>30?r.modifyInterest(10,8):r.modifyInterest(5,5);const p=i("game_engine.adventurer_accepts_offer",{itemName:m.name});return{choice:m,reason:p}}class he{constructor(e,t){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=s=>{this.metaManager.incrementAdventurers();const a={offense:_.nextInt(10,90),risk:_.nextInt(10,90),expertise:0},n=new U,l=new P(a,n),o=(s==null?void 0:s.items)||this._allItems.filter(f=>f.cost===null).map(f=>f.id),h=j(o,this._allItems,D),m=this._getHandSize(),p=h.slice(0,m),d=h.slice(m),u=(s==null?void 0:s.rooms)||this._allRooms.filter(f=>f.cost===null).map(f=>f.id),c=G(u,this._allRooms,D),g=c.slice(0,m),b=c.slice(m);n.info("--- Starting New Adventurer (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:l,unlockedDeck:o,availableDeck:d,hand:p,unlockedRoomDeck:u,availableRoomDeck:b,roomHand:g,handSize:m,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:i("game_engine.new_adventurer"),logger:n,run:1,room:1,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null},this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this._emit("state-change",this.gameState)},this.continueGame=()=>{this.startNewGame()},this.startNewRun=s=>{if(!this.gameState)return;const a=s||this.gameState.run+1;this.metaManager.updateRun(a);const n=this._getHandSize(),l=j(this.gameState.unlockedDeck,this._allItems,D),o=l.slice(0,n),h=l.slice(n),m=G(this.gameState.unlockedRoomDeck,this._allRooms,D),p=m.slice(0,n),d=m.slice(n),u=new P(this.gameState.adventurer.traits,this.gameState.logger);u.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${a} ---`),this.gameState.logger.debug(`Unlocked features: ${[...this.metaManager.acls].join(", ")}`),this.gameState={...this.gameState,adventurer:u,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:h,hand:o,availableRoomDeck:d,roomHand:p,handSize:n,room:1,run:a,feedback:i("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:"",success:!1,decision:null}},this._emit("state-change",this.gameState)},this.presentOffer=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const a=this.gameState.hand.filter(f=>s.includes(f.instanceId));this.gameState.offeredLoot=a;let n=null,l;const o=this.gameState.adventurer;if(this.gameState.offeredLoot.length===0)o.modifyInterest(-15,5),l=i("game_engine.adventurer_declines_empty_offer");else{const f=de(o,this.gameState.offeredLoot,this.gameState.logger);n=f.choice,l=f.reason}n&&this.gameState.logger.log("Item chosen by adventurer","INFO",{event:"item_chosen",item:n});let h=this.gameState.hand,m=this.gameState.availableDeck;h.forEach(f=>f.justDrafted=!1);let p=h.filter(f=>!s.includes(f.instanceId));const d=this.gameState.handSize-p.length,u=m.slice(0,d);u.forEach(f=>{f.draftedRoom=this.gameState.room,f.justDrafted=!0});const c=m.slice(d);p.push(...u),n?n.type==="Potion"?o.addPotion(n):n.type==="Buff"?o.applyBuff(n):o.equip(n):s.length>0&&(o.interest=Math.max(0,o.interest-10));const g=this.gameState.room+1,b=this.gameState.designer.balancePoints+this._getBpPerRoom();this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:o,feedback:l,availableDeck:c,hand:p,room:g,designer:{balancePoints:b}},this._emit("state-change",this.gameState)},this.runEncounter=s=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM")return;this.gameState.offeredRooms=s;let a=this.gameState.adventurer,n=[];const l=_.nextInt(0,this.gameState.offeredRooms.length-1),o=this.gameState.offeredRooms[l];switch(this.gameState.logger.log(`--- Encountering Room: ${o.name} ---`,"INFO",{event:"room_encountered",room:o}),o.type){case"enemy":case"boss":const b={enemyCount:o.units??1,enemyPower:o.stats.attack||5,enemyHp:o.stats.hp||10},f=this._simulateEncounter(a,this.gameState.room,b);a=f.newAdventurer,n=f.feedback;break;case"healing":const x=o.stats.hp||0;a.modifyInterest(a.hp/a.maxHp<.33?20:10,3),a.hp=Math.min(a.maxHp,a.hp+x),n.push(i("game_engine.healing_room",{name:o.name,healing:x})),this.gameState.logger.info(i("game_engine.healing_room",{name:o.name,healing:x}));break;case"trap":const v=o.stats.attack||0;a.hp-=v,a.modifyInterest(a.hp<0?-25:-15,5),n.push(i("game_engine.trap_room",{name:o.name,damage:v})),this.gameState.logger.info(i("game_engine.trap_room",{name:o.name,damage:v}));break}a.updateBuffs(),this.gameState.designer.balancePoints+=this._getBpPerRoom();let h=this.gameState.roomHand,m=this.gameState.availableRoomDeck;h.forEach(b=>b.justDrafted=!1);const p=this.gameState.offeredRooms.map(b=>b.instanceId);let d=h.filter(b=>!p.includes(b.instanceId));const u=this.gameState.handSize-d.length,c=m.slice(0,u);c.forEach(b=>{b.draftedRoom=this.gameState.room,b.justDrafted=!0});const g=m.slice(u);if(d.push(...c),this.gameState.adventurer=a,a.hp<=0){this._endRun(i("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(a.interest<=N){this._endRun(i("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}));return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),n.push(i("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+this._getBpPerRoom()},feedback:n,encounter:void 0,roomHand:d,availableRoomDeck:g}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",feedback:n,encounter:void 0,roomHand:d,availableRoomDeck:g},this._emit("state-change",this.gameState)},this.forceEndRun=()=>{this.gameState&&(this.gameState.adventurer.interest-=30,this._endRun(i("game_engine.no_more_rooms"),!0))},this.enterWorkshop=()=>{if(!this.gameState)return;if(this.gameState.logger.info("Entering workshop."),!this.metaManager.acls.has(y.WORKSHOP)){this.gameState.logger.info("Workshop not unlocked, starting new run."),this.startNewRun();return}const s=this.gameState.run+1,a=this._allItems.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedDeck.includes(o.id)),n=this._allRooms.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedRoomDeck.includes(o.id)),l=[...a,...n];this.gameState={...this.gameState,phase:"SHOP",shopReturnPhase:this.gameState.phase,run:s,room:0,shopItems:z(l).slice(0,4),runEnded:{isOver:!1,reason:"",success:!1,decision:null},feedback:i("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.exitWorkshop=()=>{this.gameState&&this.startNewRun()},this.purchaseItem=s=>{if(!this.gameState)return;const a=this._allItems.find(c=>c.id===s),n=this._allRooms.find(c=>c.id===s),l=a||n;if(!l||l.cost===null||this.gameState.designer.balancePoints<l.cost)return;let o=this.gameState.unlockedDeck,h=this.gameState.unlockedRoomDeck,m=this.gameState.availableDeck,p=this.gameState.availableRoomDeck;a?(o=[...this.gameState.unlockedDeck,s],this.isWorkshopAccessUnlocked()&&(m=[a,...this.gameState.availableDeck])):n&&(h=[...this.gameState.unlockedRoomDeck,s],this.isWorkshopAccessUnlocked()&&(p=[n,...this.gameState.availableRoomDeck]));const d=this.gameState.designer.balancePoints-l.cost,u=this.gameState.shopItems.filter(c=>c.id!==s);this.gameState.logger.log(`Purchased ${l.name}.`,"INFO",{event:"item_purchased",item:l}),this.gameState={...this.gameState,designer:{balancePoints:d},unlockedDeck:o,unlockedRoomDeck:h,availableDeck:m,availableRoomDeck:p,shopItems:u},this._emit("state-change",this.gameState)},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._getBpPerRoom=()=>this.metaManager.acls.has(y.BP_MULTIPLIER_2)?q*4:this.metaManager.acls.has(y.BP_MULTIPLIER)?q*2:q,this.metaManager=e,this.dataLoader=t}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){const s=this._listeners[e];s&&s.forEach(a=>a(t))}_simulateEncounter(e,t,s){var d,u,c,g,b,f,x,v,k,E,H;(d=this.gameState)==null||d.logger.log(`--- Encounter: Room ${t} ---`,"INFO",{event:"battle_started",encounter:s});const a=[];let n=0,l=0;const o=e.hp;for(let I=0;I<s.enemyCount;I++){(u=this.gameState)==null||u.logger.info(`Adventurer encounters enemy ${I+1}/${s.enemyCount}.`);const X=e.hp/e.maxHp,ee=1-e.traits.risk/120;if(X<ee&&e.inventory.potions.length>0){const R=e.inventory.potions.shift();if(R){const M=R.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+M),a.push(i("game_engine.adventurer_drinks_potion",{potionName:R.name})),(c=this.gameState)==null||c.logger.info(`Adventurer used ${R.name} and recovered ${M} HP.`)}}let O=s.enemyHp;for(;O>0&&e.hp>0;){const R=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(_.nextFloat()<R){const C=e.power;O-=C,(g=this.gameState)==null||g.logger.debug(`Adventurer hits for ${C} damage.`)}else(b=this.gameState)==null||b.logger.debug("Adventurer misses.");if(O<=0){(f=this.gameState)==null||f.logger.info("Enemy defeated."),l++;break}const M=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(_.nextFloat()<M){const C=(((x=e.inventory.armor)==null?void 0:x.stats.maxHp)||0)/10,A=Math.max(1,s.enemyPower-C);n+=A,e.hp-=A,(v=this.gameState)==null||v.logger.debug(`Enemy hits for ${A} damage.`)}else(k=this.gameState)==null||k.logger.debug("Enemy misses.")}if(e.hp<=0){(E=this.gameState)==null||E.logger.warn("Adventurer has been defeated.");break}}let h;const m=o-e.hp,p=m/e.maxHp;return(H=this.gameState)==null||H.logger.debug(`hpLost: ${m}, hpLostRatio: ${p.toFixed(2)}`),p>.7?(h=i("game_engine.too_close_for_comfort"),e.modifyInterest(-15,5)):p>.4?(h=i("game_engine.great_battle"),e.modifyInterest(10,5)):l>3&&e.traits.offense>60?(h=i("game_engine.easy_fight"),e.modifyInterest(0,5)):(h=i("game_engine.worthy_challenge"),e.modifyInterest(-2,3)),a.push(h),e.hp>0&&l===s.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:a,totalDamageTaken:n}}_endRun(e,t=!1){if(!this.gameState)return;const s=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.log(`Run ended with ${this.gameState.designer.balancePoints} BP.`,"INFO",{event:"run_end",bp:this.gameState.designer.balancePoints}),this.gameState.logger.error(`GAME OVER: ${e}`);const a=this._getAdventurerEndRunDecision();this.gameState={...this.gameState,phase:"RUN_OVER",runEnded:{isOver:!0,reason:e,success:t,decision:a},newlyUnlocked:s},this._emit("state-change",this.gameState)}_getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,t=e-N,s=_.nextFloat()*20;return e<=N?"retire":t+s>10?"continue":"retire"}handleEndOfRun(e){if(this.gameState){if(this.gameState.logger.info(`Adventurer decided to ${e}.`),e==="retire"){this.showMenu();return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:_.nextInt(10,90),risk:_.nextInt(10,90),expertise:0},t=new U,s=new P(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:[],availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:"",success:!1,decision:null},newlyUnlocked:[],shopReturnPhase:null}}_getHandSize(){return this.metaManager.acls.has(y.HAND_SIZE_INCREASE)?12:ae}isWorkshopAccessUnlocked(){return this.metaManager.acls.has(y.WORKSHOP_ACCESS)}isWorkshopUnlocked(){return this.metaManager.acls.has(y.WORKSHOP)}async _loadGameData(){try{this._allItems=await this.dataLoader.loadJson("game/items.json"),this._allRooms=await this.dataLoader.loadJson("game/rooms.json")}catch(e){this.error=e.message||i("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const me=r=>{if(!r)return i("global.initializing");switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return i("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return i("main.adventurer_facing_encounter");default:return i("global.loading")}},ue=r=>{const e=document.createElement("loading-indicator");return e.setAttribute("text",me(r)),e},F=(r,e,t)=>{const s=document.createElement("choice-panel");return s.engine=e,t==="item"?(s.choices=r.hand,s.deckType="item",s.offerImpossible=oe(r)):(s.choices=r.roomHand,s.deckType="room",s.roomSelectionImpossible=re(r)),s},pe=(r,e,t)=>{r.innerHTML="";const s=document.createElement("div");if(s.className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center",r.appendChild(s),e.runEnded.isOver){const c=document.createElement("run-ended-screen");c.setAttribute("final-bp",e.designer.balancePoints.toString()),c.setAttribute("reason",e.runEnded.reason),c.setAttribute("run",e.run.toString()),t.isWorkshopUnlocked()&&c.setAttribute("workshop-unlocked",""),c.newlyUnlocked=e.newlyUnlocked,c.engine=t,e.runEnded.decision&&c.setDecision(e.runEnded.decision),s.appendChild(c)}const a=document.createElement("div");a.className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6",s.appendChild(a);const n=document.createElement("div");n.className="lg:col-span-1 space-y-6",a.appendChild(n);const l=document.createElement("game-stats");l.engine=t,t.isWorkshopUnlocked()&&l.setAttribute("balance-points",e.designer.balancePoints.toString()),l.setAttribute("run",e.run.toString()),l.setAttribute("room",e.room.toString()),l.setAttribute("deck-size",e.availableDeck.length.toString()),n.appendChild(l);const o=document.createElement("feedback-panel"),h=Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback;o.setAttribute("message",h),n.appendChild(o);const m=document.createElement("log-panel");m.logger=e.logger,m.traits=e.adventurer.traits,n.appendChild(m);const p=document.createElement("div");p.className="lg:col-span-2 space-y-6",a.appendChild(p);const d=document.createElement("adventurer-status");d.metaState=t.metaManager.metaState,d.adventurer=e.adventurer,p.appendChild(d);const u=document.createElement("div");switch(u.className="lg:col-span-3",a.appendChild(u),e.phase){case"DESIGNER_CHOOSING_LOOT":u.appendChild(F(e,t,"item"));break;case"DESIGNER_CHOOSING_ROOM":u.appendChild(F(e,t,"room"));break;case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":u.appendChild(ue(e));break;default:const c=document.createElement("div");c.textContent=i("main.unhandled_game_phase",{phase:e.phase}),u.appendChild(c);break}},ge=(r,e)=>{r.innerHTML="";const t=document.createElement("menu-screen");t.engine=e,t.metaManager=e.metaManager,r.appendChild(t)},fe=(r,e,t)=>{r.innerHTML="";const s=document.createElement("workshop-screen");s.items=e.shopItems,s.balancePoints=e.designer.balancePoints,s.engine=t,r.appendChild(s)},be=(r,e,t)=>{if(!e){r.innerHTML=`<div>${i("global.loading")}</div>`;return}switch(e.phase){case"MENU":ge(r,t);break;case"SHOP":fe(r,e,t);break;default:pe(r,e,t);break}},W="rogue-steward-meta";class _e{constructor(e){this.storage=e,this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of J)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=this.storage.getItem(W);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{this.storage.setItem(W,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}class xe{getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}}class ve{async loadJson(e){const t=await fetch(e);if(!t.ok)throw new Error(`Could not load ${e}`);return t.json()}}const we=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Se=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',ye=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',ke=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',$e=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Ie=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>',Re=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class Ee extends HTMLElement{constructor(){super(),this._adventurer=null,this._metaState=null}set adventurer(e){this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){var a,n;if(!this._adventurer){this.innerHTML="";return}const e=((a=this._metaState)==null?void 0:a.adventurers)||1,t=this._adventurer.hp/this._adventurer.maxHp*100,s=(n=this._metaState)==null?void 0:n.unlockedFeatures.includes(y.ADVENTURER_TRAITS);this.innerHTML=`
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 class="text-xl font-label mb-2 text-center text-white">${i("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${we()} <span>${i("global.health")}</span></div>
                                <span class="font-label text-sm">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${t}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${ye()} <span>${i("adventurer_status.interest")}</span></div>
                                <span class="font-label text-sm">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-brand-interest h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners">
                        ${Se()}
                        <span class="mr-2">${i("global.power")}</span>
                        <span class="font-label text-lg text-white">${this._adventurer.power}</span>
                    </div>
                </div>

                ${s?`
                <div class="border-t border-gray-700 my-2"></div>
                <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                    <div>
                        <span class="text-brand-text-muted block">${i("log_panel.offense")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.offense}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${i("log_panel.risk")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.risk}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${i("log_panel.expertise")}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.expertise}</span>
                    </div>
                </div>`:""}

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${i("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${ke()} <span class="ml-1">${i("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${i("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${i("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${$e()} <span class="ml-1">${i("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${i("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${i("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Re()} <span class="ml-1">${i("adventurer_status.buffs")}</span></div>
                        ${this._adventurer.activeBuffs.length>0?this._adventurer.activeBuffs.map(l=>`
                            <div>
                                <p class="text-white text-sm">${l.name} (${i("global.duration")}: ${l.stats.duration})</p>
                                <p class="text-xs text-brand-text-muted">${Object.entries(l.stats).filter(([o])=>o!=="duration").map(([o,h])=>`${i(`global.${o}`)}: ${h}`).join(", ")}</p>
                            </div>
                        `).join(""):`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${Ie()} <span class="ml-1">${i("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white text-sm">${i("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",Ee);class He extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",He);class Le extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.engine=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="unlock-dismiss-button"?this.dismissUnlock():t.id==="continue-run-button"&&this.engine?this.engine.handleEndOfRun("continue"):t.id==="retire-run-button"&&this.engine&&this.engine.handleEndOfRun("retire")})}static get observedAttributes(){return["workshop-unlocked"]}setDecision(e){this.decision=e,this.startFlow()}connectedCallback(){this.render()}startFlow(){this.newlyUnlocked.length>0?this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}renderUnlock(){const e=this.querySelector("#unlock-container");if(!e)return;const t=J.find(s=>s.feature===this.newlyUnlocked[0]);t&&(e.innerHTML=`
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-3/4">
                    <h2 class="text-4xl font-title text-brand-secondary mb-3">${i("unlocks.title")}</h2>
                    <h3 class="font-label text-white">${t.title()}</h3>
                    <p class="text-brand-text mb-6">${t.description()}</p>
                    <button id="unlock-dismiss-button" class="bg-brand-primary text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors">
                        ${i("global.continue")}
                    </button>
                </div>
            </div>
        `)}dismissUnlock(){const e=this.querySelector("#unlock-container");e&&(e.innerHTML=""),this.state="unlock-revealed",this.revealDecision()}revealDecision(){this.state==="unlock-revealed"&&(this.state="decision-revealing",setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3))}render(){this.getAttribute("final-bp");const e=this.getAttribute("reason")||i("run_ended_screen.default_reason");this.innerHTML=`
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
                    <h2 class="text-4xl font-title text-brand-secondary mb-2">${i("run_ended_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${e}</p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${i("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let a="",n="";const l=e?"animate-fade-in-up":"",o=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(a=`
                <h3 class="text-2xl text-green-400 ${l}">${i("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${l}" style="animation-delay: 0.5s;">${i("run_ended_screen.continue_decision")}</p>
            `,n+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${l}"
                    style="animation-delay: 1.2s;"
                >
                    ${i(o?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(a=`
                <h3 class="text-2xl text-red-400 ${l}">${i("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${l}" style="animation-delay: 0.5s;">${i("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,n+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${l}"
                    style="animation-delay: 1s;"
                >
                    ${i("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=a,s.innerHTML=n}}customElements.define("run-ended-screen",Le);class Te extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){var e,t;this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around items-center text-center">
                ${this._balancePoints!==null?`
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.bp")}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
                `:""}
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.run")}</span>
                    <p class="text-2xl  text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.room")}</span>
                    <p class="text-2xl  text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.deck")}</span>
                    <p class="text-2xl  text-white">${this._deckSize}</p>
                </div>
                ${(e=this.engine)!=null&&e.isWorkshopAccessUnlocked()?`
                <div>
                    <button id="enter-workshop-btn" class="bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105">
                        ${i("global.workshop")}
                    </button>
                </div>
                `:""}
            </div>
        `,(t=this.querySelector("#enter-workshop-btn"))==null||t.addEventListener("click",()=>{var s;(s=this.engine)==null||s.enterWorkshop()})}}customElements.define("game-stats",Te);class Me extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,s){e==="text"&&(this._text=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",Me);class Ce extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-blue-400";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(s.level)}">[${a.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${i("log_panel.title")}</h4>
                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",Ce);const De={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},w=(r,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `;class Oe extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=De[this._item.rarity]||"text-gray-400",t="bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let s="";this._isDisabled?s="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?s="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":s="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s}${a}`;let n=this._item.name,l="";if("stats"in this._item)if("power"in this._item.stats||"maxHp"in this._item.stats)l=`
          ${this._item.stats.hp?w(i("global.health"),this._item.stats.hp):""}
          ${this._item.stats.maxHp?w(i("global.max_hp"),this._item.stats.maxHp):""}
          ${this._item.stats.power?w(i("global.power"),this._item.stats.power):""}
        `;else{const o=this._item;switch(o.type){case"enemy":l=`
              ${o.stats.attack?w(i("global.attack"),o.stats.attack,!1):""}
              ${o.stats.hp?w(i("global.health"),o.stats.hp,!1):""}
            `,o.units>1&&(n=i("choice_panel.multiple_enemies_title",{name:o.name,count:o.units}));break;case"boss":l=`
              ${o.stats.attack?w(i("global.attack"),o.stats.attack,!1):""}
              ${o.stats.hp?w(i("global.health"),o.stats.hp,!1):""}
            `;break;case"healing":l=`
              ${o.stats.hp?w(i("global.health"),o.stats.hp):""}
            `;break;case"trap":l=`
              ${o.stats.attack?w(i("global.attack"),o.stats.attack,!1):""}
            `;break}}this.innerHTML=`
      <div>
        <div class="flex justify-between items-baseline">
          <p class=" text-2xl ${e}">${n}</p>
          <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
        </div>
        <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
        <div class="border-t border-gray-700 my-2"></div>
        <div class="space-y-1 text-brand-text text-large">
          ${l}
        </div>
      </div>
    `}}customElements.define("choice-card",Oe);const B=4;class Ae extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this.engine=null,this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this._offerImpossible=!1,this._roomSelectionImpossible=!1,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button"&&this.engine)if(this._deckType==="item")this.engine.presentOffer(this._selectedIds);else if(this._roomSelectionImpossible)this.engine.forceEndRun();else{const s=this._choices.filter(a=>this._selectedIds.includes(a.instanceId));this.engine.runEncounter(s)}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}set offerImpossible(e){this._offerImpossible=e,this.render()}get offerImpossible(){return this._offerImpossible}set roomSelectionImpossible(e){this._roomSelectionImpossible=e,this.render()}get roomSelectionImpossible(){return this._roomSelectionImpossible}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(a=>a.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const a=t.type==="boss";if(s)this._selectedIds=this._selectedIds.filter(n=>n!==e);else{const l=this._choices.filter(o=>this._selectedIds.includes(o.instanceId)).some(o=>o.type==="boss");a&&this._selectedIds.length===0?this._selectedIds.push(e):!a&&!l&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=new Map(this._choices.map(n=>[n.instanceId,n.id]));if(s)this._selectedIds=this._selectedIds.filter(n=>n!==e);else{if(this._selectedIds.map(l=>a.get(l)).includes(t.id))return;this._selectedIds.length<B&&this._selectedIds.push(e)}}this.render()}render(){if(!this._choices)return;const e=this._deckType==="room",t=i(e?"choice_panel.title_room":"choice_panel.title");let s=i(e?"choice_panel.begin_encounter":"choice_panel.present_offer");this._offerImpossible?s=i("choice_panel.continue_without_loot"):this._roomSelectionImpossible&&(s=i("choice_panel.roll_credits"));let a=!1,n=s;this._offerImpossible||this._roomSelectionImpossible?a=!0:e?this._choices.filter(m=>this._selectedIds.includes(m.instanceId)).some(m=>m.type==="boss")?(a=this._selectedIds.length===1,n=`${s} (1/1)`):(a=this._selectedIds.length===3,n=`${s} (${this._selectedIds.length}/3)`):(a=this._selectedIds.length>=2&&this._selectedIds.length<=B,n=`${s} (${this._selectedIds.length}/${B})`),this.innerHTML=`
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
                        ${n}
                    </button>
                </div>
            </div>
        `;const l=this.querySelector("#loot-card-container");l&&this._choices.forEach(o=>{const h=document.createElement("choice-card");h.item=o,h.isSelected=this._selectedIds.includes(o.instanceId);let m=this._disabled;if(this._offerImpossible)m=!0;else if(e){const p=this._choices.filter(u=>this._selectedIds.includes(u.instanceId)),d=p.some(u=>u.type==="boss");h.isSelected?m=!1:(d||o.type==="boss"&&p.length>0||p.length>=3)&&(m=!0)}else{const p=new Map(this._choices.map(c=>[c.instanceId,c.id])),d=this._selectedIds.map(c=>p.get(c));m=!h.isSelected&&d.includes(o.id)||this._disabled}h.isDisabled=m,h.isNewlyDrafted=o.justDrafted&&this._initialRender||!1,l.appendChild(h)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Ae);const S=(r,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,Pe=(r,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${r}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,Ne=(r,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";let a="";if("stats"in r)if(r.type==="Weapon"||r.type==="Armor"||r.type==="Potion"){const n=r;a=`
                ${n.stats.hp?S(i("global.health"),n.stats.hp):""}
                ${n.stats.maxHp?S(i("global.max_hp"),n.stats.maxHp):""}
                ${n.stats.power?S(i("global.power"),n.stats.power,(n.stats.power||0)>0):""}
            `}else{const n=r;switch(n.type){case"enemy":a=`
                        ${n.stats.attack?S(i("global.attack"),n.stats.attack,!1):""}
                        ${n.stats.hp?S(i("global.health"),n.stats.hp,!1):""}
                        ${n.stats.minUnits&&n.stats.maxUnits?Pe(i("global.units"),n.stats.minUnits,n.stats.maxUnits):""}
                    `;break;case"boss":a=`
                        ${n.stats.attack?S(i("global.attack"),n.stats.attack,!1):""}
                        ${n.stats.hp?S(i("global.health"),n.stats.hp,!1):""}
                    `;break;case"healing":a=`
                        ${n.stats.hp?S(i("global.health"),n.stats.hp):""}
                    `;break;case"trap":a=`
                        ${n.stats.attack?S(i("global.attack"),n.stats.attack,!1):""}
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
                    ${i("global.buy")} (${r.cost} ${i("global.bp")})
                </button>
            </div>
        </div>
    `};class qe extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.engine=null,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.engine&&this.engine.purchaseItem(s),t.id==="start-run-button"&&this.engine&&this.engine.startNewRun()})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>Ne(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-label text-white">${i("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${i("workshop.description")}</p>
                    <p class="mt-4 text-2xl">
                        ${i("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand--muted col-span-full">${i("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 pixel-corners text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${i("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",qe);class Be extends HTMLElement{constructor(){super(),this.engine=null,this.metaManager=null,this.addEventListener("click",e=>{if(!this.engine||!this.metaManager)return;const t=e.target;t.id==="new-game-button"?this.metaManager.metaState.highestRun>0?confirm(i("menu.new_game_confirm"))&&(this.metaManager.reset(),this.engine.startNewGame()):this.engine.startNewGame():t.id==="continue-game-button"&&this.engine.continueGame()})}connectedCallback(){this.render()}render(){if(!this.metaManager)return;const e=this.metaManager.metaState,t=e.highestRun>0;let s="";if(t){const a=e.adventurers||1;s=`
                <p class="text-lg text-gray-400 mt-4">
                    ${i("menu.max_runs",{count:e.highestRun})} | ${i("menu.unlocked_features",{count:e.unlockedFeatures.length})} | ${i("menu.adventurer_count",{count:a})}
                </p>
            `}this.innerHTML=`
            <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${i("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${i("game_subtitle")}</p>
                ${s}
                <div class="mt-8 space-y-4">
                        ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                            ${i("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white  py-3 px-6 pixel-corners text-xl min-w-[250px] transition-colors">
                        ${i("menu.new_game")}
                    </button>
                </div>
                <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                    v0.0.0 (build 55)
                </div>
            </div>
        `}}customElements.define("menu-screen",Be);const T=document.getElementById("app");if(!T)throw new Error("Could not find app element to mount to");const Ue=new xe,je=new _e(Ue),Y=new ve,$=new he(je,Y);$.on("state-change",r=>{if($.isLoading){T.innerHTML=`<div>${i("global.loading_game_data")}</div>`;return}if($.error){T.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${i("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${$.error}</p>
                    </div>
                </div>
            `;return}be(T,r,$)});async function Ge(){await ce(Y),await $.init(),T.innerHTML=`<div>${i("global.initializing")}</div>`,$.showMenu()}Ge();
