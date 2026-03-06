import { DesignerStall, DesignerInfluence } from '../types';

const MAX_SCORE = 100;
const MIN_SCORE = 5;
const DEFAULT_BASE_SCORE = 50;
const EDGE_DISTANCE_PENALTY = 5;

export function usePriceCalculation() {

    const calculatePrice = (
        stall: DesignerStall,
        influences: DesignerInfluence[]
    ): DesignerStall => {
        // Start from the default baseline score
        let calculatedScore = DEFAULT_BASE_SCORE;

        const sX = stall.posX;
        const sY = stall.posY;
        const sW = stall.width;
        const sH = stall.height;

        const stallCenterX = sX + (sW / 2);
        const stallCenterY = sY + (sH / 2);

        // Map Influence calculation — contributions adjust score UP from baseline
        if (influences && influences.length > 0) {
            for (const influence of influences) {
                const infX = influence.posX;
                const infY = influence.posY;
                const radius = influence.radius;
                const intensity = influence.intensity;
                const falloff = influence.falloff;

                const dist = Math.sqrt(Math.pow(stallCenterX - infX, 2) + Math.pow(stallCenterY - infY, 2));

                if (dist < radius) {
                    let factor = 1.0 - (dist / radius);
                    if (falloff.toUpperCase() === 'EXPONENTIAL') {
                        factor = Math.pow(factor, 2);
                    }

                    const contribution = Math.floor(intensity * factor);
                    if (contribution > 0) {
                        calculatedScore += contribution;
                    }
                }
            }
        }

        // Apply Edge Distance Penalty (stalls near edges of the layout)
        if (sX <= 2 || sY <= 2 || sX + sW >= 98 || sY + sH >= 98) {
            calculatedScore -= EDGE_DISTANCE_PENALTY;
        }

        calculatedScore = Math.min(MAX_SCORE, Math.max(MIN_SCORE, calculatedScore));

        // Size-based pricing: scale relative to a standard stall area (8% × 8% = 64 sq%)
        const area = sW * sH;
        const REFERENCE_AREA = 64.0;
        const sizeFactor = Math.max(0.5, Math.min(2.5, area / REFERENCE_AREA));

        const scoreFactor = 1.0 + (calculatedScore - DEFAULT_BASE_SCORE) / 100.0;
        const finalPriceCents = Math.floor(stall.baseRateCents * scoreFactor * sizeFactor);

        return {
            ...stall,
            priceCents: finalPriceCents,
            pricingVersion: `AUTO_V2_NORM_${calculatedScore}`
        };
    };

    return { calculatePrice };
}
