import { StallSize, StallCategory } from '@/shared/types/api';

export type DesignerDrawMode = 'STALL' | 'ZONE' | 'INFLUENCE';

export interface DesignerZone {
    id: string; // usually UUID
    type: 'WALKWAY' | 'STAGE' | 'ENTRANCE';
    geometry: { x: number; y: number; w: number; h: number };
    label: string;
}

export interface DesignerInfluence {
    id: string;
    type: 'NOISE' | 'TRAFFIC' | 'FACILITY';
    x: number; // percentage cx
    y: number; // percentage cy
    radius: number; // percentage r
    intensity: number; // 0-100
    falloff: 'linear' | 'exponential';
}

export interface DesignerStall {
    id: number;
    name: string;
    geometry: { x: number; y: number; w: number; h: number };
    priceCents: number;
    size: StallSize;
    category: StallCategory;
    isAvailable: boolean;
    sqFt?: number;
}

export function parseGeometry(g: any): { x: number; y: number; w: number; h: number } {
    if (!g) return { x: 0, y: 0, w: 5, h: 5 };
    if (typeof g === 'string') {
        try { return JSON.parse(g); } catch { return { x: 0, y: 0, w: 5, h: 5 }; }
    }
    return g;
}

export function getDrawRect(start: { x: number; y: number }, end: { x: number; y: number }) {
    return {
        x: Math.min(start.x, end.x), y: Math.min(start.y, end.y),
        w: Math.abs(end.x - start.x), h: Math.abs(end.y - start.y),
    };
}

export function toPercent(e: React.MouseEvent, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
}

export function stallColor(cat: StallCategory, isSelected: boolean): string {
    if (isSelected) return 'bg-blue-100 border-blue-500 text-blue-800';
    switch (cat) {
        case 'FOOD': return 'bg-emerald-50 border-emerald-300 text-emerald-700';
        case 'SPONSOR': return 'bg-violet-50 border-violet-300 text-violet-700';
        case 'ANCHOR': return 'bg-amber-50 border-amber-300 text-amber-700';
        default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
}

export const formatPrice = (cents: number) => `LKR ${(cents / 100).toLocaleString()}`;
