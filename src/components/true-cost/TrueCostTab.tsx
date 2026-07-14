import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { firstYearCostUsd } from '../../lib/cost'
import { formatMoney } from '../../lib/currency'
import { loadData } from '../../lib/data'
import type { CountryId, TrueCost } from '../../lib/schemas'
import { useVantageStore } from '../../lib/store'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { SourceList } from '../shared/SourceList'

const CATEGORIES = [
  { key: 'tuitionPerYearUsd', label: 'Tuition', cadence: 'per year', color: '#2440C9' },
  { key: 'livingPerYearUsd', label: 'Living', cadence: 'per year', color: '#6577D8' },
  { key: 'insurancePerYearUsd', label: 'Insurance', cadence: 'per year', color: '#93A0E8' },
  { key: 'flightsPerYearUsd', label: 'Flights', cadence: 'per year', color: '#BCC5F0' },
  { key: 'visaFeesOneTimeUsd', label: 'Visa fees', cadence: 'one-time', color: '#5B6472' },
] as const satisfies readonly {
  key: keyof TrueCost
  label: string
  cadence: string
  color: string
}[]

export function TrueCostTab() {
  const data = loadData()
  const currency = useVantageStore((state) => state.currency)
  const rate = data.config.usdToInr
  const [expandedId, setExpandedId] = useState<CountryId | null>(null)

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
  const maxTotal = rows.length > 0 ? rows[rows.length - 1].total : 0
  const allSample = data.trueCost.every((record) => record.confidence === 'placeholder')

  return (
    <section aria-labelledby="true-cost-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="true-cost-heading" className="font-display text-xl font-semibold tracking-tight">
            True-Cost View
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Estimated first-year cost across the eight countries: tuition, living, insurance, and
            flights per year, plus one-time visa fees. Cheapest first.
          </p>
        </div>
        {allSample && <ConfidenceBadge confidence="placeholder" />}
      </div>

      <p className="mt-5 text-xs text-slate">Expand a country for the full cost breakdown.</p>

      <div className="mt-2 rounded-card border border-hairline bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {CATEGORIES.map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-slate">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-3">
          {rows.map(({ record, country, total }) => {
            const expanded = expandedId === record.countryId
            const panelId = `cost-panel-${record.countryId}`
            return (
              <div
                key={record.countryId}
                className="border-b border-hairline last:border-b-0"
              >
                <button
                  type="button"
                  data-cost-country={record.countryId}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedId(expanded ? null : record.countryId)}
                  className="flex w-full cursor-pointer items-center gap-2 py-2.5 text-left hover:bg-paper sm:gap-3"
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    aria-hidden="true"
                    className={`shrink-0 text-slate transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                  >
                    <path d="M2 1l4 3-4 3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="flex w-16 min-w-0 shrink-0 items-center gap-1.5 sm:w-32">
                    <span aria-hidden="true">{country?.flag}</span>
                    <span className="hidden truncate text-sm sm:inline">{country?.name}</span>
                    <span className="font-mono text-xs uppercase text-slate sm:hidden">
                      {record.countryId}
                    </span>
                  </span>
                  <span className="relative h-4 min-w-0 flex-1">
                    <span
                      className="flex h-full overflow-hidden rounded-full"
                      style={{ width: `${(total / maxTotal) * 100}%` }}
                    >
                      {CATEGORIES.map(({ key, label, color }, index) => (
                        <span
                          key={key}
                          title={`${label}: ${formatMoney(record[key], currency, rate)}`}
                          className={
                            index < CATEGORIES.length - 1 ? 'shadow-[inset_-2px_0_0_#fff]' : ''
                          }
                          style={{
                            width: `${(record[key] / total) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="w-[4.5rem] shrink-0 text-right font-mono text-sm font-semibold tabular-nums sm:w-20">
                    {formatMoney(total, currency, rate)}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-5 pb-4 pl-5 pr-1 pt-1 sm:grid-cols-2 sm:pl-9">
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
                            Line items
                          </h3>
                          <dl className="mt-2 space-y-1.5">
                            {CATEGORIES.map(({ key, label, cadence, color }) => (
                              <div key={key} className="flex items-baseline justify-between gap-3">
                                <dt className="flex items-center gap-1.5 text-sm text-ink">
                                  <span
                                    className="h-2 w-2 rounded-[2px]"
                                    style={{ backgroundColor: color }}
                                    aria-hidden="true"
                                  />
                                  {label}
                                  <span className="font-mono text-[10px] text-slate">
                                    {cadence}
                                  </span>
                                </dt>
                                <dd className="font-mono text-sm tabular-nums">
                                  {formatMoney(record[key], currency, rate)}
                                </dd>
                              </div>
                            ))}
                            <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-1.5">
                              <dt className="text-sm font-medium text-ink">First-year total</dt>
                              <dd className="font-mono text-sm font-semibold tabular-nums">
                                {formatMoney(total, currency, rate)}
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
                            What families miss
                          </h3>
                          <div className="mt-2 space-y-2">
                            {record.hiddenNotes.map((note) => (
                              <p
                                key={note}
                                className="rounded-r-chip border-l-2 border-gold bg-gold/5 py-1.5 pl-3 pr-2 text-xs leading-relaxed text-ink"
                              >
                                {note}
                              </p>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <ConfidenceBadge confidence={record.confidence} />
                          </div>
                          <div className="mt-2">
                            <SourceList sources={record.sources} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate">
        First-year estimate only. Full-degree totals depend on programme length. Switch ₹/$ in
        the header.{' '}
        <Link to="/methodology" className="text-ultramarine underline underline-offset-2">
          How these are computed
        </Link>
      </p>
    </section>
  )
}
