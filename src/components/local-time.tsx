"use client";

import { useSyncExternalStore } from "react";

// Ticks once a minute for everyone showing a local time.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => listeners.forEach((l) => l()), 30_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const minuteNow = () => Math.floor(Date.now() / 60_000);

// "3:40 PM in Sydney", shown only when the place's clock differs from the
// phone's (so it disappears once you're there).
export function LocalTime({ timezone, place, className = "" }: { timezone: string; place: string; className?: string }) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  if (minute === null) return null;
  const now = new Date(minute * 60_000);
  const fmt = (tz?: string) =>
    now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", ...(tz ? { timeZone: tz } : {}) });
  const there = fmt(timezone);
  if (there === fmt()) return null;
  const sameDay = now.toLocaleDateString("en-CA", { timeZone: timezone }) === now.toLocaleDateString("en-CA");
  const weekday = now.toLocaleDateString("en-US", { weekday: "short", timeZone: timezone });
  return (
    <span className={className}>
      {there}
      {!sameDay && ` ${weekday}`} in {place}
    </span>
  );
}
