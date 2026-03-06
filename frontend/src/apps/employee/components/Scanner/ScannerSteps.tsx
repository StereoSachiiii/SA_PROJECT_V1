import { useState } from 'react';
import { QrCameraScanner } from './QrCameraScanner';

interface ScannerInputProps {
    qrInput: string;
    setQrInput: (val: string) => void;
    handleLookup: (e: React.FormEvent) => void;
    loading: boolean;
    directLookup: (qrOrId: string) => void;
}

export const ScannerInput = ({ qrInput, setQrInput, handleLookup, loading, directLookup }: ScannerInputProps) => {
    const [cameraMode, setCameraMode] = useState(false);

    const handleScanSuccess = (decodedText: string) => {
        setCameraMode(false);
        directLookup(decodedText);
    };

    if (cameraMode) {
        return (
            <div className="mb-10">
                <QrCameraScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setCameraMode(false)}
                />
            </div>
        );
    }

    return (
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
                    disabled={loading || !qrInput}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                >
                    {loading ? 'SEARCHING...' : 'LOOKUP'}
                </button>
                <button
                    type="button"
                    onClick={() => setCameraMode(true)}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <span>📷</span> Scan with Camera
                </button>
            </div>
        </form>
    );
};

interface ScannerResultCardProps {
    result: any;
    handleAdmit: () => void;
    handleOverride: () => void;
    handleClear: () => void;
    admitLoading: boolean;
    overrideLoading: boolean;
}

export const ScannerResultCard = ({
    result,
    handleAdmit,
    handleOverride,
    handleClear,
    admitLoading,
    overrideLoading
}: ScannerResultCardProps) => (
    <div className="space-y-6 mb-10">
        <div className={`rounded-2xl p-6 border-2 ${result.valid ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="space-y-3">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business</h3>
                    <p className="text-lg font-black text-slate-900">{result.businessName}</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stall</h3>
                    <p className="text-lg font-black text-slate-900">{result.stallName}</p>
                </div>
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${result.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {result.status}
                    </span>
                </div>
            </div>
        </div>
        <div className="space-y-3">
            {result.valid && (
                <button
                    onClick={handleAdmit}
                    disabled={admitLoading}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-200 active:scale-[0.98]"
                >
                    {admitLoading ? 'ADMITTING...' : 'ADMIT'}
                </button>
            )}
            {!result.valid && (
                <button
                    onClick={handleOverride}
                    disabled={overrideLoading}
                    className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl active:scale-[0.98]"
                >
                    OVERRIDE ADMIT
                </button>
            )}
            <button
                onClick={handleClear}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
            >
                Clear
            </button>
        </div>
    </div>
);
