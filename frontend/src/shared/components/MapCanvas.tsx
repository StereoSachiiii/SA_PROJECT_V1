import { useCallback, useMemo } from 'react'
import {
    TransformWrapper,
    TransformComponent,
} from 'react-zoom-pan-pinch'
import {
    MapStall,
    NormalizedInfluence,
    NormalizedZone,
    parseGeometry,
    parseScore,
    detectImplicitAisles,
    getStallRenderState,
} from '../types/stallMap.utils'


const pulseStyle = document.createElement('style')
pulseStyle.textContent = `
  @keyframes stallPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.015); opacity: 0.98; }
  }
  .stall-pulse {
    animation: stallPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`
if (typeof document !== 'undefined') {
    document.head.appendChild(pulseStyle)
}


interface MapCanvasProps {
    stalls: MapStall[]
    influences: NormalizedInfluence[]
    zones: NormalizedZone[]
    selectedIds: number[]
    showHeatmap: boolean
    onStallClick: (stallId: number, isReserved: boolean) => void
    onHoverChange: (stall: MapStall | null, anchorRect: DOMRect | null) => void
}


function influenceColor(type: string): string {
    switch (type) {
        case 'ENTRANCE': return '#3b82f6'   // blue
        case 'STAGE': return '#f59e0b'      // amber
        case 'WALKWAY': return '#8b5cf6'    // violet
        default: return '#10b981'            // emerald
    }
}


function HeatmapLayer({ influences }: { influences: NormalizedInfluence[] }) {
    if (influences.length === 0) {
        return null
    }


    return (
        <svg
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
                zIndex: 12,
                opacity: 1,
                mixBlendMode: 'multiply',
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            data-testid="heatmap-svg"
        >
            <defs>
                {influences.map((inf, idx) => {
                    const color = influenceColor(inf.type)
                    const peak = Math.min((inf.intensity / 100) * 0.95, 1.0)
                    const mid = peak * 0.4

                    return (
                        <radialGradient key={`grad-${idx}`} id={`influence-grad-${idx}`}>
                            <stop offset="0%" stopColor={color} stopOpacity={peak} />
                            <stop offset="30%" stopColor={color} stopOpacity={mid} />
                            <stop offset="70%" stopColor={color} stopOpacity={mid * 0.3} />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </radialGradient>
                    )
                })}
            </defs>

            {influences.map((inf, idx) => {
                const color = influenceColor(inf.type)
                return (
                    <g key={`influence-${idx}`}>
                        {/* Fill gradient */}
                        <circle
                            cx={inf.cx}
                            cy={inf.cy}
                            r={inf.r * 0.5} // Scale down radius for better visual balance
                            fill={`url(#influence-grad-${idx})`}
                            style={{
                                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                            }}
                        />
                        {/* Border circle - sharp definition */}
                        <circle
                            cx={inf.cx}
                            cy={inf.cy}
                            r={inf.r * 0.5} // Scale down radius for better visual balance
                            fill="none"
                            stroke={color}
                            strokeWidth="0.8"
                            strokeOpacity="0.6"
                            data-testid={`influence-circle-${idx}`}
                        />
                    </g>
                )
            })}
        </svg>
    )
}

// ─── Zone Layer ───────────────────────────────────────────────────────────────

