(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const I={hp:100,maxHp:100,power:5};class R{constructor(e){this.hp=I.hp,this.maxHp=I.maxHp,this.power=I.power,this.interest=33+Math.floor(Math.random()*50),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]}}modifyInterest(e,t){const s=Math.max(.1,(1e3-this.traits.expertise)/1e3),a=(Math.random()*2-1)*t,i=(e+a)*s;this.interest=Math.max(0,Math.min(100,this.interest+i))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}recalculateStats(){let e=I.power,t=I.maxHp;this.inventory.weapon&&(e+=this.inventory.weapon.stats.power||0,t+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(e+=this.inventory.armor.stats.power||0,t+=this.inventory.armor.stats.maxHp||0);const s=t-this.maxHp;this.power=e,this.maxHp=t,this.hp+=Math.max(0,s)}}class P{constructor(){this.entries=[]}log(e,t="INFO"){this.entries.push({message:e,level:t,timestamp:Date.now()}),console.log(`[${t}] ${e}`)}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const U=15,Y=3,J={Common:1,Uncommon:2,Rare:3},X=10,N=10,G=["loot_1","loot_2","loot_3","loot_4","loot_5"],ee=32;let te=9;const F=300,Z=r=>[...r].sort(()=>Math.random()-.5),B=(r,e)=>{let t=0;const s=new Map(e.map(h=>[h.id,h])),a=r.map(h=>s.get(h)).filter(Boolean),i=h=>(t++,{...h,instanceId:`${h.id}-${t}`}),o=a.filter(h=>h.cost===null),l=a.filter(h=>h.cost!==null);let d=[];if(o.length>0)for(const h of o)d.push(i(h),i(h),i(h),i(h));d.push(...l.map(i));let m=0;for(;d.length<ee&&o.length>0;)d.push(i(o[m%o.length])),m++;return Z(d)};let z={};async function W(r){try{const e=await fetch(`/rogue-steward/locales/${r}.json`);if(!e.ok)throw new Error(`Could not load ${r}.json`);z=await e.json()}catch(e){console.warn(`Failed to load ${r} translations:`,e),r!=="en"&&await W("en")}}function se(){return navigator.language.split("-")[0]}function n(r,e={}){let s=r.split(".").reduce((a,i)=>a?a[i]:void 0,z);if(!s)return console.warn(`Translation not found for key: ${r}`),r;for(const a in e)s=s.replace(`{${a}}`,String(e[a]));return s}async function ne(){const r=se();await W(r)}var M=(r=>(r.WORKSHOP="workshop",r.HAND_SIZE_INCREASE="hand_size_increase",r.CUSTOM_ENCOUNTERS="custom_encounters",r.PARTY_CONSTRAINTS="party_constraints",r.BOSS_FIGHTS="boss_fights",r))(M||{});const Q=[{feature:"workshop",runThreshold:2,title:()=>n("unlocks.workshop.title"),description:()=>n("unlocks.workshop.description")},{feature:"hand_size_increase",runThreshold:3,title:()=>n("unlocks.hand_size_increase.title"),description:()=>n("unlocks.hand_size_increase.description")},{feature:"boss_fights",runThreshold:5,title:()=>n("unlocks.boss_fights.title"),description:()=>n("unlocks.boss_fights.description")},{feature:"custom_encounters",runThreshold:8,title:()=>n("unlocks.custom_encounters.title"),description:()=>n("unlocks.custom_encounters.description")},{feature:"party_constraints",runThreshold:12,title:()=>n("unlocks.party_constraints.title"),description:()=>n("unlocks.party_constraints.description")}];class ae{constructor(e){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{const t={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s=new R(t),a=G,i=B(a,this._allItems),o=this._getHandSize(),l=i.slice(0,o),d=i.slice(o),m=new P;m.info("--- Starting New Game (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_DIFFICULTY",designer:{balancePoints:0},adventurer:s,unlockedDeck:a,availableDeck:d,hand:l,handSize:o,shopItems:[],offeredLoot:[],feedback:n("game_engine.new_adventurer"),logger:m,run:1,room:1,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]},this._emit("state-change",this.gameState)},this.continueGame=()=>{!this.gameState||!this._metaManager.metaState.highestRun||this.startNewRun(this._metaManager.metaState.highestRun)},this.startNewRun=t=>{if(!this.gameState)return;const s=t||this.gameState.run+1;this._metaManager.updateRun(s);const a=this._getHandSize(),i=B(this.gameState.unlockedDeck,this._allItems),o=i.slice(0,a),l=i.slice(a),d=new R(this.gameState.adventurer.traits);d.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${s} ---`),this.gameState={...this.gameState,adventurer:d,phase:"DESIGNER_CHOOSING_DIFFICULTY",availableDeck:l,hand:o,handSize:a,room:1,run:s,feedback:n("game_engine.adventurer_returns"),runEnded:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=t=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(a=>t.includes(a.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:a,reason:i}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot),o=this.gameState.adventurer;let l=this.gameState.hand,d=this.gameState.availableDeck;l.forEach(c=>c.justDrafted=!1);let m=l.filter(c=>!t.includes(c.instanceId));const h=this.gameState.handSize-m.length,f=d.slice(0,h);f.forEach(c=>{c.draftedRoom=this.gameState.room,c.justDrafted=!0});const v=d.slice(h);m.push(...f),a?a.type==="Potion"?o.addPotion(a):o.equip(a):o.interest=Math.max(0,o.interest-10);const _=this.gameState.room+1,x=this.gameState.designer.balancePoints+N;this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:o,feedback:i,availableDeck:v,hand:m,room:_,designer:{balancePoints:x}},this._emit("state-change",this.gameState)},F)},this.runEncounter=t=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_DIFFICULTY")return;let s={...t},a=!1;if(this.gameState.room>0&&this.gameState.room%5===0){a=!0;const i=Math.max(t.enemyPower,20+this.gameState.room),o=Math.max(t.enemyHp,50+this.gameState.room*5);s={enemyCount:1,enemyPower:i,enemyHp:o}}this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.encounter=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.encounter)return;a&&this.gameState.logger.info("--- BOSS FIGHT ---");const{newAdventurer:i,feedback:o}=this._simulateEncounter(this.gameState.adventurer,this.gameState.room,this.gameState.encounter),l=d=>{const m=this._metaManager.checkForUnlocks(this.gameState.run);this.gameState.logger.error(`GAME OVER: ${d}`),this.gameState={...this.gameState,adventurer:i,designer:{balancePoints:this.gameState.designer.balancePoints+N},phase:"RUN_OVER",runEnded:{isOver:!0,reason:d},newlyUnlocked:m},this._emit("state-change",this.gameState)};if(i.hp<=0){l(n("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run}));return}if(i.interest<=U){l(n("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run}));return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),o.push(n("game_engine.empty_hand")),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:i,room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+N},feedback:o,encounter:void 0}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:i,feedback:o,encounter:void 0},this._emit("state-change",this.gameState)},F)},this.enterWorkshop=()=>{if(!this.gameState)return;if(!this._metaManager.acls.has(M.WORKSHOP)){this.startNewRun();return}const t=this.gameState.run+1,s=this._allItems.filter(a=>a.cost!==null).filter(a=>!this.gameState.unlockedDeck.includes(a.id)).filter(a=>t>=a.minRun);this.gameState={...this.gameState,phase:"SHOP",run:t,room:0,shopItems:Z(s).slice(0,4),runEnded:{isOver:!1,reason:""},feedback:n("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.purchaseItem=t=>{if(!this.gameState)return;const s=this._allItems.find(l=>l.id===t);if(!s||s.cost===null||this.gameState.designer.balancePoints<s.cost)return;const a=[...this.gameState.unlockedDeck,t],i=this.gameState.designer.balancePoints-s.cost,o=this.gameState.shopItems.filter(l=>l.id!==t);this.gameState.logger.info(`Purchased ${s.name}.`),this.gameState={...this.gameState,designer:{balancePoints:i},unlockedDeck:a,shopItems:o},this._emit("state-change",this.gameState)},this.showMenu=()=>{this.gameState={...this.gameState||this._getInitialGameState(),phase:"MENU"},this._emit("state-change",this.gameState)},this._metaManager=e}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}_emit(e,t){const s=this._listeners[e];s&&s.forEach(a=>a(t))}_getAdventurerChoice(e,t){var f,v,_,x;const{traits:s,inventory:a}=e;(f=this.gameState)==null||f.logger.debug(`--- Adventurer Decision --- (Offense: ${s.offense}, Risk: ${s.risk})`);const i=((v=a.weapon)==null?void 0:v.stats.power)||0,o=((_=a.armor)==null?void 0:_.stats.maxHp)||0;(x=this.gameState)==null||x.logger.debug(`Current Gear: Weapon Power(${i}), Armor HP(${o})`);const l=c=>{var k,E;let u=(J[c.rarity]||1)*5;switch(c.type){case"Weapon":const w=(c.stats.power||0)-i;if(w<=0&&c.id!==((k=a.weapon)==null?void 0:k.id))return-1;u+=w*(s.offense/10),w>0&&(u+=w*(s.expertise/10));const $=c.stats.maxHp||0;$<0&&(u+=$*(100-s.risk)/20);break;case"Armor":const b=(c.stats.maxHp||0)-o;if(b<=0&&c.id!==((E=a.armor)==null?void 0:E.id))return-1;u+=b*(100-s.offense)/10,b>0&&(u+=b*(s.expertise/10));const H=c.stats.power||0;H>0&&(u+=H*(s.offense/15));const T=c.stats.power||0;T<0&&(u+=T*(s.risk/10));break;case"Potion":const y=e.hp/e.maxHp;u+=10*(100-s.risk)/100,y<.7&&(u+=20*(1-y)),u+=5*(s.expertise/100),a.potions.length>=Y&&(u*=.1);break}return u+Math.random()},d=t.map(c=>({item:c,score:l(c)})).filter(c=>c.score>0);if(d.sort((c,u)=>u.score-c.score),d.length===0||d[0].score<X)return{choice:null,reason:n("game_engine.adventurer_declines_offer")};const m=d[0].item,h=n("game_engine.adventurer_accepts_offer",{itemName:m.name});return{choice:m,reason:h}}_simulateEncounter(e,t,s){var f,v,_,x,c,u,k,E,w,$;(f=this.gameState)==null||f.logger.info(`--- Encounter: Room ${t} ---`);const a=[];let i=0,o=0;const l=e.hp;for(let b=0;b<s.enemyCount;b++){(v=this.gameState)==null||v.logger.info(`Adventurer encounters enemy ${b+1}/${s.enemyCount}.`);const H=e.hp/e.maxHp,T=1-e.traits.risk/120;if(H<T&&e.inventory.potions.length>0){const S=e.inventory.potions.shift();if(S){const C=S.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+C),a.push(n("game_engine.adventurer_drinks_potion",{potionName:S.name})),(_=this.gameState)==null||_.logger.info(`Adventurer used ${S.name} and recovered ${C} HP.`)}}let y=s.enemyHp;for(;y>0&&e.hp>0;){const S=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(Math.random()<S){const L=e.power;y-=L,(x=this.gameState)==null||x.logger.debug(`Adventurer hits for ${L} damage.`)}else(c=this.gameState)==null||c.logger.debug("Adventurer misses.");if(y<=0){(u=this.gameState)==null||u.logger.info("Enemy defeated."),o++;break}const C=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(Math.random()<C){const L=(((k=e.inventory.armor)==null?void 0:k.stats.maxHp)||0)/10,D=Math.max(1,s.enemyPower-L);i+=D,e.hp-=D,(E=this.gameState)==null||E.logger.debug(`Enemy hits for ${D} damage.`)}else(w=this.gameState)==null||w.logger.debug("Enemy misses.")}if(e.hp<=0){($=this.gameState)==null||$.logger.warn("Adventurer has been defeated.");break}}let d;const h=(l-e.hp)/e.maxHp;return h>.7?(d=n("game_engine.too_close_for_comfort"),e.modifyInterest(-15,5)):h>.4?(d=n("game_engine.great_battle"),e.modifyInterest(10,5)):o>3&&e.traits.offense>60?(d=n("game_engine.easy_fight"),e.modifyInterest(5,5)):(d=n("game_engine.worthy_challenge"),e.modifyInterest(-2,3)),a.push(d),e.hp>0&&o===s.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:a,totalDamageTaken:i}}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,t=e-U,s=(Math.random()-.5)*20;return t+s>0?"continue":"retire"}handleEndOfRun(e){if(this.gameState){if(e==="retire"){this.showMenu();return}this.enterWorkshop()}}_getInitialGameState(){const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},t=new R(e);return{phase:"MENU",designer:{balancePoints:0},adventurer:t,unlockedDeck:G,availableDeck:[],hand:[],handSize:this._getHandSize(),shopItems:[],offeredLoot:[],feedback:"",logger:new P,run:0,room:0,runEnded:{isOver:!1,reason:""},newlyUnlocked:[]}}_getHandSize(){return this._metaManager.acls.has(M.HAND_SIZE_INCREASE)?12:te}isWorkshopUnlocked(){return this._metaManager.acls.has(M.WORKSHOP)}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(n("global.error_loading_items",{statusText:e.statusText}));this._allItems=await e.json()}catch(e){this.error=e.message||n("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}const re=r=>{if(!r)return n("global.initializing");switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return n("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return n("main.adventurer_facing_encounter");default:return n("global.loading")}},ie=r=>{switch(r.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>';case"DESIGNER_CHOOSING_DIFFICULTY":return'<div class="lg:col-span-3"><battle-panel></battle-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${re(r)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>${n("main.unhandled_game_phase",{phase:r.phase})}</div></div>`}},oe=(r,e,t)=>{if(!e){r.innerHTML=`<div>${n("global.loading")}</div>`;return}if(e.phase==="MENU"){r.innerHTML="<menu-screen></menu-screen>";return}if(e.phase==="SHOP"){r.innerHTML="<workshop-screen></workshop-screen>";const l=document.querySelector("workshop-screen");l&&(l.items=e.shopItems,l.balancePoints=e.designer.balancePoints);return}const s=e.runEnded.isOver?`<run-ended-screen
                final-bp="${e.designer.balancePoints}"
                reason="${e.runEnded.reason}"
                run="${e.run}"
                ${t.isWorkshopUnlocked()?"workshop-unlocked":""}
            ></run-ended-screen>`:"";if(r.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${s}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <log-panel></log-panel>
                    <game-stats
                        balance-points="${e.designer.balancePoints}"
                        run="${e.run}"
                        room="${e.room}"
                        deck-size="${e.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${Array.isArray(e.feedback)?e.feedback.join(" "):e.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${ie(e)}
            </div>
        </div>
    `,e.runEnded.isOver){const l=document.querySelector("run-ended-screen");l&&(l.newlyUnlocked=e.newlyUnlocked,l.setDecision(t.getAdventurerEndRunDecision()))}const a=document.querySelector("adventurer-status");a&&(a.adventurer=e.adventurer);const i=document.querySelector("loot-choice-panel");i&&(i.choices=e.hand,i.disabled=!1);const o=document.querySelector("log-panel");o&&(o.logger=e.logger,o.traits=e.adventurer.traits)},j="rogue-steward-meta";class K{constructor(){this._metaState=this._load()}get metaState(){return this._metaState}get acls(){return new Set(this._metaState.unlockedFeatures)}checkForUnlocks(e){const t=[];for(const s of Q)e>=s.runThreshold&&!this._metaState.unlockedFeatures.includes(s.feature)&&(this._metaState.unlockedFeatures.push(s.feature),t.push(s.feature));return t.length>0&&this.save(),t}updateRun(e){e>this._metaState.highestRun&&(this._metaState.highestRun=e,this.save())}_load(){try{const e=localStorage.getItem(j);if(e){const t=JSON.parse(e);if(typeof t.highestRun=="number"&&Array.isArray(t.unlockedFeatures))return t}}catch(e){console.error("Failed to load meta state:",e)}return this._defaultState()}save(){try{localStorage.setItem(j,JSON.stringify(this._metaState))}catch(e){console.error("Failed to save meta state:",e)}}reset(){this._metaState=this._defaultState(),this.save()}_defaultState(){return{highestRun:0,unlockedFeatures:[]}}}const le=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',de=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',ce=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',he=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',ue=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',me=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class pe extends HTMLElement{constructor(){super(),this._adventurer=null}set adventurer(e){this._adventurer=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="";return}const e=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl  font-label mb-4 text-center text-white">${n("adventurer_status.title")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${le()} <span class=" text-lg">${n("global.health")}</span></div>
                                <span class="font-label text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${e}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${ce()} <span class=" text-lg">${n("adventurer_status.interest")}</span></div>
                                <span class="font-label text-lg">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${de()}
                        <span class=" text-lg mr-4">${n("global.power")}</span>
                        <span class="font-label text-2xl  text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg  font-label mb-3 text-center text-white">${n("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${he()} <span class="ml-2 ">${n("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white ">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${n("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${ue()} <span class="ml-2 ">${n("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white ">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${n("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${me()} <span class="ml-2 ">${n("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white ">${n("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",pe);class ge extends HTMLElement{constructor(){super(),this.addEventListener("submit",e=>{e.preventDefault();const t=this.querySelector("#enemy-count"),s=this.querySelector("#enemy-power"),a=this.querySelector("#enemy-hp"),i={enemyCount:parseInt(t.value,10)||1,enemyPower:parseInt(s.value,10)||10,enemyHp:parseInt(a.value,10)||20};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{encounter:i}}))})}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl  text-center mb-2 text-white">${n("battle_panel.title")}</h3>
                <p class="text-center text-brand-text-muted mb-6">${n("battle_panel.description")}</p>
                <form class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="enemy-count" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Count</label>
                        <input id="enemy-count" type="number" step="1" value="1" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-power" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy Power</label>
                        <input id="enemy-power" type="number" step="1" value="10" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <label for="enemy-hp" class="block text-sm font-medium text-brand-text-muted mb-1">Enemy HP</label>
                        <input id="enemy-hp" type="number" step="1" value="20" class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white" />
                    </div>
                    <div class="md:col-span-1">
                        <button type="submit" class="w-full bg-brand-secondary text-white  py-2.5 px-4 rounded-lg transition-all transform hover:scale-105">
                            ${n("battle_panel.run_encounter")}
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("battle-panel",ge);class fe extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,t,s){e==="message"&&(this._message=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",fe);class be extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.newlyUnlocked=[],this.addEventListener("click",e=>{const t=e.composedPath()[0];t.id==="unlock-dismiss-button"?this.dismissUnlock():t.id==="continue-run-button"?this.dispatchEvent(new CustomEvent("run-decision",{bubbles:!0,composed:!0,detail:{decision:"continue"}})):t.id==="retire-run-button"&&this.dispatchEvent(new CustomEvent("run-decision",{bubbles:!0,composed:!0,detail:{decision:"retire"}}))})}static get observedAttributes(){return["workshop-unlocked"]}setDecision(e){this.decision=e,this.startFlow()}connectedCallback(){this.render()}startFlow(){this.newlyUnlocked.length>0?this.renderUnlock():(this.state="unlock-revealed",this.revealDecision())}renderUnlock(){const e=this.querySelector("#unlock-container");if(!e)return;const t=Q.find(s=>s.feature===this.newlyUnlocked[0]);t&&(e.innerHTML=`
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-primary animate-fade-in-up w-full max-w-md">
                    <h2 class="text-3xl font-label text-brand-primary mb-3">${n("unlocks.congratulations")}</h2>
                    <h3 class="text-xl text-white">${unlock.name}</h3>
                    <p class="text-brand-text mb-6">${t.description()}</p>
                    <button id="unlock-dismiss-button" class="bg-brand-primary text-white py-2 px-6 rounded-lg hover:bg-brand-primary/80 transition-colors">
                        ${n("global.continue")}
                    </button>
                </div>
            </div>
        `)}dismissUnlock(){const e=this.querySelector("#unlock-container");e&&(e.innerHTML=""),this.state="unlock-revealed",this.revealDecision()}revealDecision(){if(this.state!=="unlock-revealed")return;this.state="decision-revealing";const e=this.querySelector("#decision-container");e&&(e.innerHTML=""),setTimeout(()=>{this.state="decision-revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("final-bp")||0,t=this.getAttribute("reason")||n("run_ended_screen.default_reason");this.innerHTML=`
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
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full max-w-lg">
                    <h2 class="text-4xl font-label text-brand-secondary mb-2">${n("run_ended_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${t}</p>
                    <p class="text-lg text-white mb-6">${n("run_ended_screen.final_bp")}<span class="text-2xl text-amber-400">${e}</span></p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${n("run_ended_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const t=this.querySelector("#decision-container"),s=this.querySelector("#button-container");if(!t||!s||this.state!=="decision-revealed")return;let a="",i="";const o=e?"animate-fade-in-up":"",l=this.hasAttribute("workshop-unlocked");this.decision==="continue"?(a=`
                <h3 class="text-2xl text-green-400 mb-2 ${o}">${n("run_ended_screen.continue_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.continue_decision")}</p>
            `,i+=`
                <button
                    id="continue-run-button"
                    class="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${n(l?"run_ended_screen.enter_workshop":"run_ended_screen.start_new_run")}
                </button>
            `):(a=`
                <h3 class="text-2xl text-red-400 mb-2 ${o}">${n("run_ended_screen.retire_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${n("run_ended_screen.retire_decision",{run:this.getAttribute("run")})}</p>
            `,i+=`
                <button
                    id="retire-run-button"
                    class="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${n("run_ended_screen.recruit_new_adventurer")}
                </button>
            `),t.innerHTML=a,s.innerHTML=i}}customElements.define("run-ended-screen",be);class ve extends HTMLElement{constructor(){super(),this._balancePoints=0,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,t,s){switch(e){case"balance-points":this._balancePoints=Number(s);break;case"run":this._run=Number(s);break;case"room":this._room=Number(s);break;case"deck-size":this._deckSize=Number(s);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.bp")}</span>
                    <p class="text-2xl  text-white">${this._balancePoints}</p>
                </div>
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
        `}}customElements.define("game-stats",ve);class _e extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,t,s){e==="text"&&(this._text=s,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 rounded-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white ">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",_e);class xe extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-gray-500";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((s,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(s.level)}">[${a.toString().padStart(3,"0")}] ${s.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm text-brand-text-muted uppercase tracking-wider mb-2">${n("log_panel.title")}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
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
        `;const t=this.querySelector("#log-container");t&&(t.scrollTop=t.scrollHeight)}}customElements.define("log-panel",xe);const we={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},O=(r,e)=>{const t=e>0;return`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `};class ye extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("loot-card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=we[this._item.rarity]||"text-gray-400",t="bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let s="";this._isDisabled?s="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?s="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":s="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${t} ${s}${a}`,this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class=" text-2xl ${e}">${this._item.name}</p>
                    <p class="font-label text-sm text-brand-text-muted">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text text-large">
                    ${this._item.stats.hp?O(n("global.health"),this._item.stats.hp):""}
                    ${this._item.stats.maxHp?O(n("global.max_hp"),this._item.stats.maxHp):""}
                    ${this._item.stats.power?O(n("global.power"),this._item.stats.power):""}
                </div>
            </div>
        `}}customElements.define("loot-card",ye);const A=4;class Se extends HTMLElement{constructor(){super(),this._choices=[],this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("loot-card-select",e=>{const{instanceId:t}=e.detail;this.handleSelect(t)}),this.addEventListener("click",e=>{e.target.id==="present-offer-button"&&this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}))})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const t=new Map(this._choices.map(i=>[i.instanceId,i.id])),s=this._choices.find(i=>i.instanceId===e);if(!s)return;if(this._selectedIds.includes(e))this._selectedIds=this._selectedIds.filter(i=>i!==e);else{if(this._selectedIds.map(o=>t.get(o)).includes(s.id))return;this._selectedIds.length<A&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=new Map(this._choices.map(i=>[i.instanceId,i.id])),t=this._selectedIds.map(i=>e.get(i)),s=this._selectedIds.length>=2&&this._selectedIds.length<=A;this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl  text-center mb-4 text-white">${n("loot_choice_panel.title")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!s||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white  py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${n("loot_choice_panel.present_offer")} (${this._selectedIds.length}/${A})
                    </button>
                </div>
            </div>
        `;const a=this.querySelector("#loot-card-container");a&&this._choices.forEach(i=>{const o=document.createElement("loot-card");o.item=i,o.isSelected=this._selectedIds.includes(i.instanceId);const l=!o.isSelected&&t.includes(i.id);o.isDisabled=l||this._disabled,o.isNewlyDrafted=i.justDrafted&&this._initialRender||!1,a.appendChild(o)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("loot-choice-panel",Se);const q=(r,e)=>{const t=e>0;return`
        <div class="flex justify-between text-sm ${t?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${t?"+":""}${e}</span>
        </div>
    `},ke=(r,e)=>{const s={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="text-lg ${s}">${r.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${r.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${s}">${r.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${r.stats.hp?q(n("global.health"),r.stats.hp):""}
                    ${r.stats.maxHp?q(n("global.max_hp"),r.stats.maxHp):""}
                    ${r.stats.power?q(n("global.power"),r.stats.power):""}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${r.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${n("global.buy")} (${r.cost} ${n("global.bp")})
                </button>
            </div>
        </div>
    `};class Ee extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const t=e.target,s=t.dataset.itemId;s&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:s}})),t.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(t=>ke(t,this._balancePoints>=(t.cost||0))).join("");this.innerHTML=`
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
                    ${this._items.length===0?`<p class="text-center text-brand-text-muted col-span-full">${n("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${n("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",Ee);class $e extends HTMLElement{constructor(){super(),this.metaManager=new K,this.addEventListener("click",e=>{const t=e.target;t.id==="new-game-button"?this.metaManager.metaState.highestRun>0?confirm(n("menu.new_game_confirm"))&&this._dispatch("reset-game"):this._dispatch("start-game"):t.id==="continue-game-button"&&this._dispatch("continue-game")})}connectedCallback(){this.render()}_dispatch(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}render(){const e=this.metaManager.metaState,t=e.highestRun>0;let s="";t&&(s=`
                <p class="text-lg text-gray-400 mt-4">
                    ${n("menu.max_runs",{count:e.highestRun})} | ${n("menu.unlocked_features",{count:e.unlockedFeatures.length})}
                </p>
            `),this.innerHTML=`
            <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 class="text-8xl text-red-500 font-title mb-2">${n("game_title")}</h1>
                <p class="text-2xl text-gray-300 mb-8">${n("game_subtitle")}</p>
                ${s}
                <div class="mt-8 space-y-4">
                    ${t?`
                        <button id="continue-game-button" class="bg-red-500 hover:bg-red-600 text-white  py-3 px-6 rounded-lg text-xl min-w-[250px] transition-colors">
                            ${n("menu.continue_game")}
                        </button>
                    `:""}
                    <button id="new-game-button" class="bg-gray-700 hover:bg-gray-600 text-white  py-3 px-6 rounded-lg text-xl min-w-[250px] transition-colors">
                        ${n("menu.new_game")}
                    </button>
                </div>
            </div>
        `}}customElements.define("menu-screen",$e);const g=document.getElementById("app");if(!g)throw new Error("Could not find app element to mount to");const V=new K,p=new ae(V);p.on("state-change",r=>{if(p.isLoading){g.innerHTML=`<div>${n("global.loading_game_data")}</div>`;return}if(p.error){g.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl text-brand-secondary mb-4">${n("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${p.error}</p>
                    </div>
                </div>
            `;return}oe(g,r,p)});g.addEventListener("present-offer",r=>{const{ids:e}=r.detail;p.presentOffer(e)});g.addEventListener("run-encounter",r=>{const{encounter:e}=r.detail;p.runEncounter(e)});g.addEventListener("run-decision",r=>{const{decision:e}=r.detail;p.handleEndOfRun(e)});g.addEventListener("purchase-item",r=>{const{itemId:e}=r.detail;p.purchaseItem(e)});g.addEventListener("start-game",()=>{p.startNewGame()});g.addEventListener("start-run",()=>{p.startNewRun()});g.addEventListener("continue-game",()=>{p.continueGame()});g.addEventListener("reset-game",()=>{V.reset(),p.startNewGame()});async function Ie(){await ne(),await p.init(),g.innerHTML=`<div>${n("global.initializing")}</div>`,p.showMenu()}Ie();
