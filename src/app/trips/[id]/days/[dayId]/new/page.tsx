import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { formatDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { createPlan } from "../../../../plan-actions";
import { PlanForm } from "../../../../plan-form";

export const metadata: Metadata = { title: "Add plan · MiTrip" };

export default async function NewPlanPage({ params }: PageProps<"/trips/[id]/days/[dayId]/new">) {
  const { id, dayId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: day } = await supabase
    .from("days")
    .select("id, date, trip_id, trips(owner_id)")
    .eq("id", Number(dayId))
    .eq("trip_id", Number(id))
    .maybeSingle();
  if (!day || day.trips?.owner_id !== user?.id) {
    notFound();
  }

  const dayHref = `/trips/${day.trip_id}/days/${day.id}`;
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <h1 className="mt-8 text-3xl font-semibold">Add a plan</h1>
      <p className="mt-1 text-muted">{formatDay(day.date)}</p>
      <PlanForm
        action={createPlan.bind(null, day.trip_id, day.id)}
        submitLabel="Add plan"
        cancelHref={dayHref}
      />
    </main>
  );
}
