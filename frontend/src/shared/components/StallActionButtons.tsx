import { memo } from 'react'

interface StallActionButtonsProps {
    onBook: (e: React.MouseEvent) => void;
    onDetails: (e: React.MouseEvent) => void;
    isPending?: boolean;
}

function StallActionButtons({ onBook, onDetails, isPending }: StallActionButtonsProps) {
    return (
        <div className="flex flex-col gap-2 w-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
                onClick={onBook}
                disabled={isPending}
                className="
                    w-full py-2 bg-primary-500 text-secondary font-black rounded-lg 
                    shadow-glow-gold hover:bg-black hover:text-white 
                    transition-all transform hover:scale-105 active:scale-95
                    text-xs uppercase tracking-tight
                "
            >
                {isPending ? 'Booking...' : 'Book Now'}
            </button>
            <button
                onClick={onDetails}
                className="
                    w-full py-2 bg-white/20 backdrop-blur-md border border-white/30 
                    text-white font-bold rounded-lg hover:bg-white/40 
                    transition-all text-xs uppercase tracking-tight
                "
            >
                Details
            </button>
        </div>
    )
}

export default memo(StallActionButtons)
