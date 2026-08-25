import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loadData } from '../../lib/data'
import type { Degree } from '../../lib/degrees'
import { COUNTRY_COLORS } from '../../lib/palette'
import { COUNTRY_IDS, type CareerVisaMetrics, type CountryId } from '../../lib/schemas'
import { careerVisaBreakdown, roiScore } from '../../lib/scoring'
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
          y: Math.min(rois[index].score, 50),
          yScore: rois[index].score,
        }
      }),
    [records, breakdowns, rois, data],
  )


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
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full bg-ultramarine" aria-hidden="true" />
        <h2 id="career-visa-heading" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Career &amp; Visa Landscape
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
        Where <strong className="text-ink">{degree.name}</strong> stands across the eight countries:{' '}
        <strong className="text-ink">pathway strength</strong> (how easy it is to work and stay) on
        the horizontal, <strong className="text-ink">return on cost</strong> on the vertical. Click
        any country for the full breakdown behind its position.
      </p>

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
