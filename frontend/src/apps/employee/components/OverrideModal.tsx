import React from 'react';

interface OverrideModalProps {
    overrideCode: string;
    setOverrideCode: (val: string) => void;
    overrideReason: string;
    setOverrideReason: (val: string) => void;
    handleForceCheckIn: () => void;
    onClose: () => void;
    loading: boolean;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
    overrideCode, setOverrideCode,
    overrideReason, setOverrideReason,
    handleForceCheckIn,
    onClose,
    loading
}) => {
    return (
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
                    <button onClick={onClose} className="py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
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
    );
};
