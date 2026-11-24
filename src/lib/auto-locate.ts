import type { SupabaseClient } from "@supabase/supabase-js";
import { sortPlansByTime } from "@/lib/plan-order";
import { isValidTimeZone, NO_PLACE, type Place } from "@/lib/places";
import type { Database } from "@/lib/supabase/database.types";

// Finds each day's city from its first plan address (the same addresses
// behind the Google Maps buttons), so weather and local time work without
// typing a city. Runs in the background after a page loads (see after() in
// the trip and day pages, and after saving plans).
//
// Addresses go to OpenStreetMap's Nominatim, which asks for at most one
// request per second and an identifying User-Agent; time zones come from
// Open-Meteo for the found coordinates. Days with a hand-picked city
// (place_source 'manual') are never changed.

const USER_AGENT = "MiTrip/1.0 (+https://mi-trip-kappa.vercel.app)";
const MAX_LOOKUPS_PER_RUN = 20;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type NominatimResult = {
  lat: string;
  lon: string;
  address?: Record<string, string | undefined>;
};

// Address -> city name and coordinates, or null if nothing matched.
async function lookUpAddress(address: string): Promise<Omit<Place, "timezone"> | null> {
  const params = new URLSearchParams({ q: address, format: "jsonv2", limit: "1", addressdetails: "1" });
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const [hit] = (await res.json()) as NominatimResult[];
    if (!hit) return null;
    const a = hit.address ?? {};
    const city = a.city ?? a.town ?? a.village ?? a.municipality ?? a.suburb ?? a.county ?? a.state;
    const country = a.country?.split(" / ")[0];
    if (!city) return null;
    return {
      place_name: [city, country].filter(Boolean).join(", ").slice(0, 120),
      latitude: Number(hit.lat),
      longitude: Number(hit.lon),
    };
  } catch {
    return null;
  }
}

// Coordinates -> IANA time zone, using Open-Meteo's automatic time zone.
async function timeZoneAt(latitude: number, longitude: number): Promise<string | null> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto",
    forecast_days: "1",
    daily: "weather_code",
  });
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { timezone?: string };
    return json.timezone && isValidTimeZone(json.timezone) ? json.timezone : null;
  } catch {
    return null;
  }
}

// The address a day's city should come from: its first plan (by time) that
// has one.
export function firstAddress(plans: { id: number; start_time: string | null; address: string | null }[]) {
  return sortPlansByTime(plans).find((p) => p.address?.trim())?.address?.trim() ?? null;
}

export async function autoLocateTrip(
  supabase: SupabaseClient<Database>,
  tripId: number,
  { onlyDayId }: { onlyDayId?: number } = {},
) {
  const { data: trip } = await supabase
    .from("trips")
    .select("id, place_name, days(id, date, place_source, place_from, plans(id, start_time, address))")
    .eq("id", tripId)
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip) return;

  const found = new Map<string, Place | null>();
  let lookups = 0;
  let firstFound: Place | null = null;

  for (const day of trip.days) {
    if (onlyDayId !== undefined && day.id !== onlyDayId) continue;
    if (day.place_source === "manual") continue;
    const address = firstAddress(day.plans);

    // No address anymore: drop an automatic city (the trip's city applies).
    if (!address) {
      if (day.place_source === "auto") {
        await supabase.from("days").update({ ...NO_PLACE, place_source: null, place_from: null }).eq("id", day.id);
      }
      continue;
    }
    // Already found from this same address.
    if (day.place_source === "auto" && day.place_from === address) continue;

    let place = found.get(address);
    if (place === undefined) {
      if (lookups >= MAX_LOOKUPS_PER_RUN) break;
      if (lookups > 0) await sleep(1100); // OpenStreetMap: one request per second
      lookups++;
      const hit = await lookUpAddress(address);
      const timezone = hit ? await timeZoneAt(hit.latitude, hit.longitude) : null;
      place = hit && timezone ? { ...hit, timezone } : null;
      found.set(address, place);
    }

    // Remember the address either way, so a miss isn't retried every visit.
    await supabase
      .from("days")
      .update(place ? { ...place, place_source: "auto", place_from: address } : { ...NO_PLACE, place_source: "auto", place_from: address })
      .eq("id", day.id);
    firstFound ??= place;
  }

  // A trip with no main city gets the first city found, for its countdown
  // and for days without addresses.
  if (!trip.place_name && firstFound) {
    await supabase.from("trips").update(firstFound).eq("id", trip.id);
  }
}

// True when a day's city should be (re)found from its plans.
export function needsLocating(day: {
  place_source: string | null;
  place_from: string | null;
  plans: { id: number; start_time: string | null; address: string | null }[];
}) {
  if (day.place_source === "manual") return false;
  const address = firstAddress(day.plans);
  if (!address) return day.place_source === "auto";
  return day.place_source !== "auto" || day.place_from !== address;
}
