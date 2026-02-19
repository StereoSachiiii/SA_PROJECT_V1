import { Filter, Search } from 'lucide-react';

interface AuditFiltersProps {
    entityType: string;
    onEntityTypeChange: (type: string) => void;
    actorId: string;
    onActorIdChange: (id: string) => void;
}

export default function AuditFilters({
    entityType,
    onEntityTypeChange,
    actorId,
    onActorIdChange
}: AuditFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-md flex-1 min-w-[200px]">
                <Search size={16} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Actor ID..."
                    className="bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 w-full"
                    value={actorId}
                    onChange={(e) => onActorIdChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        className="bg-transparent border-none text-sm font-bold uppercase text-gray-700 focus:ring-0 appearance-none cursor-pointer"
                        value={entityType}
                        onChange={(e) => onEntityTypeChange(e.target.value)}
                    >
                        <option value="">All Entities</option>
                        <option value="RESERVATION">Reservations</option>
                        <option value="EVENT">Events</option>
                        <option value="USER">Users</option>
                        <option value="STALL">Stalls</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 flex justify-end">
                <p className="text-[10px] font-bold text-gray-300 uppercase pr-2">System Filters</p>
            </div>
        </div>
    );
}
