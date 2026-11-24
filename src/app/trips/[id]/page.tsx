import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DayStrip } from "@/components/day-strip";
import { ThemeArt } from "@/components/theme-art";
import { TodayLink } from "@/components/today-link";
import { countDays, formatDateRange, formatDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { StarButton } from "@/components/star-button";
import { themeOf } from "@/lib/themes";
import { deleteTrip } from "../actions";
import { ImportButton } from "./import-button";

export const metadata: Metadata = { title: "Trip · MiTrip" };
// The AI itinerary import can take up to a minute on long itineraries.
export const maxDuration = 120;

export default async function TripPage({ params }: PageProps<"/trips/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security returns nothing if I don't own or share this trip,
  // so another user's trip shows "Trip not found".
  const { data: trip } = await supabase
    .from("trips")
    .select("*, trip_stars(user_id), days(id, date, greeting, plans(count))")
    .eq("id", Number(id))
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip) {
    notFound();
  }

  const theme = themeOf(trip.theme);
  const isOwner = trip.owner_id === user.id;
  const totalPlans = trip.days.reduce((sum, day) => sum + (day.plans[0]?.count ?? 0), 0);

  return (
    <main className="page">
      <Link href="/trips" className="link text-sm">
        ‹ My trips
      </Link>

      <section className="relative isolate mt-4 overflow-hidden rounded-[28px] p-7 pb-24 sm:p-10 sm:pb-28" style={{ backgroundColor: theme.soft }}>
        <ThemeArt theme={trip.theme} className="absolute bottom-0 right-0 -z-10 h-28 w-full" />
        <div className="flex items-start justify-between gap-4">
          <h1 className="headline-lg" style={{ color: theme.strong }}>
            {trip.name}
          </h1>
          <div className="-mr-2 -mt-2 shrink-0 sm:mr-0 sm:mt-0">
            <StarButton tripId={trip.id} starred={trip.trip_stars.length > 0} size="icon" />
          </div>
        </div>
        <p className="mt-3 text-[19px] text-foreground">
          {formatDateRange(trip.start_date, trip.end_date)}
          <span className="text-muted">
            {" · "}
            {countDays(trip.start_date, trip.end_date)} days
          </span>
        </p>
        {trip.google_maps_list_url && (
          <a
            href={trip.google_maps_list_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm mt-6 bg-surface"
            style={{ color: theme.strong }}
          >
            Open my Google Maps list ↗
          </a>
        )}
        {!isOwner && <p className="mt-3 text-sm text-muted">Shared with you (view only)</p>}
      </section>

      <TodayLink tripId={trip.id} days={trip.days} color={theme.strong} />

      <Link
        href={`/trips/${trip.id}/print`}
        className="tile mt-3 flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/70"
      >
        <span>
          <span className="block font-medium">Save as PDF</span>
          <span className="block text-sm text-muted">For when there&apos;s no signal</span>
        </span>
        <span className="text-muted" aria-hidden="true">›</span>
      </Link>

      <p className="mt-10 text-sm font-medium text-muted">Jump to a day</p>
      <DayStrip
        tripId={trip.id}
        days={trip.days.map((d) => ({ id: d.id, date: d.date, planCount: d.plans[0]?.count ?? 0 }))}
        color={theme.strong}
      />

      {trip.itinerary_text && (
        <details className="tile mt-6 p-6">
          <summary className="cursor-pointer font-medium">Itinerary</summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
            {trip.itinerary_text}
          </p>
        </details>
      )}

      {isOwner && trip.itinerary_text && (
        <ImportButton tripId={trip.id} existingPlans={totalPlans} />
      )}

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="section-title">Days</h2>
        {totalPlans > 0 && (
          <Link href={`/search?trip=${trip.id}`} className="link text-sm">
            Search this trip
          </Link>
        )}
      </div>
      <ul className="tile mt-4 divide-y divide-black/[0.06] overflow-hidden">
        {trip.days.map((day, index) => {
          const planCount = day.plans[0]?.count ?? 0;
          return (
            <li key={day.id}>
              <Link
                href={`/trips/${trip.id}/days/${day.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-black/[0.02] active:bg-black/[0.04]"
              >
                <div>
                  <p className="font-medium">
                    Day {index + 1} · {formatDay(day.date)}
                  </p>
                  {day.greeting && <p className="text-sm text-muted">{day.greeting}</p>}
                </div>
                <span className="text-sm text-muted">
                  {planCount} {planCount === 1 ? "plan" : "plans"} ›
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {isOwner && (
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href={`/trips/${trip.id}/edit`}
            className="btn btn-secondary flex-1"
          >
            Edit trip
          </Link>
          <ConfirmDeleteButton
            action={deleteTrip.bind(null, trip.id)}
            label="Delete trip"
            warning={`This deletes “${trip.name}” and every day and plan in it. This can’t be undone.`}
          />
        </div>
      )}
    </main>
  );
}
