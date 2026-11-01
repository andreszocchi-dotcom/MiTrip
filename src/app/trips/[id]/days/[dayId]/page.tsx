import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DayStrip } from "@/components/day-strip";
import { PlanCard } from "@/components/plan-card";
import { NextDayLabel, TodayBadge } from "@/components/today-link";
import { formatDay, formatTime } from "@/lib/dates";
import { planTypeOf } from "@/lib/plan-types";
import { sortPlansByTime } from "@/lib/plan-order";
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

  // Row Level Security hides days of trips I don't own or share, and returns
  // only my own stars, so a plan with any star row here is starred by me.
  const { data: day } = await supabase
    .from("days")
    .select("id, date, greeting, trip_id, trips(id, name, theme, owner_id), plans(*, stars(user_id))")
    .eq("id", Number(dayId))
    .eq("trip_id", Number(id))
    .maybeSingle();
  if (!day || !day.trips) {
    notFound();
  }

  const { data: tripDays } = await supabase
    .from("days")
    .select("id, date, plans(count)")
    .eq("trip_id", day.trip_id)
    .order("date");
  const stripDays = (tripDays ?? []).map((d) => ({
    id: d.id,
    date: d.date,
    planCount: d.plans[0]?.count ?? 0,
  }));
  const dayIds = stripDays.map((d) => d.id);
  const index = dayIds.indexOf(day.id);
  const prevId = dayIds[index - 1];
  const nextId = dayIds[index + 1];

  // The "Tomorrow" snapshot: the next day's one-line summary and its plans.
  const { data: nextDay } = nextId
    ? await supabase
        .from("days")
        .select("id, date, summary, plans(id, title, type, start_time)")
        .eq("id", nextId)
        .maybeSingle()
    : { data: null };
  const nextPlans = nextDay ? sortPlansByTime(nextDay.plans) : [];

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

      <DayStrip tripId={trip.id} days={stripDays} currentId={day.id} color={theme.strong} />

      <section className="mt-4 rounded-3xl p-6" style={{ backgroundColor: theme.soft }}>
        <p className="text-sm font-medium" style={{ color: theme.strong }}>
          Day {index + 1} of {dayIds.length}
          <TodayBadge date={day.date} color={theme.strong} />
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
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              href={`/trips/${trip.id}/plans/${plan.id}`}
              starred={plan.stars.length > 0}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl bg-surface p-6 text-center text-muted shadow-sm ring-1 ring-black/5">
          No plans for this day yet.
        </div>
      )}

      {nextDay && (
        <Link
          href={dayHref(nextDay.id)}
          className="mt-8 block rounded-3xl p-6 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
          style={{ backgroundColor: theme.soft }}
        >
          <p className="text-sm font-medium" style={{ color: theme.strong }}>
            <NextDayLabel date={day.date} /> · {formatDay(nextDay.date)}
          </p>
          {nextDay.summary && <p className="mt-2 text-lg">{nextDay.summary}</p>}
          {nextPlans.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              {nextPlans.map((plan) => (
                <li key={plan.id} className="flex gap-2">
                  <span className="w-16 shrink-0 text-muted tabular-nums">
                    {plan.start_time ? formatTime(plan.start_time) : ""}
                  </span>
                  <span>
                    <span aria-hidden="true">{planTypeOf(plan.type).icon}</span> {plan.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            !nextDay.summary && <p className="mt-2 text-sm text-muted">Nothing planned yet.</p>
          )}
          <p className="mt-3 text-sm font-medium" style={{ color: theme.strong }}>
            See the full day ›
          </p>
        </Link>
      )}
    </main>
  );
}
