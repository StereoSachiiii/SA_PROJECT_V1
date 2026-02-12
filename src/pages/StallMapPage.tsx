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

    // Helper to get color based on stall size
    const getSizeColor = (size: string, isReserved: boolean, isSelected: boolean) => {
        if (isReserved) return 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
        if (isSelected) return 'bg-blue-600 border-blue-800 text-white shadow-inner';

        switch (size.toLowerCase()) {
            case 'small': return 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100';
            case 'medium': return 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100';
            case 'large': return 'bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-100';
            default: return 'bg-white border-gray-300 text-gray-700';
        }
    };

    const toggleStall = (stallId: number, isReserved: boolean) => {
        if (isReserved) return

        setSelectedStalls((prev) => {
            if (prev.includes(stallId)) {
                return prev.filter((id) => id !== stallId)
            }
            // Max 3 selection limit check
            if (prev.length >= 3) {
                alert("You can only reserve up to 3 stalls.")
                return prev
            }
            return [...prev, stallId]
        })
    }

    const handleReserve = () => {
        mutation.mutate({
            publisherId,
            stallIds: selectedStalls,
        })
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Select Your Stalls</h1>
            <p className="text-gray-600 mb-6">Click to select (max 3). Gray = already reserved.</p>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-sm font-medium">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Small</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> Medium</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded"></div> Large</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded"></div> Reserved</span>
    </div>

    {/* Grid Map */}
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-24">
        {stalls?.map((stall: Stall) => {
            const isSelected = selectedStalls.includes(stall.id);
            return (
                <div
                    key={stall.id}
                    onClick={() => toggleStall(stall.id, stall.reserved)}
                    className={`
                                p-6 rounded-lg border-2 transition-all cursor-pointer text-center
                                ${getSizeColor(stall.size, stall.reserved, isSelected)}
                                ${isSelected ? 'scale-105' : 'hover:scale-102'}
                            `}
                >
                    <div className="font-bold text-lg">{stall.name}</div>
                    <div className="text-xs uppercase tracking-wider mt-1 opacity-80">
                        {stall.size}
                    </div>
            </div>
        );
    })}
        </div>

        {/* Floating Action Bar */}
    {
        selectedStalls.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-full shadow-2xl border flex items-center gap-8 animate-bounce-in">
                <div className="text-gray-700">
                    <span className="font-bold text-blue-600">{selectedStalls.length}</span> stall(s) selected
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md"
                >
                    Continue to Reservation
                </button>
            </div>
        )
    }

    {/* TODO: Make this a proper modal component */ }
    {
        showConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
                    <h2 className="text-2xl font-bold mb-2">Confirm Reservation</h2>
                    <p className="text-gray-600 mb-6">
                        You are about to reserve {selectedStalls.length} stall(s).
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            Cancel
                        </button>
                        <button onClick={handleReserve} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Confirm & Pay
                        </button>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    )
}

export default StallMapPage
