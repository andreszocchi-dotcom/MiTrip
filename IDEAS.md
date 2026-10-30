# MiTrip ideas parking lot

Ideas that are out of scope for the solo assignment (due Nov 4, 2026) or held as stretch goals. Parking an idea here keeps it without letting it grow the plan.

## Stretch goals (in PLAN.md, built only after the committed features ship)

| Order | Idea | Source | Risk |
|---|---|---|---|
| 1 | One-time Gmail scan when a trip is added, to find existing bookings | Sketches 04, 05 | High: restricted Gmail permission in Google "testing" mode (hand-added test users only), plus AI to read emails |
| 2 | Paste a Claude itinerary and have the app create days and plans from it | Sketches 03, 04 | High: Claude API cost and unpredictable output |
| 3 | Download a trip for offline use | Sketches 02, 04 | Medium |

## Parked (not in the solo plan)

| Idea | Source | Why parked |
|---|---|---|
| Link airline apps to pull flight details | Sketch 05 | No shared airline API; flight details are entered by hand instead |
| Continue with Google sign-in | PLAN.md feature 1 | Postponed Oct 29, 2026 (issue #7). The button code is finished on the `feature/google-login` branch, but it needs a Google Cloud OAuth client that can only be created by hand in the Google Cloud console. Email sign-up already meets the requirement, so time went to the data model. To finish: create the client, fill in the two Google values in `.env.local`, push the Supabase config, open the PR. |
