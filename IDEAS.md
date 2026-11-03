# MiTrip ideas parking lot

Ideas that are out of scope for the solo assignment (due Nov 4, 2026) or held as stretch goals. Parking an idea here keeps it without letting it grow the plan.

## Promoted out of the parking lot

| Idea | Decision |
|---|---|
| Paste a Claude itinerary and have the app create days and plans from it | Promoted Oct 29, 2026 to a **4th custom feature**, built right after plans. Reason: after pasting my real honeymoon itinerary (about 29,000 characters), it showed as one big block of text instead of filling in the days. Model: Claude Sonnet 5.5 at first (my choice, about $0.10 to $0.15 per import), then switched to **Claude Haiku 5.5** to try the cheaper model. Guardrails: owner only, capped paste size, its own Anthropic workspace with a $5 monthly spend limit. Shipped in #17. |
| Download a trip for offline use (stretch goal 2) | Replaced Nov 1, 2026 by **Save trip as PDF**, my 3rd custom feature (#39). A real offline mode needs a service worker, can lock me out when my login expires with no signal, and iPhones can clear its saved data; a PDF of the whole trip, with ticket photos, covers the same need. |

## Stretch goals (in PLAN.md, built only after the committed features ship)

| Order | Idea | Source | Risk |
|---|---|---|---|
| 1 | One-time Gmail scan when a trip is added, to find existing bookings | Sketches 04, 05 | High: restricted Gmail permission in Google "testing" mode (hand-added test users only), plus AI to read emails |

## Parked (not in the solo plan)

| Idea | Source | Why parked |
|---|---|---|
| Link airline apps to pull flight details | Sketch 05 | No shared airline API; flight details are entered by hand instead |
| Trip members (invite a companion, read-only) | PLAN.md feature 8 | Cut Nov 1, 2026. My plan called it the riskiest feature, and Today view, ticket upload, and Save as PDF fit the time better. The trip_members table and its privacy rules already exist, so only the invite screen is missing. |
| Star trips as well as plans | Idea, Nov 1, 2026 | Starring is already done for plans. Trip stars would stay in the same `stars` table (an optional `trip_id` next to `plan_id`), as the assignment requires one stars table. Parked so the docs, stranger test, and demo come first. |
| Continue with Google sign-in | PLAN.md feature 1 | Postponed Oct 29, 2026 (issue #7). The button code is finished on the `feature/google-login` branch, but it needs a Google Cloud OAuth client that can only be created by hand in the Google Cloud console. Email sign-up already meets the requirement, so time went to the data model. To finish: create the client, fill in the two Google values in `.env.local`, push the Supabase config, open the PR. |
