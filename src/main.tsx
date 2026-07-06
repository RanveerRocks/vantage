import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { loadData } from './lib/data'
import './index.css'

declare global {
  interface Window {
    // Vite HMR re-executes this entry when /src/data JSON changes; reuse the
    // root so createRoot runs only once per page load.
    __vantageRoot?: Root
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}
const root = window.__vantageRoot ?? createRoot(rootElement)
window.__vantageRoot = root

function BootError({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">
        Data validation failed
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Vantage couldn&rsquo;t start
      </h1>
      <p className="mt-3 text-slate">
        A data file in <span className="font-mono text-sm">/src/data</span> failed validation. Fix
        the issue below and reload the page.
      </p>
      <pre className="mt-5 overflow-auto whitespace-pre-wrap rounded-card border border-hairline bg-white p-4 font-mono text-xs leading-relaxed">
        {message}
      </pre>
    </div>
  )
}

try {
  loadData()
  root.render(
    <StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
} catch (error) {
  root.render(<BootError message={error instanceof Error ? error.message : String(error)} />)
}
