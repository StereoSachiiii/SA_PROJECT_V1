import { DesignerStall, stallColor, formatPrice } from '../types';

interface DesignerStallItemProps {
    stall: DesignerStall;
    isEditing: boolean;
    onMouseDown: (e: React.MouseEvent, id: string | number, type: 'STALL', itemX: number, itemY: number) => void;
}

export function DesignerStallItem({ stall, isEditing, onMouseDown }: DesignerStallItemProps) {
    return (
        <div
            onMouseDown={e => onMouseDown(e, stall.id, 'STALL', stall.posX || 0, stall.posY || 0)}
            className={`absolute border-2 transition-colors cursor-move flex flex-col items-center justify-center gap-0.5
                ${stallColor(stall.category, isEditing)}
                ${!stall.isAvailable ? 'opacity-40' : 'hover:shadow-md'}
                ${isEditing ? 'z-20 shadow-lg' : 'z-10'}`}
            style={{
                left: `${stall.posX || 0}%`,
                top: `${stall.posY || 0}%`,
                width: `${stall.width || 8}%`,
                height: `${stall.height || 8}%`,
            }}
        >
            <span className="font-black text-[9px] leading-none">{stall.name}</span>
            {stall.width && stall.height && stall.width > 4 && stall.height > 4 && (
                <span className="text-[7px] font-bold opacity-60">{formatPrice(stall.priceCents)}</span>
            )}
        </div>
    );
}
