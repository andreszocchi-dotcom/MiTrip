// A Google Maps search link for a place name or address. It needs no API
// key: tapping it opens Google Maps (or the app) on that search.
export function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Google Maps directions links accept at most 9 waypoints between the start
// and the destination. The start is left out on purpose, so Google uses the
// phone's current location, which leaves room for 10 stops per link.
export const MAX_STOPS_PER_ROUTE = 10;

// The day's stops in plan order: every plan with an address, skipping a stop
// that repeats the one right before it (like "Check in" then "Hotel breakfast"
// at the same hotel).
export function routeStops(plans: { address: string | null }[]) {
  const stops: string[] = [];
  for (const plan of plans) {
    const address = plan.address?.trim();
    if (address && address.toLowerCase() !== stops.at(-1)?.toLowerCase()) {
      stops.push(address);
    }
  }
  return stops;
}

// One Google Maps directions link from where you are now through each stop
// in order. Travel mode is left to Google, so you can switch between driving,
// walking, and transit in the app.
export function googleMapsRouteUrl(stops: string[]) {
  const params = new URLSearchParams({ api: "1", destination: stops.at(-1) ?? "" });
  if (stops.length > 1) {
    params.set("waypoints", stops.slice(0, -1).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

// Days with more than 10 stops get split into parts. Each later part starts
// at the last stop of the part before, so the route stays connected.
export function dayRouteLinks(stops: string[]) {
  if (stops.length < 2) return [];
  const links: string[] = [];
  for (let start = 0; start < stops.length - 1; start += MAX_STOPS_PER_ROUTE - 1) {
    const part = stops.slice(start, start + MAX_STOPS_PER_ROUTE);
    // Part 1 starts at your location; later parts start at the previous end.
    links.push(start === 0 ? googleMapsRouteUrl(part) : googleMapsLegUrl(part));
  }
  return links;
}

// A directions link that starts at a fixed place (not your location).
function googleMapsLegUrl(stops: string[]) {
  const params = new URLSearchParams({
    api: "1",
    origin: stops[0],
    destination: stops.at(-1) ?? "",
  });
  if (stops.length > 2) {
    params.set("waypoints", stops.slice(1, -1).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
