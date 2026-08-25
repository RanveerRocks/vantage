import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { firstYearCostUsd } from '../../lib/cost'
import { formatMoney } from '../../lib/currency'
import { loadData } from '../../lib/data'
import type { TrueCost } from '../../lib/schemas'
import { useVantageStore } from '../../lib/store'
import { Rich } from '../shared/Rich'
import { SourceList } from '../shared/SourceList'

const ACCENT = '#DB2777'

const CATEGORIES = [
  { key: 'tuitionPerYearUsd', label: 'Tuition', cadence: 'yr', color: '#2440C9' },
  { key: 'livingPerYearUsd', label: 'Living', cadence: 'yr', color: '#0EA5B7' },
  { key: 'insurancePerYearUsd', label: 'Insurance', cadence: 'yr', color: '#6D28D9' },
  { key: 'flightsPerYearUsd', label: 'Flights', cadence: 'yr', color: '#F59E0B' },
  { key: 'visaFeesOneTimeUsd', label: 'Visa fees', cadence: 'once', color: '#EC4E86' },
] as const satisfies readonly {
  key: keyof TrueCost
  label: string
  cadence: string
  color: string
}[]

function Donut({ segments, size = 128, stroke = 16 }: { segments: { value: number; color: string }[]; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F5" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * c
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${Math.max(len - 2, 0)} ${c - Math.max(len - 2, 0)}`}
              strokeDashoffset={-offset}
            />
          )
          offset += len
          return el
        })}
      </g>
    </svg>
  )
}

export function TrueCostTab() {
  const data = loadData()
  const currency = useVantageStore((state) => state.currency)
  const rate = data.config.usdToInr

  const rows = useMemo(
    () =>
      data.trueCost
        .map((record) => ({
          record,
          country: data.countries.find((country) => country.id === record.countryId),
          total: firstYearCostUsd(record),
        }))
        .sort((a, b) => a.total - b.total),
    [data],
  )

  return (
    <section aria-labelledby="true-cost-heading">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
        <h2 id="true-cost-heading" className="font-display text-2xl font-semibold tracking-tight text-ink">
          True-Cost View
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
        The <strong className="text-ink">real first-year cost</strong> of studying in each country,
        broken into where the money actually goes: tuition, living, insurance, and flights each
        year, plus one-time visa fees. Sorted <strong className="text-ink">cheapest first</strong>,
        and every card flags the fees families routinely overlook.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {rows.map(({ record, country, total }, index) => {
          const segments = CATEGORIES.map((c) => ({ value: record[c.key], color: c.color }))
          const biggest = CATEGORIES.reduce((a, b) => (record[a.key] >= record[b.key] ? a : b))
          return (
            <article
              key={record.countryId}
              data-cost-country={record.countryId}
              className="rounded-card border border-hairline bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" aria-hidden="true">
                    {country?.flag}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-tight text-ink">{country?.name}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate">
                      #{index + 1} cheapest
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-5">
                <div className="relative shrink-0">
                  <Donut segments={segments} />
                  <div className="absolute inset-0 grid place-content-center text-center">
                    <span className="font-mono text-base font-semibold tabular-nums text-ink">
                      {formatMoney(total, currency, rate)}
                    </span>
                    <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-slate">
                      first year
                    </span>
                  </div>
                </div>

                <dl className="min-w-0 flex-1 space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.key} className="flex items-center gap-2 text-xs">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                      <dt className="flex-1 truncate text-slate">
                        {cat.label} <span className="text-[10px] text-slate/70">/ {cat.cadence}</span>
                      </dt>
                      <dd className="font-mono font-medium tabular-nums text-ink">
                        {formatMoney(record[cat.key], currency, rate)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="mt-4 rounded-chip bg-paper px-3 py-2 text-xs text-slate">
                Biggest line item: <strong className="text-ink">{biggest.label}</strong> at{' '}
                <strong className="text-ink">{formatMoney(record[biggest.key], currency, rate)}</strong>.
              </p>

              <div className="mt-5 border-t border-hairline pt-4">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: ACCENT }}
                >
                  What families miss
                </p>
                <ul className="mt-2.5 space-y-2.5">
                  {record.hiddenNotes.map((note) => (
                    <li key={note} className="flex gap-2.5">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden="true"
                      />
                      <Rich text={note} className="text-[13px] leading-relaxed text-slate" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-hairline pt-3">
                <SourceList sources={record.sources} />
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-slate">
        First-year estimate only. Full-degree totals depend on programme length. Switch ₹/$ in the
        header.{' '}
        <Link to="/methodology" className="font-medium text-ultramarine underline underline-offset-2">
          How these are computed
        </Link>
      </p>
    </section>
  )
}
