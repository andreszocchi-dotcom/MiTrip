"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PlanFormState = { error?: string } | undefined;

function readPlan(formData: FormData) {
  const optional = (key: string) => String(formData.get(key) ?? "").trim() || null;
  return {
    title: String(formData.get("title") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    start_time: optional("start_time"),
    end_time: optional("end_time"),
    address: optional("address"),
    confirmation_number: optional("confirmation_number"),
    ticket_url: optional("ticket_url"),
    notes: optional("notes"),
  };
}

export async function createPlan(
  tripId: number,
  dayId: number,
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const supabase = await createClient();
  const { error } = await supabase.from("plans").insert({ day_id: dayId, ...readPlan(formData) });
  if (error) {
    return { error: "We couldn't save this plan. Check the details and try again." };
  }
  redirect(`/trips/${tripId}/days/${dayId}`);
}

export async function updatePlan(
  tripId: number,
  planId: number,
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .update(readPlan(formData))
    .eq("id", planId)
    .select("id");
  if (error || data.length === 0) {
    return { error: "We couldn't save your changes. Check the details and try again." };
  }
  redirect(`/trips/${tripId}/plans/${planId}`);
}

export async function deletePlan(tripId: number, dayId: number, planId: number) {
  const supabase = await createClient();
  await supabase.from("plans").delete().eq("id", planId);
  redirect(`/trips/${tripId}/days/${dayId}`);
}
