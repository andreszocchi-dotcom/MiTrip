"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FieldError, errorProps, inputClass } from "@/components/form-field";
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
  // After a failed save, show what was typed rather than the original values.
  const values = state?.values ?? plan;
  const errors = state?.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  return (
    // noValidate: our own friendly messages replace the browser's pop-ups.
    <form action={formAction} noValidate className="mt-6 flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2" {...errorProps("type", errors.type)}>
        <legend className="text-sm font-medium">Type</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {Object.entries(PLAN_TYPES).map(([value, type]) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={value}
                defaultChecked={(values?.type ?? "activity") === value}
                className="peer sr-only"
              />
              <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm ring-1 ring-black/10 peer-checked:bg-accent-soft peer-checked:text-accent peer-checked:ring-2 peer-checked:ring-accent">
                <span aria-hidden="true">{type.icon}</span>
                {type.label}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="type-error" message={errors.type} />
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Title
        <input
          name="title"
          defaultValue={values?.title}
          placeholder="Sydney Opera House tour"
          className={inputClass(!!errors.title)}
          {...errorProps("title", errors.title)}
        />
        <FieldError id="title-error" message={errors.title} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Start time
          <input name="start_time" type="time" defaultValue={hhmm(values?.start_time)} className={inputClass()} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          End time
          <input name="end_time" type="time" defaultValue={hhmm(values?.end_time)} className={inputClass()} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Address <span className="font-normal text-muted">(optional)</span>
        <input
          name="address"
          defaultValue={values?.address ?? ""}
          placeholder="Bennelong Point, Sydney NSW 2000"
          className={inputClass()}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Confirmation or flight number <span className="font-normal text-muted">(optional)</span>
        <input
          name="confirmation_number"
          defaultValue={values?.confirmation_number ?? ""}
          className={inputClass()}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Ticket or boarding pass link <span className="font-normal text-muted">(optional)</span>
        <input
          name="ticket_url"
          type="url"
          inputMode="url"
          defaultValue={values?.ticket_url ?? ""}
          placeholder="https://..."
          className={inputClass(!!errors.ticket_url)}
          {...errorProps("ticket_url", errors.ticket_url)}
        />
        <FieldError id="ticket_url-error" message={errors.ticket_url} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notes <span className="font-normal text-muted">(optional)</span>
        <textarea name="notes" rows={4} defaultValue={values?.notes ?? ""} className={inputClass()} />
      </label>

      {(hasErrors || state?.error) && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state?.error ?? "Almost there. Fix the fields marked in red above."}
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
