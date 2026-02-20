import React from 'react';
import { X } from 'lucide-react';
import { StallTemplate, StallSize, StallCategory } from '@/shared/types/api';

interface StallEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    stall: StallTemplate | null;
    form: Partial<StallTemplate>;
    onFormChange: (form: Partial<StallTemplate>) => void;
    onSave: () => void;
    isLoading: boolean;
    sizeOptions: string[];
    categoryOptions: string[];
}

export const StallEditModal: React.FC<StallEditModalProps> = ({
    isOpen,
    onClose,
    stall,
    form,
    onFormChange,
    onSave,
    isLoading,
    sizeOptions,
    categoryOptions
}) => {
    if (!isOpen || !stall) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="bg-gray-900 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="font-bold text-sm uppercase tracking-wider">Edit Stall {stall.name}</h2>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
                </div>
                <div className="p-8 space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.name || ''} onChange={e => onFormChange({ ...form, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.category || 'RETAIL'} onChange={e => onFormChange({ ...form, category: e.target.value as StallCategory })}>
                                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Size</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.size || 'SMALL'} onChange={e => onFormChange({ ...form, size: e.target.value as StallSize })}>
                                {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Square Feet</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.sqFt || ''} onChange={e => onFormChange({ ...form, sqFt: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Price (Cents)</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.basePriceCents || ''} onChange={e => onFormChange({ ...form, basePriceCents: parseInt(e.target.value) })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Image URL</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://"
                            value={form.imageUrl || ''} onChange={e => onFormChange({ ...form, imageUrl: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-50">Cancel</button>
                        <button onClick={onSave} disabled={isLoading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
