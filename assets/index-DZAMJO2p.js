(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();let F={};async function U(n){try{const e=await fetch(`/rogue-steward/locales/${n}.json`);if(!e.ok)throw new Error(`Could not load ${n}.json`);F=await e.json()}catch(e){console.warn(`Failed to load ${n} translations:`,e),n!=="en"&&await U("en")}}function j(){return navigator.language.split("-")[0]}function r(n,e={}){let t=n.split(".").reduce((a,i)=>a?a[i]:null,F);if(!t)return console.warn(`Translation not found for key: ${n}`),n;for(const a in e)t=t.replace(`{${a}}`,String(e[a]));return t}async function W(){const n=j();await U(n)}const k={hp:100,maxHp:100,power:5};class q{constructor(e){this.hp=k.hp,this.maxHp=k.maxHp,this.power=k.power,this.interest=33+Math.floor(Math.random()*50),this.traits=e,this.inventory={weapon:null,armor:null,potions:[]}}modifyInterest(e,s){const t=Math.max(.1,(1e3-this.traits.expertise)/1e3),a=(Math.random()*2-1)*s,i=(e+a)*t;this.interest=Math.max(0,Math.min(100,this.interest+i))}equip(e){e.type==="Weapon"?this.inventory.weapon=e:e.type==="Armor"&&(this.inventory.armor=e),this.recalculateStats()}addPotion(e){e.type==="Potion"&&this.inventory.potions.push(e)}recalculateStats(){let e=k.power,s=k.maxHp;this.inventory.weapon&&(e+=this.inventory.weapon.stats.power||0,s+=this.inventory.weapon.stats.maxHp||0),this.inventory.armor&&(e+=this.inventory.armor.stats.power||0,s+=this.inventory.armor.stats.maxHp||0);const t=s-this.maxHp;this.power=e,this.maxHp=s,this.hp+=Math.max(0,t)}}class V{constructor(){this.entries=[]}log(e,s="INFO"){this.entries.push({message:e,level:s,timestamp:Date.now()}),console.log(`[${s}] ${e}`)}debug(e){this.log(e,"DEBUG")}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e){this.log(e,"ERROR")}}const P=15,Q=3,z={Common:1,Uncommon:2,Rare:3},Y=10,M=10,K=["loot_1","loot_2","loot_3","loot_4","loot_5"],X=32,C=9,G=300,Z=n=>[...n].sort(()=>Math.random()-.5),B=(n,e)=>{let s=0;const t=new Map(e.map(l=>[l.id,l])),a=n.map(l=>t.get(l)).filter(Boolean),i=l=>(s++,{...l,instanceId:`${l.id}-${s}`}),o=a.filter(l=>l.cost===null),m=a.filter(l=>l.cost!==null);let d=[];if(o.length>0)for(const l of o)d.push(i(l),i(l),i(l),i(l));d.push(...m.map(i));let b=0;for(;d.length<X&&o.length>0;)d.push(i(o[b%o.length])),b++;return Z(d)};class J{constructor(){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s=new q(e),t=K,a=B(t,this._allItems),i=a.slice(0,C),o=a.slice(C),m=new V;m.info("--- Starting New Game (Run 1) ---"),this.gameState&&this.gameState.logger&&console.log("previous game log dump:",this.gameState.logger.entries),this.gameState={phase:"DESIGNER_CHOOSING_DIFFICULTY",designer:{balancePoints:0},adventurer:s,unlockedDeck:t,availableDeck:o,hand:i,shopItems:[],offeredLoot:[],feedback:r("game_engine.new_adventurer"),logger:m,run:1,room:1,gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.startNewRun=()=>{if(!this.gameState)return;const e=B(this.gameState.unlockedDeck,this._allItems),s=e.slice(0,C),t=e.slice(C),a=new q(this.gameState.adventurer.traits);a.interest=this.gameState.adventurer.interest,this.gameState.logger.info(`--- Starting Run ${this.gameState.run} ---`),this.gameState={...this.gameState,adventurer:a,phase:"DESIGNER_CHOOSING_DIFFICULTY",availableDeck:t,hand:s,room:1,feedback:r("game_engine.adventurer_returns"),gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(t=>e.includes(t.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:t,reason:a}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot),i=this.gameState.adventurer;let o=this.gameState.hand,m=this.gameState.availableDeck;o.forEach(g=>g.justDrafted=!1);let d=o.filter(g=>!e.includes(g.instanceId));const b=C-d.length,l=m.slice(0,b);l.forEach(g=>{g.draftedRoom=this.gameState.room,g.justDrafted=!0});const v=m.slice(b);d.push(...l),t?t.type==="Potion"?i.addPotion(t):i.equip(t):i.interest=Math.max(0,i.interest-10);const x=this.gameState.room+1,_=this.gameState.designer.balancePoints+M;this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:i,feedback:a,availableDeck:v,hand:d,room:x,designer:{balancePoints:_}},this._emit("state-change",this.gameState)},G)},this.runEncounter=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_DIFFICULTY")return;let s={...e},t=!1;if(this.gameState.room>0&&this.gameState.room%5===0){t=!0;const a=Math.max(e.enemyPower,20+this.gameState.room),i=Math.max(e.enemyHp,50+this.gameState.room*5);s={enemyCount:1,enemyPower:a,enemyHp:i}}this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.encounter=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.encounter)return;t&&this.gameState.logger.info("--- BOSS FIGHT ---");const{newAdventurer:a,feedback:i}=this._simulateEncounter(this.gameState.adventurer,this.gameState.room,this.gameState.encounter);if(a.hp<=0){this.gameState.logger.error("GAME OVER: Adventurer has fallen in battle."),this.gameState={...this.gameState,adventurer:a,designer:{balancePoints:this.gameState.designer.balancePoints+M},phase:"RUN_OVER",gameOver:{isOver:!0,reason:r("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run})}},this._emit("state-change",this.gameState);return}if(a.interest<=P){this.gameState.logger.error("GAME OVER: Adventurer lost interest and quit."),this.gameState={...this.gameState,adventurer:a,designer:{balancePoints:this.gameState.designer.balancePoints+M},phase:"RUN_OVER",gameOver:{isOver:!0,reason:r("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run})}},this._emit("state-change",this.gameState);return}let o=i;this.gameState.hand&&this.gameState.hand.length===0?(this.gameState.logger.warn("Your hand is empty! The adventurer must press on without new items."),o=r("game_engine.empty_hand"),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:a,room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+M},feedback:o,encounter:void 0}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:a,feedback:o,encounter:void 0},this._emit("state-change",this.gameState)},G)},this.enterWorkshop=()=>{if(!this.gameState)return;const e=this.gameState.run+1,s=this._allItems.filter(t=>t.cost!==null).filter(t=>!this.gameState.unlockedDeck.includes(t.id)).filter(t=>e>=t.minRun);this.gameState={...this.gameState,phase:"SHOP",run:e,room:0,shopItems:Z(s).slice(0,4),gameOver:{isOver:!1,reason:""},feedback:r("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.purchaseItem=e=>{if(!this.gameState)return;const s=this._allItems.find(o=>o.id===e);if(!s||s.cost===null||this.gameState.designer.balancePoints<s.cost)return;const t=[...this.gameState.unlockedDeck,e],a=this.gameState.designer.balancePoints-s.cost,i=this.gameState.shopItems.filter(o=>o.id!==e);this.gameState.logger.info(`Purchased ${s.name}.`),this.gameState={...this.gameState,designer:{balancePoints:a},unlockedDeck:t,shopItems:i},this._emit("state-change",this.gameState)}}on(e,s){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(s)}_emit(e,s){const t=this._listeners[e];t&&t.forEach(a=>a(s))}_getAdventurerChoice(e,s){var v,x,_,g;const{traits:t,inventory:a}=e;(v=this.gameState)==null||v.logger.debug(`--- Adventurer Decision --- (Offense: ${t.offense}, Risk: ${t.risk})`);const i=((x=a.weapon)==null?void 0:x.stats.power)||0,o=((_=a.armor)==null?void 0:_.stats.maxHp)||0;(g=this.gameState)==null||g.logger.debug(`Current Gear: Weapon Power(${i}), Armor HP(${o})`);const m=c=>{var $,E;let h=(z[c.rarity]||1)*5;switch(c.type){case"Weapon":const w=(c.stats.power||0)-i;if(w<=0&&c.id!==(($=a.weapon)==null?void 0:$.id))return-1;h+=w*(t.offense/10),w>0&&(h+=w*(t.expertise/10));const I=c.stats.maxHp||0;I<0&&(h+=I*(100-t.risk)/20);break;case"Armor":const f=(c.stats.maxHp||0)-o;if(f<=0&&c.id!==((E=a.armor)==null?void 0:E.id))return-1;h+=f*(100-t.offense)/10,f>0&&(h+=f*(t.expertise/10));const H=c.stats.power||0;H>0&&(h+=H*(t.offense/15));const L=c.stats.power||0;L<0&&(h+=L*(t.risk/10));break;case"Potion":const y=e.hp/e.maxHp;h+=10*(100-t.risk)/100,y<.7&&(h+=20*(1-y)),h+=5*(t.expertise/100),a.potions.length>=Q&&(h*=.1);break}return h+Math.random()},d=s.map(c=>({item:c,score:m(c)})).filter(c=>c.score>0);if(d.sort((c,h)=>h.score-c.score),d.length===0||d[0].score<Y)return{choice:null,reason:r("game_engine.adventurer_declines_offer")};const b=d[0].item;let l=r("game_engine.adventurer_accepts_offer",{itemName:b.name});return{choice:b,reason:l}}_simulateEncounter(e,s,t){var v,x,_,g,c,h,$,E,w,I;(v=this.gameState)==null||v.logger.info(`--- Encounter: Room ${s} ---`);let a="",i=0,o=0;const m=e.hp;for(let f=0;f<t.enemyCount;f++){(x=this.gameState)==null||x.logger.info(`Adventurer encounters enemy ${f+1}/${t.enemyCount}.`);const H=e.hp/e.maxHp,L=1-e.traits.risk/120;if(H<L&&e.inventory.potions.length>0){const S=e.inventory.potions.shift();if(S){const T=S.stats.hp||0;e.hp=Math.min(e.maxHp,e.hp+T),a+=r("game_engine.adventurer_drinks_potion",{potionName:S.name}),(_=this.gameState)==null||_.logger.info(`Adventurer used ${S.name} and recovered ${T} HP.`)}}let y=t.enemyHp;for(;y>0&&e.hp>0;){const S=Math.min(.95,.75+e.traits.expertise/500+e.traits.offense/1e3);if(Math.random()<S){const D=e.power;y-=D,(g=this.gameState)==null||g.logger.debug(`Adventurer hits for ${D} damage.`)}else(c=this.gameState)==null||c.logger.debug("Adventurer misses.");if(y<=0){(h=this.gameState)==null||h.logger.info("Enemy defeated."),o++;break}const T=Math.max(.4,.75-e.traits.expertise/500-(100-e.traits.offense)/1e3);if(Math.random()<T){const D=((($=e.inventory.armor)==null?void 0:$.stats.maxHp)||0)/10,O=Math.max(1,t.enemyPower-D);i+=O,e.hp-=O,(E=this.gameState)==null||E.logger.debug(`Enemy hits for ${O} damage.`)}else(w=this.gameState)==null||w.logger.debug("Enemy misses.")}if(e.hp<=0){(I=this.gameState)==null||I.logger.warn("Adventurer has been defeated.");break}}let d;const l=(m-e.hp)/e.maxHp;return l>.7?(d=r("game_engine.too_close_for_comfort"),e.modifyInterest(-15,5)):l>.4?(d=r("game_engine.great_battle"),e.modifyInterest(10,5)):o>3&&e.traits.offense>60?(d=r("game_engine.easy_fight"),e.modifyInterest(5,5)):(d=r("game_engine.worthy_challenge"),e.modifyInterest(-2,3)),e.hp>0&&o===t.enemyCount&&(e.traits.expertise+=1),{newAdventurer:e,feedback:a+d,totalDamageTaken:i}}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,s=e-P,t=(Math.random()-.5)*20;return s+t>0?"continue":"retire"}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(r("global.error_loading_items",{statusText:e.statusText}));this._allItems=await e.json(),this.startNewGame()}catch(e){this.error=e.message||r("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class ee extends HTMLElement{constructor(){super(),this._balancePoints=0,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,s,t){switch(e){case"balance-points":this._balancePoints=Number(t);break;case"run":this._run=Number(t);break;case"room":this._room=Number(t);break;case"deck-size":this._deckSize=Number(t);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${r("global.bp")}</span>
                    <p class="text-2xl font-bold text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${r("global.run")}</span>
                    <p class="text-2xl font-bold text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${r("global.room")}</span>
                    <p class="text-2xl font-bold text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${r("global.deck")}</span>
                    <p class="text-2xl font-bold text-white">${this._deckSize}</p>
                </div>
            </div>
        `}}customElements.define("game-stats",ee);class te extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,s,t){e==="message"&&(this._message=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",te);const se=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',ne=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',ae=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',re=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',ie=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',oe=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class le extends HTMLElement{constructor(){super(),this._adventurer=null}set adventurer(e){this._adventurer=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="";return}const e=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl font-bold font-serif mb-4 text-center text-white">${r("adventurer_status.title")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${se()} <span class="font-semibold text-lg">${r("global.health")}</span></div>
                                <span class="font-mono text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${e}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${ae()} <span class="font-semibold text-lg">${r("adventurer_status.interest")}</span></div>
                                <span class="font-mono text-lg">${Math.round(this._adventurer.interest)}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${ne()}
                        <span class="font-semibold text-lg mr-4">${r("global.power")}</span>
                        <span class="font-mono text-2xl font-bold text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg font-bold font-serif mb-3 text-center text-white">${r("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${re()} <span class="ml-2 font-semibold">${r("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white font-semibold">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">${r("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${r("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${r("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${ie()} <span class="ml-2 font-semibold">${r("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white font-semibold">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">${r("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${r("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${r("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${oe()} <span class="ml-2 font-semibold">${r("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white font-semibold">${r("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${r("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",le);const de={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},N=(n,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${n}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `};class ce extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("loot-card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=de[this._item.rarity]||"text-gray-400",s="bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let t="";this._isDisabled?t="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?t="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":t="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const a=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${s} ${t}${a}`,this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${e}">${this._item.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text">
                    ${this._item.stats.hp?N(r("global.health"),this._item.stats.hp):""}
                    ${this._item.stats.maxHp?N(r("global.max_hp"),this._item.stats.maxHp):""}
                    ${this._item.stats.power?N(r("global.power"),this._item.stats.power):""}
                </div>
            </div>
        `}}customElements.define("loot-card",ce);const A=4;class he extends HTMLElement{constructor(){super(),this._choices=[],this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("loot-card-select",e=>{const{instanceId:s}=e.detail;this.handleSelect(s)}),this.addEventListener("click",e=>{e.target.id==="present-offer-button"&&this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}))})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const s=new Map(this._choices.map(i=>[i.instanceId,i.id])),t=this._choices.find(i=>i.instanceId===e);if(!t)return;if(this._selectedIds.includes(e))this._selectedIds=this._selectedIds.filter(i=>i!==e);else{if(this._selectedIds.map(o=>s.get(o)).includes(t.id))return;this._selectedIds.length<A&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=new Map(this._choices.map(i=>[i.instanceId,i.id])),s=this._selectedIds.map(i=>e.get(i)),t=this._selectedIds.length>=2&&this._selectedIds.length<=A;this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl font-bold text-center mb-4 text-white">${r("loot_choice_panel.title")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!t||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${r("loot_choice_panel.present_offer")} (${this._selectedIds.length}/${A})
                    </button>
                </div>
            </div>
        `;const a=this.querySelector("#loot-card-container");a&&this._choices.forEach(i=>{const o=document.createElement("loot-card");o.item=i,o.isSelected=this._selectedIds.includes(i.instanceId);const m=!o.isSelected&&s.includes(i.id);o.isDisabled=m||this._disabled,o.isNewlyDrafted=i.justDrafted&&this._initialRender||!1,a.appendChild(o)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("loot-choice-panel",he);class me extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,s,t){e==="text"&&(this._text=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 rounded-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white font-semibold">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",me);class ue extends HTMLElement{constructor(){super(),this.addEventListener("submit",e=>{e.preventDefault();const s=this.querySelector("#enemy-count"),t=this.querySelector("#enemy-power"),a=this.querySelector("#enemy-hp"),i={enemyCount:parseInt(s.value,10)||1,enemyPower:parseInt(t.value,10)||10,enemyHp:parseInt(a.value,10)||20};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{encounter:i}}))})}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl font-bold text-center mb-2 text-white">${r("battle_panel.title")}</h3>
                <p class="text-center text-brand-text-muted mb-6">${r("battle_panel.description")}</p>
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
                            ${r("battle_panel.run_encounter")}
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("battle-panel",ue);class pe extends HTMLElement{constructor(){super(),this._logger=null,this._traits=null}set logger(e){this._logger=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}_getLogColor(e){switch(e){case"DEBUG":return"text-gray-500";case"INFO":return"text-gray-400";case"WARN":return"text-yellow-400";case"ERROR":return"text-red-500";default:return"text-gray-400"}}render(){if(!this._traits||!this._logger){this.innerHTML="";return}const e=this._logger.entries.map((t,a)=>`<p class="whitespace-pre-wrap ${this._getLogColor(t.level)}">[${a.toString().padStart(3,"0")}] ${t.message}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">${r("log_panel.title")}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${r("log_panel.offense")}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${r("log_panel.risk")}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${r("log_panel.expertise")}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("log-panel",pe);class ge extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.addEventListener("click",e=>{const s=e.target;s.id==="enter-workshop-button"?this.dispatchEvent(new CustomEvent("enter-workshop",{bubbles:!0,composed:!0})):s.id==="new-adventurer-button"&&this.dispatchEvent(new CustomEvent("start-game",{bubbles:!0,composed:!0}))})}connectedCallback(){this.state==="initial"&&(this.render(),this.revealDecision())}revealDecision(){this.state="revealing",setTimeout(()=>{this.decision=this.getAttribute("decision")||"retire",this.state="revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("final-bp")||0,s=this.getAttribute("reason")||r("game_over_screen.default_reason");this.innerHTML=`
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
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">${r("game_over_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${s}</p>
                    <p class="text-lg text-white mb-6">${r("game_over_screen.final_bp")}<span class="font-bold text-2xl text-amber-400">${e}</span></p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${r("game_over_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const s=this.querySelector("#decision-container"),t=this.querySelector("#button-container");if(!s||!t)return;let a="",i="";const o=e?"animate-fade-in-up":"";this.decision==="continue"?(a=`
                <h3 class="text-2xl font-bold text-green-400 mb-2 ${o}">${r("game_over_screen.continue_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${r("game_over_screen.continue_decision")}</p>
            `,i+=`
                <button
                    id="enter-workshop-button"
                    class="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${r("game_over_screen.enter_workshop")}
                </button>
            `):(a=`
                <h3 class="text-2xl font-bold text-red-400 mb-2 ${o}">${r("game_over_screen.retire_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${r("game_over_screen.retire_decision")}</p>
            `,i+=`
                <button
                    id="new-adventurer-button"
                    class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${r("game_over_screen.recruit_new_adventurer")}
                </button>
            `),s.innerHTML=a,t.innerHTML=i}}customElements.define("game-over-screen",ge);const R=(n,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${n}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `},be=(n,e)=>{const t={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[n.rarity]||"text-gray-400";return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${t}">${n.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${n.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${t}">${n.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${n.stats.hp?R(r("global.health"),n.stats.hp):""}
                    ${n.stats.maxHp?R(r("global.max_hp"),n.stats.maxHp):""}
                    ${n.stats.power?R(r("global.power"),n.stats.power):""}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${n.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${r("global.buy")} (${n.cost} ${r("global.bp")})
                </button>
            </div>
        </div>
    `};class fe extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const s=e.target,t=s.dataset.itemId;t&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:t}})),s.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(s=>be(s,this._balancePoints>=(s.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold font-serif text-white">${r("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${r("workshop.description")}</p>
                    <p class="mt-4 text-2xl font-bold">
                        ${r("workshop.balance_points")}<span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?`<p class="text-center text-brand-text-muted col-span-full">${r("workshop.no_new_items")}</p>`:""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${r("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",fe);const p=document.getElementById("app");if(!p)throw new Error("Could not find app element to mount to");const u=new J;u.on("state-change",n=>{if(u.isLoading){p.innerHTML=`<div>${r("global.loading_game_data")}</div>`;return}if(u.error){p.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl font-bold text-brand-secondary mb-4">${r("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${u.error}</p>
                    </div>
                </div>
            `;return}_e(n)});const ve=n=>{if(!n)return r("global.initializing");switch(n.phase){case"AWAITING_ADVENTURER_CHOICE":return r("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return r("main.adventurer_facing_encounter");default:return r("global.loading")}},xe=n=>{switch(n.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>';case"DESIGNER_CHOOSING_DIFFICULTY":return'<div class="lg:col-span-3"><battle-panel></battle-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${ve(n)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>${r("main.unhandled_game_phase",{phase:n.phase})}</div></div>`}},_e=n=>{if(!n){p.innerHTML=`<div>${r("global.loading")}</div>`;return}if(n.phase==="SHOP"){p.innerHTML="<workshop-screen></workshop-screen>";const i=document.querySelector("workshop-screen");i&&(i.items=n.shopItems,i.balancePoints=n.designer.balancePoints);return}const e=n.gameOver.isOver?`<game-over-screen
                final-bp="${n.designer.balancePoints}"
                reason="${n.gameOver.reason}"
                run="${n.run}"
                decision="${u.getAdventurerEndRunDecision()}"
            ></game-over-screen>`:"";p.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${e}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <log-panel></log-panel>
                    <game-stats
                        balance-points="${n.designer.balancePoints}"
                        run="${n.run}"
                        room="${n.room}"
                        deck-size="${n.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${n.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${xe(n)}
            </div>
        </div>
    `;const s=document.querySelector("adventurer-status");s&&(s.adventurer=n.adventurer);const t=document.querySelector("loot-choice-panel");t&&(t.choices=n.hand,t.disabled=!1);const a=document.querySelector("log-panel");a&&(a.logger=n.logger,a.traits=n.adventurer.traits)};p.addEventListener("present-offer",n=>{const{ids:e}=n.detail;u.presentOffer(e)});p.addEventListener("run-encounter",n=>{const{encounter:e}=n.detail;u.runEncounter(e)});p.addEventListener("enter-workshop",()=>{u.enterWorkshop()});p.addEventListener("purchase-item",n=>{const{itemId:e}=n.detail;u.purchaseItem(e)});p.addEventListener("start-run",()=>{u.startNewRun()});p.addEventListener("start-game",()=>{u.startNewGame()});async function we(){await W(),await u.init(),p.innerHTML=`<div>${r("global.initializing")}</div>`,u.startNewGame()}we();
