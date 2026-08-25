import type { Confidence } from '../../lib/schemas'

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  if (confidence === 'placeholder') {
    return (
      <span className="inline-flex items-center rounded-chip border border-gold/50 bg-gold/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-gold-deep">
        Sample data
      </span>
    )
  }
  // Curated data (high/medium/low) shows no badge; the chip is reserved as a
  // visible warning for not-yet-curated "Sample data" only.
  return null
}
