import { Reservation } from '@/shared/types/api';

interface CheckoutSummaryProps {
    reservation: Reservation;
}

export const CheckoutSummary = ({ reservation }: CheckoutSummaryProps) => {
    const total = (reservation.totalPriceCents || 0) / 100;

    return (
        <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100 shadow-inner">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Order Summary</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Stall Items ({reservation.stalls.length})</span>
                    <span className="font-bold text-slate-900 border-b-2 border-slate-100">LKR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-blue-200/50 mt-4">
                    <span className="text-slate-900">Amount to Pay</span>
                    <span className="text-emerald-600">LKR {total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
