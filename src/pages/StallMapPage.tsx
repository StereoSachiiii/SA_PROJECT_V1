import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stallApi, reservationApi } from '../api'
import type { Stall } from '../types'

/**
 * Stall Map Page
 * 
 * TODO [FRONTEND DEV 2]:
 * - Create proper grid-based map visualization
 * - Add stall size indicators (colors/icons)
 * - Add confirmation modal popup
 * - Add stall selection limit (max 3)
 * - Style with Tailwind
 */
function StallMapPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedStalls, setSelectedStalls] = useState<number[]>([])
    const [showConfirm, setShowConfirm] = useState(false)

    const publisherId = Number(localStorage.getItem('publisherId'))

    const { data: stalls, isLoading } = useQuery({
        queryKey: ['stalls'],
        queryFn: stallApi.getAll,
    })

    const mutation = useMutation({
        mutationFn: reservationApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stalls'] })
            navigate('/home')
        },
    })

    const toggleStall = (stallId: number, isReserved: boolean) => {
        if (isReserved) return

        setSelectedStalls((prev) => {
            if (prev.includes(stallId)) {
                return prev.filter((id) => id !== stallId)
            }
            // TODO: Add max 3 check with user feedback
            if (prev.length >= 3) return prev
            return [...prev, stallId]
        })
    }

    const handleReserve = () => {
        mutation.mutate({
            publisherId,
            stallIds: selectedStalls,
        })
    }

    if (isLoading) return <div className="p-8">Loading stalls...</div>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Select Your Stalls</h1>
            <p className="text-gray-600 mb-6">Click to select (max 3). Gray = already reserved.</p>

            {/* TODO: Make this a proper map grid */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                {stalls?.map((stall: Stall) => (
                    <div
                        key={stall.id}
                        onClick={() => toggleStall(stall.id, stall.reserved)}
                        className={`
              p-4 rounded cursor-pointer text-center border-2
              ${stall.reserved
                                ? 'bg-gray-300 cursor-not-allowed'
                                : selectedStalls.includes(stall.id)
                                    ? 'bg-blue-500 text-white border-blue-700'
                                    : 'bg-white hover:bg-blue-100 border-gray-300'
                            }
            `}
                    >
                        <div className="font-bold">{stall.name}</div>
                        <div className="text-xs">{stall.size}</div>
                    </div>
                ))}
            </div>

            {selectedStalls.length > 0 && (
                <div className="fixed bottom-8 right-8">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700"
                    >
                        Reserve {selectedStalls.length} Stall(s)
                    </button>
                </div>
            )}

            {/* TODO: Make this a proper modal component */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
                        <p className="mb-4">Reserve {selectedStalls.length} stall(s)?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReserve}
                                disabled={mutation.isPending}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {mutation.isPending ? 'Reserving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StallMapPage
