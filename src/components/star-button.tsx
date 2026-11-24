"use client";

import { startTransition, useOptimistic } from "react";
import { setStar } from "@/app/trips/star-actions";

// One tap stars or un-stars a plan. The star fills in right away while the
// change saves in the background.
export function StarButton({
  planId,
  starred,
  size = "small",
}: {
  planId: number;
  starred: boolean;
  size?: "small" | "large";
}) {
  const [isStarred, setOptimistic] = useOptimistic(starred);

  function toggle() {
    startTransition(async () => {
      setOptimistic(!isStarred);
      await setStar(planId, !isStarred);
    });
  }

  const label = isStarred ? "Starred" : "Star";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isStarred}
      aria-label={isStarred ? "Remove star" : "Star this plan"}
      className={
        size === "large"
          ? `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isStarred ? "bg-amber-50 text-amber-700" : "bg-background text-muted hover:text-foreground"
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
