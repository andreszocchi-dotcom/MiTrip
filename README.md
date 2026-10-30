# MiTrip

MiTrip keeps every plan for a trip (flights, hotels, reservations, tickets, activities) organized by day, so you can open today's plans on your phone, get directions in Google Maps, and pull up a ticket in one tap. Trips can be shared with the people traveling with you.

Built by Andrés Zocchi as a solo app for Intro to Coding (Solo Demo Day, Nov 4, 2026).

- **Live app:** https://mi-trip-kappa.vercel.app
- **Plan:** [PLAN.md](PLAN.md)
- **Original sketches:** [sketches/](sketches/)

## Status

Working: sign up and login; trips, days, and plans (add, view, edit, delete); AI itinerary import with Google Maps links. Features ship one pull request at a time, in the order listed in [PLAN.md](PLAN.md).

## Tools

| Tool | Used for |
|---|---|
| Claude Code (VS Code) | AI coding agent |
| Next.js 16 (React, TypeScript) | The web app |
| Tailwind CSS 4 | Styling |
| Vercel | Hosting, redeploys on every merge to main |
| Supabase | Database (Postgres with Row Level Security), sign up and login, file storage |
| Claude API (Claude Haiku 5.5) | Reads a pasted itinerary and turns it into days and plans |

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
