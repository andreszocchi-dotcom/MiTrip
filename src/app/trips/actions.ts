"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TripFormState = { error?: string } | undefined;

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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .insert(readTrip(formData))
    .select("id")
    .single();
  if (error) {
    return { error: "We couldn't save this trip. Check the details and try again." };
  }
  redirect(`/trips/${data.id}`);
}

export async function updateTrip(
  tripId: number,
  _prevState: TripFormState,
  formData: FormData,
): Promise<TripFormState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .update(readTrip(formData))
    .eq("id", tripId)
    .select("id");
  if (error || data.length === 0) {
    return { error: "We couldn't save your changes. Check the details and try again." };
  }
  redirect(`/trips/${tripId}`);
}

export async function deleteTrip(tripId: number) {
  const supabase = await createClient();
  await supabase.from("trips").delete().eq("id", tripId);
  redirect("/trips");
}
