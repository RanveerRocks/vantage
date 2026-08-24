import type { ReactNode } from 'react'
import { loadData } from '../lib/data'
import { X_WEIGHTS } from '../lib/scoring'
import { DEFAULT_WEIGHT } from '../lib/store'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function Formula({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-card border border-hairline bg-white p-4 font-mono text-xs leading-relaxed text-ink">
      {children}
    </pre>
  )
}

function WeightRow({ weight, label, description }: { weight: string; label: string; description: string }) {
  return (
    <div className="flex gap-3 border-t border-hairline py-2.5 first:border-t-0">
      <span className="w-12 shrink-0 font-mono text-sm font-semibold tabular-nums text-ultramarine">
        {weight}
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate">{description}</p>
      </div>
    </div>
  )
}

export function Methodology() {
  const { config } = loadData()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">Methodology</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Every formula, weight, and convention, in plain language
      </h1>
      <p className="mt-4 text-slate">
        Nothing on Vantage is a black box. This page states exactly how every score is computed,
        what the data is (and is not), and the conventions we follow when the math needs a
        decision.
      </p>

      <Section title="What the data is (and is not)">
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Vantage data is <strong>curated, not live</strong>. Each metric is compiled by hand from
          official and public sources, stored as static JSON, and shipped with the app. Every
          record carries a <span className="font-mono text-xs">sources[]</span> list that
          deep-links to the authority it came from, a{' '}
          <span className="font-mono text-xs">lastUpdated</span> date, and a confidence level
          (high, medium, low, or placeholder). When confidence is{' '}
          <span className="font-mono text-xs">placeholder</span>, the UI shows a visible{' '}
          <span className="rounded-chip border border-gold/50 bg-gold/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-deep">
            Sample data
          </span>{' '}
          badge, as it does today, because the current dataset is entirely schema-valid sample
          data awaiting curation. All data is validated against schemas at startup; the app
          refuses to boot on malformed data rather than render something wrong.
        </p>
      </Section>

      <Section title="Normalisation: every score is relative">
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Wherever raw values need to become 0 to 100 scores, Vantage uses min-max normalisation{' '}
          <strong>across the 8 countries within the selected degree</strong>. 0 means worst in this
          set, 100 means best in this set, not worst or best in the world.
        </p>
        <Formula>{`minMax(v)         = (v − min) / (max − min) × 100
minMaxInverted(v) = 100 − minMax(v)   // used when fewer years is better`}</Formula>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          <strong>Convention:</strong> when all 8 countries have identical values for a metric,
          there is no spread to rank on, and min-max normalisation returns{' '}
          <span className="font-mono text-xs">50</span> for each country, the neutral midpoint,
          rather than an arbitrary 0 or 100.
        </p>
      </Section>

      <Section title="Career & Visa Score (scatter, X axis)">
        <Formula>{`postStudyScore = clamp(postStudyWorkYears / 3, 0, 1) × 100
prScore        = minMaxInverted(prPathwayYears)

X = ${X_WEIGHTS.jobDemand} · jobDemand
  + ${X_WEIGHTS.visaOpenness} · visaOpenness
  + ${X_WEIGHTS.postStudyScore} · postStudyScore
  + ${X_WEIGHTS.prScore} · prScore`}</Formula>
        <div className="mt-3 rounded-card border border-hairline bg-white px-4 py-1.5">
          <WeightRow
            weight={String(X_WEIGHTS.jobDemand)}
            label="Job demand"
            description="Curated 0 to 100: presence on official shortage lists plus occupation growth for this degree's typical jobs."
          />
          <WeightRow
            weight={String(X_WEIGHTS.visaOpenness)}
            label="Visa openness"
            description="Curated 0 to 100: visa cost, processing time, refusal rates, and rights to work during study."
          />
          <WeightRow
            weight={String(X_WEIGHTS.postStudyScore)}
            label="Post-study work"
            description="Raw years of post-study work visa, scaled so 3 or more years earns full marks (clamped, not normalised)."
          />
          <WeightRow
            weight={String(X_WEIGHTS.prScore)}
            label="PR pathway"
            description="Years from arrival to permanent-residency eligibility, inverted min-max: fewer years scores higher."
          />
        </div>
      </Section>

      <Section title="ROI Score (scatter, Y axis)">
        <Formula>{`pay    = (year1TotalComp + year5TotalComp) / 2
roiRaw = pay / totalDegreeCostUsd
Y      = minMax(roiRaw)   // across the 8 countries for this degree`}</Formula>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          In words: typical graduate pay divided by the full cost of the degree (tuition, living,
          insurance, and visa fees). Pay is the <strong>average of year-1 and year-5 total
          compensation, in nominal USD</strong> (base plus typical bonus and equity at market
          exchange rates). We use nominal USD because it is the hard-currency money an
          international student can save, remit, or repay loans with; we average in year-5 so
          markets with steep salary growth (the US especially) are not judged on a starting salary
          alone. Year-5 pay is estimated from year-1 using published growth patterns by field and
          country, so it carries more uncertainty than the year-1 figure.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          <strong>What ROI still does not capture.</strong> Even with the year-5 average, this is a
          deliberately narrow lens: cost-efficiency of pay against price. Free-tuition countries
          (Germany) therefore score very high, and expensive ones score low even when the education
          is world-leading. It scores neither prestige, research quality, nor global brand, none of
          which Vantage ranks. A country can be an outstanding place to study and still sit low
          here. Read the ROI axis as &ldquo;bang for buck,&rdquo; not &ldquo;overall worth.&rdquo;
        </p>
      </Section>

      <Section title="Student Life Index">
        <Formula>{`weights w ∈ {0 … 5} per factor, default ${DEFAULT_WEIGHT}, set by you, saved on your device

SLI = Σ(score_f × w_f) / Σ(w_f)   // factors with w = 0 excluded entirely`}</Formula>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Nine factor scores (0 to 100, curated per country) weighted by your sliders. A factor set
          to 0 is <strong>excluded entirely</strong>: it contributes to neither the numerator nor
          the denominator, so it cannot drag a country up or down.{' '}
          <strong>Convention:</strong> the index requires at least one factor with weight &gt; 0;
          if every slider is at 0 the panel shows an empty state instead of computing.
        </p>
      </Section>

      <Section title="True-Cost View">
        <Formula>{`firstYearCost = tuition + living + insurance + flights   // per-year items
              + visaFees                                  // one-time`}</Formula>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          <strong>Convention:</strong> the True-Cost view shows a <strong>first-year estimate</strong>,
          not a full-degree total, because programme length varies by country and degree: a
          one-year UK master&rsquo;s and a two-year US master&rsquo;s are not the same purchase.
          This is stated in the view&rsquo;s caption and will be revisited when curated data adds
          programme duration. (The ROI score above uses a separately curated full-degree cost
          figure.) The &ldquo;What families miss&rdquo; callouts surface costs that rarely appear
          in brochures: forex movement, deposits, surcharges, proof-of-funds rules.
        </p>
      </Section>

      <Section title="Money display">
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Money defaults to <strong>₹ lakh</strong>, converted from base USD at{' '}
          <span className="font-mono text-xs">₹{config.usdToInr}/US$</span> (rate last updated{' '}
          <span className="font-mono text-xs">{config.ratesLastUpdated}</span>). The ₹/$ toggle in
          the header switches every money figure in the app. Amounts under ₹100 lakh show one
          decimal; larger amounts round to whole lakh.
        </p>
      </Section>

      <Section title="The honesty statement">
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
          <li>
            Vantage is <strong>informational, never recommendatory</strong>. It does not rank
            colleges and does not tell you where to go. It shows how one degree compares across
            eight countries so you can weigh it yourself.
          </li>
          <li>
            Scores are <strong>relative to the 8-country set</strong>. A 100 means best of these
            eight, not best on earth; the same country can score differently for different
            degrees.
          </li>
          <li>
            The data is a <strong>curated snapshot</strong>, timestamped per record, not a live
            feed. Policies change; always verify with the official sources linked on every metric
            before making decisions.
          </li>
          <li>
            Where real values are not yet curated, records are marked{' '}
            <span className="font-mono text-xs">placeholder</span> and badged &ldquo;Sample
            data&rdquo; in the UI. Nothing is invented silently.
          </li>
        </ul>
      </Section>
    </div>
  )
}
