-- Paleisk Supabase SQL Editor, jei /events rodo 0 renginių, nors Table Editor mato duomenis.
-- Priežastis dažniausiai: RLS neleidžia anon (viešam) skaityti events.

alter table events enable row level security;

drop policy if exists "events_select_public" on events;
drop policy if exists "Allow public read access on events" on events;

create policy "events_select_public"
  on events
  for select
  to anon, authenticated
  using (true);
