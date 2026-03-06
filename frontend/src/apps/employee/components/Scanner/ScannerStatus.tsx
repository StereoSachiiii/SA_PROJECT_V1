interface AdmitSuccessViewProps {
    businessName: string;
    handleReset: () => void;
}

export const AdmitSuccessView = ({ businessName, handleReset }: AdmitSuccessViewProps) => (
    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8 text-center animate-bounce-in">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg shadow-emerald-200">
            ✓
        </div>
        <h3 className="text-2xl font-black text-emerald-900 mb-1 leading-tight">ADMITTED</h3>
        <p className="text-emerald-700 font-bold text-lg mb-4">{businessName}</p>
        <div className="flex flex-col gap-1 text-emerald-600/60 text-xs font-bold tracking-widest uppercase">
            <span>Check-in recorded</span>
            <span>{new Date().toLocaleTimeString()}</span>
        </div>
        <button
            onClick={handleReset}
            className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all"
        >
            Next
        </button>
    </div>
);

interface LookupErrorViewProps {
    error: any;
    handleReset: () => void;
}

export const LookupErrorView = ({ error, handleReset }: LookupErrorViewProps) => (
    <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-8 text-center animate-shake">
        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg shadow-rose-200">
            ✕
        </div>
        <h3 className="text-2xl font-black text-rose-900 mb-2 leading-tight">NOT FOUND</h3>
        <p className="text-rose-700 font-bold mb-6">{error?.message || "Reservation not found"}</p>
        <button
            onClick={handleReset}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
        >
            TRY AGAIN
        </button>
    </div>
);
