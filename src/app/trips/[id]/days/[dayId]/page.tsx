import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import { DayPlace } from "@/components/day-place";
import { DayStrip } from "@/components/day-strip";
import { Icon } from "@/components/icons";
import { PlanCard } from "@/components/plan-card";
import { SubNav } from "@/components/sub-nav";
import { LocalTime } from "@/components/local-time";
import { NextDayLabel, TodayBadge } from "@/components/today-link";
import { WeatherBadge } from "@/components/weather-badge";
import { SceneBanner } from "@/components/trip-scene";
import { formatDay, formatTime } from "@/lib/dates";
import { autoLocateTrip, needsLocating } from "@/lib/auto-locate";
import { dayRouteLinks, routeStops } from "@/lib/maps";
import { placeOf, placesForDays, shortPlace } from "@/lib/places";
import { forecastFor } from "@/lib/weather";
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
    .select(
      "id, date, greeting, trip_id, place_name, latitude, longitude, timezone, place_source, place_from, trips(id, name, theme, owner_id, place_name, latitude, longitude, timezone), plans(*, stars(user_id))",
    )
    .eq("id", Number(dayId))
    .eq("trip_id", Number(id))
    .maybeSingle();
  if (!day || !day.trips) {
    notFound();
  }

  const { data: tripDays } = await supabase
    .from("days")
    .select("id, date, place_name, latitude, longitude, timezone, plans(count)")
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
  const stops = routeStops(plans);
  const routeLinks = dayRouteLinks(stops);
  const dayHref = (dId: number) => `/trips/${trip.id}/days/${dId}`;

  // Where this day happens: its own city (found from its plans' addresses,
  // or picked by hand), else the trip's. A day not yet located is looked up
  // now (about a second, once), and the rest of the trip in the background.
  if (isOwner) {
    if (needsLocating(day)) {
      await autoLocateTrip(supabase, trip.id, { onlyDayId: day.id });
      const { data: fresh } = await supabase
        .from("days")
        .select("place_name, latitude, longitude, timezone, place_source")
        .eq("id", day.id)
        .maybeSingle();
      if (fresh) Object.assign(day, fresh);
    }
    after(() => autoLocateTrip(supabase, trip.id));
  }
  // No city of its own: the last city before this day (else the trip's).
  const place =
    placeOf(day) ?? placesForDays((tripDays ?? []).slice(0, index), trip).at(-1) ?? placeOf(trip);
  const weather = place ? ((await forecastFor(place)).get(day.date) ?? null) : null;

  // The stops as the route panel lists them: the first plan at each place.
  const stopPlans = plans.filter(
    (plan, i) =>
      plan.address?.trim() &&
      plans
        .slice(0, i)
        .filter((p) => p.address?.trim())
        .at(-1)
        ?.address?.trim()
        .toLowerCase() !== plan.address.trim().toLowerCase(),
  );

  return (
    <main className="flex flex-1 flex-col">
      <SubNav title={trip.name} href={`/trips/${trip.id}`}>
        {prevId ? (
          <Link href={dayHref(prevId)} className="text-foreground/70 hover:text-foreground" aria-label="Previous day">
            ‹ <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span className="text-foreground/25">‹</span>
        )}
        <span className="tabular-nums text-muted">
          Day {index + 1} of {dayIds.length}
        </span>
        {nextId ? (
          <Link href={dayHref(nextId)} className="text-foreground/70 hover:text-foreground" aria-label="Next day">
            <span className="hidden sm:inline">Next</span> ›
          </Link>
        ) : (
          <span className="text-foreground/25">›</span>
        )}
      </SubNav>

      <section style={{ backgroundColor: theme.sky, color: theme.ink }}>
        <div className="mx-auto max-w-[980px] px-4 pt-12 text-center sm:pt-20">
          <p className="eyebrow opacity-80">
            Day {index + 1}
            <TodayBadge date={day.date} color={theme.ink} timezone={place?.timezone} />
          </p>
          <h1 className="headline-xl mt-2">{formatDay(day.date)}</h1>
          {day.greeting && (
            <p className="mx-auto mt-4 max-w-[640px] text-[19px] leading-snug opacity-85 sm:text-[24px]">
              {day.greeting}
            </p>
          )}
          {weather && (
            <div className="mt-5">
              <WeatherBadge weather={weather} />
            </div>
          )}
          <DayPlace
            tripId={trip.id}
            dayId={day.id}
            place={place}
            source={day.place_source}
            canEdit={isOwner}
          />
          {place && (
            <p className="mt-1 text-sm opacity-70">
              <LocalTime timezone={place.timezone} place={shortPlace(place)} />
            </p>
          )}
        </div>
        <SceneBanner
          theme={trip.theme}
          uid={`day-${day.id}`}
          sky={theme.sky}
          className="mt-6 aspect-[3/1] max-h-[420px] min-h-48"
        />
      </section>

      <div className="page !pt-8">
        <DayStrip tripId={trip.id} days={stripDays} currentId={day.id} color={theme.strong} />

        {/* Today's route, as its own dark moment */}
        {routeLinks.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-10">
            <p className="eyebrow text-white/60">Today&apos;s route</p>
            <h2 className="mt-1 text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
              {stops.length} stops.
              <br />
              <span className="text-white/60">One tap.</span>
            </h2>
            <ol className="relative mt-7 flex flex-col gap-4">
              <span aria-hidden="true" className="absolute bottom-3 left-[13px] top-3 w-0.5 rounded-full bg-white/15" />
              {stopPlans.map((plan, i) => (
                <li key={plan.id} className="relative flex items-center gap-4">
                  <span
                    className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
                    style={{ backgroundColor: theme.sky, color: theme.ink }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{plan.title}</span>
                    <span className="block truncate text-sm text-white/55">
                      {plan.start_time ? `${formatTime(plan.start_time)} · ` : ""}
                      {plan.address}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              {routeLinks.map((link, i) => (
                <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="btn bg-white text-ink hover:bg-white/90">
                  <Icon name="route" className="h-5 w-5" />
                  {routeLinks.length > 1 ? `Part ${i + 1} of ${routeLinks.length}` : "Open in Google Maps"}
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/45">Starts from where you are. Pick driving, walking, or transit in Maps.</p>
          </section>
        )}

        {/* The plans, as a timeline */}
        <div className="mt-16 flex items-end justify-between">
          <h2 className="headline">The plan.</h2>
          {isOwner && (
            <Link href={`${dayHref(day.id)}/new`} className="btn btn-primary btn-sm">
              Add plan
            </Link>
          )}
        </div>

        {plans.length > 0 ? (
          <ul
            className="relative mt-6 flex flex-col gap-3 pl-7 before:absolute before:bottom-6 before:left-[9px] before:top-6 before:w-0.5 before:rounded-full before:bg-[var(--line-color)] [&>li]:relative [&>li]:before:absolute [&>li]:before:-left-[26px] [&>li]:before:top-7 [&>li]:before:h-3.5 [&>li]:before:w-3.5 [&>li]:before:rounded-full [&>li]:before:border-[3px] [&>li]:before:border-background [&>li]:before:bg-[var(--dot-color)] [&>li]:before:content-['']"
            style={{ ["--line-color" as string]: theme.soft, ["--dot-color" as string]: theme.strong }}
          >
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
          <div className="tile mt-6 p-10 text-center">
            <p className="section-title">A free day.</p>
            <p className="mt-2 text-muted">
              {isOwner ? "Nothing planned yet. Add a plan, or leave room to wander." : "Nothing planned yet."}
            </p>
          </div>
        )}

        {nextDay && (
          <Link
            href={dayHref(nextDay.id)}
            className="mt-16 block rounded-[28px] p-7 transition-transform active:scale-[0.99] sm:p-9"
            style={{ backgroundColor: theme.soft }}
          >
            <p className="eyebrow" style={{ color: theme.strong }}>
              <NextDayLabel date={day.date} timezone={place?.timezone} /> · {formatDay(nextDay.date)}
            </p>
            {nextDay.summary && <p className="mt-2 text-[21px] font-semibold tracking-[-0.02em]">{nextDay.summary}</p>}
            {nextPlans.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {nextPlans.map((plan) => (
                  <li key={plan.id} className="flex gap-3">
                    <span className="w-[72px] shrink-0 text-muted tabular-nums">
                      {plan.start_time ? formatTime(plan.start_time) : ""}
                    </span>
                    <span>
                      <span aria-hidden="true">{planTypeOf(plan.type).icon}</span> {plan.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              !nextDay.summary && <p className="mt-2 text-muted">Nothing planned yet.</p>
            )}
            <p className="mt-5 font-medium" style={{ color: theme.strong }}>
              See the full day ›
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
