import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { formatDay, formatTime } from "@/lib/dates";
import { planTypeOf } from "@/lib/plan-types";
import { createClient } from "@/lib/supabase/server";
import { deletePlan } from "../../../plan-actions";

export const metadata: Metadata = { title: "Plan · MiTrip" };

export default async function PlanPage({ params }: PageProps<"/trips/[id]/plans/[planId]">) {
  const { id, planId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("*, days(id, date, trip_id, trips(owner_id))")
    .eq("id", Number(planId))
    .maybeSingle();
  if (!plan || !plan.days || plan.days.trip_id !== Number(id)) {
    notFound();
  }

  const day = plan.days;
  const type = planTypeOf(plan.type);
  const isOwner = day.trips?.owner_id === user.id;
  const dayHref = `/trips/${day.trip_id}/days/${day.id}`;

  const details = [
    { label: "Confirmation", value: plan.confirmation_number },
    { label: "Address", value: plan.address },
  ].filter((d) => d.value);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <Link href={dayHref} className="mt-6 text-sm font-medium text-muted">
        ← {formatDay(day.date)}
      </Link>

      <section className="mt-4 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium text-accent">
          <span aria-hidden="true">{type.icon}</span> {type.label}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{plan.title}</h1>
        {plan.start_time && (
          <p className="mt-1 text-lg text-muted">
            {formatTime(plan.start_time)}
            {plan.end_time && ` – ${formatTime(plan.end_time)}`}
          </p>
        )}

        {details.length > 0 && (
          <dl className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-5">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs font-medium uppercase text-muted">{d.label}</dt>
                <dd className="mt-0.5 select-all">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {plan.ticket_url && (
          <a
            href={plan.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-xl bg-accent px-4 py-3 text-center text-base font-medium text-white"
          >
            Open ticket ↗
          </a>
        )}

        {plan.notes && (
          <p className="mt-5 whitespace-pre-wrap border-t border-black/5 pt-5 leading-relaxed">
            {plan.notes}
          </p>
        )}
      </section>

      {isOwner && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/trips/${day.trip_id}/plans/${plan.id}/edit`}
            className="flex-1 rounded-xl bg-accent-soft px-4 py-3 text-center text-base font-medium text-accent"
          >
            Edit plan
          </Link>
          <ConfirmDeleteButton
            action={deletePlan.bind(null, day.trip_id, day.id, plan.id)}
            label="Delete plan"
            warning={`This deletes “${plan.title}”. This can’t be undone.`}
          />
        </div>
      )}
    </main>
  );
}
