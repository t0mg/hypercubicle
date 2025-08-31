(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const k={hp:100,maxHp:100,power:5};class P{constructor(e){this.hp=k.hp,this.maxHp=k.maxHp,this.power=k.power,this.interest=33+Math.floor(Math.random()*50),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]}}modifyInterest(e,s){const t=Math.max(.1,(1e3-this.traits.expertise)/1e3),n=(Math.random()*2-1)*s,a=(e+n)*t;this.interest=Math.max(0,Math.min(100,this.interest+a))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}recalculateStats(){let e=k.power,s=k.maxHp;this.inventory.weapon&&(e+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(e+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0);const t=s-this.maxHp;this.power=e,this.maxHp=s,this.hp+=Math.max(0,t)}}class W{constructor(){this.entries=[]}log(e,s="INFO"){this.entries.push({message:e,level:s,timestamp:Date.now()}),console.log(`[${s}] ${e}`)}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const G=15,V=3,Q={Common:1,Uncommon:2,Rare:3},z=10,M=10,Y=["loot_1","loot_2","loot_3","loot_4","loot_5"],K=32,C=9,B=300,j=r=>[...r].sort(()=>Math.random()-.5),U=(r,e)=>{let s=0;const t=new Map(e.map(l=>[l.id,l])),n=r.map(l=>t.get(l)).filter(Boolean),a=l=>(s++,{...l,instanceId:`${l.id}-${s}`}),o=n.filter(l=>l.cost===null),c=n.filter(l=>l.cost!==null);let d=[];if(o.length>0)for(const l of o)d.push(a(l),a(l),a(l),a(l));d.push(...c.map(a));let b=0;for(;d.length<K&&o.length>0;)d.push(a(o[b%o.length])),b++;return j(d)};class X{constructor(){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s=new P(e),t=Y,n=U(t,this._allItems),a=n.slice(0,C),o=n.slice(C),c=new W;c.info("--- Starting New Game (Run 1) ---"),this.gameState={phase:"DESIGNER_CHOOSING_DIFFICULTY",designer:{balancePoints:0},adventurer:s,unlockedDeck:t,availableDeck:o,hand:a,shopItems:[],offeredLoot:[],feedback:{key:"game_engine.new_adventurer"},logger:c,run:1,room:1,gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.startNewRun=()=>{if(!this.gameState)return;const e=U(this.gameState.unlockedDeck,this._allItems),s=e.slice(0,C),t=e.slice(C),n=new P(this.gameState.adventurer.traits);n.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${this.gameState.run} ---`),this.gameState={...this.gameState,adventurer:n,phase:"DESIGNER_CHOOSING_DIFFICULTY",availableDeck:t,hand:s,room:1,feedback:{key:"game_engine.adventurer_returns"},gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(t=>e.includes(t.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:t,reason:n}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot),a=this.gameState.adventurer;let o=this.gameState.hand,c=this.gameState.availableDeck;o.forEach(p=>p.justDrafted=!1);let d=o.filter(p=>!e.includes(p.instanceId));const b=C-d.length,l=c.slice(0,b);l.forEach(p=>{p.draftedRoom=this.gameState.room,p.justDrafted=!0});const v=c.slice(b);d.push(...l),t?t.type==="Potion"?a.addPotion(t):a.equip(t):a.interest=Math.max(0,a.interest-10);const x=this.gameState.room+1,_=this.gameState.designer.balancePoints+M;this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:a,feedback:n,availableDeck:v,hand:d,room:x,designer:{balancePoints:_}},this._emit("state-change",this.gameState)},B)},this.runEncounter=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_DIFFICULTY")return;let s={...e},t=!1;if(this.gameState.room>0&&this.gameState.room%5===0){t=!0;const n=Math.max(e.enemyPower,20+this.gameState.room),a=Math.max(e.enemyHp,50+this.gameState.room*5);s={enemyCount:1,enemyPower:n,enemyHp:a}}this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.encounter=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.encounter)return;t&&this.gameState.logger.info("--- BOSS FIGHT ---");const{newAdventurer:n,feedback:a}=this._simulateEncounter(this.gameState.adventurer,this.gameState.room,this.gameState.encounter);if(n.hp<=0){this.gameState.logger.error("GAME OVER: Adventurer has fallen in battle."),this.gameState={...this.gameState,adventurer:n,designer:{balancePoints:this.gameState.designer.balancePoints+M},phase:"RUN_OVER",gameOver:{isOver:!0,reason:{key:"game_engine.adventurer_fell",context:{room:this.gameState.room,run:this.gameState.run}}}},this._emit("state-change",this.gameState);return}if(n.interest<=G){this.gameState.logger.error("GAME OVER: Adventurer lost interest and quit."),this.gameState={...this.gameState,adventurer:n,designer:{balancePoints:this.gameState.designer.balancePoints+M},phase:"RUN_OVER",gameOver:{isOver:!0,reason:{key:"game_engine.adventurer_bored",context:{room:this.gameState.room,run:this.gameState.run}}}},this._emit("state-change",this.gameState);return}this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),a.push({key:"game_engine.empty_hand"}),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:n,room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+M},feedback:a,encounter:void 0}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:n,feedback:a,encounter:void 0},this._emit("state-change",this.gameState)},B)},this.enterWorkshop=()=>{if(!this.gameState)return;const e=this.gameState.run+1,s=this._allItems.filter(t=>t.cost!==null).filter(t=>!this.gameState.unlockedDeck.includes(t.id)).filter(t=>e>=t.minRun);this.gameState={...this.gameState,phase:"SHOP",run:e,room:0,shopItems:j(s).slice(0,4),gameOver:{isOver:!1,reason:""},feedback:{key:"game_engine.welcome_to_workshop"}},this._emit("state-change",this.gameState)},this.purchaseItem=e=>{if(!this.gameState)return;const s=this._allItems.find(o=>o.id===e);if(!s||s.cost===null||this.gameState.designer.balancePoints<s.cost)return;const t=[...this.gameState.unlockedDeck,e],n=this.gameState.designer.balancePoints-s.cost,a=this.gameState.shopItems.filter(o=>o.id!==e);this.gameState.logger.info(`Purchased ${s.name}.`),this.gameState={...this.gameState,designer:{balancePoints:n},unlockedDeck:t,shopItems:a},this._emit("state-change",this.gameState)}}on(e,s){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(s)}_emit(e,s){const t=this._listeners[e];t&&t.forEach(n=>n(s))}_getAdventurerChoice(e,s){var v,x,_,p;const{traits:t,inventory:n}=e;(v=this.gameState)==null||v.logger.debug(`--- Adventurer Decision --- (Offense: ${t.offense}, Risk: ${t.risk})`);const a=((x=n.weapon)==null?void 0:x.stats.power)||0,o=((_=n.armor)==null?void 0:_.stats.maxHp)||0;(p=this.gameState)==null||p.logger.debug(`Current Gear: Weapon Power(${a}), Armor HP(${o})`);const c=h=>{var $,E;let m=(Q[h.rarity]||1)*5;switch(h.type){case"Weapon":const w=(h.stats.power||0)-a;if(w<=0&&h.id!==(($=n.weapon)==null?void 0:$.id))return-1;m+=w*(t.offense/10),w>0&&(m+=w*(t.expertise/10));const I=h.stats.maxHp||0;I<0&&(m+=I*(100-t.risk)/20);break;case"Armor":const f=(h.stats.maxHp||0)-o;if(f<=0&&h.id!==((E=n.armor)==null?void 0:E.id))return-1;m+=f*(100-t.offense)/10,f>0&&(m+=f*(t.expertise/10));const H=h.stats.power||0;H>0&&(m+=H*(t.offense/15));const L=h.stats.power||0;L<0&&(m+=L*(t.risk/10));break;case"Potion":const y=e.hp/e.maxHp;m+=10*(100-t.risk)/100,y<.7&&(m+=20*(1-y)),m+=5*(t.expertise/100),n.potions.length>=V&&(m*=.1);break}return m+Math.random()},d=s.map(h=>({item:h,score:c(h)})).filter(h=>h.score>0);if(d.sort((h,m)=>m.score-h.score),d.length===0||d[0].score<z)return{choice:null,reason:{key:"game_engine.adventurer_declines_offer"}};const b=d[0].item,l={key:"game_engine.adventurer_accepts_offer",context:{itemName:b.name}};return{choice:b,reason:l}}_simulateEncounter(e,s,t){var v,x,_,p,h,m,$,E,w,I;(v=this.gameState)==null||v.logger.info(`--- Encounter: Room ${s} ---`);const n=[];let a=0,o=0;const c=e.hp;for(let f=0;f<t.enemyCount;f++){(x=this.gameState)==null||x.logger.info(`Adventurer encounters enemy ${f+1}/${t.enemyCount}.`);const H=e.hp/e.maxHp,L=1-e.traits.risk/120;if(H<L&&e.inventory.potions.length>0){const S=e.inventory.potions.shift();if(S){const T=S.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+T),n.push({key:"game_engine.adventurer_drinks_potion",context:{potionName:S.name}}),(_=this.gameState)==null||_.logger.info(`Adventurer used ${S.name} and recovered ${T} HP.`)}}let y=t.enemyHp;for(;y>0&&e.hp>0;){const S=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(Math.random()<S){const D=e.power;y-=D,(p=this.gameState)==null||p.logger.debug(`Adventurer hits for ${D} damage.`)}else(h=this.gameState)==null||h.logger.debug("Adventurer misses.");if(y<=0){(m=this.gameState)==null||m.logger.info("Enemy defeated."),o++;break}const T=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(Math.random()<T){const D=((($=e.inventory.armor)==null?void 0:$.stats.maxHp)||0)/10,O=Math.max(1,t.enemyPower-D);a+=O,e.hp-=O,(E=this.gameState)==null||E.logger.debug(`Enemy hits for ${O} damage.`)}else(w=this.gameState)==null||w.logger.debug("Enemy misses.")}if(e.hp<=0){(I=this.gameState)==null||I.logger.warn("Adventurer has been defeated.");break}}let d;const l=(c-e.hp)/e.maxHp;return l>.7?(d={key:"game_engine.too_close_for_comfort"},e.modifyInterest(-15,5)):l>.4?(d={key:"game_engine.great_battle"},e.modifyInterest(10,5)):o>3&&e.traits.offense>60?(d={key:"game_engine.easy_fight"},e.modifyInterest(5,5)):(d={key:"game_engine.worthy_challenge"},e.modifyInterest(-2,3)),n.push(d),e.hp>0&&o===t.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:n,totalDamageTaken:a}}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,s=e-G,t=(Math.random()-.5)*20;return s+t>0?"continue":"retire"}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(`global.error_loading_items: ${e.statusText}`);this._allItems=await e.json(),this.startNewGame()}catch(e){this.error=e.message||"global.unknown_error",this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}let Z={};async function F(r){try{const e=await fetch(`/rogue-steward/locales/${r}.json`);if(!e.ok)throw new Error(`Could not load ${r}.json`);Z=await e.json()}catch(e){console.warn(`Failed to load ${r} translations:`,e),r!=="en"&&await F("en")}}function J(){return navigator.language.split("-")[0]}function i(r,e={}){let t=r.split(".").reduce((n,a)=>n?n[a]:void 0,Z);if(!t)return console.warn(`Translation not found for key: ${r}`),r;for(const n in e)t=t.replace(`{${n}}`,String(e[n]));return t}function N(r){return typeof r=="string"?r:!r||!r.key?"":i(r.key,r.context)}async function ee(){const r=J();await F(r)}const te=r=>{if(!r)return i("global.initializing");switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return i("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return i("main.adventurer_facing_encounter");default:return i("global.loading")}},se=r=>{switch(r.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>';case"DESIGNER_CHOOSING_DIFFICULTY":return'<div class="lg:col-span-3"><battle-panel></battle-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${te(r)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>${i("main.unhandled_game_phase",{phase:r.phase})}</div></div>`}},ne=(r,e,s)=>{if(!e){r.innerHTML=`<div>${i("global.loading")}</div>`;return}if(e.phase==="SHOP"){r.innerHTML="<workshop-screen></workshop-screen>";const c=document.querySelector("workshop-screen");c&&(c.items=e.shopItems,c.balancePoints=e.designer.balancePoints);return}const t=e.gameOver.isOver?`<game-over-screen
                final-bp="${e.designer.balancePoints}"
                reason="${N(e.gameOver.reason)}"
                run="${e.run}"
                decision="${s.getAdventurerEndRunDecision()}"
            ></game-over-screen>`:"";r.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${t}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <log-panel></log-panel>
                    <game-stats
                        balance-points="${e.designer.balancePoints}"
                        run="${e.run}"
                        room="${e.room}"
                        deck-size="${e.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${Array.isArray(e.feedback)?e.feedback.map(c=>N(c)).join(" "):N(e.feedback)}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${se(e)}
            </div>
        </div>
    `;const n=document.querySelector("adventurer-status");n&&(n.adventurer=e.adventurer);const a=document.querySelector("loot-choice-panel");a&&(a.choices=e.hand,a.disabled=!1);const o=document.querySelector("log-panel");o&&(o.logger=e.logger,o.traits=e.adventurer.traits)},ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',re=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',ie=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',le=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',de=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class ce extends HTMLElement{constructor(){super(),this._adventurer=null}set adventurer(e){this._adventurer=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="";return}const e=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl font-bold font-serif mb-4 text-center text-white">${i("adventurer_status.title")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${ae()} <span class="font-semibold text-lg">${i("global.health")}</span></div>
                                <span class="font-mono text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${e}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${ie()} <span class="font-semibold text-lg">${i("adventurer_status.interest")}</span></div>
                                <span class="font-mono text-lg">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${re()}
                        <span class="font-semibold text-lg mr-4">${i("global.power")}</span>
                        <span class="font-mono text-2xl font-bold text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg font-bold font-serif mb-3 text-center text-white">${i("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${oe()} <span class="ml-2 font-semibold">${i("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white font-semibold">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">${i("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${i("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${le()} <span class="ml-2 font-semibold">${i("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white font-semibold">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">${i("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${i("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${de()} <span class="ml-2 font-semibold">${i("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white font-semibold">${i("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${i("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",ce);class he extends HTMLElement{constructor(){super(),this.addEventListener("submit",e=>{e.preventDefault();const s=this.querySelector("#enemy-count"),t=this.querySelector("#enemy-power"),n=this.querySelector("#enemy-hp"),a={enemyCount:parseInt(s.value,10)||1,enemyPower:parseInt(t.value,10)||10,enemyHp:parseInt(n.value,10)||20};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{encounter:a}}))})}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl font-bold text-center mb-2 text-white">${i("battle_panel.title")}</h3>
                <p class="text-center text-brand-text-muted mb-6">${i("battle_panel.description")}</p>
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
                        <button type="submit" class="w-full bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105">
                            ${i("battle_panel.run_encounter")}
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("battle-panel",he);class me extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,s,t){e==="message"&&(this._message=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",me);class ue extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.addEventListener("click",e=>{const s=e.target;s.id==="enter-workshop-button"?this.dispatchEvent(new CustomEvent("enter-workshop",{bubbles:!0,composed:!0})):s.id==="new-adventurer-button"&&this.dispatchEvent(new CustomEvent("start-game",{bubbles:!0,composed:!0}))})}connectedCallback(){this.state==="initial"&&(this.render(),this.revealDecision())}revealDecision(){this.state="revealing",setTimeout(()=>{this.decision=this.getAttribute("decision")||"retire",this.state="revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("final-bp")||0,s=this.getAttribute("reason")||i("game_over_screen.default_reason");this.innerHTML=`
            <style>
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
            <div class="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in w-full max-w-lg">
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">${i("game_over_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${s}</p>
                    <p class="text-lg text-white mb-6">${i("game_over_screen.final_bp")}<span class="font-bold text-2xl text-amber-400">${e}</span></p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${i("game_over_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const s=this.querySelector("#decision-container"),t=this.querySelector("#button-container");if(!s||!t)return;let n="",a="";const o=e?"animate-fade-in-up":"";this.decision==="continue"?(n=`
                <h3 class="text-2xl font-bold text-green-400 mb-2 ${o}">${i("game_over_screen.continue_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${i("game_over_screen.continue_decision")}</p>
            `,a+=`
                <button
                    id="enter-workshop-button"
                    class="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${i("game_over_screen.enter_workshop")}
                </button>
            `):(n=`
                <h3 class="text-2xl font-bold text-red-400 mb-2 ${o}">${i("game_over_screen.retire_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${i("game_over_screen.retire_decision")}</p>
            `,a+=`
                <button
                    id="new-adventurer-button"
                    class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${i("game_over_screen.recruit_new_adventurer")}
                </button>
            `),s.innerHTML=n,t.innerHTML=a}}customElements.define("game-over-screen",ue);class pe extends HTMLElement{constructor(){super(),this._balancePoints=0,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,s,t){switch(e){case"balance-points":this._balancePoints=Number(t);break;case"run":this._run=Number(t);break;case"room":this._room=Number(t);break;case"deck-size":this._deckSize=Number(t);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.bp")}</span>
                    <p class="text-2xl font-bold text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.run")}</span>
                    <p class="text-2xl font-bold text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.room")}</span>
                    <p class="text-2xl font-bold text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${i("global.deck")}</span>
                    <p class="text-2xl font-bold text-white">${this._deckSize}</p>
                </div>
            </div>
        `}}customElements.define("game-stats",pe);class ge extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,s,t){e==="text"&&(this._text=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 rounded-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white font-semibold">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",ge);class be extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-gray-500";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((t,n)=>`<p class="whitespace-pre-wrap ${this._getLogColor(t.level)}">[${n.toString().padStart(3,"0")}] ${t.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">${i("log_panel.title")}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${i("log_panel.offense")}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${i("log_panel.risk")}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${i("log_panel.expertise")}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",be);const fe={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},A=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `};class ve extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("loot-card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=fe[this._item.rarity]||"text-gray-400",s="bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let t="";this._isDisabled?t="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?t="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":t="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const n=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${s} ${t}${n}`,this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${e}">${this._item.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text">
                    ${this._item.stats.hp?A(i("global.health"),this._item.stats.hp):""}
                    ${this._item.stats.maxHp?A(i("global.max_hp"),this._item.stats.maxHp):""}
                    ${this._item.stats.power?A(i("global.power"),this._item.stats.power):""}
                </div>
            </div>
        `}}customElements.define("loot-card",ve);const R=4;class xe extends HTMLElement{constructor(){super(),this._choices=[],this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("loot-card-select",e=>{const{instanceId:s}=e.detail;this.handleSelect(s)}),this.addEventListener("click",e=>{e.target.id==="present-offer-button"&&this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}))})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const s=new Map(this._choices.map(a=>[a.instanceId,a.id])),t=this._choices.find(a=>a.instanceId===e);if(!t)return;if(this._selectedIds.includes(e))this._selectedIds=this._selectedIds.filter(a=>a!==e);else{if(this._selectedIds.map(o=>s.get(o)).includes(t.id))return;this._selectedIds.length<R&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=new Map(this._choices.map(a=>[a.instanceId,a.id])),s=this._selectedIds.map(a=>e.get(a)),t=this._selectedIds.length>=2&&this._selectedIds.length<=R;this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl font-bold text-center mb-4 text-white">${i("loot_choice_panel.title")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!t||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${i("loot_choice_panel.present_offer")} (${this._selectedIds.length}/${R})
                    </button>
                </div>
            </div>
        `;const n=this.querySelector("#loot-card-container");n&&this._choices.forEach(a=>{const o=document.createElement("loot-card");o.item=a,o.isSelected=this._selectedIds.includes(a.instanceId);const c=!o.isSelected&&s.includes(a.id);o.isDisabled=c||this._disabled,o.isNewlyDrafted=a.justDrafted&&this._initialRender||!1,n.appendChild(o)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("loot-choice-panel",xe);const q=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `},_e=(r,e)=>{const t={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${t}">${r.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${r.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${t}">${r.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${r.stats.hp?q(i("global.health"),r.stats.hp):""}
                    ${r.stats.maxHp?q(i("global.max_hp"),r.stats.maxHp):""}
                    ${r.stats.power?q(i("global.power"),r.stats.power):""}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${r.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${i("global.buy")} (${r.cost} ${i("global.bp")})
                </button>
            </div>
        </div>
    `};class we extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const s=e.target,t=s.dataset.itemId;t&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:t}})),s.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(s=>_e(s,this._balancePoints>=(s.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold font-serif text-white">${i("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${i("workshop.description")}</p>
                    <p class="mt-4 text-2xl font-bold">
                        ${i("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand-text-muted col-span-full">${i("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${i("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",we);const g=document.getElementById("app");if(!g)throw new Error("Could not find app element to mount to");const u=new X;u.on("state-change",r=>{if(u.isLoading){g.innerHTML=`<div>${i("global.loading_game_data")}</div>`;return}if(u.error){g.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl font-bold text-brand-secondary mb-4">${i("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${u.error}</p>
                    </div>
                </div>
            `;return}ne(g,r,u)});g.addEventListener("present-offer",r=>{const{ids:e}=r.detail;u.presentOffer(e)});g.addEventListener("run-encounter",r=>{const{encounter:e}=r.detail;u.runEncounter(e)});g.addEventListener("enter-workshop",()=>{u.enterWorkshop()});g.addEventListener("purchase-item",r=>{const{itemId:e}=r.detail;u.purchaseItem(e)});g.addEventListener("start-run",()=>{u.startNewRun()});g.addEventListener("start-game",()=>{u.startNewGame()});async function ye(){await ee(),await u.init(),g.innerHTML=`<div>${i("global.initializing")}</div>`,u.startNewGame()}ye();
