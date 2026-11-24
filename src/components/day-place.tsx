"use client";

import { useState, useTransition } from "react";
import { setDayPlace } from "@/app/trips/place-actions";
import { PlacePicker } from "@/components/place-picker";
import { shortPlace, type Place } from "@/lib/places";

// The day's city under its date: "📍 Sydney". The trip's owner can tap
// Change to set a different city for just this day, or go back to the trip's.
export function DayPlace({
  tripId,
  dayId,
  place,
  ownPlace,
  tripPlace,
  canEdit,
}: {
  tripId: number;
  dayId: number;
  // The city in effect (the day's own, else the trip's).
  place: Place | null;
  // Set only when this day has its own city.
  ownPlace: Place | null;
  tripPlace: Place | null;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function save(next: Place | null) {
    startTransition(async () => {
      await setDayPlace(tripId, dayId, next);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="mx-auto mt-4 w-full max-w-[420px] text-left text-foreground">
        <PlacePicker
          autoFocus
          placeholder="Which city is this day in?"
          onChange={(next) => next && save(next)}
        />
        <div className="mt-2 flex justify-center gap-5 text-sm">
          {ownPlace && tripPlace && (
            <button type="button" onClick={() => save(null)} className="link" disabled={pending}>
              Use the trip&apos;s city ({shortPlace(tripPlace)})
            </button>
          )}
          <button type="button" onClick={() => setEditing(false)} className="link" disabled={pending}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!place) {
    return canEdit ? (
      <button type="button" onClick={() => setEditing(true)} className="mt-3 text-[15px] underline underline-offset-4 opacity-80 hover:opacity-100">
        📍 Add a city for weather and local time
      </button>
    ) : null;
  }

  return (
    <p className="mt-3 text-[15px] opacity-85">
      📍 {shortPlace(place)}
      {canEdit && (
        <>
          {" · "}
          <button type="button" onClick={() => setEditing(true)} className="underline underline-offset-4 hover:opacity-100">
            {pending ? "Saving…" : "Change"}
          </button>
        </>
      )}
    </p>
  );
}
