import { MapStall, parseScore, formatPrice, scoreToColor } from '../types/stallMap.utils'

// ─── StallTooltip ─────────────────────────────────────────────────────────────
// Renders fixed to the viewport — NOT inside the stall div.
// This prevents any z-index or overflow clipping from the map container.
// Parent passes anchorRect (from getBoundingClientRect) to position it.

interface StallTooltipProps {
  stall: MapStall
  anchorRect: DOMRect | null
}

const TOOLTIP_W = 264
const TOOLTIP_H = 260
const GAP = 10

function getTooltipPosition(anchorRect: DOMRect): { left: number; top: number } {
  // Prefer right of stall; fall back to left if it would clip viewport edge
  let left = anchorRect.right + GAP
  if (left + TOOLTIP_W > window.innerWidth - 8) {
    left = anchorRect.left - TOOLTIP_W - GAP
  }

  // Vertically center on stall, clamp to viewport
  let top = anchorRect.top + anchorRect.height / 2 - TOOLTIP_H / 2
  top = Math.max(8, Math.min(top, window.innerHeight - TOOLTIP_H - 8))

  return { left, top }
}

export function StallTooltip({ stall, anchorRect }: StallTooltipProps) {
  if (!anchorRect) return null

  const { left, top } = getTooltipPosition(anchorRect)
  const score = parseScore(stall.pricingBreakdown?.['Visibility Score'])
  const drivers = stall.pricingBreakdown?.['Value Drivers'] ?? []
  const baseRate = stall.pricingBreakdown?.['Base Rate']
  const { bar: barColor, label: scoreLabel } = scoreToColor(score)

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: TOOLTIP_W,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-stallTooltip"
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-start">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">Bay</div>
          <div className="font-bold text-sm leading-tight">{stall.templateName}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">{stall.hallName?.split(' ').slice(-2).join(' ')}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-slate-400 mb-0.5">Rate</div>
          <div className="font-bold text-sm">{formatPrice(stall.priceCents)}</div>
          <div className="text-[9px] text-slate-400">LKR</div>
        </div>
      </div>

      {/* Visibility score */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Visibility Score
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-400">{scoreLabel}</span>
            <span className="text-xs font-bold text-slate-800">{score}/100</span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, background: barColor }}
          />
        </div>
      </div>

      {/* Value drivers */}
      {drivers.length > 0 && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">
            Why this price
          </div>
          <div className="space-y-1">
            {baseRate && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Base Rate</span>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {formatPrice(baseRate)}
                </span>
              </div>
            )}
            {drivers.slice(0, 4).map((d: { label: string; value: string }, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[10px] text-slate-600">{d.label}</span>
                <span className={`text-[10px] font-semibold tabular-nums ${d.value.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer badges */}
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-2">
        {stall.reserved && (
          <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${stall.occupiedBy === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-slate-800 text-white'}`}>
            {stall.occupiedBy === 'BLOCKED' ? 'Blocked' : 'Reserved'}
          </span>
        )}
        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${stall.type === 'PREMIUM'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-slate-100 text-slate-500'
          }`}>
          {stall.type ?? 'STANDARD'}
        </span>
        {stall.size && (
          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {stall.size}
          </span>
        )}
        {stall.category && stall.category !== 'RETAIL' && (
          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            {stall.category.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  )
}