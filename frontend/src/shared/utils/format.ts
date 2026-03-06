/**
 * Centralized formatting utilities for the application.
 */

// CURRENCY
export const formatCurrency = (amountCents: number | undefined | null): string => {
    if (amountCents === undefined || amountCents === null) return '—';
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amountCents / 100);
};

// NUMBERS
export const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '—';
    return new Intl.NumberFormat('en-US').format(num);
};

// DATES
export const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return '—';
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
};

export const formatDateShort = (date: string | Date | undefined | null): string => {
    if (!date) return '—';
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(d);
};

export const formatDateOnly = (date: string | Date | undefined | null): string => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString();
};

export const formatTimeOnly = (date: string | Date | undefined | null): string => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatTimeLeft = (expiresAt: string | Date | undefined | null): string => {
    if (!expiresAt) return '';
    const now = Date.now();
    const expire = new Date(expiresAt).getTime();
    const diff = expire - now;

    if (diff <= 0) return 'Expired';

    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${mins}m ${secs}s`;
};
