import QRCode from 'react-qr-code';

interface QrFullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCode: string | undefined;
}

export const QrFullscreenModal = ({
    isOpen,
    onClose,
    qrCode
}: QrFullscreenModalProps) => {
    if (!isOpen || !qrCode) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-200 cursor-default" onClick={e => e.stopPropagation()}>
                <div className="mb-6 w-full flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Entry Pass Details</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="bg-white p-6 border-4 border-slate-100 rounded-2xl w-full flex justify-center shadow-inner">
                    <QRCode
                        size={512}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={qrCode}
                        fgColor={'#000000'}
                    />
                </div>
                <p className="mt-6 font-mono font-black text-slate-800 tracking-widest text-xl">
                    {qrCode.split('-').pop()}
                </p>
                <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-wide opacity-60 italic">Show this code at the venue entrance</p>
            </div>
        </div>
    );
};
