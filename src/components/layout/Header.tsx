import { Link, NavLink } from 'react-router-dom'

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
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 rounded-chip">
          <CrosshairMark />
          <span className="font-display text-xl font-semibold tracking-tight">Vantage</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Degree switcher — placeholder, wired up in a later phase */}
          <button
            type="button"
            disabled
            title="Degree switcher — coming in a later phase"
            className="hidden items-center gap-2 rounded-chip border border-hairline px-3 py-1.5 text-sm text-slate sm:flex"
          >
            Choose degree
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Currency toggle — placeholder, wired up in a later phase */}
          <div
            role="group"
            aria-label="Currency (coming in a later phase)"
            className="flex overflow-hidden rounded-chip border border-hairline font-mono text-sm"
          >
            <button
              type="button"
              disabled
              aria-pressed="true"
              className="bg-ultramarine px-2.5 py-1 text-paper"
            >
              ₹
            </button>
            <button type="button" disabled aria-pressed="false" className="px-2.5 py-1 text-slate">
              $
            </button>
          </div>

          <NavLink
            to="/methodology"
            className={({ isActive }) =>
              `rounded-chip text-sm ${isActive ? 'text-ultramarine' : 'text-slate hover:text-ink'}`
            }
          >
            Methodology
          </NavLink>
        </div>
      </div>
    </header>
  )
}
