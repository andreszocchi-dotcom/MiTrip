import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { formatDay, formatTime } from "@/lib/dates";
import { googleMapsUrl } from "@/lib/maps";
import { sortPlansByTime } from "@/lib/plan-order";
import { planTypeOf } from "@/lib/plan-types";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";

export const metadata: Metadata = { title: "Day · MiTrip" };

export default async function DayPage({ params }: PageProps<"/trips/[id]/days/[dayId]">) {
  const { id, dayId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security hides days of trips I don't own or share.
  const { data: day } = await supabase
    .from("days")
    .select("id, date, greeting, trip_id, trips(id, name, theme, owner_id), plans(*)")
    .eq("id", Number(dayId))
    .eq("trip_id", Number(id))
    .maybeSingle();
  if (!day || !day.trips) {
    notFound();
  }

  const { data: tripDays } = await supabase
    .from("days")
    .select("id")
    .eq("trip_id", day.trip_id)
    .order("date");
  const dayIds = (tripDays ?? []).map((d) => d.id);
  const index = dayIds.indexOf(day.id);
  const prevId = dayIds[index - 1];
  const nextId = dayIds[index + 1];

  const trip = day.trips;
  const plans = sortPlansByTime(day.plans);
  const theme = themeOf(trip.theme);
  const isOwner = trip.owner_id === user.id;
  const dayHref = (dId: number) => `/trips/${trip.id}/days/${dId}`;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <Link href={`/trips/${trip.id}`} className="mt-6 text-sm font-medium text-muted">
        ← {trip.name}
      </Link>

      <section className="mt-4 rounded-3xl p-6" style={{ backgroundColor: theme.soft }}>
        <p className="text-sm font-medium" style={{ color: theme.strong }}>
          Day {index + 1} of {dayIds.length}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{formatDay(day.date)}</h1>
        {day.greeting && <p className="mt-2 text-lg">{day.greeting}</p>}
      </section>

      <nav className="mt-4 flex justify-between text-sm font-medium text-accent">
        {prevId ? <Link href={dayHref(prevId)}>‹ Previous day</Link> : <span />}
        {nextId ? <Link href={dayHref(nextId)}>Next day ›</Link> : <span />}
      </nav>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plans</h2>
        {isOwner && (
          <Link
            href={`${dayHref(day.id)}/new`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            + Add plan
          </Link>
        )}
      </div>

      {plans.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-3">
          {plans.map((plan) => {
            const type = planTypeOf(plan.type);
            return (
              <li key={plan.id} className="relative">
                {plan.address && (
                  <a
                    href={googleMapsUrl(plan.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 z-10 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                  >
                    Map ↗
                  </a>
                )}
                <Link
                  href={`/trips/${trip.id}/plans/${plan.id}`}
                  className={`flex gap-4 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99] ${plan.address ? "pr-20" : ""}`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {type.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-muted">
                      {plan.start_time ? formatTime(plan.start_time) : type.label}
                      {plan.end_time && ` – ${formatTime(plan.end_time)}`}
                    </p>
                    <p className="font-medium">{plan.title}</p>
                    {plan.address && <p className="truncate text-sm text-muted">{plan.address}</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl bg-surface p-6 text-center text-muted shadow-sm ring-1 ring-black/5">
          No plans for this day yet.
        </div>
      )}
    </main>
  );
}
