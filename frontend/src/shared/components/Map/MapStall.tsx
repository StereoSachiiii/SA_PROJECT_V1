import React, { useCallback } from 'react';
import { MapStall, parseGeometry, getStallRenderState, parseScore } from '../../types/stallMap.utils';

interface MapStallProps {
    stall: MapStall;
    selectedIds: number[];
    onStallClick: (stallId: number, isReserved: boolean) => void;
    onHoverChange: (stall: MapStall | null, anchorRect: DOMRect | null) => void;
}

export default function MapStallComponent({ stall, selectedIds, onStallClick, onHoverChange }: MapStallProps) {
    const g = parseGeometry(stall.geometry);
    const renderState = getStallRenderState(stall, selectedIds);
    const score = parseScore(stall.pricingBreakdown?.['Visibility Score']);

    const stateStyles: Record<string, {
        bg: string; border: string; text: string; shadow: string
    }> = {
        available: {
            bg: score > 60 ? 'rgba(240,253,244,1)' : score > 30 ? 'rgba(255,251,235,1)' : '#ffffff',
            border: score > 60 ? '1px solid #86efac' : score > 30 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            text: 'text-slate-700',
            shadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
        premium: {
            bg: '#fffbeb',
            border: '1.5px solid #fcd34d',
            text: 'text-amber-900',
            shadow: '0 1px 4px rgba(251,191,36,0.2)',
        },
        selected: {
            bg: '#eff6ff',
            border: '2px solid #3b82f6',
            text: 'text-blue-800',
            shadow: '0 0 0 3px rgba(59,130,246,0.15)',
        },
        reserved: {
            bg: '#f8fafc',
            border: '1px solid #e2e8f0',
            text: 'text-slate-400',
            shadow: 'none',
        },
    };

    const style = stateStyles[renderState];
    const isInteractive = !stall.reserved;

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        onHoverChange(stall, (e.currentTarget as HTMLElement).getBoundingClientRect());
    }, [stall, onHoverChange]);

    const handleMouseLeave = useCallback(() => {
        onHoverChange(null, null);
    }, [onHoverChange]);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onStallClick(stall.id, stall.reserved)}
            style={{
                position: 'absolute',
                left: `${g.x}%`,
                top: `${g.y}%`,
                width: `${g.w}%`,
                height: `${g.h}%`,
                zIndex: renderState === 'selected' ? 15 : 5,
                background:
                    renderState === 'reserved' ? 'rgba(248,250,252,0.25)' :
                        renderState === 'selected' ? 'rgba(239,246,255,0.85)' :
                            renderState === 'premium' ? 'rgba(255,251,235,0.75)' :
                                'rgba(255,255,255,0.7)',
                border: style.border,
                boxShadow: style.shadow,
                backdropFilter: 'blur(0.5px)',
                opacity: renderState === 'reserved' ? 0.55 : 1,
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            }}
            className={[
                'flex flex-col items-center justify-center rounded select-none group',
                style.text,
                renderState === 'available' ? 'stall-pulse' : '',
                isInteractive
                    ? 'cursor-pointer hover:scale-105 hover:z-20'
                    : 'cursor-not-allowed',
            ].join(' ')}
        >
            {stall.reserved && (
                <span className="absolute top-1 right-1 text-lg leading-none">🔒</span>
            )}

            {renderState === 'premium' && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}

            <span className={[
                'font-black uppercase tracking-wide text-center truncate w-full leading-tight px-0.5',
                g.w > 8 ? 'text-[11px]' : 'text-[8px]',
            ].join(' ')}>
                {stall.templateName}
            </span>

            {g.h > 5 && (
                <span className={[
                    'tabular-nums leading-none mt-0.5 font-bold opacity-100',
                    g.w > 8 ? 'text-[8px]' : 'text-[6px]',
                ].join(' ')}>
                    {Math.round(stall.priceCents / 100000)}L
                </span>
            )}
        </div>
    );
}
