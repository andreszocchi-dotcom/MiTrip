# Prompt log: data-isolation-test (test)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## Prompt 1
> yep lets start it

**Agent response (summary):** Used the data isolation scenario in PLAN.md section 5: User A owns "Australia-NZ Honeymoon" with one plan; User B, a separate account, loads their trip list and opens A's trip by its direct link; B's list is empty and the page shows "Trip not found." Then explained the catch: all of MiTrip's privacy lives in the database's Row Level Security rules, so the only honest "red" run is to loosen that rule, and Docker isn't installed for a private local copy.

## Prompt 2
The agent asked where the red run should loosen the rule: a separate test database, the live database for about 15 seconds, or install Docker.
**What I checked / decided:** **Separate test database.**

**Agent response (summary):**
- Created a free second Supabase project, **"MiTrip test"**, applied MiTrip's migrations and login settings to it, and checked it matches the live database rule for rule (56 of 56 tables, columns, and rules identical). The live project was never changed.
- Wrote `src/lib/data-isolation.test.ts`. It signs up two throwaway accounts in the test project, has User A create the honeymoon trip with one plan, then as User B runs the exact queries the My trips page and the trip page use. It checks: A can see the trip (so the setup really worked), B's list is empty, B's direct-link lookup returns nothing, and B can't see the plan.
- The test only reads `TEST_SUPABASE_*` settings from `.env.test.local`, so it can't point at the live database by accident. Without that file it skips.

## Bug caught: the plan's "Trip not found" page didn't exist
PLAN.md says User B should see "Trip not found", but the trip page fell through to Next.js's generic "404 | This page could not be found." The agent noticed while matching the test to the plan and added `src/app/trips/[id]/not-found.tsx`: "Trip not found", a short reason, and "Back to my trips".

Checked in a phone-sized browser with the app running locally against the test database: User A created the trip, User B's list didn't show it, and B opening the direct link saw "Trip not found" with none of the trip's details (4 of 4 checks).

## Red, then green
- **Red:** on the test project only (the agent confirmed which project each command hit), the agent changed the "Owners and members can view trips" rule to let everyone see every trip. 2 checks failed: B's list came back with the honeymoon trips, and B's direct-link lookup returned the whole trip.
- **Green:** the agent restored the rule, confirmed the test project matched the live rules again, and re-ran: 4 of 4 passed.
- The screenshots are the real test output from both runs, rendered as images. Test accounts and trips were deleted from the test project afterward.

Smaller fix along the way: the first run failed during setup because the database adds a trip's days a moment after the trip itself, so they weren't in the same response. The test now reads the days in a second request, like the app does.

**What I checked / decided:** _(fill in after reading the test and the screenshots)_
