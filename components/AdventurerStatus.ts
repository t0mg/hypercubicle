import { FlowState } from '../types';
import type { Adventurer } from '../types';
import { t } from '../text';
import { MetaState } from '../game/meta';
import { UnlockableFeature } from '../game/unlocks';

const HealthIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>`;
const PowerIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/></svg>`;
const InterestIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-163.31t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>`;
const WeaponIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M753.54-132.15 631.15-254.31l-88 88-11.07-11.07q-18.39-18.39-18.39-45.47 0-27.07 18.39-45.46l163.61-163.61q18.39-18.39 45.46-18.39 27.08 0 45.47 18.39l11.07 11.07-88 88 122.16 122.39q9.69 9.69 9.69 22.61 0 12.93-9.69 22.62l-33.08 33.08q-9.69 9.69-22.62 9.69-12.92 0-22.61-9.69ZM840-740.92 398.31-298.46l29.61 29.38q18.39 18.39 18.39 45.46 0 27.08-18.39 45.47l-11.07 11.07-88-88-122.39 122.16q-9.69 9.69-22.61 9.69-12.93 0-22.62-9.69L128.15-166q-9.69-9.69-9.69-22.62 0-12.92 9.69-22.61l122.16-122.39-88-88 11.07-11.07q18.39-18.39 45.47-18.39 27.07 0 45.46 18.39l30.15 30.38L736.92-844H840v103.08ZM334-583l23.23-23.77 23-24-23 24L334-583Zm-28.31 28.54L120-740.92V-844h103.08L408-658.31l-27.77 27.54L207-804h-47v47l174 174-28.31 28.54ZM370-327l430-430v-47h-47L323-374l47 47Zm0 0-23.23-23.77L323-374l23.77 23.23L370-327Z"/></svg>`;
const ArmorIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/></svg>`;
const PotionIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>`;
const BuffIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-160q-25.54 0-36.31-22.81-10.77-22.81 5.08-42.57L400-506.15V-760h-55.38q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73h270.76q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T615.38-760H560v253.85l231.23 280.77q15.85 19.76 5.08 42.57T760-160H200Zm80-80h400L544-400H416L280-240Zm-80 40h560L520-492v-268h-80v268L200-200Zm280-280Z"/></svg>`;

export class AdventurerStatus extends HTMLElement {
    private _adventurer: Adventurer | null = null;
    private _metaState: MetaState | null = null;

    set adventurer(value: Adventurer) {
        this._adventurer = value;
        this.render();
    }

    set metaState(value: MetaState) {
        this._metaState = value;
        this.render();
    }

    get adventurer(): Adventurer {
        return this._adventurer!;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._adventurer) {
            this.innerHTML = '';
            return;
        }

        const adventurerNumber = this._metaState?.adventurers || 1;
        const displayHp = Math.max(0, this._adventurer.hp);
        const healthPercentage = (displayHp / this._adventurer.maxHp) * 100;

        const showTraits = this._metaState?.unlockedFeatures.includes(UnlockableFeature.ADVENTURER_TRAITS);

