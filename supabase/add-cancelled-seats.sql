-- Stulpelis cancelled_seats (paleisk Supabase SQL Editor, jei dar nepridėjote)

alter table reservations
  add column if not exists cancelled_seats integer not null default 0;

update reservations
set cancelled_seats = 0
where cancelled_seats is null;
