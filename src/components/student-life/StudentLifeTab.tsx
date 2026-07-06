import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loadData } from '../../lib/data'
import { COUNTRY_COLORS } from '../../lib/palette'
import { FACTOR_IDS, type CountryId } from '../../lib/schemas'
import { studentLifeIndex } from '../../lib/scoring'
import { DEFAULT_WEIGHT, useVantageStore } from '../../lib/store'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { CountryRankingBars, type RankedCountry } from './CountryRankingBars'
import { FactorSlider } from './FactorSlider'
import { StudentLifeDrawer, type StudentLifeDetail } from './StudentLifeDrawer'

export function StudentLifeTab() {
  const data = loadData()
  const weights = useVantageStore((state) => state.weights)
  const setWeight = useVantageStore((state) => state.setWeight)
  const resetWeights = useVantageStore((state) => state.resetWeights)
  const [selectedId, setSelectedId] = useState<CountryId | null>(null)

  const totalWeight = FACTOR_IDS.reduce((sum, id) => sum + weights[id], 0)
  const isDefault = FACTOR_IDS.every((id) => weights[id] === DEFAULT_WEIGHT)
  const allSample = data.studentLife.every((record) => record.confidence === 'placeholder')

  const ranked: RankedCountry[] = useMemo(() => {
    if (totalWeight === 0) return []
    return studentLifeIndex(data.studentLife, weights)
      .map(({ countryId, score }) => {
        const country = data.countries.find((c) => c.id === countryId)
        return {
          countryId,
          name: country?.name ?? countryId,
          flag: country?.flag ?? '',
          color: COUNTRY_COLORS[countryId],
          score,
        }
      })
      .sort((a, b) => b.score - a.score)
  }, [data, weights, totalWeight])

  const selectedDetail: StudentLifeDetail | null = useMemo(() => {
    if (!selectedId) return null
    const country = data.countries.find((c) => c.id === selectedId)
    const rankIndex = ranked.findIndex((entry) => entry.countryId === selectedId)
    if (!country || rankIndex === -1) return null
    const records = FACTOR_IDS.map((factorId) =>
      data.studentLife.find(
        (record) => record.countryId === selectedId && record.factorId === factorId,
      ),
    ).filter((record): record is NonNullable<typeof record> => record !== undefined)
    return {
      country,
      records,
      sli: ranked[rankIndex].score,
      rank: rankIndex + 1,
      outOf: ranked.length,
    }
  }, [selectedId, data, ranked])

  const closeDrawer = useCallback(() => setSelectedId(null), [])

  return (
    <section aria-labelledby="student-life-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2
            id="student-life-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Student Life Index
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Rank the eight countries by what matters to you — set each factor&rsquo;s weight and
            the ranking recomputes live.
          </p>
        </div>
        {allSample && <ConfidenceBadge confidence="placeholder" />}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-card border border-hairline bg-white p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
                Your weights
              </h3>
              <button
                type="button"
                onClick={resetWeights}
                disabled={isDefault}
                className="rounded-chip border border-hairline px-2.5 py-1 text-xs text-slate enabled:hover:border-slate enabled:hover:text-ink disabled:opacity-50"
              >
                Reset weights
              </button>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate">
              0–5 · default 3 · 0 removes the factor entirely
            </p>
            <div className="mt-4 space-y-5">
              {data.factors.map((factor) => (
                <FactorSlider
                  key={factor.id}
                  factor={factor}
                  value={weights[factor.id]}
                  onChange={(value) => setWeight(factor.id, value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-card border border-hairline bg-white p-4 sm:p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
              Ranking · weighted by you
            </h3>
            <div className="mt-4">
              {ranked.length === 0 ? (
                <div className="rounded-card border border-dashed border-hairline p-8 text-center">
                  <p className="text-sm text-slate">
                    Every factor is set to 0, so there&rsquo;s nothing to rank. Raise at least one
                    slider to bring the countries back.
                  </p>
                </div>
              ) : (
                <CountryRankingBars
                  entries={ranked}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                />
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate">
            SLI = Σ(score × weight) ÷ Σ(weight), on curated 0–100 factor scores. Click a country
            for its factor breakdown.{' '}
            <Link to="/methodology" className="text-ultramarine underline-offset-2 hover:underline">
              How these are computed
            </Link>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {selectedDetail && (
          <StudentLifeDrawer
            key={selectedDetail.country.id}
            detail={selectedDetail}
            factors={data.factors}
            weights={weights}
            onClose={closeDrawer}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
