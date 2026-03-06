import { useHallManagement } from '../hooks/useHallManagement';
import { Plus, CheckCircle2 } from 'lucide-react';
import { HallWizard } from '../components/HallManagement/HallWizard';
import { HallList } from '../components/HallManagement/HallList';
import { HallDetailsModal } from '../components/HallManagement/HallDetailsModal';
import { LoadingState } from '@/shared/components/LoadingState';

export default function HallManagement() {
    const {
        viewMode, setViewMode,
        filteredEvents, filteredVenues, filteredBuildings, filteredHalls,
        selectedEvent, selectedVenue, selectedBuilding,
        loading, error, setError, success, setSuccess, filterQuery, setFilterQuery,
        showModal, setShowModal, editingHall, setEditingHall, saving,
        handleSelectEvent, handleSelectVenue, handleSelectBuilding,
        goBack, resetToEvents, handleSave, handleArchive, handlePublish
    } = useHallManagement();

    const handleOpenCreate = () => {
        setEditingHall(null);
        setError('');
        setShowModal(true);
    };

    const handleOpenEdit = (hall: any) => {
        setEditingHall(hall);
        setError('');
        setShowModal(true);
    };

    if (loading && filteredEvents.length === 0) return <LoadingState message="Initial Loading..." fullPage />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HallWizard
                viewMode={viewMode}
                events={filteredEvents}
                venues={filteredVenues}
                buildings={filteredBuildings}
                selectedEvent={selectedEvent}
                selectedVenue={selectedVenue}
                selectedBuilding={selectedBuilding}
                filterQuery={filterQuery}
                loading={loading}
                onSelectEvent={handleSelectEvent}
                onSelectVenue={handleSelectVenue}
                onSelectBuilding={handleSelectBuilding}
                onSetFilterQuery={setFilterQuery}
                onGoBack={goBack}
                onReset={resetToEvents}
                onSetViewMode={setViewMode}
            />

            {viewMode === 'HALLS' && (
                <div className="flex justify-end gap-3 mt-[-1rem]">
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Create New Hall
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={14} />  {success}
                    <button onClick={() => setSuccess('')} className="ml-auto"><Plus className="rotate-45" size={14} /></button>
                </div>
            )}

            {viewMode === 'HALLS' && (
                <HallList
                    halls={filteredHalls}
                    onPublish={handlePublish}
                    onArchive={handleArchive}
                    onEdit={handleOpenEdit}
                />
            )}

            <HallDetailsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                editingHall={editingHall}
                selectedVenue={selectedVenue}
                selectedBuilding={selectedBuilding}
                onSave={handleSave}
                isSaving={saving}
                error={error}
            />
        </div>
    );
}
