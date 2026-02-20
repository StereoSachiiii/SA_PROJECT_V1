import { useMemo } from 'react'
import {
    TransformWrapper,
    TransformComponent,
} from 'react-zoom-pan-pinch'
import {
    MapStall,
    NormalizedInfluence,
    NormalizedZone,
    detectImplicitAisles,
} from '../types/stallMap.utils'

import MapHeatmap from './Map/MapHeatmap'
import MapZones from './Map/MapZones'
import MapStallComponent from './Map/MapStall'
import { MapControls, MapLegend } from './Map/MapControls'

// Global styles for pulsing effect (still kept here for now as it's small)
if (typeof document !== 'undefined') {
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
                                {showHeatmap && <MapHeatmap influences={influences} />}
                                <MapZones zones={zones} />
                                <ImplicitAisleLayer stalls={stalls} />

                                {stalls.filter(s => s.geometry).map(stall => (
                                    <MapStallComponent
                                        key={stall.id}
                                        stall={stall}
                                        selectedIds={selectedIds}
                                        onStallClick={onStallClick}
                                        onHoverChange={onHoverChange}
                                    />
                                ))}

                                {stalls.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-slate-400 text-sm font-medium tracking-widest uppercase">
                                            No stalls configured for this hall.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </TransformComponent>

                        <MapControls
                            zoomIn={zoomIn}
                            zoomOut={zoomOut}
                            resetTransform={resetTransform}
                        />
                    </div>
                )}
            </TransformWrapper>

            <MapLegend />
        </div>
    )
}
