-- Flights: a flight number on plans (for live status and the airline link),
-- and Apple Wallet boarding passes (.pkpass) as ticket files.
alter table public.plans
  add column flight_number text check (flight_number is null or length(flight_number) <= 12);

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif',
  'application/pdf',
  'application/vnd.apple.pkpass'
]
where id = 'tickets';
