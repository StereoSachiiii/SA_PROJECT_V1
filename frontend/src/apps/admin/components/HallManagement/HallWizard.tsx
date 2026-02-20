import React from 'react';
import { ChevronRight, Calendar, MapPin, Building2, Search, ArrowLeft } from 'lucide-react';
import { Event, Venue, Building } from '@/shared/types/api';

interface HallWizardProps {
    viewMode: 'EVENTS' | 'VENUES' | 'BUILDINGS' | 'HALLS';
    events: Event[];
    venues: Venue[];
    buildings: Building[];
    selectedEvent: Event | null;
    selectedVenue: Venue | null;
    selectedBuilding: Building | null;
    filterQuery: string;
    loading: boolean;
    onSelectEvent: (event: Event) => void;
    onSelectVenue: (venue: Venue) => void;
    onSelectBuilding: (building: Building) => void;
    onSetFilterQuery: (query: string) => void;
    onGoBack: () => void;
    onReset: () => void;
    onSetViewMode: (mode: 'EVENTS' | 'VENUES' | 'BUILDINGS' | 'HALLS') => void;
}

export const HallWizard: React.FC<HallWizardProps> = ({
    viewMode,
    events,
    venues,
    buildings,
    selectedEvent,
    selectedVenue,
    selectedBuilding,
    filterQuery,
    loading,
    onSelectEvent,
    onSelectVenue,
    onSelectBuilding,
    onSetFilterQuery,
    onGoBack,
    onReset,
    onSetViewMode
}) => {
    const renderBreadcrumbs = () => (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <button
                onClick={onReset}
                className="hover:text-blue-600 transition-colors"
            >
                Events
            </button>
            {selectedEvent && (
                <>
                    <ChevronRight size={10} />
                    <button
                        onClick={() => onSetViewMode('VENUES')}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {selectedEvent.name}
                    </button>
                </>
            )}
            {selectedVenue && (
                <>
                    <ChevronRight size={10} />
                    <button
                        onClick={() => onSetViewMode('BUILDINGS')}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {selectedVenue.name}
                    </button>
                </>
            )}
            {selectedBuilding && (
                <>
                    <ChevronRight size={10} />
                    <span className="text-gray-900">{selectedBuilding.name}</span>
                </>
            )}
        </div>
    );

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {viewMode === 'EVENTS' && 'Event Selection'}
                    {viewMode === 'VENUES' && 'Venue Selection'}
                    {viewMode === 'BUILDINGS' && 'Building Selection'}
                    {viewMode === 'HALLS' && 'Hall Management'}
                </h1>
                <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">
                    {viewMode === 'EVENTS' && 'Select an event to manage its venue layout'}
                    {viewMode === 'VENUES' && `Venues associated with ${selectedEvent?.name}`}
                    {viewMode === 'BUILDINGS' && `Buildings within ${selectedVenue?.name}`}
                    {viewMode === 'HALLS' && `Halls in ${selectedBuilding?.name}`}
                </p>
            </div>
            {viewMode !== 'EVENTS' && (
                <button
                    onClick={onGoBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm w-fit"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                {renderBreadcrumbs()}
                {renderHeader()}
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                    type="text"
                    placeholder={`Filter ${viewMode.toLowerCase()}...`}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={filterQuery}
                    onChange={e => onSetFilterQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <div className="col-span-full py-20 text-center uppercase text-[10px] font-bold text-gray-400 tracking-widest animate-pulse">Loading items...</div>}

                {!loading && viewMode === 'EVENTS' && events.map(event => (
                    <div key={event.id} onClick={() => onSelectEvent(event)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Calendar size={20} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-tighter">{new Date(event.startDate).getFullYear()}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{event.location}</p>
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 group-hover:text-blue-500 transition-colors">
                            <span>Manage Venue</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                ))}

                {!loading && viewMode === 'VENUES' && venues.map(venue => (
                    <div key={venue.id} onClick={() => onSelectVenue(venue)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors w-fit">
                            <MapPin size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">{venue.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium italic">{venue.address}</p>
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 group-hover:text-green-500 transition-colors">
                            <span>Configure Buildings</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                ))}

                {!loading && viewMode === 'BUILDINGS' && buildings.map(building => (
                    <div key={building.id} onClick={() => onSelectBuilding(building)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors w-fit">
                            <Building2 size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">{building.name}</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-widest">{building.gpsCoordinates || 'No GPS Data'}</p>
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 group-hover:text-amber-500 transition-colors">
                            <span>Manage Halls</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
