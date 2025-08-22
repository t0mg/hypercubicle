
import React from 'react';
import type { LootChoice } from '../types';

interface ShopItemCardProps {
    item: LootChoice;
    onPurchase: (id: string) => void;
    canAfford: boolean;
}

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

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, onPurchase, canAfford }) => {
    const rarityColorMap: { [key: string]: string } = {
        Common: 'text-rarity-common',
        Uncommon: 'text-rarity-uncommon',
        Rare: 'text-rarity-rare',
    };
    const rarityColor = rarityColorMap[item.rarity] || 'text-gray-400';

    return (
        <div className="bg-brand-surface border border-brand-primary rounded-lg p-4 flex flex-col justify-between shadow-lg animate-fade-in">
            <div>
                <div className="flex justify-between items-baseline">
                    <p className={`font-bold text-lg ${rarityColor}`}>{item.name}</p>
                    <p className="text-xs text-brand-text-muted font-mono">{item.type}</p>
                </div>
                <p className={`text-xs uppercase tracking-wider mb-3 ${rarityColor}`}>{item.rarity}</p>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="space-y-1 text-brand-text mb-4">
                    {item.stats.hp && <StatChange label="Health" value={item.stats.hp} />}
                    {item.stats.maxHp && <StatChange label="Max HP" value={item.stats.maxHp} />}
                    {item.stats.power && <StatChange label="Power" value={item.stats.power} />}
                </div>
            </div>
            <div className="text-center">
                <button
                    onClick={() => onPurchase(item.id)}
                    disabled={!canAfford}
                    className="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Buy ({item.cost} BP)
                </button>
            </div>
        </div>
    );
};

interface WorkshopProps {
    items: LootChoice[];
    balancePoints: number;
    onPurchase: (itemId: string) => void;
    onStartRun: () => void;
}

export const Workshop: React.FC<WorkshopProps> = ({ items, balancePoints, onPurchase, onStartRun }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold font-serif text-white">The Workshop</h1>
                <p className="text-brand-text-muted">Spend your Balance Points to add new items to your permanent collection.</p>
                <p className="mt-4 text-2xl font-bold">
                    Balance Points: <span className="text-amber-400">{balancePoints}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {items.map(item => (
                    <ShopItemCard
                        key={item.id}
                        item={item}
                        onPurchase={onPurchase}
                        canAfford={balancePoints >= item.cost}
                    />
                ))}
                {items.length === 0 && (
                     <p className="text-center text-brand-text-muted col-span-full">No new items available for purchase this time.</p>
                )}
            </div>

            <div className="text-center">
                <button
                    onClick={onStartRun}
                    className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-500 transition-colors transform hover:scale-105"
                >
                    Begin Next Run
                </button>
            </div>
        </div>
    );
};
