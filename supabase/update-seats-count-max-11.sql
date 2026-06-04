-- Jei jau paleidote add-seats-count.sql su limitu 5 — atnaujink į 11
-- Supabase SQL Editor → Run

alter table reservations
  drop constraint if exists reservations_seats_count_check;

alter table reservations
  add constraint reservations_seats_count_check
  check (
    (status = 'cancelled' and seats_count >= 0 and seats_count <= 11)
    or (status = 'active' and seats_count >= 1 and seats_count <= 11)
  );
