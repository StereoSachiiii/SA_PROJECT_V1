import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '@/shared/api/adminApi';
import { publicApi } from '@/shared/api/publicApi';
import { Event, Hall } from '@/shared/types/api';
import { DesignerProvider, useDesigner } from './DesignerContext';
import { DesignerHeader } from './DesignerHeader';
import { DesignerCanvas } from './DesignerCanvas';
import { DesignerSidebar } from './DesignerSidebar';
import { StallEditModal } from './StallEditModal';
import { DesignerStall, parseGeometry, DesignerZone, DesignerInfluence } from './types';
import { parseZones } from '@/shared/types/stallMap.utils';

export default function StallDesignerPage() {
    const { hallId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Initial state matching the URL
    const [event, setEvent] = useState<Event | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);
    const [initialStalls, setInitialStalls] = useState<DesignerStall[]>([]);
    const [initialZones, setInitialZones] = useState<DesignerZone[]>([]);
    const [initialInfluences, setInitialInfluences] = useState<DesignerInfluence[]>([]);

    // We need mapData to preserve non-hall stalls during save
    const [rawMapData, setRawMapData] = useState<any>(null);

    // ─── Data Loading ─────────────────────────────────────────
    useEffect(() => {
        if (!hallId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Hall from all halls
                const allHalls = await adminApi.getAllHalls();
                const currentHall = allHalls.find(h => h.id === Number(hallId));
                if (!currentHall) throw new Error("Hall not found");
                setHall(currentHall);

                // 2. Fetch all venues to find which one owns this hall (Venue -> Building -> Hall)
                const venues = await adminApi.getAllVenues();
                const currentVenue = venues.find(v =>
                    v.buildings.some(b => b.halls.some(h => h.id === Number(hallId)))
                );
                if (!currentVenue) throw new Error("Venue not found for this hall");

                // 3. Fetch all events and find the one pointing to this venue
                const events = await adminApi.getAllEvents();
                const currentEvent = events.find(e => e.venueId === currentVenue.id);
                if (!currentEvent) throw new Error("No active event assigned to this venue");
                setEvent(currentEvent);

                // 4. Fetch Map Layout for the Event
                const mapData = await publicApi.getEventMap(currentEvent.id).catch(() => ({ stalls: [] }));
                setRawMapData(mapData);

                // 5. Parse stalls for this Hall
                const hallStalls = mapData.stalls
                    .filter((s: any) => s.hallName === currentHall.name)
                    .map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        geometry: parseGeometry(s.geometry),
                        priceCents: s.priceCents,
                        size: s.size || 'MEDIUM',
                        category: s.type || 'RETAIL',
                        isAvailable: !s.reserved,
                        sqFt: s.sqFt,
                    }));

                setInitialStalls(hallStalls);

                // 6. Parse Zones & Influences
                const parsedConfig = parseZones(currentEvent.layoutConfig);
                setInitialInfluences(parsedConfig.influences.map(inf => ({
                    id: inf.id,
                    type: inf.type as any,
                    x: inf.cx, y: inf.cy, radius: inf.r,
                    intensity: inf.intensity,
                    falloff: inf.falloff as any
                })));

                setInitialZones(parsedConfig.zones.map(z => ({
                    id: crypto.randomUUID(),
                    type: z.type,
                    geometry: { x: z.x, y: z.y, w: z.w, h: z.h },
                    label: z.label
                })));

            } catch (err: any) {
                setMessage({ text: 'Failed to load designer: ' + err.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [hallId]);

    // ─── Save Layout Hook ─────────────────────────────────────
    const handleSave = async (currentStalls: DesignerStall[], currentZones: DesignerZone[], currentInfluences: DesignerInfluence[]) => {
        if (!event || !hall || !rawMapData) return;
        setSaving(true);
        setMessage(null);
        try {
            // Keep stalls from other halls intact
            const otherStalls = rawMapData.stalls.filter((s: any) => s.hallName !== hall.name);

            const payload = [
                ...otherStalls.map((s: any) => ({
                    id: s.id, name: s.name, hallName: s.hallName,
                    geometry: typeof s.geometry === 'object' ? JSON.stringify(s.geometry) : s.geometry,
                    finalPriceCents: s.priceCents,
                })),
                ...currentStalls.map(s => ({
                    id: s.id > 10_000_000_000 ? undefined : s.id, // Drop fake IDs for new stalls
                    name: s.name, hallName: hall.name,
                    geometry: JSON.stringify(s.geometry),
                    finalPriceCents: s.priceCents,
                })),
            ];

            await adminApi.saveLayout(event.id, payload as any);

            // 2. Save Zones & Influences (LayoutConfig)
            // Convert back to RawZonesJson format expected by parseZones
            const layoutConfigObj = {
                width: 1000, height: 600, // Dummy pixel space representation since we draw in percentages
                entrances: [], // Legacy array, omit
                zones: currentZones.map(z => ({
                    type: z.type, geometry: z.geometry, metadata: { label: z.label }
                })),
                influences: currentInfluences.map(inf => ({
                    id: inf.id, type: inf.type, intensity: inf.intensity, falloff: inf.falloff,
                    // Converting percentages back to "pixel coordinates" out of 1000x600 grid that publicApi parseZones expects
                    x: (inf.x / 100) * 1000,
                    y: (inf.y / 100) * 600,
                    radius: (inf.radius / 100) * 1000
                }))
            };

            await adminApi.updateEvent(event.id, {
                // ...event payload except with new layoutConfig
                name: event.name,
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                status: event.status,
                imageUrl: event.imageUrl,
                venueId: event.venueId,
                layoutConfig: JSON.stringify(layoutConfigObj)
            } as any);

            setMessage({ text: 'Layout & zones saved successfully!', type: 'success' });

            // Reload raw map data stealthily so next save doesn't wipe changes
            const freshMapData = await publicApi.getEventMap(event.id);
            setRawMapData(freshMapData);

            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            setMessage({ text: 'Save failed: ' + err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Designer...</p>
            </div>
        );
    }

    if (!event || !hall) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mb-4">✕</div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Required</h1>
                <p className="text-gray-500 text-sm max-w-sm mb-6">{message?.text || "This hall is not assigned to an active event venue."}</p>
                <button
                    onClick={() => navigate('/admin/halls')}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-800 transition-colors"
                >
                    Back to Halls
                </button>
            </div>
        );
    }

    // A Wrapper component is needed because useDesigner can only be called INSIDE DesignerProvider.
    // We pass handleSave downwards through props so the context provider stays decoupled from network calls.
    return (
        <DesignerProvider event={event} hall={hall} initialStalls={initialStalls} initialZones={initialZones} initialInfluences={initialInfluences}>
            <DesignerWorkspace onSave={handleSave} saving={saving} message={message} />
        </DesignerProvider>
    );
}

// ─── Inner Workspace (Consumes Context) ──────────────────────
function DesignerWorkspace({
    onSave, saving, message
}: {
    onSave: (stalls: DesignerStall[], zones: DesignerZone[], influences: DesignerInfluence[]) => Promise<void>;
    saving: boolean;
    message: { text: string; type: 'success' | 'error' } | null;
}) {
    const { stalls, zones, influences, editingStallId } = useDesigner();

    return (
        <div className="flex h-[calc(100vh-64px)] -m-6 flex-col bg-gray-50 text-gray-900 font-sans">
            <DesignerHeader
                onSave={() => onSave(stalls, zones, influences)}
                saving={saving}
                message={message}
            />

            <div className="flex-1 flex overflow-hidden">
                <DesignerCanvas />
                <DesignerSidebar />
            </div>

            {editingStallId && <StallEditModal />}
        </div>
    );
}
