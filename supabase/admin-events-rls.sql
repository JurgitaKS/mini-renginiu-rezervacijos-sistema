-- Admin CRUD events lentelei. Paleisk po admin-users.sql.
-- events UPDATE rezervacijoms (available_seats) lieka events_update_authenticated.

drop policy if exists "events_insert_authenticated" on events;
drop policy if exists "events_insert_admin" on events;

create policy "events_insert_admin"
  on events
  for insert
  to authenticated
  with check (
    public.is_admin_user()
    and total_seats >= 1
    and available_seats >= 0
    and available_seats <= total_seats
  );

drop policy if exists "events_update_admin" on events;

create policy "events_update_admin"
  on events
  for update
  to authenticated
  using (public.is_admin_user())
  with check (
    total_seats >= 1
    and available_seats >= 0
    and available_seats <= total_seats
  );

drop policy if exists "events_delete_admin" on events;

create policy "events_delete_admin"
  on events
  for delete
  to authenticated
  using (public.is_admin_user());
