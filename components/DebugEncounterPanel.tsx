
import React, { useState, useEffect } from 'react';

interface DebugEncounterPanelProps {
    onRunEncounter: (params: { baseDamage: number, difficultyFactor: number }) => void;
    defaultBaseDamage: number;
}

export const DebugEncounterPanel: React.FC<DebugEncounterPanelProps> = ({ onRunEncounter, defaultBaseDamage }) => {
    const [baseDamage, setBaseDamage] = useState(defaultBaseDamage.toString());
    const [difficultyFactor, setDifficultyFactor] = useState('1.0');

    useEffect(() => {
        setBaseDamage(defaultBaseDamage.toString());
    }, [defaultBaseDamage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = {
            baseDamage: parseFloat(baseDamage) || 0,
            difficultyFactor: parseFloat(difficultyFactor) || 0,
        };
        onRunEncounter(params);
    };

    return (
        <div className="w-full bg-brand-surface p-6 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-2 text-white">Debug Encounter</h3>
            <p className="text-center text-brand-text-muted mb-6">Override encounter parameters for testing.</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="base-damage" className="block text-sm font-medium text-brand-text-muted mb-1">Base Damage</label>
                    <input
                        id="base-damage"
                        type="number"
                        step="1"
                        value={baseDamage}
                        onChange={(e) => setBaseDamage(e.target.value)}
                        className="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                        aria-label="Base Damage"
                    />
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="difficulty-factor" className="block text-sm font-medium text-brand-text-muted mb-1">Difficulty Factor</label>
                    <input
                        id="difficulty-factor"
                        type="number"
                        step="0.1"
                        value={difficultyFactor}
                        onChange={(e) => setDifficultyFactor(e.target.value)}
                        className="w-full bg-brand-primary p-2 rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary text-white"
                        aria-label="Difficulty Factor"
                    />
                </div>
                <div className="md:col-span-1">
                    <button
                        type="submit"
                        className="w-full bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105"
                    >
                        Run Encounter
                    </button>
                </div>
            </form>
        </div>
    );
};
