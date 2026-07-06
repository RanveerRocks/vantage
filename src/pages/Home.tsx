const UPCOMING = [
  'Career & Visa Landscape',
  'Student Life Index',
  'Pathway Timelines',
  'True-Cost View',
  'Emerging Destinations',
]

export function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="survey-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">
            8 countries · 8 degrees · 0 rankings
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            See the whole field before you choose where to study.
          </h1>
          <p className="mt-5 max-w-xl text-slate">
            Vantage compares the career, visa, cost, and life outcomes of one degree across eight
            countries — for Indian students and their families. Informational, never
            recommendatory.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-card border border-dashed border-hairline p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-slate">
            Degree picker — arriving in the next phase
          </p>
          <p className="mt-3 text-sm text-slate">
            Choosing your degree will be the entry point. From there:
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {UPCOMING.map((label) => (
              <li
                key={label}
                className="rounded-chip border border-hairline px-3 py-1 font-mono text-xs text-slate"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
