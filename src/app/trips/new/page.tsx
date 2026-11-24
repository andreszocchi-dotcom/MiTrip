import type { Metadata } from "next";
import { createTrip } from "../actions";
import { TripForm } from "../trip-form";

export const metadata: Metadata = { title: "Add trip · MiTrip" };

export default function NewTripPage() {
  return (
    <main className="page">
      <h1 className="headline">Add a trip</h1>
      <TripForm action={createTrip} submitLabel="Add trip" cancelHref="/trips" />
    </main>
  );
}
