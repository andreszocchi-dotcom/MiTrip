"use client";

import { tripCountdown } from "@/lib/dates";
import { useDeviceToday } from "@/components/today-link";

// "In 46 days" counted from the phone's own date (a blank space on the
// server, so the line doesn't jump when the real value appears).
export function TripCountdown({ start, end }: { start: string; end: string }) {
  const today = useDeviceToday();
  return <>{today ? tripCountdown(start, end, today) : " "}</>;
}
