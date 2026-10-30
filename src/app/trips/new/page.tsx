import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { createTrip } from "../actions";
import { TripForm } from "../trip-form";

export const metadata: Metadata = { title: "Add trip · MiTrip" };

export default function NewTripPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <h1 className="mt-8 text-3xl font-semibold">Add a trip</h1>
      <TripForm action={createTrip} submitLabel="Add trip" cancelHref="/trips" />
    </main>
  );
}
