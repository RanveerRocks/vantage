import { motion } from 'framer-motion'

interface ReadoutBarProps {
  label: string
  value: number // 0–100
  weight?: number
  detail?: string
}

export function ReadoutBar({ label, value, weight, detail }: ReadoutBarProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-baseline gap-2 text-xs font-medium uppercase tracking-wider text-ink">
          {label}
          {weight !== undefined && (
            <span className="font-mono text-[10px] font-normal normal-case text-slate">
              ×{weight.toFixed(2)}
            </span>
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
