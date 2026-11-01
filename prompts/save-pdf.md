# Prompt log: save-pdf (custom feature)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## How this feature came about
> Offline download of a trip. Medium risk. What are the risks associated with this feature

**Agent response (summary):** Explained why offline download (PLAN.md stretch goal 13) is medium risk: the app builds every page on the server after checking my login, so working offline needs a service worker; the login can expire with no signal; iPhones can clear a website's saved data after about a week; an offline copy goes stale; and confirmation numbers would sit unencrypted on the phone. Suggested a low-risk alternative: a "Save trip as PDF" button.

> i like the save trip as pdf a lot, thats sort of what i was envisioning

**What I checked / decided:** **Build Save trip as PDF as my 3rd custom feature**, replacing the offline download stretch goal.

## Prompt
> merged

(After merging ticket upload, the agent started this feature.)

**Agent response (summary):**
- **"Save as PDF (for no signal)"** on the trip page opens a print-ready page of the whole trip (`src/app/trips/[id]/print/page.tsx`).
- It shows every day in order with its greeting and summary, and every plan in time order with its time, type, title, confirmation number, address (a Google Maps link), ticket link, notes, and **ticket photo**.
- **Save as PDF** opens the phone's or computer's own print screen (`src/components/print-button.tsx`). On iPhone: Save as PDF, then the share button, then Save to Files.
- When printing, the button and back link are hidden, and the page prints on white.
- People the trip is shared with can save it too; anyone else gets "Trip not found".

Choices the agent made on its own:
- **The browser's own print-to-PDF instead of a PDF library**: no extra package, no cost, and the PDF keeps the app's look and clickable links.
- Ticket photos load through private links that last an hour, long enough to save the PDF.

## Bugs caught while testing
- **A wasted second page:** the "Saved from MiTrip" footer spilled onto page 2 by itself. Moved it into the header.
- **The gray app background printed.** The first fix didn't work because the CSS build put the normal background rule after the print rule. The agent checked what the browser actually applied in print mode, found the gray still winning, and made the print rule win.

## Testing
Phone-sized browser run with the app running locally against the separate "MiTrip test" database. 11 of 11 checks passed:
- The trip page link opens the print view, with both days, the greeting and summary, plans in time order, the confirmation number and notes, and the ticket photo loading.
- The Save as PDF button opens the print screen, and the button and back link are hidden in the printout.
- Chromium produced a real one-page PDF (`docs/screenshots/sample-trip.pdf`).
- Another user opening the print link sees "Trip not found" and none of the trip.

Cleanup note: removing the test photos with the Supabase command also deleted the test project's tickets bucket. The agent noticed it in the output and recreated it. The live project was never touched.

**What I checked / decided:** _(fill in after saving my honeymoon as a PDF on my phone)_
