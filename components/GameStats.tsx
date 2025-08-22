
import React from 'react';

interface GameStatsProps {
    balancePoints: number;
    run: number;
    floor: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ balancePoints, run, floor }) => {
    return (
        <div className="bg-brand-primary p-4 rounded-lg shadow-lg flex justify-around text-center">
            <div>
                <span className="text-sm text-brand-text-muted uppercase tracking-wider">BP</span>
                <p className="text-2xl font-bold text-white">{balancePoints}</p>
            </div>
            <div>
                <span className="text-sm text-brand-text-muted uppercase tracking-wider">Run</span>
                <p className="text-2xl font-bold text-white">{run}</p>
            </div>
            <div>
                <span className="text-sm text-brand-text-muted uppercase tracking-wider">Floor</span>
                <p className="text-2xl font-bold text-white">{floor}</p>
            </div>
        </div>
    );
};
