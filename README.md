# MiTrip

MiTrip keeps every plan for a trip (flights, hotels, reservations, tickets, activities) organized by day, so you can open today's plans on your phone, get directions in Google Maps, and pull up a ticket in one tap. Before you lose signal, save the whole trip as a PDF.

Built by Andrés Zocchi as a solo app for Intro to Coding (Solo Demo Day, Nov 4, 2026).

- **Live app:** https://mi-trip-kappa.vercel.app
- **Plan:** [PLAN.md](PLAN.md) (with Plan vs. Reality at the bottom)
- **Database:** [schema.md](schema.md)
- **Original sketches:** [sketches/](sketches/)

## What it does

- **Sign up and log in** with email and a password. Each account sees only its own trips.
- **Trips, days, and plans:** add a trip and it gets one day per date; add, view, edit, and delete plans (flight, hotel, reservation, ticket, activity) inside each day. Friendly messages for missing or wrong fields.
- **AI itinerary import:** paste an itinerary and Claude Haiku 5.5 fills in the days and plans.
- **Today view:** during a trip, one tap opens today, with a "Tomorrow" preview at the bottom. A day strip jumps to any date.
- **Google Maps:** every plan with an address opens in Google Maps.
- **Ticket photos:** attach a photo or screenshot of a ticket or QR code to a plan.
- **Save trip as PDF:** the whole trip, with ticket photos, as one file for days with no signal.
- **Stars:** star plans and find them all on the Starred page.
- **Search:** search plans, filter by type and trip, and sort.
- **Dashboard:** total trips, total plans, average plans per trip, days until the next trip, and a plans-by-type chart.

Not built yet: sharing a trip with travel companions (the database is ready for it; see Plan vs. Reality in [PLAN.md](PLAN.md)).

## Tools

| Tool | Used for |
|---|---|
| Claude Code (VS Code) | AI coding agent |
| Next.js 16 (React, TypeScript) | The web app |
| Tailwind CSS 4 | Styling |
| Vercel | Hosting, redeploys on every merge to main |
| Supabase | Database (Postgres with Row Level Security), sign up and login, ticket photo storage |
| Claude API (Claude Haiku 5.5) | Reads a pasted itinerary and turns it into days and plans |
| Vitest | Tests (`npm test`) |

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer and a Supabase project.

```bash
git clone https://github.com/andreszocchi-dotcom/MiTrip.git
cd MiTrip
npm install
```

Create a file named `.env.local` in the project folder with your Supabase project's URL and publishable key (Supabase dashboard, then Connect), and a Claude API key for the itinerary import (console.anthropic.com, then API Keys):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ANTHROPIC_API_KEY=sk-ant-...
```

`.env.local` is ignored by Git. On Vercel, add the same variables in the project's Environment Variables (mark `ANTHROPIC_API_KEY` as Secret).

Set up the database tables (from `supabase/migrations/`) and start the app:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
npm run dev
```

Then open http://localhost:3000.

Run the tests:

```bash
npm test
```

The data isolation test runs against a separate Supabase project with the same tables and rules (never the live data). To run it, create a second Supabase project, apply `supabase/migrations/` to it, turn off email confirmation, and put its URL and publishable key in `.env.test.local`:

```
TEST_SUPABASE_URL=https://your-test-project.supabase.co
TEST_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Without that file, `npm test` skips the isolation test and runs the rest.
