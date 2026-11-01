# Prompt log: today-view (custom feature)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## Prompt 1
> lets get this assignment done

**Agent response (summary):** Checked PLAN.md against the merged PRs and found that none of my 3 planned custom features (trip members, Today view, ticket upload) had been built yet. They're scheduled for Mon Nov 2, so I wasn't behind. Laid out what existed for each and asked which three to build.

## Prompt 2
The agent asked which features should be my 3 custom features.
**What I checked / decided:** **Today view + Tomorrow, Ticket upload, and Save trip as PDF.** Trip members is parked (my plan already called it the riskiest), and Save as PDF replaces the "offline download" stretch goal.

## The build (Today view + Tomorrow)
- **"Today" button** (`src/components/today-link.tsx`): while a trip is happening, My trips and the trip page show "Today · Day N →", which opens today's day in one tap.
- **"Today" badge** on the day page when that day is today.
- **Tomorrow snapshot** at the bottom of every day page: the next day's one-sentence summary (written by the AI import), its plans in time order with their type icons, and "See the full day ›". It's labelled "Tomorrow" on today's page and "Next day" on other days. The last day has none.
- Already built earlier and kept: plans in time order and an "Open in Google Maps" button on every plan with an address.

Choices the agent made on its own:
- **"Today" is worked out from the phone's own date and time zone**, not the server's, so on the honeymoon it means Sydney's today.
- **A Today button instead of jumping to today automatically.** Opening the trip page and landing straight on today would trap me: the day page's "← trip" link would send me right back.
- The Tomorrow snapshot shows on every day, not only today, so I can preview any day the evening before.

## Testing
Phone-sized browser run with the app running locally against the separate "MiTrip test" database (never the live data), with the browser set to Sydney time on Jan 9, 2027, day 2 of a Jan 8 to 10 test trip. 12 of 12 checks passed:
- My trips and the trip page show "Today · Day 2", and it opens Sat, Jan 9 with the Today badge.
- Today's plan is listed.
- The Tomorrow card says "Tomorrow · Sun, Jan 10", shows the summary, and lists tomorrow's plans in time order. Tapping it opens Jan 10.
- The last day has no Tomorrow card, a day that isn't today says "Next day", and before the trip there's no Today button.

The first run failed 3 checks because the test checked the page before it had finished loading. The test was fixed to wait; the app didn't change.

**What I checked / decided:** _(fill in after opening a trip on my phone)_
