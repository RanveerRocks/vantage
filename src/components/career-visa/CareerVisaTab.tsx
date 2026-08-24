import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loadData } from '../../lib/data'
import type { Degree } from '../../lib/degrees'
import { COUNTRY_COLORS } from '../../lib/palette'
import { COUNTRY_IDS, type CareerVisaMetrics, type CountryId } from '../../lib/schemas'
import { careerVisaBreakdown, roiScore } from '../../lib/scoring'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { CareerVisaChart, type ChartPoint } from './CareerVisaChart'
import { CountryDrawer, type CountryDetail } from './CountryDrawer'

export function CareerVisaTab({ degree }: { degree: Degree }) {
  const data = loadData()
  const [selectedId, setSelectedId] = useState<CountryId | null>(null)

  const records = useMemo(
    () =>
      COUNTRY_IDS.map((countryId) =>
        data.careerVisa.find(
          (record) => record.countryId === countryId && record.degreeId === degree.id,
        ),
      ).filter((record): record is CareerVisaMetrics => record !== undefined),
    [data, degree.id],
  )
  const breakdowns = useMemo(() => careerVisaBreakdown(records), [records])
  const rois = useMemo(() => roiScore(records), [records])

  const points: ChartPoint[] = useMemo(
    () =>
      records.map((record, index) => {
        const country = data.countries.find((c) => c.id === record.countryId)
        return {
          countryId: record.countryId,
          code: record.countryId.toUpperCase(),
          flag: country?.flag ?? '',
          name: country?.name ?? record.countryId,
          color: COUNTRY_COLORS[record.countryId],
          x: breakdowns[index].score,
          y: rois[index].score,
        }
      }),
    [records, breakdowns, rois, data],
  )

  const someSample = records.some((record) => record.confidence === 'placeholder')

  const selectedDetail: CountryDetail | null = useMemo(() => {
    if (!selectedId) return null
    const index = records.findIndex((record) => record.countryId === selectedId)
    const country = data.countries.find((c) => c.id === selectedId)
    if (index === -1 || !country) return null
    return {
      country,
      record: records[index],
      breakdown: breakdowns[index],
      roiScore: rois[index].score,
    }
  }, [selectedId, records, breakdowns, rois, data])

  const closeDrawer = useCallback(() => setSelectedId(null), [])

  return (
    <section aria-labelledby="career-visa-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="career-visa-heading" className="font-display text-xl font-semibold tracking-tight">
            Career &amp; Visa Landscape
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Where {degree.name} stands across the eight countries: pathway strength against
            return on cost.
          </p>
        </div>
        {someSample && <ConfidenceBadge confidence="placeholder" />}
      </div>

      <p className="mt-5 text-xs text-slate">Click any country for a full breakdown.</p>

      <div className="mt-2 rounded-card border border-hairline bg-white p-2 shadow-soft sm:p-4">
        <CareerVisaChart
          degreeName={degree.name}
          points={points}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      <p className="mt-3 text-xs text-slate">
        Both scores are relative to these eight countries for this degree (0 = weakest in the set,
        100 = strongest). ROI measures early-career cost-efficiency and visa ease, not prestige,
        research quality, or long-term earning ceiling, where a country like the US leads.{' '}
        <Link to="/methodology" className="text-ultramarine underline underline-offset-2">
          How these are computed
        </Link>
      </p>

      <AnimatePresence>
        {selectedDetail && (
          <CountryDrawer
            key={selectedDetail.country.id}
            detail={selectedDetail}
            usdToInr={data.config.usdToInr}
            onClose={closeDrawer}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
