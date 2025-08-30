(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();let q={};async function A(r){try{const e=await fetch(`/rogue-steward/locales/${r}.json`);if(!e.ok)throw new Error(`Could not load ${r}.json`);q=await e.json()}catch(e){console.warn(`Failed to load ${r} translations:`,e),r!=="en"&&await A("en")}}function P(){return navigator.language.split("-")[0]}function n(r,e={}){let t=r.split(".").reduce((i,a)=>i?i[a]:null,q);if(!t)return console.warn(`Translation not found for key: ${r}`),r;for(const i in e)t=t.replace(`{${i}}`,String(e[i]));return t}async function G(){const r=P();await A(r)}const M=15,B=3,F={Common:1,Uncommon:2,Rare:3},E={hp:100,maxHp:100,power:5},U=10,I=10,Z=["loot_1","loot_2","loot_3","loot_4","loot_5"],j=32,w=9,O=300,R=r=>[...r].sort(()=>Math.random()-.5),N=(r,e)=>{let s=0;const t=new Map(e.map(l=>[l.id,l])),i=r.map(l=>t.get(l)).filter(Boolean),a=l=>(s++,{...l,instanceId:`${l.id}-${s}`}),o=i.filter(l=>l.cost===null),b=i.filter(l=>l.cost!==null);let p=[];if(o.length>0)for(const l of o)p.push(a(l),a(l),a(l),a(l));p.push(...b.map(a));let u=0;for(;p.length<j&&o.length>0;)p.push(a(o[u%o.length])),u++;return R(p)};class W{constructor(){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._listeners={},this.init=async()=>{await this._loadGameData()},this.startNewGame=()=>{const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:0},s={...E,interest:33+Math.floor(Math.random()*50),traits:e,inventory:{weapon:null,armor:null,potions:[]}},t=Z,i=N(t,this._allItems),a=i.slice(0,w),o=i.slice(w);this.gameState&&this.gameState.log&&console.log("previous game log dump:",this.gameState.log),this.gameState={phase:"DESIGNER_CHOOSING_DIFFICULTY",designer:{balancePoints:0},adventurer:s,unlockedDeck:t,availableDeck:o,hand:a,shopItems:[],offeredLoot:[],feedback:n("game_engine.new_adventurer"),log:["--- Starting New Game (Run 1) ---"],run:1,room:1,gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.startNewRun=()=>{if(!this.gameState)return;const e=N(this.gameState.unlockedDeck,this._allItems),s=e.slice(0,w),t=e.slice(w),i={...E,interest:this.gameState.adventurer.interest,traits:this.gameState.adventurer.traits,inventory:{weapon:null,armor:null,potions:[]}};this.gameState={...this.gameState,adventurer:i,phase:"DESIGNER_CHOOSING_DIFFICULTY",availableDeck:t,hand:s,room:1,feedback:n("game_engine.adventurer_returns"),log:[...this.gameState.log,`--- Starting Run ${this.gameState.run} ---`],gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(t=>e.includes(t.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:t,reason:i,logs:a}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot);let o={...this.gameState.adventurer},b=o.interest,p=this.gameState.hand,u=this.gameState.availableDeck;p.forEach(h=>h.justDrafted=!1);let l=p.filter(h=>!e.includes(h.instanceId));const f=w-l.length,_=u.slice(0,f);_.forEach(h=>{h.draftedRoom=this.gameState.room,h.justDrafted=!0});const v=u.slice(f);if(l.push(..._),t){let h={...o.inventory,potions:[...o.inventory.potions]};t.type==="Weapon"?h.weapon=t:t.type==="Armor"?h.armor=t:t.type==="Potion"&&h.potions.push(t);const{power:y,maxHp:x}=this._recalculateStats(h),S=x-o.maxHp;o.inventory=h,o.power=y,o.maxHp=x,o.hp+=Math.max(0,S)}else b=Math.max(0,this.gameState.adventurer.interest-10);const d=this.gameState.room+1,c=this.gameState.designer.balancePoints+I;this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:{...o,interest:b},feedback:i,availableDeck:v,hand:l,log:[...this.gameState.log,...a],room:d,designer:{balancePoints:c}},this._emit("state-change",this.gameState)},O)},this.runDebugEncounter=e=>{!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_DIFFICULTY"||(this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.debugEncounterParams=e,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.debugEncounterParams)return;const{newAdventurer:s,feedback:t,logs:i}=this._getDebugEncounterOutcome(this.gameState.adventurer,this.gameState.room,this.gameState.debugEncounterParams),a=[...this.gameState.log,...i];if(s.hp<=0){a.push("GAME OVER: Adventurer has fallen in battle."),this.gameState={...this.gameState,adventurer:s,designer:{balancePoints:this.gameState.designer.balancePoints+I},phase:"RUN_OVER",gameOver:{isOver:!0,reason:n("game_engine.adventurer_fell",{room:this.gameState.room,run:this.gameState.run})},log:a},this._emit("state-change",this.gameState);return}if(s.interest<=M){a.push("GAME OVER: Adventurer lost interest and quit."),this.gameState={...this.gameState,adventurer:s,designer:{balancePoints:this.gameState.designer.balancePoints+I},phase:"RUN_OVER",gameOver:{isOver:!0,reason:n("game_engine.adventurer_bored",{room:this.gameState.room,run:this.gameState.run})},log:a},this._emit("state-change",this.gameState);return}let o=t;this.gameState.hand&&this.gameState.hand.length===0?(a.push("Your hand is empty! The adventurer must press on without new items."),o=n("game_engine.empty_hand"),this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:s,room:this.gameState.room+1,designer:{balancePoints:this.gameState.designer.balancePoints+I},feedback:o,log:a,debugEncounterParams:void 0}):this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:s,feedback:o,log:a,debugEncounterParams:void 0},this._emit("state-change",this.gameState)},O))},this.enterWorkshop=()=>{if(!this.gameState)return;const e=this.gameState.run+1,s=this._allItems.filter(t=>t.cost!==null).filter(t=>!this.gameState.unlockedDeck.includes(t.id)).filter(t=>e>=t.minRun);this.gameState={...this.gameState,phase:"SHOP",run:e,room:0,shopItems:R(s).slice(0,4),gameOver:{isOver:!1,reason:""},feedback:n("game_engine.welcome_to_workshop")},this._emit("state-change",this.gameState)},this.purchaseItem=e=>{if(!this.gameState)return;const s=this._allItems.find(o=>o.id===e);if(!s||s.cost===null||this.gameState.designer.balancePoints<s.cost)return;const t=[...this.gameState.unlockedDeck,e],i=this.gameState.designer.balancePoints-s.cost,a=this.gameState.shopItems.filter(o=>o.id!==e);this.gameState={...this.gameState,designer:{balancePoints:i},unlockedDeck:t,shopItems:a,log:[...this.gameState.log,`Purchased ${s.name}.`]},this._emit("state-change",this.gameState)}}on(e,s){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(s)}_emit(e,s){const t=this._listeners[e];t&&t.forEach(i=>i(s))}_recalculateStats(e){let s=E.power,t=E.maxHp;return e.weapon&&(s+=e.weapon.stats.power||0,t+=e.weapon.stats.maxHp||0),e.armor&&(s+=e.armor.stats.power||0,t+=e.armor.stats.maxHp||0),{power:s,maxHp:t}}_getAdventurerChoice(e,s){var _,v;const{traits:t,inventory:i}=e,a=[`--- Adventurer Decision --- (Offense: ${t.offense}, Risk: ${t.risk})`],o=((_=i.weapon)==null?void 0:_.stats.power)||0,b=((v=i.armor)==null?void 0:v.stats.maxHp)||0;a.push(`Current Gear: Weapon Power(${o}), Armor HP(${b})`);const p=d=>{var h,y;let c=(F[d.rarity]||1)*5;switch(d.type){case"Weapon":const x=(d.stats.power||0)-o;if(x<=0&&d.id!==((h=i.weapon)==null?void 0:h.id))return-1;c+=x*(t.offense/10),x>0&&(c+=x*(t.expertise/10));const S=d.stats.maxHp||0;S<0&&(c+=S*(100-t.risk)/20);break;case"Armor":const $=(d.stats.maxHp||0)-b;if($<=0&&d.id!==((y=i.armor)==null?void 0:y.id))return-1;c+=$*(100-t.offense)/10,$>0&&(c+=$*(t.expertise/10));const C=d.stats.power||0;C>0&&(c+=C*(t.offense/15));const T=d.stats.power||0;T<0&&(c+=T*(t.risk/10));break;case"Potion":const H=e.hp/e.maxHp;c+=10*(100-t.risk)/100,H<.7&&(c+=20*(1-H)),c+=5*(t.expertise/100),i.potions.length>=B&&(c*=.1);break}return c+Math.random()},u=s.map(d=>({item:d,score:p(d)})).filter(d=>d.score>0);if(u.sort((d,c)=>c.score-d.score),u.length===0||u[0].score<U)return{choice:null,reason:n("game_engine.adventurer_declines_offer"),logs:a};const l=u[0].item;let f=n("game_engine.adventurer_accepts_offer",{itemName:l.name});return{choice:l,reason:f,logs:a}}_getDebugEncounterOutcome(e,s,t){const i=[`--- DEBUG Encounter: Room ${s} ---`];let a=JSON.parse(JSON.stringify(e)),o="";const b=a.hp/a.maxHp,p=1-a.traits.risk/120;if(b<p&&a.inventory.potions.length>0){const d=a.inventory.potions.shift(),c=d.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+c),o=n("game_engine.adventurer_drinks_potion",{potionName:d.name})}let u=Math.round(t.baseDamage*t.difficultyFactor);u=Math.max(0,u),a.hp-=u;let l=0,f="";const _=u/a.maxHp;let v="Normal";return t.difficultyFactor<=.8?v="Easy":t.difficultyFactor>=1.3&&(v="Hard"),v==="Easy"?(l=-5-Math.floor((100-a.traits.risk)/20),f=n("game_engine.easy_fight")):_<.1?(l=-2,f=n("game_engine.worthy_challenge")):_<.35?(l=5+Math.floor(a.traits.offense/20)+(v==="Hard"?5:0),f=n("game_engine.great_battle")):(l=-10-Math.floor((100-a.traits.risk)/10),f=n("game_engine.too_close_for_comfort")),a.interest=Math.max(0,Math.min(100,a.interest+l)),a.traits.expertise+=1,{newAdventurer:a,feedback:o+f,damageTaken:u,logs:i}}getAdventurerEndRunDecision(){if(!this.gameState)return"retire";const{interest:e}=this.gameState.adventurer,s=e-M,t=(Math.random()-.5)*20;return s+t>0?"continue":"retire"}async _loadGameData(){try{const e=await fetch("/rogue-steward/game/items.json");if(!e.ok)throw new Error(n("global.error_loading_items",{statusText:e.statusText}));this._allItems=await e.json(),this.startNewGame()}catch(e){this.error=e.message||n("global.unknown_error"),this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class Q extends HTMLElement{constructor(){super(),this._balancePoints=0,this._run=0,this._room=0,this._deckSize=0}static get observedAttributes(){return["balance-points","run","room","deck-size"]}attributeChangedCallback(e,s,t){switch(e){case"balance-points":this._balancePoints=Number(t);break;case"run":this._run=Number(t);break;case"room":this._room=Number(t);break;case"deck-size":this._deckSize=Number(t);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.bp")}</span>
                    <p class="text-2xl font-bold text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.run")}</span>
                    <p class="text-2xl font-bold text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.room")}</span>
                    <p class="text-2xl font-bold text-white">${this._room}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">${n("global.deck")}</span>
                    <p class="text-2xl font-bold text-white">${this._deckSize}</p>
                </div>
            </div>
        `}}customElements.define("game-stats",Q);class V extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,s,t){e==="message"&&(this._message=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",V);const z=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',Y=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',K=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',J=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',X=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',ee=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class te extends HTMLElement{constructor(){super(),this._adventurer=null}set adventurer(e){this._adventurer=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="";return}const e=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl font-bold font-serif mb-4 text-center text-white">${n("adventurer_status.title")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${z()} <span class="font-semibold text-lg">${n("global.health")}</span></div>
                                <span class="font-mono text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${e}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${K()} <span class="font-semibold text-lg">${n("adventurer_status.interest")}</span></div>
                                <span class="font-mono text-lg">${this._adventurer.interest}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${Y()}
                        <span class="font-semibold text-lg mr-4">${n("global.power")}</span>
                        <span class="font-mono text-2xl font-bold text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg font-bold font-serif mb-3 text-center text-white">${n("adventurer_status.inventory")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${J()} <span class="ml-2 font-semibold">${n("adventurer_status.weapon")}</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white font-semibold">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.pwr")}: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, ${n("adventurer_status.hp")}: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${X()} <span class="ml-2 font-semibold">${n("adventurer_status.armor")}</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white font-semibold">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">${n("adventurer_status.hp")}: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, ${n("adventurer_status.pwr")}: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${ee()} <span class="ml-2 font-semibold">${n("adventurer_status.potions")}</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white font-semibold">${n("adventurer_status.potions_held",{count:this._adventurer.inventory.potions.length})}</p>`:`<p class="text-brand-text-muted italic">${n("global.none")}</p>`}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",te);const se={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},k=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `};class ae extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("loot-card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=se[this._item.rarity]||"text-gray-400",s="bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let t="";this._isDisabled?t="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?t="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":t="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const i=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${s} ${t}${i}`,this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${e}">${this._item.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text">
                    ${this._item.stats.hp?k(n("global.health"),this._item.stats.hp):""}
                    ${this._item.stats.maxHp?k(n("global.max_hp"),this._item.stats.maxHp):""}
                    ${this._item.stats.power?k(n("global.power"),this._item.stats.power):""}
                </div>
            </div>
        `}}customElements.define("loot-card",ae);const L=4;class ne extends HTMLElement{constructor(){super(),this._choices=[],this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("loot-card-select",e=>{const{instanceId:s}=e.detail;this.handleSelect(s)}),this.addEventListener("click",e=>{e.target.id==="present-offer-button"&&this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}))})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const s=new Map(this._choices.map(a=>[a.instanceId,a.id])),t=this._choices.find(a=>a.instanceId===e);if(!t)return;if(this._selectedIds.includes(e))this._selectedIds=this._selectedIds.filter(a=>a!==e);else{if(this._selectedIds.map(o=>s.get(o)).includes(t.id))return;this._selectedIds.length<L&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=new Map(this._choices.map(a=>[a.instanceId,a.id])),s=this._selectedIds.map(a=>e.get(a)),t=this._selectedIds.length>=2&&this._selectedIds.length<=L;this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl font-bold text-center mb-4 text-white">${n("loot_choice_panel.title")}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!t||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        ${n("loot_choice_panel.present_offer")} (${this._selectedIds.length}/${L})
                    </button>
                </div>
            </div>
        `;const i=this.querySelector("#loot-card-container");i&&this._choices.forEach(a=>{const o=document.createElement("loot-card");o.item=a,o.isSelected=this._selectedIds.includes(a.instanceId);const b=!o.isSelected&&s.includes(a.id);o.isDisabled=b||this._disabled,o.isNewlyDrafted=a.justDrafted&&this._initialRender||!1,i.appendChild(o)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("loot-choice-panel",ne);class re extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,s,t){e==="text"&&(this._text=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 rounded-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white font-semibold">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",re);class ie extends HTMLElement{constructor(){super(),this._defaultBaseDamage=10,this.addEventListener("submit",e=>{e.preventDefault();const s=this.querySelector("#base-damage"),t=this.querySelector("#difficulty-factor"),i={baseDamage:parseFloat(s.value)||0,difficultyFactor:parseFloat(t.value)||0};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{params:i}}))})}set defaultBaseDamage(e){this._defaultBaseDamage=e;const s=this.querySelector("#base-damage");s&&(s.value=this._defaultBaseDamage.toString())}connectedCallback(){this.render(),this.defaultBaseDamage=this._defaultBaseDamage}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl font-bold text-center mb-2 text-white">${n("debug_encounter_panel.title")}</h3>
                <p class="text-center text-brand-text-muted mb-6">${n("debug_encounter_panel.description")}</p>
                <form class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="base-damage" class="block text-sm font-medium text-brand-text-muted mb-1">${n("debug_encounter_panel.base_damage")}</label>
                        <input
                            id="base-damage"
                            type="number"
                            step="1"
                            value="${this._defaultBaseDamage}"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="${n("debug_encounter_panel.base_damage")}"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <label for="difficulty-factor" class="block text-sm font-medium text-brand-text-muted mb-1">${n("debug_encounter_panel.difficulty_factor")}</label>
                        <input
                            id="difficulty-factor"
                            type="number"
                            step="0.1"
                            value="1.0"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="${n("debug_encounter_panel.difficulty_factor")}"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <button
                            type="submit"
                            class="w-full bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            ${n("debug_encounter_panel.run_encounter")}
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("debug-encounter-panel",ie);class oe extends HTMLElement{constructor(){super(),this._logs=[],this._traits=null}set logs(e){this._logs=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}render(){if(!this._traits){this.innerHTML="";return}const e=this._logs.map((t,i)=>`<p class="whitespace-pre-wrap">[${i.toString().padStart(3,"0")}] ${t}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">${n("debug_log.title")}</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${n("debug_log.offense")}</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${n("debug_log.risk")}</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">${n("debug_log.expertise")}</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono text-gray-400 space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("debug-log",oe);class le extends HTMLElement{constructor(){super(),this.state="initial",this.decision=null,this.addEventListener("click",e=>{const s=e.target;s.id==="enter-workshop-button"?this.dispatchEvent(new CustomEvent("enter-workshop",{bubbles:!0,composed:!0})):s.id==="new-adventurer-button"&&this.dispatchEvent(new CustomEvent("start-game",{bubbles:!0,composed:!0}))})}connectedCallback(){this.state==="initial"&&(this.render(),this.revealDecision())}revealDecision(){this.state="revealing",setTimeout(()=>{this.decision=this.getAttribute("decision")||"retire",this.state="revealed",this.updateDecision(!0)},2e3)}render(){const e=this.getAttribute("final-bp")||0,s=this.getAttribute("reason")||n("game_over_screen.default_reason");this.innerHTML=`
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
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">${n("game_over_screen.run_complete")}</h2>
                    <p class="text-brand-text-muted mb-4">${s}</p>
                    <p class="text-lg text-white mb-6">${n("game_over_screen.final_bp")}<span class="font-bold text-2xl text-amber-400">${e}</span></p>
                    <div id="decision-container" class="h-24">
                        <p class="text-brand-text-muted text-lg animate-fade-in-up">${n("game_over_screen.adventurer_considers_fate")}<span class="animate-dots"></span></p>
                    </div>
                    <div id="button-container" class="flex justify-center gap-4 mt-4">
                        <!-- Buttons will be revealed here -->
                    </div>
                </div>
            </div>
        `}updateDecision(e){const s=this.querySelector("#decision-container"),t=this.querySelector("#button-container");if(!s||!t)return;let i="",a="";const o=e?"animate-fade-in-up":"";this.decision==="continue"?(i=`
                <h3 class="text-2xl font-bold text-green-400 mb-2 ${o}">${n("game_over_screen.continue_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${n("game_over_screen.continue_decision")}</p>
            `,a+=`
                <button
                    id="enter-workshop-button"
                    class="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1.2s;"
                >
                    ${n("game_over_screen.enter_workshop")}
                </button>
            `):(i=`
                <h3 class="text-2xl font-bold text-red-400 mb-2 ${o}">${n("game_over_screen.retire_quote")}</h3>
                <p class="text-brand-text mb-4 ${o}" style="animation-delay: 0.5s;">${n("game_over_screen.retire_decision")}</p>
            `,a+=`
                <button
                    id="new-adventurer-button"
                    class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105 ${o}"
                    style="animation-delay: 1s;"
                >
                    ${n("game_over_screen.recruit_new_adventurer")}
                </button>
            `),s.innerHTML=i,t.innerHTML=a}}customElements.define("game-over-screen",le);const D=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `},de=(r,e)=>{const t={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${t}">${r.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${r.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${t}">${r.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${r.stats.hp?D(n("global.health"),r.stats.hp):""}
                    ${r.stats.maxHp?D(n("global.max_hp"),r.stats.maxHp):""}
                    ${r.stats.power?D(n("global.power"),r.stats.power):""}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${r.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ${n("global.buy")} (${r.cost} ${n("global.bp")})
                </button>
            </div>
        </div>
    `};class ce extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const s=e.target,t=s.dataset.itemId;t&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:t}})),s.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(s=>de(s,this._balancePoints>=(s.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold font-serif text-white">${n("workshop.title")}</h1>
                    <p class="text-brand-text-muted">${n("workshop.description")}</p>
                    <p class="mt-4 text-2xl font-bold">
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
                        class="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        ${n("workshop.begin_next_run")}
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",ce);const g=document.getElementById("app");if(!g)throw new Error("Could not find app element to mount to");const m=new W;m.on("state-change",r=>{if(m.isLoading){g.innerHTML=`<div>${n("global.loading_game_data")}</div>`;return}if(m.error){g.innerHTML=`
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                         <h2 class="text-2xl font-bold text-brand-secondary mb-4">${n("global.an_error_occurred")}</h2>
                         <p class="text-brand-text">${m.error}</p>
                    </div>
                </div>
            `;return}me(r)});const ue=r=>{if(!r)return n("global.initializing");switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return n("main.adventurer_considering_offer");case"AWAITING_ENCOUNTER_FEEDBACK":return n("main.adventurer_facing_encounter");default:return n("global.loading")}},he=r=>{switch(r.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>';case"DESIGNER_CHOOSING_DIFFICULTY":return'<div class="lg:col-span-3"><debug-encounter-panel></debug-encounter-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${ue(r)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>${n("main.unhandled_game_phase",{phase:r.phase})}</div></div>`}},me=r=>{if(!r){g.innerHTML=`<div>${n("global.loading")}</div>`;return}if(r.phase==="SHOP"){g.innerHTML="<workshop-screen></workshop-screen>";const o=document.querySelector("workshop-screen");o&&(o.items=r.shopItems,o.balancePoints=r.designer.balancePoints);return}const e=r.gameOver.isOver?`<game-over-screen
                final-bp="${r.designer.balancePoints}"
                reason="${r.gameOver.reason}"
                run="${r.run}"
                decision="${m.getAdventurerEndRunDecision()}"
            ></game-over-screen>`:"";g.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${e}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <debug-log></debug-log>
                    <game-stats
                        balance-points="${r.designer.balancePoints}"
                        run="${r.run}"
                        room="${r.room}"
                        deck-size="${r.availableDeck.length}"
                    ></game-stats>
                    <feedback-panel message="${r.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${he(r)}
            </div>
        </div>
    `;const s=document.querySelector("adventurer-status");s&&(s.adventurer=r.adventurer);const t=document.querySelector("loot-choice-panel");t&&(t.choices=r.hand,t.disabled=!1);const i=document.querySelector("debug-encounter-panel");if(i){const o=Math.max(1,15-Math.floor(r.adventurer.power/4)+Math.floor(r.room*1.5));i.defaultBaseDamage=o}const a=document.querySelector("debug-log");a&&(a.logs=r.log,a.traits=r.adventurer.traits)};g.addEventListener("present-offer",r=>{const{ids:e}=r.detail;m.presentOffer(e)});g.addEventListener("run-encounter",r=>{const{params:e}=r.detail;m.runDebugEncounter(e)});g.addEventListener("enter-workshop",()=>{m.enterWorkshop()});g.addEventListener("purchase-item",r=>{const{itemId:e}=r.detail;m.purchaseItem(e)});g.addEventListener("start-run",()=>{m.startNewRun()});g.addEventListener("start-game",()=>{m.startNewGame()});async function ge(){await G(),await m.init(),g.innerHTML=`<div>${n("global.initializing")}</div>`,m.startNewGame()}ge();
