"use server";

import { refresh } from "next/cache";
import { isValidTimeZone, NO_PLACE, type Place } from "@/lib/places";
import { createClient } from "@/lib/supabase/server";

type GeocodeResult = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

// City search for the place picker, using Open-Meteo's free geocoding (no
// key). Returns up to 6 matches like "Queenstown, Otago, New Zealand".
export async function searchPlaces(query: string): Promise<Place[]> {
  const q = query.trim().slice(0, 80);
  if (q.length < 2) return [];
  const params = new URLSearchParams({ name: q, count: "6", language: "en", format: "json" });
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: GeocodeResult[] };
    return (json.results ?? [])
      .filter((r) => r.timezone && isValidTimeZone(r.timezone))
      .map((r) => ({
        place_name: [r.name, r.admin1 !== r.name ? r.admin1 : undefined, r.country].filter(Boolean).join(", "),
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone!,
      }));
  } catch {
    return [];
  }
}

// Sets (or, with null, clears) one day's own place. Row Level Security only
// lets the trip's owner change its days.
export async function setDayPlace(tripId: number, dayId: number, place: Place | null) {
  if (place && (!isValidTimeZone(place.timezone) || Math.abs(place.latitude) > 90 || Math.abs(place.longitude) > 180)) {
    return;
  }
  const supabase = await createClient();
  await supabase
    .from("days")
    .update(place ? { ...place, place_name: place.place_name.slice(0, 120) } : NO_PLACE)
    .eq("id", dayId)
    .eq("trip_id", tripId);
  refresh();
}
