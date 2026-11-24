"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { todayIn } from "@/lib/places";

// "Today" depends on where you are. With a time zone (the trip's or the
// day's city), it's that place's date, so the first morning in Sydney is
// "Today" even while it's still yesterday at home. Without one, it's the
// phone's own date. The server can't know either, so this runs in the browser.
const noSubscribe = () => () => {};

export function useTodayIn(timezone?: string | null) {
  return useSyncExternalStore(noSubscribe, () => todayIn(timezone), () => null);
}

export function useDeviceToday() {
  return useTodayIn(null);
}

type TodayDay = { id: number; date: string; timezone?: string | null };

// Shown only while the trip is happening: one tap to today's plans.
export function TodayLink({
  tripId,
  days,
  color,
  timezone,
}: {
  tripId: number;
  days: TodayDay[];
  color: string;
  // The trip's time zone; a day's own time zone wins.
  timezone?: string | null;
}) {
  const todayId = useSyncExternalStore(
    noSubscribe,
    () => days.find((d) => d.date === todayIn(d.timezone ?? timezone))?.id ?? -1,
    () => -1,
  );
  const todayDay = days.find((d) => d.id === todayId);
  if (!todayDay) return null;
  return (
    <Link
      href={`/trips/${tripId}/days/${todayDay.id}`}
      className="mt-3 flex items-center justify-between rounded-[22px] px-5 py-4 font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      <span>Today · Day {days.indexOf(todayDay) + 1}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

// "Today" badge on the day page when that day is today (in its own city).
export function TodayBadge({ date, color, timezone }: { date: string; color: string; timezone?: string | null }) {
  const today = useTodayIn(timezone);
  if (date !== today) return null;
  return (
    <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: color }}>
      Today
    </span>
  );
}

// "Tomorrow" when the page shows today, otherwise "Next day".
export function NextDayLabel({ date, timezone }: { date: string; timezone?: string | null }) {
  const today = useTodayIn(timezone);
  return <>{date === today ? "Tomorrow" : "Next day"}</>;
}
