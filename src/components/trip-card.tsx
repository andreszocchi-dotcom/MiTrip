import Link from "next/link";
import { StarButton } from "@/components/star-button";
import { TodayLink } from "@/components/today-link";
import { TripCountdown } from "@/components/trip-countdown";
import { SceneBanner } from "@/components/trip-scene";
import { countDays, formatDateRange } from "@/lib/dates";
import { T, themeOf, tripScope } from "@/lib/themes";

export type TripCardTrip = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  theme: string;
  timezone?: string | null;
  place_name?: string | null;
  days?: { id: number; date: string; timezone?: string | null }[];
};

// A trip as a picture: its name on the scene's own sky, the scene below.
// "feature" is the big card for the next trip at the top of My trips.
export function TripCard({
  trip,
  starred,
  shared = false,
  feature = false,
}: {
  trip: TripCardTrip;
  starred?: boolean;
  shared?: boolean;
  feature?: boolean;
}) {
  const theme = themeOf(trip.theme);
  const scope = tripScope(theme);
  return (
    <li className={`relative list-none ${scope.className}`} style={scope.style}>
      <Link
        href={`/trips/${trip.id}`}
        className="group block overflow-hidden rounded-[28px] transition-transform duration-300 active:scale-[0.99]"
        style={{ backgroundColor: T.sky, color: T.ink }}
      >
        <div className={feature ? "px-7 pb-2 pt-8 sm:px-12 sm:pt-12" : "px-6 pb-1 pt-6 sm:px-7 sm:pt-7"}>
          <p className="eyebrow opacity-80">
            <TripCountdown start={trip.start_date} end={trip.end_date} timezone={trip.timezone} />
            {shared && " · Shared with you"}
          </p>
          <p
            className={
              feature
                ? "headline-lg mt-1 pr-12"
                : "mt-1 pr-12 text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[30px]"
            }
          >
            {trip.name}
          </p>
          <p className={feature ? "mt-3 text-[19px] opacity-80" : "mt-1.5 opacity-80"}>
            {formatDateRange(trip.start_date, trip.end_date)} · {countDays(trip.start_date, trip.end_date)} days
          </p>
        </div>
        <SceneBanner
          theme={trip.theme}
          uid={`card-${trip.id}`}
          sky={T.sky}
          className={`transition-transform duration-700 group-hover:scale-[1.02] ${feature ? "aspect-[2/1] min-h-56 sm:aspect-[2.6/1]" : "aspect-[2/1] min-h-40"}`}
        />
      </Link>
      {starred !== undefined && (
        <div className={`absolute ${feature ? "right-5 top-5 sm:right-8 sm:top-8" : "right-4 top-4"}`}>
          <StarButton tripId={trip.id} starred={starred} size="icon" />
        </div>
      )}
      {trip.days && <TodayLink tripId={trip.id} days={trip.days} color={T.strong} timezone={trip.timezone} />}
    </li>
  );
}
