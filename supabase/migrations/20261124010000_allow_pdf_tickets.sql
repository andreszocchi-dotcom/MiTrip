-- Tickets can be PDFs as well as photos (boarding passes, e-tickets).
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif',
  'application/pdf'
]
where id = 'tickets';
