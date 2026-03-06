import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '@/features/reservations';
import { APP_CONFIG } from '@/config';

// Sub-components
import { CheckoutSummary } from '../components/Checkout/CheckoutSummary';
import { PaymentMethodSelector } from '../components/Checkout/PaymentMethodSelector';
import { StripePaymentFlow } from '../components/Checkout/StripePaymentFlow';
import { CheckoutLoading } from '../components/Checkout/CheckoutLoading';
import { CheckoutExpired } from '../components/Checkout/CheckoutExpired';
import { CheckoutSuccess } from '../components/Checkout/CheckoutSuccess';
import { PaymentIntentError } from '../components/Checkout/PaymentIntentError';

// Custom Hooks
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';

const stripePromise = loadStripe(APP_CONFIG.STRIPE_PUBLISHABLE_KEY);

export const CheckoutPage = () => {
    const { id } = useParams<{ id: string }>();
    const reservationId = Number(id);

    const [paymentMethod, setPaymentMethod] = useState<'SELECT' | 'ONLINE' | 'CASH'>('SELECT');

    const { data: reservation, isLoading: isResLoading } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => reservationApi.getById(reservationId),
        enabled: !!reservationId,
    });

    const {
        clientSecret,
        intentError,
        isSuccess,
        setIsSuccess,
        handleSelectMethod,
        resetSelection,
        setIntentError
    } = useCheckoutFlow({ reservationId, paymentMethod, setPaymentMethod });

    if (isResLoading) return <CheckoutLoading />;
    if (!reservation) return <CheckoutExpired />;
    if (isSuccess || (paymentMethod === 'CASH' && clientSecret === 'CASH_INIT')) {
        return <CheckoutSuccess reservationId={reservationId} paymentMethod={paymentMethod} />;
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
                    <PaymentMethodSelector onSelect={handleSelectMethod} />
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <button
                            onClick={resetSelection}
                            className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Methods
                        </button>

                        {intentError ? (
                            <PaymentIntentError error={intentError} onRetry={() => { setIntentError(null); setPaymentMethod('SELECT'); }} />
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
