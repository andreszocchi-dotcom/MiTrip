import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InstallHint } from "@/components/install-hint";
import { PageHero } from "@/components/page-hero";
import { TripCard } from "@/components/trip-card";
import { todayIso } from "@/lib/dashboard-stats";
import { createClient } from "@/lib/supabase/server";

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
    .select("id, name, start_date, end_date, theme, owner_id, timezone, place_name, days(id, date, timezone), trip_stars(user_id)")
    .order("start_date")
    .order("date", { referencedTable: "days" });

  const all = trips ?? [];
  const today = todayIso();
  const current = all.filter((t) => t.end_date >= today);
  const past = all.filter((t) => t.end_date < today).reverse();

  // The trip happening now (or the soonest one ahead) gets the big card.
  // The rest: starred first, then by start date. Row Level Security returns
  // only my own stars, so any trip_stars row here is mine.
  const featured = current[0];
  const rest = current
    .slice(1)
    .sort((a, b) => Number(b.trip_stars.length > 0) - Number(a.trip_stars.length > 0));

  const card = (trip: (typeof all)[number], feature = false) => (
    <TripCard
      key={trip.id}
      trip={trip}
      feature={feature}
      starred={trip.trip_stars.length > 0}
      shared={trip.owner_id !== user.id}
    />
  );

  return (
    <main className="page !max-w-[1100px]">
      <PageHero
        title="Your trips."
        subtitle={all.length > 0 ? "Every plan, sorted into the day it happens." : "Plan your first one in a minute."}
      >
        <Link href="/trips/new" className="btn btn-primary">
          Add a trip
        </Link>
      </PageHero>

      <InstallHint />

      {all.length === 0 && (
        <div className="tile mx-auto w-full max-w-[640px] p-10 text-center">
          <p className="section-title">Where to?</p>
          <p className="mt-2 text-muted">
            Add a trip with its dates and MiTrip makes a page for every day. Paste an itinerary and AI
            fills the days in for you.
          </p>
        </div>
      )}

      {featured && <ul>{card(featured, true)}</ul>}

      {rest.length > 0 && (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">{rest.map((trip) => card(trip))}</ul>
      )}

      {past.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title text-center">Past trips</h2>
          <p className="mt-1 text-center text-muted">Still here whenever you want to look back.</p>
          <ul className="mt-8 grid gap-4 opacity-90 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((trip) => card(trip))}
          </ul>
        </section>
      )}

      <p className="mt-16 text-center text-xs text-muted">Signed in as {user.email}</p>
    </main>
  );
}
