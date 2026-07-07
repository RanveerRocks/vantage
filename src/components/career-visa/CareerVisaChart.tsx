import { useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  CartesianGrid,
  Customized,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts'
import type { CountryId } from '../../lib/schemas'

export interface ChartPoint {
  countryId: CountryId
  code: string
  flag: string
  name: string
  color: string
  x: number
  y: number
}

const INK = '#111826'
const SLATE = '#5B6472'
const HAIRLINE = '#E3E6E1'
const ULTRAMARINE = '#2440C9'
const GOLD = '#B98A1F'
const MONO = '"IBM Plex Mono", ui-monospace, monospace'
const TICKS = [0, 25, 50, 75, 100]
const TICK_STYLE = { fill: SLATE, fontSize: 11, fontFamily: MONO }

// Recharts passes its internal chart state to <Customized>; we only need the
// axis scales and the plot-area offset.
interface ChartInternals {
  xAxisMap?: Record<string, { scale?: (value: number) => number }>
  yAxisMap?: Record<string, { scale?: (value: number) => number }>
  offset?: { top: number; left: number; width: number; height: number }
}

function getPlotGeometry(raw: unknown) {
  const { xAxisMap, yAxisMap, offset } = raw as ChartInternals
  const xScale = xAxisMap ? Object.values(xAxisMap)[0]?.scale : undefined
  const yScale = yAxisMap ? Object.values(yAxisMap)[0]?.scale : undefined
  if (!xScale || !yScale || !offset) return null
  return { xScale, yScale, offset }
}

const QUADRANT_LABELS: { xSide: 'min' | 'max'; ySide: 'min' | 'max'; text: string }[] = [
  { xSide: 'max', ySide: 'max', text: 'strong demand · strong return' },
  { xSide: 'min', ySide: 'max', text: 'soft demand · strong return' },
  { xSide: 'max', ySide: 'min', text: 'strong demand · soft return' },
  { xSide: 'min', ySide: 'min', text: 'soft demand · soft return' },
]

interface CountryDotProps {
  cx: number
  cy: number
  point: ChartPoint
  index: number
  sighted: boolean
  selected: boolean
  onHover: (id: CountryId | null) => void
  onSelect: (id: CountryId) => void
}

function CountryDot({ cx, cy, point, index, sighted, selected, onHover, onSelect }: CountryDotProps) {
  return (
    <motion.g
      initial={false}
      animate={{ x: cx, y: cy }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ cursor: 'pointer' }}
      data-country={point.countryId}
      onMouseEnter={() => onHover(point.countryId)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(point.countryId)}
    >
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20, delay: index * 0.04 }}
      >
        <motion.g animate={{ scale: sighted ? 1.12 : 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
          {selected ? <circle r={19.5} fill="none" stroke={GOLD} strokeWidth={2.5} /> : null}
          <circle r={14} fill={point.color} stroke="#FFFFFF" strokeWidth={1.5} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={13} aria-hidden="true">
            {point.flag}
          </text>
          <text
            y={27}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={10}
            fontWeight={600}
            fill={INK}
            paintOrder="stroke"
            stroke="#FFFFFF"
            strokeWidth={3}
          >
            {point.code}
          </text>
        </motion.g>
      </motion.g>
    </motion.g>
  )
}

interface CareerVisaChartProps {
  degreeName: string
  points: ChartPoint[]
  selectedId: CountryId | null
  onSelect: (id: CountryId | null) => void
}

