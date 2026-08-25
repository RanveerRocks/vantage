import { lazy, Suspense, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CrosshairGlyph } from '../components/shared/CrosshairGlyph'
import { findDegree } from '../lib/degrees'
import { useVantageStore } from '../lib/store'

// Each tab code-splits so the Recharts scatter (the heaviest chunk) loads
// only when its tab is opened.
const CareerVisaTab = lazy(() =>
  import('../components/career-visa/CareerVisaTab').then((m) => ({ default: m.CareerVisaTab })),
)
const StudentLifeTab = lazy(() =>
  import('../components/student-life/StudentLifeTab').then((m) => ({ default: m.StudentLifeTab })),
)
const PathwaysTab = lazy(() =>
  import('../components/pathways/PathwaysTab').then((m) => ({ default: m.PathwaysTab })),
)
const TrueCostTab = lazy(() =>
  import('../components/true-cost/TrueCostTab').then((m) => ({ default: m.TrueCostTab })),
)
const EmergingTab = lazy(() =>
  import('../components/emerging/EmergingTab').then((m) => ({ default: m.EmergingTab })),
)

function TabFallback() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-card border border-dashed border-hairline p-14 text-center"
      role="status"
    >
      <CrosshairGlyph size={22} />
      <p className="font-mono text-xs uppercase tracking-widest text-slate">Loading…</p>
    </div>
  )
}

const TAB_IDS = ['career-visa', 'student-life', 'pathways', 'true-cost', 'emerging'] as const
type TabId = (typeof TAB_IDS)[number]

const TABS: { id: TabId; label: string; color: string }[] = [
  { id: 'career-visa', label: 'Career & Visa', color: '#2440C9' },
  { id: 'student-life', label: 'Student Life', color: '#0E7490' },
  { id: 'pathways', label: 'Pathways', color: '#6D28D9' },
  { id: 'true-cost', label: 'True Cost', color: '#DB2777' },
  { id: 'emerging', label: 'Emerging', color: '#C2410C' },
]

function isTabId(value: string | null): value is TabId {
  return TAB_IDS.includes(value as TabId)
}

export function Explore() {
  const { degreeId } = useParams()
  const degree = findDegree(degreeId)
  const [searchParams, setSearchParams] = useSearchParams()
  const setSelectedDegreeId = useVantageStore((state) => state.setSelectedDegreeId)

  useEffect(() => {
    if (degree) setSelectedDegreeId(degree.id)
  }, [degree, setSelectedDegreeId])

  if (!degree) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          We don&rsquo;t have that degree
        </h1>
        <p className="mt-3 max-w-xl text-slate">
          &ldquo;{degreeId}&rdquo; isn&rsquo;t one of the eight degrees Vantage covers. Head back to
          the home page and pick one from the list.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-chip border border-hairline px-4 py-2 text-sm text-ultramarine hover:border-ultramarine"
        >
          Back to home
        </Link>
      </div>
    )
  }

  const tabParam = searchParams.get('tab')
  const tab: TabId = isTabId(tabParam) ? tabParam : 'career-visa'

  function selectTab(id: TabId) {
    setSearchParams((params) => {
      params.set('tab', id)
      return params
    })
  }

  const activeColor = TABS.find((t) => t.id === tab)?.color ?? '#2440C9'

  return (
    <div
      className="relative"
      style={{
        background: `radial-gradient(120% 460px at 50% 0, ${activeColor}14, transparent 70%)`,
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: activeColor }}>
          Exploring
        </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.7rem]">
        {degree.name}
      </h1>

      <div
        role="tablist"
        aria-label="Explore sections"
        className="mt-8 flex flex-wrap gap-2"
      >
        {TABS.map(({ id, label, color }) => {
          const active = tab === id
          return (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="explore-tabpanel"
              onClick={() => selectTab(id)}
              style={active ? { backgroundColor: color, boxShadow: `0 10px 24px -10px ${color}` } : { ['--accent' as string]: color }}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'text-white'
                  : 'border border-hairline bg-white text-slate hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div
        id="explore-tabpanel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mt-8"
      >
        <Suspense fallback={<TabFallback />}>
          {tab === 'career-visa' ? (
            <CareerVisaTab degree={degree} />
          ) : tab === 'student-life' ? (
            <StudentLifeTab />
          ) : tab === 'pathways' ? (
            <PathwaysTab />
          ) : tab === 'true-cost' ? (
            <TrueCostTab />
          ) : (
            <EmergingTab degree={degree} />
          )}
        </Suspense>
        </div>
      </div>
    </div>
  )
}
