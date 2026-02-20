interface CancelReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    error: any;
    status: string;
}

export const CancelReservationModal = ({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    error,
    status
}: CancelReservationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                    {status === 'PAID' ? 'Request Refund?' : 'Cancel Reservation?'}
                </h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium text-justify">
                    {status === 'PAID'
                        ? "Are you sure you want to cancel? Your stall will be released and a refund request will be forwarded to the system administrator."
                        : "Are you sure you want to discard this pending reservation?"}
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold w-full text-center">
                        {error.response?.data?.message || 'Failed to cancel reservation.'}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Nevermind
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs"
                    >
                        {isPending ? 'Processing...' : (status === 'PAID' ? 'Yes, Request Refund' : 'Yes, Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};
