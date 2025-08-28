(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const C=15,O=3,M={Common:1,Uncommon:2,Rare:3},y={hp:100,maxHp:100,power:5},N=10,A=10,P=["loot_1","loot_2","loot_3","loot_4","loot_5"],q=32,S=9,D=300,H=r=>[...r].sort(()=>Math.random()-.5),R=(r,e)=>{let s=0;const t=new Map(e.map(l=>[l.id,l])),n=r.map(l=>t.get(l)).filter(Boolean),a=l=>(s++,{...l,instanceId:`${l.id}-${s}`}),i=n.filter(l=>l.cost===null),c=n.filter(l=>l.cost!==null);let u=[];if(i.length>0)for(const l of i)u.push(a(l),a(l),a(l),a(l));u.push(...c.map(a));let d=0;for(;u.length<q&&i.length>0;)u.push(a(i[d%i.length])),d++;return H(u)};class B{constructor(){this.gameState=null,this.isLoading=!0,this.error=null,this._allItems=[],this._listeners={},this.startNewRun=()=>{if(!this.gameState)return;const e={offense:Math.floor(Math.random()*81)+10,risk:Math.floor(Math.random()*81)+10,expertise:Math.min(100,this.gameState.adventurer.traits.expertise+5*(this.gameState.run-1))},s={...y,interest:33+Math.floor(Math.random()*50),traits:e,inventory:{weapon:null,armor:null,potions:[]}},t=R(this.gameState.unlockedDeck,this._allItems),n=t.slice(0,S),a=t.slice(S);this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_LOOT",adventurer:s,availableDeck:a,hand:n,floor:1,feedback:"A new adventurer enters the dungeon!",log:[`--- Starting Run ${this.gameState.run} ---`],gameOver:{isOver:!1,reason:""}},this._emit("state-change",this.gameState)},this.presentOffer=e=>{if(!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_LOOT"||!this.gameState.hand)return;const s=this.gameState.hand.filter(t=>e.includes(t.instanceId));this.gameState.phase="AWAITING_ADVENTURER_CHOICE",this.gameState.offeredLoot=s,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ADVENTURER_CHOICE"||!this.gameState.hand)return;const{choice:t,reason:n,logs:a}=this._getAdventurerChoice(this.gameState.adventurer,this.gameState.offeredLoot);let i={...this.gameState.adventurer},c=i.interest,u=this.gameState.hand,d=this.gameState.availableDeck;u.forEach(o=>o.justDrafted=!1);let l=u.filter(o=>!e.includes(o.instanceId));const p=S-l.length,b=d.slice(0,p);b.forEach(o=>{o.draftedFloor=this.gameState.floor,o.justDrafted=!0});const f=d.slice(p);if(l.push(...b),t){let o={...i.inventory,potions:[...i.inventory.potions]};t.type==="Weapon"?o.weapon=t:t.type==="Armor"?o.armor=t:t.type==="Potion"&&o.potions.push(t);const{power:h,maxHp:v}=this._recalculateStats(o),x=v-i.maxHp;i.inventory=o,i.power=h,i.maxHp=v,i.hp+=Math.max(0,x)}else c=Math.max(0,this.gameState.adventurer.interest-10);this.gameState={...this.gameState,phase:"DESIGNER_CHOOSING_DIFFICULTY",adventurer:{...i,interest:c},feedback:n,availableDeck:f,hand:l,log:[...this.gameState.log,...a]},this._emit("state-change",this.gameState)},D)},this.runDebugEncounter=e=>{!this.gameState||this.gameState.phase!=="DESIGNER_CHOOSING_DIFFICULTY"||(this.gameState.phase="AWAITING_ENCOUNTER_FEEDBACK",this.gameState.debugEncounterParams=e,this._emit("state-change",this.gameState),setTimeout(()=>{if(!this.gameState||this.gameState.phase!=="AWAITING_ENCOUNTER_FEEDBACK"||!this.gameState.debugEncounterParams)return;const{newAdventurer:s,feedback:t,logs:n}=this._getDebugEncounterOutcome(this.gameState.adventurer,this.gameState.floor,this.gameState.debugEncounterParams),a=this.gameState.floor+1,i=this.gameState.designer.balancePoints+A,c=[...this.gameState.log,...n];if(s.hp<=0){c.push("GAME OVER: Adventurer has fallen in battle."),this.gameState={...this.gameState,adventurer:s,designer:{balancePoints:i},phase:"RUN_OVER",gameOver:{isOver:!0,reason:`The adventurer fell on floor ${this.gameState.floor}.`},log:c},this._emit("state-change",this.gameState);return}if(s.interest<=C){c.push("GAME OVER: Adventurer lost interest and left."),this.gameState={...this.gameState,adventurer:s,designer:{balancePoints:i},phase:"RUN_OVER",gameOver:{isOver:!0,reason:`The adventurer grew bored on floor ${this.gameState.floor} and left.`},log:c},this._emit("state-change",this.gameState);return}let u="DESIGNER_CHOOSING_LOOT",d=t;this.gameState.hand&&this.gameState.hand.length===0&&(u="DESIGNER_CHOOSING_DIFFICULTY",c.push("Your hand is empty! The adventurer must press on without new items."),d="The adventurer waits for your decision, unaware that you have nothing left to offer."),this.gameState={...this.gameState,phase:u,adventurer:s,floor:a,designer:{balancePoints:i},feedback:d,log:c,debugEncounterParams:void 0},this._emit("state-change",this.gameState)},D))},this.enterWorkshop=()=>{if(!this.gameState)return;const e=this.gameState.run+1,s=this._allItems.filter(t=>t.cost!==null).filter(t=>!this.gameState.unlockedDeck.includes(t.id)).filter(t=>e>=t.minRun);this.gameState={...this.gameState,phase:"SHOP",run:e,floor:0,shopItems:H(s).slice(0,4),gameOver:{isOver:!1,reason:""},feedback:"Welcome back. Spend your Balance Points wisely."},this._emit("state-change",this.gameState)},this.purchaseItem=e=>{if(!this.gameState)return;const s=this._allItems.find(i=>i.id===e);if(!s||s.cost===null||this.gameState.designer.balancePoints<s.cost)return;const t=[...this.gameState.unlockedDeck,e],n=this.gameState.designer.balancePoints-s.cost,a=this.gameState.shopItems.filter(i=>i.id!==e);this.gameState={...this.gameState,designer:{balancePoints:n},unlockedDeck:t,shopItems:a,log:[...this.gameState.log,`Purchased ${s.name}.`]},this._emit("state-change",this.gameState)},this._loadGameData()}on(e,s){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(s)}_emit(e,s){const t=this._listeners[e];t&&t.forEach(n=>n(s))}_recalculateStats(e){let s=y.power,t=y.maxHp;return e.weapon&&(s+=e.weapon.stats.power||0,t+=e.weapon.stats.maxHp||0),e.armor&&(s+=e.armor.stats.power||0,t+=e.armor.stats.maxHp||0),{power:s,maxHp:t}}_getAdventurerChoice(e,s){var b,f;const{traits:t,inventory:n}=e,a=[`--- Adventurer Decision --- (Offense: ${t.offense}, Risk: ${t.risk})`],i=((b=n.weapon)==null?void 0:b.stats.power)||0,c=((f=n.armor)==null?void 0:f.stats.maxHp)||0;a.push(`Current Gear: Weapon Power(${i}), Armor HP(${c})`);const u=o=>{var v,x;let h=(M[o.rarity]||1)*5;switch(o.type){case"Weapon":const w=(o.stats.power||0)-i;if(w<=0&&o.id!==((v=n.weapon)==null?void 0:v.id))return-1;h+=w*(t.offense/10),w>0&&(h+=w*(t.expertise/10));const k=o.stats.maxHp||0;k<0&&(h+=k*(100-t.risk)/20);break;case"Armor":const _=(o.stats.maxHp||0)-c;if(_<=0&&o.id!==((x=n.armor)==null?void 0:x.id))return-1;h+=_*(100-t.offense)/10,_>0&&(h+=_*(t.expertise/10));const L=o.stats.power||0;L>0&&(h+=L*(t.offense/15));const T=o.stats.power||0;T<0&&(h+=T*(t.risk/10));break;case"Potion":const $=e.hp/e.maxHp;h+=10*(100-t.risk)/100,$<.7&&(h+=20*(1-$)),h+=5*(t.expertise/100),n.potions.length>=O&&(h*=.1);break}return h+Math.random()},d=s.map(o=>({item:o,score:u(o)})).filter(o=>o.score>0);if(d.sort((o,h)=>h.score-o.score),d.length===0||d[0].score<N)return{choice:null,reason:"They examine your offers but decide to take nothing.",logs:a};const l=d[0].item;let p=`They pick the ${l.name}.`;return{choice:l,reason:p,logs:a}}_getDebugEncounterOutcome(e,s,t){const n=[`--- DEBUG Encounter: Floor ${s} ---`];let a=JSON.parse(JSON.stringify(e)),i="";const c=a.hp/a.maxHp,u=1-a.traits.risk/120;if(c<u&&a.inventory.potions.length>0){const o=a.inventory.potions.shift(),h=o.stats.hp||0;a.hp=Math.min(a.maxHp,a.hp+h),i=`Sensing danger, they drink a ${o.name}. `}let d=Math.round(t.baseDamage*t.difficultyFactor);d=Math.max(0,d),a.hp-=d;let l=0,p="";const b=d/a.maxHp;let f="Normal";return t.difficultyFactor<=.8?f="Easy":t.difficultyFactor>=1.3&&(f="Hard"),f==="Easy"?(l=-5-Math.floor((100-a.traits.risk)/20),p="An easy fight. Too easy..."):b<.1?(l=-2,p="A worthy, but simple challenge."):b<.35?(l=5+Math.floor(a.traits.offense/20)+(f==="Hard"?5:0),p="A great battle! They feel alive!"):(l=-10-Math.floor((100-a.traits.risk)/10),p="That was far too close for comfort."),a.interest=Math.max(0,Math.min(100,a.interest+l)),{newAdventurer:a,feedback:i+p,damageTaken:d,logs:n}}async _loadGameData(){try{const e=await fetch("/game/items.json");if(!e.ok)throw new Error(`Failed to load items.json: ${e.statusText}`);this._allItems=await e.json(),this.gameState={phase:"LOADING",designer:{balancePoints:0},adventurer:{...y,interest:0,traits:{offense:0,risk:0,expertise:0},inventory:{weapon:null,armor:null,potions:[]}},unlockedDeck:P,availableDeck:[],hand:[],shopItems:[],offeredLoot:[],feedback:"",log:[],run:1,floor:0,gameOver:{isOver:!1,reason:""}},this.startNewRun()}catch(e){this.error=e.message||"An unknown error occurred while loading game data.",this._emit("error",null)}finally{this.isLoading=!1,this._emit("state-change",this.gameState)}}}class G extends HTMLElement{constructor(){super(),this._balancePoints=0,this._run=0,this._floor=0}static get observedAttributes(){return["balance-points","run","floor"]}attributeChangedCallback(e,s,t){switch(e){case"balance-points":this._balancePoints=Number(t);break;case"run":this._run=Number(t);break;case"floor":this._floor=Number(t);break}this.render()}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">BP</span>
                    <p class="text-2xl font-bold text-white">${this._balancePoints}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">Run</span>
                    <p class="text-2xl font-bold text-white">${this._run}</p>
                </div>
                <div>
                    <span class="text-sm text-brand-text-muted uppercase tracking-wider">Floor</span>
                    <p class="text-2xl font-bold text-white">${this._floor}</p>
                </div>
            </div>
        `}}customElements.define("game-stats",G);class F extends HTMLElement{constructor(){super(),this._message=""}static get observedAttributes(){return["message"]}attributeChangedCallback(e,s,t){e==="message"&&(this._message=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
                <p>${this._message}</p>
            </div>
        `}}customElements.define("feedback-panel",F);const Z=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',U=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>',j=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>',W=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>',V=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>',Q=()=>'<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>';class K extends HTMLElement{constructor(){super(),this._adventurer=null}set adventurer(e){this._adventurer=e,this.render()}get adventurer(){return this._adventurer}connectedCallback(){this.render()}render(){if(!this._adventurer){this.innerHTML="";return}const e=this._adventurer.hp/this._adventurer.maxHp*100;this.innerHTML=`
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl font-bold font-serif mb-4 text-center text-white">Adventurer's Status</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${Z()} <span class="font-semibold text-lg">Health</span></div>
                                <span class="font-mono text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${e}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${j()} <span class="font-semibold text-lg">Interest</span></div>
                                <span class="font-mono text-lg">${this._adventurer.interest}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${U()}
                        <span class="font-semibold text-lg mr-4">Power</span>
                        <span class="font-mono text-2xl font-bold text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg font-bold font-serif mb-3 text-center text-white">Inventory</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${W()} <span class="ml-2 font-semibold">Weapon</span></div>
                        ${this._adventurer.inventory.weapon?`<div><p class="text-white font-semibold">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">Pwr: ${this._adventurer.inventory.weapon.stats.power||0}${this._adventurer.inventory.weapon.stats.maxHp?`, HP: ${this._adventurer.inventory.weapon.stats.maxHp}`:""}</p></div>`:'<p class="text-brand-text-muted italic">None</p>'}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${V()} <span class="ml-2 font-semibold">Armor</span></div>
                        ${this._adventurer.inventory.armor?`<div><p class="text-white font-semibold">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">HP: ${this._adventurer.inventory.armor.stats.maxHp||0}${this._adventurer.inventory.armor.stats.power?`, Pwr: ${this._adventurer.inventory.armor.stats.power}`:""}</p></div>`:'<p class="text-brand-text-muted italic">None</p>'}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${Q()} <span class="ml-2 font-semibold">Potions</span></div>
                        ${this._adventurer.inventory.potions.length>0?`<p class="text-white font-semibold">${this._adventurer.inventory.potions.length} held</p>`:'<p class="text-brand-text-muted italic">None</p>'}
                    </div>
                </div>
            </div>
        `}}customElements.define("adventurer-status",K);const Y={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"},E=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `};class z extends HTMLElement{constructor(){super(),this._item=null,this._isSelected=!1,this._isDisabled=!1,this._isNewlyDrafted=!1,this.addEventListener("click",()=>{!this._isDisabled&&this._item&&this.dispatchEvent(new CustomEvent("loot-card-select",{bubbles:!0,composed:!0,detail:{instanceId:this._item.instanceId}}))}),this.addEventListener("animationend",e=>{e.animationName==="newly-drafted-animation"&&this.classList.remove("animate-newly-drafted")})}set item(e){this._item=e,this.render()}get item(){return this._item}set isSelected(e){this._isSelected=e,this.render()}get isSelected(){return this._isSelected}set isDisabled(e){this._isDisabled=e,this.render()}get isDisabled(){return this._isDisabled}set isNewlyDrafted(e){this._isNewlyDrafted!==e&&(this._isNewlyDrafted=e,this._isNewlyDrafted&&this.classList.add("animate-newly-drafted"))}get isNewlyDrafted(){return this._isNewlyDrafted}connectedCallback(){this.render()}render(){if(!this._item)return;const e=Y[this._item.rarity]||"text-gray-400",s="bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg";let t="";this._isDisabled?t="border-gray-600 opacity-50 cursor-not-allowed":this._isSelected?t="border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform":t="border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105";const n=this.classList.contains("animate-newly-drafted")?" animate-newly-drafted":"";this.className=`${s} ${t}${n}`,this.innerHTML=`
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${e}">${this._item.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${this._item.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${e}">${this._item.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text">
                    ${this._item.stats.hp?E("Health",this._item.stats.hp):""}
                    ${this._item.stats.maxHp?E("Max HP",this._item.stats.maxHp):""}
                    ${this._item.stats.power?E("Power",this._item.stats.power):""}
                </div>
            </div>
        `}}customElements.define("loot-card",z);class J extends HTMLElement{constructor(){super(),this._choices=[],this._disabled=!1,this._selectedIds=[],this._initialRender=!0,this.addEventListener("loot-card-select",e=>{const{instanceId:s}=e.detail;this.handleSelect(s)}),this.addEventListener("click",e=>{e.target.id==="present-offer-button"&&this.dispatchEvent(new CustomEvent("present-offer",{bubbles:!0,composed:!0,detail:{ids:this._selectedIds}}))})}set choices(e){this._choices=e,this._initialRender=!0,this.render()}get choices(){return this._choices}set disabled(e){this._disabled=e,this.render()}get disabled(){return this._disabled}connectedCallback(){this.render()}handleSelect(e){if(this._disabled)return;const s=new Map(this._choices.map(a=>[a.instanceId,a.id])),t=this._choices.find(a=>a.instanceId===e);if(!t)return;if(this._selectedIds.includes(e))this._selectedIds=this._selectedIds.filter(a=>a!==e);else{if(this._selectedIds.map(i=>s.get(i)).includes(t.id))return;this._selectedIds.length<3&&this._selectedIds.push(e)}this.render()}render(){if(!this._choices)return;const e=new Map(this._choices.map(a=>[a.instanceId,a.id])),s=this._selectedIds.map(a=>e.get(a)),t=this._selectedIds.length>=2&&this._selectedIds.length<=3;this.innerHTML=`
            <div class="w-full">
                <h3 class="text-xl font-bold text-center mb-4 text-white">Offer Rewards (Choose 2 to 3)</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="loot-card-container">
                    <!-- Loot cards will be inserted here -->
                </div>
                <div class="text-center mt-6">
                    <button
                        id="present-offer-button"
                        ${!t||this._disabled?"disabled":""}
                        class="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Present Offer (${this._selectedIds.length}/3)
                    </button>
                </div>
            </div>
        `;const n=this.querySelector("#loot-card-container");n&&this._choices.forEach(a=>{const i=document.createElement("loot-card");i.item=a,i.isSelected=this._selectedIds.includes(a.instanceId);const c=!i.isSelected&&s.includes(a.id);i.isDisabled=c||this._disabled,i.isNewlyDrafted=a.justDrafted&&this._initialRender||!1,n.appendChild(i)}),setTimeout(()=>{this._initialRender=!1},0)}}customElements.define("loot-choice-panel",J);class X extends HTMLElement{constructor(){super(),this._text="Loading..."}static get observedAttributes(){return["text"]}attributeChangedCallback(e,s,t){e==="text"&&(this._text=t,this.render())}connectedCallback(){this.render()}render(){this.innerHTML=`
            <div class="text-center p-6 bg-brand-primary/50 rounded-lg">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
                <p class="text-lg text-white font-semibold">${this._text}</p>
            </div>
        `}}customElements.define("loading-indicator",X);class ee extends HTMLElement{constructor(){super(),this._defaultBaseDamage=10,this.addEventListener("submit",e=>{e.preventDefault();const s=this.querySelector("#base-damage"),t=this.querySelector("#difficulty-factor"),n={baseDamage:parseFloat(s.value)||0,difficultyFactor:parseFloat(t.value)||0};this.dispatchEvent(new CustomEvent("run-encounter",{bubbles:!0,composed:!0,detail:{params:n}}))})}set defaultBaseDamage(e){this._defaultBaseDamage=e;const s=this.querySelector("#base-damage");s&&(s.value=this._defaultBaseDamage.toString())}connectedCallback(){this.render(),this.defaultBaseDamage=this._defaultBaseDamage}render(){this.innerHTML=`
            <div class="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
                <h3 class="text-xl font-bold text-center mb-2 text-white">Debug Encounter</h3>
                <p class="text-center text-brand-text-muted mb-6">Override encounter parameters for testing.</p>
                <form class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div class="md:col-span-1">
                        <label for="base-damage" class="block text-sm font-medium text-brand-text-muted mb-1">Base Damage</label>
                        <input
                            id="base-damage"
                            type="number"
                            step="1"
                            value="${this._defaultBaseDamage}"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="Base Damage"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <label for="difficulty-factor" class="block text-sm font-medium text-brand-text-muted mb-1">Difficulty Factor</label>
                        <input
                            id="difficulty-factor"
                            type="number"
                            step="0.1"
                            value="1.0"
                            class="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                            aria-label="Difficulty Factor"
                        />
                    </div>
                    <div class="md:col-span-1">
                        <button
                            type="submit"
                            class="w-full bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105"
                        >
                            Run Encounter
                        </button>
                    </div>
                </form>
            </div>
        `}}customElements.define("debug-encounter-panel",ee);class te extends HTMLElement{constructor(){super(),this._logs=[],this._traits=null}set logs(e){this._logs=e,this.render()}set traits(e){this._traits=e,this.render()}connectedCallback(){this.render()}render(){if(!this._traits){this.innerHTML="";return}const e=this._logs.map((t,n)=>`<p class="whitespace-pre-wrap">[${n.toString().padStart(3,"0")}] ${t}</p>`).join("");this.innerHTML=`
            <div class="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
                <h4 class="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">Game Log & Debug Info</h4>

                <div class="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">OFFENSE</span>
                        <span class="font-mono text-white text-base">${this._traits.offense}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">RISK</span>
                        <span class="font-mono text-white text-base">${this._traits.risk}</span>
                    </div>
                    <div class="text-xs">
                        <span class="font-bold text-brand-text-muted block">EXPERTISE</span>
                        <span class="font-mono text-white text-base">${this._traits.expertise}</span>
                    </div>
                </div>

                <div class="max-h-48 overflow-y-auto text-xs font-mono text-gray-400 space-y-1 pr-2" id="log-container">
                    ${e}
                </div>
            </div>
        `;const s=this.querySelector("#log-container");s&&(s.scrollTop=s.scrollHeight)}}customElements.define("debug-log",te);class se extends HTMLElement{constructor(){super(),this.addEventListener("click",e=>{e.target.id==="enter-workshop-button"&&this.dispatchEvent(new CustomEvent("enter-workshop",{bubbles:!0,composed:!0}))})}connectedCallback(){this.render()}render(){const e=this.getAttribute("final-bp")||0,s=this.getAttribute("reason")||"The run has ended.";this.innerHTML=`
            <div class="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in">
                    <h2 class="text-4xl font-bold font-serif text-brand-secondary mb-2">Run Complete!</h2>
                    <p class="text-brand-text-muted mb-4">${s}</p>
                    <p class="text-lg text-white mb-6">Final BP: <span class="font-bold text-2xl text-amber-400">${e}</span></p>
                    <button
                        id="enter-workshop-button"
                        class="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105"
                    >
                        Enter Workshop
                    </button>
                </div>
            </div>
        `}}customElements.define("game-over-screen",se);const I=(r,e)=>{const s=e>0;return`
        <div class="flex justify-between text-sm ${s?"text-green-400":"text-red-400"}">
            <span>${r}</span>
            <span class="font-mono">${s?"+":""}${e}</span>
        </div>
    `},ae=(r,e)=>{const t={Common:"text-rarity-common",Uncommon:"text-rarity-uncommon",Rare:"text-rarity-rare"}[r.rarity]||"text-gray-400";return`
        <div class="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div class="flex justify-between items-baseline">
                    <p class="font-bold text-lg ${t}">${r.name}</p>
                    <p class="text-xs text-brand-text-muted font-mono">${r.type}</p>
                </div>
                <p class="text-xs uppercase tracking-wider mb-3 ${t}">${r.rarity}</p>
                <div class="border-t border-gray-700 my-2"></div>
                <div class="space-y-1 text-brand-text mb-4">
                    ${r.stats.hp?I("Health",r.stats.hp):""}
                    ${r.stats.maxHp?I("Max HP",r.stats.maxHp):""}
                    ${r.stats.power?I("Power",r.stats.power):""}
                </div>
            </div>
            <div class="text-center">
                <button
                    data-item-id="${r.id}"
                    ${e?"":"disabled"}
                    class="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Buy (${r.cost} BP)
                </button>
            </div>
        </div>
    `};class re extends HTMLElement{constructor(){super(),this._items=[],this._balancePoints=0,this.addEventListener("click",e=>{const s=e.target,t=s.dataset.itemId;t&&this.dispatchEvent(new CustomEvent("purchase-item",{bubbles:!0,composed:!0,detail:{itemId:t}})),s.id==="start-run-button"&&this.dispatchEvent(new CustomEvent("start-run",{bubbles:!0,composed:!0}))})}set items(e){this._items=e,this.render()}set balancePoints(e){this._balancePoints=e,this.render()}connectedCallback(){this.render()}render(){const e=this._items.map(s=>ae(s,this._balancePoints>=(s.cost||0))).join("");this.innerHTML=`
            <div class="w-full max-w-4xl mx-auto p-4 md:p-6">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold font-serif text-white">The Workshop</h1>
                    <p class="text-brand-text-muted">Spend your Balance Points to add new items to your permanent collection.</p>
                    <p class="mt-4 text-2xl font-bold">
                        Balance Points: <span class="text-amber-400">${this._balancePoints}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${e}
                    ${this._items.length===0?'<p class="text-center text-brand-text-muted col-span-full">No new items available for purchase this time.</p>':""}
                </div>

                <div class="text-center">
                    <button
                        id="start-run-button"
                        class="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                    >
                        Begin Next Run
                    </button>
                </div>
            </div>
        `}}customElements.define("workshop-screen",re);const m=document.getElementById("app");if(!m)throw new Error("Could not find app element to mount to");const g=new B,ne=r=>{if(!r)return"Initializing...";switch(r.phase){case"AWAITING_ADVENTURER_CHOICE":return"Adventurer is considering your offer...";case"AWAITING_ENCOUNTER_FEEDBACK":return"Adventurer is facing the encounter...";default:return"Loading..."}},ie=r=>{switch(r.phase){case"DESIGNER_CHOOSING_LOOT":return'<div class="lg:col-span-3"><loot-choice-panel></loot-choice-panel></div>';case"DESIGNER_CHOOSING_DIFFICULTY":return'<div class="lg:col-span-3"><debug-encounter-panel></debug-encounter-panel></div>';case"AWAITING_ADVENTURER_CHOICE":case"AWAITING_ENCOUNTER_FEEDBACK":return`<div class="lg:col-span-3"><loading-indicator text="${ne(r)}"></loading-indicator></div>`;default:return`<div class="lg:col-span-3"><div>Unhandled game phase: ${r.phase}</div></div>`}},oe=r=>{if(!r){m.innerHTML="<div>Loading...</div>";return}if(r.phase==="SHOP"){m.innerHTML="<workshop-screen></workshop-screen>";const i=document.querySelector("workshop-screen");i&&(i.items=r.shopItems,i.balancePoints=r.designer.balancePoints);return}const e=r.gameOver.isOver?`<game-over-screen
                final-bp="${r.designer.balancePoints}"
                reason="${r.gameOver.reason}"
                run="${r.run}"
            ></game-over-screen>`:"";m.innerHTML=`
        <div class="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            ${e}
            <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <debug-log></debug-log>
                    <game-stats
                        balance-points="${r.designer.balancePoints}"
                        run="${r.run}"
                        floor="${r.floor}"
                    ></game-stats>
                    <feedback-panel message="${r.feedback}"></feedback-panel>
                </div>
                <div class="lg:col-span-2 space-y-6">
                    <adventurer-status></adventurer-status>
                </div>
                ${ie(r)}
            </div>
        </div>
    `;const s=document.querySelector("adventurer-status");s&&(s.adventurer=r.adventurer);const t=document.querySelector("loot-choice-panel");t&&(t.choices=r.hand,t.disabled=!1);const n=document.querySelector("debug-encounter-panel");if(n){const i=Math.max(1,15-Math.floor(r.adventurer.power/4)+Math.floor(r.floor*1.5));n.defaultBaseDamage=i}const a=document.querySelector("debug-log");a&&(a.logs=r.log,a.traits=r.adventurer.traits)};m.addEventListener("present-offer",r=>{const{ids:e}=r.detail;g.presentOffer(e)});m.addEventListener("run-encounter",r=>{const{params:e}=r.detail;g.runDebugEncounter(e)});m.addEventListener("enter-workshop",()=>{g.enterWorkshop()});m.addEventListener("purchase-item",r=>{const{itemId:e}=r.detail;g.purchaseItem(e)});m.addEventListener("start-run",()=>{g.startNewRun()});g.on("state-change",r=>{if(g.isLoading){m.innerHTML="<div>Loading Game Data...</div>";return}if(g.error){m.innerHTML=`
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                     <h2 class="text-2xl font-bold text-brand-secondary mb-4">An Error Occurred</h2>
                     <p class="text-brand-text">${g.error}</p>
                </div>
            </div>
        `;return}oe(r)});m.innerHTML="<div>Initializing...</div>";
