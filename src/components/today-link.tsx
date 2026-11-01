"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// "YYYY-MM-DD" in the phone's own time zone, so "today" in Sydney is Sydney's
// today. The server can't know that, so this only runs in the browser.
function deviceToday() {
  return new Date().toLocaleDateString("en-CA");
}
const noSubscribe = () => () => {};

export function useDeviceToday() {
  return useSyncExternalStore(noSubscribe, deviceToday, () => null);
}

// Shown only while the trip is happening: one tap to today's plans.
export function TodayLink({
  tripId,
  days,
  color,
}: {
  tripId: number;
  days: { id: number; date: string }[];
  color: string;
}) {
  const today = useDeviceToday();
  const todayDay = days.find((d) => d.date === today);
  if (!todayDay) return null;
  return (
    <Link
      href={`/trips/${tripId}/days/${todayDay.id}`}
      className="mt-3 flex items-center justify-between rounded-2xl px-5 py-4 font-semibold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span>Today · Day {days.indexOf(todayDay) + 1}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

// "Today" badge on the day page when that day is today.
export function TodayBadge({ date, color }: { date: string; color: string }) {
  const today = useDeviceToday();
  if (date !== today) return null;
  return (
    <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: color }}>
      Today
    </span>
  );
}

// "Tomorrow" when the page shows today, otherwise "Next day".
export function NextDayLabel({ date }: { date: string }) {
  const today = useDeviceToday();
  return <>{date === today ? "Tomorrow" : "Next day"}</>;
}
