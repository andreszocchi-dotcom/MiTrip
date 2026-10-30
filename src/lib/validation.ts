// Validation rules for the trip and plan forms (PLAN.md feature 4).
// Each function returns a friendly message per field that has a problem,
// or an empty object when everything is fine. The server runs these before
// saving, so the rules hold even if someone skips the form.

export type FieldErrors = Record<string, string>;

export const MAX_TRIP_DAYS = 90;

function isWebLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export type TripInput = {
  name: string;
  start_date: string;
  end_date: string;
  google_maps_list_url: string | null;
};

export function validateTrip(trip: TripInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!trip.name) errors.name = "Give your trip a name.";
  if (!trip.start_date) errors.start_date = "Pick the day your trip starts.";
  if (!trip.end_date) errors.end_date = "Pick the day your trip ends.";
  if (trip.start_date && trip.end_date) {
    if (trip.end_date < trip.start_date) {
      errors.end_date = "The end date can’t be before the start date.";
    } else {
      const days =
        (Date.parse(trip.end_date) - Date.parse(trip.start_date)) / 86_400_000 + 1;
      if (days > MAX_TRIP_DAYS) {
        errors.end_date = `Trips can be up to ${MAX_TRIP_DAYS} days long.`;
      }
    }
  }
  if (trip.google_maps_list_url && !isWebLink(trip.google_maps_list_url)) {
    errors.google_maps_list_url = "That doesn’t look like a link. Paste the full address starting with https://";
  }
  return errors;
}

export const PLAN_TYPE_VALUES = ["flight", "hotel", "reservation", "ticket", "activity"];

export type PlanInput = {
  title: string;
  type: string;
  ticket_url: string | null;
};

export function validatePlan(plan: PlanInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!plan.title) errors.title = "Give this plan a title, like “Dinner at Aria”.";
  if (!PLAN_TYPE_VALUES.includes(plan.type)) errors.type = "Choose what kind of plan this is.";
  if (plan.ticket_url && !isWebLink(plan.ticket_url)) {
    errors.ticket_url = "That doesn’t look like a link. Paste the full address starting with https://";
  }
  return errors;
}
