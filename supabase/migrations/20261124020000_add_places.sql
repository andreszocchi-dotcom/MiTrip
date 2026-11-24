-- Where a trip (and optionally each day) takes place, for weather and time
-- zones. Looked up by city name (Open-Meteo geocoding), so each place keeps
-- its display name, coordinates, and IANA time zone (e.g. Australia/Sydney).
-- A day without its own place uses the trip's.

alter table public.trips
  add column place_name text,
  add column latitude double precision check (latitude between -90 and 90),
  add column longitude double precision check (longitude between -180 and 180),
  add column timezone text;

alter table public.days
  add column place_name text,
  add column latitude double precision check (latitude between -90 and 90),
  add column longitude double precision check (longitude between -180 and 180),
  add column timezone text;
