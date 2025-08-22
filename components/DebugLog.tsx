
import React, { useRef, useEffect } from 'react';
import type { AdventurerTraits } from '../types';

interface DebugLogProps {
    logs: string[];
    traits: AdventurerTraits;
}

export const DebugLog: React.FC<DebugLogProps> = ({ logs, traits }) => {
    const logEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="w-full bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">Game Log & Debug Info</h4>
            
            <div className="flex justify-around text-center mb-3 p-2 bg-brand-primary/50 rounded-md">
                <div className="text-xs">
                    <span className="font-bold text-brand-text-muted block">OFFENSE</span>
                    <span className="font-mono text-white text-base">{traits.offense}</span>
                </div>
                <div className="text-xs">
                    <span className="font-bold text-brand-text-muted block">RISK</span>
                    <span className="font-mono text-white text-base">{traits.risk}</span>
                </div>
                <div className="text-xs">
                    <span className="font-bold text-brand-text-muted block">EXPERTISE</span>
                    <span className="font-mono text-white text-base">{traits.expertise}</span>
                </div>
            </div>

            <div className="max-h-48 overflow-y-auto text-xs font-mono text-gray-400 space-y-1 pr-2">
                {logs.map((log, index) => (
                    <p key={index} className="whitespace-pre-wrap">{`[${index.toString().padStart(3, '0')}] ${log}`}</p>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};
