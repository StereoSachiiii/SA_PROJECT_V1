import { useState, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { publicApi } from '@/shared/api/publicApi';
import { Event, Hall } from '@/shared/types/api';
import { DesignerStall, DesignerZone, DesignerInfluence } from '../types';
import { normalizeMapData, NormalizedInfluence, NormalizedZone } from '@/shared/types/stallMap.utils';

export function useDesignerLoading(hallId: string | undefined) {
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);
    const [initialStalls, setInitialStalls] = useState<DesignerStall[]>([]);
    const [initialZones, setInitialZones] = useState<DesignerZone[]>([]);
    const [initialInfluences, setInitialInfluences] = useState<DesignerInfluence[]>([]);
    const [rawMapData, setRawMapData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hallId) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const allHalls = await adminApi.getAllHalls();
                const currentHall = allHalls.find(h => h.id === Number(hallId));
                if (!currentHall) throw new Error("Hall not found");
                setHall(currentHall);

                const venues = await adminApi.getAllVenues();
                const currentVenue = venues.find(v =>
                    v.buildings?.some(b => b.halls?.some(h => h.id === Number(hallId)))
                );
                if (!currentVenue) throw new Error("Venue not found for this hall");

                const events = await adminApi.getAllEvents();
                const currentEvent = events.find(e => e.venueId === currentVenue.id);
                if (!currentEvent) throw new Error("No active event assigned to this venue");
                setEvent(currentEvent);

                const [mapDataRaw, adminStallsRaw] = await Promise.all([
                    publicApi.getEventMap(currentEvent.id).catch(() => ({ stalls: [], zones: [], influences: [] })),
                    adminApi.getEventStalls(currentEvent.id).catch(() => [])
                ]);
                const mapData = mapDataRaw as any;
                setRawMapData(mapData);

                const adminStallsMap = new Map(adminStallsRaw.map(s => [s.id, s]));

                const hallStalls: DesignerStall[] = (mapData?.stalls || [])
                    .filter((s: any) => s.hallName === currentHall.name)
                    .map((s: any) => {
                        const adminInfo = adminStallsMap.get(s.id);
                        return {
                            id: s.id,
                            name: s.name,
                            posX: s.posX || 0,
                            posY: s.posY || 0,
                            width: s.width || 8,
                            height: s.height || 8,
                            priceCents: Math.round(Number(s.priceCents)) || 0,
                            baseRateCents: adminInfo ? Math.round(Number(adminInfo.baseRateCents)) : Math.round(Number(s.priceCents)),
                            pricingVersion: adminInfo?.pricingVersion || "LEGACY",
                            size: s.size || 'MEDIUM',
                            category: s.category || 'RETAIL',
                            isAvailable: !s.reserved,
                            sqFt: s.sqFt,
                        };
                    });

                setInitialStalls(hallStalls);

                const parsedConfig = normalizeMapData(mapData.zones || [], mapData.influences || []);
                const hallInfluences: DesignerInfluence[] = parsedConfig.influences
                    .filter((inf: NormalizedInfluence) => !inf.hallName || inf.hallName === currentHall.name)
                    .map((inf: NormalizedInfluence) => ({
                        id: inf.id,
                        type: inf.type as any,
                        intensity: inf.intensity,
                        falloff: inf.falloff as any,
                        posX: inf.cx,
                        posY: inf.cy,
                        radius: inf.r
                    }));
                setInitialInfluences(hallInfluences);

                const hallZones: DesignerZone[] = parsedConfig.zones
                    .filter((z: NormalizedZone) => !z.hallName || z.hallName === currentHall.name)
                    .map((z: NormalizedZone) => ({
                        id: crypto.randomUUID(),
                        type: z.type as any,
                        posX: z.x,
                        posY: z.y,
                        width: z.w,
                        height: z.h,
                        label: z.label
                    }));
                setInitialZones(hallZones);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [hallId]);

    return {
        loading,
        event,
        hall,
        initialStalls,
        initialZones,
        initialInfluences,
        rawMapData,
        error,
        setRawMapData // For refreshing after save
    };
}
