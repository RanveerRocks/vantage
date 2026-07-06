import { Link, useParams } from 'react-router-dom'
import { findDegree } from '../lib/degrees'

const TABS = ['Career & Visa', 'Student Life', 'Pathways', 'True Cost', 'Emerging']

export function Explore() {
  const { degreeId } = useParams()
  const degree = findDegree(degreeId)

  if (!degree) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          We don&rsquo;t have that degree
        </h1>
        <p className="mt-3 max-w-xl text-slate">
          &ldquo;{degreeId}&rdquo; isn&rsquo;t one of the eight degrees Vantage covers. Head back to
          the home page and pick one from the list.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-chip border border-hairline px-4 py-2 text-sm text-ultramarine hover:border-ultramarine"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">Exploring</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {degree.name}
      </h1>
      <p className="mt-1 font-mono text-sm text-slate">{degree.id}</p>

      <div className="mt-8 flex flex-wrap gap-2" aria-label="Workspace tabs (coming soon)">
        {TABS.map((tab) => (
          <span
            key={tab}
            className="rounded-chip border border-hairline px-3 py-1.5 text-sm text-slate"
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-dashed border-hairline p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-slate">
          Workspace under construction — components arrive in later phases
        </p>
      </div>
    </div>
  )
}
