# Prompt log: validation (spine feature 4)

Agent: Claude Code (Opus) in VS Code. Session date: Oct 30, 2026.

## Prompt 1
> merged

(After PR #19. The agent had proposed validation as the next feature.)

**Agent response (summary):** Built friendly validation for the trip and plan forms:
- **One set of rules** (`src/lib/validation.ts`), run on the server before anything is saved, so they can't be skipped:
  - Trip: "Give your trip a name.", "Pick the day your trip starts.", "Pick the day your trip ends.", "The end date can’t be before the start date.", and the Google Maps list link must be a real web link.
  - Plan: "Give this plan a title, like “Dinner at Aria”.", "Choose what kind of plan this is.", and the ticket link must be a real web link.
- **Forms** (`trip-form.tsx`, `plan-form.tsx`, shared pieces in `src/components/form-field.tsx`): each message appears under its field with a red outline, plus "Almost there. Fix the fields marked in red above." near the button. What I typed stays in the form. The browser's own pop-up bubbles are turned off so these messages show instead.
- The database rules from the data model PR (no blank names, end date on or after start) are still there as a backstop.

Choices the agent made on its own:
- **Trips can be up to 90 days long.** This keeps one typo, like the year 2207, from creating thousands of days.
- **Links must start with http:// or https://.** This also blocks a `javascript:` "link" that would run code when tapped, which the plans PR allowed. That gap was the agent's own and is fixed here.
- The message wording.

## Testing
- **Rules:** 11 sample cases (valid trip, blank name, blank dates, end before start, one-day trip, 91-day trip, bad Maps link, valid plan, blank title, missing type, `javascript:` ticket link). All gave the expected messages.
- **Browser:** phone-sized run against a local copy of the app, 16 of 16 checks passed:
  - An empty trip form shows all three messages and saves nothing.
  - A backwards trip with a bad Maps link shows both messages and keeps the typed name, itinerary, and chosen color.
  - Fixing the fields saves the trip.
  - A plan with a blank title and a `javascript:` link shows both messages and keeps the typed notes. Fixing them saves the plan.
- The test account was deleted afterward.

**Bug caught (agent's own, during setup):** while re-installing its browser-test tools, a folder-name error made npm install them into the project's `package.json` instead of the hidden test folder. The agent noticed it in `git status` right away, restored `package.json` and `package-lock.json` from Git, and reinstalled in the right place. Nothing was committed.

**What I checked / decided:** _(fill in after trying a blank trip on my phone)_
