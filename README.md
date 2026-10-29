# MiTrip

MiTrip keeps every plan for a trip (flights, hotels, reservations, tickets, activities) organized by day, so you can open today's plans on your phone, get directions in Google Maps, and pull up a ticket in one tap. Trips can be shared with the people traveling with you.

Built by Andrés Zocchi as a solo app for Intro to Coding (Solo Demo Day, Nov 4, 2026).

- **Live app:** coming soon (deployed on Vercel)
- **Plan:** [PLAN.md](PLAN.md)
- **Original sketches:** [sketches/](sketches/)

## Status

Scaffold only: a blank landing page. Features ship one pull request at a time, in the order listed in [PLAN.md](PLAN.md).

## Tools

| Tool | Used for |
|---|---|
| Claude Code (VS Code) | AI coding agent |
| Next.js 16 (React, TypeScript) | The web app |
| Tailwind CSS 4 | Styling |
| Vercel | Hosting, redeploys on every merge to main |
| Supabase | Database, sign up and login, file storage (coming in later features) |

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/andreszocchi-dotcom/MiTrip.git
cd MiTrip
npm install
npm run dev
```

Then open http://localhost:3000.
