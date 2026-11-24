# MiTrip ideas parking lot

Ideas that were out of scope for the solo assignment (due Nov 4, 2026) or held as stretch goals. After the class ended, several shipped (see below). Parking an idea here keeps it without letting it grow the plan.

## Promoted out of the parking lot

| Idea | Decision |
|---|---|
| Paste a Claude itinerary and have the app create days and plans from it | Promoted Oct 29, 2026 to a **4th custom feature**, built right after plans. Reason: after pasting my real honeymoon itinerary (about 29,000 characters), it showed as one big block of text instead of filling in the days. Model: Claude Sonnet 5.5 at first (my choice, about $0.10 to $0.15 per import), then switched to **Claude Haiku 5.5** to try the cheaper model. Guardrails: owner only, capped paste size, its own Anthropic workspace with a $5 monthly spend limit. Shipped in #17. |
| Download a trip for offline use (stretch goal 2) | Replaced Nov 1, 2026 by **Save trip as PDF**, my 3rd custom feature (#39). A real offline mode needs a service worker, can lock me out when my login expires with no signal, and iPhones can clear its saved data; a PDF of the whole trip, with ticket photos, covers the same need. |
| Trip members (invite a companion, read-only) | Shipped Nov 23, 2026 (#61) as an **invite link**: the owner shares a private link, whoever opens it joins as a viewer, and the owner can reset or turn off the link and remove people. |
| Star trips as well as plans | Shipped Nov 23, 2026 (#60) in its own `trip_stars` table, so plan stars stay unchanged. Starred trips sort first and show on the Starred page. |
| Graphics for trip themes | Shipped Nov 23, 2026 (#59) as soft line-art scenes (waves, dunes, pines, sunset, peaks) on trip cards and headers. |
| Open the whole day in Google Maps | New idea, shipped Nov 23, 2026 (#56): one button opens directions from your location through every stop of the day, in order. |
| Continue with Google sign-in | Shipped Nov 24, 2026 (#62) after setting up a published Google Cloud OAuth client (which needed the new privacy page, #67) and turning Google on in Supabase. Google shows the Supabase address on its screen until the brand is verified. |

## Stretch goals (in PLAN.md, built only after the committed features ship)

| Order | Idea | Source | Risk |
|---|---|---|---|
| 1 | One-time Gmail scan when a trip is added, to find existing bookings | Sketches 04, 05 | High: restricted Gmail permission in Google "testing" mode (hand-added test users only), plus AI to read emails |

## Parked (not in the solo plan)

| Idea | Source | Why parked |
|---|---|---|
| Link airline apps to pull flight details | Sketch 05 | No shared airline API; flight details are entered by hand instead |
