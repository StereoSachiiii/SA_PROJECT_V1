import React from 'react';

interface LoadingStateProps {
    message?: string;
    fullPage?: boolean;
    className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Loading...',
    fullPage = false,
    className = ''
}) => {
    const content = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{message}</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};
