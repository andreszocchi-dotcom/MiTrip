import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { DayStrip } from "@/components/day-strip";
import { LocalTime } from "@/components/local-time";
import { WeatherBadge } from "@/components/weather-badge";
import { Icon, type IconName } from "@/components/icons";
import { StarButton } from "@/components/star-button";
import { SubNav } from "@/components/sub-nav";
import { TodayLink } from "@/components/today-link";
import { TripCountdown } from "@/components/trip-countdown";
import { SceneBanner } from "@/components/trip-scene";
import { autoLocateTrip } from "@/lib/auto-locate";
import { countDays, formatDateRange, formatDay } from "@/lib/dates";
import { placeOf, placesForDays, shortPlace } from "@/lib/places";
import { weatherForDays } from "@/lib/weather";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";
import { deleteTrip } from "../actions";
import { ImportButton } from "./import-button";
import { People } from "./people";

export const metadata: Metadata = { title: "Trip · MiTrip" };
// The AI itinerary import can take up to a minute on long itineraries.
export const maxDuration = 120;

function ActionTile({
  href,
  icon,
  title,
  text,
  external = false,
  color,
}: {
  href: string;
  icon: IconName;
  title: string;
  text: string;
  external?: boolean;
  color: string;
}) {
  const inner = (
    <>
      <span style={{ color }}>
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <span className="mt-6 block text-[19px] font-semibold tracking-[-0.02em]">
        {title}
        {external && <span className="text-muted"> ↗</span>}
      </span>
      <span className="mt-0.5 block text-sm text-muted">{text}</span>
    </>
  );
  const className = "tile block p-6 transition-colors hover:bg-white/70 active:scale-[0.99]";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

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
    .select(
      "*, trip_stars(user_id), days(id, date, greeting, place_name, latitude, longitude, timezone, plans(count))",
    )
    .eq("id", Number(id))
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip) {
    notFound();
  }

  // The People list: owner and members with emails (empty if I can't view).
  const { data: people } = await supabase.rpc("trip_people", { p_trip_id: trip.id });

  const theme = themeOf(trip.theme);
  const isOwner = trip.owner_id === user.id;
  const totalPlans = trip.days.reduce((sum, day) => sum + (day.plans[0]?.count ?? 0), 0);
  const dayCount = countDays(trip.start_date, trip.end_date);

  // Find days' cities from their plans' addresses in the background (only
  // the owner can save them), for weather and local time on later visits.
  if (isOwner) after(() => autoLocateTrip(supabase, trip.id));

  // Each day's city (its own, else the trip's) and forecast, where there is one.
  const tripPlace = placeOf(trip);
  const dayPlaces = placesForDays(trip.days, trip);
  const dayWeather = await weatherForDays(trip.days.map((d, i) => ({ date: d.date, place: dayPlaces[i] })));

  return (
    <main className="flex flex-1 flex-col">
      <SubNav title={trip.name} href={`/trips/${trip.id}`}>
        <a href="#days" className="hidden text-foreground/70 hover:text-foreground sm:inline">
          Days
        </a>
        <a href="#people" className="hidden text-foreground/70 hover:text-foreground sm:inline">
          {isOwner ? "Share" : "People"}
        </a>
        {isOwner ? (
          <Link href={`/trips/${trip.id}/edit`} className="btn btn-primary px-3.5 py-1 text-[13px]">
            Edit
          </Link>
        ) : (
          <span className="text-muted">View only</span>
        )}
      </SubNav>

      {/* Hero: the trip's name on its own sky, the full scene below. */}
      <section style={{ backgroundColor: theme.sky, color: theme.ink }}>
        <div className="mx-auto max-w-[980px] px-4 pt-14 text-center sm:pt-24">
          <p className="eyebrow opacity-80">
            <TripCountdown start={trip.start_date} end={trip.end_date} timezone={trip.timezone} />
          </p>
          <h1 className="headline-xl mx-auto mt-2 max-w-[900px] text-balance">{trip.name}</h1>
          <p className="mt-4 text-[19px] opacity-80 sm:text-[24px]">
            {formatDateRange(trip.start_date, trip.end_date)} · {dayCount} days
          </p>
          {tripPlace && (
            <p className="mt-2 text-[15px] opacity-75">
              📍 {shortPlace(tripPlace)}
              <LocalTime timezone={tripPlace.timezone} place={shortPlace(tripPlace)} className="before:content-['_·_']" />
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <StarButton tripId={trip.id} starred={trip.trip_stars.length > 0} size="large" />
          </div>
        </div>
        <SceneBanner
          theme={trip.theme}
          uid={`hero-${trip.id}`}
          sky={theme.sky}
          className="mt-8 aspect-[2/1] max-h-[620px] min-h-64 sm:mt-4"
        />
      </section>

      <div className="page !pt-10">
        <TodayLink tripId={trip.id} days={trip.days} color={theme.strong} timezone={trip.timezone} />

        {/* Quick actions */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <ActionTile
            href={`/trips/${trip.id}/print`}
            icon="doc"
            title="Save as PDF"
            text="For when there's no signal"
            color={theme.strong}
          />
          <ActionTile
            href={`/search?trip=${trip.id}`}
            icon="search"
            title="Search"
            text={`${totalPlans} ${totalPlans === 1 ? "plan" : "plans"} in this trip`}
            color={theme.strong}
          />
          {trip.google_maps_list_url && (
            <ActionTile
              href={trip.google_maps_list_url}
              icon="map"
              title="Maps list"
              text="Your saved places"
              external
              color={theme.strong}
            />
          )}
          <ActionTile
            href="#people"
            icon="people"
            title={isOwner ? "Share" : "People"}
            text={isOwner ? "Invite someone to view" : `${(people ?? []).length} on this trip`}
            color={theme.strong}
          />
        </div>

        {/* Day by day */}
        <section id="days" className="mt-24 scroll-mt-28">
          <div className="text-center">
            <h2 className="headline">Day by day.</h2>
            <p className="subhead mt-3">
              {dayCount} days, {totalPlans} {totalPlans === 1 ? "plan" : "plans"}.
            </p>
          </div>
          <div className="mt-8">
            <DayStrip
              tripId={trip.id}
              days={trip.days.map((d) => ({ id: d.id, date: d.date, planCount: d.plans[0]?.count ?? 0 }))}
              color={theme.strong}
            />
          </div>
          <ul className="tile mt-4 divide-y divide-black/[0.06] overflow-hidden">
            {trip.days.map((day, index) => {
              const planCount = day.plans[0]?.count ?? 0;
              const weather = dayWeather[index];
              // Show a day's city only when it differs from the trip's.
              const here = dayPlaces[index];
              const showPlace = here && here.place_name !== trip.place_name ? here : null;
              return (
                <li key={day.id}>
                  <Link
                    href={`/trips/${trip.id}/days/${day.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-black/[0.02] active:bg-black/[0.04] sm:px-6"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold tabular-nums"
                      style={{ backgroundColor: theme.soft, color: theme.ink }}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{formatDay(day.date)}</span>
                      {(day.greeting || showPlace) && (
                        <span className="block truncate text-sm text-muted">
                          {showPlace && `📍 ${shortPlace(showPlace)}${day.greeting ? " · " : ""}`}
                          {day.greeting}
                        </span>
                      )}
                    </span>
                    {weather && <WeatherBadge weather={weather} size="small" className="shrink-0 text-sm" />}
                    <span className="shrink-0 text-sm text-muted">
                      {planCount > 0 ? `${planCount} ${planCount === 1 ? "plan" : "plans"}` : ""} ›
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {trip.itinerary_text && (
          <section className="mt-24">
            <div className="text-center">
              <h2 className="headline">Your itinerary.</h2>
              <p className="subhead mt-3">The plan you pasted, kept as you wrote it.</p>
            </div>
            {isOwner && <ImportButton tripId={trip.id} existingPlans={totalPlans} />}
            <details className="tile mt-4 p-6">
              <summary className="cursor-pointer font-medium">Show the full itinerary</summary>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{trip.itinerary_text}</p>
            </details>
          </section>
        )}

        <section id="people" className="mt-24 scroll-mt-28">
          <div className="mb-8 text-center">
            <h2 className="headline">{isOwner ? "Better together." : "Who's going."}</h2>
            <p className="subhead mt-3">
              {isOwner ? "Share a link and anyone you invite can follow along." : "Everyone on this trip."}
            </p>
          </div>
          <People
            tripId={trip.id}
            tripName={trip.name}
            isOwner={isOwner}
            inviteCode={isOwner ? trip.invite_code : null}
            people={people ?? []}
            myId={user.id}
          />
        </section>

        {isOwner && (
          <div className="mt-16 flex flex-wrap gap-3 border-t border-line pt-8">
            <Link href={`/trips/${trip.id}/edit`} className="btn btn-secondary flex-1">
              <Icon name="pencil" className="h-5 w-5" />
              Edit trip
            </Link>
            <ConfirmDeleteButton
              action={deleteTrip.bind(null, trip.id)}
              label="Delete trip"
              warning={`This deletes “${trip.name}” and every day and plan in it. This can’t be undone.`}
            />
          </div>
        )}
      </div>
    </main>
  );
}
