import { ShoppingCart, ChevronDown } from 'lucide-react'
import { MapStall, formatPrice } from '@/shared/types/stallMap.utils'

interface BookingSummaryProps {
    selectedStalls: MapStall[]
    count: number
    remainingSlots: number
    totalCents: number
    error: string | null
    onClose: () => void
    onCheckout: () => void
    onClearSelection: () => void
}

export function BookingSummary({
    selectedStalls,
    count,
    remainingSlots,
    totalCents,
    error,
    onClose,
    onCheckout,
    onClearSelection,
}: BookingSummaryProps) {
    const hasSelection = count > 0

    return (
        <div className="w-full animate-in slide-in-from-left-10 fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-100 
                     rounded-full flex items-center justify-center text-slate-400 
                     hover:text-slate-600 shadow-sm hover:shadow-md transition-all z-10"
                >
                    <ChevronDown className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 mt-2">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Cart</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        {count} <span className="text-slate-400 font-normal">/ {remainingSlots}</span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="text-red-600 text-[10px] mb-3 bg-red-50 border border-red-200
                          rounded-lg p-2 leading-relaxed">
                        {error}
                    </div>
                )}

                {/* List Section */}
                {hasSelection && (
                    <div className="max-h-48 overflow-y-auto no-scrollbar mb-4 space-y-2 py-1 border-y border-slate-50">
                        {selectedStalls.map(s => (
                            <div key={s.id} className="flex justify-between items-center px-1">
                                <span className="text-[10px] text-slate-600 font-medium truncate pr-2">{s.templateName}</span>
                                <span className="text-[10px] font-bold text-slate-900 whitespace-nowrap">
                                    {formatPrice(s.priceCents)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total + actions */}
                {hasSelection ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase text-slate-400 font-bold">Subtotal</span>
                            <div className="text-sm text-slate-900 font-black tabular-nums">
                                {formatPrice(totalCents)} <span className="text-[10px] text-slate-400 font-normal uppercase">LKR</span>
                            </div>
                        </div>

                        <button
                            onClick={onCheckout}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3
                         rounded-xl font-bold text-[10px] uppercase tracking-wider
                         transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            Secure Reservation
                        </button>

                        <button
                            onClick={onClearSelection}
                            className="w-full text-slate-300 hover:text-red-500 py-1
                         text-[9px] uppercase tracking-widest font-black transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-[10px] text-slate-400 font-medium px-4">
                            Your cart is empty. <br /> Select stalls on the map to begin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
