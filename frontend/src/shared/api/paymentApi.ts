import api from './client';

export const paymentApi = {
    createPaymentIntent: async (reservationId: number) => {
        const response = await api.post<{ clientSecret: string }>(`/payments/create-payment-intent/${reservationId}`);
        return response.data;
    },

    confirmPayment: async (reservationId: number, paymentIntentId: string) => {
        const response = await api.post(`/payments/confirm/${reservationId}`, { paymentIntentId });
        return response.data;
    }
};
