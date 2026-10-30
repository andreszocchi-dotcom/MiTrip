import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import { updatePlan } from "../../../../plan-actions";
import { PlanForm } from "../../../../plan-form";

export const metadata: Metadata = { title: "Edit plan · MiTrip" };

export default async function EditPlanPage({ params }: PageProps<"/trips/[id]/plans/[planId]/edit">) {
  const { id, planId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plan } = await supabase
    .from("plans")
    .select("*, days(trip_id, trips(owner_id))")
    .eq("id", Number(planId))
    .maybeSingle();
  if (!plan || plan.days?.trip_id !== Number(id) || plan.days.trips?.owner_id !== user?.id) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <h1 className="mt-8 text-3xl font-semibold">Edit plan</h1>
      <PlanForm
        action={updatePlan.bind(null, plan.days.trip_id, plan.id)}
        plan={plan}
        submitLabel="Save changes"
        cancelHref={`/trips/${plan.days.trip_id}/plans/${plan.id}`}
      />
    </main>
  );
}
