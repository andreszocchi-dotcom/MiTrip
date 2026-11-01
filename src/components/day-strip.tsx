"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type StripDay = { id: number; date: string; planCount: number };

const weekday = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short" });
const month = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", month: "short" });

// A sideways-scrolling row of every day in the trip, about a week visible at
// once on a phone. Tap any day to jump straight to it.
export function DayStrip({
  tripId,
  days,
  currentId,
  color,
}: {
  tripId: number;
  days: StripDay[];
  currentId?: number;
  color: string;
}) {
  const currentRef = useRef<HTMLAnchorElement>(null);

  // Bring the current day into the middle of the strip without moving the page.
  useEffect(() => {
    const chip = currentRef.current;
    const strip = chip?.closest("nav");
    if (chip && strip) {
      const chipBox = chip.getBoundingClientRect();
      const stripBox = strip.getBoundingClientRect();
      strip.scrollLeft += chipBox.left - stripBox.left - (stripBox.width - chipBox.width) / 2;
    }
  }, [currentId]);

  return (
    <nav aria-label="Trip days" className="-mx-6 mt-2 overflow-x-auto px-6 [scrollbar-width:none]">
      <ul className="flex w-max snap-x gap-1.5 pb-1">
        {days.map((day, index) => {
          const isCurrent = day.id === currentId;
          const showMonth = index === 0 || month(day.date) !== month(days[index - 1].date);
          return (
            <li key={day.id} className="snap-start">
              <Link
                ref={isCurrent ? currentRef : undefined}
                href={`/trips/${tripId}/days/${day.id}`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Day ${index + 1}, ${weekday(day.date)} ${month(day.date)} ${Number(day.date.slice(8))}, ${day.planCount} plans`}
                className={`flex w-11 flex-col items-center rounded-xl py-1.5 ring-1 transition-colors ${
                  isCurrent ? "text-white ring-transparent" : "bg-surface text-foreground ring-black/10"
                }`}
                style={isCurrent ? { backgroundColor: color } : undefined}
              >
                <span className={`text-[10px] font-medium uppercase ${isCurrent ? "" : "text-muted"}`}>
                  {showMonth ? month(day.date) : weekday(day.date)}
                </span>
                <span className="text-lg font-semibold leading-6">{Number(day.date.slice(8))}</span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: day.planCount > 0 ? (isCurrent ? "white" : color) : "transparent",
                  }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
