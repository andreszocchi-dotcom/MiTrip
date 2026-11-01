# Prompt log: search (spine feature 6)

Agent: Claude Code (Opus) in VS Code. Session date: Oct 31, 2026.

## Prompt 1
> YES LETS ADD IT! Also another feature I would like improved is once I am in the specific trip, I would want to be able to sift through the different days a little bit easier? like maybe at least 7 days or so could show up so if i want to skip from jan 8 to jan 12 that would be easier than having to click through all of them? making that process of moving from one day to another smooth would be really good

**Agent response (summary):** Split this into two PRs: search (this one, spine feature 6) and a day strip for jumping between days (next PR, logged in `prompts/day-strip.md`). For search, built:
- **Search page** (`/search`, `src/app/search/page.tsx`), linked as "Search" in the header:
  - A search box that matches words in a plan's title, address, or notes, in any letter case.
  - Type chips (All, Flight, Hotel, Reservation, Ticket, Activity).
  - A trip picker.
  - Sort by "Date and time" or "Newest added".
  - A result count, "Clear", and a friendly "No plans match" when nothing fits.
- Results use the same plan cards as the day and Starred pages: each shows its trip, date, and time, and can be starred, mapped, or opened.
- The filters live in the page address (e.g. `/search?q=aria&type=reservation`), so the Back button works and a search can be bookmarked.
- **"Search this trip"** on each trip page opens search limited to that trip.
- Privacy is unchanged: search only sees plans the database rules let me see (mine and trips shared with me).

Choices the agent made on its own:
- **Search also looks in notes,** not just title and address as PLAN.md says. Imported plans keep most detail in notes, like "harbour view".
- **One shared plan card** (`src/components/plan-card.tsx`) now used by the day page, Starred page, and search, instead of three near-copies. The day page and Starred page were switched over in this PR.
- Characters that have special meaning in database filters (`, ( ) % *`) are dropped from the search box, so odd input can't break or change the query.
- Results are capped at 200.

## Testing
Phone-sized browser run with two throwaway accounts (deleted afterward), 14 of 14 checks passed:
- No filters lists all 4 plans in date and time order.
- The search box finds plans by title, by address in any letter case, and by words in notes.
- The type filter works, alone and together with the trip filter.
- "Newest added" sort works.
- Odd characters don't break the page, and an empty result shows "No plans match".
- Using the form itself ("dinner" + Reservation) shows "2 plans found". "Clear" resets.
- "Search this trip" limits results to that trip.
- A stranger's search can't find my plans.

The stars test was re-run because the Starred page now uses the shared card: 11 of 11 still pass.

**What I checked / decided:** _(fill in after searching my honeymoon on my phone)_
