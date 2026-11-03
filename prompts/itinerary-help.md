# Prompt log: itinerary-help (stranger test fix)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 2, 2026.

## How this fix came about
> emi went to use the app and struggled to understand what should be put in the itinerary box of the app
>
> So that is one area we need an improvement on, it would be nice if the description was a little bit more clear, gave an idea of what this box will be used to with the ai import feature, recommend to folks that they can list out the days or ask an llm to list out the days and paste it in
>
> Lmk if that is the best way we can explain it or if you have better while not making it some massive explanation that takes up the entire page

**Agent response (summary):** Agreed with my idea and added one thing that takes no extra space: a short example itinerary as placeholder text inside the box, because Emi's real question was "what goes here?" and an example answers that faster than a sentence. Proposed two short lines of muted helper text under the label (what the box is for, the ✨ Import, and asking Claude or ChatGPT if there's no plan yet), replacing "(paste from Claude or anywhere)", which said where to paste from but not what the box does.

> thats perfect

**What I checked / decided:** **Ship the helper text plus the example placeholder** as my stranger test fix.

## What the agent built
- Helper text under the Itinerary label in `src/app/trips/trip-form.tsx`: "Paste your day-by-day plans, then use ✨ Import on the trip page and AI sorts each item into the right day. No plan yet? Ask Claude or ChatGPT to "list my trip day by day" and paste the result."
- A three-line example itinerary as the box's placeholder (Lisbon, Belém Tower, Sintra). It disappears as soon as you type.
- The helper text is linked to the box (`aria-describedby`), so screen readers read it too.

Choices the agent made on its own:
- Kept the example loose ("Day 2", one date on Day 1) to show the import doesn't need a strict format.

## Testing
- Typecheck, lint, and `npm test` (5 of 5) pass.
- Phone-sized browser run with the app running locally against the separate "MiTrip test" database: signed up a new account, opened Add a trip, and confirmed the helper text and example show up (`docs/screenshots/itinerary-help.png`).
