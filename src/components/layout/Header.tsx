import { Link, NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { DEGREES, findDegree } from '../../lib/degrees'
import { useVantageStore } from '../../lib/store'
import { CrosshairGlyph } from '../shared/CrosshairGlyph'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedDegreeId = useVantageStore((state) => state.selectedDegreeId)
  const setSelectedDegreeId = useVantageStore((state) => state.setSelectedDegreeId)
  const currency = useVantageStore((state) => state.currency)
  const setCurrency = useVantageStore((state) => state.setCurrency)

  const exploreMatch = matchPath('/explore/:degreeId', location.pathname)
  const urlDegree = findDegree(exploreMatch?.params.degreeId)
  const currentDegreeId = urlDegree?.id ?? selectedDegreeId ?? ''

  function handleDegreeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const degree = findDegree(event.target.value)
    if (!degree) return
    setSelectedDegreeId(degree.id)
    // Keep the current tab (search params) when already exploring.
    navigate({
      pathname: `/explore/${degree.id}`,
      search: exploreMatch ? location.search : '',
    })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* The wordmark text is hidden below sm, so the link needs its own name */}
        <Link to="/" aria-label="Vantage home" className="flex items-center gap-2 rounded-chip">
          <CrosshairGlyph />
          <span className="hidden font-display text-xl font-semibold tracking-tight sm:inline">
            Vantage
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <label className="relative min-w-0">
            <span className="sr-only">Degree</span>
            <select
              value={currentDegreeId}
              onChange={handleDegreeChange}
              className="w-full max-w-[44vw] appearance-none truncate rounded-chip border border-hairline bg-paper py-1.5 pl-3 pr-7 text-sm text-ink hover:border-slate sm:max-w-60"
            >
              <option value="" disabled>
                Choose degree
              </option>
              {DEGREES.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate"
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </label>

          <div
            role="group"
            aria-label="Currency"
            className="flex shrink-0 overflow-hidden rounded-chip border border-hairline font-mono text-sm"
          >
            <button
              type="button"
              aria-pressed={currency === 'inr'}
              onClick={() => setCurrency('inr')}
              className={
                currency === 'inr'
                  ? 'bg-ultramarine px-2.5 py-1 text-paper'
                  : 'px-2.5 py-1 text-slate hover:text-ink'
              }
            >
              ₹
            </button>
            <button
              type="button"
              aria-pressed={currency === 'usd'}
              onClick={() => setCurrency('usd')}
              className={
                currency === 'usd'
                  ? 'bg-ultramarine px-2.5 py-1 text-paper'
                  : 'px-2.5 py-1 text-slate hover:text-ink'
              }
            >
              $
            </button>
          </div>

          <NavLink
            to="/methodology"
            className={({ isActive }) =>
              `hidden shrink-0 rounded-chip text-sm sm:inline ${
                isActive ? 'text-ultramarine' : 'text-slate hover:text-ink'
              }`
            }
          >
            Methodology
          </NavLink>
        </div>
      </div>
    </header>
  )
}
