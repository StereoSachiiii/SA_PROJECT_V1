export interface PageEnvelope<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ErrorDetails {
    [key: string]: string | number | boolean | null | undefined;
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
    categories: string[];
    contactNumber?: string;
    address?: string;
    reservedStallsCount: number;
}

export interface UserRequest {
    username: string;
    email: string;
    password?: string;
    role?: 'ADMIN' | 'VENDOR' | 'EMPLOYEE';
}

export interface LoginRequest {
    username: string;
    password?: string;
}

// Enums based on backend
export type HallStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type StallSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type StallType = 'STANDARD' | 'PREMIUM' | 'CORNER';
export type StallCategory = 'RETAIL' | 'FOOD' | 'SPONSOR' | 'ANCHOR';
export type PublisherCategory = 'FICTION' | 'NON_FICTION' | 'CHILDREN' | 'EDUCATIONAL' | 'ACADEMIC' | 'RELIGIOUS' | 'TRANSLATIONS' | 'STATIONERY' | 'OTHER';

export interface Hall {
    id: number;
    name: string;
    venueName?: string;
    totalSqFt?: number;
    capacity?: number;
    tier?: string;
    floorLevel?: number;
    status: HallStatus;
    mainCategory?: PublisherCategory;
    // Metadata
    ceilingHeight?: number;
    isIndoor?: boolean;
    isAirConditioned?: boolean;
    expectedFootfall?: number;
    noiseLevel?: string;
    nearbyFacilities?: string;
    distanceFromEntrance?: number;
    distanceFromParking?: number;
    isGroundFloor?: boolean;
    building?: Building;
}

export interface putHallRequest {
    id: number;
    buildingId: number;
    name: string;
    venueName?: string;
    totalSqFt?: number;
    capacity?: number;
    tier?: string;
    floorLevel?: number;
    status: HallStatus;
    mainCategory?: PublisherCategory;
    // Metadata
    ceilingHeight?: number;
    isIndoor?: boolean;
    isAirConditioned?: boolean;
    expectedFootfall?: number;
    noiseLevel?: string;
    nearbyFacilities?: string;
    distanceFromEntrance?: number;
    distanceFromParking?: number;
    isGroundFloor?: boolean;
    building?: Building;
}

export interface StallTemplate {
    id: number;
    name: string;
    hallName?: string;
    size: StallSize;
    type: StallType;
    category: StallCategory;
    basePriceCents: number;
    sqFt?: number;
    isAvailable: boolean;
    defaultProximityScore?: number;
    geometry: string; // JSON string
    imageUrl?: string;
}

export interface AdminDashboardStats {
    totalReservations: number;
    totalRevenueLkr: number;
    activeVendors: number;
    fillRate: number;
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
    gpsCoordinates?: string;  // Matches backend field
    halls: Array<{ id: number; name: string; category?: string }>;
}

export interface Event {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
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
    templateName: string;
    size: StallSize;
    type: StallType;
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
    pricingBreakdown?: Record<string, number | string>;
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

export interface Stall {
    id: number;
    name: string;
    size: StallSize;
    type: StallType;
    category: StallCategory;
    priceCents?: number;
    width?: number;
    height?: number;
    colSpan?: number;
    rowSpan?: number;
    reserved: boolean;
    occupiedBy?: string;
    positionX: number;
    positionY: number;
}

export interface Reservation {
    id: number;
    reservationId: number; // Spec literal
    qrCode?: string;
    status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'CHECKED_IN' | 'PENDING_REFUND'; // Matches API.md 5.1 and new flow
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
        categories?: string[];
    };
    event?: {
        id: number;
        name: string;
        venueName?: string;
    };
    stallDetails?: {
        id: number;
        name: string;
        size: string;
        finalPriceCents: number;
        baseRateCents: number;
        multiplier: number;
        hallName: string;
        hallTier: string;
        floorLevel: number;
        buildingName: string;
        reserved: boolean;
        geometry: string;
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

export interface AuditLog {
    id: number;
    actorId: number;
    action: string;
    entityType: string;
    entityId: number;
    timestamp: string;
    metadata: Record<string, string | number | boolean | null | undefined>;
}

export interface SystemHealth {
    database: string;
    paymentGateway: string;
    mailService: string;
    uptimeSeconds: number;
    usedMemoryBytes: number;
    totalMemoryBytes: number;
    maxMemoryBytes: number;
    activeThreads: number;
    latencyMs: number;
}

export interface DocumentResponse {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
    downloadUrl: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
