// A plan's ticket file (plans.ticket_image) is a photo or a PDF. The stored
// path keeps the file's extension, so ".pdf" tells them apart.
export function isPdfTicket(path: string | null | undefined) {
  return Boolean(path?.toLowerCase().endsWith(".pdf"));
}

// An Apple Wallet pass (.pkpass), like the boarding pass airlines email.
// Opened in Safari on an iPhone, it shows in Wallet.
export function isWalletPass(path: string | null | undefined) {
  return Boolean(path?.toLowerCase().endsWith(".pkpass"));
}
