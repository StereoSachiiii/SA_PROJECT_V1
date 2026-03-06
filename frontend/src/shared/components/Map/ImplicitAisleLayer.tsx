import { useMemo } from 'react'
import { MapStall, detectImplicitAisles } from '../../types/stallMap.utils'

interface ImplicitAisleLayerProps {
    stalls: MapStall[]
}

export function ImplicitAisleLayer({ stalls }: ImplicitAisleLayerProps) {
    const aisleXPositions = useMemo(() => detectImplicitAisles(stalls), [stalls])

    return (
        <>
            {aisleXPositions.map((x: number) => (
                <div
                    key={x}
                    className="absolute top-0 h-full pointer-events-none"
                    style={{
                        left: `${x}%`,
                        width: '10%',
                        zIndex: 2,
                        background: 'repeating-linear-gradient(90deg,rgba(148,163,184,0.07) 0,rgba(148,163,184,0.07) 1px,transparent 1px,transparent 20px)',
                        borderLeft: '1px dashed rgba(148,163,184,0.3)',
                        borderRight: '1px dashed rgba(148,163,184,0.3)',
                    }}
                />
            ))}
        </>
    )
}
