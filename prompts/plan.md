# Prompt log: plan

Agent: Claude Code (Opus) in VS Code. Session date: Oct 29, 2026.

## Prompt 1
> Okay start up a new folder "MiTrip" and read through the project context and the assignment we are gonna work on. [...] set up a new GitHub repository [...] connect that to the computer [...] I think we'll deploy on Vercel.

**Agent response (summary):** Created the public repo andreszocchi-dotcom/MiTrip with a starter README, cloned it to C:\Users\andre\MiTrip, and turned on branch protection for main (PRs required, applies to admins too). The agent chose on its own: setting git's global name and email (GitHub no-reply address), using GitHub's auto README as the first commit, and the folder location.
**What I checked / decided:** I chose a public repo (meets the submission rule; branch protection is free on public repos).

## Prompt 2
> [Six sketch photos plus a spoken walkthrough; full text in sketches/README.md.] Tell me, do I need to, before we do anything, record all of this information? [...] Help me make sure I'm not skipping any steps.

**Agent response (summary):** Saved the sketches and my walkthrough to sketches/, started IDEAS.md as a parking lot, and described each screen back. Flagged feasibility: Gmail access is a restricted Google permission that needs a weeks-long review for public use; airlines have no shared API; Google Maps saved lists can't be read by apps; AI itinerary import costs money and is unpredictable; offline mode is a moderate risk. Listed the remaining planning steps.
**What I checked / decided:** Kept the name MiTrip (over MeTrip).

## Prompt 3
> I like that pitch [...] add in the component that this can also be shared with other folks that are joining your trip [...] it'll be a singular trip that contains many days [...] Three stars. I don't think I need to star anything. What does that mean? [...] I like all of those features [...] a one-time check when a trip is added, and it looks through my email [...]

**Agent response (summary):** Explained that stars are required spine feature #5 (a bookmark stored in one shared stars table). Explained that a one-time Gmail scan needs the same restricted permission as constant checking. Recommended committing to 3 custom features and listing the rest as stretch goals.
**What I checked / decided:**
- Pitch includes sharing with trip companions.
- Companions join as **trip members** (a trip_members table), not a read-only link. The agent recommended the link; I chose members.
- **Days get their own table** (Trip has many Days, Day has many Plans).
- **Plans are what get starred.**
- **Try the Gmail scan anyway.** The agent recommended parking it; I chose to keep it as the first stretch goal.
- **Committed custom features:** (1) invite trip members, (2) Today view with tomorrow snapshot and Open in Google Maps buttons, (3) ticket or boarding pass photo/QR upload. Stretch, in order: Gmail scan, AI itinerary import, offline download.

## Prompt 4
> [Answers to the agent's multiple-choice questions on member permissions, dashboard, find things, and stack.]

**Agent response (summary):** Drafted a schema from the sketches (trips, days, plans, stars, trip_members) for me to mark up. Pointed out the brief needs 2 to 3 stats after I picked only one. Assumed by default that only the trip owner can delete the trip and manage members.
**What I checked / decided:**
- Trip members can **view and edit** (the agent recommended view only).
- Chart: **plans per day** (bar chart).
- Stats: **days until next trip** (the tested stat), **trips this year**, **total plans**.
- Find things: search plans by title or address, filter by type, sort by date/time or newest added.
- Stack: Next.js, Supabase (database, email/password auth, row-level security, storage), Vercel, Recharts, Vitest.

## Prompt 5
> 1. schema's good 2. calm and minimal but with some light blue coloring and easy to read please. If you can tie the specific trips to something with the trip that's awesome 3. i think the app serves a tripit style of function, but i dont like tripit's style at all. yes phone first ideally 3. Okay dont build trip members with edit rights just read only for now, all the rest sounds good

**Agent response (summary):** Drafted the full PLAN.md (7 sections). Choices the agent made on its own and flagged for my review: a trips.theme column for per-trip colors; a users table with a uuid id; creating a trip auto-creates one day per date; invites go by the email the companion already signed up with; Apple Wallet as the second inspiration app; Tailwind CSS for styling; a "days until next trip = 71" test using a fixed date; Plan vs. Reality left for the end.
**What I checked / decided:**
- **Changed my mind:** trip members are **read-only** (viewer role) for now, reversing my Prompt 4 choice of view and edit, to lower risk.
- Design: calm, minimal, light blue, easy to read, phone first. TripIt for function, not style.

## Prompt 6
> also can we make it you can create an account or you can log in with google

**Agent response (summary):** Added "Continue with Google" to feature 1, Technologies, and Risks and cuts. Explained that Google sign-in (name and email only) needs no Google review, unlike the Gmail scan. Suggested building it as its own PR right after email login, and keeping email sign-up for the Demo Day live sign-up.
**What I checked / decided:** Sign up and login supports both email/password and Google.

## Prompt 7
> approved, yes the three examples i gave are all in 2027, of course those are just my personal examples, i want users capable of adding their own in case that wasnt clear

**Agent response (summary):** Confirmed every user adds their own trips; my three trips are my real data and the test's sample data. Opened Issue #1, created the docs/plan branch, committed the plan files, and opened the PR.
**What I checked / decided:** Approved PLAN.md. My example trips (Australia-NZ Honeymoon, Amol's bachelor party in Austin, China Trek) are all in 2027, so the dashboard test expects 71 days.