export function CareerVisaChart({ degreeName, points, selectedId, onSelect }: CareerVisaChartProps) {
  const reducedMotion = useReducedMotion() ?? false
  const [hoveredId, setHoveredId] = useState<CountryId | null>(null)
  const [focusedId, setFocusedId] = useState<CountryId | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const sightedId = hoveredId ?? focusedId
  const sightedPoint = points.find((p) => p.countryId === sightedId) ?? null

  // Keyboard order follows the X axis, left to right.
  const orderedIds = useMemo(
    () => [...points].sort((a, b) => a.x - b.x).map((p) => p.countryId),
    [points],
  )

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const current = focusedId ?? selectedId ?? orderedIds[0] ?? null
    if (!current) return
    const index = orderedIds.indexOf(current)
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        setFocusedId(orderedIds[Math.min(orderedIds.length - 1, index + 1)])
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        setFocusedId(orderedIds[Math.max(0, index - 1)])
        break
      case 'Home':
        event.preventDefault()
        setFocusedId(orderedIds[0])
        break
      case 'End':
        event.preventDefault()
        setFocusedId(orderedIds[orderedIds.length - 1])
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        setFocusedId(current)
        onSelect(current)
        break
      case 'Escape':
        onSelect(null)
        break
    }
  }

  const renderDot = (props: unknown) => {
    const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: ChartPoint }
    if (cx === undefined || cy === undefined || !payload) return <g />
    const index = points.findIndex((p) => p.countryId === payload.countryId)
    return (
      <CountryDot
        cx={cx}
        cy={cy}
        point={payload}
        index={index}
        sighted={sightedId === payload.countryId}
        selected={selectedId === payload.countryId}
        onHover={setHoveredId}
        onSelect={onSelect}
      />
    )
  }

  const renderQuadrantLabels = (raw: unknown) => {
    const geometry = getPlotGeometry(raw)
    if (!geometry) return <g />
    const { offset } = geometry
    // The four labels collide on narrow plots; the quadrant hairlines carry
    // the meaning on their own there.
    if (offset.width < 420) return <g />
    return (
      <g pointerEvents="none" aria-hidden="true">
        {QUADRANT_LABELS.map(({ xSide, ySide, text }) => (
          <text
            key={text}
            x={xSide === 'min' ? offset.left + 10 : offset.left + offset.width - 10}
            y={ySide === 'max' ? offset.top + 16 : offset.top + offset.height - 10}
            textAnchor={xSide === 'min' ? 'start' : 'end'}
            fontSize={11}
            fill={SLATE}
            fillOpacity={0.8}
            style={{ fontVariant: 'small-caps', letterSpacing: '0.08em' }}
          >
            {text}
          </text>
        ))}
      </g>
    )
  }

  // The sightline crosshair: thin lines from the sighted dot to both axes,
  // with mono score readouts at the margins.
  const renderCrosshair = (raw: unknown) => {
    const geometry = getPlotGeometry(raw)
    if (!geometry || !sightedPoint) return <g />
    const { xScale, yScale, offset } = geometry
    const cx = xScale(sightedPoint.x)
    const cy = yScale(sightedPoint.y)
    const axisX = offset.left
    const axisY = offset.top + offset.height
    const draw = reducedMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.22, ease: 'easeOut' as const },
        }
    return (
      <g pointerEvents="none">
        <motion.line key={`h-${sightedPoint.countryId}`} {...draw} x1={cx} y1={cy} x2={axisX} y2={cy} stroke={ULTRAMARINE} strokeWidth={1} />
        <motion.line key={`v-${sightedPoint.countryId}`} {...draw} x1={cx} y1={cy} x2={cx} y2={axisY} stroke={ULTRAMARINE} strokeWidth={1} />
        <text
          x={axisX - 6}
          y={cy}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily={MONO}
          fontSize={11}
          fontWeight={600}
          fill={ULTRAMARINE}
          paintOrder="stroke"
          stroke="#FFFFFF"
          strokeWidth={4}
        >
          {sightedPoint.y.toFixed(1)}
        </text>
        <text
          x={cx}
          y={axisY + 18}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={11}
          fontWeight={600}
          fill={ULTRAMARINE}
          paintOrder="stroke"
          stroke="#FFFFFF"
          strokeWidth={4}
        >
          {sightedPoint.x.toFixed(1)}
        </text>
      </g>
    )
  }

  const announcement = sightedPoint
    ? `${sightedPoint.name}: career and visa score ${sightedPoint.x.toFixed(0)}, ROI score ${sightedPoint.y.toFixed(0)}. Press Enter for the full breakdown.`
    : ''

  return (
    <div>
      <div className="flex">
        <span className="flex flex-col items-center justify-center gap-1.5 pr-1" aria-hidden="true">
          <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
            <path d="M4 9V1M4 1L1 4M4 1l3 3" stroke="#5B6472" strokeWidth="1.2" />
          </svg>
          <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.18em] text-slate [writing-mode:vertical-rl]">
            ROI score
          </span>
        </span>
        <div
          ref={wrapperRef}
          role="application"
          aria-roledescription="scatter chart"
          aria-label={`Career and visa landscape for ${degreeName}. Use the arrow keys to move between countries and Enter to open a country's details.`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedId((id) => id ?? orderedIds[0] ?? null)}
          onBlur={() => setFocusedId(null)}
          className="h-[380px] min-w-0 flex-1 rounded-chip sm:h-[470px]"
        >
          {/* The SVG is decorative for AT: the application wrapper, keyboard
              nav, and live region are the accessible interface. */}
          <div className="h-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, bottom: 6, left: 0 }}>
                <CartesianGrid stroke={HAIRLINE} strokeWidth={1} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 100]}
                  ticks={TICKS}
                  tick={TICK_STYLE}
                  tickLine={false}
                  axisLine={{ stroke: HAIRLINE }}
                  tickMargin={8}
                  height={28}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  domain={[0, 100]}
                  ticks={TICKS}
                  tick={TICK_STYLE}
                  tickLine={false}
                  axisLine={{ stroke: HAIRLINE }}
                  tickMargin={6}
                  width={40}
                />
                <ReferenceLine x={50} stroke={INK} strokeOpacity={0.22} />
                <ReferenceLine y={50} stroke={INK} strokeOpacity={0.22} />
                <Customized component={renderQuadrantLabels} />
                <Customized component={renderCrosshair} />
                <Scatter data={points} isAnimationActive={false} shape={renderDot} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-slate" aria-hidden="true">
        Career &amp; visa score →
      </p>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}
