import { useState, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { Hall, Event, Venue, Building } from '@/shared/types/api';
import { Plus, CheckCircle2 } from 'lucide-react';
import { HallWizard } from '../components/HallManagement/HallWizard';
import { HallList } from '../components/HallManagement/HallList';
import { HallDetailsModal } from '../components/HallManagement/HallDetailsModal';
import { LoadingState } from '@/shared/components/LoadingState';

export default function HallManagement() {
    type ViewMode = 'EVENTS' | 'VENUES' | 'BUILDINGS' | 'HALLS';
    const [viewMode, setViewMode] = useState<ViewMode>('EVENTS');

    // Data states
    const [events, setEvents] = useState<Event[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);

    // Selection states
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterQuery, setFilterQuery] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingHall, setEditingHall] = useState<Hall | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const restoreState = async () => {
            setLoading(true);
            try {
                const data = await adminApi.getAllEvents();
                setEvents(data);

                const saved = sessionStorage.getItem('admin_hall_state');
                if (saved) {
                    const { event, venue, building, mode } = JSON.parse(saved);
                    if (event) {
                        setSelectedEvent(event);
                        const vs = await adminApi.getAllVenues();
                        setVenues(vs);
                        if (venue) {
                            setSelectedVenue(venue);
                            const bs = await adminApi.getBuildingsByVenue(venue.id);
                            setBuildings(bs);
                            if (building) {
                                setSelectedBuilding(building);
                                const hs = await adminApi.getHallsByBuilding(building.id);
                                setHalls(hs);
                            }
                        }
                        setViewMode(mode);
                    }
                }
            } catch (err) {
                setError('Failed to load initial data.');
            } finally {
                setLoading(false);
            }
        };
        restoreState();
    }, []);

    // Save state whenever selections change
    useEffect(() => {
        if (!loading) {
            sessionStorage.setItem('admin_hall_state', JSON.stringify({
                event: selectedEvent,
                venue: selectedVenue,
                building: selectedBuilding,
                mode: viewMode
            }));
        }
    }, [selectedEvent, selectedVenue, selectedBuilding, viewMode, loading]);

    const handleSelectEvent = async (event: Event) => {
        setSelectedEvent(event);
        setLoading(true);
        try {
            // In a real app, an event might span multiple venues, but for now we fetch all venues
            // or if the event has a specific venueId, we select it automatically.
            const allVenues = await adminApi.getAllVenues();
            setVenues(allVenues);

            if (event.venueId) {
                const venue = allVenues.find(v => v.id === event.venueId);
                if (venue) {
                    setSelectedVenue(venue);
                    const buildings = await adminApi.getBuildingsByVenue(venue.id);
                    setBuildings(buildings);
                    setViewMode('BUILDINGS');
                } else {
                    setViewMode('VENUES');
                }
            } else {
                setViewMode('VENUES');
            }
        } catch (err) {
            setError('Failed to load venue data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVenue = async (venue: Venue) => {
        setLoading(true);
        setSelectedVenue(venue);
        try {
            const data = await adminApi.getBuildingsByVenue(venue.id);
            setBuildings(data);
            setViewMode('BUILDINGS');
        } catch (err) {
            setError('Failed to load buildings.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBuilding = async (building: Building) => {
        setLoading(true);
        setSelectedBuilding(building);
        try {
            const data = await adminApi.getHallsByBuilding(building.id);
            setHalls(data);
            setViewMode('HALLS');
        } catch (err) {
            setError('Failed to load halls.');
        } finally {
            setLoading(false);
        }
    };

    const resetToEvents = () => {
        setViewMode('EVENTS');
        setSelectedEvent(null);
        setSelectedVenue(null);
        setSelectedBuilding(null);
    };

    const goBack = () => {
        if (viewMode === 'VENUES') {
            setViewMode('EVENTS');
            setSelectedEvent(null);
        } else if (viewMode === 'BUILDINGS') {
            if (selectedEvent?.venueId) {
                setViewMode('EVENTS');
                setSelectedEvent(null);
                setSelectedVenue(null);
            } else {
                setViewMode('VENUES');
                setSelectedVenue(null);
            }
        } else if (viewMode === 'HALLS') {
            setViewMode('BUILDINGS');
            setSelectedBuilding(null);
        }
    };

    const handleOpenCreate = () => {
        setEditingHall(null);
        setError('');
        setShowModal(true);
    };

    const handleOpenEdit = (hall: Hall) => {
        setEditingHall(hall);
        setError('');
        setShowModal(true);
    };

    const handleSave = async (data: any) => {
        if (!selectedBuilding) return;
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...data,
                buildingId: selectedBuilding.id,
                totalSqFt: parseFloat(data.totalSqFt) || 0,
                capacity: parseInt(data.capacity) || 0,
                floorLevel: parseInt(data.floorLevel) || 1,
                expectedFootfall: parseInt(data.expectedFootfall) || 0,
                distanceFromEntrance: parseFloat(data.distanceFromEntrance) || 0,
                distanceFromParking: parseFloat(data.distanceFromParking) || 0,
            };

            if (editingHall) {
                const updated = await adminApi.updateHall(editingHall.id, {
                    ...payload,
                    id: editingHall.id,
                    name: data.name,
                    buildingId: selectedBuilding.id,
                    status: editingHall.status as any
                });
                setHalls(prev => prev.map(h => h.id === editingHall.id ? { ...h, ...updated } : h));
                setSuccess(`Hall "${updated.name}" updated.`);
            } else {
                const created = await adminApi.createHall({
                    ...payload,
                    name: data.name,
                    building: { id: selectedBuilding.id } as any
                });
                setHalls(prev => [...prev, created]);
                setSuccess(`Hall "${created.name}" created.`);
            }
            setShowModal(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async (hall: Hall) => {
        if (!window.confirm(`Archive "${hall.name}"?`)) return;
        setError('');
        try {
            await adminApi.changeHallStatus(hall.id, 'ARCHIVED');
            setSuccess('Hall archived.');
            setHalls(prev => prev.filter(h => h.id !== hall.id));
        } catch (err: any) {
            setError('Failed to archive hall.');
        }
    };

    const handlePublish = async (hall: Hall) => {
        if (!confirm(`Publish hall "${hall.name}"? It will become visible to vendors.`)) return;
        setError('');
        try {
            const updated = await adminApi.changeHallStatus(hall.id, 'PUBLISHED');
            setHalls(prev => prev.map(h => h.id === hall.id ? { ...h, status: updated.status } : h));
            setSuccess(`Hall "${hall.name}" published.`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Publish failed.');
        }
    };

    const filteredEvents = events.filter(e => e.name.toLowerCase().includes(filterQuery.toLowerCase()));
    const filteredVenues = venues.filter(v => v.name.toLowerCase().includes(filterQuery.toLowerCase()));
    const filteredBuildings = buildings.filter(b => b.name.toLowerCase().includes(filterQuery.toLowerCase()));
    const filteredHalls = halls.filter(h => h.name.toLowerCase().includes(filterQuery.toLowerCase()) && h.status !== 'ARCHIVED');

    if (loading && events.length === 0) return <LoadingState message="Initial Loading..." fullPage />;

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
                    onOpenCreate={handleOpenCreate}
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
