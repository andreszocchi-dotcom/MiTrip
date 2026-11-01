"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validatePlan, type FieldErrors } from "@/lib/validation";

// On a problem, the form gets back friendly messages per field plus what
// was typed, so nothing has to be re-entered.
export type PlanFormState =
  | { error?: string; errors?: FieldErrors; values?: ReturnType<typeof readPlan> }
  | undefined;

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
  const plan = readPlan(formData);
  const errors = validatePlan(plan);
  if (Object.keys(errors).length > 0) {
    return { errors, values: plan };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("plans").insert({ day_id: dayId, ...plan });
  if (error) {
    return { error: "We couldn't save this plan. Please try again.", values: plan };
  }
  redirect(`/trips/${tripId}/days/${dayId}`);
}

export async function updatePlan(
  tripId: number,
  planId: number,
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const plan = readPlan(formData);
  const errors = validatePlan(plan);
  if (Object.keys(errors).length > 0) {
    return { errors, values: plan };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .update(plan)
    .eq("id", planId)
    .select("id");
  if (error || data.length === 0) {
    return { error: "We couldn't save your changes. Please try again.", values: plan };
  }
  redirect(`/trips/${tripId}/plans/${planId}`);
}

export async function deletePlan(tripId: number, dayId: number, planId: number) {
  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("ticket_image").eq("id", planId).maybeSingle();
  const { data: deleted } = await supabase.from("plans").delete().eq("id", planId).select("id");
  // Remove the plan's ticket photo too, so no orphaned file is left in storage.
  if (deleted?.length && plan?.ticket_image) {
    await supabase.storage.from("tickets").remove([plan.ticket_image]);
  }
  redirect(`/trips/${tripId}/days/${dayId}`);
}
