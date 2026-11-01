import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { countDays, formatDateRange, formatDay, formatTime } from "@/lib/dates";
import { googleMapsUrl } from "@/lib/maps";
import { sortPlansByTime } from "@/lib/plan-order";
import { planTypeOf } from "@/lib/plan-types";
import { createClient } from "@/lib/supabase/server";
import { themeOf } from "@/lib/themes";

export const metadata: Metadata = { title: "Save as PDF · MiTrip" };

// The whole trip on one page, laid out for printing, so it can be saved as a
// PDF and used with no signal: every day, plan, and ticket photo.
export default async function PrintTripPage({ params }: PageProps<"/trips/[id]/print">) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Row Level Security returns nothing if I don't own or share this trip.
  const { data: trip } = await supabase
    .from("trips")
    .select("id, name, start_date, end_date, theme, days(id, date, greeting, summary, plans(*))")
    .eq("id", Number(id))
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip) {
    notFound();
  }

  const theme = themeOf(trip.theme);
  const days = trip.days.map((d) => ({ ...d, plans: sortPlansByTime(d.plans) }));

  // Ticket photos are private; signed links let them load long enough to print.
  const ticketPaths = days.flatMap((d) => d.plans.map((p) => p.ticket_image)).filter((p) => p !== null);
  const { data: signed } = ticketPaths.length
    ? await supabase.storage.from("tickets").createSignedUrls(ticketPaths, 60 * 60)
    : { data: [] };
  const ticketUrl = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 [print-color-adjust:exact] print:max-w-none print:px-0 print:py-0">
      <div className="flex flex-col gap-3 print:hidden">
        <Link href={`/trips/${trip.id}`} className="text-sm font-medium text-muted">
          ← {trip.name}
        </Link>
        <PrintButton color={theme.strong} />
        <p className="text-center text-sm text-muted">
          On iPhone, tap Save as PDF, then the share button, then Save to Files.
        </p>
      </div>

      <header className="mt-8 border-b-4 pb-4 print:mt-0" style={{ borderColor: theme.strong }}>
        <h1 className="text-3xl font-semibold" style={{ color: theme.strong }}>
          {trip.name}
        </h1>
        <p className="mt-1 text-foreground">
          {formatDateRange(trip.start_date, trip.end_date)} · {countDays(trip.start_date, trip.end_date)} days
          <span className="text-muted"> · Saved from MiTrip</span>
        </p>
      </header>

      {days.map((day, index) => (
        <section key={day.id} className="mt-8">
          <div className="break-after-avoid border-b pb-2" style={{ borderColor: theme.soft }}>
            <h2 className="text-xl font-semibold">
              <span style={{ color: theme.strong }}>Day {index + 1}</span> · {formatDay(day.date)}
            </h2>
            {day.greeting && <p className="mt-0.5 text-muted">{day.greeting}</p>}
            {day.summary && <p className="mt-0.5 text-sm text-muted italic">{day.summary}</p>}
          </div>

          {day.plans.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {day.plans.map((plan) => {
                const type = planTypeOf(plan.type);
                const photo = plan.ticket_image ? ticketUrl.get(plan.ticket_image) : undefined;
                return (
                  <li key={plan.id} className="break-inside-avoid rounded-xl p-4 ring-1 ring-black/10">
                    <p className="text-sm text-muted">
                      {plan.start_time && (
                        <span className="font-medium text-foreground">
                          {formatTime(plan.start_time)}
                          {plan.end_time && ` – ${formatTime(plan.end_time)}`}
                          {" · "}
                        </span>
                      )}
                      <span aria-hidden="true">{type.icon}</span> {type.label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold">{plan.title}</p>
                    <dl className="mt-1 flex flex-col gap-0.5 text-sm">
                      {plan.confirmation_number && (
                        <div>
                          <dt className="inline text-muted">Confirmation: </dt>
                          <dd className="inline font-medium">{plan.confirmation_number}</dd>
                        </div>
                      )}
                      {plan.address && (
                        <div>
                          <dt className="inline text-muted">Address: </dt>
                          <dd className="inline">
                            <a href={googleMapsUrl(plan.address)} className="underline">
                              {plan.address}
                            </a>
                          </dd>
                        </div>
                      )}
                      {plan.ticket_url && (
                        <div>
                          <dt className="inline text-muted">Ticket link: </dt>
                          <dd className="inline break-all">
                            <a href={plan.ticket_url} className="underline">
                              {plan.ticket_url}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                    {plan.notes && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{plan.notes}</p>}
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element -- private, short-lived signed link
                      <img
                        src={photo}
                        alt={`Ticket for ${plan.title}`}
                        className="mt-3 max-h-72 rounded-lg object-contain ring-1 ring-black/10"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Nothing planned.</p>
          )}
        </section>
      ))}
    </main>
  );
}
