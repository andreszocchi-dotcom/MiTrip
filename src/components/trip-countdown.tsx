"use client";

import { tripCountdown } from "@/lib/dates";
import { useTodayIn } from "@/components/today-link";

// "In 46 days" counted from the trip's own date when it has a city (else
// the phone's date). A blank space on the server, so the line doesn't jump
// when the real value appears.
export function TripCountdown({ start, end, timezone }: { start: string; end: string; timezone?: string | null }) {
  const today = useTodayIn(timezone);
  return <>{today ? tripCountdown(start, end, today) : " "}</>;
}
