import { Reservation } from '@/shared/types/api';

interface PaymentSummaryProps {
    reservation: Reservation;
}

export const PaymentSummary = ({ reservation }: PaymentSummaryProps) => {
    const { stallDetails, totalPriceCents } = reservation;

    return (
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">Payment Summary</h4>
            <div className="space-y-3 text-sm">
                {stallDetails && (
                    <>
                        <div className="flex justify-between text-slate-500 font-medium">
                            <span>Base Rate</span>
                            <span>LKR {(stallDetails.baseRateCents / 100).toLocaleString()}</span>
                        </div>
                        {stallDetails.multiplier > 1 && (
                            <div className="flex justify-between text-indigo-500 font-black">
                                <span>Premium Multiplier</span>
                                <span>x{stallDetails.multiplier}</span>
                            </div>
                        )}
                        <div className="border-t my-2 border-dashed border-slate-100"></div>
                    </>
                )}
                <div className="flex justify-between text-slate-900 font-black text-lg">
                    <span>Total Paid</span>
                    <span>LKR {((totalPriceCents || 0) / 100).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
