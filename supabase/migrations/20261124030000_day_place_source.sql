-- How a day got its city: 'auto' (found from the day's first plan address)
-- or 'manual' (picked by hand, which the automatic lookup never overwrites).
-- place_from keeps the address an automatic city came from, so a new first
-- address triggers a new lookup.
alter table public.days
  add column place_source text check (place_source in ('auto', 'manual')),
  add column place_from text;
