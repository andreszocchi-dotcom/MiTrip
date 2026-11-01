"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// The browser has already uploaded the photo to the private "tickets" bucket
// at "<trip>/<plan>/<file>". This saves that path on the plan and removes the
// photo it replaces. Row Level Security only lets the trip owner do either.
export async function saveTicketImage(tripId: number, planId: number, path: string) {
  if (!path.startsWith(`${tripId}/${planId}/`)) {
    return { error: "That upload doesn't belong to this plan." };
  }
  const supabase = await createClient();
  const { data: old } = await supabase.from("plans").select("ticket_image").eq("id", planId).maybeSingle();
  const { data, error } = await supabase
    .from("plans")
    .update({ ticket_image: path })
    .eq("id", planId)
    .select("id");
  if (error || !data?.length) {
    await supabase.storage.from("tickets").remove([path]);
    return { error: "We couldn't attach the ticket. Please try again." };
  }
  if (old?.ticket_image && old.ticket_image !== path) {
    await supabase.storage.from("tickets").remove([old.ticket_image]);
  }
  refresh();
  return {};
}

export async function removeTicketImage(planId: number) {
  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("ticket_image").eq("id", planId).maybeSingle();
  if (!plan?.ticket_image) return;
  const { data } = await supabase.from("plans").update({ ticket_image: null }).eq("id", planId).select("id");
  if (data?.length) {
    await supabase.storage.from("tickets").remove([plan.ticket_image]);
  }
  refresh();
}
