interface PaymentMethodSelectorProps {
    onSelect: (method: 'ONLINE' | 'CASH') => void;
}

export const PaymentMethodSelector = ({ onSelect }: PaymentMethodSelectorProps) => {
    return (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Choose Payment Method</h3>

            <button
                onClick={() => onSelect('ONLINE')}
                className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-indigo-50 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all active:scale-95 text-left group shadow-sm hover:shadow-indigo-100"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-black text-slate-900 text-lg">Pay Online</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">Secure Checkout via Stripe</div>
                    </div>
                </div>
                <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>

            <button
                onClick={() => onSelect('CASH')}
                className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-emerald-50 bg-white hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-95 text-left group shadow-sm hover:shadow-emerald-100"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-black text-slate-900 text-lg">Pay at Venue</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">Manual Payment at Cashier</div>
                    </div>
                </div>
                <div className="text-slate-300 group-hover:text-emerald-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>
        </div>
    );
};
