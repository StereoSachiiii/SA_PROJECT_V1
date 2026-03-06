import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '@/features/reservations';
import { vendorApi } from '@/shared/api/vendorApi';

export function useVendorReservationDetail(reservationId: number) {
    const [showQrFullscreen, setShowQrFullscreen] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showEditInfo, setShowEditInfo] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const { data: reservation, isLoading, error } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => reservationApi.getById(reservationId),
        enabled: !!reservationId,
    });

    const cancelMutation = useMutation({
        mutationFn: async () => {
            if (reservation?.status === 'PAID') {
                return vendorApi.requestRefund(reservationId, 'Vendor requested refund from detail page');
            }
            return vendorApi.cancelReservation(reservationId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            setShowCancelConfirm(false);
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: (categories: string[]) => vendorApi.updateProfile({ categories }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
            setShowEditInfo(false);
        }
    });

    const handleDownloadTicket = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            await vendorApi.downloadTicket(reservationId);
        } catch (e) {
            console.error('Download error', e);
            alert('Failed to download ticket. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const openEditModal = () => {
        setSelectedCategories(reservation?.user?.categories || []);
        setShowEditInfo(true);
    };

    return {
        reservation, isLoading, error,
        showQrFullscreen, setShowQrFullscreen,
        showCancelConfirm, setShowCancelConfirm,
        showEditInfo, setShowEditInfo,
        selectedCategories, setSelectedCategories,
        cancelMutation, updateProfileMutation,
        handleDownloadTicket, openEditModal
    };
}
