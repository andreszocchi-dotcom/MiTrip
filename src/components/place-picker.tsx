"use client";

import { useEffect, useRef, useState } from "react";
import { searchPlaces } from "@/app/trips/place-actions";
import type { Place } from "@/lib/places";

// Type a city, pick the right one from the list (there are three
// Queenstowns). In a form, the choice travels in hidden fields; elsewhere,
// onChange gets it directly.
export function PlacePicker({
  defaultPlace,
  onChange,
  namePrefix = "",
  placeholder = "Search for a city",
  autoFocus = false,
}: {
  defaultPlace?: Place | null;
  onChange?: (place: Place | null) => void;
  namePrefix?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [place, setPlace] = useState<Place | null>(defaultPlace ?? null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const latest = useRef(0);

  // Search as you type, a moment after the last key press.
  useEffect(() => {
    if (query.trim().length < 2) return;
    const id = ++latest.current;
    const timer = setTimeout(async () => {
      setSearching(true);
      const found = await searchPlaces(query);
      if (id === latest.current) {
        setResults(found);
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function choose(next: Place | null) {
    setPlace(next);
    setQuery("");
    setResults([]);
    onChange?.(next);
  }

  const showList = query.trim().length >= 2;

  return (
    <div className="relative">
      {place && (
        <>
          <input type="hidden" name={`${namePrefix}place_name`} value={place.place_name} />
          <input type="hidden" name={`${namePrefix}latitude`} value={place.latitude} />
          <input type="hidden" name={`${namePrefix}longitude`} value={place.longitude} />
          <input type="hidden" name={`${namePrefix}timezone`} value={place.timezone} />
        </>
      )}
      {place ? (
        <div className="field flex items-center justify-between gap-3">
          <span className="min-w-0 truncate">📍 {place.place_name}</span>
          <button type="button" onClick={() => choose(null)} className="link shrink-0 text-sm">
            Change
          </button>
        </div>
      ) : (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="City"
          autoComplete="off"
          autoFocus={autoFocus}
          className="field w-full"
        />
      )}
      {!place && showList && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-[14px] bg-surface shadow-[0_8px_30px_rgb(0_0_0/0.12)] ring-1 ring-foreground/5">
          {results.length > 0 ? (
            results.map((r) => (
              <li key={`${r.latitude},${r.longitude}`}>
                <button
                  type="button"
                  onClick={() => choose(r)}
                  className="block w-full px-4 py-3 text-left text-[15px] transition-colors hover:bg-background"
                >
                  {r.place_name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted">{searching ? "Searching…" : "No matching city"}</li>
          )}
        </ul>
      )}
    </div>
  );
}
