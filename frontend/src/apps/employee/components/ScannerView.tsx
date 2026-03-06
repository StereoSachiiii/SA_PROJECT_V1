import { ScannerInput, ScannerResultCard } from './Scanner/ScannerSteps';
import { AdmitSuccessView, LookupErrorView } from './Scanner/ScannerStatus';

interface ScannerViewProps {
    qrInput: string;
    setQrInput: (val: string) => void;
    lookupResult: any;
    setLookupResult: (val: any) => void;
    admitSuccess: boolean;
    lookupLoading: boolean;
    admitLoading: boolean;
    lookupError: any;
    handleLookup: (e: React.FormEvent) => void;
    handleAdmit: () => void;
    handleReset: () => void;
    setShowOverride: (val: boolean) => void;
    overrideLoading: boolean;
    directLookup: (qrOrId: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
    qrInput, setQrInput,
    lookupResult, setLookupResult,
    admitSuccess,
    lookupLoading,
    admitLoading,
    lookupError,
    handleLookup,
    handleAdmit,
    handleReset,
    setShowOverride,
    overrideLoading,
    directLookup
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-10">
                <h2 className="text-2xl font-black mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Entrance Check-In
                </h2>

                {/* STEP 1: LOOKUP INPUT */}
                {!lookupResult && !lookupError && (
                    <ScannerInput
                        qrInput={qrInput}
                        setQrInput={setQrInput}
                        handleLookup={handleLookup}
                        loading={lookupLoading}
                        directLookup={directLookup}
                    />
                )}

                {/* STEP 2: DISPLAY RESULT */}
                {lookupResult && !admitSuccess && (
                    <ScannerResultCard
                        result={lookupResult}
                        handleAdmit={handleAdmit}
                        handleOverride={() => setShowOverride(true)}
                        handleClear={() => {
                            setLookupResult(null);
                            setQrInput('');
                        }}
                        admitLoading={admitLoading}
                        overrideLoading={overrideLoading}
                    />
                )}

                {/* STEP 3: SUCCESS */}
                {admitSuccess && (
                    <AdmitSuccessView
                        businessName={lookupResult?.businessName}
                        handleReset={handleReset}
                    />
                )}

                {/* ERROR */}
                {lookupError && (
                    <LookupErrorView
                        error={lookupError}
                        handleReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
};
