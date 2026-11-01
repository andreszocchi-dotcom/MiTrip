# Prompt log: dashboard-test (test)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## Prompt 1
> yes lets do it!

(In reply to the agent asking whether to add Vitest and start with the dashboard stat test.)

**Agent response (summary):** Used the dashboard scenario already in PLAN.md section 5: given today is Oct 29, 2026 and trips start Jan 8, Jan 28, and Mar 17, 2027, "days until next trip" shows 71. Checked 71 by hand first (Oct 29 to Dec 31 is 63 days, plus 8 days into January).
- Added **Vitest** as the test runner. `npm test` runs every test.
- Wrote `src/lib/dashboard-stats.test.ts`. It feeds the three trips and the Oct 29 date straight into the dashboard's stat math (`src/lib/dashboard-stats.ts`) and checks that the next trip is the honeymoon, 71 days away.
- Added "Run the tests" to the README.

Choices the agent made on its own:
- **Vitest 4.1, not the newest 5.0.** Vitest 5 needs newer Node type definitions than MiTrip uses, so installing it failed. Vitest 4.1 works with the current setup and nothing else had to change.
- Named the other two trips "Trip starting Jan 28" and "Trip starting Mar 17", since the plan gives only their dates.

## Red, then green
- **Red:** the agent temporarily broke the dashboard so it picked the *latest* trip instead of the *soonest* (it flipped the sort order in `src/lib/dashboard-stats.ts`). The test failed: expected 71 days to the honeymoon, got 139 days to the March trip.
- **Green:** the agent put the code back (the file was restored from a copy and checked identical) and re-ran it. The test passed.
- The screenshots are the real `npm test` output from both runs, rendered as images.

**What I checked / decided:** _(fill in after reading the test and the two screenshots)_
