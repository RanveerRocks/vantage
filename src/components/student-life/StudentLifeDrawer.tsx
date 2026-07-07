import type { Country, Factor, StudentLifeScore } from '../../lib/schemas'
import type { FactorWeights } from '../../lib/store'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { Drawer } from '../shared/Drawer'
import { ReadoutBar } from '../shared/ReadoutBar'
import { SourceList } from '../shared/SourceList'

export interface StudentLifeDetail {
  country: Country
  records: StudentLifeScore[] // one per factor, in factors.json order
  sli: number
  rank: number
  outOf: number
}

interface StudentLifeDrawerProps {
  detail: StudentLifeDetail
  factors: Factor[]
  weights: FactorWeights
  onClose: () => void
}

export function StudentLifeDrawer({ detail, factors, weights, onClose }: StudentLifeDrawerProps) {
  const { country, records, sli, rank, outOf } = detail
  const anyPlaceholder = records.some((record) => record.confidence === 'placeholder')

  return (
    <Drawer
      label={`${country.name}: student life breakdown`}
      kicker="Student life detail"
      onClose={onClose}
      header={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              {country.flag}
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{country.name}</h2>
            <span className="rounded-chip border border-hairline px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate">
              {country.id}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {anyPlaceholder && <ConfidenceBadge confidence="placeholder" />}
            <span className="font-mono text-xs tabular-nums text-slate">
              SLI {sli.toFixed(1)} · rank {rank}/{outOf}
            </span>
          </div>
        </>
      }
    >
      {factors.map((factor) => {
        const record = records.find((r) => r.factorId === factor.id)
        if (!record) return null
        const weight = weights[factor.id]
        return (
          <section key={factor.id} aria-label={factor.name}>
            <ReadoutBar
              label={factor.name}
              value={record.score}
              tag={weight === 0 ? 'w 0 · off' : `w ${weight}`}
              dimmed={weight === 0}
            />
            <p className="mt-1.5 text-xs leading-relaxed text-slate">{record.blurb}</p>
            <div className="mt-2">
              <SourceList sources={record.sources} />
            </div>
          </section>
        )
      })}
    </Drawer>
  )
}
