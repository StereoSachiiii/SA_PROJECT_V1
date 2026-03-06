import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { vendorApi } from '@/shared/api/vendorApi'

interface UseStallSelectionProps {
    eventId: number | null
    user: any | null
    remainingSlots: number
}

export function useStallSelection({
    eventId,
    user,
    remainingSlots,
}: UseStallSelectionProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: (vars: { userId: number, stallIds: number[] }) =>
            eventId ? vendorApi.createReservation({ ...vars, eventId }) : Promise.reject('No Event ID'),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['stalls'] })
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            if (data && data.length > 0) {
                navigate(`/checkout/${data[0].id}`)
            } else {
                navigate('/vendor/dashboard')
            }
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || err.message || 'Reservation failed.')
        },
    })

    const handleStallClick = useCallback(
        (stallId: number, isReserved: boolean) => {
            if (isReserved) return
            setSelectedIds(prev => {
                if (prev.includes(stallId)) {
                    setError(null)
                    return prev.filter(id => id !== stallId)
                }
                if (prev.length >= remainingSlots) {
                    setError(`You can select up to ${remainingSlots} stalls.`)
                    return prev
                }
                setError(null)
                return [...prev, stallId]
            })
        },
        [remainingSlots]
    )

    const handleConfirm = useCallback(() => {
        if (!user?.id) { setError('Session not ready.'); return }
        mutation.mutate({ userId: user.id, stallIds: selectedIds })
    }, [user?.id, selectedIds, mutation])

    const handleClearSelection = useCallback(() => {
        setSelectedIds([])
        setError(null)
    }, [])

    return {
        selectedIds,
        setSelectedIds,
        error,
        setError,
        handleStallClick,
        handleConfirm,
        handleClearSelection,
        isPending: mutation.isPending
    }
}
