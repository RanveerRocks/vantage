import { supabase, isSupabaseConfigured } from './supabase'

export interface Review {
  name: string
  role?: string
  rating: number // 1-5
  text: string
}

export { isSupabaseConfigured }

// Curated reviews that always show, independent of the backend. Kept empty by
// design — Vantage never ships invented testimonials. Approved reviews now come
// from Supabase; this stays empty unless a review must be hard-coded.
export const SEED_REVIEWS: Review[] = []

interface ReviewRow {
  name: string
  role: string | null
  rating: number
  text: string
}

/** Approved reviews from Supabase, newest first. Empty when unconfigured or on error. */
export async function fetchApprovedReviews(): Promise<Review[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('reviews')
    .select('name, role, rating, text')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error || !data) return []
  return (data as ReviewRow[]).map((r) => ({
    name: r.name,
    role: r.role ?? undefined,
    rating: r.rating,
    text: r.text,
  }))
}

export type SubmitResult = 'ok' | 'error' | 'unconfigured'

/** Submit a review as pending. It only appears after a moderator approves it. */
export async function submitReview(review: Review): Promise<SubmitResult> {
  if (!supabase) return 'unconfigured'
  const { error } = await supabase.from('reviews').insert({
    name: review.name,
    role: review.role ?? null,
    rating: review.rating,
    text: review.text,
    status: 'pending',
  })
  return error ? 'error' : 'ok'
}
