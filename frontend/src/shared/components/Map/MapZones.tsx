import { NormalizedZone } from '../../types/stallMap.utils';

interface MapZonesProps {
    zones: NormalizedZone[];
}

export default function MapZones({ zones }: MapZonesProps) {
    return (
        <>
            {zones.map((zone, i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.w}%`,
                        height: `${zone.h}%`,
                        zIndex: 2,
                    }}
                >
                    {zone.type === 'WALKWAY' && (
                        <div className="w-full h-full flex items-center justify-center"
                            style={{
                                background: 'repeating-linear-gradient(90deg,rgba(139,92,246,0.15) 0,rgba(139,92,246,0.15) 2px,rgba(139,92,246,0.05) 2px,rgba(139,92,246,0.05) 12px)',
                                borderLeft: '2px solid rgba(139,92,246,0.6)',
                                borderRight: '2px solid rgba(139,92,246,0.6)',
                            }}
                        >
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-violet-600 rotate-90 whitespace-nowrap select-none">
                                {zone.label}
                            </span>
                        </div>
                    )}

                    {zone.type === 'ENTRANCE' && (
                        <div className="w-full h-full flex flex-col items-center justify-end pb-2"
                            style={{
                                background: 'rgba(59,130,246,0.15)',
                                borderBottom: '3px solid rgba(59,130,246,0.7)',
                                borderLeft: '2px solid rgba(59,130,246,0.4)',
                                borderRight: '2px solid rgba(59,130,246,0.4)',
                            }}
                        >
                            <span className="text-lg leading-none">🚪</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600 mt-1 select-none">
                                {zone.label}
                            </span>
                        </div>
                    )}

                    {zone.type === 'STAGE' && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 rounded"
                            style={{
                                background: 'rgba(245,158,11,0.18)',
                                border: '2px solid rgba(245,158,11,0.7)',
                                boxShadow: 'inset 0 0 12px rgba(245,158,11,0.2)',
                            }}
                        >
                            <span className="text-2xl leading-none">🎭</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-700 select-none">
                                {zone.label}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
