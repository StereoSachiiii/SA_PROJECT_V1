import { useState, useRef } from 'react';
import { useDesigner } from '../DesignerContext';

export function useDesignerDragging() {
    const {
        stalls,
        setStalls,
        setZones,
        setInfluences,
        setEditingStallId,
        influences,
        calculatePrice
    } = useDesigner();

    const [dragData, setDragData] = useState<{
        id: string | number,
        type: 'STALL' | 'ZONE' | 'INFLUENCE',
        offsetX: number,
        offsetY: number
    } | null>(null);

    const hasMoved = useRef(false);

    const startDragging = (id: string | number, type: 'STALL' | 'ZONE' | 'INFLUENCE', pos: { x: number, y: number }, itemX: number, itemY: number) => {
        hasMoved.current = false;
        setDragData({ id, type, offsetX: pos.x - itemX, offsetY: pos.y - itemY });
    };

    const updateDragging = (pos: { x: number, y: number }) => {
        if (!dragData) return;
        hasMoved.current = true;

        const newX = pos.x - dragData.offsetX;
        const newY = pos.y - dragData.offsetY;

        if (dragData.type === 'STALL') {
            setStalls(prev => prev.map(s => {
                if (s.id === dragData.id) {
                    const movedStall = { ...s, posX: newX, posY: newY };
                    return calculatePrice(movedStall, influences);
                }
                return s;
            }));
        } else if (dragData.type === 'ZONE') {
            setZones(prev => prev.map(z => z.id === dragData.id ? { ...z, posX: newX, posY: newY } : z));
        } else if (dragData.type === 'INFLUENCE') {
            const updatedInfluences = influences.map(inf =>
                inf.id === dragData.id ? { ...inf, posX: newX + inf.radius, posY: newY + inf.radius } : inf
            );
            setInfluences(updatedInfluences);
            setStalls(stalls.map(s => calculatePrice(s, updatedInfluences)));
        }
    };

    const stopDragging = () => {
        // Only open properties modal if it was a click (no movement), not a drag
        if (!hasMoved.current && dragData?.type === 'STALL') {
            setEditingStallId(dragData.id as number);
        }
        setDragData(null);
    };

    return {
        dragData,
        startDragging,
        updateDragging,
        stopDragging
    };
}
