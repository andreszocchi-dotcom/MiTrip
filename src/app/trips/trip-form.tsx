"use client";

import Link from "next/link";
import { useActionState } from "react";
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

const inputClass =
  "rounded-xl border border-black/10 bg-surface px-4 py-3 text-base font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

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

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Trip name
        <input
          name="name"
          defaultValue={trip?.name}
          placeholder="Australia-NZ Honeymoon"
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Start date
          <input name="start_date" type="date" defaultValue={trip?.start_date} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          End date
          <input name="end_date" type="date" defaultValue={trip?.end_date} className={inputClass} />
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
                defaultChecked={(trip?.theme ?? "ocean") === value}
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
          defaultValue={trip?.google_maps_list_url ?? ""}
          placeholder="https://maps.app.goo.gl/..."
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Itinerary <span className="font-normal text-muted">(optional, paste from Claude or anywhere)</span>
        <textarea
          name="itinerary_text"
          rows={6}
          defaultValue={trip?.itinerary_text ?? ""}
          className={inputClass}
        />
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
