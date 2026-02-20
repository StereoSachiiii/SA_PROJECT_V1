import { memo, useState } from 'react'
import type { Reservation } from '../types'
import QRCode from 'react-qr-code'
import { reservationApi } from '../api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

interface ReservationTicketProps {
    reservation: Reservation;
}

function ReservationTicket({ reservation }: ReservationTicketProps) {
    const isPaid = reservation.status === 'PAID'
    const isPending = reservation.status === 'PENDING_PAYMENT'
    const canCancel = isPaid || isPending
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const cancelMutation = useMutation({
        mutationFn: () => reservationApi.cancel(reservation.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            queryClient.invalidateQueries({ queryKey: ['stalls'] })
            setIsDeleting(false)
        },
        onError: () => setIsDeleting(false)
    })

    return (
        <>
            {/* Ticket */}
            <div
                onClick={() => !isDeleting && reservation.status !== 'CANCELLED' && navigate(`/vendor/reservations/${reservation.id}`)}
                className={`group relative ${reservation.status !== 'CANCELLED' ? 'cursor-pointer' : ''}`}
            >
                <div className={`
                    relative flex flex-col md:flex-row
                    rounded-3xl overflow-hidden
                    border
                    shadow-xl
                    transition-all duration-300
                    ${reservation.status === 'CANCELLED'
                        ? 'bg-slate-200 opacity-75 border-slate-300'
                        : 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 border-primary-700/20'}
                    ${isDeleting ? 'scale-95' : reservation.status !== 'CANCELLED' ? 'hover:-translate-y-1 hover:shadow-2xl' : ''}
                `}>

                    {/* MAIN SECTION */}
                    <div className="flex-1 p-8 relative">

                        {/* Sparkle Glow */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                        <div className="relative z-10">

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-black tracking-tight transition-colors">
                                        {reservation.stalls?.join(', ') || 'No Stall Info'}
                                    </h3>

                                    <p className="text-xs uppercase font-extrabold tracking-widest text-black/60 mt-1">
                                        {reservation.stalls?.length || 0} {reservation.stalls?.length === 1 ? 'Stall' : 'Stalls'}
                                        {reservation.event?.venueName && ` • ${reservation.event.venueName}`}
                                    </p>
                                </div>

                                <span className={`
                                    px-3 py-1 text-[11px] font-black rounded-full border
                                    ${isPaid
                                        ? 'bg-black/10 text-black border-black/20'
                                        : isPending
                                            ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                                            : 'bg-red-500/20 text-red-700 border-red-500/30'}
                                `}>
                                    {reservation.status.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="mt-8 flex items-center gap-4 text-sm text-black">
                                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center border border-black/10">
                                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase font-extrabold tracking-widest text-black/50">
                                        Reserved On
                                    </p>
                                    <p className="font-black font-mono text-black">
                                        {new Date(reservation.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider & STUB SECTION */}
                    {reservation.status !== 'CANCELLED' && (
                        <>
                            <div className="hidden md:flex items-center justify-center w-px bg-black/10"></div>

                            <div className="
                                md:w-64
                                p-8
                                bg-black/[0.05]
                                backdrop-blur-md
                                border-t md:border-t-0 md:border-l border-black/10
                                flex flex-col items-center justify-center
                                transition-colors duration-300
                                group-hover:bg-black/[0.1]
                            ">
                                <span className="text-[11px] uppercase font-extrabold tracking-widest text-black/60 mb-4">
                                    Scan Entry
                                </span>

                                <div className="bg-white p-3 rounded-2xl shadow-xl w-28 h-28 flex items-center justify-center">
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={reservation.qrCode || ''}
                                    />
                                </div>

                                <span className="mt-4 font-black font-mono text-xs text-black tracking-widest">
                                    {(reservation.qrCode || '000').split('-').pop()}
                                </span>
                            </div>
                        </>
                    )}

                    {/* CUSTOM CONFIRMATION OVERLAY */}
                    {isDeleting && (
                        <div className="absolute inset-0 z-30 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in zoom-in duration-200">
                            <h4 className="text-xl font-black mb-1">Cancel this Stall?</h4>
                            <p className="text-sm font-bold opacity-80 mb-6 text-center">This will release the stall for others to book.</p>
                            <div className="flex gap-3 w-full max-w-[280px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        cancelMutation.mutate()
                                    }}
                                    className="flex-1 bg-white text-red-600 py-3 rounded-xl font-black shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-105"
                                >
                                    {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsDeleting(false)
                                    }}
                                    className="flex-1 bg-black/20 border border-white/20 text-white py-3 rounded-xl font-black hover:bg-black transition-all"
                                >
                                    Keep it
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cancel Trigger Button */}
                    {canCancel && !isDeleting && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDeleting(true)
                            }}
                            className="
                                absolute top-4 right-4
                                w-9 h-9 rounded-full
                                bg-red-500/20 border border-red-500/30
                                text-red-700
                                flex items-center justify-center
                                transition-all duration-200
                                hover:bg-red-500 hover:text-white
                                opacity-0 group-hover:opacity-100
                                z-20
                            "
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

        </>
    )
}

export default memo(ReservationTicket)
