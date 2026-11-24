import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { createTrip } from "../actions";
import { TripForm } from "../trip-form";

export const metadata: Metadata = { title: "Add trip · MiTrip" };

export default function NewTripPage() {
  return (
    <main className="page !max-w-[640px]">
      <PageHero title="Where to next?" subtitle="Add the dates, pick a scene, and MiTrip makes a page for every day." />
      <div className="tile p-6 sm:p-10">
      <TripForm action={createTrip} submitLabel="Add trip" cancelHref="/trips" />
      </div>
    </main>
  );
}
