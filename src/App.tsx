import { MotionConfig } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { About } from './pages/About'
import { Explore } from './pages/Explore'
import { Home } from './pages/Home'
import { Methodology } from './pages/Methodology'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore/:degreeId" element={<Explore />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
