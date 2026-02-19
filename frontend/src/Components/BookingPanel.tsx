import { useState } from 'react'
import { Stall, formatPrice } from '../types/stallMap.utils'

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

// ─── Confirm Modal ────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  selectedIds: number[]
  allStalls: Stall[]
  eventName: string
  totalCents: number
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

function ConfirmModal({
  selectedIds,
  allStalls,
  eventName,
  totalCents,
  isPending,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const selectedStalls = allStalls.filter(s => selectedIds.includes(s.id))

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]
                    flex items-center justify-center p-4 h-auto w-auto">


      {/* adjust height   */}
      <div className="bg-white border border-slate-200 rounded-2xl
                      shadow-2xl z-10 h-auto w-auto">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">Confirm Reservation</h2>
          <p className="text-slate-400 text-xs mt-1">{eventName}</p>
        </div>

        {/* Stall list */}
        <div className="px-6 py-4 space-y-2 h-auto overflow-y-auto">
          {selectedStalls.map(s => (
            <div key={s.id} className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800 font-medium">{s.templateName}</span>
                {s.type && (
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${s.type === 'PREMIUM'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                    }`}>
                    {s.type}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                {formatPrice(s.priceCents)} <span className="text-[10px] text-slate-400 font-normal">LKR</span>
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-between
                        items-center bg-slate-50">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Total</span>
          <span className="font-black text-slate-900 text-xl tabular-nums">
            {formatPrice(totalCents)}{' '}
            <span className="text-sm text-slate-400 font-normal">LKR</span>
          </span>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700
                       py-3 rounded-xl font-bold text-[11px] uppercase 
                       transition-all h-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50
                       text-white py-3 rounded-xl font-bold text-[11px] uppercase
                       tracking-wider transition-all active:scale-95"
          >
            {isPending ? 'Processing…' : 'Secure Slots'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── BookingPanel ─────────────────────────────────────────────────────────────

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

  const totalCents = allStalls
    .filter(s => selectedIds.includes(s.id))
    .reduce((sum, s) => sum + s.priceCents, 0)

  const hasSelection = selectedIds.length > 0

  const handleCheckout = () => setShowModal(true)

  const handleConfirm = () => {
    onConfirm()
    // Parent handles navigation/reset on success; modal stays open during pending
  }

  return (
    <>
      {/* ── Cart HUD ── simple block, parent handles positioning */}
      <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">

          {/* Slot counter */}
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">
            Cart
          </div>
          <div className="text-3xl font-black text-slate-900 mb-0.5">
            {selectedIds.length}
            <span className="text-slate-300 text-sm font-normal"> / {remainingSlots}</span>
          </div>
          <div className="text-[9px] text-slate-400 mb-4">slots selected</div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-[10px] mb-3 bg-red-50 border border-red-200
                            rounded-lg p-2 leading-relaxed">
              {error}
            </div>
          )}

          {/* Total + actions */}
          {hasSelection ? (
            <div className="space-y-2">
              <div className="text-xs text-slate-600 font-medium tabular-nums">
                {formatPrice(totalCents)} <span className="text-slate-400">LKR</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3
                           rounded-xl font-bold text-[10px] uppercase tracking-wider
                           transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Reserve Selected Stalls
              </button>
              <button
                onClick={onClearSelection}
                className="w-full text-slate-400 hover:text-slate-600 py-1
                           text-[10px] uppercase tracking-wider transition-colors"
              >
                Clear
              </button>
            </div>
          ) : (
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Click a stall to select it.
            </p>
          )}
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      {showModal && (
        <ConfirmModal
          selectedIds={selectedIds}
          allStalls={allStalls}
          eventName={eventName}
          totalCents={totalCents}
          isPending={isPending}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
