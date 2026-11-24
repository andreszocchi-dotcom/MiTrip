import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { notFound } from "next/navigation";
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
    <main className="page !max-w-[640px]">
      <PageHero title="Edit plan." />
      <div className="tile p-6 sm:p-10">
      <PlanForm
        action={updatePlan.bind(null, plan.days.trip_id, plan.id)}
        plan={plan}
        submitLabel="Save changes"
        cancelHref={`/trips/${plan.days.trip_id}/plans/${plan.id}`}
      />
      </div>
    </main>
  );
}
