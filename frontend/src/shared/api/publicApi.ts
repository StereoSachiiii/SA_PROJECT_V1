import api from './client';
import {
    PageEnvelope,
    Event,
    Venue,
    EventStall,
    MapZone,
    MapInfluence
} from '@/shared/types/api';

export const publicApi = {
    // LIST VENUES (Hierarchical)
    getVenues: async (): Promise<PageEnvelope<Venue>> => {
        const response = await api.get<PageEnvelope<Venue>>('/public/venues');
        return response.data;
    },

    // LIST ACTIVE EVENTS
    getActiveEvents: async (): Promise<PageEnvelope<Event>> => {
        const response = await api.get<PageEnvelope<Event>>('/public/events/active');
        return response.data;
    },

    // SEARCH EVENTS
    searchEvents: async (query: string): Promise<PageEnvelope<Event>> => {
        const response = await api.get<PageEnvelope<Event>>('/public/events/search', {
            params: { q: query }
        });
        return response.data;
    },

    // GET SINGLE EVENT DETAILS
    getEvent: async (id: number): Promise<Event> => {
        const response = await api.get<Event>(`/public/events/${id}`);
        return response.data;
    },

    // GET EVENT MAP
<<<<<<< HEAD
    getEventMap: async (eventId: number): Promise<{
=======
    getEventMap: async (eventId: number, refresh = false): Promise<{
>>>>>>> main
        eventId: number;
        eventName: string;
        stalls: EventStall[];
        zones: MapZone[];
        influences: MapInfluence[];
        halls?: any[];
        mapUrl?: string;
        mapWidth?: number;
        mapHeight?: number;
    }> => {
        const response = await api.get<{
            eventId: number;
            eventName: string;
            stalls: EventStall[];
            zones: MapZone[];
            influences: MapInfluence[];
            halls?: any[];
            mapUrl?: string;
            mapWidth?: number;
            mapHeight?: number;
<<<<<<< HEAD
        }>(`/public/events/${eventId}/map`);
=======
        }>(`/public/events/${eventId}/map`, {
            params: refresh ? { _t: Date.now() } : {}
        });
>>>>>>> main

        return {
            eventId: response.data.eventId,
            eventName: response.data.eventName,
            stalls: response.data.stalls || [],
            zones: response.data.zones || [],
            influences: response.data.influences || [],
            halls: response.data.halls || [],
            mapUrl: response.data.mapUrl,
            mapWidth: response.data.mapWidth,
            mapHeight: response.data.mapHeight
        };
    }
};
