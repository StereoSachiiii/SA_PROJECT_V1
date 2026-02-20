import { Reservation } from '@/shared/types/api';

interface StallAllocationProps {
    reservation: Reservation;
}

export const StallAllocation = ({ reservation }: StallAllocationProps) => {
    const { stallDetails } = reservation;

    let geo = { w: 0, h: 0 };
    if (stallDetails?.geometry) {
        try {
            geo = JSON.parse(stallDetails.geometry);
        } catch (e) {
            // ignore
        }
    }

    return (
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Stall Allocation
            </h3>

            {stallDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stall Number / ID</p>
                        <p className="text-lg font-black text-slate-900">{stallDetails.name}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category & Size</p>
                        <p className="text-lg font-bold text-slate-700">{stallDetails.size.replace('_', ' ')}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 border-t pt-6 mt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Building</p>
                                <p className="font-bold text-slate-800">{stallDetails.buildingName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hall</p>
                                <p className="font-bold text-slate-800">{stallDetails.hallName || 'N/A'} {stallDetails.hallTier ? `(${stallDetails.hallTier})` : ''}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Floor</p>
                                <p className="font-bold text-slate-800">{stallDetails.floorLevel !== undefined ? stallDetails.floorLevel : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Genre</p>
                                <p className="font-bold text-indigo-600 truncate" title={reservation.user?.categories?.join(', ')}>
                                    {reservation.user?.categories?.length ? reservation.user.categories.join(', ').replace(/_/g, ' ') : 'General'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {geo.w > 0 && (
                        <div className="col-span-1 sm:col-span-2 bg-slate-50 p-6 rounded-2xl flex items-center justify-between mt-4 border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">Dimensions</p>
                                <p className="text-2xl font-black text-slate-900">{geo.w}m <span className="text-slate-300 mx-1">×</span> {geo.h}m</p>
                                <p className="text-xs text-slate-500 mt-1 font-medium">{geo.w * geo.h} Sq Meters Total</p>
                            </div>
                            <div className="w-16 h-16 bg-white border-2 border-dashed border-indigo-200 rounded-lg flex items-center justify-center text-indigo-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-slate-500 italic">Basic stall reserved, detailed map data is unavailable.</p>
            )}
        </div>
    );
};
