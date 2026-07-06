import { motion } from 'framer-motion'

interface ReadoutBarProps {
  label: string
  value: number // 0–100
  tag?: string // small mono annotation next to the label, e.g. "×0.35" or "w 3"
  detail?: string
  dimmed?: boolean
}

export function ReadoutBar({ label, value, tag, detail, dimmed = false }: ReadoutBarProps) {
  return (
    <div className={dimmed ? 'opacity-50' : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-baseline gap-2 text-xs font-medium uppercase tracking-wider text-ink">
          {label}
          {tag !== undefined && (
            <span className="font-mono text-[10px] font-normal normal-case text-slate">{tag}</span>
          )}
        </span>
        <span className="font-mono text-sm font-semibold tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-hairline">
        <motion.div
          className="h-full origin-left rounded-full bg-ultramarine"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
      {detail !== undefined && <p className="mt-1 font-mono text-[11px] text-slate">{detail}</p>}
    </div>
  )
}
