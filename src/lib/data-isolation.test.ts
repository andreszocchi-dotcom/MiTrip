import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/lib/supabase/database.types";

// Runs against the separate "MiTrip test" Supabase project (same tables and
// Row Level Security rules as the live app), set in .env.test.local.
const url = process.env.TEST_SUPABASE_URL;
const key = process.env.TEST_SUPABASE_PUBLISHABLE_KEY;

// Each user gets their own client, like two different phones.
function newClient() {
  return createClient<Database>(url!, key!, { auth: { persistSession: false } });
}

async function signUp(client: ReturnType<typeof newClient>, tag: string) {
  const { data, error } = await client.auth.signUp({
    email: `mitrip.isolation+${tag}${Date.now()}@example.com`,
    password: "testpass123",
  });
  if (error || !data.session) throw new Error(`Sign-up failed for ${tag}: ${error?.message}`);
}

// PLAN.md section 5, data isolation test.
describe.skipIf(!url || !key)("data isolation: User B cannot see User A's trip", () => {
  const userA = newClient();
  const userB = newClient();
  let tripId: number;

  beforeAll(async () => {
    // Given User A owns the trip "Australia-NZ Honeymoon" with one plan
    await signUp(userA, "a");
    const { data: trip, error } = await userA
      .from("trips")
      .insert({ name: "Australia-NZ Honeymoon", start_date: "2027-01-08", end_date: "2027-01-24" })
      .select("id")
      .single();
    if (error) throw error;
    tripId = trip.id;
    // The database adds the trip's days itself; read them in a second request.
    const { data: days } = await userA.from("days").select("id").eq("trip_id", tripId).order("date");
    const { error: planError } = await userA
      .from("plans")
      .insert({ day_id: days![0].id, title: "SFO to Sydney", type: "flight" });
    if (planError) throw planError;

    // and User B is a separate account that is not a member of it
    await signUp(userB, "b");
  });

  afterAll(async () => {
    if (tripId) await userA.from("trips").delete().eq("id", tripId);
  });

  it("User A can see their own trip (so the setup really worked)", async () => {
    const { data } = await userA.from("trips").select("id").eq("id", tripId).maybeSingle();
    expect(data?.id).toBe(tripId);
  });

  it("User B's trip list is empty", async () => {
    // When User B loads their trip list (the same query as the My trips page)
    const { data } = await userB.from("trips").select("id, name, start_date, end_date, theme, owner_id");
    // Then it is empty
    expect(data).toEqual([]);
  });

  it("opening User A's trip by its direct link finds nothing, so the page shows Trip not found", async () => {
    // When User B opens User A's trip by its id (the same query as the trip page)
    const { data } = await userB
      .from("trips")
      .select("*, days(id, date, greeting, plans(count))")
      .eq("id", tripId)
      .maybeSingle();
    // Then nothing comes back, which is what makes the page show "Trip not found"
    expect(data).toBeNull();
  });

  it("User B cannot see User A's plan either", async () => {
    const { data } = await userB.from("plans").select("id, title");
    expect(data).toEqual([]);
  });
});
