import React from 'react';

type StatusType = 'RESERVATION' | 'HALL' | 'EVENT' | 'STALL' | 'PAYMENT';

interface StatusBadgeProps {
    status: string;
    type: StatusType;
    className?: string;
}

const getReservationStyles = (status: string) => {
    switch (status) {
        case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'PENDING_PAYMENT': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'PENDING_REFUND': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'EXPIRED': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getHallStyles = (status: string) => {
    switch (status) {
        case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
        case 'ARCHIVED': return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getEventStyles = (status: string) => {
    switch (status) {
        case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
        case 'CLOSED': return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'UPCOMING': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getStallStyles = (isAvailable: boolean) => {
    return isAvailable
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className = '' }) => {
    let styles = '';
    let label = (status || 'UNKNOWN').replace('_', ' ');

    switch (type) {
        case 'RESERVATION':
        case 'PAYMENT':
            styles = getReservationStyles(status);
            break;
        case 'HALL':
            styles = getHallStyles(status);
            break;
        case 'EVENT':
            styles = getEventStyles(status);
            break;
        case 'STALL':
            styles = getStallStyles(status === 'Available' || status === 'true');
            if (status === 'true') label = 'Available';
            if (status === 'false') label = 'Blocked';
            break;
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles} ${className}`}>
            {label}
        </span>
    );
};
