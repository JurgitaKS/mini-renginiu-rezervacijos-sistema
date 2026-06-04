-- Paleisk Supabase SQL Editor, jei renginių kūrimas rodo "violates row-level security policy"
-- Leidžia administratoriui kurti ir šalinti renginius

-- Nuimame senas politikas
drop policy if exists "events_insert_authenticated" on events;
drop policy if exists "events_delete_authenticated" on events;

-- Naujos politikos renginių valdymui
create policy "events_insert_authenticated"
  on events
  for insert
  to authenticated
  with check (
    total_seats >= 1
    and available_seats >= 0
    and available_seats <= total_seats
  );

create policy "events_delete_authenticated"
  on events
  for delete
  to authenticated
  using (true);
