import api from './client';
import {
    PageEnvelope,
    Event,
    Venue,
    EventStall,
    LayoutZone
} from '../types/api';

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

    // GET EVENT MAP
    getEventMap: async (eventId: number): Promise<{ eventId: number; eventName: string; stalls: EventStall[]; zones: string }> => {
        const response = await api.get<any>(`/public/events/${eventId}/map`);

        // Map and parse geometry JSON string into object for stalls
        const stalls = response.data.stalls.map(stall => {
            let parsedGeometry = { x: 0, y: 0, w: 10, h: 10 };
            if (stall.geometry) {
                try {
                    parsedGeometry = typeof stall.geometry === 'string'
                        ? JSON.parse(stall.geometry)
                        : stall.geometry;
                } catch (e) {
                    console.error("Failed to parse geometry for stall", stall.name, e);
                }
            }
            return {
                ...stall,
                geometry: parsedGeometry
            };
        });

        // Handle both old `zones` field and new `layout` field from backend
        // Backend returns layout as nested object, we stringify it for consistency
        let zonesString = '';
        if (response.data.zones && typeof response.data.zones === 'string') {
            zonesString = response.data.zones;
        } else if (response.data.layout && typeof response.data.layout === 'object') {
            zonesString = JSON.stringify(response.data.layout);
        }

        return { 
            eventId: response.data.eventId, 
            eventName: response.data.eventName, 
            stalls, 
            zones: zonesString 
        };
    }
};
