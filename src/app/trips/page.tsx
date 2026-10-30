import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
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
    .select("id, name, start_date, end_date, theme, owner_id")
    .order("start_date");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />

      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">My trips</h1>
        <Link
          href="/trips/new"
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          + Add trip
        </Link>
      </div>
      <p className="mt-1 truncate text-sm text-muted">Signed in as {user.email}</p>

      {trips && trips.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-4">
          {trips.map((trip) => {
            const theme = themeOf(trip.theme);
            return (
              <li key={trip.id}>
                <Link
                  href={`/trips/${trip.id}`}
                  className="block rounded-3xl p-6 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
                  style={{ backgroundColor: theme.soft }}
                >
                  <p className="text-xl font-semibold" style={{ color: theme.strong }}>
                    {trip.name}
                  </p>
                  <p className="mt-1 text-foreground">
                    {formatDateRange(trip.start_date, trip.end_date)}
                    <span className="text-muted">
                      {" · "}
                      {countDays(trip.start_date, trip.end_date)} days
                    </span>
                  </p>
                  {trip.owner_id !== user.id && (
                    <p className="mt-2 text-sm text-muted">Shared with you</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-lg font-medium">No trips yet</p>
          <p className="mt-2 text-muted">Tap “+ Add trip” to plan your first one.</p>
        </div>
      )}
    </main>
  );
}
