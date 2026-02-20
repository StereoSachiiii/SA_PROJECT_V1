import { Search } from 'lucide-react';

interface AuditLog {
    id: number;
    actorId: number;
    action: string;
    entityType: string;
    entityId: number;
    timestamp: string;
}

interface AuditTableProps {
    logs: AuditLog[];
    onViewDetail: (log: AuditLog) => void;
}

export default function AuditTable({ logs, onViewDetail }: AuditTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Time</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Actor</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Action</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Entity</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors text-sm">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold text-gray-700">User #{log.actorId}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-700">{log.entityType}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">#{log.entityId}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewDetail(log)}
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                        <Search size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {logs.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold text-[10px] uppercase">No activity logs found</p>
                </div>
            )}
        </div>
    );
}
