import { useNavigate } from 'react-router-dom';

interface CheckoutSuccessProps {
    reservationId: number;
    paymentMethod: 'ONLINE' | 'CASH' | 'SELECT';
}

export const CheckoutSuccess = ({ reservationId, paymentMethod }: CheckoutSuccessProps) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center animate-in zoom-in-95 duration-500">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${paymentMethod === 'CASH' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={paymentMethod === 'CASH' ? "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" : "M5 13l4 4L19 7"} />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                    {paymentMethod === 'CASH' ? 'Order Reserved' : 'Payment Success!'}
                </h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                    {paymentMethod === 'CASH'
                        ? "Your order is held. Please visit the venue cashier to complete payment."
                        : "Transaction complete. Your stalls are now officially secured."}
                </p>
                <button
                    onClick={() => navigate(`/vendor/reservations/${reservationId}`)}
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest"
                >
                    View Reservation →
                </button>
            </div>
        </div>
    );
};
