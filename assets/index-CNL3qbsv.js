(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const T={hp:100,maxHp:100,power:5};class A{constructor(e,t){this.hp=T.hp,this.maxHp=T.maxHp,this.power=T.power,this.interest=33+Math.floor(Math.random()*50),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]},this.logger=t}modifyInterest(e,t){const s=Math.max(.1,(1e3-this.traits.expertise)/1e3),a=(Math.random()*2-1)*t,r=(e+a)*s,o=this.interest;this.interest=Math.max(0,Math.min(100,this.interest+r)),this.logger.debug(`Interest changed from ${o.toFixed(1)} to ${this.interest.toFixed(1)} (Base: ${e}, Rand: ${a.toFixed(1)}, Total: ${r.toFixed(1)})`)}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}recalculateStats(){let e=T.power,t=T.maxHp;this.inventory.weapon&&(e+=this.inventory.weapon.stats.power||0,t+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(e+=this.inventory.armor.stats.power||0,t+=this.inventory.armor.stats.maxHp||0);const s=t-this.maxHp;this.power=e,this.maxHp=t,this.hp+=Math.max(0,s)}}class U{constructor(){this.entries=[]}log(e,t="INFO"){this.entries.push({message:e,level:t,timestamp:Date.now()}),console.log(`[${t}] ${e}`)}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const G=15,te=99,se=10,q=10,j=["loot_1","loot_2","loot_3","loot_4","loot_5"],ne=12,ae=6,B=300,W=i=>`${i}_${Math.random().toString(36).substr(2,9)}`,re=(i,e)=>Math.floor(Math.random()*(e-i+1))+i,Q=i=>{const e=[...i];for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e},K=(i,e,t)=>{const s=e.filter(o=>i.includes(o.id)),a=[];s.filter(o=>o.cost===null).forEach(o=>{a.push(t(o))});const r=s.filter(o=>o.cost!==null);for(;a.length<ne&&r.length>0;){const o=Math.floor(Math.random()*r.length),c=r[o];a.push(t(c))}return Q(a)},Z=(i,e)=>K(i,e,t=>({...t,instanceId:W(t.id)})),F=(i,e)=>K(i,e,t=>{const s={...t,instanceId:W(t.id)};return s.type==="enemy"&&s.stats.minUnits&&s.stats.maxUnits&&(s.units=re(s.stats.minUnits,s.stats.maxUnits)),s});let V={};async function Y(i){try{const e=await fetch(`/rogue-steward/locales/${i}.json`);if(!e.ok)throw new Error(`Could not load ${i}.json`);V=await e.json()}catch(e){console.warn(`Failed to load ${i} translations:`,e),i!=="en"&&await Y("en")}}function ie(){return navigator.language.split("-")[0]}function n(i,e={}){let s=i.split(".").reduce((a,r)=>a?a[r]:void 0,V);if(!s)return console.warn(`Translation not found for key: ${i}`),i;for(const a in e)s=s.replace(`{${a}}`,String(e[a]));return s}async function oe(){const i=ie();await Y(i)}var O=(i=>(i.WORKSHOP="workshop",i.HAND_SIZE_INCREASE="hand_size_increase",i.CUSTOM_ENCOUNTERS="custom_encounters",i.PARTY_CONSTRAINTS="party_constraints",i.BOSS_FIGHTS="boss_fights",i))(O||{});const J=[{feature:"workshop",runThreshold:2,title:()=>n("unlocks.workshop.title"),description:()=>n("unlocks.workshop.description")},{feature:"hand_size_increase",runThreshold:3,title:()=>n("unlocks.hand_size_increase.title"),description:()=>n("unlocks.hand_size_increase.description")},{feature:"boss_fights",runThreshold:5,title:()=>n("unlocks.boss_fights.title"),description:()=>n("unlocks.boss_fights.description")},{feature:"custom_encounters",runThreshold:8,title:()=>n("unlocks.custom_encounters.title"),description:()=>n("unlocks.custom_encounters.description")},{feature:"party_constraints",runThreshold:12,title:()=>n("unlocks.party_constraints.title"),description:()=>n("unlocks.party_constraints.description")}];class le{constructor(e){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._allRooms=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{this.metaManager.incrementAdventurers();const t={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s=new U,a=new A(t,s),r=j,o=Z(r,this._allItems),c=this._getHandSize(),l=o.slice(0,c),h=o.slice(c),d=["room_1","room_2","room_3","room_4","room_5","room_6"],p=F(d,this._allRooms),f=p.slice(0,c),b=p.slice(c);s.info("--- Starting New Game (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_ROOM",designer:{balancePoints:0},adventurer:a,unlockedDeck:r,availableDeck:h,hand:l,unlockedRoomDeck:d,availableRoomDeck:b,roomHand:f,handSize:c,shopItems:[],offeredLoot:[],offeredRooms:[],feedback:n("game_engine.new_adventurer"),logger:s,run:1,room:1,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]},this._emit("state-change",this.gameState)},this.continueGame=()=>{this.startNewGame()},this.startNewRun=t=>{if(!this.gameState)return;const s=t||this.gameState.run+1;this.metaManager.updateRun(s);const a=this._getHandSize(),r=Z(this.gameState.unlockedDeck,this._allItems),o=r.slice(0,a),c=r.slice(a),l=F(this.gameState.unlockedRoomDeck,this._allRooms),h=l.slice(0,a),d=l.slice(a),p=new A(this.gameState.adventurer.traits,this.gameState.logger);p.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${s} ---`),this.gameState={...this.gameState,adventurer:p,phase:"DESIGNER_CHOOSING_ROOM",availableDeck:c,hand:o,availableRoomDeck:d,roomHand:h,handSize:a,room:1,run:s,feedback:n("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=t=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(a=>t.includes(a.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:a,reason:r}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot),o=this.gameState.adventurer;let c=this.gameState.hand,l=this.gameState.availableDeck;c.forEach(m=>m.justDrafted=!1);let h=c.filter(m=>!t.includes(m.instanceId));const d=this.gameState.handSize-h.length,p=l.slice(0,d);p.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const f=l.slice(d);h.push(...p),a?a.type==="Potion"?o.addPotion(a):o.equip(a):o.interest=Math.max(0,o.interest-10);const b=this.gameState.room+1,v=this.gameState.designer.balancePoints+q;this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:o,feedback:r,availableDeck:f,hand:h,room:b,designer:{balancePoints:v}},this._emit("state-change",this.gameState)},B)},this.runEncounter=t=>{!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_ROOM"||(this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.offeredRooms=t,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.offeredRooms)return;let s=this.gameState.adventurer,a=[];const r=Math.floor(Math.random()*this.gameState.offeredRooms.length),o=this.gameState.offeredRooms[r];switch(this.gameState.logger.info(`--- Encountering Room: ${o.name} ---`),o.type){case"enemy":case"boss":const m={enemyCount:o.units||1,enemyPower:o.stats.attack||5,enemyHp:o.stats.hp||10},u=this._simulateEncounter(s,this.gameState.room,m);s=u.newAdventurer,a=u.feedback;break;case"healing":const g=o.stats.hp||0;s.hp=Math.min(s.maxHp,s.hp+g),a.push(n("game_engine.healing_room",{healing:g})),this.gameState.logger.info(`Adventurer found a healing fountain and recovered ${g} HP.`);break;case"trap":const w=o.stats.attack||0;s.hp-=w,a.push(n("game_engine.trap_room",{damage:w})),this.gameState.logger.info(`Adventurer fell into a trap and lost ${w} HP.`);break}let c=this.gameState.roomHand,l=this.gameState.availableRoomDeck;c.forEach(m=>m.justDrafted=!1);const h=this.gameState.offeredRooms.map(m=>m.instanceId);let d=c.filter(m=>!h.includes(m.instanceId));const p=this.gameState.handSize-d.length,f=l.slice(0,p);f.forEach(m=>{m.draftedRoom=this.gameState.room,m.justDrafted=!0});const b=l.slice(p);d.push(...f);const v=m=>{const u=this.metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.error(`GAME OVER: ${m}`),this.gameState={...this.gameState,adventurer:s,designer:{balancePoints:this.gameState.designer.balancePoints+q},phase:"RUN_OVER",runEnded:{isOver:!0,reason:m},newlyUnlocked:u},this._emit("state-change",this.gameState)};if(s.hp<=0){v(n("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(s.interest<=G){v(n("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}));return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),a.push(n("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_ROOM",adventurer:s,room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+q},feedback:a,encounter:void 0,roomHand:d,availableRoomDeck:b}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:s,feedback:a,encounter:void 0,roomHand:d,availableRoomDeck:b},this._emit("state-change",this.gameState)},B))},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this.metaManager.acls.has(O.WORKSHOP)){this.startNewRun();return}const t=this.gameState.run+1,s=this._allItems.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedDeck.includes(o.id)),a=this._allRooms.filter(o=>o.cost!==null).filter(o=>!this.gameState.unlockedRoomDeck.includes(o.id)),r=[...s,...a];this.gameState={...this.gameState,phase:"SHOP",run:t,room:0,shopItems:Q(r).slice(0,4),runEnded:{isOver:!1,reason:""},feedback:n("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.purchaseItem=t=>{if(!this.gameState)return;const s=this._allItems.find(d=>d.id===t),a=this._allRooms.find(d=>d.id===t),r=s||a;if(!r||r.cost===null||this.gameState.designer.balancePoints<r.cost)return;let o=this.gameState.unlockedDeck,c=this.gameState.unlockedRoomDeck;s?o=[...this.gameState.unlockedDeck,t]:a&&(c=[...this.gameState.unlockedRoomDeck,t]);const l=this.gameState.designer.balancePoints-r.cost,h=this.gameState.shopItems.filter(d=>d.id!==t);this.gameState.logger.info(`Purchased ${r.name}.`),this.gameState={...this.gameState,designer:{balancePoints:l},unlockedDeck:o,unlockedRoomDeck:c,shopItems:h},this._emit("state-change",this.gameState)},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this.metaManager=e}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){const s=this._listeners[e];s&&s.forEach(a=>a(t))}_getAdventurerChoice(e,t){var p,f,b,v,m;const{traits:s,inventory:a}=e;(p=this.gameState)==null||p.logger.debug(`--- Adventurer Decision --- (Offense: ${s.offense}, Risk: ${s.risk})`);const r=((f=a.weapon)==null?void 0:f.stats.power)||0,o=((b=a.armor)==null?void 0:b.stats.maxHp)||0;(v=this.gameState)==null||v.logger.debug(`Current Gear: Weapon Power(${r}), Armor HP(${o})`);const c=u=>{var w,R;let g=(u.rarity==="Uncommon"?2:u.rarity==="Rare"?3:1)*5;switch(u.type){case"Weapon":const $=(u.stats.power||0)-r;if($<=0&&u.id!==((w=a.weapon)==null?void 0:w.id))return-1;g+=$*(s.offense/10),$>0&&(g+=$*(s.expertise/10));const H=u.stats.maxHp||0;H<0&&(g+=H*(100-s.risk)/20);break;case"Armor":const k=(u.stats.maxHp||0)-o;if(k<=0&&u.id!==((R=a.armor)==null?void 0:R.id))return-1;g+=k*(100-s.offense)/10,k>0&&(g+=k*(s.expertise/10));const M=u.stats.power||0;M>0&&(g+=M*(s.offense/15));const D=u.stats.power||0;D<0&&(g+=D*(s.risk/10));break;case"Potion":const E=e.hp/e.maxHp;g+=10*(100-s.risk)/100,E<.7&&(g+=20*(1-E)),g+=5*(s.expertise/100),a.potions.length>=te&&(g*=.1);break}return g},l=t.map(u=>({item:u,score:c(u)})).filter(u=>u.score>0);if(l.sort((u,g)=>g.score-u.score),l.length===0||l[0].score<se)return e.modifyInterest(-15,10),{choice:null,reason:n("game_engine.adventurer_declines_offer")};const h=l[0].item;(m=this.gameState)==null||m.logger.debug(`Adventurer chooses: ${h.name} (Score: ${l[0].score.toFixed(1)})`),l[0].score>60?e.modifyInterest(15,5):l[0].score>30?e.modifyInterest(10,8):e.modifyInterest(5,5);const d=n("game_engine.adventurer_accepts_offer",{itemName:h.name});return{choice:h,reason:d}}_simulateEncounter(e,t,s){var p,f,b,v,m,u,g,w,R,$,H;(p=this.gameState)==null||p.logger.info(`--- Encounter: Room ${t} ---`);const a=[];let r=0,o=0;const c=e.hp;for(let k=0;k<s.enemyCount;k++){(f=this.gameState)==null||f.logger.info(`Adventurer encounters enemy ${k+1}/${s.enemyCount}.`);const M=e.hp/e.maxHp,D=1-e.traits.risk/120;if(M<D&&e.inventory.potions.length>0){const I=e.inventory.potions.shift();if(I){const L=I.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+L),a.push(n("game_engine.adventurer_drinks_potion",{potionName:I.name})),(b=this.gameState)==null||b.logger.info(`Adventurer used ${I.name} and recovered ${L} HP.`)}}let E=s.enemyHp;for(;E>0&&e.hp>0;){const I=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(Math.random()<I){const C=e.power;E-=C,(v=this.gameState)==null||v.logger.debug(`Adventurer hits for ${C} damage.`)}else(m=this.gameState)==null||m.logger.debug("Adventurer misses.");if(E<=0){(u=this.gameState)==null||u.logger.info("Enemy defeated."),o++;break}const L=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(Math.random()<L){const C=(((g=e.inventory.armor)==null?void 0:g.stats.maxHp)||0)/10,N=Math.max(1,s.enemyPower-C);r+=N,e.hp-=N,(w=this.gameState)==null||w.logger.debug(`Enemy hits for ${N} damage.`)}else(R=this.gameState)==null||R.logger.debug("Enemy misses.")}if(e.hp<=0){($=this.gameState)==null||$.logger.warn("Adventurer has been defeated.");break}}let l;const h=c-e.hp,d=h/e.maxHp;return(H=this.gameState)==null||H.logger.debug(`hpLost: ${h}, hpLostRatio: ${d.toFixed(2)}`),d>.7?(l=n("game_engine.too_close_for_comfort"),e.modifyInterest(-15,5)):d>.4?(l=n("game_engine.great_battle"),e.modifyInterest(10,5)):o>3&&e.traits.offense>60?(l=n("game_engine.easy_fight"),e.modifyInterest(0,5)):(l=n("game_engine.worthy_challenge"),e.modifyInterest(-2,3)),a.push(l),e.hp>0&&o===s.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:a,totalDamageTaken:r}}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,t=e-G,s=(Math.random()-.5)*20;return t+s>0?"continue":"retire"}handleEndOfRun(e){if(this.gameState){if(e==="retire"){this.showMenu();return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},t=new U,s=new A(e,t);return{phase:"MENU",designer:{balancePoints:0},adventurer:s,unlockedDeck:j,availableDeck:[],hand:[],unlockedRoomDeck:[],availableRoomDeck:[],roomHand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],offeredRooms:[],feedback:"",logger:t,run:0,room:0,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]}}_getHandSize(){return this.metaManager.acls.has(O.HAND_SIZE_INCREASE)?12:ae}isWorkshopUnlocked(){return this.metaManager.acls.has(O.WORKSHOP)}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(n("global.error_loading_items",{statusText:e.statusText}));this._allItems=await e.json();const t=await fetch("/rogue-steward/game/rooms.json");if(!t.ok)throw new Error(n("global.error_loading_rooms",{statusText:t.statusText}));this._allRooms=await t.json()}catch(e){this.error=e.message||n("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const ce=i=>{if(!i)return n("global.initializing");switch(i.phase){case"AWAITING_ADVENTURER_CHOICE":return n("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return n("main.adventurer_facing_encounter");default:return n("global.loading")}},de=i=>{switch(i.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><choice-panel id="loot-panel"></choice-panel></div>';case"DESIGNER_CHOOSING_ROOM":return'<div class="lg:col-span-3"><choice-panel id="room-panel"></choice-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${ce(i)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>${n("main.unhandled_game_phase",{phase:i.phase})}</div></div>`}},he=(i,e,t)=>{if(!e){i.innerHTML=`<div>${n("global.loading")}</div>`;return}if(e.phase==="MENU"){i.innerHTML="<menu-screen></menu-screen>";return}if(e.phase==="SHOP"){i.innerHTML="<workshop-screen></workshop-screen>";const l=document.querySelector("workshop-screen");l&&(l.items=e.shopItems,l.balancePoints=e.designer.balancePoints);return}const s=e.runEnded.isOver?`<run-ended-screen
                final-bp="${e.designer.balancePoints}"
                reason="${e.runEnded.reason}"
                run="${e.run}"
                ${t.isWorkshopUnlocked()?"workshop-unlocked":""}
            ></run-ended-screen>`:"";if(i.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${s}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <log-panel></log-panel>
                    <game-stats
                        ${t.isWorkshopUnlocked()?`balance-points="${e.designer.balancePoints}"`:""}
                        run="${e.run}"
                        room="${e.room}"
                        deck-size="${e.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${de(e)}
            </div>
        </div>
    `,e.runEnded.isOver){const l=document.querySelector("run-ended-screen");l&&(l.newlyUnlocked=e.newlyUnlocked,l.setDecision(t.getAdventurerEndRunDecision()))}const a=document.querySelector("adventurer-status");a&&(a.metaState=t.metaManager.metaState,a.adventurer=e.adventurer);const r=document.querySelector("#loot-panel");r&&(r.choices=e.hand,r.deckType="item",r.disabled=!1);const o=document.querySelector("#room-panel");o&&(o.choices=e.roomHand,o.deckType="room",o.disabled=!1);const c=document.querySelector("log-panel");c&&(c.logger=e.logger,c.traits=e.adventurer.traits)},z="rogue-steward-meta";class X{constructor(){this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of J)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}incrementAdventurers(){this._metaState.adventurers=(this._metaState.adventurers||0)+1,this.save()}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=localStorage.getItem(z);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return typeof t.adventurers!="number"&&(t.adventurers=1),t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{localStorage.setItem(z,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[],adventurers:0}}}const me=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',pe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',ge=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',fe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',be=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class _e extends HTMLElement{constructor(){super(),this._adventurer=null,this._metaState=null}set adventurer(e){this._adventurer=e,this.render()}set metaState(e){this._metaState=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){var s;if(!this._adventurer){this.innerHTML="";return}const e=((s=this._metaState)==null?void 0:s.adventurers)||1,t=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 pixel-corners shadow-xl">
                <h2 class="text-2xl  font-label mb-4 text-center text-white">${n("adventurer_status.title",{count:e})}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${me()} <span class=" text-lg">${n("global.health")}</span></div>
                                <span class="font-label text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-4">
                                <div class="bg-green-500 h-4 pixel-corners transition-all duration-500 ease-out" style="width: ${t}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${pe()} <span class=" text-lg">${n("adventurer_status.interest")}</span></div>
                                <span class="font-label text-lg">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-4">
                                <div class="bg-brand-interest h-4 pixel-corners transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 pixel-corners">
                        ${ue()}
                        <span class="mr-4">${n("global.power")}</span>
                        <span class="font-label text-2xl  text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg  font-label mb-3 text-center text-white">${n("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${ge()} <span class="ml-2 ">${n("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white ">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${n("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${fe()} <span class="ml-2 ">${n("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white ">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${n("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${be()} <span class="ml-2 ">${n("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white ">${n("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",_e);class xe extends HTMLElement{constructor(){super(),this.addEventListener("submit",e=>{e.preventDefault();const t=this.querySelector("#enemy-count"),s=this.querySelector("#enemy-power"),a=this.querySelector("#enemy-hp"),r={enemyCount:parseInt(t.value,10)||1,enemyPower:parseInt(s.value,10)||10,enemyHp:parseInt(a.value,10)||20};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{encounter:r}}))})}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 shadow-xl pixel-corners animate-fade-in">
                <h3 class="text-xl  text-center mb-2 text-white">${n("battle_panel.title")}</h3>
                <p class="text-center text-brand-text-muted mb-6">${n("battle_panel.description")}</p>
                <form class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="enemy-count" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Count</label>
                        <input id="enemy-count" type="number" step="1" value="1" class="w-full bg-brand-primary p-2 pixel-corners border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-power" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Power</label>
                        <input id="enemy-power" type="number" step="1" value="10" class="w-full bg-brand-primary p-2 pixel-corners border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-hp" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy HP</label>
                        <input id="enemy-hp" type="number" step="1" value="20" class="w-full bg-brand-primary p-2 pixel-corners border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <button type="submit" class="w-full bg-brand-secondary text-white  py-2.5 px-4 pixel-corners transition-all transform hover:scale-105">
                            ${n("battle_panel.run_encounter")}
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("battle-panel",xe);class ve extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 pixel-corners text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",ve);class we extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="unlock-dismiss-button"?this.dismissUnlock():t.id==="continue-run-button"?this.dispatchEvent(new CustomEvent("run-decision",{bubbles:!0,composed:!0,detail:{decision:"continue"}})):t.id==="retire-run-button"&&this.dispatchEvent(new CustomEvent("run-decision",{bubbles:!0,composed:!0,detail:{decision:"retire"}}))})}static get observedAttributes(){return["workshop-unlocked"]}setDecision(e){this.decision=e,this.startFlow()}connectedCallback(){this.render()}startFlow(){this.newlyUnlocked.length>0?this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}renderUnlock(){const e=this.querySelector("#unlock-container");if(!e)return;const t=J.find(s=>s.feature===this.newlyUnlocked[0]);t&&(e.innerHTML=`
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
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let a="",r="";const o=e?"animate-fade-in-up":"",c=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(a=`
                <h3 class="text-2xl text-green-400 ${o}">${n("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.continue_decision")}</p>
            `,r+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 pixel-corners hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${n(c?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(a=`
                <h3 class="text-2xl text-red-400 ${o}">${n("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,r+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 pixel-corners hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${n("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=a,s.innerHTML=r}}customElements.define("run-ended-screen",we);class ye extends HTMLElement{constructor(){super(),this._balancePoints=null,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 pixel-corners shadow-lg flex justify-around text-center">
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
            </div>
        `}}customElements.define("game-stats",ye);class Se extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,s){e==="text"&&(this._text=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 pixel-corners">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",Se);class ke extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-gray-500";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(s.level)}">[${a.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 pixel-corners shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${n("log_panel.title")}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 pixel-corners">
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${n("log_panel.offense")}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${n("log_panel.risk")}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="text-brand-text-muted block">${n("log_panel.expertise")}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",ke);const $e={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},y=(i,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${i}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,Ee=(i,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${i}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `;class Ie extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=$e[this._item.rarity]||"text-gray-400",t="bg-brand-surface border pixel-corners p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let s="";this._isDisabled?s="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?s="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":s="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s}${a}`;let r="";if("stats"in this._item)if("power"in this._item.stats||"maxHp"in this._item.stats)r=`
                    ${this._item.stats.hp?y(n("global.health"),this._item.stats.hp):""}
                    ${this._item.stats.maxHp?y(n("global.max_hp"),this._item.stats.maxHp):""}
                    ${this._item.stats.power?y(n("global.power"),this._item.stats.power):""}
                `;else{const o=this._item;switch(o.type){case"enemy":r=`
                            ${o.stats.attack?y(n("global.attack"),o.stats.attack,!1):""}
                            ${o.stats.hp?y(n("global.health"),o.stats.hp,!1):""}
                            ${o.stats.minUnits&&o.stats.maxUnits?Ee(n("global.units"),o.stats.minUnits,o.stats.maxUnits):""}
                        `;break;case"boss":r=`
                            ${o.stats.attack?y(n("global.attack"),o.stats.attack,!1):""}
                            ${o.stats.hp?y(n("global.health"),o.stats.hp,!1):""}
                        `;break;case"healing":r=`
                            ${o.stats.hp?y(n("global.health"),o.stats.hp):""}
                        `;break;case"trap":r=`
                            ${o.stats.attack?y(n("global.attack"),o.stats.attack,!1):""}
                        `;break}}this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class=" text-2xl ${e}">${this._item.name}</p>
                    <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text text-large">
                    ${r}
                </div>
            </div>
        `}}customElements.define("choice-card",Ie);const P=4;class Re extends HTMLElement{constructor(){super(),this._choices=[],this._deckType="item",this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{if(e.target.id==="present-offer-button")if(this._deckType==="item")this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}));else{const s=this._choices.filter(a=>this._selectedIds.includes(a.instanceId));this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{rooms:s}}))}})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set deckType(e){this._deckType=e,this.render()}get deckType(){return this._deckType}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=this._choices.find(a=>a.instanceId===e);if(!t)return;const s=this._selectedIds.includes(e);if(this._deckType==="room"){const a=t.type==="boss";if(s)this._selectedIds=this._selectedIds.filter(r=>r!==e);else{const o=this._choices.filter(c=>this._selectedIds.includes(c.instanceId)).some(c=>c.type==="boss");a&&this._selectedIds.length===0?this._selectedIds.push(e):!a&&!o&&this._selectedIds.length<3&&this._selectedIds.push(e)}}else{const a=new Map(this._choices.map(r=>[r.instanceId,r.id]));if(s)this._selectedIds=this._selectedIds.filter(r=>r!==e);else{if(this._selectedIds.map(o=>a.get(o)).includes(t.id))return;this._selectedIds.length<P&&this._selectedIds.push(e)}}this.render()}render(){if(!this._choices)return;const e=this._deckType==="room",t=n(e?"choice_panel.title_room":"choice_panel.title"),s=n(e?"choice_panel.begin_encounter":"choice_panel.present_offer");let a=!1,r=s;e?this._choices.filter(h=>this._selectedIds.includes(h.instanceId)).some(h=>h.type==="boss")?(a=this._selectedIds.length===1,r=`${s} (1/1)`):(a=this._selectedIds.length===3,r=`${s} (${this._selectedIds.length}/3)`):(a=this._selectedIds.length>=2&&this._selectedIds.length<=P,r=`${s} (${this._selectedIds.length}/${P})`),this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl text-center mb-4 text-white">${t}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!a||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white py-3 px-8 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${r}
                    </button>
                </div>
            </div>
        `;const o=this.querySelector("#loot-card-container");o&&this._choices.forEach(c=>{const l=document.createElement("choice-card");l.item=c,l.isSelected=this._selectedIds.includes(c.instanceId);let h=this._disabled;if(e){const d=this._choices.filter(f=>this._selectedIds.includes(f.instanceId)),p=d.some(f=>f.type==="boss");l.isSelected?h=!1:(p||c.type==="boss"&&d.length>0||d.length>=3)&&(h=!0)}else{const d=new Map(this._choices.map(b=>[b.instanceId,b.id])),p=this._selectedIds.map(b=>d.get(b));h=!l.isSelected&&p.includes(c.id)||this._disabled}l.isDisabled=h,l.isNewlyDrafted=c.justDrafted&&this._initialRender||!1,o.appendChild(l)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("choice-panel",Re);const S=(i,e,t=!0)=>`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${i}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `,He=(i,e,t)=>`
        <div class="flex justify-between text-sm text-gray-400">
            <span>${i}</span>
            <span class="font-mono">${e}-${t}</span>
        </div>
    `,Te=(i,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[i.rarity]||"text-gray-400";let a="";if("stats"in i)if(i.type==="Weapon"||i.type==="Armor"||i.type==="Potion"){const r=i;a=`
                ${r.stats.hp?S(n("global.health"),r.stats.hp):""}
                ${r.stats.maxHp?S(n("global.max_hp"),r.stats.maxHp):""}
                ${r.stats.power?S(n("global.power"),r.stats.power,(r.stats.power||0)>0):""}
            `}else{const r=i;switch(r.type){case"enemy":a=`
                        ${r.stats.attack?S(n("global.attack"),r.stats.attack,!1):""}
                        ${r.stats.hp?S(n("global.health"),r.stats.hp,!1):""}
                        ${r.stats.minUnits&&r.stats.maxUnits?He(n("global.units"),r.stats.minUnits,r.stats.maxUnits):""}
                    `;break;case"boss":a=`
                        ${r.stats.attack?S(n("global.attack"),r.stats.attack,!1):""}
                        ${r.stats.hp?S(n("global.health"),r.stats.hp,!1):""}
                    `;break;case"healing":a=`
                        ${r.stats.hp?S(n("global.health"),r.stats.hp):""}
                    `;break;case"trap":a=`
                        ${r.stats.attack?S(n("global.attack"),r.stats.attack,!1):""}
                    `;break}}return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${s}">${i.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${i.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${s}">${i.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${a}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${i.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 pixel-corners transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${n("global.buy")} (${i.cost} ${n("global.bp")})
                </button>
            </div>
        </div>
    `};class Me extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:s}})),t.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>Te(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
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
        `}}customElements.define("workshop-screen",Me);class De extends HTMLElement{constructor(){super(),this.metaManager=new X,this.addEventListener("click",e=>{const t=e.target;t.id==="new-game-button"?this.metaManager.metaState.highestRun>0?confirm(n("menu.new_game_confirm"))&&this._dispatch("reset-game"):this._dispatch("start-game"):t.id==="continue-game-button"&&this._dispatch("continue-game")})}connectedCallback(){this.render()}_dispatch(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}render(){const e=this.metaManager.metaState,t=e.highestRun>0;let s="";if(t){const a=e.adventurers||1;s=`
                <p class="text-lg text-gray-400 mt-4">
                    ${n("menu.adventurer_count",{count:a})} | ${n("menu.max_runs",{count:e.highestRun})} | ${n("menu.unlocked_features",{count:e.unlockedFeatures.length})}
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
        `}}customElements.define("menu-screen",De);const x=document.getElementById("app");if(!x)throw new Error("Could not find app element to mount to");const ee=new X,_=new le(ee);_.on("state-change",i=>{if(_.isLoading){x.innerHTML=`<div>${n("global.loading_game_data")}</div>`;return}if(_.error){x.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${n("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${_.error}</p>
                    </div>
                </div>
            `;return}he(x,i,_)});x.addEventListener("present-offer",i=>{const{ids:e}=i.detail;_.presentOffer(e)});x.addEventListener("run-encounter",i=>{const{rooms:e}=i.detail;_.runEncounter(e)});x.addEventListener("run-decision",i=>{const{decision:e}=i.detail;_.handleEndOfRun(e)});x.addEventListener("purchase-item",i=>{const{itemId:e}=i.detail;_.purchaseItem(e)});x.addEventListener("start-game",()=>{_.startNewGame()});x.addEventListener("start-run",()=>{_.startNewRun()});x.addEventListener("continue-game",()=>{_.continueGame()});x.addEventListener("reset-game",()=>{ee.reset(),_.startNewGame()});async function Le(){await oe(),await _.init(),x.innerHTML=`<div>${n("global.initializing")}</div>`,_.showMenu()}Le();
