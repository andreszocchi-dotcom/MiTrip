import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { Icon, type IconName } from "@/components/icons";
import { PdfTicketPages } from "@/components/pdf-ticket-pages";
import { StarButton } from "@/components/star-button";
import { SubNav } from "@/components/sub-nav";
import { TicketUpload } from "@/components/ticket-upload";
import { formatDay, formatTime } from "@/lib/dates";
import { airlineOf, flightOf, flightStatusUrl, formatFlight } from "@/lib/flights";
import { googleMapsUrl } from "@/lib/maps";
import { planTypeOf } from "@/lib/plan-types";
import { createClient } from "@/lib/supabase/server";
import { T, themeOf, tripScope } from "@/lib/themes";
import { isPdfTicket, isWalletPass } from "@/lib/tickets";
import { deletePlan } from "../../../plan-actions";
import { removeTicketImage } from "../../../ticket-actions";

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
    .select("*, stars(user_id), days(id, date, trip_id, trips(owner_id, name, theme))")
    .eq("id", Number(planId))
    .maybeSingle();
  if (!plan || !plan.days || plan.days.trip_id !== Number(id)) {
    notFound();
  }

  const day = plan.days;
  const type = planTypeOf(plan.type);
  const isOwner = day.trips?.owner_id === user.id;
  const dayHref = `/trips/${day.trip_id}/days/${day.id}`;

  // Tickets (photos or PDFs) are private; a signed link lets this page show
  // or open one for an hour.
  const ticketIsPdf = isPdfTicket(plan.ticket_image);
  const ticketIsPass = isWalletPass(plan.ticket_image);
  const flight = flightOf(plan);
  const airline = flight ? airlineOf(flight) : null;
  const { data: ticket } = plan.ticket_image
    ? await supabase.storage.from("tickets").createSignedUrl(plan.ticket_image, 60 * 60)
    : { data: null };

  const theme = themeOf(day.trips?.theme ?? "ocean");

  const scope = tripScope(theme);
  const details: { label: string; value: string; icon: IconName; href?: string; action?: string }[] = [];
  if (flight) {
    details.push({ label: "Flight", icon: "plane", value: formatFlight(flight), href: flightStatusUrl(flight), action: "Live status ↗" });
    if (airline) {
      details.push({ label: "Airline", icon: "phone", value: airline.name, href: airline.url, action: "Open ↗" });
    }
  }
  if (plan.address) {
    details.push({ label: "Where", icon: "pin", value: plan.address, href: googleMapsUrl(plan.address) });
  }
  if (plan.confirmation_number) {
    details.push({ label: "Confirmation", icon: "hash", value: plan.confirmation_number });
  }
  if (plan.ticket_url) {
    details.push({ label: "Ticket", icon: "ticket", value: "Open ticket", href: plan.ticket_url });
  }

  return (
    <main className={`flex flex-1 flex-col ${scope.className}`} style={scope.style}>
      <SubNav title={day.trips?.name ?? "Trip"} href={`/trips/${day.trip_id}`}>
        <Link href={dayHref} className="text-foreground/70 hover:text-foreground">
          ‹ {formatDay(day.date)}
        </Link>
      </SubNav>

      <div className="page !max-w-[640px]">
        <header className="pb-10 pt-4 text-center sm:pt-8">
          <span
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{ backgroundColor: T.soft }}
            aria-hidden="true"
          >
            {type.icon}
          </span>
          <p className="eyebrow mt-6" style={{ color: T.strong }}>
            {type.label} · {formatDay(day.date)}
          </p>
          <h1 className="headline-lg mt-2 text-balance">{plan.title}</h1>
          {plan.start_time && (
            <p className="subhead mt-3">
              {formatTime(plan.start_time)}
              {plan.end_time && ` – ${formatTime(plan.end_time)}`}
            </p>
          )}
          <div className="mt-6 flex justify-center">
            <StarButton planId={plan.id} starred={plan.stars.length > 0} size="large" />
          </div>
        </header>

        {details.length > 0 && (
          <ul className="tile divide-y divide-foreground/[0.06] overflow-hidden">
            {details.map((d) => {
              const row = (
                <>
                  <span style={{ color: T.strong }}>
                    <Icon name={d.icon} className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-muted">{d.label}</span>
                    <span className={`block break-words ${d.href ? "" : "select-all"}`}>{d.value}</span>
                  </span>
                  {d.href && <span className="link shrink-0 text-sm">{d.action ?? "Open ↗"}</span>}
                </>
              );
              return (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foreground/[0.02]"
                    >
                      {row}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {plan.notes && (
          <section className="tile mt-4 p-6">
            <p className="text-[13px] text-muted">Notes</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{plan.notes}</p>
          </section>
        )}

        {(ticket?.signedUrl || isOwner) && (
          <section className="tile mt-4 p-6">
            <p className="text-[13px] text-muted">Ticket</p>
            {ticket?.signedUrl && ticketIsPdf && (
              <>
                <div className="mt-3">
                  <PdfTicketPages url={ticket.signedUrl} title={plan.title} />
                </div>
                <a
                  href={ticket.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-4 rounded-[16px] bg-background p-4 transition-colors hover:bg-foreground/[0.05]"
                >
                  <span
                    className="flex h-14 w-11 shrink-0 items-center justify-center rounded-[8px] bg-surface text-[11px] font-bold tracking-wide"
                    style={{ color: T.strong }}
                  >
                    PDF
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">Ticket for {plan.title}</span>
                    <span className="block text-sm text-muted">Opens in a new tab</span>
                  </span>
                  <span className="link text-sm">Open ↗</span>
                </a>
                {isOwner && (
                  <form action={removeTicketImage.bind(null, plan.id)} className="mt-2 text-center">
                    <button type="submit" className="text-sm font-medium text-danger hover:underline">
                      Remove ticket
                    </button>
                  </form>
                )}
              </>
            )}
            {ticket?.signedUrl && ticketIsPass && (
              <>
                <a
                  href={ticket.signedUrl}
                  className="mt-3 flex items-center justify-center gap-2.5 rounded-[14px] bg-black px-5 py-3.5 font-medium text-white ring-1 ring-white/15 transition-opacity hover:opacity-90"
                >
                  <Icon name="wallet" className="h-5 w-5" />
                  Add to Apple Wallet
                </a>
                <p className="mt-2 text-center text-xs text-muted">
                  On iPhone, this opens your boarding pass in Wallet.
                </p>
                {isOwner && (
                  <form action={removeTicketImage.bind(null, plan.id)} className="mt-2 text-center">
                    <button type="submit" className="text-sm font-medium text-danger hover:underline">
                      Remove pass
                    </button>
                  </form>
                )}
              </>
            )}
            {ticket?.signedUrl && !ticketIsPdf && !ticketIsPass && (
              <>
                <a href={ticket.signedUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- private, short-lived signed link */}
                  <img
                    src={ticket.signedUrl}
                    alt={`Ticket for ${plan.title}`}
                    className="max-h-[28rem] w-full rounded-[14px] bg-background object-contain"
                  />
                </a>
                <p className="mt-2 text-center text-xs text-muted">Tap to open full size</p>
                {isOwner && (
                  <form action={removeTicketImage.bind(null, plan.id)} className="mt-2 text-center">
                    <button type="submit" className="text-sm font-medium text-danger hover:underline">
                      Remove ticket
                    </button>
                  </form>
                )}
              </>
            )}
            {isOwner && (
              <TicketUpload tripId={day.trip_id} planId={plan.id} hasTicket={Boolean(plan.ticket_image)} />
            )}
          </section>
        )}

        {isOwner && (
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href={`/trips/${day.trip_id}/plans/${plan.id}/edit`} className="btn btn-secondary flex-1">
              <Icon name="pencil" className="h-5 w-5" />
              Edit plan
            </Link>
            <ConfirmDeleteButton
              action={deletePlan.bind(null, day.trip_id, day.id, plan.id)}
              label="Delete plan"
              warning={`This deletes “${plan.title}”. This can’t be undone.`}
            />
          </div>
        )}
      </div>
    </main>
  );
}
