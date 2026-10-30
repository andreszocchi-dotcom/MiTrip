import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { countDays, formatDateRange, formatDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { themeOf } from "@/lib/themes";
import { deleteTrip } from "../actions";

export const metadata: Metadata = { title: "Trip · MiTrip" };

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
    .select("*, days(id, date, greeting, plans(count))")
    .eq("id", Number(id))
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip) {
    notFound();
  }

  const theme = themeOf(trip.theme);
  const isOwner = trip.owner_id === user.id;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <Link href="/trips" className="mt-6 text-sm font-medium text-muted">
        ← My trips
      </Link>

      <section className="mt-4 rounded-3xl p-6" style={{ backgroundColor: theme.soft }}>
        <h1 className="text-3xl font-semibold" style={{ color: theme.strong }}>
          {trip.name}
        </h1>
        <p className="mt-2 text-foreground">
          {formatDateRange(trip.start_date, trip.end_date)}
          <span className="text-muted">
            {" · "}
            {countDays(trip.start_date, trip.end_date)} days
          </span>
        </p>
        {trip.google_maps_list_url && (
          <a
            href={trip.google_maps_list_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-surface px-4 py-2 text-sm font-medium"
            style={{ color: theme.strong }}
          >
            Open my Google Maps list ↗
          </a>
        )}
        {!isOwner && <p className="mt-3 text-sm text-muted">Shared with you (view only)</p>}
      </section>

      {trip.itinerary_text && (
        <details className="mt-6 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
          <summary className="cursor-pointer font-medium">Itinerary</summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
            {trip.itinerary_text}
          </p>
        </details>
      )}

      <h2 className="mt-8 text-lg font-semibold">Days</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {trip.days.map((day, index) => {
          const planCount = day.plans[0]?.count ?? 0;
          return (
            <li key={day.id}>
              <Link
                href={`/trips/${trip.id}/days/${day.id}`}
                className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
              >
                <div>
                  <p className="font-medium">
                    Day {index + 1} · {formatDay(day.date)}
                  </p>
                  {day.greeting && <p className="text-sm text-muted">{day.greeting}</p>}
                </div>
                <span className="text-sm text-muted">
                  {planCount} {planCount === 1 ? "plan" : "plans"} ›
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {isOwner && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/trips/${trip.id}/edit`}
            className="flex-1 rounded-xl bg-accent-soft px-4 py-3 text-center text-base font-medium text-accent"
          >
            Edit trip
          </Link>
          <ConfirmDeleteButton
            action={deleteTrip.bind(null, trip.id)}
            label="Delete trip"
            warning={`This deletes “${trip.name}” and every day and plan in it. This can’t be undone.`}
          />
        </div>
      )}
    </main>
  );
}
