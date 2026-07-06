import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ultramarine">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Nothing plotted here
      </h1>
      <p className="mt-3 max-w-xl text-slate">
        That page doesn&rsquo;t exist. Head back to the home page to pick a degree and start
        exploring.
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
