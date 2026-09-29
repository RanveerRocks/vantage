import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The URL and anon (public) key are safe to ship in the client bundle: the anon
// key only grants what the table's Row Level Security policies allow (read
// approved reviews, insert pending ones). If the env vars are absent the client
// is null and the app falls back to its offline, local-only review behaviour.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = supabase !== null
