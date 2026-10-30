// The five plan types from PLAN.md section 3 (the database only accepts these).
export const PLAN_TYPES = {
  flight: { label: "Flight", icon: "✈️" },
  hotel: { label: "Hotel", icon: "🏨" },
  reservation: { label: "Reservation", icon: "🍽️" },
  ticket: { label: "Ticket", icon: "🎟️" },
  activity: { label: "Activity", icon: "📍" },
} as const;

export function planTypeOf(type: string) {
  return PLAN_TYPES[type as keyof typeof PLAN_TYPES] ?? PLAN_TYPES.activity;
}
