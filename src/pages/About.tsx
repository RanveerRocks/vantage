import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function OwnerPlaceholder({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-card border border-dashed border-gold/50 bg-gold/5 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-gold-deep">
        Placeholder — owner copy to replace
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate">{children}</p>
    </div>
  )
}

export function About() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">About</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Why Vantage exists
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">The project</h2>
        <OwnerPlaceholder>
          Two to three paragraphs on the problem: families choosing a study destination on
          brand-name gravity and agent advice, missing visa realities, true costs, and what daily
          life is like — and how Vantage puts the blind spots on one screen without ranking
          anything.
        </OwnerPlaceholder>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">The research</h2>
        <OwnerPlaceholder>
          How the data is curated: which official sources are used per metric (immigration
          departments, statistics bureaus, salary surveys), how often it is refreshed, and how
          confidence levels are assigned.
        </OwnerPlaceholder>
        <p className="mt-2 text-sm text-slate">
          The formulas behind every score are already public on the{' '}
          <Link
            to="/methodology"
            className="text-ultramarine underline underline-offset-2"
          >
            methodology page
          </Link>
          .
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">The builder</h2>
        <OwnerPlaceholder>
          A short bio: who is building Vantage, why this problem is personal, and how to get in
          touch with corrections or source suggestions.
        </OwnerPlaceholder>
      </section>
    </div>
  )
}
