interface PaymentIntentErrorProps {
    error: string;
    onRetry: () => void;
}

export const PaymentIntentError = ({ error, onRetry }: PaymentIntentErrorProps) => {
    return (
        <div className="bg-rose-50 text-rose-700 p-8 rounded-3xl border-2 border-rose-100 text-center">
            <h4 className="font-black text-lg mb-2">Service Unavailable</h4>
            <p className="text-sm font-bold opacity-70 mb-6">{error}</p>
            <button
                onClick={onRetry}
                className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
                Try Cash Payment
            </button>
        </div>
    );
};
