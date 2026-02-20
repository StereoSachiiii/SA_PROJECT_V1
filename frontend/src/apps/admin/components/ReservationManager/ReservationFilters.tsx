import React from 'react';
import { Search } from 'lucide-react';

interface ReservationFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (status: any) => void;
}

const STATUS_OPTIONS = ['ALL', 'PAID', 'PENDING_PAYMENT', 'CANCELLED', 'PENDING_REFUND'] as const;

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by vendor or ticket ID..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${statusFilter === status
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>
        </div>
    );
};
