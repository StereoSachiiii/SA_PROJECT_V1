import React from 'react';
import { Search } from 'lucide-react';

interface StallFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
    sizeFilter: string;
    onSizeChange: (size: string) => void;
    statusOptions: string[];
    sizeOptions: string[];
}

export const StallFilters: React.FC<StallFiltersProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sizeFilter,
    onSizeChange,
    statusOptions,
    sizeOptions
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by stall name..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex gap-2 flex-wrap">
                {statusOptions.map(s => (
                    <button key={s}
                        onClick={() => onStatusChange(s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >{s}</button>
                ))}
                <span className="w-px bg-gray-200 mx-1 self-stretch" />
                {['ALL', ...sizeOptions].map(s => (
                    <button key={s}
                        onClick={() => onSizeChange(s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${sizeFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >{s}</button>
                ))}
            </div>
        </div>
    );
};
