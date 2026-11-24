"use server";

import { randomBytes } from "node:crypto";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// A long random code, so invite links can't be guessed.
function newInviteCode() {
  return randomBytes(18).toString("base64url");
}

// Creates the trip's invite link, or replaces it so the old link stops
// working. Row Level Security only lets the owner change the trip.
export async function resetInviteLink(tripId: number) {
  const supabase = await createClient();
  await supabase.from("trips").update({ invite_code: newInviteCode() }).eq("id", tripId);
  refresh();
}

// Turns the link off. People who already joined stay on the trip.
export async function turnOffInviteLink(tripId: number) {
  const supabase = await createClient();
  await supabase.from("trips").update({ invite_code: null }).eq("id", tripId);
  refresh();
}

// The owner removes someone from the trip.
export async function removeMember(tripId: number, userId: string) {
  const supabase = await createClient();
  await supabase.from("trip_members").delete().eq("trip_id", tripId).eq("user_id", userId);
  refresh();
}

// A member leaves a trip that was shared with them.
export async function leaveTrip(tripId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("trip_members").delete().eq("trip_id", tripId).eq("user_id", user.id);
  redirect("/trips");
}
