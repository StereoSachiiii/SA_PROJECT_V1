import React from 'react';
import { LayoutGrid, Hash, Maximize2, IndianRupee, Edit, Lock, Unlock } from 'lucide-react';
import { StallTemplate } from '@/shared/types/api';
import { formatCurrency } from '@/shared/utils/format';
import { StatusBadge } from '@/shared/components/StatusBadge';

interface StallTableProps {
    stalls: StallTemplate[];
    onEdit: (stall: StallTemplate) => void;
    onToggleBlock: (stall: StallTemplate) => void;
    getCategoryColor: (cat: string) => string;
}

export const StallTable: React.FC<StallTableProps> = ({
    stalls,
    onEdit,
    onToggleBlock,
    getCategoryColor
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><Hash size={12} className="inline mr-1" />Name</th>
                            <th className="px-6 py-4 text-[10px) font-bold text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><Maximize2 size={12} className="inline mr-1" />Size</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><IndianRupee size={12} className="inline mr-1" />Price (LKR)</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stalls.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                        <LayoutGrid size={48} />
                                        <p className="font-bold uppercase text-xs">No stalls match your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : stalls.map(stall => (
                            <tr key={stall.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{stall.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getCategoryColor(stall.category)}`}>
                                        {stall.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                                    {stall.size} <span className="text-gray-400">({stall.sqFt} sqft)</span>
                                </td>
                                <td className="px-6 py-4 font-black text-gray-900 text-sm">
                                    {formatCurrency(stall.basePriceCents)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={stall.isAvailable ? 'AVAILABLE' : 'BLOCKED'} type="STALL" />
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-1">
                                    <button
                                        onClick={() => onEdit(stall)}
                                        title="Edit this stall"
                                        className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onToggleBlock(stall)}
                                        title={stall.isAvailable ? 'Block this stall' : 'Unblock this stall'}
                                        className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${stall.isAvailable ? 'hover:bg-rose-50 hover:text-rose-600 text-gray-400' : 'hover:bg-green-50 hover:text-green-600 text-gray-400'}`}
                                    >
                                        {stall.isAvailable ? <Lock size={16} /> : <Unlock size={16} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {stalls.length} Stalls
                </p>
            </div>
        </div>
    );
};
