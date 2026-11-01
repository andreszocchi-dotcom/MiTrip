# Prompt log: dashboard (spine feature 7)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## Prompt 1
> you could also have a counter of total trips?

(In reply to the agent asking what the dashboard should show.)

**Agent response (summary):** Proposed a full set around my idea: Total trips, Total plans, and Days until my next trip, plus a "Plans by type" bar chart, on a new Dashboard page in the header.

## Prompt 2
> maybe average plans per trip

**Agent response (summary):** Pointed out that it overlaps with Total plans and asked whether to replace a stat or add it.
**What I checked / decided:** **Add it as a 4th stat.** Final set: Total trips, Total plans, Average plans per trip, Days until next trip, and the Plans by type chart.

## The build
- **Dashboard page** (`src/app/dashboard/page.tsx`, at `/dashboard`, linked as "Dashboard" in the header):
  - Four stat tiles in a 2 by 2 grid.
  - **Next trip** shows the days left and the trip's name ("41 days until Tahoe"), "Now" while a trip is happening, or "None" with no upcoming trips.
  - **Plans by type** chart: one bar per type (Flight, Hotel, Reservation, Ticket, Activity) with the count next to it. Types with 0 plans still show, with no bar.
  - With no plans yet, the chart shows "No plans yet" and a link to my trips.
- **Stat math in its own file** (`src/lib/dashboard-stats.ts`) so the dashboard stat test can check it directly.
- Counts my trips and trips shared with me (Row Level Security decides what each person can see).
- `/dashboard` sends logged-out visitors to the login page, like the other pages.

Choices the agent made on its own:
- "Today" is counted in Pacific time, since MiTrip is built and demoed in Berkeley.
- Average plans per trip is rounded to one decimal.
- If a trip is happening today, Next trip shows that trip as "Now" instead of the one after it.
- The chart is built as a table with bars (no chart library), so screen readers can read the numbers.
- **Header change:** with Dashboard added, the links no longer fit next to the logo on a phone ("★ Starred" and "Log out" broke onto two lines). The links now move to their own row under the logo on narrow screens. This changes the header on every page.

## Testing
Checked the stat math with sample data first: 4 plans over 3 trips gives 1.3; Nov 1 to Dec 12 is 41 days; a trip in progress shows "Now"; no data gives zeros.

Phone-sized browser run with two throwaway accounts (deleted afterward), 13 of 13 checks passed:
- A logged-out visitor is sent to the login page.
- The header link opens the dashboard.
- With 2 trips and 3 plans: Total trips 2, Total plans 3, Average 1.5, and Next trip counts down to the soonest trip.
- The chart shows Flight 2, Hotel 1, and Ticket 0.
- Every header link stays on one line.
- A brand-new account sees 0 trips, Next trip "None", and the "No plans yet" message, none of the first account's data.

The first run caught the header wrapping on a phone; fixed and re-run.

No AI import was run during testing, so no Claude API credits were used.

**What I checked / decided:** _(fill in after opening the dashboard on my phone with my real trips)_
