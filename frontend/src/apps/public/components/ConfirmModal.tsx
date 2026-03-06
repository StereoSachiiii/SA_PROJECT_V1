import { MapStall, formatPrice } from '@/shared/types/stallMap.utils'

interface ConfirmModalProps {
    selectedStalls: MapStall[]
    eventName: string
    totalCents: number
    isPending: boolean
    onConfirm: () => void
    onClose: () => void
}

export function ConfirmModal({
    selectedStalls,
    eventName,
    totalCents,
    isPending,
    onConfirm,
    onClose,
}: ConfirmModalProps) {

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]
                    flex items-center justify-center p-4">

            <div className="bg-white border border-slate-200 rounded-2xl
                      shadow-2xl z-10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900 text-lg">Confirm Reservation</h2>
                    <p className="text-slate-400 text-xs mt-1">{eventName}</p>
                </div>

                {/* Stall list */}
                <div className="px-6 py-4 space-y-2 h-auto max-h-[40vh] overflow-y-auto no-scrollbar">
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
                       transition-all"
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
