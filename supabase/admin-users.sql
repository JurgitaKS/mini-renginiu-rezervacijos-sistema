-- Admin vartotojai (el. paštai). Paleisk po schema.sql.
-- Įrašyk admin el. paštus mažosiomis raidėmis, kaip Supabase Auth.

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

alter table admin_users enable row level security;

drop policy if exists "admin_users_select_own" on admin_users;
create policy "admin_users_select_own"
  on admin_users
  for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Pavyzdys: insert into admin_users (email) values ('jusu@elpastas.lt');

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
