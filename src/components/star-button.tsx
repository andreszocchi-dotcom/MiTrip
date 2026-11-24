"use client";

import { startTransition, useOptimistic } from "react";
import { setStar, setTripStar } from "@/app/trips/star-actions";

// One tap stars or un-stars a plan or a whole trip. The star fills in right
// away while the change saves in the background.
export function StarButton({
  planId,
  tripId,
  starred,
  size = "small",
}: {
  planId?: number;
  tripId?: number;
  starred: boolean;
  // small: full-width bar on a plan card. large: pill on a page header.
  // icon: round button that sits on a trip card.
  size?: "small" | "large" | "icon";
}) {
  const [isStarred, setOptimistic] = useOptimistic(starred);
  const what = tripId !== undefined ? "trip" : "plan";

  function toggle() {
    startTransition(async () => {
      setOptimistic(!isStarred);
      if (tripId !== undefined) await setTripStar(tripId, !isStarred);
      else if (planId !== undefined) await setStar(planId, !isStarred);
    });
  }

  const label = isStarred ? "Starred" : "Star";
  const ariaLabel = isStarred ? `Remove star from this ${what}` : `Star this ${what}`;

  if (size === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isStarred}
        aria-label={ariaLabel}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl backdrop-blur transition-colors hover:bg-white ${
          isStarred ? "text-amber-500" : "text-foreground/50"
        }`}
      >
        <span aria-hidden="true">{isStarred ? "★" : "☆"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isStarred}
      aria-label={ariaLabel}
      className={
        size === "large"
          ? `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isStarred ? "bg-amber-50 text-amber-700" : "bg-black/[0.05] text-muted hover:text-foreground"
            }`
          : `flex w-full items-center justify-center gap-1.5 px-5 py-3 text-sm font-medium ${
              isStarred ? "text-amber-600" : "text-muted"
            }`
      }
    >
      <span aria-hidden="true" className="text-base">
        {isStarred ? "★" : "☆"}
      </span>
      {label}
    </button>
  );
}
