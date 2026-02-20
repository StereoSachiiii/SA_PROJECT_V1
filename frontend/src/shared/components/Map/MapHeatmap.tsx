import { NormalizedInfluence } from '../../types/stallMap.utils';

interface MapHeatmapProps {
    influences: NormalizedInfluence[];
}

function influenceColor(type: string): string {
    switch (type) {
        case 'NOISE': return '#ef4444';      // red-500
        case 'FACILITY': return '#3b82f6';   // blue-500
        case 'TRAFFIC': return '#22c55e';    // green-500
        default: return '#10b981';            // emerald
    }
}

export default function MapHeatmap({ influences }: MapHeatmapProps) {
    if (influences.length === 0) {
        return null;
    }

    return (
        <svg
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
                zIndex: 12,
                opacity: 1,
                mixBlendMode: 'multiply',
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            data-testid="heatmap-svg"
        >
            <defs>
                {influences.map((inf, idx) => {
                    const color = influenceColor(inf.type);
                    const peak = Math.min((inf.intensity / 100) * 0.95, 1.0);
                    const mid = peak * 0.4;

                    return (
                        <radialGradient key={`grad-${idx}`} id={`influence-grad-${idx}`}>
                            <stop offset="0%" stopColor={color} stopOpacity={peak} />
                            <stop offset="30%" stopColor={color} stopOpacity={mid} />
                            <stop offset="70%" stopColor={color} stopOpacity={mid * 0.3} />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </radialGradient>
                    );
                })}
            </defs>

            {influences.map((inf, idx) => {
                const color = influenceColor(inf.type);
                return (
                    <g key={`influence-${idx}`}>
                        <circle
                            cx={inf.cx}
                            cy={inf.cy}
                            r={inf.r}
                            fill={`url(#influence-grad-${idx})`}
                            style={{
                                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                            }}
                        />
                        <circle
                            cx={inf.cx}
                            cy={inf.cy}
                            r={inf.r}
                            fill="none"
                            stroke={color}
                            strokeWidth="0.8"
                            strokeOpacity="0.6"
                            data-testid={`influence-circle-${idx}`}
                        />
                    </g>
                );
            })}
        </svg>
    );
}
