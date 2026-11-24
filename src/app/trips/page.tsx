import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
    .select("id, name, start_date, end_date, theme, owner_id, days(id, date)")
    .order("start_date")
    .order("date", { referencedTable: "days" });

  return (
    <main className="page">
      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="headline">My trips</h1>
        <Link href="/trips/new" className="btn btn-primary btn-sm shrink-0">
          Add trip
        </Link>
      </div>
      <p className="mt-2 truncate text-sm text-muted">Signed in as {user.email}</p>

      {trips && trips.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {trips.map((trip) => {
            const theme = themeOf(trip.theme);
            return (
              <li key={trip.id}>
                <Link
                  href={`/trips/${trip.id}`}
                  className="relative isolate flex min-h-60 flex-col justify-between overflow-hidden rounded-[28px] p-7 pb-24 transition-transform active:scale-[0.99]"
                  style={{ backgroundColor: theme.soft }}
                >
                  <p className="text-[28px] font-semibold leading-tight tracking-[-0.02em]" style={{ color: theme.strong }}>
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
