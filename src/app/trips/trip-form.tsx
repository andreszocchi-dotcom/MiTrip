"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FieldError, errorProps, inputClass } from "@/components/form-field";
import { THEMES } from "@/lib/themes";
import type { TripFormState } from "./actions";

type Trip = {
  name: string;
  start_date: string;
  end_date: string;
  theme: string;
  google_maps_list_url: string | null;
  itinerary_text: string | null;
};

export function TripForm({
  action,
  trip,
  submitLabel,
  cancelHref,
}: {
  action: (state: TripFormState, formData: FormData) => Promise<TripFormState>;
  trip?: Trip;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // After a failed save, show what was typed rather than the original values.
  const values = state?.values ?? trip;
  const errors = state?.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  return (
    // noValidate: our own friendly messages replace the browser's pop-ups.
    <form action={formAction} noValidate className="mt-6 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Trip name
        <input
          name="name"
          defaultValue={values?.name}
          placeholder="Australia-NZ Honeymoon"
          className={inputClass(!!errors.name)}
          {...errorProps("name", errors.name)}
        />
        <FieldError id="name-error" message={errors.name} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Start date
          <input
            name="start_date"
            type="date"
            defaultValue={values?.start_date}
            className={inputClass(!!errors.start_date)}
            {...errorProps("start_date", errors.start_date)}
          />
          <FieldError id="start_date-error" message={errors.start_date} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          End date
          <input
            name="end_date"
            type="date"
            defaultValue={values?.end_date}
            className={inputClass(!!errors.end_date)}
            {...errorProps("end_date", errors.end_date)}
          />
          <FieldError id="end_date-error" message={errors.end_date} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Trip color</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {Object.entries(THEMES).map(([value, theme]) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={value}
                defaultChecked={(values?.theme ?? "ocean") === value}
                className="peer sr-only"
              />
              <span
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 peer-checked:ring-2 peer-checked:ring-[var(--ring)]"
                style={{ backgroundColor: theme.soft, color: theme.strong, ["--ring" as string]: theme.strong }}
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.strong }} />
                {theme.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Google Maps list link <span className="font-normal text-muted">(optional)</span>
        <input
          name="google_maps_list_url"
          type="url"
          inputMode="url"
          defaultValue={values?.google_maps_list_url ?? ""}
          placeholder="https://maps.app.goo.gl/..."
          className={inputClass(!!errors.google_maps_list_url)}
          {...errorProps("google_maps_list_url", errors.google_maps_list_url)}
        />
        <FieldError id="google_maps_list_url-error" message={errors.google_maps_list_url} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Itinerary <span className="font-normal text-muted">(optional, paste from Claude or anywhere)</span>
        <textarea
          name="itinerary_text"
          rows={6}
          defaultValue={values?.itinerary_text ?? ""}
          className={inputClass()}
        />
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
