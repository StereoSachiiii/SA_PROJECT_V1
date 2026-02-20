import { useState, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import AuditTable from '@/apps/admin/components/Audit/AuditTable';
import AuditFilters from '@/apps/admin/components/Audit/AuditFilters';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [page, setPage] = useState(0);
    const [entityType, setEntityType] = useState('');
    const [actorId, setActorId] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    useEffect(() => {
        setPage(0);
    }, [entityType, actorId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, entityType, actorId]);

    const fetchLogs = async () => {
        if (actorId && isNaN(Number(actorId))) {
            setLogs([]);
            setPagination(null);
            return;
        }

        setLoading(true);
        try {
            const data = await adminApi.getAuditLogs(
                entityType || undefined,
                page,
                actorId ? Number(actorId) : undefined
            );
            setLogs(data.content);
            setPagination(data);
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
            // Fail silently on UI but log to console
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">System Activity Log</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Read-Only</p>
                    <p className="text-xs font-semibold text-gray-400">Activity History</p>
                </div>
            </div>

            <AuditFilters
                entityType={entityType}
                onEntityTypeChange={setEntityType}
                actorId={actorId}
                onActorIdChange={setActorId}
            />

            {loading ? (
                <div className="p-20 text-center text-gray-400 font-bold text-xs uppercase">
                    Loading Records...
                </div>
            ) : (
                <>
                    <AuditTable logs={logs} onViewDetail={setSelectedLog} />

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">
                            Page {page + 1} of {pagination?.totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 bg-white rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= (pagination?.totalPages || 1) - 1}
                                className="p-2 bg-white rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Details Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                        <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                            <div>
                                <h3 className="font-bold uppercase text-[10px]">Log Entry Details</h3>
                                <p className="text-[10px] uppercase mt-1 opacity-60">ID: {selectedLog.id}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Timestamp</label>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(selectedLog.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Actor</label>
                                    <p className="text-sm font-semibold text-blue-600">User #{selectedLog.actorId}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Action</label>
                                <p className="text-lg font-bold text-gray-900">{selectedLog.action}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Affected Entity</label>
                                <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between border border-gray-100">
                                    <span className="font-semibold text-gray-700 text-sm">{selectedLog.entityType}</span>
                                    <span className="font-mono text-xs font-bold text-gray-400">ID: {selectedLog.entityId}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="w-full bg-gray-900 text-white py-3 rounded-md font-bold text-xs uppercase transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
