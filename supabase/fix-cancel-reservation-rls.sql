-- Paleisk Supabase SQL Editor, jei atšaukiant rezervaciją gauni RLS klaidą.
-- Reikalinga, kad prisijungęs vartotojas galėtų atnaujinti savo rezervaciją ir renginio vietas.

-- Rezervacijos statuso keitimas (active → cancelled)
drop policy if exists "reservations_update_own" on reservations;
create policy "reservations_update_own"
  on reservations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Renginio available_seats padidinimas po atšaukimo
drop policy if exists "events_update_authenticated" on events;
create policy "events_update_authenticated"
  on events
  for update
  to authenticated
  using (true)
  with check (available_seats >= 0);
