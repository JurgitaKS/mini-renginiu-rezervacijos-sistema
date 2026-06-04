-- Paleisk Supabase Dashboard → SQL Editor → New query → Run
-- Lentelės: events, reservations

-- ========== LENTELĖS ==========

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_time time not null,
  location text not null,
  category text not null,
  price numeric default 0,
  total_seats integer not null,
  available_seats integer not null,
  created_at timestamp with time zone default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status text not null default 'active',
  seats_count integer not null default 1,
  cancelled_seats integer not null default 0,
  created_at timestamp with time zone default now(),
  unique (user_id, event_id),
  constraint reservations_status_check check (status in ('active', 'cancelled')),
  constraint reservations_seats_count_check check (
    (status = 'cancelled' and seats_count >= 0 and seats_count <= 11)
    or (status = 'active' and seats_count >= 1 and seats_count <= 11)
  )
);

-- ========== INDEKSAI ==========

create index if not exists idx_events_category on events (category);
create index if not exists idx_events_event_date on events (event_date);
create index if not exists idx_reservations_user_id on reservations (user_id);
create index if not exists idx_reservations_event_id on reservations (event_id);

-- ========== ROW LEVEL SECURITY ==========

alter table events enable row level security;
alter table reservations enable row level security;

-- Renginius gali skaityti visi (įskaitant anon — be prisijungimo)
create policy "events_select_public"
  on events for select
  to anon, authenticated
  using (true);

-- Atnaujinti laisvų vietų skaičių po rezervacijos
create policy "events_update_authenticated"
  on events for update
  to authenticated
  using (true)
  with check (available_seats >= 0);

-- Rezervacijas: vartotojas mato ir kuria tik savo
create policy "reservations_select_own"
  on reservations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "reservations_insert_own"
  on reservations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "reservations_update_own"
  on reservations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reservations_delete_own"
  on reservations for delete
  to authenticated
  using (auth.uid() = user_id);
