import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { employeeApi } from '@/shared/api/employeeApi';
import { publicApi } from '@/shared/api/publicApi';
import { PageEnvelope, Reservation } from '@/shared/types/api';

export function useEmployeeDashboard() {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCAN' | 'SEARCH'>('SCAN');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PageEnvelope<Reservation> | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    // Fetch available events for the picker
    const { data: events, isLoading: loadingEvents } = useQuery({
        queryKey: ['employee-events'],
        queryFn: publicApi.getActiveEvents
    });

    // Auto-select first event if none selected
    useEffect(() => {
        if (events && events.content && events.content.length > 0 && !selectedEventId) {
            setSelectedEventId(events.content[0].id);
        }
    }, [events, selectedEventId]);

    // QUERY: Stats (Depends on selectedEventId)
    const { data: stats, isLoading: loadingStats } = useQuery({
        queryKey: ['employee-dashboard', selectedEventId],
        queryFn: () => employeeApi.getDashboardStats(selectedEventId!),
        enabled: !!selectedEventId,
        refetchInterval: 30000
    });

    // MUTATION: Search
    const searchMutation = useMutation({
        mutationFn: (query: string) => employeeApi.search(query, 0, undefined, selectedEventId || undefined),
        onSuccess: (data) => setSearchResults(data)
    });

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery) searchMutation.mutate(searchQuery);
    };

    return {
        activeTab, setActiveTab,
        stats, loadingStats,
        events: events?.content || [], loadingEvents,
        selectedEventId, setSelectedEventId,

        searchQuery, setSearchQuery,
        searchResults,
        handleSearch,
        isSearching: searchMutation.isPending,
        searchError: searchMutation.error
    };
}
