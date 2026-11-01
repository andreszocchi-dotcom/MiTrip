import { describe, expect, it } from "vitest";
import { computeDashboardStats } from "@/lib/dashboard-stats";

// PLAN.md section 5, dashboard test.
describe("dashboard: days until next trip", () => {
  it("shows 71 on Oct 29, 2026 when the trips start Jan 8, Jan 28, and Mar 17, 2027", () => {
    // Given today is Oct 29, 2026 and a user has these three trips
    const today = "2026-10-29";
    const trips = [
      { name: "Australia-NZ Honeymoon", start_date: "2027-01-08", end_date: "2027-01-24" },
      { name: "Trip starting Jan 28", start_date: "2027-01-28", end_date: "2027-02-02" },
      { name: "Trip starting Mar 17", start_date: "2027-03-17", end_date: "2027-03-22" },
    ];

    // When the dashboard calculates "days until next trip"
    const stats = computeDashboardStats(trips, [], today);

    // Then it shows 71, counting down to the soonest trip
    expect(stats.nextTrip).toEqual({ name: "Australia-NZ Honeymoon", daysAway: 71, ongoing: false });
  });
});
