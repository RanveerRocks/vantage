import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { DEGREES } from '../lib/degrees'
import { useVantageStore } from '../lib/store'

const COMPONENTS = [
  { number: '01', name: 'Career & Visa Landscape', description: 'pathway strength plotted against return on cost' },
  { number: '02', name: 'Student Life Index', description: 'nine factors, weighted by what matters to you' },
  { number: '03', name: 'Pathway Timelines', description: 'years from arrival to PR and citizenship, to scale' },
  { number: '04', name: 'True-Cost View', description: 'what the first year really costs, hidden notes included' },
  { number: '05', name: 'Emerging Destinations', description: 'beyond the usual eight' },
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
        <div
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_0%,rgba(36,64,201,0.05),transparent_65%)]"
          aria-hidden="true"
        />
        <div className="survey-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ultramarine">
            8 countries · 8 degrees · 0 rankings
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-[4.25rem]">
            See the whole field before you choose where to study
            <span className="text-gold" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-slate sm:text-lg">
            Vantage compares the career, visa, cost, and life outcomes of one degree across eight
            countries, for international students and their families. Informational, never
            recommendatory.
          </p>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.22em] text-slate">
            Start with your degree
          </p>
          <div
            className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
            onKeyDown={handleGridKeyDown}
          >
            {DEGREES.map((degree, index) => (
              <Link
                key={degree.id}
                ref={(el) => {
                  tileRefs.current[index] = el
                }}
                to={`/explore/${degree.id}`}
                onClick={() => setSelectedDegreeId(degree.id)}
                className="group rounded-card border border-hairline bg-white p-4 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ultramarine hover:shadow-lift"
              >
                <span className="font-mono text-[10px] tracking-[0.08em] text-ultramarine">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium leading-snug text-ink">{degree.name}</span>
                  <span
                    aria-hidden="true"
                    className="text-slate transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ultramarine"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-label="What you can explore">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">Then explore</p>
        <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
          {COMPONENTS.map(({ number, name, description }) => (
            <li key={number} className="border-t border-hairline pt-2.5">
              <span className="font-mono text-[10px] text-ultramarine">{number}</span>
              <p className="mt-0.5 text-sm font-medium text-ink">{name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
