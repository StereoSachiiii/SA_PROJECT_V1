import { useAuth } from '@/shared/context/AuthContext';
import { useEmployeeScanner } from '../hooks/useEmployeeScanner';
import { useEmployeeDashboard } from '../hooks/useEmployeeDashboard';
import { employeeApi } from '@/shared/api/employeeApi';

// Sub-components
import { EmployeeHeader } from '../components/EmployeeHeader';
import { ScannerView } from '../components/ScannerView';
import { OperationalDashboard } from '../components/OperationalDashboard';
import { DirectorySearch } from '../components/DirectorySearch';
import { OverrideModal } from '../components/OverrideModal';

export default function EmployeePortalPage() {
    const { user } = useAuth();

    // Extracted Logic
    const {
        activeTab, setActiveTab,
        stats, loadingStats,
        searchQuery, setSearchQuery, searchResults, handleSearch,
        events, selectedEventId, setSelectedEventId
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
        directLookup,
        lookupLoading,
        lookupError,
        admitLoading,
        admitSuccess,
        overrideLoading,
        handleReset
    } = useEmployeeScanner();

    const loading = lookupLoading || admitLoading || overrideLoading;

    const handleExport = async () => {
        if (!selectedEventId) return;
        try {
            const blob = await employeeApi.exportAttendance(selectedEventId);
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
            <EmployeeHeader
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onExport={handleExport}
                events={events}
                selectedEventId={selectedEventId}
                setSelectedEventId={setSelectedEventId}
            />

            <main className="max-w-4xl mx-auto px-6 py-12">
                {activeTab === 'SCAN' && (
                    <ScannerView
                        qrInput={qrInput}
                        setQrInput={setQrInput}
                        lookupResult={lookupResult}
                        setLookupResult={setLookupResult}
                        admitSuccess={!!admitSuccess}
                        lookupLoading={lookupLoading}
                        admitLoading={admitLoading}
                        lookupError={lookupError}
                        handleLookup={handleLookup}
                        handleAdmit={handleAdmit}
                        handleReset={handleReset}
                        setShowOverride={setShowOverride}
                        overrideLoading={overrideLoading}
                        directLookup={directLookup}
                    />
                )}

                {activeTab === 'DASHBOARD' && (
                    <OperationalDashboard
                        stats={stats}
                        loadingStats={loadingStats}
                    />
                )}

                {activeTab === 'SEARCH' && (
                    <DirectorySearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchResults={searchResults}
                        handleSearch={handleSearch}
                    />
                )}
            </main>

            {showOverride && (
                <OverrideModal
                    overrideCode={overrideCode}
                    setOverrideCode={setOverrideCode}
                    overrideReason={overrideReason}
                    setOverrideReason={setOverrideReason}
                    handleForceCheckIn={handleForceCheckIn}
                    onClose={() => setShowOverride(false)}
                    loading={loading}
                />
            )}
        </div>
    );
}
