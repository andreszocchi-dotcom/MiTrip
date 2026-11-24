import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StarButton } from "@/components/star-button";
import { ThemeArt } from "@/components/theme-art";
import { TodayLink } from "@/components/today-link";
import { countDays, formatDateRange } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";

export const metadata: Metadata = { title: "My trips · MiTrip" };

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security returns only trips I own or was invited to.
  const { data: trips } = await supabase
    .from("trips")
    .select("id, name, start_date, end_date, theme, owner_id, days(id, date), trip_stars(user_id)")
    .order("start_date")
    .order("date", { referencedTable: "days" });

  // Starred trips first, then by start date. Row Level Security returns only
  // my own stars, so any trip_stars row here is mine.
  const sorted = [...(trips ?? [])].sort(
    (a, b) => Number(b.trip_stars.length > 0) - Number(a.trip_stars.length > 0),
  );

  return (
    <main className="page">
      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="headline">My trips</h1>
        <Link href="/trips/new" className="btn btn-primary btn-sm shrink-0">
          Add trip
        </Link>
      </div>
      <p className="mt-2 truncate text-sm text-muted">Signed in as {user.email}</p>

      {sorted.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {sorted.map((trip) => {
            const theme = themeOf(trip.theme);
            return (
              <li key={trip.id} className="relative">
                <Link
                  href={`/trips/${trip.id}`}
                  className="relative isolate flex min-h-60 flex-col justify-between overflow-hidden rounded-[28px] p-7 pb-24 transition-transform active:scale-[0.99]"
                  style={{ backgroundColor: theme.soft }}
                >
                  <p className="pr-10 text-[28px] font-semibold leading-tight tracking-[-0.02em]" style={{ color: theme.strong }}>
                    {trip.name}
                  </p>
                  <p className="mt-6 text-foreground">
                    {formatDateRange(trip.start_date, trip.end_date)}
                    <span className="text-muted">
                      {" · "}
                      {countDays(trip.start_date, trip.end_date)} days
                    </span>
                  </p>
                  {trip.owner_id !== user.id && (
                    <p className="mt-2 text-sm text-muted">Shared with you</p>
                  )}
                  <ThemeArt theme={trip.theme} className="absolute bottom-0 right-0 -z-10 h-20 w-full" />
                </Link>
                <div className="absolute right-4 top-4">
                  <StarButton tripId={trip.id} starred={trip.trip_stars.length > 0} size="icon" />
                </div>
                <TodayLink tripId={trip.id} days={trip.days} color={theme.strong} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="tile mt-10 p-10 text-center">
          <p className="text-lg font-medium">No trips yet</p>
          <p className="mt-2 text-muted">Tap “Add trip” to plan your first one.</p>
        </div>
      )}
    </main>
  );
}
