-- A sixth trip color: City (an evening skyline scene).
alter table public.trips drop constraint trips_theme_check;
alter table public.trips add constraint trips_theme_check
  check (theme in ('ocean', 'sand', 'forest', 'sunset', 'mountain', 'city'));
