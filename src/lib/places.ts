// Where a trip or a day takes place: a city found by name, with coordinates
// for weather and an IANA time zone (like "Australia/Sydney") for "today".
export type Place = {
  place_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type MaybePlace = {
  place_name: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
};

export function placeOf(row: MaybePlace | null | undefined): Place | null {
  if (!row?.place_name || row.latitude === null || row.longitude === null || !row.timezone) return null;
  return {
    place_name: row.place_name,
    latitude: row.latitude,
    longitude: row.longitude,
    timezone: row.timezone,
  };
}

// A day's own place, or else its trip's.
export function dayPlace(day: MaybePlace, trip: MaybePlace) {
  return placeOf(day) ?? placeOf(trip);
}

// The short city name shown in the app: "Queenstown, New Zealand" -> "Queenstown".
export function shortPlace(place: Place) {
  return place.place_name.split(",")[0].trim();
}

export function isValidTimeZone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

// "YYYY-MM-DD" right now in a time zone (or the device's own, if none).
export function todayIn(timezone?: string | null, now = new Date()) {
  return now.toLocaleDateString("en-CA", timezone ? { timeZone: timezone } : undefined);
}

// Reads a place from form fields (filled in by the place picker). All four
// must be present and sensible, or there's no place.
export function readPlace(formData: FormData, prefix = ""): Place | null {
  const name = String(formData.get(`${prefix}place_name`) ?? "").trim();
  const latitude = Number(formData.get(`${prefix}latitude`));
  const longitude = Number(formData.get(`${prefix}longitude`));
  const timezone = String(formData.get(`${prefix}timezone`) ?? "").trim();
  if (
    !name ||
    name.length > 120 ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    !isValidTimeZone(timezone)
  ) {
    return null;
  }
  return { place_name: name, latitude, longitude, timezone };
}

export const NO_PLACE: MaybePlace = { place_name: null, latitude: null, longitude: null, timezone: null };
