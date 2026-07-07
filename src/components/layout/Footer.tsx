import { Link } from 'react-router-dom'
import { loadData } from '../../lib/data'

export function Footer() {
  const { config } = loadData()
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-slate">
          Data current as of <span className="font-mono text-xs">{config.ratesLastUpdated}</span>.
          Informational only — verify with official sources before deciding.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/about" className="rounded-chip text-sm text-slate hover:text-ink">
            About
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-slate">
            Curated · not live
          </span>
        </div>
      </div>
    </footer>
  )
}
