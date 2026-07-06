import { motion } from 'framer-motion'
import type { CountryId } from '../../lib/schemas'

export interface RankedCountry {
  countryId: CountryId
  name: string
  flag: string
  color: string
  score: number
}

interface CountryRankingBarsProps {
  entries: RankedCountry[]
  selectedId: CountryId | null
  onSelect: (id: CountryId) => void
}

export function CountryRankingBars({ entries, selectedId, onSelect }: CountryRankingBarsProps) {
  return (
    <ol className="space-y-1.5">
      {entries.map((entry, index) => (
        <motion.li
          key={entry.countryId}
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        >
          <button
            type="button"
            onClick={() => onSelect(entry.countryId)}
            data-rank-country={entry.countryId}
            aria-label={`${entry.name}: student life index ${entry.score.toFixed(1)}, ranked ${index + 1} of ${entries.length}. Open the factor breakdown.`}
            className={`flex w-full items-center gap-2 rounded-chip border p-2 text-left hover:border-slate sm:gap-3 ${
              selectedId === entry.countryId ? 'border-gold' : 'border-transparent'
            }`}
          >
            <span className="w-4 shrink-0 text-right font-mono text-xs text-slate">
              {index + 1}
            </span>
            <span className="shrink-0 text-base" aria-hidden="true">
              {entry.flag}
            </span>
            <span className="w-20 shrink-0 truncate text-sm sm:w-28">{entry.name}</span>
            <span className="relative h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-hairline/60">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                initial={false}
                animate={{ width: `${entry.score}%` }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            </span>
            <span className="w-11 shrink-0 text-right font-mono text-sm font-medium tabular-nums">
              {entry.score.toFixed(1)}
            </span>
          </button>
        </motion.li>
      ))}
    </ol>
  )
}
