import Link from "next/link";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TripScene } from "@/components/trip-scene";
import { THEMES } from "@/lib/themes";

// Sample day shown in the phone on the landing page.
const SAMPLE_PLANS = [
  { time: "8:30 AM", icon: "🏨", title: "Breakfast at the hotel", place: "Park Hyatt Sydney" },
  { time: "10:00 AM", icon: "🎟️", title: "Opera House tour", place: "Bennelong Point" },
  { time: "1:00 PM", icon: "📍", title: "Coastal walk", place: "Bondi to Coogee" },
  { time: "7:30 PM", icon: "🍽️", title: "Dinner at Aria", place: "1 Macquarie St" },
];

function PhoneMock() {
  return (
    <div className="mx-auto w-[300px] rounded-[48px] bg-ink p-3 text-left sm:w-[340px]">
      <div className="overflow-hidden rounded-[38px] bg-background">
        <div className="flex justify-center pt-3">
          <div className="h-6 w-24 rounded-full bg-ink" />
        </div>
        <div className="px-4 pb-6 pt-4">
          <div className="rounded-[22px] bg-[#e3f0fb] p-4">
            <p className="text-xs font-semibold text-[#3b82c4]">Day 3 of 14 · Today</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight">Sun, Jan 10</p>
            <p className="mt-1 text-sm">Harbour morning, beach afternoon.</p>
          </div>
          <div className="mt-3 rounded-full bg-accent py-2 text-center text-xs font-medium text-white">
            Open the day&apos;s route in Google Maps ↗
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {SAMPLE_PLANS.map((plan) => (
              <li key={plan.title} className="flex gap-3 rounded-[18px] bg-surface p-3">
                <span aria-hidden="true">{plan.icon}</span>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted">{plan.time}</p>
                  <p className="truncate text-sm font-medium">{plan.title}</p>
                  <p className="truncate text-[11px] text-muted">{plan.place}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// A small map drawing: four numbered stops joined by a dotted line.
function RouteArt() {
  const stops = [
    [40, 150],
    [120, 70],
    [210, 120],
    [290, 40],
  ];
  return (
    <svg viewBox="0 0 330 190" className="mx-auto w-full max-w-[440px]" aria-hidden="true">
      <path
        d="M40 150 C 70 110, 90 80, 120 70 S 180 130, 210 120 S 270 60, 290 40"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0 11"
      />
      {stops.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="17" fill="var(--accent)" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BentoTile({
  title,
  text,
  children,
  className = "",
  dark = false,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between gap-6 overflow-hidden rounded-[28px] p-7 sm:p-9 ${
        dark ? "bg-ink-soft text-white" : "bg-surface"
      } ${className}`}
    >
      <div>
        <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">{title}</h3>
        <p className={`mt-2 max-w-sm ${dark ? "text-white/65" : "text-muted"}`}>{text}</p>
      </div>
      {children}
    </div>
  );
}

const DAY_CHIPS = ["Thu 7", "Fri 8", "Sat 9", "Sun 10", "Mon 11", "Tue 12", "Wed 13"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-surface px-4 pb-20 pt-20 text-center sm:pb-32 sm:pt-32">
        <Reveal>
          <Logo className="mx-auto h-14 w-auto sm:h-20" />
          <h1 className="headline-xl mx-auto mt-8 max-w-[900px]">
            Your whole trip.
            <br />
            One day at a time.
          </h1>
          <p className="subhead mx-auto mt-5 max-w-[620px]">
            Flights, hotels, reservations, and tickets, sorted into the day they happen.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/signup" className="btn btn-primary">
              Get started
            </Link>
            <Link href="/login" className="link text-[17px]">
              Log in ›
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-16 sm:mt-20" delay={150}>
          <PhoneMock />
        </Reveal>
      </section>

      {/* Today */}
      <section className="bg-background px-4 py-20 text-center sm:py-36">
        <Reveal className="mx-auto max-w-[980px]">
          <h2 className="headline-lg">Today, first.</h2>
          <p className="subhead mx-auto mt-4 max-w-[620px]">
            Mid-trip, today&apos;s plans are one tap away, with a peek at tomorrow right underneath.
          </p>
          <div className="mx-auto mt-14 flex max-w-[560px] justify-center gap-2 overflow-hidden">
            {DAY_CHIPS.map((chip, i) => (
              <div
                key={chip}
                className={`flex w-16 shrink-0 flex-col items-center rounded-[16px] py-3 ${
                  i === 3 ? "bg-accent text-white" : "bg-surface"
                }`}
              >
                <span className={`text-[11px] font-medium uppercase ${i === 3 ? "" : "text-muted"}`}>
                  {chip.split(" ")[0]}
                </span>
                <span className="text-2xl font-semibold">{chip.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Scenes */}
      <section className="overflow-hidden bg-surface px-4 py-20 sm:py-36">
        <Reveal className="mx-auto max-w-[980px] text-center">
          <h2 className="headline-lg">Every trip, its own world.</h2>
          <p className="subhead mx-auto mt-4 max-w-[620px]">
            Pick a scene for each trip. Waves roll, fog drifts through the pines, and the city lights up at
            dusk.
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-14 max-w-[1200px]" delay={120}>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
            {Object.entries(THEMES).map(([key, theme]) => (
              <li
                key={key}
                className="w-[260px] shrink-0 snap-center overflow-hidden rounded-[28px] lg:w-auto"
                style={{ backgroundColor: theme.sky, color: theme.ink }}
              >
                <p className="px-6 pt-6 text-[21px] font-semibold tracking-[-0.02em]">{theme.label}</p>
                <div className="relative mt-2 aspect-[4/5] w-full">
                  <TripScene theme={key} uid={`land-${key}`} className="absolute inset-0 h-full w-full" />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Bento */}
      <section className="bg-background px-4 py-20 sm:py-36">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="text-center">
            <h2 className="headline-lg">Everything in its place.</h2>
            <p className="subhead mx-auto mt-4 max-w-[620px]">
              The details you&apos;d dig through emails for, ready when you need them.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-6">
            <Reveal className="md:col-span-4">
              <BentoTile
                className="h-full"
                title="The whole day, mapped."
                text="One tap opens every stop of the day in Google Maps, in order, starting from where you are."
              >
                <RouteArt />
              </BentoTile>
            </Reveal>
            <Reveal className="md:col-span-2" delay={80}>
              <BentoTile
                dark
                className="h-full"
                title="No signal? Still there."
                text="Save the whole trip as a PDF, ticket photos included, before you board."
              >
                <div aria-hidden="true" className="w-24 rounded-[10px] bg-white/10 p-3">
                  <div className="h-1.5 w-12 rounded-full bg-white/60" />
                  <div className="mt-2.5 h-1 w-16 rounded-full bg-white/25" />
                  <div className="mt-1.5 h-1 w-14 rounded-full bg-white/25" />
                  <div className="mt-1.5 h-1 w-16 rounded-full bg-white/25" />
                  <div className="mt-3 h-6 rounded-[6px] bg-white/15" />
                </div>
              </BentoTile>
            </Reveal>
            <Reveal className="md:col-span-2">
              <BentoTile
                className="h-full"
                title="Star what matters."
                text="Boarding passes and must-dos, gathered on one quick list."
              >
                <p className="text-5xl leading-none text-amber-500" aria-hidden="true">★</p>
              </BentoTile>
            </Reveal>
            <Reveal className="md:col-span-2" delay={80}>
              <BentoTile
                className="h-full"
                title="Tickets, on hand."
                text="Snap a photo of a ticket and keep it with its plan."
              >
                <div aria-hidden="true" className="flex w-44 overflow-hidden rounded-[12px] bg-background text-xs">
                  <div className="flex-1 border-r-2 border-dashed border-line p-3">
                    <p className="font-semibold">Opera House</p>
                    <p className="text-muted">Sun 10 · 10:00 AM</p>
                  </div>
                  <div className="flex w-10 items-center justify-center font-semibold text-accent">A4</div>
                </div>
              </BentoTile>
            </Reveal>
            <Reveal className="md:col-span-2" delay={160}>
              <BentoTile
                className="h-full"
                title="Find anything."
                text="Search every plan by name, place, or note, across all your trips."
              >
                <div className="rounded-full bg-background px-4 py-2.5 text-sm text-muted">⌕ confirmation</div>
              </BentoTile>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Import, dark */}
      <section className="bg-ink px-4 py-20 text-center text-white sm:py-36">
        <Reveal className="mx-auto max-w-[980px]">
          <h2 className="headline-lg">
            Paste it.{" "}
            <span className="bg-gradient-to-r from-[#7cb7f0] to-[#c3a6ff] bg-clip-text text-transparent">
              Sorted.
            </span>
          </h2>
          <p className="subhead mx-auto mt-4 max-w-[640px] !text-white/65">
            Drop in a day-by-day itinerary and AI files each item onto the right day, with map links ready to go.
          </p>
          <div className="mx-auto mt-14 grid max-w-[760px] gap-4 text-left sm:grid-cols-2">
            <div className="rounded-[22px] bg-ink-soft p-6 font-mono text-[13px] leading-6 text-white/70">
              Day 1: Land 9:40am, check in
              <br />
              Day 2: Opera House 10am, dinner at Aria
              <br />
              Day 3: Bondi to Coogee walk
            </div>
            <div className="flex flex-col gap-2">
              {["Day 1 · 2 plans", "Day 2 · 2 plans", "Day 3 · 1 plan"].map((row) => (
                <div key={row} className="flex items-center justify-between rounded-[18px] bg-ink-soft px-5 py-4">
                  <span className="font-medium">{row.split(" · ")[0]}</span>
                  <span className="text-sm text-white/60">{row.split(" · ")[1]} ›</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Closing call to action */}
      <section className="bg-surface px-4 py-24 text-center sm:py-36">
        <Reveal>
          <h2 className="headline-lg">Ready when you are.</h2>
          <p className="subhead mx-auto mt-4 max-w-[560px]">Add your first trip in a minute.</p>
          <div className="mt-8">
            <Link href="/signup" className="btn btn-primary">
              Create an account
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
