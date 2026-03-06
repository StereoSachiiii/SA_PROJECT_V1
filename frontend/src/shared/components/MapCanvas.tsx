import {
    TransformWrapper,
    TransformComponent,
} from 'react-zoom-pan-pinch'
import {
    MapStall,
    NormalizedInfluence,
    NormalizedZone,
} from '../types/stallMap.utils'

import MapHeatmap from './Map/MapHeatmap'
import MapZones from './Map/MapZones'
import MapStallComponent from './Map/MapStall'
import { MapControls, MapLegend } from './Map/MapControls'
import { ImplicitAisleLayer } from './Map/ImplicitAisleLayer'

interface MapCanvasProps {
    stalls: MapStall[]
    influences: NormalizedInfluence[]
    zones: NormalizedZone[]
    selectedIds: number[]
    showHeatmap: boolean
    onStallClick: (stallId: number, isReserved: boolean) => void
    onHoverChange: (stall: MapStall | null, anchorRect: DOMRect | null) => void
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

                                {stalls.filter(s => s.posX !== undefined).map(stall => (
                                    <MapStallComponent
                                        key={stall.id}
                                        stall={stall}
                                        selectedIds={selectedIds}
                                        showHeatmap={showHeatmap}
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
