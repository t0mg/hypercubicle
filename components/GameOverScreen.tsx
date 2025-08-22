
import React from 'react';

interface GameOverScreenProps {
    finalBP: number;
    reason: string;
    onEnterWorkshop: () => void;
    run: number;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalBP, reason, onEnterWorkshop, run }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary animate-fade-in">
                <h2 className="text-4xl font-bold font-serif text-brand-secondary mb-2">Run Complete!</h2>
                <p className="text-brand-text-muted mb-4">{reason}</p>
                <p className="text-lg text-white mb-6">Final BP: <span className="font-bold text-2xl text-amber-400">{finalBP}</span></p>
                <button
                    onClick={onEnterWorkshop}
                    className="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors transform hover:scale-105"
                >
                    Enter Workshop
                </button>
            </div>
        </div>
    );
};
