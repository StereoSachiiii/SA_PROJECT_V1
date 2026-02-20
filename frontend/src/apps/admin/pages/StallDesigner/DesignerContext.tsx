import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Hall } from '@/shared/types/api';
import { DesignerStall, DesignerZone, DesignerInfluence, DesignerDrawMode } from './types';

interface DesignerContextType {
    event: Event;
    hall: Hall;
    stalls: DesignerStall[];
    setStalls: React.Dispatch<React.SetStateAction<DesignerStall[]>>;
    zones: DesignerZone[];
    setZones: React.Dispatch<React.SetStateAction<DesignerZone[]>>;
    influences: DesignerInfluence[];
    setInfluences: React.Dispatch<React.SetStateAction<DesignerInfluence[]>>;
    drawMode: DesignerDrawMode;
    setDrawMode: React.Dispatch<React.SetStateAction<DesignerDrawMode>>;
    zoneType: DesignerZone['type'];
    setZoneType: React.Dispatch<React.SetStateAction<DesignerZone['type']>>;
    influenceType: DesignerInfluence['type'];
    setInfluenceType: React.Dispatch<React.SetStateAction<DesignerInfluence['type']>>;
    editingStallId: number | null;
    setEditingStallId: React.Dispatch<React.SetStateAction<number | null>>;
    isDrawing: boolean;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    startPos: { x: number; y: number } | null;
    setStartPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
    currentPos: { x: number; y: number } | null;
    setCurrentPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
    updateStall: (id: number, patch: Partial<DesignerStall>) => void;
    deleteStall: (id: number) => void;
}

const DesignerContext = createContext<DesignerContextType | null>(null);

export function DesignerProvider({
    children,
    event,
    hall,
    initialStalls,
    initialZones = [],
    initialInfluences = []
}: {
    children: ReactNode;
    event: Event;
    hall: Hall;
    initialStalls: DesignerStall[];
    initialZones?: DesignerZone[];
    initialInfluences?: DesignerInfluence[];
}) {
    const [stalls, setStalls] = useState<DesignerStall[]>(initialStalls);
    const [zones, setZones] = useState<DesignerZone[]>(initialZones);
    const [influences, setInfluences] = useState<DesignerInfluence[]>(initialInfluences);
    const [drawMode, setDrawMode] = useState<DesignerDrawMode>('STALL');
    const [zoneType, setZoneType] = useState<DesignerZone['type']>('WALKWAY');
    const [influenceType, setInfluenceType] = useState<DesignerInfluence['type']>('TRAFFIC');
    const [editingStallId, setEditingStallId] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);

    const updateStall = (id: number, patch: Partial<DesignerStall>) => {
        setStalls(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    };

    const deleteStall = (id: number) => {
        setStalls(prev => prev.filter(s => s.id !== id));
        if (editingStallId === id) setEditingStallId(null);
    };

    return (
        <DesignerContext.Provider value={{
            event, hall, stalls, setStalls,
            zones, setZones, influences, setInfluences,
            drawMode, setDrawMode,
            zoneType, setZoneType,
            influenceType, setInfluenceType,
            editingStallId, setEditingStallId,
            isDrawing, setIsDrawing,
            startPos, setStartPos,
            currentPos, setCurrentPos,
            updateStall, deleteStall
        }}>
            {children}
        </DesignerContext.Provider>
    );
}

export function useDesigner() {
    const context = useContext(DesignerContext);
    if (!context) throw new Error('useDesigner must be used within DesignerProvider');
    return context;
}
