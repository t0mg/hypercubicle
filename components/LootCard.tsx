import React from 'react';
import type { LootChoice } from '../types';

interface LootCardProps {
    item: LootChoice;
    onSelect: () => void;
    isSelected?: boolean;
    isDisabled?: boolean;
}

const rarityColorMap: { [key: string]: string } = {
    Common: 'text-rarity-common',
    Uncommon: 'text-rarity-uncommon',
    Rare: 'text-rarity-rare',
};

const StatChange: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const isPositive = value > 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    const sign = isPositive ? '+' : '';
    return (
        <div className={`flex justify-between text-sm ${color}`}>
            <span>{label}</span>
            <span className="font-mono">{sign}{value}</span>
        </div>
    );
};

export const LootCard: React.FC<LootCardProps> = ({ item, onSelect, isSelected = false, isDisabled = false }) => {
    const rarityColor = rarityColorMap[item.rarity] || 'text-gray-400';
    const baseClasses = 'bg-brand-surface border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 shadow-lg';
    
    let stateClasses = '';
    if (isDisabled) {
        stateClasses = 'border-gray-600 opacity-50 cursor-not-allowed';
    } else if (isSelected) {
        stateClasses = 'border-brand-secondary scale-105 ring-2 ring-brand-secondary cursor-pointer transform';
    } else {
        stateClasses = 'border-brand-primary hover:border-brand-secondary cursor-pointer transform hover:scale-105';
    }

    return (
        <div 
            className={`${baseClasses} ${stateClasses}`}
            onClick={isDisabled ? undefined : onSelect}
        >
            <div>
                <div className="flex justify-between items-baseline">
                    <p className={`font-bold text-lg ${rarityColor}`}>{item.name}</p>
                    <p className="text-xs text-brand-text-muted font-mono">{item.type}</p>
                </div>

                <p className={`text-xs uppercase tracking-wider mb-3 ${rarityColor}`}>{item.rarity}</p>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="space-y-1 text-brand-text">
                    {item.stats.hp && <StatChange label="Health" value={item.stats.hp} />}
                    {item.stats.maxHp && <StatChange label="Max HP" value={item.stats.maxHp} />}
                    {item.stats.power && <StatChange label="Power" value={item.stats.power} />}
                </div>
            </div>
        </div>
    );
};
