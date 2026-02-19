import { memo } from 'react'
import { createPortal } from 'react-dom'
import type { Stall } from '../types'

interface StallDetailsOverlayProps {
    stall: Stall;
    onClose: (e: React.MouseEvent) => void;
}

function StallDetailsOverlay({ stall, onClose }: StallDetailsOverlayProps) {
    const getDetails = (size: string) => {
        switch (size) {
            case 'LARGE':
                return "Premium double-width corner. Perfect for major publishers and flagship displays.";
            case 'MEDIUM':
                return "Standard wide stall. Great for independent bookstores and specialized collections.";
            case 'SMALL':
            default:
                return "Compact and efficient. Ideal for boutique sellers and individual authors.";
        }
    }

    // Render via Portal to avoid clipping by stall's overflow-hidden
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent close on card click
            >
                <div className="bg-primary-500 p-8 flex justify-between items-center">
                    <h3 className="text-black font-black text-2xl tracking-tighter uppercase">Stall Details</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all text-black font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Dimensions</p>
                            <p className="text-lg font-black text-black">{stall.size || 'STANDARD'}</p>
                            <p className="text-xs text-gray-500">{(stall as any).width || 3}m x {(stall as any).height || 3}m</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Pricing</p>
                            <p className="text-2xl font-black text-primary-600 tabular-nums">
                                LKR {((stall.priceCents || 0) / 100).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Description</p>
                        <p className="text-sm leading-relaxed text-gray-800 font-medium italic">
                            "{getDetails(stall.size || 'SMALL')}"
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] uppercase font-bold text-gray-300 tracking-widest">
                        <span>Stall ID: #{stall.id}</span>
                        <span>Available for Booking</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default memo(StallDetailsOverlay)
