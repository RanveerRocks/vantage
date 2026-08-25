import { loadData } from '../../lib/data'
import type { Degree } from '../../lib/degrees'
import { Rich } from '../shared/Rich'
import { SourceList } from '../shared/SourceList'

const ACCENT = '#C2410C'
// A vivid accent cycled across the destination cards.
const CARD_ACCENTS = ['#2440C9', '#0E7490', '#6D28D9', '#DB2777', '#C2410C', '#047857']

export function EmergingTab({ degree }: { degree: Degree }) {
  const data = loadData()
  const cards = data.emerging.filter((destination) => destination.degreeId === degree.id)

  return (
    <section aria-labelledby="emerging-heading">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
        <h2 id="emerging-heading" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Beyond the usual eight
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
        <strong className="text-ink">Under-the-radar destinations</strong> worth a look for{' '}
        <strong className="text-ink">{degree.name}</strong>. Deliberately lighter than the main
        eight, each is a quick pitch and a place to start reading, not a full comparison, chosen for
        where this field is genuinely strong.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((destination, index) => {
          const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
          return (
            <article
              key={destination.country}
              style={{ ['--accent' as string]: accent }}
              className="group relative flex flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_-14px_var(--accent)]"
            >
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: `linear-gradient(180deg, ${accent}16, #ffffff 92%)` }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-content-center rounded-full bg-white text-2xl shadow-soft ring-1"
                  style={{ ['--tw-ring-color' as string]: `${accent}40` }}
                  aria-hidden="true"
                >
                  {destination.flag}
                </span>
                <div className="min-w-0">
                  <span
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: accent }}
                  >
                    Hidden gem
                  </span>
                  <h3 className="truncate font-semibold text-ink">{destination.country}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4">
                <Rich text={destination.pitch} className="text-sm leading-relaxed text-slate" />
                <div className="mt-auto pt-3.5">
                  <SourceList sources={destination.links} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
