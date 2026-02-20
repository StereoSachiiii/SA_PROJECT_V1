import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '@/shared/api/employeeApi';

export function useEmployeeScanner() {
    const queryClient = useQueryClient();

    // UI State
    const [qrInput, setQrInput] = useState('');
    const [lookupResult, setLookupResult] = useState<any | null>(null);
    const [overrideCode, setOverrideCode] = useState('');
    const [overrideReason, setOverrideReason] = useState('');
    const [showOverride, setShowOverride] = useState(false);

    // MUTATION: Lookup Reservation (by QR or ID)
    const lookupMutation = useMutation({
        mutationFn: (qrOrId: string) => employeeApi.lookupReservation(qrOrId),
        onSuccess: (data) => {
            setLookupResult(data);
        }
    });

    // MUTATION: Admit Reservation
    const admitMutation = useMutation({
        mutationFn: (reservationId: number) => employeeApi.admitReservation(reservationId),
        onSuccess: () => {
            setQrInput('');
            setLookupResult(null);
            setOverrideCode('');
            setOverrideReason('');
            setShowOverride(false);
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
        }
    });

    // MUTATION: Force Check-In (Admin Override)
    const forceCheckInMutation = useMutation({
        mutationFn: () => employeeApi.forceCheckIn({
            reservationId: lookupResult?.reservationId,
            adminOverrideCode: overrideCode,
            reason: overrideReason
        }),
        onSuccess: () => {
            setShowOverride(false);
            setLookupResult(null);
            setQrInput('');
            setOverrideCode('');
            setOverrideReason('');
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
        }
    });

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        lookupMutation.reset();
        setShowOverride(false);
        if (qrInput) lookupMutation.mutate(qrInput);
    };

    const handleAdmit = () => {
        if (lookupResult?.reservationId) admitMutation.mutate(lookupResult.reservationId);
    };

    const handleForceCheckIn = () => {
        if (lookupResult?.reservationId) forceCheckInMutation.mutate();
    };

    const handleReset = () => {
        lookupMutation.reset();
        admitMutation.reset();
        forceCheckInMutation.reset();
        setQrInput('');
        setLookupResult(null);
        setOverrideCode('');
        setOverrideReason('');
        setShowOverride(false);
    };

    return {
        // State
        qrInput,
        setQrInput,
        lookupResult,
        setLookupResult,
        overrideCode,
        setOverrideCode,
        overrideReason,
        setOverrideReason,
        showOverride,
        setShowOverride,

        // Actions
        handleLookup,
        handleAdmit,
        handleForceCheckIn,

        // Lookup Status
        lookupLoading: lookupMutation.isPending,
        lookupError: lookupMutation.error,

        // Admit Status
        admitLoading: admitMutation.isPending,
        admitError: admitMutation.error,
        admitSuccess: admitMutation.data,

        overrideLoading: forceCheckInMutation.isPending,
        overrideError: forceCheckInMutation.error,
        overrideSuccess: forceCheckInMutation.data,

        // Reset
        handleReset
    };
}

