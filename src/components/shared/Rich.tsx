import { Fragment, type ReactNode } from 'react'

// Auto-emphasise the facts that matter in a sentence: currency amounts,
// durations, percentages, and large numbers, plus explicit **bold** markers.
// Keeps prose from reading as flat grey by making the hard numbers pop.
const SRC = [
  String.raw`\*\*[^*]+\*\*`,
  String.raw`\$[\d,]+(?:\.\d+)?`,
  String.raw`₹[\d.,]+\s?L?`,
  String.raw`(?:CAD|AUD|EUR|GBP|SGD|USD)\s?[\d,]+(?:\.\d+)?`,
  String.raw`[\d,]+(?:\.\d+)?[-\s]?(?:plus\s)?(?:dollars|euros|pounds)`,
  String.raw`[\d,]+(?:[.,]\d+)?\s?(?:years?|months?|weeks?|days?|hours?|yr|%|per cent)`,
  String.raw`\d{1,3}(?:,\d{3})+`,
].join('|')
const SPLIT = new RegExp(`(${SRC})`, 'g')
const MATCH = new RegExp(`^(?:${SRC})$`)

export function Rich({ text, className }: { text: string; className?: string }): ReactNode {
  const parts = text.split(SPLIT)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null
        if (MATCH.test(part)) {
          const inner = part.startsWith('**') ? part.slice(2, -2) : part
          return (
            <strong key={i} className="font-semibold text-ink">
              {inner}
            </strong>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </span>
  )
}
