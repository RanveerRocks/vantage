import { Link, NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { DEGREES, findDegree } from '../../lib/degrees'
import { useVantageStore } from '../../lib/store'

function CrosshairMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="6.5" stroke="#2440C9" strokeWidth="1.5" />
      <line x1="12" y1="1" x2="12" y2="5.5" stroke="#2440C9" strokeWidth="1.5" />
      <line x1="12" y1="18.5" x2="12" y2="23" stroke="#2440C9" strokeWidth="1.5" />
      <line x1="1" y1="12" x2="5.5" y2="12" stroke="#2440C9" strokeWidth="1.5" />
      <line x1="18.5" y1="12" x2="23" y2="12" stroke="#2440C9" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.75" fill="#B98A1F" />
    </svg>
  )
}

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
        <Link to="/" className="flex items-center gap-2 rounded-chip">
          <CrosshairMark />
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