        this.innerHTML = `
            <div class="bg-brand-surface p-4 pixel-corners shadow-xl">
                <h2 class="text-xl font-label mb-2 text-center text-white">${t('adventurer_status.title', { count: adventurerNumber })}</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="space-y-2 col-span-2">
                        <div data-tooltip-key="adventurer_health">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${HealthIcon()} <span>${t('global.health')}</span></div>
                                <span class="font-label text-sm">${displayHp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 pixel-corners h-3">
                                <div class="bg-green-500 h-3 pixel-corners transition-all duration-500 ease-out" style="width: ${healthPercentage}%"></div>
                            </div>
                        </div>
                        <div data-tooltip-key="adventurer_flow_state">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">${InterestIcon()} <span>${t('adventurer_status.flow_state')}</span></div>
                                <span class="font-label text-sm ${this.getFlowStateColor(this._adventurer.flowState)}">${FlowState[this._adventurer.flowState]}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary/50 p-2 pixel-corners" data-tooltip-key="adventurer_power">
                        ${PowerIcon()}
                        <span class="mr-2">${t('global.power')}</span>
                        <span class="font-label text-lg text-white">${this._adventurer.power}</span>
                    </div>
                </div>

                ${showTraits ? `
                <div class="border-t border-gray-700 my-2"></div>
                <div class="flex justify-around text-center p-1 bg-brand-primary/50 pixel-corners">
                    <div>
                        <span class="text-brand-text-muted block">${t('log_panel.offense')}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.offense}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${t('log_panel.resilience')}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.resilience}</span>
                    </div>
                    <div>
                        <span class="text-brand-text-muted block">${t('log_panel.skill')}</span>
                        <span class="font-mono text-white">${this._adventurer.traits.skill}</span>
                    </div>
                </div>` : ''}

                <div class="border-t border-gray-700 my-2"></div>
                <h3 class="text-base font-label mb-1 text-center text-white">${t('adventurer_status.inventory')}</h3>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${WeaponIcon()} <span class="ml-1">${t('adventurer_status.weapon')}</span></div>
                        ${this._adventurer.inventory.weapon ? `<div><p class="text-white text-sm">${this._adventurer.inventory.weapon.name}</p><p class="text-xs text-brand-text-muted">${t('adventurer_status.pwr')}: ${this._adventurer.inventory.weapon.stats.power || 0}${this._adventurer.inventory.weapon.stats.maxHp ? `, ${t('adventurer_status.hp')}: ${this._adventurer.inventory.weapon.stats.maxHp}` : ''}</p></div>` : `<p class="text-brand-text-muted italic">${t('global.none')}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${ArmorIcon()} <span class="ml-1">${t('adventurer_status.armor')}</span></div>
                        ${this._adventurer.inventory.armor ? `<div><p class="text-white text-sm">${this._adventurer.inventory.armor.name}</p><p class="text-xs text-brand-text-muted">${t('adventurer_status.hp')}: ${this._adventurer.inventory.armor.stats.maxHp || 0}${this._adventurer.inventory.armor.stats.power ? `, ${t('adventurer_status.pwr')}: ${this._adventurer.inventory.armor.stats.power}` : ''}</p></div>` : `<p class="text-brand-text-muted italic">${t('global.none')}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${BuffIcon()} <span class="ml-1">${t('adventurer_status.buffs')}</span></div>
                        ${this._adventurer.activeBuffs.length > 0 ? this._adventurer.activeBuffs.map(buff => `
                            <div>
                                <p class="text-white text-sm">${buff.name} (${t('global.duration')}: ${buff.stats.duration})</p>
                                <p class="text-xs text-brand-text-muted">${Object.entries(buff.stats).filter(([stat]) => stat !== 'duration').map(([stat, value]) => `${t(`global.${stat}`)}: ${value}`).join(', ')}</p>
                            </div>
                        `).join('') : `<p class="text-brand-text-muted italic">${t('global.none')}</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-2 pixel-corners">
                        <div class="flex items-center justify-center text-brand-text-muted">${PotionIcon()} <span class="ml-1">${t('adventurer_status.potions')}</span></div>
                        ${this._adventurer.inventory.potions.length > 0 ? `<p class="text-white text-sm">${t('adventurer_status.potions_held', { count: this._adventurer.inventory.potions.length })}</p>` : `<p class="text-brand-text-muted italic">${t('global.none')}</p>`}
                    </div>
                </div>
            </div>
        `;
    }

    getFlowStateColor(flowState: FlowState): string {
        switch (flowState) {
            case FlowState.Boredom:
            case FlowState.Apathy:
                return 'text-red-500';
            case FlowState.Anxiety:
            case FlowState.Worry:
                return 'text-orange-500';
            case FlowState.Arousal:
            case FlowState.Control:
            case FlowState.Relaxation:
                return 'text-white';
            case FlowState.Flow:
                return 'text-yellow-400 animate-pulse';
            default:
                return 'text-white';
        }
    }
}

customElements.define('adventurer-status', AdventurerStatus);
