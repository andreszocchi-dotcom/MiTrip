-- Star a whole trip, the same way plans are starred (IDEAS.md: "Star trips
-- as well as plans"). Its own table keeps the plan stars table unchanged.

create table public.trip_stars (
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  trip_id bigint not null references public.trips (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, trip_id)
);

create index on public.trip_stars (trip_id);

-- Stars are personal: each user sees and manages only their own, and can
-- star only trips they can view (their own or shared with them).
alter table public.trip_stars enable row level security;

create policy "Users can view their own trip stars" on public.trip_stars
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users can star trips they can view" on public.trip_stars
  for insert to authenticated
  with check (user_id = (select auth.uid()) and private.can_view_trip(trip_id));
create policy "Users can remove their own trip stars" on public.trip_stars
  for delete to authenticated
  using (user_id = (select auth.uid()));
