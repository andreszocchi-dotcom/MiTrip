"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FieldError, errorProps, inputClass } from "@/components/form-field";
import { TripScene } from "@/components/trip-scene";
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
    <form action={formAction} noValidate className="flex flex-col gap-6">
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
        <legend className="text-sm font-medium">Scene</legend>
        <p className="text-sm text-muted">Sets the trip&apos;s color and the picture on its pages.</p>
        <div className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
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
                className="block overflow-hidden rounded-[16px] ring-offset-2 transition-shadow peer-checked:ring-[3px] peer-checked:ring-[var(--ring)] peer-focus-visible:ring-[3px] peer-focus-visible:ring-accent"
                style={{ ["--ring" as string]: theme.strong }}
              >
                <span className="relative block aspect-[4/3]">
                  <TripScene theme={value} uid={`pick-${value}`} animated={false} className="absolute inset-0 h-full w-full" />
                </span>
              </span>
              <span className="mt-1.5 block text-center text-[13px] font-medium" style={{ color: theme.ink }}>
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
        <span>
          Itinerary <span className="font-normal text-muted">(optional)</span>
        </span>
        <span id="itinerary_text-help" className="font-normal text-muted">
          Paste your day-by-day plans, then use ✨ Import on the trip page and AI sorts each item into
          the right day. No plan yet? Ask Claude or ChatGPT to &ldquo;list my trip day by day&rdquo; and
          paste the result.
        </span>
        <textarea
          name="itinerary_text"
          rows={6}
          defaultValue={values?.itinerary_text ?? ""}
          placeholder={
            "Day 1 (Mar 12): Fly to Lisbon, TAP 204 lands 9:40am\n" +
            "Day 2: Belém Tower in the morning, dinner at Ramiro\n" +
            "Day 3: Day trip to Sintra"
          }
          aria-describedby="itinerary_text-help"
          className={inputClass()}
        />
      </label>

      {(hasErrors || state?.error) && (
        <p role="alert" className="rounded-[12px] bg-red-50 px-4 py-3 text-sm text-red-700">
          {state?.error ?? "Almost there. Fix the fields marked in red above."}
        </p>
      )}

      <div className="flex gap-3">
        <Link
          href={cancelHref}
          className="btn btn-secondary flex-1"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary flex-1"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
