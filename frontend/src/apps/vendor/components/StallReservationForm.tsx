import { useState } from 'react';
import { reservationApi } from '@/shared/api/reservationApi';
import { ReservationRequest } from '@/shared/types/reservation';

interface StallReservationFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function StallReservationForm({ onSuccess, onCancel }: StallReservationFormProps) {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<ReservationRequest>({
        eventName: 'Colombo International Book Fair 2026',
        reservationDate: today,
        stallType: 'STANDARD',
        stallSize: 'MEDIUM',
        stallCount: 1,
        businessCategory: 'Publishing & Books',
        specialComments: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await reservationApi.create(formData);
            setSuccessMessage('Stall reservation submitted successfully!');
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create reservation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">📑</span> Reserve Stall
                </h2>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase tracking-wider"
                    >
                        ✕ Close
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 p-4 rounded-xl text-sm font-bold">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-emerald-50 border-2 border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                    <span>✨</span> {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Predefined Event Name selector */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Event Name</label>
                    <select
                        value={formData.eventName}
                        onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    >
                        <option value="Colombo International Book Fair 2026">Colombo International Book Fair 2026</option>
                        <option value="National Book Expo 2026">National Book Expo 2026</option>
                        <option value="Annual Literature Exhibition 2026">Annual Literature Exhibition 2026</option>
                    </select>
                </div>

                {/* Date Picker (min date set to current date) */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Reservation Date</label>
                    <input
                        type="date"
                        min={today}
                        value={formData.reservationDate}
                        onChange={e => setFormData({ ...formData, reservationDate: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    />
                </div>

                {/* Stall Type */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Stall Type</label>
                    <select
                        value={formData.stallType}
                        onChange={e => setFormData({ ...formData, stallType: e.target.value as any })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    >
                        <option value="STANDARD">Standard</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="CORNER">Corner</option>
                    </select>
                </div>

                {/* Preferred Stall Size */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Preferred Stall Size</label>
                    <select
                        value={formData.stallSize}
                        onChange={e => setFormData({ ...formData, stallSize: e.target.value as any })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    >
                        <option value="SMALL">Small (3m x 3m)</option>
                        <option value="MEDIUM">Medium (6m x 3m)</option>
                        <option value="LARGE">Large (9m x 6m)</option>
                    </select>
                </div>

                {/* Number of Stalls */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Number of Stalls</label>
                    <input
                        type="number"
                        min={1}
                        max={3}
                        value={formData.stallCount}
                        onChange={e => setFormData({ ...formData, stallCount: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    />
                </div>

                {/* Business Category dropdown */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Business Category</label>
                    <select
                        value={formData.businessCategory}
                        onChange={e => setFormData({ ...formData, businessCategory: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                        required
                    >
                        <option value="Publishing & Books">Publishing & Books</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Services">Services</option>
                    </select>
                </div>

                {/* Special Requirements / Comments field */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Special Requirements / Comments</label>
                    <textarea
                        value={formData.specialComments || ''}
                        onChange={e => setFormData({ ...formData, specialComments: e.target.value })}
                        placeholder="Any electrical requirements, corner preferences, accessibility requirements, etc."
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none h-28 resize-none"
                        maxLength={500}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-slate-500 font-bold text-xs uppercase tracking-wider hover:text-slate-700"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Stall Reservation'}
                </button>
            </div>
        </form>
    );
}
