import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '@/shared/api/reservationApi';
import { paymentApi } from '@/shared/api/paymentApi';
import { APP_CONFIG } from '@/config';

// Sub-components
import { CheckoutSummary } from '../components/Checkout/CheckoutSummary';
import { PaymentMethodSelector } from '../components/Checkout/PaymentMethodSelector';
import { StripePaymentFlow } from '../components/Checkout/StripePaymentFlow';

const stripePromise = loadStripe(APP_CONFIG.STRIPE_PUBLISHABLE_KEY);

export const CheckoutPage = () => {
    const { id } = useParams<{ id: string }>();
    const reservationId = Number(id);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState<'SELECT' | 'ONLINE' | 'CASH'>('SELECT');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [intentError, setIntentError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { data: reservation, isLoading: isResLoading } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => reservationApi.getById(reservationId),
        enabled: !!reservationId,
    });

    useEffect(() => {
        if (reservationId && paymentMethod === 'ONLINE' && !clientSecret && !intentError) {
            paymentApi.createPaymentIntent(reservationId)
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => setIntentError(err.response?.data?.message || "Failed to initialize secure payment."));
        }
    }, [reservationId, paymentMethod, clientSecret, intentError]);

    if (isResLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Checkout</p>
        </div>
    );

    if (!reservation) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-12 rounded-[2rem] shadow-2xl text-center max-w-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Reservation Expired</h2>
                <p className="text-slate-500 mb-8 font-medium">This checkout link is no longer active.</p>
                <button onClick={() => navigate('/home')} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl">Back Home</button>
            </div>
        </div>
    );



    if (isSuccess || (paymentMethod === 'CASH' && clientSecret === 'CASH_INIT')) { // Simplified cash success flag
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
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-xl w-full border border-slate-100">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Secure Checkout</h1>
                    <p className="text-slate-500 font-medium italic">Reservation for <span className="text-indigo-600 font-bold not-italic">{reservation.event?.name}</span></p>
                </div>

                <CheckoutSummary reservation={reservation} />

                {paymentMethod === 'SELECT' ? (
                    <PaymentMethodSelector onSelect={(m) => {
                        if (m === 'CASH') {
                            setPaymentMethod('CASH');
                            setClientSecret('CASH_INIT'); // Trigger pseudo-success
                        } else {
                            setPaymentMethod('ONLINE');
                        }
                    }} />
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <button
                            onClick={() => { setPaymentMethod('SELECT'); setClientSecret(null); setIntentError(null); }}
                            className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Methods
                        </button>

                        {intentError ? (
                            <div className="bg-rose-50 text-rose-700 p-8 rounded-3xl border-2 border-rose-100 text-center">
                                <h4 className="font-black text-lg mb-2">Service Unavailable</h4>
                                <p className="text-sm font-bold opacity-70 mb-6">{intentError}</p>
                                <button
                                    onClick={() => { setIntentError(null); setPaymentMethod('SELECT'); }}
                                    className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
                                >
                                    Try Cash Payment
                                </button>
                            </div>
                        ) : clientSecret && clientSecret !== 'CASH_INIT' ? (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#0f172a' } } }}>
                                <StripePaymentFlow
                                    reservationId={reservationId}
                                    amountCents={reservation.totalPriceCents || 0}
                                    onSuccess={() => setIsSuccess(true)}
                                >
                                    <div className="mb-8 flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">Secured by Stripe</span>
                                        </div>
                                    </div>
                                </StripePaymentFlow>
                            </Elements>
                        ) : (
                            <div className="flex flex-col items-center py-12 gap-4">
                                <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Secure Gate...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
