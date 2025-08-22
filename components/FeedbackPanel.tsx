
import React from 'react';

interface FeedbackPanelProps {
    message: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ message }) => {
    return (
        <div className="bg-brand-primary/50 p-4 rounded-lg text-center italic text-brand-text-muted border border-brand-primary">
            <p>{message}</p>
        </div>
    );
};
