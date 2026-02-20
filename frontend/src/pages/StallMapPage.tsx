import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { publicApi } from '../api/publicApi'
import { vendorApi } from '../api/vendorApi'
import { useAuth } from '../context/AuthContext'

import { MapCanvas } from '../Components/MapCanvas'
import { StallTooltip } from '../Components/StallTooltip'
import { BookingPanel } from '../Components/BookingPanel'
import {
  Stall,
  RawEventMap,
  parseZones,
} from '../types/stallMap.utils'

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
  const [hoveredStall, setHoveredStall] = useState<Stall | null>(null)
  const [tooltipAnchor, setTooltipAnchor] = useState<DOMRect | null>(null)

  // ── Data ──────────────────────────────────────────────────────────────────
  const initialEventMap: RawEventMap = { eventId: 0, eventName: '', stalls: [], zones: '' }

  const { data: rawEventMap = initialEventMap, isLoading } = useQuery<RawEventMap>({
    queryKey: ['stalls', eventId],
    queryFn: () =>
      eventId
        ? publicApi.getEventMap(eventId)
        : Promise.resolve(initialEventMap),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  })

  const { data: limitData } = useQuery({
    queryKey: ['available-count', eventId],
    queryFn: () => (eventId ? vendorApi.getAvailableCount(eventId) : Promise.resolve({ limit: 3, used: 0, remaining: 3 })),
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
      console.log('✓ Influences parsed:', influences.length, influences)
    } else {
      console.log('⚠ No influences received.')
    }
  }, [influences])

  const allStalls: Stall[] = rawEventMap?.stalls ?? []

  const halls = useMemo(
    () =>
      Array.from(new Set(allStalls.map((s: Stall) => s.hallName).filter(Boolean))).sort() as string[],
    [allStalls]
  )

  // Auto-select first hall on load
  useEffect(() => {
    if (halls.length > 0 && (!selectedHall || !halls.includes(selectedHall))) {
      setSelectedHall(halls[0])
    } else if (halls.length === 0) {
      setSelectedHall(null)
    }
  }, [halls, selectedHall])

  const displayedStalls = useMemo(
    () => (selectedHall ? allStalls.filter((s: Stall) => s.hallName === selectedHall) : allStalls),
    [allStalls, selectedHall]
  )

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (vars: { userId: number, stallIds: number[] }) =>
      eventId ? vendorApi.createReservation({ ...vars, eventId }) : Promise.reject('No Event ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stalls'] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      navigate('/vendor/dashboard')
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
    (stall: Stall | null, anchorRect: DOMRect | null) => {
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
                            uppercase tracking-wider transition-all ${selectedHall === hall
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                {hall.length > 20 ? hall.split(' ').slice(-2).join(' ') : hall}
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
            influences={influences}
            zones={zones}
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