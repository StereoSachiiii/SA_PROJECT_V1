import { AuditLog, PageEnvelope } from '@/shared/types/api';

interface ActivityLogPreviewProps {
    auditLogs: PageEnvelope<AuditLog> | null;
}

export const ActivityLogPreview = ({ auditLogs }: ActivityLogPreviewProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Recent Activity</h3>
                <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Live Logs</span>
            </div>

            <div className="divide-y divide-slate-50">
                {!auditLogs || auditLogs.content.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No activity detected</p>
                    </div>
                ) : (
                    auditLogs.content.slice(0, 8).map((log) => (
                        <div key={log.id} className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                {log.action.substring(0, 1)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-slate-800">{log.action}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] bg-slate-100 text-slate-500 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {log.entityType} #{log.entityId}
                                    </span>
                                    <span className="text-slate-300 text-[10px]">•</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                    Actor: {log.actorId}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {auditLogs && auditLogs.content.length > 5 && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                    <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                        View Full Audit Trail →
                    </button>
                </div>
            )}
        </div>
    );
};
