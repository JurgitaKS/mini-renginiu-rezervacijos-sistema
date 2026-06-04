-- Paleisk Supabase SQL Editor, jei rezervacija rodo klaidą apie RLS / vietų atnaujinimą.
-- Leidžia prisijungusiems vartotojams atnaujinti events.available_seats.

drop policy if exists "events_update_authenticated" on events;

create policy "events_update_authenticated"
  on events
  for update
  to authenticated
  using (true)
  with check (available_seats >= 0);

-- Atsarginis atšaukimas, jei nepavyko atnaujinti vietų skaičiaus
drop policy if exists "reservations_delete_own" on reservations;
create policy "reservations_delete_own"
  on reservations
  for delete
  to authenticated
  using (auth.uid() = user_id);
