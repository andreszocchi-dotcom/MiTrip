"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PLAN_TYPES } from "@/lib/plan-types";
import type { PlanFormState } from "./plan-actions";

type Plan = {
  title: string;
  type: string;
  start_time: string | null;
  end_time: string | null;
  address: string | null;
  confirmation_number: string | null;
  ticket_url: string | null;
  notes: string | null;
};

const inputClass =
  "rounded-xl border border-black/10 bg-surface px-4 py-3 text-base font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

// <input type="time"> wants "HH:MM"; the database returns "HH:MM:SS".
const hhmm = (time: string | null | undefined) => time?.slice(0, 5) ?? "";

export function PlanForm({
  action,
  plan,
  submitLabel,
  cancelHref,
}: {
  action: (state: PlanFormState, formData: FormData) => Promise<PlanFormState>;
  plan?: Plan;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Type</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {Object.entries(PLAN_TYPES).map(([value, type]) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={value}
                defaultChecked={(plan?.type ?? "activity") === value}
                className="peer sr-only"
              />
              <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm ring-1 ring-black/10 peer-checked:bg-accent-soft peer-checked:text-accent peer-checked:ring-2 peer-checked:ring-accent">
                <span aria-hidden="true">{type.icon}</span>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Title
        <input
          name="title"
          defaultValue={plan?.title}
          placeholder="Sydney Opera House tour"
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Start time
          <input name="start_time" type="time" defaultValue={hhmm(plan?.start_time)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          End time
          <input name="end_time" type="time" defaultValue={hhmm(plan?.end_time)} className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Address <span className="font-normal text-muted">(optional)</span>
        <input
          name="address"
          defaultValue={plan?.address ?? ""}
          placeholder="Bennelong Point, Sydney NSW 2000"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Confirmation or flight number <span className="font-normal text-muted">(optional)</span>
        <input
          name="confirmation_number"
          defaultValue={plan?.confirmation_number ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Ticket or boarding pass link <span className="font-normal text-muted">(optional)</span>
        <input
          name="ticket_url"
          type="url"
          inputMode="url"
          defaultValue={plan?.ticket_url ?? ""}
          placeholder="https://..."
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notes <span className="font-normal text-muted">(optional)</span>
        <textarea name="notes" rows={4} defaultValue={plan?.notes ?? ""} className={inputClass} />
      </label>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <Link
          href={cancelHref}
          className="flex-1 rounded-xl bg-accent-soft px-4 py-3 text-center text-base font-medium text-accent"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-xl bg-accent px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
