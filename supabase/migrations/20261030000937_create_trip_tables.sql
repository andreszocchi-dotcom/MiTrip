-- MiTrip data model (PLAN.md section 3).
-- users 1-many trips 1-many days 1-many plans.
-- stars: users many-many plans. trip_members: users many-many trips.

create table public.trips (
  id bigint generated always as identity primary key,
  owner_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  start_date date not null,
  end_date date not null,
  theme text not null default 'ocean'
    check (theme in ('ocean', 'sand', 'forest', 'sunset', 'mountain')),
  google_maps_list_url text,
  itinerary_text text,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.days (
  id bigint generated always as identity primary key,
  trip_id bigint not null references public.trips (id) on delete cascade,
  date date not null,
  greeting text,
  summary text,
  unique (trip_id, date)
);

create table public.plans (
  id bigint generated always as identity primary key,
  day_id bigint not null references public.days (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  type text not null
    check (type in ('flight', 'hotel', 'reservation', 'ticket', 'activity')),
  start_time time,
  end_time time,
  address text,
  confirmation_number text,
  ticket_url text,
  ticket_image text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.stars (
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  plan_id bigint not null references public.plans (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, plan_id)
);

create table public.trip_members (
  trip_id bigint not null references public.trips (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null default 'viewer' check (role in ('viewer')),
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create index on public.trips (owner_id);
create index on public.days (trip_id);
create index on public.plans (day_id);
create index on public.stars (plan_id);
create index on public.trip_members (user_id);

-- Creating a trip (or changing its dates) adds one day per date in range.
-- Days outside a new range are removed only if they have no plans.
create function public.sync_trip_days()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  insert into public.days (trip_id, date)
  select new.id, d::date
  from generate_series(new.start_date, new.end_date, interval '1 day') as d
  on conflict (trip_id, date) do nothing;

  delete from public.days
  where trip_id = new.id
    and (date < new.start_date or date > new.end_date)
    and not exists (select 1 from public.plans where plans.day_id = days.id);

  return new;
end;
$$;

create trigger sync_trip_days
  after insert or update of start_date, end_date on public.trips
  for each row execute function public.sync_trip_days();

-- Helper functions for the privacy rules. They live in a private schema
-- (not reachable through the website API) and run with elevated rights so
-- the trips and trip_members rules can check each other without looping.
create schema private;
grant usage on schema private to authenticated;

create function private.is_trip_owner(p_trip_id bigint)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.trips
    where id = p_trip_id and owner_id = (select auth.uid())
  );
$$;

create function private.can_view_trip(p_trip_id bigint)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.trips
    where id = p_trip_id and owner_id = (select auth.uid())
  ) or exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = (select auth.uid())
  );
$$;

create function private.trip_of_day(p_day_id bigint)
returns bigint
language sql
security definer
stable
set search_path = ''
as $$
  select trip_id from public.days where id = p_day_id;
$$;

create function private.trip_of_plan(p_plan_id bigint)
returns bigint
language sql
security definer
stable
set search_path = ''
as $$
  select d.trip_id
  from public.plans p
  join public.days d on d.id = p.day_id
  where p.id = p_plan_id;
$$;

-- Row Level Security: a user sees a trip (and its days and plans) only if
-- they own it or are a member. Only the owner can change it.
alter table public.trips enable row level security;
alter table public.days enable row level security;
alter table public.plans enable row level security;
alter table public.stars enable row level security;
alter table public.trip_members enable row level security;

create policy "Owners and members can view trips" on public.trips
  for select to authenticated
  using (owner_id = (select auth.uid()) or private.can_view_trip(id));
create policy "Users can create their own trips" on public.trips
  for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "Owners can update trips" on public.trips
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Owners can delete trips" on public.trips
  for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Owners and members can view days" on public.days
  for select to authenticated
  using (private.can_view_trip(trip_id));
create policy "Owners can add days" on public.days
  for insert to authenticated
  with check (private.is_trip_owner(trip_id));
create policy "Owners can update days" on public.days
  for update to authenticated
  using (private.is_trip_owner(trip_id))
  with check (private.is_trip_owner(trip_id));
create policy "Owners can delete days" on public.days
  for delete to authenticated
  using (private.is_trip_owner(trip_id));

create policy "Owners and members can view plans" on public.plans
  for select to authenticated
  using (private.can_view_trip(private.trip_of_day(day_id)));
create policy "Owners can add plans" on public.plans
  for insert to authenticated
  with check (private.is_trip_owner(private.trip_of_day(day_id)));
create policy "Owners can update plans" on public.plans
  for update to authenticated
  using (private.is_trip_owner(private.trip_of_day(day_id)))
  with check (private.is_trip_owner(private.trip_of_day(day_id)));
create policy "Owners can delete plans" on public.plans
  for delete to authenticated
  using (private.is_trip_owner(private.trip_of_day(day_id)));

-- Stars are personal: each user sees and manages only their own, and can
-- star only plans they can view.
create policy "Users can view their own stars" on public.stars
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users can star plans they can view" on public.stars
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and private.can_view_trip(private.trip_of_plan(plan_id))
  );
create policy "Users can remove their own stars" on public.stars
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- Members see their own memberships; owners see and manage their trip's.
create policy "Members and owners can view memberships" on public.trip_members
  for select to authenticated
  using (user_id = (select auth.uid()) or private.is_trip_owner(trip_id));
create policy "Owners can add members" on public.trip_members
  for insert to authenticated
  with check (private.is_trip_owner(trip_id));
create policy "Owners can remove members" on public.trip_members
  for delete to authenticated
  using (private.is_trip_owner(trip_id));
