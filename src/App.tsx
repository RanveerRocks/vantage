import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CrosshairGlyph } from './components/shared/CrosshairGlyph'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

// Home stays static for the fastest first paint; the rest code-splits.
const Explore = lazy(() => import('./pages/Explore').then((m) => ({ default: m.Explore })))
const Methodology = lazy(() =>
  import('./pages/Methodology').then((m) => ({ default: m.Methodology })),
)
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div
        className="flex flex-col items-center gap-3 rounded-card border border-dashed border-hairline p-14 text-center"
        role="status"
      >
        <CrosshairGlyph size={22} />
        <p className="font-mono text-xs uppercase tracking-widest text-slate">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore/:degreeId" element={<Explore />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </MotionConfig>
  )
}
