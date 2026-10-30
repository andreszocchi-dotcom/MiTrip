// A Google Maps search link for a place name or address. It needs no API
// key: tapping it opens Google Maps (or the app) on that search.
export function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
