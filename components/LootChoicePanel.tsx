import React, { useState, useMemo } from 'react';
import type { LootChoice } from '../types';
import { LootCard } from './LootCard';

interface LootChoicePanelProps {
    choices: LootChoice[];
    onPresentOffer: (ids: string[]) => void;
    disabled: boolean;
}

export const LootChoicePanel: React.FC<LootChoicePanelProps> = ({ choices, onPresentOffer, disabled }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const instanceIdToBaseIdMap = useMemo(() => 
        new Map(choices.map(c => [c.instanceId, c.id])),
    [choices]);

    const selectedBaseIds = useMemo(() => 
        selectedIds
            .map(id => instanceIdToBaseIdMap.get(id))
            .filter((id): id is string => !!id),
    [selectedIds, instanceIdToBaseIdMap]);

    const handleSelect = (item: LootChoice) => {
        if (disabled) return;

        setSelectedIds(prev => {
            // Deselect if already selected
            if (prev.includes(item.instanceId)) {
                return prev.filter(i => i !== item.instanceId);
            }

            // Prevent selecting if another with same base ID is selected
            const currentSelectedBaseIds = prev.map(instId => instanceIdToBaseIdMap.get(instId));
            if (currentSelectedBaseIds.includes(item.id)) {
                return prev;
            }

            // Add to selection if not full
            if (prev.length < 3) {
                return [...prev, item.instanceId];
            }

            return prev; // Max selected, do nothing
        });
    };

    const canSubmit = selectedIds.length >= 2 && selectedIds.length <= 3;

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-center mb-4 text-white">Offer Rewards (Choose 2 to 3)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {choices.map(item => {
                    const isSelected = selectedIds.includes(item.instanceId);
                    const isSameIdSelected = !isSelected && selectedBaseIds.includes(item.id);
                    
                    return (
                        <LootCard 
                            key={item.instanceId} 
                            item={item} 
                            onSelect={() => handleSelect(item)}
                            isSelected={isSelected}
                            isDisabled={isSameIdSelected || disabled}
                        />
                    );
                })}
            </div>
            <div className="text-center mt-6">
                 <button
                    onClick={() => onPresentOffer(selectedIds)}
                    disabled={!canSubmit || disabled}
                    className="bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Present Offer ({selectedIds.length}/3)
                </button>
            </div>
        </div>
    );
};
