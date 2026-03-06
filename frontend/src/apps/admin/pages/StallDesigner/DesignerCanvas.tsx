import { useDesigner } from './DesignerContext';
import { getDrawRect } from './types';
import { useDesignerInteractions } from './hooks/useDesignerInteractions';
import { DesignerZoneItem } from './components/DesignerZoneItem';
import { DesignerInfluenceItem } from './components/DesignerInfluenceItem';
import { DesignerStallItem } from './components/DesignerStallItem';

export function DesignerCanvas() {
    const {
        stalls,
        zones,
        influences,
        drawMode,
        editingStallId
    } = useDesigner();

    const {
        overlayRef,
        handleItemMouseDown,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isDrawing,
        startPos,
        currentPos
    } = useDesignerInteractions();

    return (
        <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center items-start cursor-crosshair">
            <div
                ref={overlayRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="relative bg-white shadow-lg border border-gray-200 rounded-sm"
                style={{ width: '1100px', height: '720px' }}
            >
                {/* 1. Base Layer (Zones) */}
                {zones.map(z => (
                    <DesignerZoneItem key={z.id} zone={z} onMouseDown={handleItemMouseDown as any} />
                ))}

                {/* 2. Heatmap Layer (Influences) */}
                {influences.map(inf => (
                    <DesignerInfluenceItem key={inf.id} influence={inf} onMouseDown={handleItemMouseDown as any} />
                ))}

                {/* 3. Stalls Layer */}
                {stalls.map(stall => (
                    <DesignerStallItem
                        key={stall.id}
                        stall={stall}
                        isEditing={editingStallId === stall.id}
                        onMouseDown={handleItemMouseDown as any}
                    />
                ))}

                {/* Draw Indicator */}
                {isDrawing && startPos && currentPos && (() => {
                    const r = getDrawRect(startPos, currentPos);

                    if (drawMode === 'INFLUENCE') {
                        const cx = r.x + (r.w / 2);
                        const cy = r.y + (r.h / 2);
                        const radius = Math.max(r.w, r.h) / 2;
                        return (
                            <div className="absolute border-2 border-green-500 bg-green-500/10 border-dashed pointer-events-none rounded-full"
                                style={{ left: `${cx - radius}%`, top: `${cy - radius}%`, width: `${radius * 2}%`, height: `${radius * 2}%` }} />
                        );
                    }

                    return (
                        <div
                            className="absolute border-2 border-blue-500 bg-blue-500/10 border-dashed pointer-events-none rounded-sm"
                            style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
                        />
                    );
                })()}

                {stalls.length === 0 && zones.length === 0 && !isDrawing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
                        <p className="text-lg font-black mb-2">Empty Layout</p>
                        <p className="text-xs">Draw to add elements</p>
                    </div>
                )}
            </div>
        </div>
    );
}
