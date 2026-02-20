import { useAuth } from '@/shared/context/AuthContext';
import { useEmployeeScanner } from '../hooks/useEmployeeScanner';
import { useEmployeeDashboard } from '../hooks/useEmployeeDashboard';
import { employeeApi } from '@/shared/api/employeeApi'; // kept for export

export default function EmployeePortalPage() {
    const { user } = useAuth();

    // Extracted Logic
    const {
        activeTab, setActiveTab,
        stats, loadingStats,
        searchQuery, setSearchQuery, searchResults, handleSearch
    } = useEmployeeDashboard();

    const {
        qrInput, setQrInput,
        lookupResult, setLookupResult,
        overrideCode, setOverrideCode,
        overrideReason, setOverrideReason,
        showOverride, setShowOverride,
        handleLookup,
        handleAdmit,
        handleForceCheckIn,
        lookupLoading,
        lookupError,
        admitLoading,
        admitSuccess,
        overrideLoading,
        handleReset
    } = useEmployeeScanner();

    // Combined Loading/Error for UI (loading is used on line 366)
    const loading = lookupLoading || admitLoading || overrideLoading;

    const handleExport = async () => {
        try {
            const blob = await employeeApi.exportAttendance();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Operator Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                            🛡️
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900">Operational Hub</h1>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Operator: {user?.username}</p>
                        </div>
                    </div>

                    <nav className="flex bg-slate-100 p-1 rounded-xl">
                        {[
                            ['SCAN', 'QR Scanner', '🔍'],
                            ['DASHBOARD', 'Monitoring', '📊'],
                            ['SEARCH', 'Directory', '📇']
                        ].map(([tab, label, icon]) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <span>{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={handleExport}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span>📥</span> Export Logs
                    </button>
                </div>
            </header >

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* 1. SCANNER VIEW */}
                {activeTab === 'SCAN' && (
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-10">
                            <h2 className="text-2xl font-black mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Entrance Check-In
                            </h2>

                            {/* STEP 1: LOOKUP INPUT */}
                            {!lookupResult && (
                                <form onSubmit={handleLookup} className="mb-10">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={qrInput}
                                                onChange={(e) => setQrInput(e.target.value)}
                                                placeholder="Scan QR or enter reservation ID..."
                                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-lg focus:border-blue-500 focus:ring-0 transition-all text-center"
                                            />
                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none opacity-30">
                                                🔍
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={lookupLoading || !qrInput}
                                            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                                        >
                                            {lookupLoading ? 'SEARCHING...' : 'LOOKUP'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 2: DISPLAY RESULT */}
                            {lookupResult && !admitSuccess && (
                                <div className="space-y-6 mb-10">
                                    {/* Reservation Card */}
                                    <div className={`rounded-2xl p-6 border-2 ${lookupResult.valid ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'
                                        }`}>
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business</h3>
                                                <p className="text-lg font-black text-slate-900">{lookupResult.businessName}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stall</h3>
                                                <p className="text-lg font-black text-slate-900">{lookupResult.stallName}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${lookupResult.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {lookupResult.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {lookupResult.valid && (
                                            <>
                                                <button
                                                    onClick={handleAdmit}
                                                    disabled={admitLoading}
                                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-200 active:scale-[0.98]"
                                                >
                                                    {admitLoading ? 'ADMITTING...' : 'ADMIT'}
                                                </button>
                                            </>
                                        )}
                                        {!lookupResult.valid && (
                                            <>
                                                <button
                                                    onClick={() => setShowOverride(true)}
                                                    disabled={overrideLoading}
                                                    className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl active:scale-[0.98]"
                                                >
                                                    OVERRIDE ADMIT
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                setLookupResult(null);
                                                setQrInput('');
                                            }}
                                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: SUCCESS */}
                            {admitSuccess && (
                                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8 text-center animate-bounce-in">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg shadow-emerald-200">
                                        ✓
                                    </div>
                                    <h3 className="text-2xl font-black text-emerald-900 mb-1 leading-tight">ADMITTED</h3>
                                    <p className="text-emerald-700 font-bold text-lg mb-4">{lookupResult?.businessName}</p>
                                    <div className="flex flex-col gap-1 text-emerald-600/60 text-xs font-bold tracking-widest uppercase">
                                        <span>Check-in recorded</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* ERROR */}
                            {lookupError && (
                                <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-8 text-center animate-shake">
                                    <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg shadow-rose-200">
                                        ✕
                                    </div>
                                    <h3 className="text-2xl font-black text-rose-900 mb-2 leading-tight">NOT FOUND</h3>
                                    <p className="text-rose-700 font-bold mb-6">{(lookupError as any)?.message || "Reservation not found"}</p>
                                    <button
                                        onClick={handleReset}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                                    >
                                        TRY AGAIN
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. DASHBOARD VIEW */}
                {activeTab === 'DASHBOARD' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                ['Total Stalls', stats?.totalStalls, '🏢', 'bg-blue-500'],
                                ['Booked Stalls', stats?.reservedStalls, '📑', 'bg-indigo-500'],
                                ['Checked In', stats?.checkedInCount || 0, '🚶', 'bg-emerald-500']
                            ].map(([title, val, icon, color]) => (
                                <div key={title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full`}></div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-3xl">{icon}</span>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 tabular-nums">
                                        {loadingStats ? '...' : val}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                    Occupancy Overview
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-slate-400">
                                            <span>Real-time Occupancy</span>
                                            <span>{Math.round(((stats?.checkedInCount || 0) / (stats?.reservedStalls || 1)) * 100)}%</span>
                                        </div>
                                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-1000"
                                                style={{ width: `${Math.min(100, ((stats?.checkedInCount || 0) / (stats?.reservedStalls || 1)) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. SEARCH VIEW (Simplified for operations) */}
                {activeTab === 'SEARCH' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Business Name or ID..."
                                className="flex-1 p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all font-bold"
                            />
                            <button type="submit" className="px-8 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
                                SEARCH
                            </button>
                        </form>

                        <div className="space-y-4">
                            {searchResults?.content.map(res => (
                                <div key={res.id} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all group">
                                    <div>
                                        <div className="font-black text-slate-800">#{res.id} • {res.vendor}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{res.stalls.join(', ')}</div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${res.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {res.status}
                                    </div>
                                </div>
                            ))}
                            {searchResults?.content.length === 0 && (
                                <div className="text-center py-12 text-slate-400 font-bold italic">
                                    Enter a query to browse reservations.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* OVERRIDE MODAL */}
            {
                showOverride && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg animate-scale-in">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                ⚠️
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Administrative Override</h3>
                            <p className="text-slate-500 font-medium mb-8">Proceed only with proof of manual payment. This action is irreversible and permanently logged.</p>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Supervisor Auth Code</label>
                                    <input
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-center focus:border-rose-500 transition-all"
                                        placeholder="e.g. SUP-9912"
                                        value={overrideCode}
                                        onChange={e => setOverrideCode(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Justification Reason</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl min-h-[100px] focus:border-rose-500 transition-all"
                                        placeholder="State reason for manual entry..."
                                        value={overrideReason}
                                        onChange={e => setOverrideReason(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowOverride(false)} className="py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleForceCheckIn}
                                    disabled={loading || !overrideCode || !overrideReason}
                                    className="py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-200 uppercase tracking-widest text-xs"
                                >
                                    {loading ? 'EXECUTING...' : 'AUTHORIZE ACCESS'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
                @keyframes bounce-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-shake { animation: shake 0.2s ease-in-out infinite; animation-iteration-count: 2; }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}
