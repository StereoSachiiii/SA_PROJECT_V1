import { Event } from '@/shared/types/api';
import { Image as ImageIcon, X } from 'lucide-react';

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    eventData: Partial<Event>;
    setEventData: (data: Partial<Event>) => void;
    title: string;
    isEditing?: boolean;
}

export const EventFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    eventData,
    setEventData,
    title,
    isEditing = false
}: EventFormModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="bg-slate-900 px-10 py-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-8 top-8 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                    <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                    <p className="text-indigo-400 text-[10px] font-black uppercase mt-2 tracking-[0.2em]">{isEditing ? `Modifying Blueprint #${eventData.id}` : 'Designing New Venue'}</p>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Event Master Title</label>
                            <input
                                className="w-full bg-slate-50 border-2 border-transparent px-5 py-3.5 rounded-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                value={eventData.name || ''}
                                onChange={e => setEventData({ ...eventData, name: e.target.value })}
                                placeholder="e.g., Annual Literary Festival 2026"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Detailed Brief (Optional)</label>
                            <textarea
                                rows={3}
                                className="w-full bg-slate-50 border-2 border-transparent px-5 py-4 rounded-2xl font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none"
                                value={eventData.description || ''}
                                onChange={e => setEventData({ ...eventData, description: e.target.value })}
                                placeholder="Describe the event's core focus and target audience..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Geographical ID</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-transparent px-5 py-3.5 rounded-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                    value={eventData.location || ''}
                                    onChange={e => setEventData({ ...eventData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Visual Identity (URL)</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-slate-50 border-2 border-transparent pl-12 pr-5 py-3.5 rounded-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                        value={eventData.imageUrl || ''}
                                        onChange={e => setEventData({ ...eventData, imageUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    <div className="absolute left-4 top-3.5 text-slate-300">
                                        <ImageIcon size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Launch Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border-2 border-transparent px-5 py-3.5 rounded-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                    value={eventData.startDate || ''}
                                    onChange={e => setEventData({ ...eventData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Conclusion Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border-2 border-transparent px-5 py-3.5 rounded-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                    value={eventData.endDate || ''}
                                    onChange={e => setEventData({ ...eventData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors rounded-2xl hover:bg-slate-50"
                        >
                            Discard
                        </button>
                        <button
                            onClick={onSubmit}
                            className="flex-[2] px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                        >
                            {isEditing ? 'Pulse Updates' : 'Initialize Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
