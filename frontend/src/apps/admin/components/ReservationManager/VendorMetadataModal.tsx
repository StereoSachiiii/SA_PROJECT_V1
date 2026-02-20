import React from 'react';
import { XCircle } from 'lucide-react';
import { Reservation } from '@/shared/types/api';

interface VendorMetadataModalProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
}

export const VendorMetadataModal: React.FC<VendorMetadataModalProps> = ({
    reservation,
    isOpen,
    onClose
}) => {
    if (!isOpen || !reservation || !reservation.user) return null;

    const { user } = reservation;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-left overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Vendor Portfolio</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Booking #{reservation.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Company / Publisher</p>
                        <p className="text-base font-black text-gray-800">{user.businessName || user.username}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Email</p>
                        <p className="text-sm font-medium text-gray-700">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                        <p className="text-sm font-medium text-gray-700">{user.contactNumber || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Primary Categories</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(user.categories || []).length > 0 ? (
                                user.categories?.map(cat => (
                                    <span key={cat} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-100">
                                        {cat.replace(/_/g, ' ')}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500 italic">No categories explicitly set</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Stalls</p>
                        <p className="text-sm font-black text-indigo-600 tracking-wider">
                            {(reservation.stalls || []).join(', ')}
                        </p>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button onClick={onClose} className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                        Close Metadata
                    </button>
                </div>
            </div>
        </div>
    );
};
