import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loadData } from '../../lib/data'
import type { CountryId, Pathway } from '../../lib/schemas'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { PathwayDrawer, type PathwayDetail } from './PathwayDrawer'
import { STAGE_COLORS, STAGE_TEXT_COLORS } from './stageColors'

const MAX_COMPARE = 3

function totalYears(pathway: Pathway): number {
  return pathway.stages.reduce((sum, stage) => sum + stage.years, 0)
}

function YearAxis({ maxYears }: { maxYears: number }) {
  const ticks: number[] = []
  for (let year = 0; year <= maxYears; year += 2) ticks.push(year)
  return (
    <div className="relative h-4" aria-hidden="true">
      {ticks.map((year) => (
        <span
          key={year}
          className="absolute -translate-x-1/2 font-mono text-[10px] tabular-nums text-slate"
          style={{ left: `${(year / maxYears) * 100}%` }}
        >
          {year}
        </span>
      ))}
    </div>
  )
}

interface TimelineBarProps {
  pathway: Pathway
  maxYears: number
  tall: boolean
}

function TimelineBar({ pathway, maxYears, tall }: TimelineBarProps) {
  const total = totalYears(pathway)
  const labelThreshold = tall ? 0.05 : 0.09
  return (
    <div className="relative min-w-0 flex-1">
      <div
        className={`flex overflow-hidden rounded-[4px] ${tall ? 'h-8' : 'h-5'}`}
        style={{ width: `${(total / maxYears) * 100}%` }}
      >
        {pathway.stages.map((stage, index) => (
          <span
            key={stage.label}
            title={`${stage.label} — ${stage.years} yr`}
            className="flex h-full items-center justify-center"
            style={{
              width: `${(stage.years / total) * 100}%`,
              backgroundColor: STAGE_COLORS[index % STAGE_COLORS.length],
            }}
          >
            {stage.years / maxYears >= labelThreshold && (
              <span
                className="font-mono text-[10px] font-medium tabular-nums"
                style={{ color: STAGE_TEXT_COLORS[index % STAGE_TEXT_COLORS.length] }}
              >
                {stage.years}
              </span>
            )}
          </span>
        ))}
      </div>
      {/* Gold marker: PR eligibility point */}
      <span
        title="PR eligibility"
        aria-hidden="true"
        className="absolute -inset-y-0.5 w-0.5 -translate-x-1/2 rounded-full bg-gold"
        style={{ left: `${(pathway.totalYearsToPr / maxYears) * 100}%` }}
      />
    </div>
  )
}

export function PathwaysTab() {
  const data = loadData()
  const [compareIds, setCompareIds] = useState<CountryId[]>([])
  const [selectedId, setSelectedId] = useState<CountryId | null>(null)

  const pathways = useMemo(
    () => [...data.pathways].sort((a, b) => a.totalYearsToPr - b.totalYearsToPr),
    [data],
  )
  const maxYears = useMemo(() => Math.max(...pathways.map(totalYears)), [pathways])
  const comparing = compareIds.length > 0
  const visible = comparing
    ? pathways.filter((pathway) => compareIds.includes(pathway.countryId))
    : pathways
  const allSample = data.pathways.every((pathway) => pathway.confidence === 'placeholder')
  const stageLabels = pathways[0]?.stages.map((stage) => stage.label) ?? []

  const countryOf = useCallback(
    (id: CountryId) => data.countries.find((country) => country.id === id),
    [data],
  )

  function toggleCompare(id: CountryId) {
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((existing) => existing !== id)
        : current.length < MAX_COMPARE
          ? [...current, id]
          : current,
    )
  }

  const selectedDetail: PathwayDetail | null = useMemo(() => {
    if (!selectedId) return null
    const country = countryOf(selectedId)
    const pathway = data.pathways.find((p) => p.countryId === selectedId)
    if (!country || !pathway) return null
    return { country, pathway }
  }, [selectedId, data, countryOf])

  const closeDrawer = useCallback(() => setSelectedId(null), [])

  return (
    <section aria-labelledby="pathways-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="pathways-heading" className="font-display text-xl font-semibold tracking-tight">
            Post-Study Pathway Timelines
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Years from arrival through study, post-study work, PR, and citizenship — drawn to a
            common scale. The gold tick marks PR eligibility.
          </p>
        </div>
        {allSample && <ConfidenceBadge confidence="placeholder" />}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate">
          Compare up to {MAX_COMPARE}
        </span>
        {pathways.map((pathway) => {
          const country = countryOf(pathway.countryId)
          const active = compareIds.includes(pathway.countryId)
          const full = !active && compareIds.length >= MAX_COMPARE
          return (
            <button
              key={pathway.countryId}
              type="button"
              aria-pressed={active}
              disabled={full}
              onClick={() => toggleCompare(pathway.countryId)}
              className={`rounded-chip border px-2 py-1 font-mono text-xs uppercase disabled:opacity-40 ${
                active
                  ? 'border-ultramarine bg-ultramarine text-paper'
                  : 'border-hairline text-slate hover:border-slate hover:text-ink'
              }`}
            >
              {country?.flag} {pathway.countryId}
            </button>
          )
        })}
        {comparing && (
          <button
            type="button"
            onClick={() => setCompareIds([])}
            className="rounded-chip px-2 py-1 text-xs text-ultramarine underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 rounded-card border border-hairline bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {stageLabels.map((label, index) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-slate">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ backgroundColor: STAGE_COLORS[index % STAGE_COLORS.length] }}
                aria-hidden="true"
              />
              {label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-slate">
            <span className="h-2.5 w-0.5 rounded-full bg-gold" aria-hidden="true" />
            PR eligibility
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 gap-y-1 sm:grid-cols-[8rem_minmax(0,1fr)_3.5rem] sm:gap-x-3">
          <span aria-hidden="true" />
          <YearAxis maxYears={maxYears} />
          <span className="text-right font-mono text-[10px] uppercase text-slate">to PR</span>

          {visible.map((pathway) => {
            const country = countryOf(pathway.countryId)
            return (
              <button
                key={pathway.countryId}
                type="button"
                data-pathway-country={pathway.countryId}
                onClick={() => setSelectedId(pathway.countryId)}
                aria-label={`${country?.name}: PR eligibility in ${pathway.totalYearsToPr} years. Open stage details.`}
                className={`col-span-3 grid grid-cols-subgrid items-center rounded-chip px-0 text-left hover:bg-paper ${
                  comparing ? 'py-2.5' : 'py-1.5'
                }`}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span aria-hidden="true">{country?.flag}</span>
                  <span className="hidden truncate text-sm sm:inline">{country?.name}</span>
                  <span className="font-mono text-xs uppercase text-slate sm:hidden">
                    {pathway.countryId}
                  </span>
                </span>
                <TimelineBar pathway={pathway} maxYears={maxYears} tall={comparing} />
                <span className="text-right font-mono text-sm font-semibold tabular-nums">
                  {pathway.totalYearsToPr} yr
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wider text-slate">
          years from arrival →
        </p>
      </div>

      <p className="mt-3 text-xs text-slate">
        Sorted by years to PR eligibility. Click a country for stage-by-stage detail and sources.{' '}
        <Link to="/methodology" className="text-ultramarine underline underline-offset-2">
          How these are computed
        </Link>
      </p>

      <AnimatePresence>
        {selectedDetail && (
          <PathwayDrawer
            key={selectedDetail.country.id}
            detail={selectedDetail}
            onClose={closeDrawer}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
