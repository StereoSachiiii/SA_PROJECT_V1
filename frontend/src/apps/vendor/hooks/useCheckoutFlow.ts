import { useState, useEffect } from 'react';
import { paymentApi } from '@/shared/api/paymentApi';

interface UseCheckoutFlowProps {
    reservationId: number;
    paymentMethod: 'SELECT' | 'ONLINE' | 'CASH';
    setPaymentMethod: (method: 'SELECT' | 'ONLINE' | 'CASH') => void;
}

export function useCheckoutFlow({
    reservationId,
    paymentMethod,
    setPaymentMethod,
}: UseCheckoutFlowProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [intentError, setIntentError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (reservationId && paymentMethod === 'ONLINE' && !clientSecret && !intentError) {
            paymentApi.createPaymentIntent(reservationId)
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => setIntentError(err.response?.data?.message || "Failed to initialize secure payment."));
        }
    }, [reservationId, paymentMethod, clientSecret, intentError]);

    const handleSelectMethod = (method: 'ONLINE' | 'CASH') => {
        if (method === 'CASH') {
            setPaymentMethod('CASH');
            setClientSecret('CASH_INIT');
        } else {
            setPaymentMethod('ONLINE');
        }
    };

    const resetSelection = () => {
        setPaymentMethod('SELECT');
        setClientSecret(null);
        setIntentError(null);
    };

    return {
        clientSecret,
        intentError,
        isSuccess,
        setIsSuccess,
        handleSelectMethod,
        resetSelection,
        setIntentError,
    };
}
