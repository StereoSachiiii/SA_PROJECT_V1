//hooks
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//auth context
import { useAuth } from '@/shared/context/AuthContext'

//sub componenets
import { GenreGate } from '@/apps/public/components/GenreGate'
import { StallMapHeader } from '@/apps/public/components/StallMapHeader'
import { StallMapHero } from '@/apps/public/components/StallMapHero'
import { MapLoadingOverlay } from '@/apps/public/components/MapLoadingOverlay'
import { HallInfo } from '@/apps/public/components/HallInfo'
import { MapCanvas } from '@/shared/components/MapCanvas'
import { StallTooltip } from '@/shared/components/StallTooltip'
import { BookingPanel } from '@/apps/public/components/BookingPanel'

import { useMapData } from '../hooks/useMapData'
import { useStallSelection } from '../hooks/useStallSelection'
import { useStallUpdates } from '@/hooks/useStallUpdates'
import { useQueryClient } from '@tanstack/react-query'

//types
import { MapStall, RawEventMap } from '@/shared/types/stallMap.utils'

export default function StallMapPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { eventId: urlEventId } = useParams()
  const eventId = urlEventId ? parseInt(urlEventId, 10) : null

  // ── Real-time Updates ─────────────────────────────────────────────────────
  useStallUpdates(useCallback((update) => {
    queryClient.setQueryData(['stalls', eventId], (oldData: RawEventMap | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        stalls: oldData.stalls.map(s => s.id === update.stallId ? {
          ...s,
          reserved: update.reserved,
          occupiedBy: update.occupiedBy,
          publisherCategory: update.publisherCategory
        } : s)
      };
    });
  }, [queryClient, eventId]));

  useEffect(() => {
    if (!eventId) {
      navigate('/events')
    }
  }, [eventId, navigate])

  const { user } = useAuth()

  // ── UI State ──────────────────────────────────────────────────────────────
  const [selectedHall, setSelectedHall] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [hoveredStall, setHoveredStall] = useState<MapStall | null>(null)
  const [tooltipAnchor, setTooltipAnchor] = useState<DOMRect | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // ── Logic Hooks ───────────────────────────────────────────────────────────
  const {
    rawEventMap,
    isLoading,
    remainingSlots,
    halls,
    displayedStalls,
    displayedInfluences,
    displayedZones,
    isRecommended,
    allStalls
  } = useMapData({
    eventId,
    user,
    selectedGenre,
    selectedHall,
    setSelectedHall
  })

  const {
    selectedIds,
    error,
    handleStallClick,
    handleConfirm,
    handleClearSelection,
    isPending
  } = useStallSelection({
    eventId,
    user,
    remainingSlots
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleHoverChange = useCallback(
    (stall: MapStall | null, anchorRect: DOMRect | null) => {
      setHoveredStall(stall)
      setTooltipAnchor(anchorRect)
    },
    []
  )

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) return <MapLoadingOverlay />;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {!selectedGenre && <GenreGate setSelectedGenre={setSelectedGenre} />}

      {selectedGenre && (
        <>
          <section className="relative w-full h-screen">
            <StallMapHeader
              eventName={rawEventMap?.eventName ?? 'Loading...'}
              halls={halls}
              selectedHall={selectedHall}
              setSelectedHall={setSelectedHall}
              isRecommended={isRecommended}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
              availableCount={displayedStalls.filter(s => !s.reserved).length}
              selectedGenre={selectedGenre}
            />

            <div className="absolute left-0 right-0 bottom-0 top-[56px]">
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

          <div className="fixed left-6 bottom-6 z-40 w-64 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            <BookingPanel
              selectedIds={selectedIds}
              allStalls={allStalls}
              remainingSlots={remainingSlots}
              eventName={rawEventMap?.eventName ?? ''}
              error={error}
              isPending={isPending}
              onConfirm={handleConfirm}
              onClearSelection={handleClearSelection}
            />
          </div>

          {(() => {
            const currentHall = rawEventMap?.halls?.find((h: any) => h.name === selectedHall);
            return currentHall ? <HallInfo currentHall={currentHall} /> : null;
          })()}

          <StallMapHero eventName={rawEventMap?.eventName ?? ''} />

          {hoveredStall && !hoveredStall.reserved && tooltipAnchor && (
            <StallTooltip stall={hoveredStall} anchorRect={tooltipAnchor} />
          )}
        </>
      )
      }
    </div>
  )
}