function ZoneLayer({ zones }: { zones: NormalizedZone[] }) {
    return (
        <>
            {zones.map((zone, i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${zone.x}%`,
                        top: `${Math.max(0, zone.y)}%`,
                        width: `${zone.w}%`,
                        height: `${Math.min(100, Math.max(zone.h, 0))}%`,
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
    )
}

// ─── Implicit Aisle Layer ─────────────────────────────────────────────────────
// Detects empty columns in stall data and renders them as walkway-style strips.

function ImplicitAisleLayer({ stalls }: { stalls: MapStall[] }) {
    const aisleXPositions = useMemo(() => detectImplicitAisles(stalls), [stalls])

    return (
        <>
            {aisleXPositions.map(x => (
                <div
                    key={x}
                    className="absolute top-0 h-full pointer-events-none"
                    style={{
                        left: `${x}%`,
                        width: '10%',
                        zIndex: 2,
                        background: 'repeating-linear-gradient(90deg,rgba(148,163,184,0.07) 0,rgba(148,163,184,0.07) 1px,transparent 1px,transparent 20px)',
                        borderLeft: '1px dashed rgba(148,163,184,0.3)',
                        borderRight: '1px dashed rgba(148,163,184,0.3)',
                    }}
                />
            ))}
        </>
    )
}

// ─── Single Stall ─────────────────────────────────────────────────────────────

interface StallItemProps {
    stall: MapStall
    selectedIds: number[]
    onStallClick: (stallId: number, isReserved: boolean) => void
    onHoverChange: (stall: MapStall | null, anchorRect: DOMRect | null) => void
}

function StallItem({ stall, selectedIds, onStallClick, onHoverChange }: StallItemProps) {
    const g = parseGeometry(stall.geometry)
    const renderState = getStallRenderState(stall, selectedIds)
    const score = parseScore(stall.pricingBreakdown?.['Visibility Score'])

    // ── Visual tokens by state ──
    const stateStyles: Record<typeof renderState, {
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
    }

    const style = stateStyles[renderState]
    const isInteractive = !stall.reserved

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        onHoverChange(stall, (e.currentTarget as HTMLElement).getBoundingClientRect())
    }, [stall, onHoverChange])

    const handleMouseLeave = useCallback(() => {
        onHoverChange(null, null)
    }, [onHoverChange])

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
            {/* Reserved lock — LARGER */}
            {stall.reserved && (
                <span className="absolute top-1 right-1 text-lg leading-none">🔒</span>
            )}

            {/* Premium dot */}
            {renderState === 'premium' && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}

            {/* Stall name */}
            <span className={[
                'font-black uppercase tracking-wide text-center truncate w-full leading-tight px-0.5',
                g.w > 8 ? 'text-[11px]' : 'text-[8px]',
            ].join(' ')}>
                {stall.templateName}
            </span>

            {/* Price — only if tall enough */}
            {g.h > 5 && (
                <span className={[
                    'tabular-nums leading-none mt-0.5 font-bold opacity-100',
                    g.w > 8 ? 'text-[8px]' : 'text-[6px]',
                ].join(' ')}>
                    {Math.round(stall.priceCents / 100000)}L
                </span>
            )}
        </div>
    )
}

// ─── Map Controls ─────────────────────────────────────────────────────────────

interface MapControlsProps {
    zoomIn: () => void
    zoomOut: () => void
    resetTransform: () => void
}

function MapControls({ zoomIn, zoomOut, resetTransform }: MapControlsProps) {
    return (
        <div className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl font-bold text-xl pointer-events-auto"
                title="Zoom In"
            >
                +
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl font-bold text-xl pointer-events-auto"
                title="Zoom Out"
            >
                −
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); resetTransform(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl pointer-events-auto"
                title="Reset View"
            >
                <span className="text-sm font-black">↺</span>
            </button>
        </div>
    )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function MapLegend() {
    return (
        <div className="absolute bottom-6 left-6 z-[100] flex gap-3 items-center
                    bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl
                    border border-slate-200 shadow-xl pointer-events-none">
            {[
                { cls: 'bg-white border border-slate-300', label: 'Available' },
                { cls: 'bg-blue-50 border-2 border-blue-500', label: 'Selected' },
                { cls: 'bg-amber-50 border border-amber-400', label: 'Premium' },
                { cls: 'bg-slate-100 border border-slate-200 opacity-60', label: 'Reserved' },
            ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-md ${cls}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    )
}

// ─── MapCanvas ────────────────────────────────────────────────────────────────

export function MapCanvas({
    stalls,
    influences,
    zones,
    selectedIds,
    showHeatmap,
    onStallClick,
    onHoverChange,
}: MapCanvasProps) {
    return (
        <div
            className="absolute inset-0 m-4 rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-300 ring-8 ring-slate-400/5 shadow-2xl"
        >
            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={8}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
                pinch={{ step: 1.5 }}
                panning={{ velocityDisabled: false }}
                doubleClick={{ disabled: true }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <div className="relative w-full h-full">
                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }}
                            contentStyle={{ width: '1200px', height: '800px' }}
                        >
                            <div className="relative w-[1200px] h-[800px] bg-white shadow-inner transition-all duration-300 ease-out">
                                {/* Layer 1: Heatmap */}
                                {showHeatmap && <HeatmapLayer influences={influences} />}

                                {/* Layer 2: Structural zones */}
                                <ZoneLayer zones={zones} />

                                {/* Layer 3: Implicit aisle columns */}
                                <ImplicitAisleLayer stalls={stalls} />

                                {/* Layer 4: Stalls */}
                                {stalls.filter(s => s.geometry).map(stall => (
                                    <StallItem
                                        key={stall.id}
                                        stall={stall}
                                        selectedIds={selectedIds}
                                        onStallClick={onStallClick}
                                        onHoverChange={onHoverChange}
                                    />
                                ))}

                                {/* Empty state */}
                                {stalls.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-slate-400 text-sm font-medium tracking-widest uppercase">
                                            No stalls configured for this hall.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </TransformComponent>

                        {/* Fixed Controls Overlay */}
                        <MapControls
                            zoomIn={zoomIn}
                            zoomOut={zoomOut}
                            resetTransform={resetTransform}
                        />
                    </div>
                )}
            </TransformWrapper>

            {/* Fixed Legend — bottom left */}
            <MapLegend />
        </div>
    )
}
