import React from 'react';

interface HallPickerProps {
    halls: string[];
    selectedHall: string | null;
    onSelect: (hall: string) => void;
    isRecommended: (hall: string) => boolean;
}

/**
 * HallPicker Component
 * A modern, segmented-control inspired hall selector with glassmorphism
 * and premium "Recommended" indicators.
 */
export const HallPicker: React.FC<HallPickerProps> = ({
    halls,
    selectedHall,
    onSelect,
    isRecommended,
}) => {
    // Sort halls: Recommended first, then alphabetically
    const sortedHalls = [...halls].sort((a, b) => {
        const aRec = isRecommended(a);
        const bRec = isRecommended(b);
        if (aRec && !bRec) return -1;
        if (!aRec && bRec) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="flex items-center p-1 bg-slate-100/50 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-inner">
            <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[600px]">
                {sortedHalls.map((hall) => {
                    const active = selectedHall === hall;
                    const recommended = isRecommended(hall);

                    return (
                        <button
                            key={hall}
                            onClick={() => onSelect(hall)}
                            className={`
                                relative flex-shrink-0 px-4 py-1.5 rounded-lg text-[11px] font-bold 
                                uppercase tracking-wider transition-all duration-300 ease-out
                                flex items-center gap-2 group
                                ${active
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50 scale-[1.02]'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                                }
                            `}
                        >
                            <span className="relative z-10 whitespace-nowrap">
                                {hall.length > 20 ? hall.split(' ').slice(-2).join(' ') : hall}
                            </span>

                            {/* Recommended Glow/Badge */}
                            {recommended && (
                                <div className="relative flex items-center">
                                    <span className="absolute inset-0 bg-emerald-400 rounded-full blur-[4px] opacity-40 animate-pulse" />
                                    <span className="relative text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-black normal-case tracking-tight shadow-sm transform group-hover:scale-110 transition-transform">
                                        ★ Rec
                                    </span>
                                </div>
                            )}

                            {/* Active Indicator Bar (Subtle) */}
                            {active && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-slate-900 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HallPicker;
