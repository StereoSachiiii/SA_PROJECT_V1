import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { employeeApi } from '@/shared/api/employeeApi';
import { PageEnvelope, Reservation } from '@/shared/types/api';

export function useEmployeeDashboard() {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCAN' | 'SEARCH'>('SCAN');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PageEnvelope<Reservation> | null>(null);

    // QUERY: Stats
    const { data: stats, isLoading: loadingStats } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: employeeApi.getDashboardStats,
        refetchInterval: 30000
    });

    // MUTATION: Search
    const searchMutation = useMutation({
        mutationFn: (query: string) => employeeApi.search(query), // Explicit wrapper to discard extra args
        onSuccess: (data) => setSearchResults(data)
    });

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery) searchMutation.mutate(searchQuery);
    };

    return {
        activeTab, setActiveTab,
        stats, loadingStats,

        searchQuery, setSearchQuery,
        searchResults,
        handleSearch,
        isSearching: searchMutation.isPending,
        searchError: searchMutation.error
    };
}
