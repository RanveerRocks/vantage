import { useEffect, useMemo, useState } from 'react'

export interface Review {
  name: string
  role?: string
  rating: number // 1-5
  text: string
}

// Real, collected reviews go here once gathered. Kept empty by design — Vantage
// never ships invented testimonials. Until the first real ones land, the section
// shows an honest invite and lets a visitor add their own (stored on their device).
const SEED_REVIEWS: Review[] = []

const STORAGE_KEY = 'vantage:reviews'
const CARD_ACCENTS = ['#2440C9', '#0E7490', '#6D28D9', '#DB2777', '#C2410C', '#047857']

function loadLocalReviews(): Review[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is Review =>
        r && typeof r.name === 'string' && typeof r.text === 'string' && typeof r.rating === 'number',
    )
  } catch {
    return []
  }
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)))
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rounded} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden="true" className={i <= rounded ? 'text-gold' : 'text-hairline'}>
          ★
        </span>
      ))}
    </span>
  )
}

function ReviewCard({ review, accent }: { review: Review; accent: string }) {
  return (
    <figure
      className="flex h-full w-[280px] shrink-0 flex-col rounded-card border border-hairline bg-white p-5 shadow-soft sm:w-[320px]"
      style={{ ['--accent' as string]: accent }}
    >
      <Stars rating={review.rating} />
      <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-ink">
        <span className="text-slate">“</span>
        {review.text}
        <span className="text-slate">”</span>
      </blockquote>
      <figcaption className="mt-4 border-t border-hairline pt-3">
        <span className="block text-sm font-semibold text-ink">{review.name}</span>
        {review.role ? (
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-slate">
            {review.role}
          </span>
        ) : null}
      </figcaption>
      <span
        className="mt-3 block h-1 w-8 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
    </figure>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          onClick={() => onChange(i)}
          className={`text-xl leading-none transition-transform hover:scale-110 ${
            i <= value ? 'text-gold' : 'text-hairline hover:text-gold/60'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const [localReviews, setLocalReviews] = useState<Review[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [justAdded, setJustAdded] = useState<Review | null>(null)

  useEffect(() => {
    setLocalReviews(loadLocalReviews())
  }, [])

  const reviews = useMemo(() => [...localReviews, ...SEED_REVIEWS], [localReviews])
  const marquee = reviews.length >= 3
  // Slow the scroll for longer lists so each card stays readable.
  const duration = Math.max(28, reviews.length * 9)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedText = text.trim()
    if (!trimmedName || !trimmedText) return
    const review: Review = {
      name: trimmedName.slice(0, 40),
      role: role.trim().slice(0, 48) || undefined,
      rating,
      text: trimmedText.slice(0, 240),
    }
    const next = [review, ...localReviews]
    setLocalReviews(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage may be unavailable (private mode) — the review still shows this session */
    }
    setJustAdded(review)
    setName('')
    setRole('')
    setText('')
    setRating(5)
    setFormOpen(false)
  }

  const mailtoJustAdded = justAdded
    ? `mailto:ranveerchainani1@gmail.com?subject=${encodeURIComponent(
        'Vantage review to feature',
      )}&body=${encodeURIComponent(
        `${justAdded.text}\n\nby ${justAdded.name}${justAdded.role ? `, ${justAdded.role}` : ''} (${justAdded.rating}/5)`,
      )}`
    : ''

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">In their words</p>
          <h2
            id="reviews-heading"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            What students and families say
          </h2>
        </div>
        {!formOpen ? (
          <button
            type="button"
            onClick={() => {
              setFormOpen(true)
              setJustAdded(null)
            }}
            className="shrink-0 rounded-full bg-ultramarine px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-10px_#2440C9] transition-transform hover:-translate-y-0.5"
          >
            Add your review
          </button>
        ) : null}
      </div>

      {/* Add-review form */}
      {formOpen ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-card border border-hairline bg-white p-5 shadow-soft"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                required
                placeholder="Your name"
                className="w-full rounded-chip border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ultramarine"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
                Role <span className="normal-case tracking-normal text-slate/70">(optional)</span>
              </span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={48}
                placeholder="Parent · CS applicant · MS '26"
                className="w-full rounded-chip border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ultramarine"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
              Your review
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={240}
              required
              rows={3}
              placeholder="What did Vantage help you see?"
              className="w-full resize-none rounded-card border border-hairline bg-paper px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-ultramarine"
            />
            <span className="mt-1 block text-right font-mono text-[10px] text-slate">
              {text.length}/240
            </span>
          </label>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
                Rating
              </span>
              <StarPicker value={rating} onChange={setRating} />
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-ultramarine px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-10px_#2440C9] transition-transform hover:-translate-y-0.5"
              >
                Post review
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {/* Thanks note after adding */}
      {justAdded ? (
        <div className="mt-6 rounded-card border border-hairline bg-white p-4 text-sm text-slate">
          Thanks, <strong className="text-ink">{justAdded.name}</strong>. Your review now shows below
          on this device.{' '}
          <a href={mailtoJustAdded} className="font-medium text-ultramarine underline underline-offset-2">
            Send it to us
          </a>{' '}
          to have it featured for everyone.
        </div>
      ) : null}

      {/* Carousel / list / empty state */}
      {reviews.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-hairline bg-white/60 p-8 text-center">
          <p className="text-sm text-slate">
            No reviews yet. If Vantage helped you see something you would have missed,{' '}
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="font-medium text-ultramarine underline underline-offset-2"
            >
              be the first to share it
            </button>
            .
          </p>
        </div>
      ) : marquee ? (
        <div className="marquee-viewport mt-8" role="region" aria-label="Reviews">
          <div className="marquee-track gap-4" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
            {reviews.map((review, i) => (
              <ReviewCard key={`a-${i}`} review={review} accent={CARD_ACCENTS[i % CARD_ACCENTS.length]} />
            ))}
            {/* Duplicate track for a seamless loop. */}
            {reviews.map((review, i) => (
              <ReviewCard
                key={`b-${i}`}
                review={review}
                accent={CARD_ACCENTS[i % CARD_ACCENTS.length]}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} accent={CARD_ACCENTS[i % CARD_ACCENTS.length]} />
          ))}
        </div>
      )}
    </section>
  )
}
