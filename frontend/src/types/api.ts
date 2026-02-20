export interface PageEnvelope<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ErrorDetails {
    [key: string]: any;
}

export interface ApiError {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    path: string;
    details?: ErrorDetails;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'VENDOR' | 'EMPLOYEE';
    businessName?: string;
    businessDescription?: string;
    logoUrl?: string;
    categories: string[]; // Matches backend UserResponse.java
    contactNumber?: string;
    address?: string;
    reservedStallsCount: number;
}

export interface Venue {
    id: number;
    name: string;
    address: string;
    buildings: Building[];
}

export interface Building {
    id: number;
    name: string;
    gps?: string;
    halls: Hall[];
}

export interface Hall {
    id: number;
    name: string;
    category?: string;
}

export interface Event {
    id: number;
    name: string;
    description?: string;
    status: 'DRAFT' | 'UPCOMING' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
    startDate: string;
    endDate: string;
    location: string;
    venueId?: number;
    venueName?: string;
    layoutConfig?: string;
    createdAt?: string;
}

export interface EventStall {
    id: number;
    name: string;
    templateName: string; // Spec literal binary parity
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    type: 'STANDARD' | 'PREMIUM' | 'CORNER';
    priceCents: number;
    proximityScore?: number;
    hallName?: string;
    hallCategory?: string;
    width?: number;
    height?: number;
    positionX?: number;
    positionY?: number;
    colSpan?: number;
    rowSpan?: number;
    reserved: boolean;
    occupiedBy?: string;
    publisherCategory?: string;
    geometry: string | { x: number; y: number; w: number; h: number };
    pricingBreakdown?: Record<string, any>;
}

export type ZoneType = 'ENTRANCE' | 'EXIT' | 'WALKWAY' | 'STAGE' | 'PILLAR' | 'RESTRICTED';

export interface LayoutZone {
    id?: number;
    type: ZoneType;
    geometry: { x: number; y: number; w: number; h: number };
    metadata?: {
        label?: string;
        trafficWeight?: number;
    };
}

export interface Reservation {
    id: number;
    reservationId: number; // Spec literal
    qrCode?: string;
    status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'CHECKED_IN'; // Matches API.md 5.1
    emailSent?: boolean;
    createdAt: string;
    vendor?: string; // Derived field/Computed
    stalls: string[]; // Spec literal: ["A1", "A2"]
    totalPriceCents?: number;
    ttlSeconds?: number;
    expiresAt?: string;
    // Internal helper for rich UI (optional if we still want it)
    user?: {
        id: number;
        username: string;
        email: string;
        businessName: string;
        contactNumber?: string;
        role: string;
    };
    event?: {
        id: number;
        name: string;
        venueName?: string;
    };
}

export interface ReservationRequest {
    userId: number;
    eventId: number; // Mandatory for V4 atomic booking
    stallIds: number[];
}

export interface CheckInRequest {
    qrCode: string;
}

export interface CheckInOverrideRequest {
    reservationId: number;
    adminOverrideCode: string;
    reason: string;
}

export interface CheckInResponse {
    reservationId: number;
    status: 'CHECKED_IN';
    vendor: string;
    timestamp: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenreRequest {
    userId: number;
    name: string;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT';

export interface NotificationResponse {
    id: number;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}
export interface DashboardStats {
    totalStalls: number;
    reservedStalls: number;
    availableStalls: number;
    totalUsers: number;
    totalReservations: number;
    checkedInCount?: number;
}
