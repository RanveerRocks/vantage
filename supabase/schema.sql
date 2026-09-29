-- Vantage reviews: public submissions that only appear after moderation.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  role text check (char_length(role) <= 60),
  rating int not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 1 and 280),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_status_created_idx
  on public.reviews (status, created_at desc);

-- Lock the table down; the policies below are the only public access.
alter table public.reviews enable row level security;

-- Anyone can read ONLY approved reviews.
create policy "read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

-- Anyone can submit a review, but only as 'pending' (they cannot pre-approve it).
create policy "insert pending reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending');

-- No update/delete policies exist for the public, so visitors can never approve,
-- edit, or delete a review. Moderation happens in the Supabase Table Editor (or
-- with the service-role key), which bypasses Row Level Security.
