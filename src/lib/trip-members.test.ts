import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/lib/supabase/database.types";

// Runs against the separate "MiTrip test" Supabase project, like the data
// isolation test. Checks the invite link and trip star privacy rules.
const url = process.env.TEST_SUPABASE_URL;
const key = process.env.TEST_SUPABASE_PUBLISHABLE_KEY;

function newClient() {
  return createClient<Database>(url!, key!, { auth: { persistSession: false } });
}

async function signUp(client: ReturnType<typeof newClient>, tag: string) {
  const { data, error } = await client.auth.signUp({
    email: `mitrip.members+${tag}${Date.now()}@example.com`,
    password: "testpass123",
  });
  if (error || !data.session) throw new Error(`Sign-up failed for ${tag}: ${error?.message}`);
  return data.session.user.id;
}

describe.skipIf(!url || !key)("trip members by invite link", () => {
  const owner = newClient();
  const friend = newClient();
  const stranger = newClient();
  let tripId: number;
  let friendId: string;
  const code = `test-invite-${Date.now()}-abcdef`;

  beforeAll(async () => {
    await signUp(owner, "owner");
    friendId = await signUp(friend, "friend");
    await signUp(stranger, "stranger");
    const { data: trip, error } = await owner
      .from("trips")
      .insert({ name: "Lisbon Weekend", start_date: "2027-03-12", end_date: "2027-03-14", invite_code: code })
      .select("id")
      .single();
    if (error) throw error;
    tripId = trip.id;
  });

  afterAll(async () => {
    if (tripId) await owner.from("trips").delete().eq("id", tripId);
  });

  it("a wrong code joins nothing", async () => {
    const { data } = await stranger.rpc("join_trip", { p_code: "not-a-real-invite-code" });
    expect(data).toBeNull();
    const { data: trips } = await stranger.from("trips").select("id");
    expect(trips).toEqual([]);
  });

  it("opening the link makes the friend a viewer who can see the trip", async () => {
    const { data } = await friend.rpc("join_trip", { p_code: code });
    expect(data).toBe(tripId);
    const { data: trips } = await friend.from("trips").select("id, name");
    expect(trips).toEqual([{ id: tripId, name: "Lisbon Weekend" }]);
  });

  it("a viewer cannot change the trip", async () => {
    await friend.from("trips").update({ name: "Hacked" }).eq("id", tripId);
    const { data } = await owner.from("trips").select("name").eq("id", tripId).single();
    expect(data?.name).toBe("Lisbon Weekend");
  });

  it("people on the trip see each other, strangers see no one", async () => {
    const { data: people } = await friend.rpc("trip_people", { p_trip_id: tripId });
    expect(people?.map((p) => p.role).sort()).toEqual(["owner", "viewer"]);
    const { data: none } = await stranger.rpc("trip_people", { p_trip_id: tripId });
    expect(none).toEqual([]);
  });

  it("trip stars are personal: the friend can star the trip, the owner doesn't see it", async () => {
    const { error } = await friend.from("trip_stars").insert({ trip_id: tripId });
    expect(error).toBeNull();
    const { data: ownerStars } = await owner.from("trip_stars").select("trip_id");
    expect(ownerStars).toEqual([]);
    const { error: strangerError } = await stranger.from("trip_stars").insert({ trip_id: tripId });
    expect(strangerError).not.toBeNull();
  });

  it("after the owner turns the link off, it stops working, and the friend can leave", async () => {
    await owner.from("trips").update({ invite_code: null }).eq("id", tripId);
    const { data } = await stranger.rpc("join_trip", { p_code: code });
    expect(data).toBeNull();

    await friend.from("trip_members").delete().eq("trip_id", tripId).eq("user_id", friendId);
    const { data: trips } = await friend.from("trips").select("id");
    expect(trips).toEqual([]);
  });
});
