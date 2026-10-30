# Prompt log: crud-plans (feature 3, part 2 of 2)

Agent: Claude Code (Opus) in VS Code. Session date: Oct 29, 2026.

## Prompt 1
> Okay so i did it
>
> I pasted a ton of information into the itinerary, and it didn't populate into the days. I wonder if we need some kind of artificial intelligence that reads that box and then parses it into each of the days and builds those out, because right now, the way it looks is kind of weird. I don't think this is what I was going for. It should also be intelligent enough to say, "Oh look, the PR1 hotel, that's where they're staying. Okay, let me try to find the Google Maps link for it," things like that.

**Agent response (summary):** Explained that this is stretch goal "AI itinerary import" from my plan. The itinerary box only stores text; nothing reads it yet. Proposed: Claude reads the pasted text and creates plans on the right days with times and types, and each place gets a Google Maps search link (exact place lookup would need Google's paid Places service). Explained it needs plans to exist first (this PR), costs a little per import, and changes the plan.
**What I checked / decided:**
- Build plans first, then the AI import.
- The AI import becomes a **4th custom feature** (on top of the committed 3). The agent offered replacing a committed feature to lower risk; I chose to add it.

## Prompt 2
> I do [have an API key], I can post it, but I am concerned, will that use too much consumption? maybe I use a different cheaper model? what do you think is the best route

**Agent response (summary):** Asked me not to post the key in chat (I'll paste it into `.env.local` and Vercel as a Secret). Estimated cost per import of a long itinerary from current prices:

| Model | Price per million tokens (in / out) | Est. per import |
|---|---|---|
| Opus 5.5 | $4 / $20 | ~$0.20 to 0.30 |
| Sonnet 5.5 | $2 / $10 | ~$0.10 to 0.15 |
| Haiku 5.5 | $0.10 / $0.50 | under $0.01 |

Said the real tradeoff is accuracy on messy text, not usage. Recommended guardrails: owner only, a paste size cap, and a monthly spend limit in the Anthropic Console.
**What I checked / decided:** **Claude Sonnet 5.5.**

The agent also noticed my honeymoon trip was saved as Jan 8 to 24, **2026** instead of 2027 (the phone's date picker defaulted to this year) and told me to fix it with Edit trip.

## The build
- **Day page** (`/trips/[id]/days/[dayId]`): tap a day on the trip page to open it. It shows "Day N of M", the date, the greeting, Previous and Next day links, and the plans in time order with type icon, time, title, and address.
- **Add plan** (`.../days/[dayId]/new`): type (Flight, Hotel, Reservation, Ticket, Activity); title; start and end time (the phone's time picker); address; confirmation or flight number; ticket or boarding pass link; notes.
- **Plan page** (`/trips/[id]/plans/[planId]`): all details, an "Open ticket" button when a link is saved, and Edit or Delete (with "Are you sure?") for the owner.
- **Edit plan**: the same form, filled in.
- Trip members see everything but get no add, edit, or delete buttons, and the add page returns "not found" for them.

Choices the agent made on its own:
- Turned the trip's "Are you sure?" button into one shared component used for both trips and plans.
- Emoji icons for plan types (✈️ 🏨 🍽️ 🎟️ 📍).
- Plans without a time go after timed plans.
- The "Open in Google Maps" button is left for custom feature "Today view", so feature boundaries stay clean.
- The ticket photo upload field (ticket_image) is left for custom feature "Ticket upload".

## Testing
Phone-sized browser run against a local copy of the app, 15 of 15 checks passed, test accounts deleted afterward:
- Day 1 of 3 opens with an empty state.
- A flight (8 PM) and an activity (8 AM) are listed 8 AM first, with "8:00 PM – 6:00 AM" on the flight.
- The plan page shows the confirmation number and the "Open ticket" button. Editing the title works.
- An invited member sees the plans but has no Add, Edit, or Delete, and gets 404 on the add page.
- A stranger gets 404 on the day and plan links.
- Deleting asks "Are you sure?" and removes only that plan.

**What I checked / decided:** _(fill in after trying it on the live URL)_
