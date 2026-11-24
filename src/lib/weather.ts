import type { Place } from "@/lib/places";

// Daily forecasts from Open-Meteo (free, no key). Forecasts reach 16 days
// ahead; days outside that window just have no weather.
export type DayWeather = {
  code: number;
  high: number; // °C
  low: number; // °C
  rainChance: number | null; // %
};

export const FORECAST_DAYS = 16;

// WMO weather codes (what Open-Meteo returns) as an icon and a few words.
export function describeWeather(code: number) {
  if (code === 0) return { icon: "☀️", label: "Clear" };
  if (code === 1) return { icon: "🌤️", label: "Mostly clear" };
  if (code === 2) return { icon: "⛅", label: "Partly cloudy" };
  if (code === 3) return { icon: "☁️", label: "Cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", label: "Fog" };
  if (code >= 51 && code <= 57) return { icon: "🌦️", label: "Drizzle" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: "🌧️", label: "Rain" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { icon: "🌨️", label: "Snow" };
  if (code >= 95) return { icon: "⛈️", label: "Thunderstorms" };
  return { icon: "🌡️", label: "Weather" };
}

// The forecast for one place, keyed by date ("YYYY-MM-DD"). Cached for an
// hour; if the weather service is slow or down, the result is just empty.
export async function forecastFor(place: Place): Promise<Map<string, DayWeather>> {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: place.timezone,
    forecast_days: String(FORECAST_DAYS),
  });
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return new Map();
    const json = (await res.json()) as {
      daily?: {
        time: string[];
        weather_code: (number | null)[];
        temperature_2m_max: (number | null)[];
        temperature_2m_min: (number | null)[];
        precipitation_probability_max?: (number | null)[];
      };
    };
    const daily = json.daily;
    const out = new Map<string, DayWeather>();
    daily?.time.forEach((date, i) => {
      const code = daily.weather_code[i];
      const high = daily.temperature_2m_max[i];
      const low = daily.temperature_2m_min[i];
      if (code === null || high === null || low === null) return;
      out.set(date, { code, high, low, rainChance: daily.precipitation_probability_max?.[i] ?? null });
    });
    return out;
  } catch {
    return new Map();
  }
}

// Weather for many days at once: one request per distinct place.
export async function weatherForDays(days: { date: string; place: Place | null }[]) {
  const places = new Map<string, Place>();
  for (const d of days) {
    if (d.place) places.set(`${d.place.latitude},${d.place.longitude},${d.place.timezone}`, d.place);
  }
  const forecasts = new Map<string, Map<string, DayWeather>>();
  await Promise.all(
    [...places].map(async ([key, place]) => forecasts.set(key, await forecastFor(place))),
  );
  return days.map((d) =>
    d.place ? (forecasts.get(`${d.place.latitude},${d.place.longitude},${d.place.timezone}`)?.get(d.date) ?? null) : null,
  );
}
