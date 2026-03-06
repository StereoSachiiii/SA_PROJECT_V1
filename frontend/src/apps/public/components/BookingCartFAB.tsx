import { ShoppingCart } from 'lucide-react'

interface BookingCartFABProps {
    hasSelection: boolean
    count: number
    onClick: () => void
}

export function BookingCartFAB({ hasSelection, count, onClick }: BookingCartFABProps) {
    return (
        <button
            onClick={onClick}
            className="group relative flex items-center justify-center w-14 h-14 bg-slate-900 
                 text-white rounded-2xl shadow-2xl hover:bg-slate-800 transition-all 
                 duration-300 hover:scale-110 active:scale-95 z-50 overflow-visible"
        >
            <ShoppingCart className="w-6 h-6" />
            {hasSelection && (
                <div className="absolute -right-2 -top-2 bg-blue-600 text-white text-[10px] 
                        font-black w-6 h-6 rounded-full flex items-center justify-center 
                        ring-4 ring-white shadow-lg animate-in zoom-in duration-300 text-center">
                    {count}
                </div>
            )}
            <div className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity 
                      bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-xl pointer-events-none
                      whitespace-nowrap font-bold shadow-xl border border-white/10">
                {hasSelection ? 'View Selection' : 'Start Booking'}
            </div>
        </button>
    )
}
