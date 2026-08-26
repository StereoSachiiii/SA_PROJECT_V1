import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { authApi } from '@/shared/api/authApi';
import { UserProfileResponse } from '@/shared/types/user';

export default function VendorProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);

    useEffect(() => {
        loadOidcProfile();
    }, []);

    const loadOidcProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.getProfile();
            setProfile(data);
        } catch (err: any) {
            console.warn('OIDC profile fetch failed, using local context state fallback', err);
            // Fallback gracefully to AuthContext user state if endpoint fails or in offline mode
            setProfile({
                username: user?.username || 'N/A',
                name: user?.username || 'N/A',
                email: user?.email || 'N/A',
                contactNumber: user?.contactNumber || 'N/A',
                organization: user?.businessName || 'N/A',
                roles: user?.role ? [user.role] : []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-20 max-w-4xl flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">
                    Loading OIDC Profile Claims...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl animate-in fade-in duration-500">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🛡️</span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">OIDC User Profile</h1>
                    </div>
                    <p className="text-slate-500 font-medium">
                        Identity & Claims issued by Asgardeo OpenID Connect (OIDC) Identity Provider.
                    </p>
                </div>
                <button
                    onClick={loadOidcProfile}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors self-start md:self-auto flex items-center gap-2"
                >
                    <span>🔄</span> Refresh Claims
                </button>
            </header>

            {error && (
                <div className="mb-8 bg-amber-50 border-2 border-amber-200 text-amber-900 p-6 rounded-2xl flex items-center gap-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-bold">Using Fallback Profile Data</p>
                        <p className="text-sm font-medium opacity-90">{error}</p>
                    </div>
                </div>
            )}

            {/* OIDC Claims Display Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden mb-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-1">
                            Authenticated Subject
                        </span>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            {profile?.name || profile?.username || 'User Profile'}
                        </h2>
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                        OIDC Authenticated
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <span className="block text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                            Username / Sub
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight break-all">
                            {profile?.username || user?.username || 'N/A'}
                        </span>
                    </div>

                    {/* Full Name */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <span className="block text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                            Full Name
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight">
                            {profile?.name || user?.username || 'N/A'}
                        </span>
                    </div>

                    {/* Email Address */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <span className="block text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                            Email Address
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight break-all">
                            {profile?.email || user?.email || 'N/A'}
                        </span>
                    </div>

                    {/* Contact Number */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <span className="block text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                            Contact Number
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight">
                            {profile?.contactNumber || user?.contactNumber || 'N/A'}
                        </span>
                    </div>

                    {/* Organization / Business Name */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors md:col-span-2">
                        <span className="block text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                            Organization / Business Name
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight">
                            {profile?.organization || user?.businessName || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Information Banner explaining OIDC Managed Credentials */}
            <div className="bg-indigo-50 border-2 border-indigo-100 text-indigo-950 rounded-2xl p-6 flex items-start gap-4">
                <span className="text-2xl mt-0.5">ℹ️</span>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-wider mb-1">Identity & Password Management</h3>
                    <p className="text-xs font-medium text-indigo-800 leading-relaxed">
                        Your user credentials, security keys, and profile attributes are managed centrally by the <strong>Asgardeo OpenID Connect (OIDC) Identity Provider</strong>. Legacy local password update forms have been disabled to ensure OWASP compliance and centralized single sign-on (SSO) governance.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <button
                    onClick={() => window.location.href = '/vendor/dashboard'}
                    className="px-8 py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
