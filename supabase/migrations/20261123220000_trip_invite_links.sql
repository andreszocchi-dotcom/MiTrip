-- Trip members by invite link (PLAN.md feature 8, IDEAS.md "Trip members").
-- The owner creates a private link; whoever opens it while logged in joins
-- the trip as a viewer. The trip_members table and its privacy rules
-- already exist (20261030000937_create_trip_tables.sql).

alter table public.trips add column invite_code text unique
  check (invite_code is null or length(invite_code) >= 16);

-- Join a trip by its invite code. It runs with elevated rights because the
-- person joining can't see the trip yet. Returns the trip id, or null when
-- the code is unknown or was turned off. The owner opening their own link
-- just gets the trip id back.
create function public.join_trip(p_code text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_trip_id bigint;
  v_owner uuid;
begin
  if (select auth.uid()) is null then
    return null;
  end if;

  select id, owner_id into v_trip_id, v_owner
  from public.trips
  where invite_code = p_code;

  if v_trip_id is null then
    return null;
  end if;

  if v_owner <> (select auth.uid()) then
    insert into public.trip_members (trip_id, user_id)
    values (v_trip_id, (select auth.uid()))
    on conflict do nothing;
  end if;

  return v_trip_id;
end;
$$;

revoke execute on function public.join_trip(text) from public, anon;
grant execute on function public.join_trip(text) to authenticated;

-- Everyone on a trip (owner and members) with their email, for the People
-- list. Only people who can view the trip get any rows back; users can
-- otherwise read only their own row in public.users.
create function public.trip_people(p_trip_id bigint)
returns table (user_id uuid, email text, role text)
language sql
security definer
stable
set search_path = ''
as $$
  select u.id, u.email, 'owner'
  from public.trips t
  join public.users u on u.id = t.owner_id
  where t.id = p_trip_id and private.can_view_trip(p_trip_id)
  union all
  select u.id, u.email, m.role
  from public.trip_members m
  join public.users u on u.id = m.user_id
  where m.trip_id = p_trip_id and private.can_view_trip(p_trip_id);
$$;

revoke execute on function public.trip_people(bigint) from public, anon;
grant execute on function public.trip_people(bigint) to authenticated;

-- Members can leave a trip on their own (owners could already remove them).
create policy "Members can leave trips" on public.trip_members
  for delete to authenticated
  using (user_id = (select auth.uid()));
