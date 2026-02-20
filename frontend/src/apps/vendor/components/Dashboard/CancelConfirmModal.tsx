interface CancelConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    status?: string;
}

export const CancelConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    status
}: CancelConfirmModalProps) => {
    if (!isOpen) return null;

    const isPaid = status === 'PAID';

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-rose-50 mb-8 border-4 border-white shadow-xl">
                    <svg className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    {isPaid ? 'Refund Request' : 'Discard Booking'}
                </h3>

                <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
                    {isPaid
                        ? 'Confirming this will release your stall allocation and submit a refund request for administrator review.'
                        : 'Are you sure you want to cancel this reservation? This release the stalls to other vendors instantly.'}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full bg-rose-600 text-white rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-rose-700 disabled:opacity-50 transition-all shadow-xl shadow-rose-100 active:scale-95"
                    >
                        {isLoading ? 'Processing Release...' : isPaid ? 'Yes, Request Refund' : 'Yes, Discard Booking'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full bg-slate-50 text-slate-400 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-100 disabled:opacity-50 transition-all active:scale-95"
                    >
                        Keep Reservation
                    </button>
                </div>
            </div>
        </div>
    );
};
