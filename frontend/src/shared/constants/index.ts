import {
    HallStatus,
    StallSize,
    StallType,
    StallCategory,
    PublisherCategory
} from '../types/api';

export const HALL_STATUSES: HallStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export const STALL_SIZES: StallSize[] = ['SMALL', 'MEDIUM', 'LARGE'];

export const STALL_TYPES: StallType[] = ['STANDARD', 'PREMIUM', 'CORNER'];

export const STALL_CATEGORIES: StallCategory[] = ['RETAIL', 'FOOD', 'SPONSOR', 'ANCHOR'];

export const HALL_TIERS = ['PREMIUM', 'STANDARD', 'BUDGET', 'ECONOMY'];

export const PUBLISHER_GENRES: { id: PublisherCategory; label: string }[] = [
    { id: 'FICTION', label: 'Fiction' },
    { id: 'NON_FICTION', label: 'Non-Fiction' },
    { id: 'CHILDREN', label: 'Children\'s Books' },
    { id: 'EDUCATIONAL', label: 'Educational' },
    { id: 'ACADEMIC', label: 'Academic' },
    { id: 'RELIGIOUS', label: 'Religious' },
    { id: 'TRANSLATIONS', label: 'Translations' },
    { id: 'STATIONERY', label: 'Stationery' },
    { id: 'OTHER', label: 'Other' }
];

export const RESERVATION_STATUSES = [
    'PENDING_PAYMENT',
    'PAID',
    'CANCELLED',
    'EXPIRED',
    'CHECKED_IN',
    'PENDING_REFUND'
] as const;

export const EVENT_STATUSES = [
    'DRAFT',
    'UPCOMING',
    'OPEN',
    'CLOSED',
    'COMPLETED',
    'CANCELLED'
] as const;

export const NOISE_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
