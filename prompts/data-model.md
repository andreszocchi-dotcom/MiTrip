# Prompt log: data model

Agent: Claude Code (Opus) in VS Code. Session date: Oct 29, 2026.

## Prompt 1
> when i logged in, there was no way for me to add a trip...

**Agent response (summary):** Explained that adding trips is feature 3 (create, read, update, delete) and the data model (feature 2) must come first, because there is nowhere to save a trip until the tables exist. Then built feature 2:

- **Migration** `supabase/migrations/..._create_trip_tables.sql` creates the tables exactly as designed in PLAN.md section 3: trips, days, plans, stars, trip_members (users already existed).
- **Relationships:** a user owns many trips; a trip has many days; a day has many plans; stars links users and plans (many-to-many); trip_members links users and trips (many-to-many). Deleting a trip deletes its days, plans, and stars.
- **Database rules:** trip name and plan title can't be blank, end date can't be before start date, plan type must be flight, hotel, reservation, ticket, or activity, and theme must be one of the five trip colors.
- **Auto days:** creating a trip adds one day per date. Changing the dates adds missing days and removes days outside the new range only if they have no plans.
- **Row Level Security:** a user sees a trip and its days and plans only if they own it or are a member. Only the owner can change anything. Members are read-only. Stars are personal.
- Generated TypeScript types for every table (`src/lib/supabase/database.types.ts`) so the app's code knows each column.

Verified with two throwaway accounts against the real database (14 of 14 checks passed), then deleted them:
- Creating Jan 8 to 24 made 17 days.
- A stranger saw 0 trips, days, and plans, and could not add plans or make themself a member.
- An invited member could see the trip and star a plan but not edit it, and the owner could not see the member's stars.
- Shortening the trip to Jan 8 to 20 left 13 days.
- Bad dates and a blank name were rejected.

**Bug caught (agent's own, from PR #6):** Supabase's security checker flagged that `handle_new_user()`, the function that copies each new account into `users`, could be called directly through the website API. It only works as a sign-up trigger, so a direct call would fail, but it should never have been exposed. Fixed with a new migration that revokes API access; re-tested that sign-up still creates the users row and the function can no longer be called.

Choices the agent made on its own:
- The privacy-rule helper functions live in a separate `private` schema that the website API can't reach.
- The trip owner is filled in automatically from whoever is logged in, so the app can't create a trip for someone else.
- Shortening a trip never deletes a day that has plans on it.
- New trips default to the "ocean" theme.
- Left two optional Supabase security suggestions off: leaked-password checking and two-factor login.

**What I checked / decided:** _(fill in after reading the plain-English summary)_
