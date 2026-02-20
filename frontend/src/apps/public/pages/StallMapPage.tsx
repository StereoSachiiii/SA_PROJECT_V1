import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { publicApi } from '@/shared/api/publicApi'
import { vendorApi } from '@/shared/api/vendorApi'
import { useAuth } from '@/shared/context/AuthContext'
import { PUBLISHER_GENRES } from '@/shared/constants'

import { MapCanvas } from '@/shared/components/MapCanvas'
import { StallTooltip } from '@/shared/components/StallTooltip'
import { BookingPanel } from '@/apps/public/components/BookingPanel'
import {
  MapStall,
  RawEventMap,
  parseZones,
} from '@/shared/types/stallMap.utils'

// ─── StallMapPage ─────────────────────────────────────────────────────────────
// Responsibilities (only):
//   - Route params + data fetching
//   - selectedIds, showHeatmap, error, hall, hover state
//   - Wires MapCanvas + StallTooltip + BookingPanel + hero section
//
// All rendering lives in the child components.
// All types + helpers live in stallMap.utils.ts.

export default function StallMapPage() {
  const navigate = useNavigate()
  const { eventId: urlEventId } = useParams()
  const eventId = urlEventId ? parseInt(urlEventId, 10) : null

  useEffect(() => {
    if (!eventId) {
      navigate('/events')
    }
  }, [eventId, navigate])

  const queryClient = useQueryClient()
  const { user } = useAuth()

  // ── UI State ──────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedHall, setSelectedHall] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [hoveredStall, setHoveredStall] = useState<MapStall | null>(null)
  const [tooltipAnchor, setTooltipAnchor] = useState<DOMRect | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // ── Data ──────────────────────────────────────────────────────────────────
  const initialEventMap: RawEventMap = { eventId: 0, eventName: '', stalls: [], zones: '' }

  const { data: rawEventMap = initialEventMap, isLoading } = useQuery<RawEventMap>({
    queryKey: ['stalls', eventId],
    queryFn: () => {
      console.info(`[MapPage] Refetching event map for eventId: ${eventId}`);
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
      console.info(`[MapPage] Checking available slots for eventId: ${eventId}`);
      return eventId ? vendorApi.getAvailableCount(eventId) : Promise.resolve({ limit: 3, used: 0, remaining: 3 });
    },
    enabled: !!user && !!eventId,
  })
  const remainingSlots: number = limitData?.remaining ?? 3

  // ── Parsed zones — memoized on zones string change only ───────────────────
  const { influences, zones } = useMemo(
    () => parseZones(rawEventMap?.zones),
    [rawEventMap?.zones]
  )

  // DEBUG: Log parsed influences to verify data flow
  useEffect(() => {
    if (influences.length > 0) {
    } else {
    }
  }, [influences])

  const allStalls: MapStall[] = rawEventMap?.stalls ?? []

  const halls = useMemo(
    () =>
      Array.from(new Set(allStalls.map((s: MapStall) => s.hallName).filter(Boolean))).sort() as string[],
    [allStalls]
  )

  // Auto-select best hall on load — prefer genre-matched hall
  useEffect(() => {
    if (halls.length > 0 && (!selectedHall || !halls.includes(selectedHall))) {
      // Try to find a hall matching the selected genre
      const hallsMeta = (rawEventMap as any)?.halls ?? [];
      let best = halls[0];
      if (selectedGenre && selectedGenre !== 'ANY') {
        const match = halls.find(h => {
          const meta = hallsMeta.find((m: any) => m.hallName === h || m.name === h);
          const cat = (meta?.mainCategory || meta?.category || '').toUpperCase();
          return cat === selectedGenre;
        });
        if (match) best = match;
      }
      setSelectedHall(best)
    } else if (halls.length === 0) {
      setSelectedHall(null)
    }
  }, [halls, selectedHall, selectedGenre])

  const displayedStalls = useMemo(
    () => (selectedHall ? allStalls.filter((s: MapStall) => s.hallName === selectedHall) : allStalls),
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

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (vars: { userId: number, stallIds: number[] }) =>
      eventId ? vendorApi.createReservation({ ...vars, eventId }) : Promise.reject('No Event ID'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stalls'] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })

      // Redirect to checkout with the first reservation ID
      if (data && data.length > 0) {
        navigate(`/checkout/${data[0].id}`)
      } else {
        // Fallback if empty array - should not happen on success
        navigate('/vendor/dashboard')
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Reservation failed.')
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStallClick = useCallback(
    (stallId: number, isReserved: boolean) => {
      if (isReserved) return
      setSelectedIds(prev => {
        if (prev.includes(stallId)) {
          setError(null)
          return prev.filter(id => id !== stallId)
        }
        if (prev.length >= remainingSlots) {
          setError(`You can select up to ${remainingSlots} stalls.`)
          return prev
        }
        setError(null)
        return [...prev, stallId]
      })
    },
    [remainingSlots]
  )

  const handleHoverChange = useCallback(
    (stall: MapStall | null, anchorRect: DOMRect | null) => {
      setHoveredStall(stall)
      setTooltipAnchor(anchorRect)
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (!user?.id) { setError('Session not ready.'); return }
    mutation.mutate({ userId: user.id, stallIds: selectedIds })
  }, [user?.id, selectedIds, mutation])

  const handleClearSelection = useCallback(() => {
    setSelectedIds([])
    setError(null)
  }, [])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm tracking-widest uppercase">Loading venue</span>
        </div>
      </div>
    )
  }

  // ── Genre Gate — ask before showing map ────────────────────────────────────
  if (!selectedGenre) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-4">Step 1 of 2</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">What do you publish?</h1>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">
            Select your primary genre so we can recommend the best hall for your stall.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {PUBLISHER_GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200
                           text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50
                           transition-all active:scale-95"
              >
                {g.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedGenre('ANY')}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors"
          >
            Skip — show me all halls
          </button>
        </div>
      </div>
    )
  }

  // Helper: check if a hall is recommended for the selected genre
  const isRecommended = (hall: string): boolean => {
    if (selectedGenre === 'ANY') return false;
    const hallMeta = (rawEventMap as any)?.halls?.find((h: any) => h.hallName === hall || h.name === hall);
    if (!hallMeta) return false;
    // Match genre to hall's mainCategory (or tier-based logic)
    const category = (hallMeta.mainCategory || hallMeta.category || '').toUpperCase();
    return category === selectedGenre;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ══ MAP SECTION ═══════════════════════════════════════════════════════
          100vh so the map IS the first experience.
          White bg. The m-3 margin lives inside MapCanvas (not here) so the
          booking panel can still position relative to the full section.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full" style={{ height: '100vh' }}>

        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 z-30 bg-white border-b border-slate-100
                     flex items-center justify-between px-5 py-0"
          style={{ height: '48px' }}
        >
          {/* Event name */}
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-slate-900 font-semibold text-sm tracking-tight truncate max-w-xs">
              {rawEventMap?.eventName ?? 'Loading Event...'}
            </span>
          </div>

          {/* Hall pills */}
          <div className="flex gap-1.5 overflow-x-auto">
            {halls.map(hall => (
              <button
                key={hall}
                onClick={() => setSelectedHall(hall)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold
                            uppercase tracking-wider transition-all flex items-center gap-1.5 ${selectedHall === hall
                    ? 'bg-slate-900 text-white'
                    : isRecommended(hall)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                {hall.length > 20 ? hall.split(' ').slice(-2).join(' ') : hall}
                {isRecommended(hall) && selectedHall !== hall && (
                  <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black normal-case tracking-normal">★ Rec</span>
                )}
              </button>
            ))}
          </div>

          {/* Heatmap toggle + count */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowHeatmap(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]
                          font-bold uppercase tracking-wider transition-all ${showHeatmap
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              <span>◉</span>
              Heatmap
            </button>
            <span className="text-slate-400 text-xs tabular-nums">
              {displayedStalls.filter(s => !s.reserved).length} available
            </span>
          </div>
        </div>

        {/* Map canvas container — fills from below top bar */}
        <div className="absolute left-0 right-0 bottom-0" style={{ top: '48px' }}>
          <MapCanvas
            stalls={displayedStalls}
            influences={displayedInfluences}
            zones={displayedZones}
            selectedIds={selectedIds}
            showHeatmap={showHeatmap}
            onStallClick={handleStallClick}
            onHoverChange={handleHoverChange}
          />
        </div>

      </section>

      {/* ══ BOOKING PANEL — fixed to right side outside map ════════════════════ */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-64 max-h-[calc(100vh-120px)] overflow-y-auto">
        <BookingPanel
          selectedIds={selectedIds}
          allStalls={allStalls}
          remainingSlots={remainingSlots}
          eventName={rawEventMap?.eventName ?? ''}
          error={error}
          isPending={mutation.isPending}
          onConfirm={handleConfirm}
          onClearSelection={handleClearSelection}
        />
      </div>

      {/* HALL INFO SECTION */}
      {(() => {
        const currentHall = (rawEventMap as any)?.halls?.find((h: any) => h.name === selectedHall);
        if (!currentHall) return null;

        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 pt-10 pb-10 bg-white border-t border-slate-50">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentHall.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Hall Specification</p>
                    {(currentHall.mainCategory || currentHall.category) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {(currentHall.mainCategory || currentHall.category).replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${currentHall.tier === 'VIP' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  currentHall.tier === 'PREMIUM' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                  {currentHall.tier || 'Standard'} Tier
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                {/* Row 1: The Basics */}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Floor Level</p>
                  <p className="text-lg font-bold text-slate-900">Level {currentHall.floorLevel ?? currentHall.floor ?? 'G'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Area</p>
                  <p className="text-lg font-bold text-slate-900">{currentHall.totalSqFt || currentHall.sqFt ? `${(currentHall.totalSqFt || currentHall.sqFt).toLocaleString()} sqft` : '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</p>
                  <p className="text-lg font-bold text-slate-900">{currentHall.capacity ? `${currentHall.capacity.toLocaleString()} ppl` : '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Environment</p>
                  <div className="flex items-center gap-2 mt-1">
                    {currentHall.isAirConditioned || currentHall.isAc ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-100">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        A/C
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium text-sm mt-1">Non-A/C</span>
                    )}
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-700 font-medium text-sm">{currentHall.isIndoor ?? true ? 'Indoor' : 'Outdoor'}</span>
                  </div>
                </div>

                {/* Row 2: Rich Metadata (if available) */}
                {(currentHall.expectedFootfall || currentHall.ceilingHeight || currentHall.noiseLevel || currentHall.nearbyFacilities) && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Footfall</p>
                      <p className="text-lg font-bold text-slate-900">{currentHall.expectedFootfall ? `${currentHall.expectedFootfall.toLocaleString()}/day` : '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ceiling Height</p>
                      <p className="text-lg font-bold text-slate-900">{currentHall.ceilingHeight ? `${currentHall.ceilingHeight} ft` : '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Noise Level</p>
                      <p className="text-lg font-bold text-slate-900 capitalize">{currentHall.noiseLevel ? currentHall.noiseLevel.toLowerCase() : '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nearby Facilities</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight block truncate" title={currentHall.nearbyFacilities}>{currentHall.nearbyFacilities || '—'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ HERO — below the map ══════════════════════════════════════════════ */}
      <section className="bg-white px-8 py-20 text-center border-t border-slate-100">
        <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-4">
          Colombo International Book Fair 2026
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5
                       tracking-tight leading-tight">
          {rawEventMap?.eventName ?? 'The Premier Exhibition Experience.'}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed mb-12">
          Secure your position in Sri Lanka's most anticipated literary event.
          Pricing reflects real foot-traffic patterns and spatial visibility.
        </p>
        <div className="flex gap-16 justify-center mb-12">
          {[
            ['45,000+', 'Expected Footfall'],
            ['200+', 'Publishers'],
            ['10+', 'Halls'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-black text-slate-900">{n}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{l}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold
                     uppercase tracking-wider shadow-sm hover:bg-slate-800 transition-all"
        >
          ↑ Back to Map
        </button>
      </section>

      {/* ══ TOOLTIP — fixed to viewport, outside all stacking contexts ════════
          Only renders for non-reserved stalls with a valid anchor.
      ════════════════════════════════════════════════════════════════════════ */}
      {hoveredStall && !hoveredStall.reserved && tooltipAnchor && (
        <StallTooltip stall={hoveredStall} anchorRect={tooltipAnchor} />
      )}

      <style>{`
        @keyframes stallTooltip {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-stallTooltip {
          animation: stallTooltip 0.12s ease forwards;
        }
      `}</style>
    </div>
  )
}