import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { DEGREES } from '../lib/degrees'
import { useVantageStore } from '../lib/store'

// A vivid accent per degree tile, so the picker reads as a bright, inviting grid.
// Jewel tones: vivid but dark enough to pass AA both as text on white and
// with white text on them.
const DEGREE_ACCENTS = [
  '#2440C9',
  '#0E7490',
  '#6D28D9',
  '#DB2777',
  '#C2410C',
  '#047857',
  '#1D4ED8',
  '#7C3AED',
]

const COMPONENTS = [
  { number: '01', name: 'Career & Visa Landscape', description: 'pathway strength plotted against return on cost', color: '#2440C9' },
  { number: '02', name: 'Student Life Index', description: 'nine factors, weighted by what matters to you', color: '#0E7490' },
  { number: '03', name: 'Pathway Timelines', description: 'years from arrival to PR and citizenship, to scale', color: '#6D28D9' },
  { number: '04', name: 'True-Cost View', description: 'what the first year really costs, hidden notes included', color: '#DB2777' },
  { number: '05', name: 'Emerging Destinations', description: 'beyond the usual eight', color: '#C2410C' },
]

export function Home() {
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const setSelectedDegreeId = useVantageStore((state) => state.setSelectedDegreeId)

  function handleGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const columns = window.matchMedia('(min-width: 1024px)').matches ? 4 : 2
    const index = tileRefs.current.findIndex((el) => el === document.activeElement)
    if (index === -1) return
    let next = index
    switch (event.key) {
      case 'ArrowRight':
        next = Math.min(DEGREES.length - 1, index + 1)
        break
      case 'ArrowLeft':
        next = Math.max(0, index - 1)
        break
      case 'ArrowDown':
        next = Math.min(DEGREES.length - 1, index + columns)
        break
      case 'ArrowUp':
        next = Math.max(0, index - columns)
        break
      default:
        return
    }
    event.preventDefault()
    tileRefs.current[next]?.focus()
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-aurora absolute inset-0" aria-hidden="true" />
        <div className="survey-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-ultramarine/20 bg-white/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ultramarine backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />8 countries · 8 degrees · 0 rankings
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-[2.7rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-[4.5rem]">
            See the <span className="text-gradient">whole field</span> before you choose where to
            study
            <span className="text-coral" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
            Vantage compares the career, visa, cost, and life outcomes of one degree across eight
            countries, for international students and their families. Informational, never
            recommendatory.
          </p>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.22em] text-slate">
            Start with your degree
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4" onKeyDown={handleGridKeyDown}>
            {DEGREES.map((degree, index) => {
              const accent = DEGREE_ACCENTS[index % DEGREE_ACCENTS.length]
              return (
                <Link
                  key={degree.id}
                  ref={(el) => {
                    tileRefs.current[index] = el
                  }}
                  to={`/explore/${degree.id}`}
                  onClick={() => setSelectedDegreeId(degree.id)}
                  style={{ ['--accent' as string]: accent }}
                  className="group relative overflow-hidden rounded-card border border-hairline bg-white p-4 pt-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[0_16px_36px_-12px_var(--accent)]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[color:var(--accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1.5 flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-semibold leading-snug text-ink">
                      {degree.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-slate transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[color:var(--accent)]"
                    >
                      →
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6"
        aria-label="What you can explore"
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">Then explore</p>
        <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
          {COMPONENTS.map(({ number, name, description, color }) => (
            <li key={number} className="rounded-card border border-hairline bg-white p-3.5 shadow-soft">
              <span className="accent-rule block h-1 w-8 rounded-full" style={{ background: color }} />
              <span className="mt-2.5 block font-mono text-[11px] font-semibold" style={{ color }}>
                {number}
              </span>
              <p className="mt-1 text-sm font-semibold text-ink">{name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
