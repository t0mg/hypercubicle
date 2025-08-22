
import React from 'react';
import type { Adventurer } from '../types';

interface AdventurerStatusProps {
    adventurer: Adventurer;
}

const HealthIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const PowerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.25.125a2 2 0 002.29-1.787v-5.432a2 2 0 00-1.106-1.787l-.25-.125a2 2 0 00-2.29 1.787zM10 10.333v5.43a2 2 0 001.106 1.787l.25.125a2 2 0 002.29-1.787v-5.432a2 2 0 00-1.106-1.787l-.25-.125a2 2 0 00-2.29 1.787zM14 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6z" />
    </svg>
);

const InterestIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l.028.028a1 1 0 01-.395 1.45 3.999 3.999 0 00-1.396 3.565l-1.564.978a1 1 0 00-.62 1.767l.028.028a1 1 0 01-.395 1.45 3.999 3.999 0 00-1.396 3.565l-1.564.978a1 1 0 101.24 1.97l1.565-.978a3.999 3.999 0 003.565-1.396l.028.028a1 1 0 011.45-.395 3.999 3.999 0 003.565-1.396l1.565-.978a1 1 0 10-1.24-1.97l-1.565.978a3.999 3.999 0 00-3.565 1.396l-.028-.028a1 1 0 01-1.45.395 3.999 3.999 0 00-3.565 1.396L2.91 15.083A1 1 0 004.365 13.63l1.564-.978a3.999 3.999 0 001.396-3.565l.028-.028a1 1 0 01.395-1.45 3.999 3.999 0 001.396-3.565l1.564-.978A1 1 0 0012.395 2.553z" clipRule="evenodd" />
    </svg>
);

const WeaponIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 2.293a1 1 0 00-1.414 0l-11 11a1 1 0 000 1.414l3 3a1 1 0 001.414 0l11-11a1 1 0 000-1.414l-3-3z" />
        <path d="M13 7a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 11a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5 15a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
    </svg>
);

const ArmorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2.586a1 1 0 01-.293.707l-2.414 2.414a1 1 0 00-.293.707V15a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3.586a1 1 0 00-.293-.707L4.293 8.293A1 1 0 014 7.586V5zm2-1a1 1 0 00-1 1v2.586l.293.293L10 9.586l2.707-2.707L13 6.586V5a1 1 0 00-1-1H6z" clipRule="evenodd" />
    </svg>
);

const PotionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v2a2 2 0 104 0V4a2 2 0 00-2-2zM4 9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" clipRule="evenodd" />
    </svg>
);

export const AdventurerStatus: React.FC<AdventurerStatusProps> = ({ adventurer }) => {
    const healthPercentage = (adventurer.hp / adventurer.maxHp) * 100;

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold font-serif mb-4 text-center text-white">Adventurer's Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Stats */}
                <div className="space-y-4">
                     {/* Health Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                                <HealthIcon />
                                <span className="font-semibold text-lg">Health</span>
                            </div>
                            <span className="font-mono text-lg">{adventurer.hp} / {adventurer.maxHp}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${healthPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                     {/* Interest Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                                <InterestIcon />
                                <span className="font-semibold text-lg">Interest</span>
                            </div>
                            <span className="font-mono text-lg">{adventurer.interest}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div
                                className="bg-brand-interest h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${adventurer.interest}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* Right Side: Power */}
                <div className="flex items-center justify-center bg-brand-primary p-3 rounded-md">
                     <PowerIcon />
                    <span className="font-semibold text-lg mr-4">Power</span>
                    <span className="font-mono text-2xl font-bold text-white">{adventurer.power}</span>
                </div>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            <h3 className="text-lg font-bold font-serif mb-3 text-center text-white">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Weapon Slot */}
                <div className="bg-brand-primary/50 p-3 rounded-lg">
                    <div className="flex items-center justify-center text-brand-text-muted mb-1">
                        <WeaponIcon />
                        <span className="ml-2 font-semibold">Weapon</span>
                    </div>
                    {adventurer.inventory.weapon ? (
                        <div>
                            <p className="text-white font-semibold">{adventurer.inventory.weapon.name}</p>
                            <p className="text-sm text-brand-text-muted">
                                Pwr: {adventurer.inventory.weapon.stats.power || 0}
                                {adventurer.inventory.weapon.stats.maxHp ? `, HP: ${adventurer.inventory.weapon.stats.maxHp}` : ''}
                            </p>
                        </div>
                    ) : (
                        <p className="text-brand-text-muted italic">None</p>
                    )}
                </div>
                {/* Armor Slot */}
                <div className="bg-brand-primary/50 p-3 rounded-lg">
                     <div className="flex items-center justify-center text-brand-text-muted mb-1">
                        <ArmorIcon />
                        <span className="ml-2 font-semibold">Armor</span>
                    </div>
                    {adventurer.inventory.armor ? (
                        <div>
                            <p className="text-white font-semibold">{adventurer.inventory.armor.name}</p>
                            <p className="text-sm text-brand-text-muted">
                                HP: {adventurer.inventory.armor.stats.maxHp || 0}
                                {adventurer.inventory.armor.stats.power ? `, Pwr: ${adventurer.inventory.armor.stats.power}` : ''}
                            </p>
                        </div>
                    ) : (
                        <p className="text-brand-text-muted italic">None</p>
                    )}
                </div>
                {/* Potions Slot */}
                <div className="bg-brand-primary/50 p-3 rounded-lg">
                    <div className="flex items-center justify-center text-brand-text-muted mb-1">
                        <PotionIcon />
                        <span className="ml-2 font-semibold">Potions</span>
                    </div>
                    {adventurer.inventory.potions.length > 0 ? (
                         <p className="text-white font-semibold">{adventurer.inventory.potions.length} held</p>
                    ) : (
                        <p className="text-brand-text-muted italic">None</p>
                    )}
                </div>
            </div>
        </div>
    );
};
