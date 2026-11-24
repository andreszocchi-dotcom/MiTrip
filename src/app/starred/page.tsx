import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlanCard } from "@/components/plan-card";
import { StarButton } from "@/components/star-button";
import { formatDateRange, formatDay, formatTime } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";

export const metadata: Metadata = { title: "Starred · MiTrip" };

export default async function StarredPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security returns only my own stars.
  const [{ data: stars }, { data: tripStars }] = await Promise.all([
    supabase
      .from("stars")
      .select(
        "plan_id, plans(id, title, type, start_time, end_time, address, confirmation_number, ticket_url, days(id, date, trip_id, trips(name, theme)))",
      ),
    supabase.from("trip_stars").select("trip_id, trips(id, name, start_date, end_date, theme)"),
  ]);
  const starredTrips = (tripStars ?? [])
    .map((s) => s.trips)
    .filter((t) => t !== null)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  // Soonest first: by day, then by time (plans without a time go last that day).
  const starred = (stars ?? [])
    .map((s) => s.plans)
    .filter((p) => p !== null && p.days !== null && p.days.trips !== null)
    .sort((a, b) =>
      (a.days!.date + (a.start_time ?? "99")).localeCompare(b.days!.date + (b.start_time ?? "99")),
    );

  return (
    <main className="page">
      <h1 className="headline">Starred</h1>
      <p className="subhead mt-2 !text-[19px]">
        Your quick list for tickets, boarding passes, and must-dos.
      </p>

      {starredTrips.length > 0 && (
        <section className="mt-10">
          <h2 className="section-title">Trips</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {starredTrips.map((trip) => {
              const theme = themeOf(trip.theme);
              return (
                <li key={trip.id} className="relative">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="block rounded-[22px] p-6 pr-16 transition-transform active:scale-[0.99]"
                    style={{ backgroundColor: theme.soft }}
                  >
                    <p className="text-[21px] font-semibold tracking-[-0.02em]" style={{ color: theme.strong }}>
                      {trip.name}
                    </p>
                    <p className="mt-1 text-sm">{formatDateRange(trip.start_date, trip.end_date)}</p>
                  </Link>
                  <div className="absolute right-3 top-3">
                    <StarButton tripId={trip.id} starred size="icon" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {starredTrips.length > 0 && starred.length > 0 && <h2 className="section-title mt-12">Plans</h2>}

      {starred.length > 0 ? (
        <ul className={`${starredTrips.length > 0 ? "mt-4" : "mt-10"} flex flex-col gap-3`}>
          {starred.map((plan) => {
            const day = plan.days!;
            const trip = day.trips!;
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                href={`/trips/${day.trip_id}/plans/${plan.id}`}
                starred
                showTicket
                context={{
                  text: `${trip.name} · ${formatDay(day.date)}${plan.start_time ? ` · ${formatTime(plan.start_time)}` : ""}`,
                  color: themeOf(trip.theme).strong,
                }}
              />
            );
          })}
        </ul>
      ) : (
        starredTrips.length === 0 && (
        <div className="tile mt-10 p-10 text-center">
          <p className="text-3xl" aria-hidden="true">☆</p>
          <p className="mt-2 font-medium">Nothing starred yet</p>
          <p className="mt-1 text-sm text-muted">
            Tap ☆ Star on any trip or plan to keep it here, like a boarding pass or a cruise ticket.
          </p>
        </div>
        )
      )}
    </main>
  );
}
