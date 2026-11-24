import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { computeDashboardStats, todayIso } from "@/lib/dashboard-stats";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard · MiTrip" };

function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="tile p-5 sm:p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{value}</p>
      {detail && <p className="mt-2 truncate text-sm text-muted">{detail}</p>}
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
    supabase.from("trips").select("name, start_date, end_date"),
    supabase.from("plans").select("type"),
  ]);

  const stats = computeDashboardStats(
    trips ?? [],
    (plans ?? []).map((p) => p.type),
    todayIso(),
  );
  const maxCount = Math.max(...stats.plansByType.map((row) => row.count), 1);

  const next = stats.nextTrip;
  const nextValue = !next ? "None" : next.ongoing ? "Now" : `${next.daysAway}`;
  const nextDetail = !next
    ? "No upcoming trips"
    : next.ongoing
      ? `${next.name} is happening`
      : `${next.daysAway === 1 ? "day" : "days"} until ${next.name}`;

  return (
    <main className="page">
      <h1 className="headline">Dashboard</h1>
      <p className="subhead mt-2 !text-[19px]">Your trips at a glance.</p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
        <StatTile label="Total trips" value={`${stats.totalTrips}`} />
        <StatTile label="Total plans" value={`${stats.totalPlans}`} />
        <StatTile label="Avg plans per trip" value={stats.averagePlansPerTrip.toFixed(1)} />
        <StatTile label="Next trip" value={nextValue} detail={nextDetail} />
      </div>

      <section className="tile mt-4 p-6 sm:p-8">
        <h2 className="section-title">Plans by type</h2>
        {stats.totalPlans > 0 ? (
          <table className="mt-4 w-full border-separate border-spacing-y-2">
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
                  <th scope="row" className="w-32 pr-3 text-left text-sm font-normal whitespace-nowrap">
                    <span aria-hidden="true">{row.icon}</span> {row.label}
                  </th>
                  <td className="text-sm">
                    <div className="flex items-center gap-2">
                      {row.count > 0 && (
                        <div
                          className="h-2.5 rounded-full bg-accent"
                          style={{ width: `${(row.count / maxCount) * 80}%` }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="tabular-nums text-muted">{row.count}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-3 text-sm text-muted">
            No plans yet. <Link href="/trips" className="font-medium text-accent">Add a plan to a trip</Link> to see the chart.
          </p>
        )}
      </section>
    </main>
  );
}
