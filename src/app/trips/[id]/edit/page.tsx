import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import { updateTrip } from "../../actions";
import { TripForm } from "../../trip-form";

export const metadata: Metadata = { title: "Edit trip · MiTrip" };

export default async function EditTripPage({ params }: PageProps<"/trips/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("id, owner_id, name, start_date, end_date, theme, google_maps_list_url, itinerary_text")
    .eq("id", Number(id))
    .maybeSingle();
  if (!trip || trip.owner_id !== user?.id) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <h1 className="mt-8 text-3xl font-semibold">Edit trip</h1>
      <TripForm
        action={updateTrip.bind(null, trip.id)}
        trip={trip}
        submitLabel="Save changes"
        cancelHref={`/trips/${trip.id}`}
      />
    </main>
  );
}
