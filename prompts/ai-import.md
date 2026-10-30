# Prompt log: ai-import (custom feature, added Oct 29, 2026)

Agent: Claude Code (Opus) in VS Code. Session date: Oct 29, 2026.

The decision to build this (promoted from stretch goal to a 4th custom feature) and the first model choice (Sonnet 5.5) are logged in `prompts/crud-plans.md`, Prompts 1 and 2.

## Prompt 1
> is there any way you could go down to haiku, i think its possible it might be good enough, if its not we can switch

**Agent response (summary):** Switched to Claude Haiku 5.5 (my itinerary is about 8,000 tokens, so an import should cost under a cent). Proposed judging it on my real itinerary (right dates and order, right types, Maps links finding the right places) and showing the real cost of each import. The model is one setting in the code, so moving to Sonnet 5.5 later is a one-line PR.
**What I checked / decided:** **Claude Haiku 5.5**, changed from Sonnet 5.5 to try the cheaper model first.

## Setup (my steps)
- Pasted my Claude API key into `.env.local` (not in chat). The agent verified it with a free "model details" call without printing it.
- Added `ANTHROPIC_API_KEY` in Vercel as a Secret. Vercel showed "Needs Attention" because Secret values aren't used by its "Development" environment; the agent explained this doesn't matter because local development uses `.env.local`. I asked what "Rotate" meant: it swaps in a new key after a leak, so I didn't need it.
- Merged PR #15 and fixed my honeymoon dates from 2026 to 2027.

## The build
- **Import button** (`src/app/trips/[id]/import-button.tsx`): "Import itinerary into days" on the trip page, for the owner, when the trip has pasted itinerary text. If plans already exist, it first warns that importing again adds plans and doesn't remove any. While it runs: "Reading your itinerary… (about 30 seconds)". After: how many plans were added and what it cost.
- **Import action** (`src/app/trips/import-actions.ts`), on the server:
  1. Checks I'm logged in and own the trip; caps the paste at about 30,000 words.
  2. Sends Claude Haiku 5.5 the trip's dates and the itinerary with rules. Use only the trip dates. Never invent times, confirmation numbers, or addresses. Give each place a Google-Maps-searchable address. Write a greeting and a one-sentence summary for every day.
  3. Uses structured output: Claude must answer in a fixed shape (days, each with plans that have title, type, times, address, confirmation number, notes), checked with `zod`.
  4. Saves the plans into the right days and fills in empty greetings and summaries.
- **Google Maps links** (`src/lib/maps.ts`): a "Map" button on each plan card and "Open in Google Maps" on the plan page, built from the address as a Google Maps search link (no Google API key or cost). This pulls the Maps button forward from custom feature "Today view".
- **Plan order** (`src/lib/plan-order.ts`): plans without a time stay right after the plan before them instead of sinking to the bottom of the day.
- The API key is only read on the server; it never reaches the browser.

Choices the agent made on its own:
- Structured output with a `zod` schema.
- "Medium" thinking effort.
- Streaming the response.
- A 32,000-token response limit.
- The 30,000-word paste cap.
- "Import again" adds plans rather than replacing them, so manual plans are never deleted.
- Greetings and summaries are filled only where empty.
- Google Maps search links instead of Google's paid Places service.

## Testing
A browser test on a throwaway account with a short sample itinerary I didn't write (the agent wrote it, modeled on my sketches); my real honeymoon was left for me to import.

**Bug caught (agent's own, before any real call):** the first run crashed with "Streaming is required for operations that may take longer than 10 minutes." The Claude SDK refuses a large response limit without streaming. No request was sent or charged. Fixed by streaming the response and waiting for the final message.

**Quality issues found in the first successful run** (11 to 14 seconds, $0.0012):
- Facts were right: flight QF74 at 8 PM with confirmation ABC123, the "watch movies then sleep" tip in notes, dinner at Aria 7:30 PM with AR-5521. No invented times.
- Order was wrong: "Check in at PR1 Hotel" and "Walk around The Rocks" (no times) showed after the 7:30 PM dinner. Fixed with the plan order rule above.
- Greetings were weak: only Day 1 had one, and it copied a heading ("Sydney start of the honeymoon!"). Fixed by asking for a greeting on every day in its own words, with my sketch's examples ("Get excited!", "Congrats, you landed!").

**Second run** ($0.0013, 11.7 seconds): every day had a greeting ("Honeymoon adventure starts today!", "Time flies over the Pacific.", "Congrats, you landed in Sydney!", "Sun, sand, and ferry rides ahead!"). Day 3 read in real order: land 6 AM, check in, The Rocks, Opera House 3:30 PM, dinner 7:30 PM. Every place had a Google Maps search link. The plans test (15 checks) still passed.

**What I checked / decided:** Imported my real honeymoon itinerary on the live site: 62 plans across the trip, every one with a description, 61 with an address, 18 with a time. My verdict: "i think haiku did a fine job!" **Keeping Claude Haiku 5.5.** It didn't find many specific Google Maps points, which I think is mostly because my itinerary was light on specifics; where I named a place (like Brown's Boutique Hotel) it pointed to that exact spot. Next time I can add more place names to the itinerary.
