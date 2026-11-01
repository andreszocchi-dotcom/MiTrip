"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Adds or removes one row in the shared stars table: "this user starred
// this plan". Row Level Security only allows starring plans I can see and
// only removing my own stars.
export async function setStar(planId: number, starred: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (starred) {
    await supabase.from("stars").upsert({ user_id: user.id, plan_id: planId });
  } else {
    await supabase.from("stars").delete().eq("plan_id", planId).eq("user_id", user.id);
  }
  refresh();
}
