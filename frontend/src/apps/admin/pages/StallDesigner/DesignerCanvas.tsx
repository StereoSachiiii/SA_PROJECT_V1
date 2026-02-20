import { useRef, useState } from 'react';
import { useDesigner } from './DesignerContext';
import { getDrawRect, stallColor, formatPrice, toPercent, DesignerStall, DesignerZone, DesignerInfluence } from './types';

export function DesignerCanvas() {
    const {
        stalls, setStalls,
        zones, setZones,
        influences, setInfluences,
        drawMode, zoneType, influenceType,
        editingStallId, setEditingStallId,
        isDrawing, setIsDrawing,
        startPos, setStartPos,
        currentPos, setCurrentPos
    } = useDesigner();

    const overlayRef = useRef<HTMLDivElement>(null);
    const [dragData, setDragData] = useState<{ id: string | number, type: 'STALL' | 'ZONE' | 'INFLUENCE', offsetX: number, offsetY: number } | null>(null);

    const handleItemMouseDown = (e: React.MouseEvent, id: string | number, type: 'STALL' | 'ZONE' | 'INFLUENCE', itemX: number, itemY: number) => {
        e.stopPropagation();
        if (type === 'STALL') {
            setEditingStallId(id as number);
        }
        if (!overlayRef.current) return;
        const pos = toPercent(e, overlayRef.current);
        setDragData({ id, type, offsetX: pos.x - itemX, offsetY: pos.y - itemY });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        setIsDrawing(true);
        const pos = toPercent(e, overlayRef.current);
        setStartPos(pos);
        setCurrentPos(pos);
        setEditingStallId(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        const pos = toPercent(e, overlayRef.current);

        if (dragData) {
            const newX = pos.x - dragData.offsetX;
            const newY = pos.y - dragData.offsetY;

            if (dragData.type === 'STALL') {
                setStalls(prev => prev.map(s => s.id === dragData.id ? { ...s, geometry: { ...s.geometry, x: newX, y: newY } } : s));
            } else if (dragData.type === 'ZONE') {
                setZones(prev => prev.map(z => z.id === dragData.id ? { ...z, geometry: { ...z.geometry, x: newX, y: newY } } : z));
            } else if (dragData.type === 'INFLUENCE') {
                setInfluences(prev => prev.map(inf => inf.id === dragData.id ? { ...inf, x: newX + inf.radius, y: newY + inf.radius } : inf));
            }
            return;
        }

        if (isDrawing) {
            setCurrentPos(pos);
        }
    };

    const handleMouseUp = () => {
        if (dragData) {
            setDragData(null);
            return;
        }
        if (!isDrawing || !startPos || !currentPos) return;
        const rect = getDrawRect(startPos, currentPos);
        setIsDrawing(false);
        setStartPos(null);
        setCurrentPos(null);

        if (rect.w > 0.5 && rect.h > 0.5) {
            if (drawMode === 'STALL') {
                const newStall: DesignerStall = {
                    id: Date.now(),
                    name: `S-${stalls.length + 1}`,
                    geometry: rect,
                    priceCents: 500000,
                    size: 'MEDIUM',
                    category: 'RETAIL',
                    isAvailable: true,
                };
                setStalls(prev => [...prev, newStall]);
                setEditingStallId(newStall.id);
            } else if (drawMode === 'ZONE') {
                const newZone: DesignerZone = {
                    id: crypto.randomUUID(),
                    type: zoneType,
                    geometry: rect,
                    label: zoneType === 'WALKWAY' ? 'Main Walkway' : zoneType === 'STAGE' ? 'Main Stage' : 'Entrance'
                };
                setZones(prev => [...prev, newZone]);
            } else if (drawMode === 'INFLUENCE') {
                const newInf: DesignerInfluence = {
                    id: crypto.randomUUID(),
                    type: influenceType,
                    x: rect.x + (rect.w / 2),
                    y: rect.y + (rect.h / 2),
                    radius: Math.max(rect.w, rect.h) / 2, // Approximate radius from drag rect
                    intensity: 80,
                    falloff: 'linear'
                };
                setInfluences(prev => [...prev, newInf]);
            }
        }
    };

    const renderZone = (z: DesignerZone) => {
        const bg = z.type === 'STAGE' ? 'bg-purple-100 border-purple-300' :
            z.type === 'ENTRANCE' ? 'bg-orange-100 border-orange-300' :
                'bg-gray-200 border-gray-300';
        return (
            <div key={z.id}
                onMouseDown={e => handleItemMouseDown(e, z.id, 'ZONE', z.geometry.x, z.geometry.y)}
                className={`absolute border-2 ${bg} flex items-center justify-center opacity-70 cursor-move rounded-md`}
                style={{ left: `${z.geometry.x}%`, top: `${z.geometry.y}%`, width: `${z.geometry.w}%`, height: `${z.geometry.h}%` }}>
                <span className="text-[10px] font-black uppercase text-gray-700/80 tracking-widest px-2 text-center leading-tight">
                    {z.label}
                </span>
            </div>
        );
    };

    const renderInfluence = (inf: DesignerInfluence) => {
        const color = inf.type === 'NOISE' ? 'bg-red-500' :
            inf.type === 'FACILITY' ? 'bg-blue-500' : 'bg-green-500';

        return (
            <div key={inf.id}
                onMouseDown={e => handleItemMouseDown(e, inf.id, 'INFLUENCE', inf.x - inf.radius, inf.y - inf.radius)}
                className="absolute z-0 mix-blend-multiply flex items-center justify-center cursor-move hover:border hover:border-gray-400 hover:border-dashed"
                style={{
                    left: `${inf.x - inf.radius}%`, top: `${inf.y - inf.radius}%`,
                    width: `${inf.radius * 2}%`, height: `${inf.radius * 2}%`,
                    background: `radial-gradient(circle, ${color} ${inf.intensity}%, transparent 70%)`,
                    opacity: 0.25
                }}>
                <div className={`w-2 h-2 rounded-full ${color}`} />
            </div>
        );
    };

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
                {zones.map(renderZone)}

                {/* 2. Heatmap Layer (Influences) */}
                {influences.map(renderInfluence)}

                {/* 3. Stalls Layer */}
                {stalls.map(stall => (
                    <div
                        key={stall.id}
                        onMouseDown={e => handleItemMouseDown(e, stall.id, 'STALL', stall.geometry.x, stall.geometry.y)}
                        className={`absolute border-2 transition-colors cursor-move flex flex-col items-center justify-center gap-0.5
                            ${stallColor(stall.category, editingStallId === stall.id)}
                            ${!stall.isAvailable ? 'opacity-40' : 'hover:shadow-md'}
                            ${editingStallId === stall.id ? 'z-20 shadow-lg' : 'z-10'}`}
                        style={{
                            left: `${stall.geometry.x}%`, top: `${stall.geometry.y}%`,
                            width: `${stall.geometry.w}%`, height: `${stall.geometry.h}%`,
                        }}
                    >
                        <span className="font-black text-[9px] leading-none">{stall.name}</span>
                        {stall.geometry.w > 4 && stall.geometry.h > 4 && (
                            <span className="text-[7px] font-bold opacity-60">{formatPrice(stall.priceCents)}</span>
                        )}
                    </div>
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
