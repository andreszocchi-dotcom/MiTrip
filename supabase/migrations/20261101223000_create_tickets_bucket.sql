-- Ticket photos (PLAN.md feature 10). Files live in a private Storage bucket
-- at "<trip_id>/<plan_id>/<file>", and plans.ticket_image holds that path.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tickets',
  'tickets',
  false,
  10485760, -- 10 MB, enough for a full-size phone photo
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']
);

-- The trip id and plan id from a ticket's path, or null if the path isn't
-- shaped "<number>/<number>/...". Used by the rules below.
create function private.ticket_trip_id(p_name text)
returns bigint
language sql
immutable
set search_path = ''
as $$
  select case when split_part(p_name, '/', 1) ~ '^[0-9]+$'
    then split_part(p_name, '/', 1)::bigint end;
$$;

create function private.ticket_plan_id(p_name text)
returns bigint
language sql
immutable
set search_path = ''
as $$
  select case when split_part(p_name, '/', 2) ~ '^[0-9]+$'
    then split_part(p_name, '/', 2)::bigint end;
$$;

-- Same privacy as plans: anyone who can see the trip can see its tickets;
-- only the owner can add or remove them, and only under a plan in that trip.
create policy "Owners and members can view tickets" on storage.objects
  for select to authenticated
  using (bucket_id = 'tickets' and private.can_view_trip(private.ticket_trip_id(name)));

create policy "Owners can upload tickets" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'tickets'
    and private.is_trip_owner(private.ticket_trip_id(name))
    and private.trip_of_plan(private.ticket_plan_id(name)) = private.ticket_trip_id(name)
  );

create policy "Owners can delete tickets" on storage.objects
  for delete to authenticated
  using (bucket_id = 'tickets' and private.is_trip_owner(private.ticket_trip_id(name)));
