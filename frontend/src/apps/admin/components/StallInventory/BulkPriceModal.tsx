import React from 'react';
import { X } from 'lucide-react';

interface BulkPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    percentage: string;
    onPercentageChange: (value: string) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const BulkPriceModal: React.FC<BulkPriceModalProps> = ({
    isOpen,
    onClose,
    percentage,
    onPercentageChange,
    onConfirm,
    isLoading
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-sm:max-w-xs max-w-sm">
                <div className="bg-indigo-900 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="font-bold text-sm uppercase tracking-wider">Bulk Price Adjustment</h2>
                    <button onClick={onClose}><X size={20} className="text-indigo-300 hover:text-white" /></button>
                </div>
                <div className="p-8 space-y-5">
                    <p className="text-xs text-gray-500 font-semibold">Set a percentage to adjust all stall prices in this hall. Use negative values to decrease (e.g. -10 for 10% off).</p>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Percentage Change (%)</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 10 or -5"
                            value={percentage} onChange={e => onPercentageChange(e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-50">Cancel</button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 bg-indigo-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-indigo-800 disabled:opacity-50">
                            {isLoading ? 'Adjusting...' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
