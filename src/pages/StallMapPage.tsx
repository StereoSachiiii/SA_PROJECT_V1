import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './StallMap.css';

/*import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stallApi, reservationApi } from '../api' */

// At the top of src/pages/StallMapPage.tsx
import { MOCK_STALL_MAP_DATA } from '../test/mockData';
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

    /*const queryClient = useQueryClient()*/
    const [selectedStalls, setSelectedStalls] = useState<number[]>([])
    const [showConfirm, setShowConfirm] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)


    const publisherId = Number(localStorage.getItem('publisherId'))

    // Comment out or remove the useQuery call
    // const { data: stalls, isLoading } = useQuery(...)

    // Use the mock data directly
    const stalls = MOCK_STALL_MAP_DATA;
    const isLoading = false; // Set to false so the map shows immediately

    /*
    const { data: stalls, isLoading } = useQuery({
        queryKey: ['stalls'],
        queryFn: stallApi.getAll,
    })

    */

    // Helper to determine color based on size and state
    const getStallStyles = (stall: Stall) => {
        const isSelected = selectedStalls.includes(stall.id);

        if (stall.reserved) return 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
        if (isSelected) return 'bg-blue-600 border-blue-800 text-white scale-105 shadow-lg';

        switch (stall.size.toLowerCase()) {
            case 'small': return 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100';
            case 'medium': return 'bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100';
            case 'large': return 'bg-purple-50 border-purple-400 text-purple-700 hover:bg-purple-100';
            default: return 'bg-white border-gray-300';
        }
    };

    const toggleStall = (stallId: number, isReserved: boolean) => {
        if (isReserved) return;

        setSelectedStalls((prev) => {
            if (prev.includes(stallId)) {
                return prev.filter((id) => id !== stallId);
            }
            // Logic for max 3 check
            if (prev.length >= 3) {
                alert("Selection limit reached: You can reserve a maximum of 3 stalls.");
                return prev;
            }
            return [...prev, stallId];
        });
    };

    const handleReserve = () => {
        setIsSubmitting(true);
        // Simulate API delay
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/home');
        }, 1200);
    };

    /*const mutation = useMutation({
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
*/
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

            {/* Grid Map Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-32">
                {stalls?.map((stall: any) => ( // Use optional chaining (?.) and type casting
                    <div
                        key={stall.id}
                        onClick={() => toggleStall(stall.id, stall.reserved)}
                        className={`
                relative h-32 flex flex-col items-center justify-center rounded-xl border-2 
                transition-all duration-200 cursor-pointer font-bold
                ${getStallStyles(stall)}
            `}
                    >
                        <span className="text-xl">{stall.name}</span>
                        <span className="text-[10px] uppercase tracking-tighter opacity-70 mt-1">{stall.size}</span>

                        {/* Logic for the selection checkmark */}
                        {selectedStalls.includes(stall.id) && (
                            <div className="absolute top-2 right-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm">
                                ✓
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Selection Summary Bar */}
            {selectedStalls.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
                    <div className="bg-white border shadow-2xl rounded-2xl p-4 flex items-center justify-between animate-slide-up">
                        <div className="pl-4">
                            <p className="text-xs text-gray-500 font-bold uppercase">Stalls Selected</p>
                            <p className="text-xl font-black text-blue-600">{selectedStalls.length} / 3</p>
                        </div>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
                        >
                            Reserve Now
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-pop-in">
                        <h2 className="text-2xl font-black text-gray-800 mb-2">Confirm Selection</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            You have selected <span className="font-bold text-gray-900">{selectedStalls.length} stalls</span>.
                            Would you like to finalize your reservation?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
                            >
                                Not yet
                            </button>
                            <button
                                onClick={handleReserve}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Finalizing...' : 'Yes, Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StallMapPage
