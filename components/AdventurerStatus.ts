import type { Adventurer } from '../types';

const HealthIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>`;
const PowerIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.25.125a2 2 0 002.29-1.787v-5.432a2 2 0 00-1.106-1.787l-.25-.125a2 2 0 00-2.29 1.787zM10 10.333v5.43a2 2 0 001.106 1.787l.25.125a2 2 0 002.29-1.787v-5.432a2 2 0 00-1.106-1.787l-.25-.125a2 2 0 00-2.29 1.787zM14 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6z" /></svg>`;
const InterestIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-amber-400" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M249.23-80H144.62Q117-80 98.5-98.5 80-117 80-144.62v-104.61h40v104.61q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h104.61v40Zm461.54 0v-40h104.61q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-104.61h40v104.61q0 27.62-18.5 46.12Q843-80 815.38-80H710.77ZM480-250.77q-106.92 0-192.12-60.61Q202.69-372 159.23-480q43.46-108 128.65-168.62 85.2-60.61 192.12-60.61t192.12 60.61Q757.31-588 800.77-480q-43.46 108-128.65 168.62-85.2 60.61-192.12 60.61Zm0-40q91.08 0 163.31-49.54T756.85-480q-41.31-90.15-113.54-139.69-72.23-49.54-163.31-49.54t-163.31 49.54Q244.46-570.15 203.15-480q41.31 90.15 113.54 139.69 72.23 49.54 163.31 49.54Zm0-74.61q48 0 81.31-33.31T594.62-480q0-48-33.31-81.31T480-594.62q-48 0-81.31 33.31T365.38-480q0 48 33.31 81.31T480-365.38Zm0-40q-31.15 0-52.88-21.74-21.74-21.73-21.74-52.88 0-31.15 21.74-52.88 21.73-21.74 52.88-21.74 31.15 0 52.88 21.74 21.74 21.73 21.74 52.88 0 31.15-21.74 52.88-21.73 21.74-52.88 21.74ZM80-710.77v-104.61Q80-843 98.5-861.5 117-880 144.62-880h104.61v40H144.62q-10.77 0-17.7 6.92-6.92 6.93-6.92 17.7v104.61H80Zm760 0v-104.61q0-10.77-6.92-17.7-6.93-6.92-17.7-6.92H710.77v-40h104.61q27.62 0 46.12 18.5Q880-843 880-815.38v104.61h-40ZM480-480Z"/></svg>`;
const WeaponIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 2.293a1 1 0 00-1.414 0l-11 11a1 1 0 000 1.414l3 3a1 1 0 001.414 0l11-11a1 1 0 000-1.414l-3-3z" /><path d="M13 7a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 11a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5 15a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" /></svg>`;
const ArmorIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2.586a1 1 0 01-.293.707l-2.414 2.414a1 1 0 00-.293.707V15a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3.586a1 1 0 00-.293-.707L4.293 8.293A1 1 0 014 7.586V5zm2-1a1 1 0 00-1 1v2.586l.293.293L10 9.586l2.707-2.707L13 6.586V5a1 1 0 00-1-1H6z" clip-rule="evenodd" /></svg>`;
const PotionIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a2 2 0 00-2 2v2a2 2 0 104 0V4a2 2 0 00-2-2zM4 9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" clip-rule="evenodd" /></svg>`;

export class AdventurerStatus extends HTMLElement {
    private _adventurer: Adventurer | null = null;

    set adventurer(value: Adventurer) {
        this._adventurer = value;
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

        const healthPercentage = (this._adventurer.hp / this._adventurer.maxHp) * 100;

        this.innerHTML = `
            <div class="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 class="text-2xl font-bold font-serif mb-4 text-center text-white">Adventurer's Status</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${HealthIcon()} <span class="font-semibold text-lg">Health</span></div>
                                <span class="font-mono text-lg">${this._adventurer.hp} / ${this._adventurer.maxHp}</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" style="width: ${healthPercentage}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">${InterestIcon()} <span class="font-semibold text-lg">Interest</span></div>
                                <span class="font-mono text-lg">${this._adventurer.interest}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out" style="width: ${this._adventurer.interest}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                        ${PowerIcon()}
                        <span class="font-semibold text-lg mr-4">Power</span>
                        <span class="font-mono text-2xl font-bold text-white">${this._adventurer.power}</span>
                    </div>
                </div>
                <div class="border-t border-gray-700 my-4"></div>
                <h3 class="text-lg font-bold font-serif mb-3 text-center text-white">Inventory</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${WeaponIcon()} <span class="ml-2 font-semibold">Weapon</span></div>
                        ${this._adventurer.inventory.weapon ? `<div><p class="text-white font-semibold">${this._adventurer.inventory.weapon.name}</p><p class="text-sm text-brand-text-muted">Pwr: ${this._adventurer.inventory.weapon.stats.power || 0}${this._adventurer.inventory.weapon.stats.maxHp ? `, HP: ${this._adventurer.inventory.weapon.stats.maxHp}` : ''}</p></div>` : `<p class="text-brand-text-muted italic">None</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${ArmorIcon()} <span class="ml-2 font-semibold">Armor</span></div>
                        ${this._adventurer.inventory.armor ? `<div><p class="text-white font-semibold">${this._adventurer.inventory.armor.name}</p><p class="text-sm text-brand-text-muted">HP: ${this._adventurer.inventory.armor.stats.maxHp || 0}${this._adventurer.inventory.armor.stats.power ? `, Pwr: ${this._adventurer.inventory.armor.stats.power}` : ''}</p></div>` : `<p class="text-brand-text-muted italic">None</p>`}
                    </div>
                    <div class="bg-brand-primary/50 p-3 rounded-lg">
                        <div class="flex items-center justify-center text-brand-text-muted mb-1">${PotionIcon()} <span class="ml-2 font-semibold">Potions</span></div>
                        ${this._adventurer.inventory.potions.length > 0 ? `<p class="text-white font-semibold">${this._adventurer.inventory.potions.length} held</p>` : `<p class="text-brand-text-muted italic">None</p>`}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('adventurer-status', AdventurerStatus);
