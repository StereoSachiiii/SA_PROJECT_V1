import { Link } from 'react-router-dom';
import { Event } from '@/shared/types/api';
import { Edit2, CalendarDays, Trash2, Plus } from 'lucide-react';

interface EventManagementTableProps {
    events: Event[];
    onUpdateStatus: (id: number, status: 'DRAFT' | 'OPEN' | 'CLOSED') => void;
    onEdit: (event: Event) => void;
    onDelete: (id: number) => void;
    onCreateClick: () => void;
}

export const EventManagementTable = ({
    events,
    onUpdateStatus,
    onEdit,
    onDelete,
    onCreateClick
}: EventManagementTableProps) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Event Management</h3>
                    <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Schedules & Venue Protocols</p>
                </div>
                <button
                    onClick={onCreateClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                    <Plus size={16} strokeWidth={3} />
                    Create New Event
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifier</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Intelligence</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Direct Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-10 py-20 text-center">
                                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Active Events Found</p>
                                </td>
                            </tr>
                        ) : (
                            events.map(evt => (
                                <tr key={evt.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-10 py-8">
                                        <span className="font-mono text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest">
                                            #{evt.id}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{evt.name}</div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {evt.location}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                Starting {new Date(evt.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <select
                                            value={evt.status}
                                            onChange={(e) => onUpdateStatus(evt.id, e.target.value as any)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer focus:ring-0 focus:outline-none ${evt.status === 'OPEN' ? 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:border-emerald-500' :
                                                    evt.status === 'CLOSED' ? 'border-rose-100 bg-rose-50 text-rose-600 hover:border-rose-500' :
                                                        'border-slate-100 bg-slate-100 text-slate-500 hover:border-slate-400'
                                                }`}
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="OPEN">Open</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3 items-center">
                                            <button
                                                onClick={() => onEdit(evt)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-indigo-600 rounded-xl text-slate-300 transition-all border-2 border-transparent hover:border-indigo-50 shadow-sm hover:shadow-indigo-100 active:scale-95"
                                                title="Edit Blueprint"
                                            >
                                                <Edit2 size={18} strokeWidth={2.5} />
                                            </button>
                                            <Link
                                                to={`/admin/stalls?eventId=${evt.id}`}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-emerald-600 rounded-xl text-slate-300 transition-all border-2 border-transparent hover:border-emerald-50 shadow-sm hover:shadow-emerald-100 active:scale-95"
                                                title="Stall Grid Designer"
                                            >
                                                <CalendarDays size={18} strokeWidth={2.5} />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(evt.id)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-rose-600 rounded-xl text-slate-300 transition-all border-2 border-transparent hover:border-rose-50 shadow-sm hover:shadow-rose-100 active:scale-95"
                                                title="Purge Event"
                                            >
                                                <Trash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
