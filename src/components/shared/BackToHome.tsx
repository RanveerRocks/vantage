import { Link } from 'react-router-dom'

/** A cartographic "return to home" link for the standalone pages (About, Methodology). */
export function BackToHome({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1.5 rounded-chip font-mono text-[11px] uppercase tracking-[0.16em] text-slate transition-colors hover:text-ultramarine ${className}`}
    >
      <span aria-hidden="true" className="text-sm leading-none">&larr;</span>
      Back to home
    </Link>
  )
}
