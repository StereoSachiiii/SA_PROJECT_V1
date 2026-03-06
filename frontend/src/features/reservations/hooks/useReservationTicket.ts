import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationApi } from '../api'
import type { Reservation } from '../types'

export function useReservationTicket(reservation: Reservation) {
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()

    const cancelMutation = useMutation({
        mutationFn: () => reservationApi.cancel(reservation.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            queryClient.invalidateQueries({ queryKey: ['stalls'] })
            setIsDeleting(false)
        },
        onError: () => setIsDeleting(false)
    })

    const isPaid = reservation.status === 'PAID'
    const isPending = reservation.status === 'PENDING_PAYMENT'
    const canCancel = isPaid || isPending

    return {
        isDeleting, setIsDeleting,
        cancelMutation,
        isPaid, isPending, canCancel
    }
}
