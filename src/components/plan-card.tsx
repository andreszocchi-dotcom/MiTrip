import Link from "next/link";
import { StarButton } from "@/components/star-button";
import { formatTime } from "@/lib/dates";
import { googleMapsUrl } from "@/lib/maps";
import { planTypeOf } from "@/lib/plan-types";

export type PlanCardPlan = {
  id: number;
  title: string;
  type: string;
  start_time: string | null;
  end_time: string | null;
  address: string | null;
  notes?: string | null;
  confirmation_number: string | null;
  ticket_url?: string | null;
};

// One plan as a card: used on the day page, the Starred page, and search.
// Every detail shows in full; cards grow taller instead of cutting text off.
export function PlanCard({
  plan,
  href,
  starred,
  context,
  showTicket = false,
}: {
  plan: PlanCardPlan;
  href: string;
  starred: boolean;
  // Optional line above the title, e.g. "Honeymoon · Sun, Jan 10 · 3:30 PM".
  context?: { text: string; color: string };
  showTicket?: boolean;
}) {
  const type = planTypeOf(plan.type);
  return (
    <li className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
      <Link href={href} className="flex gap-4 p-5 transition-colors active:bg-black/[0.03]">
        <span className="text-2xl" aria-hidden="true">
          {type.icon}
        </span>
        <div className="min-w-0 flex-1">
          {context ? (
            <p className="text-xs font-medium" style={{ color: context.color }}>
              {context.text}
            </p>
          ) : (
            <p className="text-sm text-muted">
              {plan.start_time ? formatTime(plan.start_time) : type.label}
              {plan.end_time && ` – ${formatTime(plan.end_time)}`}
            </p>
          )}
          <p className="mt-0.5 font-medium" data-plan-title>
            {plan.title}
          </p>
          {plan.address && (
            <p className="mt-0.5 break-words text-sm text-muted">{plan.address}</p>
          )}
          {plan.notes && (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
              {plan.notes}
            </p>
          )}
          {plan.confirmation_number && (
            <p className="mt-2 text-xs text-muted">
              Confirmation:{" "}
              <span className="font-medium text-foreground">{plan.confirmation_number}</span>
            </p>
          )}
        </div>
      </Link>
      {showTicket && plan.ticket_url && (
        <a
          href={plan.ticket_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-5 mb-4 block rounded-xl bg-accent px-4 py-3 text-center text-base font-medium text-white"
        >
          Open ticket ↗
        </a>
      )}
      <div className="flex divide-x divide-black/5 border-t border-black/5">
        <div className="flex-1">
          <StarButton planId={plan.id} starred={starred} />
        </div>
        {plan.address && (
          <a
            href={googleMapsUrl(plan.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[2] px-5 py-3 text-center text-sm font-medium text-accent"
          >
            Open in Google Maps ↗
          </a>
        )}
      </div>
    </li>
  );
}
