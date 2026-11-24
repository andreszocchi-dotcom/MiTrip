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
    <div className="tile mt-4 p-6">
      <p className="section-title">✨ Import itinerary into days</p>
      <p className="subhead mt-2 !text-[19px]">
        AI reads your pasted itinerary and adds each item as a plan on the right day, with
        Google Maps links.
      </p>

      {needsConfirm ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn btn-primary mt-4 w-full"
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
            className="btn btn-primary w-full"
          >
            {pending ? "Reading your itinerary… (about 30 seconds)" : existingPlans > 0 ? "Yes, import again" : "Import"}
          </button>
        </form>
      )}

      {state?.ok === false && (
        <p role="alert" className="mt-3 rounded-[12px] bg-danger-bg px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 rounded-[12px] bg-surface px-4 py-3 text-sm">
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
