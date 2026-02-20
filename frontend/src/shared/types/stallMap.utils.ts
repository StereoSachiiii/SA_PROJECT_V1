
export interface StallGeometry {
    x: number
    y: number
    w: number
    h: number
}

export interface ValueDriver {
    label: string
    value: string
}

export interface PricingBreakdown {
    'Visibility Score'?: string | number
    'Value Drivers'?: ValueDriver[]
    'Base Rate'?: number
}

export interface MapStall {
    id: number
    templateName: string
    hallName?: string
    priceCents: number
    reserved: boolean
    type?: string
    size?: string
    category?: string
    geometry: StallGeometry | string
    pricingBreakdown?: PricingBreakdown
    occupiedBy?: string | null
}

/**
 * Raw shape of eventMap.zones — this field is a JSON STRING on the root object,
 * NOT a nested object. Must be JSON.parse()'d before use.
 *
 * Coordinate systems inside:
 *   influences → pixel coords against (width × height) canvas
 *   zones.geometry → percentage coords (0–100)
 */
export interface RawZonesJson {
    width: number   // canvas pixel width (e.g. 1000)
    height: number  // canvas pixel height (e.g. 600)
    entrances: Array<{
        id: string
        type: string
        x: number     // pixel
        y: number     // pixel
        w: number     // pixel
        label: string
    }>
    influences: Array<{
        id: string
        type: string
        x: number     // PIXEL — divide by width for percentage
        y: number     // PIXEL — divide by height for percentage
        radius: number // PIXEL — divide by width for percentage
        intensity: number // 0–100
        falloff: string
    }>
    zones: Array<{
        type: 'WALKWAY' | 'STAGE' | 'ENTRANCE'
        geometry: { x: number; y: number; w: number; h: number }  // PERCENTAGE
        metadata?: { label?: string }
    }>
}

/** What the API actually returns */
export interface RawEventMap {
    eventId: number
    eventName: string
    stalls: MapStall[]
    zones: string  // JSON string — NOT a nested object
}

// ─── Normalized Internal Types ────────────────────────────────────────────────

/** Influence circle with coordinates normalized to 0–100 percentage space */
export interface NormalizedInfluence {
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
    type: 'WALKWAY' | 'STAGE' | 'ENTRANCE'
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
 * Handles both pre-parsed objects and JSON strings.
 */
export function parseGeometry(raw: StallGeometry | string | null | undefined): StallGeometry {
    if (!raw) return { x: 0, y: 0, w: 8, h: 8 }
    if (typeof raw === 'string') {
        try { return JSON.parse(raw) }
        catch { return { x: 0, y: 0, w: 8, h: 8 } }
    }
    return raw
}

/**
 * Parse eventMap.zones JSON string → normalized percentage-based shapes.
 *
 * CRITICAL COORDINATE NORMALIZATION:
 * - Influence x/y/radius are in PIXEL space (against width×height canvas)
 * - They must be divided by canvas dimensions to produce percentages
 * - Zone geometries are already percentage-based (just need .geometry unwrapping)
 */
export function parseZones(zonesStr: string | null | undefined): ParsedZones {
    if (!zonesStr) return { influences: [], zones: [] }

    let raw: RawZonesJson
    try { raw = JSON.parse(zonesStr) }
    catch { return { influences: [], zones: [] } }

    const W = raw.width || 1000
    const H = raw.height || 600

    const influences: NormalizedInfluence[] = (raw.influences ?? []).map(inf => ({
        id: inf.id,
        type: inf.type,
        cx: (inf.x / W) * 100,
        cy: (inf.y / H) * 100,
        r: (inf.radius / W) * 100,
        intensity: inf.intensity,
        falloff: inf.falloff,
    }))

    const zones: NormalizedZone[] = (raw.zones ?? []).map(z => ({
        type: z.type,
        x: z.geometry.x,
        y: z.geometry.y,
        w: z.geometry.w,
        h: z.geometry.h,
        label: z.metadata?.label ?? z.type,
    }))

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
            .map(s => parseGeometry(s.geometry).x)
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
 * Score → color token for visual rendering.
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