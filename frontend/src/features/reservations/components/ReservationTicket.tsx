import { memo } from 'react'
import type { Reservation } from '../types'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useReservationTicket } from '../hooks/useReservationTicket'
import { TicketHeader, TicketInfo } from './ReservationTicket/TicketSections'
import { CancelOverlay } from './ReservationTicket/CancelOverlay'

interface ReservationTicketProps {
    reservation: Reservation;
}

function ReservationTicket({ reservation }: ReservationTicketProps) {
    const navigate = useNavigate()
    const {
        isDeleting, setIsDeleting,
        cancelMutation,
        isPaid, isPending, canCancel
    } = useReservationTicket(reservation)

    return (
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
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <TicketHeader reservation={reservation} isPaid={isPaid} isPending={isPending} />
                        <TicketInfo createdAt={reservation.createdAt} />
                    </div>
                </div>

                {/* Divider & STUB SECTION */}
                {reservation.status !== 'CANCELLED' && (
                    <>
                        <div className="hidden md:flex items-center justify-center w-px bg-black/10"></div>
                        <div className="
                            md:w-64 p-8 bg-black/[0.05] backdrop-blur-md
                            border-t md:border-t-0 md:border-l border-black/10
                            flex flex-col items-center justify-center
                            transition-colors duration-300 group-hover:bg-black/[0.1]
                        ">
                            <span className="text-[11px] uppercase font-extrabold tracking-widest text-black/60 mb-4">Scan Entry</span>
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
                    <CancelOverlay
                        onConfirm={() => cancelMutation.mutate()}
                        onCancel={() => setIsDeleting(false)}
                        isLoading={cancelMutation.isPending}
                    />
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
                            text-red-700 flex items-center justify-center
                            transition-all duration-200 hover:bg-red-500 hover:text-white
                            opacity-0 group-hover:opacity-100 z-20
                        "
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default memo(ReservationTicket);
