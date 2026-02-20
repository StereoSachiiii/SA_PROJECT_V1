import QRCode from 'react-qr-code';

interface EntryPassProps {
    qrCode: string | undefined;
    isCancelled: boolean;
    onShowFullscreen: () => void;
}

export const EntryPass = ({ qrCode, isCancelled, onShowFullscreen }: EntryPassProps) => {
    return (
        <div className={`
            rounded-3xl p-8 border
            flex flex-col items-center justify-center text-center
            transition-all duration-300
            ${isCancelled
                ? 'bg-slate-100 border-slate-200 opacity-80'
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}
        `}>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                Entry Pass
            </h3>

            <div
                className={`p-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform ${isCancelled ? 'bg-slate-200 opacity-50' : 'bg-white border-4 border-slate-100 shadow-inner'}`}
                onClick={() => !isCancelled && onShowFullscreen()}
            >
                {qrCode ? (
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "160px" }}
                        value={qrCode}
                        fgColor={isCancelled ? '#94a3b8' : '#000000'}
                    />
                ) : (
                    <div className="w-[160px] h-[160px] bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase text-[10px]">
                        No Entry Code
                    </div>
                )}
            </div>

            <p className={`mt-6 font-mono text-sm font-bold tracking-widest ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {qrCode?.split('-').pop() || 'NO-ID'}
            </p>

            {isCancelled && (
                <p className="text-red-500 font-black text-xs mt-4 uppercase tracking-widest">CANCELLED</p>
            )}
        </div>
    );
};
