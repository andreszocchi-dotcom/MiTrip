import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlanCard } from "@/components/plan-card";
import { PageHero } from "@/components/page-hero";
import { TripCard } from "@/components/trip-card";
import { formatDay, formatTime } from "@/lib/dates";
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
        "plan_id, plans(id, title, type, start_time, end_time, address, confirmation_number, flight_number, ticket_url, days(id, date, trip_id, trips(name, theme)))",
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
    <main className="page !max-w-[980px]">
      <PageHero title="Starred." subtitle="Boarding passes, tickets, and must-dos, one tap away." />

      {starredTrips.length > 0 && (
        <section>
          <ul className="grid gap-4 sm:grid-cols-2">
            {starredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} starred />
            ))}
          </ul>
        </section>
      )}

      {starredTrips.length > 0 && starred.length > 0 && <h2 className="headline mt-20 text-center">Plans.</h2>}

      {starred.length > 0 ? (
        <ul className={`mx-auto w-full max-w-[720px] ${starredTrips.length > 0 ? "mt-8" : ""} flex flex-col gap-3`}>
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
                  theme: themeOf(trip.theme),
                }}
              />
            );
          })}
        </ul>
      ) : (
        starredTrips.length === 0 && (
        <div className="tile mx-auto w-full max-w-[640px] p-10 text-center">
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
