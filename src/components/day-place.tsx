"use client";

import { useState, useTransition } from "react";
import { setDayPlace } from "@/app/trips/place-actions";
import { PlacePicker } from "@/components/place-picker";
import { shortPlace, type Place } from "@/lib/places";

// The day's city under its date: "📍 Sydney". It's normally found from the
// day's plan addresses; the trip's owner can tap Change to pick one by hand,
// or hand it back to the automatic lookup.
export function DayPlace({
  tripId,
  dayId,
  place,
  source,
  canEdit,
}: {
  tripId: number;
  dayId: number;
  // The city in effect (the day's own, else the trip's).
  place: Place | null;
  // How the day's own city was set: from its plans ("auto") or by hand.
  source: string | null;
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
          {source === "manual" && (
            <button type="button" onClick={() => save(null)} className="link" disabled={pending}>
              Find it from this day&apos;s plans
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
