import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { TripScene } from "@/components/trip-scene";
import { computeDashboardStats, todayIso } from "@/lib/dashboard-stats";
import { formatDateRange } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { T, themeOf, tripScope } from "@/lib/themes";

export const metadata: Metadata = { title: "Dashboard · MiTrip" };

function BigNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="tile flex flex-col justify-between p-6 sm:p-8">
      <p className="text-[15px] font-medium text-muted">{label}</p>
      <p className="mt-6 text-[56px] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-[72px]">
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security returns only trips (and their plans) I own or was invited to.
  const [{ data: trips }, { data: plans }] = await Promise.all([
    supabase.from("trips").select("id, name, start_date, end_date, theme").order("start_date"),
    supabase.from("plans").select("type"),
  ]);

  const today = todayIso();
  const stats = computeDashboardStats(
    trips ?? [],
    (plans ?? []).map((p) => p.type),
    today,
  );
  const maxCount = Math.max(...stats.plansByType.map((row) => row.count), 1);

  // The same trip the stats picked as "next", with its id and scene.
  const next = stats.nextTrip;
  const nextTrip = next
    ? (trips ?? []).find(
        (t) =>
          t.name === next.name &&
          (next.ongoing ? t.start_date <= today && today <= t.end_date : t.start_date > today),
      )
    : undefined;
  const nextScope = tripScope(themeOf(nextTrip?.theme ?? "ocean"));

  return (
    <main className="page !max-w-[980px]">
      <PageHero title="Your travel, in numbers." subtitle="Every trip and plan, added up." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Next trip: the big tile */}
        {nextTrip && next ? (
          <Link
            href={`/trips/${nextTrip.id}`}
            className={`col-span-2 row-span-2 flex flex-col overflow-hidden rounded-[22px] transition-transform active:scale-[0.99] ${nextScope.className}`}
            style={{ ...nextScope.style, backgroundColor: T.sky, color: T.ink }}
          >
            <div className="p-6 sm:p-8">
              <p className="text-[15px] font-medium opacity-80">{next.ongoing ? "Happening now" : "Next trip"}</p>
              <p className="mt-3 text-[64px] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-[88px]">
                {next.ongoing ? `Day ${Math.round((Date.parse(today) - Date.parse(nextTrip.start_date)) / 86_400_000) + 1}` : next.daysAway}
              </p>
              <p className="mt-2 text-[19px] font-semibold tracking-[-0.02em]">
                {next.ongoing ? next.name : `${next.daysAway === 1 ? "day" : "days"} until ${next.name}`}
              </p>
              <p className="mt-0.5 text-sm opacity-75">{formatDateRange(nextTrip.start_date, nextTrip.end_date)}</p>
            </div>
            <div className="relative mt-auto aspect-[2/1] min-h-36 w-full">
              <TripScene theme={nextTrip.theme} uid="dash-next" className="absolute inset-0 h-full w-full" />
            </div>
          </Link>
        ) : (
          <div className="tile col-span-2 row-span-2 flex flex-col justify-center p-8 text-center">
            <p className="section-title">No trips ahead.</p>
            <p className="mt-2 text-muted">
              <Link href="/trips/new" className="link">
                Plan the next one ›
              </Link>
            </p>
          </div>
        )}
        <BigNumber label="Trips" value={`${stats.totalTrips}`} />
        <BigNumber label="Plans" value={`${stats.totalPlans}`} />
        <div className="col-span-2">
          <BigNumber label="Plans per trip, on average" value={stats.averagePlansPerTrip.toFixed(1)} />
        </div>
      </div>

      <section className="tile mt-4 p-6 sm:p-10">
        <h2 className="section-title">Plans by type</h2>
        {stats.totalPlans > 0 ? (
          <table className="mt-6 w-full border-separate border-spacing-y-3">
            <caption className="sr-only">Number of plans of each type</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Plans</th>
              </tr>
            </thead>
            <tbody>
              {stats.plansByType.map((row) => (
                <tr key={row.type} title={`${row.label}: ${row.count} ${row.count === 1 ? "plan" : "plans"}`}>
                  <th scope="row" className="w-36 pr-3 text-left font-normal whitespace-nowrap">
                    <span aria-hidden="true">{row.icon}</span> {row.label}
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${(row.count / maxCount) * 100}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="w-8 text-right font-semibold tabular-nums">{row.count}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-3 text-muted">
            No plans yet.{" "}
            <Link href="/trips" className="link">
              Add a plan to a trip ›
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
