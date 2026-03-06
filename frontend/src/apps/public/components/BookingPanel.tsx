import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { EventStall as Stall } from '@/shared/types/api'

// Sub-components
import { ConfirmModal } from './ConfirmModal'
import { BookingCartFAB } from './BookingCartFAB'
import { BookingSummary } from './BookingSummary'

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookingPanelProps {
  selectedIds: number[]
  allStalls: Stall[]
  remainingSlots: number
  eventName: string
  error: string | null
  isPending: boolean
  onConfirm: () => void
  onClearSelection: () => void
}

// ─── BookingPanel ─────────────────────────────────────────────────────────────

/**
 * BookingPanel Orchestrator
 * Manages the state and logic for the booking cart UI,
 * delegating rendering to specialized sub-components.
 */
export function BookingPanel({
  selectedIds,
  allStalls,
  remainingSlots,
  eventName,
  error,
  isPending,
  onConfirm,
  onClearSelection,
}: BookingPanelProps) {
  const [showModal, setShowModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Derived state
  const selectedStalls = allStalls.filter(s => selectedIds.includes(s.id))
  const totalCents = selectedStalls.reduce((sum, s) => sum + s.priceCents, 0)
  const hasSelection = selectedIds.length > 0

  // Optional: Auto-expand logic could go here
  useEffect(() => {
    // if (hasSelection && !isOpen) setIsOpen(true) 
  }, [hasSelection])

  const handleCheckout = () => setShowModal(true)
  const handleConfirm = () => onConfirm()

  return (
    <>
      {!isOpen ? (
        <BookingCartFAB
          hasSelection={hasSelection}
          count={selectedIds.length}
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <BookingSummary
          selectedStalls={selectedStalls}
          count={selectedIds.length}
          remainingSlots={remainingSlots}
          totalCents={totalCents}
          error={error}
          onClose={() => setIsOpen(false)}
          onCheckout={handleCheckout}
          onClearSelection={onClearSelection}
        />
      )}

      {/* ── Confirm Modal ── */}
      {showModal && createPortal(
        <ConfirmModal
          selectedStalls={selectedStalls}
          eventName={eventName}
          totalCents={totalCents}
          isPending={isPending}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />,
        document.body
      )}
    </>
  )
}
