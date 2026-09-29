import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  SEED_REVIEWS,
  fetchApprovedReviews,
  isSupabaseConfigured,
  submitReview,
  type Review,
} from '../../lib/reviews'

const STORAGE_KEY = 'vantage:reviews'
const CARD_ACCENTS = ['#2440C9', '#0E7490', '#6D28D9', '#DB2777', '#C2410C', '#047857']

// Local-only fallback storage, used when the Supabase backend is not configured.
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

function CarouselArrow({
  dir,
  accent,
  onClick,
}: {
  dir: 'prev' | 'next'
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous review' : 'Next review'}
      style={{ ['--accent' as string]: accent }}
      className="z-10 hidden h-9 w-9 shrink-0 place-content-center rounded-full border border-hairline bg-white text-slate shadow-soft transition-colors hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white sm:grid"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 90 : -90, opacity: 0, scale: 0.94 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -90 : 90, opacity: 0, scale: 0.94 }),
}

// A colourful, auto-advancing carousel: each review slides in over an aurora wash
// that shifts to the review's accent colour, echoing the home page palette.
function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const reduced = useReducedMotion() ?? false
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const count = reviews.length

  const goTo = useCallback(
    (to: number, direction: number) => {
      setDir(direction)
      setIndex(((to % count) + count) % count)
    },
    [count],
  )

  // Keep the index valid if the list changes size (e.g. after fetch).
  useEffect(() => {
    if (index > count - 1) setIndex(0)
  }, [count, index])

  // Auto-advance, paused on hover/focus and under reduced motion.
  useEffect(() => {
    if (reduced || paused || count < 2) return
    const t = window.setTimeout(() => goTo(index + 1, 1), 4800)
    return () => window.clearTimeout(t)
  }, [index, paused, reduced, count, goTo])

  if (count === 0) return null

  // Reduced motion: a calm, static grid instead of any moving carousel.
  if (reduced) {
    return (
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} accent={CARD_ACCENTS[i % CARD_ACCENTS.length]} />
        ))}
      </div>
    )
  }

  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
  const active = reviews[index]

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Full-width aurora wash that shifts to each review's accent, reaching
          the section edges like the home page hero. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2"
        animate={{
          background: `radial-gradient(42% 78% at 15% 42%, ${accent}24, transparent 60%), radial-gradient(42% 78% at 85% 58%, ${accent}1e, transparent 60%), radial-gradient(60% 70% at 50% 34%, ${accent}12, transparent 66%)`,
        }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <div className="relative flex items-center justify-center gap-3 py-2 sm:gap-5">
        {count > 1 ? (
          <CarouselArrow dir="prev" accent={accent} onClick={() => goTo(index - 1, -1)} />
        ) : null}

        {/* Grid-stacked so both slides share one cell: the card auto-sizes to its
            content (no clipping) while they cross-fade and slide. */}
        <div className="grid w-full max-w-2xl">
          <AnimatePresence custom={dir} initial={false}>
            <motion.figure
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 320, damping: 32 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.3 },
              }}
              className="col-start-1 row-start-1 flex flex-col justify-center rounded-card border border-hairline bg-white px-6 py-6 text-center sm:px-9 sm:py-7"
              style={{ borderTop: `3px solid ${accent}`, boxShadow: `0 20px 46px -26px ${accent}66` }}
            >
              <div className="flex justify-center">
                <Stars rating={active.rating} />
              </div>
              <blockquote className="mx-auto mt-3.5 max-w-[46ch] text-[13.5px] leading-relaxed text-ink sm:text-[15px]">
                <span style={{ color: accent }}>“</span>
                {active.text}
                <span style={{ color: accent }}>”</span>
              </blockquote>
              <figcaption className="mt-4">
                <span className="block text-sm font-semibold text-ink">{active.name}</span>
                {active.role ? (
                  <span
                    className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: accent }}
                  >
                    {active.role}
                  </span>
                ) : null}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {count > 1 ? (
          <CarouselArrow dir="next" accent={accent} onClick={() => goTo(index + 1, 1)} />
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-5 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show review ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className="h-2 rounded-full transition-all duration-300"
              style={
                i === index
                  ? { width: 22, backgroundColor: CARD_ACCENTS[i % CARD_ACCENTS.length] }
                  : { width: 8, backgroundColor: '#E3E6E1' }
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

interface Thanks {
  mode: 'pending' | 'local'
  name: string
  review?: Review
}

export function ReviewsSection() {
  const [remoteReviews, setRemoteReviews] = useState<Review[]>([])
  const [localReviews, setLocalReviews] = useState<Review[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [thanks, setThanks] = useState<Thanks | null>(null)

  useEffect(() => {
    if (isSupabaseConfigured) {
      let active = true
      fetchApprovedReviews().then((rows) => {
        if (active) setRemoteReviews(rows)
      })
      return () => {
        active = false
      }
    }
    setLocalReviews(loadLocalReviews())
  }, [])

  const reviews = useMemo(
    () =>
      isSupabaseConfigured
        ? [...remoteReviews, ...SEED_REVIEWS]
        : [...localReviews, ...SEED_REVIEWS],
    [remoteReviews, localReviews],
  )

  function resetForm() {
    setName('')
    setRole('')
    setText('')
    setRating(5)
    setFormOpen(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedText = text.trim()
    if (!trimmedName || !trimmedText) return
    const review: Review = {
      name: trimmedName.slice(0, 60),
      role: role.trim().slice(0, 48) || undefined,
      rating,
      text: trimmedText.slice(0, 400),
    }

    if (isSupabaseConfigured) {
      setSubmitting(true)
      setSubmitError(false)
      const result = await submitReview(review)
      setSubmitting(false)
      if (result === 'ok') {
        setThanks({ mode: 'pending', name: review.name })
        resetForm()
      } else {
        setSubmitError(true)
      }
      return
    }

    // Fallback with no backend: keep the review on this device only.
    const next = [review, ...localReviews]
    setLocalReviews(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage may be unavailable (private mode) — the review still shows this session */
    }
    setThanks({ mode: 'local', name: review.name, review })
    resetForm()
  }

  const mailtoLocal =
    thanks?.mode === 'local' && thanks.review
      ? `mailto:ranveerchainani1@gmail.com?subject=${encodeURIComponent(
          'Vantage review to feature',
        )}&body=${encodeURIComponent(
          `${thanks.review.text}\n\nby ${thanks.review.name}${thanks.review.role ? `, ${thanks.review.role}` : ''} (${thanks.review.rating}/5)`,
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
              setThanks(null)
              setSubmitError(false)
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
                maxLength={60}
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
              maxLength={400}
              required
              rows={3}
              placeholder="What did Vantage help you see?"
              className="w-full resize-none rounded-card border border-hairline bg-paper px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-ultramarine"
            />
            <span className="mt-1 block text-right font-mono text-[10px] text-slate">
              {text.length}/400
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
                onClick={() => {
                  setFormOpen(false)
                  setSubmitError(false)
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ultramarine px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-10px_#2440C9] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? 'Posting…' : 'Post review'}
              </button>
            </div>
          </div>

          {isSupabaseConfigured ? (
            <p className="mt-3 text-[11px] leading-relaxed text-slate">
              Reviews are checked before they appear, so yours will show up here once it&rsquo;s
              approved.
            </p>
          ) : null}
          {submitError ? (
            <p className="mt-2 text-[13px] font-medium text-coral">
              Something went wrong sending that. Please try again in a moment.
            </p>
          ) : null}
        </form>
      ) : null}

      {/* Thanks note after submitting */}
      {thanks ? (
        <div className="mt-6 rounded-card border border-hairline bg-white p-4 text-sm text-slate">
          {thanks.mode === 'pending' ? (
            <>
              Thanks, <strong className="text-ink">{thanks.name}</strong>! Your review has been
              submitted and will appear here once it&rsquo;s approved.
            </>
          ) : (
            <>
              Thanks, <strong className="text-ink">{thanks.name}</strong>. Your review now shows below
              on this device.{' '}
              <a href={mailtoLocal} className="font-medium text-ultramarine underline underline-offset-2">
                Send it to us
              </a>{' '}
              to have it featured for everyone.
            </>
          )}
        </div>
      ) : null}

      {/* Colourful auto-advancing carousel, or an honest empty state */}
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
      ) : (
        <ReviewsCarousel reviews={reviews} />
      )}
    </section>
  )
}
