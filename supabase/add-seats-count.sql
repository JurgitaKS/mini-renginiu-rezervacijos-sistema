-- Pridėti seats_count stulpelį (paleisk Supabase SQL Editor)
-- Vienas vartotojas vienam renginiui: nuo 1 iki 11 vietų

alter table reservations
  add column if not exists seats_count integer not null default 1;

alter table reservations
  drop constraint if exists reservations_seats_count_check;

alter table reservations
  add constraint reservations_seats_count_check
  check (
    (status = 'cancelled' and seats_count >= 0 and seats_count <= 11)
    or (status = 'active' and seats_count >= 1 and seats_count <= 11)
  );

update reservations
set seats_count = 1
where seats_count is null;
