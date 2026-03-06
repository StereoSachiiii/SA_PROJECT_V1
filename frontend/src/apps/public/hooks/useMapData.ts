import { useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '@/shared/api/publicApi'
import { vendorApi } from '@/shared/api/vendorApi'
import { EventStall as Stall } from '@/shared/types/api';
import { RawEventMap, normalizeMapData } from '@/shared/types/stallMap.utils';

interface UseMapDataProps {
    eventId: number | null
    user: any | null
    selectedGenre: string | null
    selectedHall: string | null
    setSelectedHall: (hall: string | null) => void
}

export function useMapData({
    eventId,
    user,
    selectedGenre,
    selectedHall,
    setSelectedHall,
}: UseMapDataProps) {
    const initialEventMap: RawEventMap = { eventId: 0, eventName: '', stalls: [], zones: [], influences: [] }

    const { data: rawEventMap = initialEventMap, isLoading } = useQuery<RawEventMap>({
        queryKey: ['stalls', eventId],
        queryFn: () => {
            return eventId
                ? publicApi.getEventMap(eventId)
                : Promise.resolve(initialEventMap);
        },
        enabled: !!eventId,
        staleTime: 1000 * 60 * 5,
    })

    const { data: limitData } = useQuery({
        queryKey: ['available-count', eventId],
        queryFn: () => {
            return eventId ? vendorApi.getAvailableCount(eventId) : Promise.resolve({ limit: 3, used: 0, remaining: 3 });
        },
        enabled: !!user && !!eventId,
    })

    const remainingSlots: number = limitData?.remaining ?? 3

    const { influences, zones } = useMemo(
        () => normalizeMapData(rawEventMap?.zones || [], rawEventMap?.influences || [], rawEventMap?.halls || []),
        [rawEventMap?.zones, rawEventMap?.influences, rawEventMap?.halls]
    )

    const allStalls: Stall[] = rawEventMap?.stalls ?? []

    const halls = useMemo(
        () => Array.from(new Set(allStalls.map((s: Stall) => s.hallName).filter(Boolean))).sort() as string[],
        [allStalls]
    )

    // Auto-select best hall on load — prefer genre-matched hall
    useEffect(() => {
        if (halls.length > 0 && (!selectedHall || !halls.includes(selectedHall))) {
            const hallsMeta = rawEventMap.halls ?? [];
            let best = halls[0];
            if (selectedGenre && selectedGenre !== 'ANY') {
                const match = halls.find(h => {
                    const meta = hallsMeta.find(m => (m as any).name === h);
                    const cat = ((meta as any)?.mainCategory || (meta as any)?.category || '').toUpperCase();
                    return cat === selectedGenre;
                });
                if (match) best = match;
            }
            setSelectedHall(best)
        } else if (halls.length === 0) {
            setSelectedHall(null)
        }
    }, [halls, selectedHall, selectedGenre, rawEventMap, setSelectedHall])

    const displayedStalls = useMemo(
        () => (selectedHall ? allStalls.filter((s: Stall) => s.hallName === selectedHall) : allStalls),
        [allStalls, selectedHall]
    )

    const displayedInfluences = useMemo(
        () => influences.filter(inf => !inf.hallName || inf.hallName === selectedHall),
        [influences, selectedHall]
    )

    const displayedZones = useMemo(
        () => zones.filter(z => !z.hallName || z.hallName === selectedHall),
        [zones, selectedHall]
    )

    const isRecommended = (hall: string): boolean => {
        if (selectedGenre === 'ANY' || !selectedGenre) return false;
        const hallMeta = rawEventMap.halls?.find(h => (h as any).name === hall);
        if (!hallMeta) return false;
        const category = ((hallMeta as any).mainCategory || (hallMeta as any).category || '').toUpperCase();
        return category === selectedGenre;
    }

    return {
        rawEventMap,
        isLoading,
        remainingSlots,
        halls,
        displayedStalls,
        displayedInfluences,
        displayedZones,
        isRecommended,
        allStalls
    }
}
