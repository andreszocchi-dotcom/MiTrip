import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { PlanCard } from "@/components/plan-card";
import { formatDay, formatTime } from "@/lib/dates";
import { PLAN_TYPES } from "@/lib/plan-types";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";

export const metadata: Metadata = { title: "Search · MiTrip" };

const SORTS = {
  date: "Date and time",
  newest: "Newest added",
} as const;

// The search box, type, trip, and sort all live in the page address
// (e.g. /search?q=aria&type=reservation&sort=date), so results can be
// bookmarked and the Back button works.
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = one(params.q).trim();
  const type = one(params.type);
  const tripFilter = one(params.trip);
  const sort = one(params.sort) === "newest" ? "newest" : "date";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Trips for the trip filter (Row Level Security: mine and shared with me).
  const { data: trips } = await supabase.from("trips").select("id, name").order("start_date");

  // "!inner" keeps only plans whose day and trip match the filters.
  let query = supabase
    .from("plans")
    .select("*, stars(user_id), days!inner(id, date, trip_id, trips!inner(name, theme))")
    .limit(200);
  if (q) {
    // Characters with special meaning in the filter syntax are dropped.
    const term = q.replace(/[%,()*\\]/g, " ").trim();
    if (term) {
      query = query.or(`title.ilike.%${term}%,address.ilike.%${term}%,notes.ilike.%${term}%`);
    }
  }
  if (type in PLAN_TYPES) query = query.eq("type", type);
  if (tripFilter) query = query.eq("days.trip_id", Number(tripFilter));
  const { data: results } = await query;

  const plans = [...(results ?? [])].sort((a, b) =>
    sort === "newest"
      ? b.created_at.localeCompare(a.created_at)
      : (a.days.date + (a.start_time ?? "99")).localeCompare(b.days.date + (b.start_time ?? "99")),
  );

  const hasFilters = Boolean(q || type || tripFilter);
  const fieldClass =
    "rounded-xl border border-black/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <h1 className="mt-8 text-3xl font-semibold">Search</h1>

      {/* A plain GET form: submitting it just updates the page address. */}
      <form action="/search" className="mt-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search titles, places, notes"
            aria-label="Search plans"
            className={`${fieldClass} flex-1 text-base`}
          />
          <button type="submit" className="rounded-xl bg-accent px-4 text-sm font-medium text-white">
            Search
          </button>
        </div>

        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Type</legend>
          {[["", { label: "All", icon: "" }] as const, ...Object.entries(PLAN_TYPES)].map(
            ([value, t]) => (
              <label key={value || "all"} className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={value}
                  defaultChecked={type === value || (!(type in PLAN_TYPES) && value === "")}
                  className="peer sr-only"
                />
                <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-sm ring-1 ring-black/10 peer-checked:bg-accent-soft peer-checked:text-accent peer-checked:ring-2 peer-checked:ring-accent">
                  {t.icon && <span aria-hidden="true">{t.icon}</span>}
                  {t.label}
                </span>
              </label>
            ),
          )}
        </fieldset>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Trip
            <select name="trip" defaultValue={tripFilter} className={fieldClass}>
              <option value="">All trips</option>
              {(trips ?? []).map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Sort by
            <select name="sort" defaultValue={sort} className={fieldClass}>
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-accent-soft px-4 py-2.5 text-sm font-medium text-accent"
        >
          Apply filters
        </button>
      </form>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-sm text-muted" role="status">
          {plans.length === 200 ? "200+" : plans.length} {plans.length === 1 ? "plan" : "plans"}
          {hasFilters && " found"}
        </p>
        {hasFilters && (
          <Link href="/search" className="text-sm font-medium text-accent">
            Clear
          </Link>
        )}
      </div>

      {plans.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              href={`/trips/${plan.days.trip_id}/plans/${plan.id}`}
              starred={plan.stars.length > 0}
              showTicket
              context={{
                text: `${plan.days.trips.name} · ${formatDay(plan.days.date)}${plan.start_time ? ` · ${formatTime(plan.start_time)}` : ""}`,
                color: themeOf(plan.days.trips.theme).strong,
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
          <p className="font-medium">No plans match</p>
          <p className="mt-1 text-sm text-muted">Try a different word, or clear the filters.</p>
        </div>
      )}
    </main>
  );
}
