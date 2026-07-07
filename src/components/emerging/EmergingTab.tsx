import { loadData } from '../../lib/data'
import type { Degree } from '../../lib/degrees'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { SourceList } from '../shared/SourceList'

export function EmergingTab({ degree }: { degree: Degree }) {
  const data = loadData()
  const cards = data.emerging.filter((destination) => destination.degreeId === degree.id)
  const anySample = cards.some((destination) => destination.pitch.includes('[Sample]'))

  return (
    <section aria-labelledby="emerging-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="emerging-heading" className="font-display text-xl font-semibold tracking-tight">
            Beyond the usual eight
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Under-the-radar destinations worth a look for {degree.name} — deliberately lighter
            than the main eight: a pitch and a place to start reading, not a full comparison.
          </p>
        </div>
        {anySample && <ConfidenceBadge confidence="placeholder" />}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((destination) => (
          <article
            key={destination.country}
            className="rounded-card border border-hairline bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {destination.flag}
              </span>
              <h3 className="font-medium text-ink">{destination.country}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate">{destination.pitch}</p>
            <div className="mt-3">
              <SourceList sources={destination.links} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
