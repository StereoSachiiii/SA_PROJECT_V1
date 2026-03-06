import { EventStall as MapStall, PricingBreakdown, Hall, ValueDriver, MapZone, MapInfluence } from './api'

export type { MapStall, PricingBreakdown, ValueDriver };

export interface StallGeometry {
    x: number
    y: number
    w: number
    h: number
}

/** What the API actually returns */
export interface RawEventMap {
    eventId: number
    eventName: string
    stalls: MapStall[]
    zones: MapZone[]
    influences: MapInfluence[]
    halls?: Hall[]
    mapUrl?: string
    mapWidth?: number
    mapHeight?: number
}

// ─── Normalized Internal Types ────────────────────────────────────────────────

/** Influence circle with coordinates normalized to 0–100 percentage space */
export interface NormalizedInfluence {
    hallName?: string
    id: string
    type: string
    cx: number      // percentage (0–100) of container width
    cy: number      // percentage (0–100) of container height
    r: number       // percentage radius (normalized to canvas width)
    intensity: number
    falloff: string
}

/** Layout zone with percentage coordinates */
export interface NormalizedZone {
    hallName?: string
    type: 'WALKWAY' | 'STAGE' | 'ENTRANCE' | 'FIRE_EXIT' | 'WALL' | 'PILLAR' | 'OFFICE' | 'OTHER'
    x: number
    y: number
    w: number
    h: number
    label: string
}

/** Parsed zones ready for rendering */
export interface ParsedZones {
    influences: NormalizedInfluence[]
    zones: NormalizedZone[]
}

// ─── Stall State Derivation ───────────────────────────────────────────────────

export type StallRenderState = 'available' | 'reserved' | 'selected' | 'premium'

export function getStallRenderState(
    stall: MapStall,
    selectedIds: number[]
): StallRenderState {
    if (stall.reserved) return 'reserved'
    if (selectedIds.includes(stall.id)) return 'selected'
    if (stall.type === 'PREMIUM') return 'premium'
    return 'available'
}

// ─── Parse Helpers ────────────────────────────────────────────────────────────

/**
 * Parse a stall's geometry field.
 * Handles posX/posY style and provides defaults.
 */
export function parseGeometry(stall: MapStall): StallGeometry {
    return {
        x: stall.posX ?? 0,
        y: stall.posY ?? 0,
        w: stall.width || 8,
        h: stall.height || 8
    }
}

/**
 * Normalize zones and influences from lists into internal types.
 */
export function normalizeMapData(rawZones: MapZone[], rawInfluences: MapInfluence[], halls: any[] = []): ParsedZones {
    const influences: NormalizedInfluence[] = (rawInfluences ?? []).map(inf => ({
        hallName: inf.hallName,
        id: inf.id.toString(),
        type: inf.type,
        cx: inf.posX,
        cy: inf.posY,
        r: inf.radius,
        intensity: inf.intensity,
        falloff: inf.falloff,
    }))

    const zones: NormalizedZone[] = (rawZones ?? []).map(z => ({
        hallName: z.hallName,
        type: z.type as any,
        x: z.posX,
        y: z.posY,
        w: z.width,
        h: z.height,
        label: z.label ?? z.type,
    }))

    // Add structural constraints from halls
    halls.forEach(hall => {
        if (hall.constraints) {
            hall.constraints.forEach((c: any) => {
                zones.push({
                    hallName: hall.name,
                    type: c.type as any,
                    x: c.posX,
                    y: c.posY,
                    w: c.width,
                    h: c.height,
                    label: c.label ?? c.type,
                });
            });
        }
    });

    return { influences, zones }
}

/**
 * Parse visibility score from "71/100" string or raw number.
 * Returns integer 0–100.
 */
export function parseScore(raw: string | number | undefined | null): number {
    if (raw == null) return 0
    if (typeof raw === 'number') return Math.round(raw)
    const n = parseInt(String(raw).split('/')[0], 10)
    return isNaN(n) ? 0 : n
}

/**
 * Detect implicit aisle columns from stall data.
 * Returns sorted list of x-percentage positions that are gaps (no stalls present).
 * Used to render walkway overlays for missing columns.
 */
export function detectImplicitAisles(stalls: MapStall[], columnWidth = 10): number[] {
    const occupiedX = new Set(
        stalls
            .map(s => parseGeometry(s).x)
            .filter(x => x % columnWidth === 0)
    )

    const aisles: number[] = []
    for (let x = 0; x < 100; x += columnWidth) {
        if (!occupiedX.has(x)) aisles.push(x)
    }
    return aisles
}

/**
 * Format price in LKR with thousands separator.
 * e.g. 1350000 → "13,500" (priceCents / 100)
 */
export function formatPrice(priceCents: number): string {
    return (priceCents / 100).toLocaleString()
}

/**
 * Score → color color token for visual rendering.
 */
export function scoreToColor(score: number): {
    bar: string
    text: string
    label: string
} {
    if (score >= 60) return {
        bar: 'linear-gradient(90deg,#10b981,#34d399)',
        text: 'text-emerald-700',
        label: 'High Visibility',
    }
    if (score >= 30) return {
        bar: 'linear-gradient(90deg,#f59e0b,#fbbf24)',
        text: 'text-amber-700',
        label: 'Moderate Visibility',
    }
    return {
        bar: 'linear-gradient(90deg,#94a3b8,#cbd5e1)',
        text: 'text-slate-500',
        label: 'Standard',
    }
}