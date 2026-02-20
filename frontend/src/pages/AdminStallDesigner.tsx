import { useState, useRef, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { EventStall } from '../types/api';

// Simple implementation of a "Stall Designer"
// Features: Upload Map, Draw Stalls, Save
export default function AdminStallDesigner() {
    // State
    const [eventId, setEventId] = useState<number>(5001); // Default to Demo Event
    const [mapUrl, setMapUrl] = useState<string>(''); // URL of the background image
    const [stalls, setStalls] = useState<Partial<EventStall>[]>([]);

    // UI State
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [selectedStallId, setSelectedStallId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Refs
    const overlayRef = useRef<HTMLDivElement>(null);

    // Load initial data (mock or real)
    useEffect(() => {
        // In a real app, we'd fetch the event layout here
        // adminApi.getLayout(eventId).then(setStalls)
    }, [eventId]);

    // MAP UPLOAD HANDLER
    const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        // Setup local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setMapUrl(objectUrl);

        try {
            setLoading(true);
            // Upload to backend (if backend supports it yet)
            // await adminApi.uploadVenueMap(eventId, file);
            setMessage("Map uploaded (Preview Mode)");
        } catch (err) {
            console.error(err);
            setMessage("Failed to upload map to server, using local preview.");
        } finally {
            setLoading(false);
        }
    };

    // DRAWING LOGIC (Mouse Down/Move/Up on Overlay)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100; // %
        const y = (e.clientY - rect.top) / rect.height * 100; // %

        setIsDrawing(true);
        setStartPos({ x, y });
        setSelectedStallId(null);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const currentX = (e.clientX - rect.left) / rect.width * 100;
        const currentY = (e.clientY - rect.top) / rect.height * 100;

        // Calculate geometry (always positive width/height)
        const x = Math.min(startPos.x, currentX);
        const y = Math.min(startPos.y, currentY);
        const w = Math.abs(currentX - startPos.x);
        const h = Math.abs(currentY - startPos.y);

        // Minimum size check (e.g. 1% to avoid clicks registering as tiny draws)
        if (w > 1 && h > 1) {
            const newStall: Partial<EventStall> = {
                id: Date.now(), // Temp ID
                templateName: `S-${stalls.length + 1}`,
                status: 'AVAILABLE',
                priceCents: 500000,
                geometry: { x, y, w, h }
            };
            setStalls([...stalls, newStall]);
        }

        setIsDrawing(false);
        setStartPos(null);
    };

    // SAVE LAYOUT
    const handleSave = async () => {
        try {
            setLoading(true);
            await adminApi.saveLayout(eventId, stalls);
            setMessage("Layout Saved Successfully!");
        } catch (err: any) {
            setMessage("Error saving: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // DELETE STALL
    const handleDeleteStall = (id: number) => {
        setStalls(stalls.filter(s => s.id !== id));
        setSelectedStallId(null);
    };

    return (
        <div className="flex h-screen flex-col">
            {/* TOOLBAR */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-xl">Stall Designer</h1>
                    <select
                        className="bg-gray-700 text-white p-1 rounded border border-gray-600"
                        value={eventId}
                        onChange={e => setEventId(Number(e.target.value))}
                    >
                        <option value={5001}>Event #5001 (KBF 2026)</option>
                        <option value={5002}>Event #5002 (Draft)</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleMapUpload}
                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* CANVAS AREA */}
                <div className="flex-1 bg-gray-100 overflow-auto p-8 flex justify-center items-start relative">
                    {mapUrl ? (
                        <div
                            className="relative shadow-2xl border-4 border-white select-none"
                            style={{ width: '1000px', height: 'auto' }} // Fixed width for V1 consistency
                        >
                            <img src={mapUrl} alt="Venue Map" className="w-full pointer-events-none" />

                            {/* OVERLAY FOR DRAWING/RENDERING */}
                            <div
                                ref={overlayRef}
                                className="absolute inset-0 cursor-crosshair"
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                            >
                                {stalls.map(stall => (
                                    <div
                                        key={stall.id}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent new draw
                                            setSelectedStallId(stall.id!);
                                        }}
                                        className={`absolute border-2 flex items-center justify-center text-xs font-bold transition-all
                                            ${selectedStallId === stall.id ? 'border-blue-500 bg-blue-500/30' : 'border-red-500 bg-red-500/20'}
                                            hover:bg-blue-500/40
                                        `}
                                        style={{
                                            left: `${stall.geometry?.x}%`,
                                            top: `${stall.geometry?.y}%`,
                                            width: `${stall.geometry?.w}%`,
                                            height: `${stall.geometry?.h}%`
                                        }}
                                    >
                                        {stall.templateName}
                                    </div>
                                ))}

                                {/* DRAWING PREVIEW */}
                                {isDrawing && startPos && (
                                    <div className="absolute border-2 border-dashed border-blue-600 bg-blue-200/20 pointer-events-none"
                                        style={{
                                            left: `${startPos.x}%`,
                                            top: `${startPos.y}%`,
                                            width: '0px', height: '0px' // Dynamic update handled by state/rect, simplified for now
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 mt-20 text-center border-2 border-dashed border-gray-300 p-20 rounded-xl">
                            <h2 className="text-2xl font-bold mb-2">No Map Loaded</h2>
                            <p>Upload a venue floor plan to start designing.</p>
                        </div>
                    )}
                </div>

                {/* PROPERTIES SIDEBAR */}
                <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Properties</h3>

                    {selectedStallId ? (
                        <div className="space-y-4">
                            {(() => {
                                const stall = stalls.find(s => s.id === selectedStallId);
                                if (!stall) return null;
                                return (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500">Stall Name</label>
                                            <input
                                                className="w-full border p-2 rounded"
                                                value={stall.templateName}
                                                onChange={(e) => {
                                                    setStalls(stalls.map(s => s.id === stall.id ? { ...s, templateName: e.target.value } : s));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500">Price (Cents)</label>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded"
                                                value={stall.priceCents}
                                                onChange={(e) => {
                                                    setStalls(stalls.map(s => s.id === stall.id ? { ...s, priceCents: Number(e.target.value) } : s));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500">Status</label>
                                            <select
                                                className="w-full border p-2 rounded"
                                                value={stall.status}
                                                onChange={(e) => {
                                                    setStalls(stalls.map(s => s.id === stall.id ? { ...s, status: e.target.value as any } : s));
                                                }}
                                            >
                                                <option value="AVAILABLE">AVAILABLE</option>
                                                <option value="RESERVED">RESERVED</option>
                                                <option value="SOLD">SOLD</option>
                                            </select>
                                        </div>
                                        <hr className="my-4" />
                                        <button
                                            onClick={() => handleDeleteStall(stall.id!)}
                                            className="w-full py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200"
                                        >
                                            Delete Stall
                                        </button>
                                    </>
                                )
                            })()}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Select a stall to edit its properties.</p>
                    )}

                    {message && (
                        <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
