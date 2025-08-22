
import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { GameStats } from './components/GameStats';
import { AdventurerStatus } from './components/AdventurerStatus';
import { LootChoicePanel } from './components/LootChoicePanel';
import { FeedbackPanel } from './components/FeedbackPanel';
import { GameOverScreen } from './components/GameOverScreen';
import { LoadingIndicator } from './components/LoadingIndicator';
import { DebugEncounterPanel } from './components/DebugEncounterPanel';
import { DebugLog } from './components/DebugLog';
import { Workshop } from './components/Workshop';

const App: React.FC = () => {
    const { gameState, isLoading, error, presentOffer, startNewRun, enterWorkshop, purchaseItem, runDebugEncounter } = useGameEngine();

    const getLoadingText = () => {
        if (!gameState) return "Initializing...";
        switch(gameState.phase) {
            case 'AWAITING_ADVENTURER_CHOICE':
                return "Adventurer is considering your offer...";
            case 'AWAITING_ENCOUNTER_FEEDBACK':
                return "Adventurer is facing the encounter...";
            default:
                return "Loading...";
        }
    };

    if (error) {
         return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center border border-brand-secondary">
                     <h2 className="text-2xl font-bold text-brand-secondary mb-4">An Error Occurred</h2>
                     <p className="text-brand-text">{error}</p>
                </div>
            </div>
         )
    }

    if (isLoading || !gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingIndicator text="Loading Game..." />
            </div>
        );
    }

    const renderGamePhasePanel = () => {
        switch (gameState.phase) {
            case 'DESIGNER_CHOOSING_LOOT':
                return <LootChoicePanel choices={gameState.availableDeck} onPresentOffer={presentOffer} disabled={false} />;
            case 'DESIGNER_CHOOSING_DIFFICULTY':
                const defaultBaseDamage = Math.max(1, 15 - Math.floor(gameState.adventurer.power / 4) + Math.floor(gameState.floor * 1.5));
                return <DebugEncounterPanel 
                    onRunEncounter={runDebugEncounter} 
                    defaultBaseDamage={defaultBaseDamage}
                />;
            case 'AWAITING_ADVENTURER_CHOICE':
            case 'AWAITING_ENCOUNTER_FEEDBACK':
                return <LoadingIndicator text={getLoadingText()} />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center">
            {gameState.gameOver.isOver && (
                <GameOverScreen
                    finalBP={gameState.designer.balancePoints}
                    reason={gameState.gameOver.reason}
                    onEnterWorkshop={enterWorkshop}
                    run={gameState.run}
                />
            )}

            {gameState.phase === 'SHOP' ? (
                <Workshop 
                    items={gameState.shopItems}
                    balancePoints={gameState.designer.balancePoints}
                    onPurchase={purchaseItem}
                    onStartRun={startNewRun}
                />
            ) : (
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Game Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <DebugLog logs={gameState.log} traits={gameState.adventurer.traits} />
                        <GameStats
                            balancePoints={gameState.designer.balancePoints}
                            run={gameState.run}
                            floor={gameState.floor}
                        />
                         <FeedbackPanel message={gameState.feedback} />
                    </div>

                    {/* Middle Column: Adventurer Status */}
                    <div className="lg:col-span-2 space-y-6">
                        <AdventurerStatus adventurer={gameState.adventurer} />
                    </div>
                    
                    {/* Bottom Row: Interaction Panel */}
                    <div className="lg:col-span-3">
                         {renderGamePhasePanel()}
                    </div>

                </div>
            )}
        </div>
    );
};

export default App;
