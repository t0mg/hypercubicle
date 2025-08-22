
import React from 'react';

interface LoadingIndicatorProps {
    text: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
    return (
        <div className="text-center p-6 bg-brand-primary/50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto mb-4"></div>
            <p className="text-lg text-white font-semibold">{text}</p>
        </div>
    );
};
