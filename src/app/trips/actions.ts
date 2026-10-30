"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateTrip, type FieldErrors } from "@/lib/validation";

// On a problem, the form gets back friendly messages per field plus what
// was typed, so nothing has to be re-entered.
export type TripFormState =
  | { error?: string; errors?: FieldErrors; values?: ReturnType<typeof readTrip> }
  | undefined;

function readTrip(formData: FormData) {
  const optional = (key: string) => String(formData.get(key) ?? "").trim() || null;
  return {
    name: String(formData.get("name") ?? "").trim(),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    theme: String(formData.get("theme") ?? "ocean"),
    google_maps_list_url: optional("google_maps_list_url"),
    itinerary_text: optional("itinerary_text"),
  };
}

export async function createTrip(
  _prevState: TripFormState,
  formData: FormData,
): Promise<TripFormState> {
  const trip = readTrip(formData);
  const errors = validateTrip(trip);
  if (Object.keys(errors).length > 0) {
    return { errors, values: trip };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("trips").insert(trip).select("id").single();
  if (error) {
    return { error: "We couldn't save this trip. Please try again.", values: trip };
  }
  redirect(`/trips/${data.id}`);
}

export async function updateTrip(
  tripId: number,
  _prevState: TripFormState,
  formData: FormData,
): Promise<TripFormState> {
  const trip = readTrip(formData);
  const errors = validateTrip(trip);
  if (Object.keys(errors).length > 0) {
    return { errors, values: trip };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .update(trip)
    .eq("id", tripId)
    .select("id");
  if (error || data.length === 0) {
    return { error: "We couldn't save your changes. Please try again.", values: trip };
  }
  redirect(`/trips/${tripId}`);
}

export async function deleteTrip(tripId: number) {
  const supabase = await createClient();
  await supabase.from("trips").delete().eq("id", tripId);
  redirect("/trips");
}
