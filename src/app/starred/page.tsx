import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlanCard } from "@/components/plan-card";
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
  const { data: stars } = await supabase
    .from("stars")
    .select(
      "plan_id, plans(id, title, type, start_time, end_time, address, confirmation_number, ticket_url, days(id, date, trip_id, trips(name, theme)))",
    );

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

      {starred.length > 0 ? (
        <ul className="mt-10 flex flex-col gap-3">
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
        <div className="tile mt-10 p-10 text-center">
          <p className="text-3xl" aria-hidden="true">☆</p>
          <p className="mt-2 font-medium">Nothing starred yet</p>
          <p className="mt-1 text-sm text-muted">
            Tap ☆ Star on any plan to keep it here, like a boarding pass or a cruise ticket.
          </p>
        </div>
      )}
    </main>
  );
}
