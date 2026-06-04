-- Renginio statusas: active | cancelled
-- Paleisk, jei events lentelėje dar nėra stulpelio status.

alter table events
  add column if not exists status text not null default 'active';

alter table events
  drop constraint if exists events_status_check;

alter table events
  add constraint events_status_check
  check (status in ('active', 'cancelled'));

update events set status = 'active' where status is null;
