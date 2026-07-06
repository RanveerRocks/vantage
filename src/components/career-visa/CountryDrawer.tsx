import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { formatInrLakh } from '../../lib/currency'
import type { CareerVisaMetrics, Country } from '../../lib/schemas'
import { X_WEIGHTS, type CareerVisaComponents } from '../../lib/scoring'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { SourceList } from '../shared/SourceList'
import { ReadoutBar } from './ReadoutBar'

export interface CountryDetail {
  country: Country
  record: CareerVisaMetrics
  breakdown: CareerVisaComponents
  roiScore: number
}

function CountUp({ value }: { value: number }) {
  const reducedMotion = useReducedMotion() ?? false
  const motionValue = useMotionValue(0)
  const text = useTransform(motionValue, (v) => v.toFixed(1))
  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(value)
      return
    }
    const controls = animate(motionValue, value, { duration: 0.6, ease: 'easeOut' })
    return () => controls.stop()
  }, [motionValue, value, reducedMotion])
  if (reducedMotion) return <span>{value.toFixed(1)}</span>
  return <motion.span>{text}</motion.span>
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-hairline bg-white p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate">{label}</p>
      <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-ink">
        <CountUp value={value} />
        <span className="text-sm font-normal text-slate"> /100</span>
      </p>
    </div>
  )
}

interface CountryDrawerProps {
  detail: CountryDetail
  usdToInr: number
  onClose: () => void
}

export function CountryDrawer({ detail, usdToInr, onClose }: CountryDrawerProps) {
  const { country, record, breakdown, roiScore } = detail
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-ink/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${country.name} — career and visa details`}
        data-testid="country-drawer"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-hairline bg-paper"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.26, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                {country.flag}
              </span>
              <h2 className="font-display text-2xl font-semibold tracking-tight">{country.name}</h2>
              <span className="rounded-chip border border-hairline px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate">
                {country.id}
              </span>
            </div>
            <div className="mt-2">
              <ConfidenceBadge confidence={record.confidence} />
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-chip border border-hairline p-2 text-slate hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <ScoreTile label="Career & visa score" value={breakdown.score} />
            <ScoreTile label="ROI score" value={roiScore} />
          </div>

          <section aria-label="Career and visa score components">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
              Score components
            </h3>
            <div className="mt-3 space-y-4">
              <ReadoutBar label="Job demand" weight={X_WEIGHTS.jobDemand} value={breakdown.jobDemand} />
              <ReadoutBar
                label="Visa openness"
                weight={X_WEIGHTS.visaOpenness}
                value={breakdown.visaOpenness}
              />
              <ReadoutBar
                label="Post-study work"
                weight={X_WEIGHTS.postStudyScore}
                value={breakdown.postStudyScore}
                detail={`${record.postStudyWorkYears} yr post-study work visa`}
              />
              <ReadoutBar
                label="PR pathway"
                weight={X_WEIGHTS.prScore}
                value={breakdown.prScore}
                detail={`${record.prPathwayYears} yr from arrival to PR eligibility`}
              />
            </div>
          </section>

          <section aria-label="ROI inputs">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate">ROI inputs</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-card border border-hairline bg-white p-3">
                <dt className="text-[11px] uppercase tracking-wider text-slate">
                  Year-1 salary (PPP)
                </dt>
                <dd className="mt-1 font-mono text-lg font-medium tabular-nums">
                  {formatInrLakh(record.medianSalaryY1PppUsd, usdToInr)}
                </dd>
              </div>
              <div className="rounded-card border border-hairline bg-white p-3">
                <dt className="text-[11px] uppercase tracking-wider text-slate">
                  Total degree cost
                </dt>
                <dd className="mt-1 font-mono text-lg font-medium tabular-nums">
                  {formatInrLakh(record.totalDegreeCostUsd, usdToInr)}
                </dd>
              </div>
            </dl>
            <p className="mt-2 font-mono text-[11px] text-slate">
              ROI = salary × 5 ÷ total cost, normalised across the 8 countries
            </p>
          </section>

          <section aria-label="Narrative">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
              Why it sits here
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink">{record.narrative}</p>
          </section>

          <section aria-label="Sources">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate">Sources</h3>
            <div className="mt-3">
              <SourceList sources={record.sources} />
            </div>
          </section>
        </div>
      </motion.aside>
    </>
  )
}
