import React from 'react';
import { X } from 'lucide-react';
import { StallSize, StallCategory } from '@/shared/types/api';

interface BulkGenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    bulkForm: {
        count: string;
        size: StallSize;
        category: StallCategory;
        basePriceCents: string;
    };
    onFormChange: (form: any) => void;
    onConfirm: () => void;
    isLoading: boolean;
    sizeOptions: string[];
    categoryOptions: string[];
}

export const BulkGenerateModal: React.FC<BulkGenerateModalProps> = ({
    isOpen,
    onClose,
    bulkForm,
    onFormChange,
    onConfirm,
    isLoading,
    sizeOptions,
    categoryOptions
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="bg-gray-900 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="font-bold text-sm uppercase tracking-wider">Bulk Generate Stalls</h2>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
                </div>
                <div className="p-8 space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Count</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={bulkForm.count} onChange={e => onFormChange({ ...bulkForm, count: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Size</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={bulkForm.size} onChange={e => onFormChange({ ...bulkForm, size: e.target.value as StallSize })}>
                            {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={bulkForm.category} onChange={e => onFormChange({ ...bulkForm, category: e.target.value as StallCategory })}>
                            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Base Price (in Cents, e.g. 100000 = LKR 1,000)</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={bulkForm.basePriceCents} onChange={e => onFormChange({ ...bulkForm, basePriceCents: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-50">Cancel</button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-gray-700 disabled:opacity-50">
                            {isLoading ? 'Generating...' : `Generate ${bulkForm.count} Stalls`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
