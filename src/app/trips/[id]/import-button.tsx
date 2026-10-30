"use client";

import { useActionState, useState } from "react";
import { importItinerary, type ImportState } from "../import-actions";

export function ImportButton({ tripId, existingPlans }: { tripId: number; existingPlans: number }) {
  const [state, formAction, pending] = useActionState<ImportState>(
    importItinerary.bind(null, tripId),
    undefined,
  );
  // If the trip already has plans, importing again adds more, so ask first.
  const [confirming, setConfirming] = useState(false);
  const needsConfirm = existingPlans > 0 && !confirming && !pending;

  return (
    <div className="mt-6 rounded-2xl bg-accent-soft p-5">
      <p className="font-medium text-accent">✨ Import itinerary into days</p>
      <p className="mt-1 text-sm text-muted">
        AI reads your pasted itinerary and adds each item as a plan on the right day, with
        Google Maps links.
      </p>

      {needsConfirm ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-3 text-base font-medium text-white"
        >
          Import again
        </button>
      ) : (
        <form action={formAction} className="mt-4">
          {existingPlans > 0 && !pending && (
            <p className="mb-3 text-sm text-foreground">
              This trip already has {existingPlans} plans. Importing again adds more; it doesn’t
              remove any.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-accent px-4 py-3 text-base font-medium text-white disabled:opacity-60"
          >
            {pending ? "Reading your itinerary… (about 30 seconds)" : existingPlans > 0 ? "Yes, import again" : "Import"}
          </button>
        </form>
      )}

      {state?.ok === false && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm">
          Added {state.planCount} plans across {state.dayCount} days.
          {state.skippedDays > 0 && ` Skipped ${state.skippedDays} days outside the trip dates.`}
          <span className="mt-1 block text-muted">
            Cost: ${state.costUsd.toFixed(4)} ({state.inputTokens.toLocaleString()} tokens in,{" "}
            {state.outputTokens.toLocaleString()} out)
          </span>
        </p>
      )}
    </div>
  );
}
