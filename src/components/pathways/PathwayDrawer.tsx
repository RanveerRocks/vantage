import type { Country, Pathway } from '../../lib/schemas'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import { Drawer } from '../shared/Drawer'
import { SourceList } from '../shared/SourceList'
import { STAGE_COLORS } from './stageColors'

export interface PathwayDetail {
  country: Country
  pathway: Pathway
}

interface PathwayDrawerProps {
  detail: PathwayDetail
  onClose: () => void
}

export function PathwayDrawer({ detail, onClose }: PathwayDrawerProps) {
  const { country, pathway } = detail

  return (
    <Drawer
      label={`${country.name} — post-study pathway`}
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
            <ConfidenceBadge confidence={pathway.confidence} />
            <span className="font-mono text-xs tabular-nums text-slate">
              PR eligibility in {pathway.totalYearsToPr} yr
            </span>
          </div>
        </>
      }
    >
      <section aria-label="Pathway stages">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate">
          Stages from arrival
        </h3>
        <div className="mt-3 space-y-4">
          {pathway.stages.map((stage, index) => (
            <div key={stage.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                    style={{ backgroundColor: STAGE_COLORS[index % STAGE_COLORS.length] }}
                    aria-hidden="true"
                  />
                  {stage.label}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {stage.years} yr
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate">{stage.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-slate">
          Years to PR = study + post-study visa + PR process = {pathway.totalYearsToPr} yr
        </p>
      </section>

      <section aria-label="Sources">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate">Sources</h3>
        <div className="mt-3">
          <SourceList sources={pathway.sources} />
        </div>
      </section>
    </Drawer>
  )
}
