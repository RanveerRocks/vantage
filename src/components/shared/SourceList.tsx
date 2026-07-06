import type { Source } from '../../lib/schemas'

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <p className="text-sm text-slate">No sources recorded yet for this metric.</p>
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <li key={`${source.url}-${source.name}`}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-2 rounded-chip border border-hairline px-2.5 py-1 text-xs text-ultramarine hover:border-ultramarine"
          >
            <span>
              {source.name} <span aria-hidden="true">↗</span>
            </span>
            <span className="font-mono text-[10px] text-slate">{source.lastUpdated}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
