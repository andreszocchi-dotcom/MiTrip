// A plan's ticket file (plans.ticket_image) is a photo or a PDF. The stored
// path keeps the file's extension, so ".pdf" tells them apart.
export function isPdfTicket(path: string | null | undefined) {
  return Boolean(path?.toLowerCase().endsWith(".pdf"));
}
