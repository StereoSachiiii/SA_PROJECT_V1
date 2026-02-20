import { memo, useState } from 'react'
import type { Stall } from '../types'
import StallActionButtons from './StallActionButtons'
import StallDetailsOverlay from './StallDetailsOverlay'

interface StallItemProps {
    stall: Stall;
    isSelected: boolean;
    onToggle: (id: number, reserved: boolean) => void;
}

function StallItem({ stall, isSelected, onToggle }: StallItemProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    // Determine Grid Spans based on Size OR direct DB cols/rows
    const getSizeClasses = () => {
        // Preferred: Use the explicit spans from the DB
        if (stall.colSpan && stall.rowSpan) {
            const colMap: { [key: number]: string } = { 1: 'col-span-1', 2: 'col-span-2', 4: 'col-span-4' };
            const rowMap: { [key: number]: string } = { 1: 'row-span-1', 2: 'row-span-2' };

            const colClass = colMap[stall.colSpan] || `col-span-${stall.colSpan}`;
            const rowClass = rowMap[stall.rowSpan] || `row-span-${stall.rowSpan}`;

            return `${colClass} ${rowClass}`;
        }

        // Fallback: Size-based
        switch (stall.size) {
            case 'LARGE': return 'col-span-2 row-span-2'; // 2x2
            case 'MEDIUM': return 'col-span-2';           // 2x1
            case 'SMALL': default: return 'col-span-1';
        }
    }

    const baseClasses = `
        relative rounded-xl border-2 transition-all duration-300 
        flex flex-col justify-center items-center 
        min-h-[100px] shadow-sm overflow-hidden group
        ${getSizeClasses()}
    `;

    let stateClasses = "";

    if (stall.reserved) {
        stateClasses = "bg-gray-100 border-gray-200 cursor-not-allowed opacity-80";
    } else if (isSelected) {
        stateClasses = "bg-secondary border-primary-500 text-primary-400 shadow-glow-gold scale-[1.02] z-10 ring-2 ring-primary-500 ring-offset-2";
    } else {
        stateClasses = `bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:shadow-md cursor-pointer ${isFocused ? 'scale-[1.02] z-20' : ''}`;
    }

    const hatchedStyle = stall.reserved ? {
        backgroundImage: 'repeating-linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 50%, #f3f4f6 50%, #f3f4f6 75%, transparent 75%, transparent)',
        backgroundSize: '10px 10px'
    } : {};

    const handleFocus = () => {
        if (stall.reserved || isSelected) return
        setIsFocused(true)
    }

    const handleBlur = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsFocused(false)
        setShowDetails(false)
    }

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsFocused(false)
        onToggle(stall.id, stall.reserved)
    }

    const handleShowDetails = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDetails(true)
    }

    return (
        <div
            onClick={() => !stall.reserved && !isSelected && handleFocus()}
            onMouseLeave={() => !showDetails && setIsFocused(false)}
            className={`${baseClasses} ${stateClasses}`}
            style={hatchedStyle}
            title={stall.reserved ? `Reserved by ${stall.occupiedBy || 'another user'}` : 'Available'}
        >
            {/* Background Content */}
            <div className={`transition-all duration-300 flex flex-col items-center ${isFocused ? 'blur-md brightness-50' : ''}`}>
                <div className="font-bold text-lg tracking-tight">{stall.name}</div>
                <div className={`text-[10px] uppercase tracking-widest mt-1 font-bold ${isSelected ? 'text-primary-500/80' : 'text-gray-400'}`}>
                    {stall.size}
                </div>
            </div>

            {/* Status Indicator Dot */}
            {!stall.reserved && !isFocused && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isSelected ? 'bg-primary-500 animate-pulse' : 'bg-green-400'}`}></div>
            )}

            {/* Focus Overlay Actions */}
            {isFocused && !showDetails && !stall.reserved && !isSelected && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <StallActionButtons
                        onBook={handleSelect}
                        onDetails={handleShowDetails}
                    />
                </div>
            )}

            {/* Details Modal (Portal-based) */}
            {showDetails && (
                <StallDetailsOverlay
                    stall={stall}
                    onClose={handleBlur}
                />
            )}

            {/* Reserved Overlay */}
            {stall.reserved && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                    <span className="bg-gray-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Reserved</span>
                </div>
            )}

            {/* Selected Overlay Indicator */}
            {isSelected && (
                <div
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(stall.id, false)
                    }}
                    className="absolute top-2 right-2 cursor-pointer w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-secondary shadow-lg hover:bg-black hover:text-white transition-all z-20"
                >
                    ✕
                </div>
            )}
        </div>
    )
}

export default memo(StallItem);
