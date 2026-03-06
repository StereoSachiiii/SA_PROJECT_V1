interface CancelOverlayProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const CancelOverlay = ({ onConfirm, onCancel, isLoading }: CancelOverlayProps) => (
    <div className="absolute inset-0 z-30 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in zoom-in duration-200">
        <h4 className="text-xl font-black mb-1">Cancel this Stall?</h4>
        <p className="text-sm font-bold opacity-80 mb-6 text-center">This will release the stall for others to book.</p>
        <div className="flex gap-3 w-full max-w-[280px]">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onConfirm();
                }}
                className="flex-1 bg-white text-red-600 py-3 rounded-xl font-black shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-105"
            >
                {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
                className="flex-1 bg-black/20 border border-white/20 text-white py-3 rounded-xl font-black hover:bg-black transition-all"
            >
                Keep it
            </button>
        </div>
    </div>
);
