import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrCameraScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

export const QrCameraScanner: React.FC<QrCameraScannerProps> = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(true);
    const containerId = 'qr-camera-reader';

    useEffect(() => {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            (decodedText) => {
                // Stop scanner immediately to prevent duplicate reads
                scanner.stop().then(() => {
                    scannerRef.current = null;
                    onScanSuccess(decodedText);
                }).catch(() => {
                    onScanSuccess(decodedText);
                });
            },
            () => {
                // Ignore non-match frames (called on every frame without a QR)
            }
        ).then(() => {
            setIsStarting(false);
        }).catch((err: any) => {
            setIsStarting(false);
            if (err?.toString().includes('NotAllowedError')) {
                setError('Camera permission denied. Please allow camera access and try again.');
            } else if (err?.toString().includes('NotFoundError')) {
                setError('No camera found on this device.');
            } else {
                setError('Could not start camera. Please use manual entry instead.');
            }
        });

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            {/* Viewfinder Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black">
                <div id={containerId} className="w-full" />

                {/* Scanning overlay animation */}
                {!error && !isStarting && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[250px] h-[250px] relative">
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                            {/* Scan line */}
                            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line" />
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {isStarting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-white/80 text-sm font-medium">Starting camera...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error state */}
            {error && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-center">
                    <p className="text-rose-700 font-bold text-sm mb-1">📷 Camera Error</p>
                    <p className="text-rose-600 text-sm">{error}</p>
                </div>
            )}

            {/* Instructions */}
            {!error && !isStarting && (
                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Point camera at QR code
                </p>
            )}

            {/* Close button */}
            <button
                onClick={onClose}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
                <span>⌨️</span> Type Manually
            </button>
        </div>
    );
};
