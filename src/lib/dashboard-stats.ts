import { PLAN_TYPES } from "@/lib/plan-types";

// The dashboard counts "today" in Pacific time, where MiTrip is built and demoed.
const APP_TIME_ZONE = "America/Los_Angeles";

// "YYYY-MM-DD" for right now in Pacific time ("en-CA" formats dates that way).
export function todayIso(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: APP_TIME_ZONE });
}

function daysBetween(from: string, to: string) {
  return Math.round(
    (new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86_400_000,
  );
}

type TripInput = { name: string; start_date: string; end_date: string };

export type DashboardStats = {
  totalTrips: number;
  totalPlans: number;
  // Rounded to one decimal; 0 when there are no trips.
  averagePlansPerTrip: number;
  // The trip happening today, or else the soonest one ahead. Null if none.
  nextTrip: { name: string; daysAway: number; ongoing: boolean } | null;
  // One row per plan type, in PLAN_TYPES order, including types with 0 plans.
  plansByType: { type: keyof typeof PLAN_TYPES; label: string; icon: string; count: number }[];
};

export function computeDashboardStats(
  trips: TripInput[],
  planTypes: string[],
  today: string,
): DashboardStats {
  const totalTrips = trips.length;
  const totalPlans = planTypes.length;
  const averagePlansPerTrip = totalTrips === 0 ? 0 : Math.round((totalPlans / totalTrips) * 10) / 10;

  const ongoing = trips.find((t) => t.start_date <= today && today <= t.end_date);
  const upcoming = trips
    .filter((t) => t.start_date > today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
  const nextTrip = ongoing
    ? { name: ongoing.name, daysAway: 0, ongoing: true }
    : upcoming
      ? { name: upcoming.name, daysAway: daysBetween(today, upcoming.start_date), ongoing: false }
      : null;

  const plansByType = (Object.keys(PLAN_TYPES) as (keyof typeof PLAN_TYPES)[]).map((type) => ({
    type,
    label: PLAN_TYPES[type].label,
    icon: PLAN_TYPES[type].icon,
    count: planTypes.filter((t) => t === type).length,
  }));

  return { totalTrips, totalPlans, averagePlansPerTrip, nextTrip, plansByType };
}
