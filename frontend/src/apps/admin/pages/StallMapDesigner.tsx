import { useState, useRef, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { publicApi } from '@/shared/api/publicApi';
import { APP_CONFIG } from '@/config';

/**
 * WHITE & SIMPLE STALL MAP DESIGNER
 * Aesthetic: Clean White Canvas, Popup Modal, Simplified State.
 */
export default function StallMapDesigner() {
    // Local Types
    interface DesignerStall {
        id: number;
        name: string;
        geometry: { x: number; y: number; w: number; h: number };
        priceCents: number;
    }

    // Context State
    const [eventId, setEventId] = useState<number>(APP_CONFIG.DEMO_EVENT_ID || 1);
    const [hallName, setHallName] = useState<string>("Main Exhibition Hall");

    // Designer State
    const [stalls, setStalls] = useState<DesignerStall[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
    const [editingStallId, setEditingStallId] = useState<number | null>(null);

    // Status State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const overlayRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        loadData();
    }, [eventId, hallName]);

    const loadData = async () => {
        try {
            setLoading(true);
            const mapData = await publicApi.getEventMap(eventId);
            const mapped = mapData.stalls
                .filter(s => s.hallName === hallName)
                .map(s => ({
                    id: s.id,
                    name: s.name,
                    geometry: typeof s.geometry === 'string' ? JSON.parse(s.geometry) : s.geometry,
                    priceCents: s.priceCents
                }));
            setStalls(mapped);
        } catch (err) {
            console.error("Load failed", err);
        } finally {
            setLoading(false);
        }
    };

    // Drawing Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;

        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentPos({ x, y });
        setEditingStallId(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        setCurrentPos({ x, y });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) return;

        const x = Math.min(startPos.x, currentPos!.x);
        const y = Math.min(startPos.y, currentPos!.y);
        const w = Math.abs(currentPos!.x - startPos.x);
        const h = Math.abs(currentPos!.y - startPos.y);

        if (w > 0.5 && h > 0.5) {
            const newStall: DesignerStall = {
                id: Date.now(), // Temp ID
                name: `S-${stalls.length + 1}`,
                geometry: { x, y, w, h },
                priceCents: 500000
            };
            setStalls([...stalls, newStall]);
            setEditingStallId(newStall.id);
        }

        setIsDrawing(false);
        setStartPos(null);
        setCurrentPos(null);
    };

    // Save Logic
    const handleSave = async () => {
        try {
            setLoading(true);
            setMessage(null);

            const eventMap = await publicApi.getEventMap(eventId);
            const otherStalls = eventMap.stalls.filter(s => s.hallName !== hallName);

            const payload = [
                ...otherStalls.map(s => ({
                    id: s.id,
                    name: s.name,
                    hallName: s.hallName,
                    geometry: typeof s.geometry === 'object' ? JSON.stringify(s.geometry) : s.geometry,
                    finalPriceCents: s.priceCents
                })),
                ...stalls.map(s => ({
                    id: s.id > 10000000000 ? undefined : s.id,
                    name: s.name,
                    hallName: hallName,
                    geometry: JSON.stringify(s.geometry),
                    finalPriceCents: s.priceCents
                }))
            ];

            await adminApi.saveLayout(eventId, payload as any);
            setMessage({ text: "Layout Synchronized Successfully!", type: 'success' });
            loadData();
        } catch (err: any) {
            setMessage({ text: "Save failed: " + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const editingStall = stalls.find(s => s.id === editingStallId);

    return (
        <div className="flex h-screen flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
            {/* CLEAN TOOLBAR */}
            <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-30 shadow-sm">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-black text-[10px]">SD</span>
                        </div>
                        <h1 className="font-bold text-sm tracking-tight text-gray-800 uppercase">Stall Map Designer</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Event ID</span>
                            <input
                                type="number"
                                value={eventId}
                                onChange={e => setEventId(Number(e.target.value))}
                                className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-12 text-blue-600"
                            />
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Hall Context</span>
                            <input
                                type="text"
                                value={hallName}
                                onChange={e => setHallName(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold min-w-[200px] text-blue-600"
                                placeholder="Main Hall"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {message && (
                        <div className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gray-900 text-white hover:bg-black disabled:opacity-30 rounded font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        {loading ? 'Processing...' : 'Sync & Save'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-12 flex justify-center items-start cursor-crosshair relative">
                {/* WHITE CANVAS */}
                <div
                    ref={overlayRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="relative bg-white shadow-xl border border-gray-200"
                    style={{ width: '1200px', height: '800px' }}
                >
                    <div className="absolute inset-0 pointer-events-none border-4 border-gray-50 opacity-50"></div>

                    {/* STALLS */}
                    {stalls.map(stall => (
                        <div
                            key={stall.id}
                            onClick={(e) => { e.stopPropagation(); setEditingStallId(stall.id); }}
                            className={`absolute border-2 transition-all cursor-pointer flex items-center justify-center font-bold text-[10px]
                                ${editingStallId === stall.id ? 'bg-blue-50 border-blue-500 text-blue-700 z-20' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white z-10'}`}
                            style={{
                                left: `${stall.geometry.x}%`,
                                top: `${stall.geometry.y}%`,
                                width: `${stall.geometry.w}%`,
                                height: `${stall.geometry.h}%`
                            }}
                        >
                            {stall.name}
                        </div>
                    ))}

                    {/* DRAW PREVIEW */}
                    {isDrawing && startPos && currentPos && (
                        <div
                            className="absolute border border-blue-500 bg-blue-500/10 border-dashed pointer-events-none"
                            style={{
                                left: `${Math.min(startPos.x, currentPos.x)}%`,
                                top: `${Math.min(startPos.y, currentPos.y)}%`,
                                width: `${Math.abs(currentPos.x - startPos.x)}%`,
                                height: `${Math.abs(currentPos.y - startPos.y)}%`
                            }}
                        />
                    )}
                </div>

                {/* MODAL POPUP */}
                {editingStall && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-in fade-in transition-opacity">
                        <div className="bg-white rounded-lg shadow-2xl w-[400px] border border-gray-100 overflow-hidden scale-in-center">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-xs uppercase tracking-widest text-gray-600">Edit Stall</h2>
                                <button onClick={() => setEditingStallId(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Stall Name</label>
                                    <input
                                        type="text"
                                        value={editingStall.name}
                                        onChange={e => setStalls(stalls.map(s => s.id === editingStallId ? { ...s, name: e.target.value } : s))}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">X Position %</label>
                                        <input type="number" step="0.1" value={editingStall.geometry.x.toFixed(1)} onChange={e => {
                                            const x = parseFloat(e.target.value);
                                            setStalls(stalls.map(s => s.id === editingStallId ? { ...s, geometry: { ...s.geometry, x } } : s));
                                        }} className="w-full border border-gray-200 rounded p-2 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">Y Position %</label>
                                        <input type="number" step="0.1" value={editingStall.geometry.y.toFixed(1)} onChange={e => {
                                            const y = parseFloat(e.target.value);
                                            setStalls(stalls.map(s => s.id === editingStallId ? { ...s, geometry: { ...s.geometry, y } } : s));
                                        }} className="w-full border border-gray-200 rounded p-2 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">Width %</label>
                                        <input type="number" step="0.1" value={editingStall.geometry.w.toFixed(1)} onChange={e => {
                                            const w = parseFloat(e.target.value);
                                            setStalls(stalls.map(s => s.id === editingStallId ? { ...s, geometry: { ...s.geometry, w } } : s));
                                        }} className="w-full border border-gray-200 rounded p-2 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">Height %</label>
                                        <input type="number" step="0.1" value={editingStall.geometry.h.toFixed(1)} onChange={e => {
                                            const h = parseFloat(e.target.value);
                                            setStalls(stalls.map(s => s.id === editingStallId ? { ...s, geometry: { ...s.geometry, h } } : s));
                                        }} className="w-full border border-gray-200 rounded p-2 text-xs font-bold" />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setEditingStallId(null)}
                                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-bold text-xs uppercase"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => { setStalls(stalls.filter(s => s.id !== editingStallId)); setEditingStallId(null); }}
                                        className="flex-1 py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded font-bold text-xs uppercase transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
