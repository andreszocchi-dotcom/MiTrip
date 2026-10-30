// Dates come from the database as "YYYY-MM-DD" strings with no time zone.
// Formatting them in UTC keeps "Jan 8" from shifting to "Jan 7" anywhere.
function toDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`);
}

function format(isoDate: string, options: Intl.DateTimeFormatOptions) {
  return toDate(isoDate).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

// "Jan 8 – 24, 2027", "Jan 28 – Feb 2, 2027", or "Dec 28, 2026 – Jan 3, 2027"
export function formatDateRange(start: string, end: string) {
  const [sy, sm] = start.split("-");
  const [ey, em] = end.split("-");
  if (sy !== ey) {
    return `${format(start, { month: "short", day: "numeric", year: "numeric" })} – ${format(end, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  const endPart =
    sm === em ? format(end, { day: "numeric" }) : format(end, { month: "short", day: "numeric" });
  return `${format(start, { month: "short", day: "numeric" })} – ${endPart}, ${sy}`;
}

// "Fri, Jan 8"
export function formatDay(isoDate: string) {
  return format(isoDate, { weekday: "short", month: "short", day: "numeric" });
}

export function countDays(start: string, end: string) {
  return Math.round((toDate(end).getTime() - toDate(start).getTime()) / 86_400_000) + 1;
}

// "20:00:00" -> "8:00 PM"
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}
