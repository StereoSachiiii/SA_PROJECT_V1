import { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { vendorApi } from '@/shared/api/vendorApi';

export default function VendorProfilePage() {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        businessName: user?.businessName || '',
        businessDescription: user?.businessDescription || '',
        contactNumber: user?.contactNumber || '',
        address: user?.address || '',
        logoUrl: user?.logoUrl || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // we preserve the user's existing categories if they have them, just removing them from the edit form
            const payload = {
                ...formData,
                categories: user?.categories || []
            };
            const updatedUser = await vendorApi.updateProfile(payload);
            const token = localStorage.getItem('token');
            if (token) {
                login(token, updatedUser);
            }
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl">🏢</span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Business Profile</h1>
                </div>
                <p className="text-slate-500 font-medium">Manage how your publishing house appears to visitors and organizers.</p>
            </header>

            {success && (
                <div className="mb-8 bg-emerald-50 border-2 border-emerald-100 text-emerald-800 p-6 rounded-3xl flex items-center gap-4 animate-scale-in">
                    <span className="text-2xl">✨</span>
                    <p className="font-bold">Profile updated successfully! All changes are now live.</p>
                </div>
            )}

            {error && (
                <div className="mb-8 bg-rose-50 border-2 border-rose-100 text-rose-800 p-6 rounded-3xl font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                        Executive Summary
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Name</label>
                            <input
                                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
                                value={formData.businessName}
                                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                            <input
                                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
                                value={formData.contactNumber}
                                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Description</label>
                            <textarea
                                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none h-32 resize-none"
                                value={formData.businessDescription}
                                onChange={e => setFormData({ ...formData, businessDescription: e.target.value })}
                                placeholder="Tell readers about your publication house, history, and featured works..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logo URL</label>
                            <input
                                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
                                value={formData.logoUrl}
                                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Address</label>
                            <input
                                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => window.location.href = '/vendor/dashboard'}
                        className="px-8 py-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
