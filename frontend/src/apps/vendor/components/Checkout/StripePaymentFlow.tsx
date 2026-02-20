import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { paymentApi } from '@/shared/api/paymentApi';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-700 text-center shadow-sm">
                    <h3 className="font-black uppercase text-xs tracking-widest mb-2">Gate Interface Error</h3>
                    <p className="text-sm font-medium">Please refresh the page to restart the secure session.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

interface StripePaymentFormProps {
    reservationId: number;
    amountCents: number;
    onSuccess: () => void;
}

const StripePaymentForm = ({ reservationId, amountCents, onSuccess }: StripePaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setErrorMessage(null);
        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/vendor/reservations/${reservationId}`,
                },
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message ?? 'An unexpected error occurred.');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                try {
                    await paymentApi.confirmPayment(reservationId, paymentIntent.id);
                    onSuccess();
                } catch (err: any) {
                    setErrorMessage(err.response?.data?.message || 'Verification failed. Contact support.');
                    setIsProcessing(false);
                }
            } else {
                setErrorMessage(`Status: ${paymentIntent?.status}. Contact support.`);
                setIsProcessing(false);
            }
        } catch (fatalErr: any) {
            setErrorMessage(fatalErr.message || "Critical error.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                <PaymentElement onChange={() => setErrorMessage(null)} />
            </div>

            {errorMessage && (
                <div className="text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">
                    {errorMessage}
                </div>
            )}

            <button
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest"
            >
                {isProcessing ? 'Validating Transaction...' : `Pay LKR ${((amountCents / 100)).toLocaleString()}`}
            </button>
        </form>
    );
};

export const StripePaymentFlow = ({ children, reservationId, amountCents, onSuccess }: { children: React.ReactNode, reservationId: number, amountCents: number, onSuccess: () => void }) => {
    return (
        <ErrorBoundary>
            {children}
            <StripePaymentForm reservationId={reservationId} amountCents={amountCents} onSuccess={onSuccess} />
        </ErrorBoundary>
    );
};
