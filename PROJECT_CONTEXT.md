# MiTrip: Full Project Context for Claude Code

> **Read this first.** This file is a handoff from a planning conversation in claude.ai. It contains everything known about the MiTrip project so far: the assignment brief in full, the student's situation, what has been decided, what is still open, a suggested schedule, workflow rules, templates, and guidance on how to collaborate. Treat it as the single source of truth until PLAN.md exists. Once PLAN.md is merged, PLAN.md wins wherever the two disagree.

---

## 0. Quick Summary (TL;DR)

- **Student:** Andrés Zocchi, Berkeley, CA.
- **Project:** MiTrip, a solo web app built for a class assignment.
- **Due:** Solo Demo Day, **Wednesday, November 4, 2026**, submission on bCourses before class.
- **Today (handoff date):** Thursday, October 29, 2026. That leaves about six days.
- **Group deadline:** Each CodeMates group picks one presenter and sends the name to instructors by **Monday, November 2, 2026**.
- **Tooling:** Claude Code inside VS Code.
- **Status:** No code written yet. No repo created yet (assume this unless told otherwise). No PLAN.md yet. Andrés has hand-drawn notebook sketches and mockups that he will share with you as photos. They may be hard to read.
- **Immediate next step:** Review the sketches, help Andrés make his own decisions about features and data, then draft PLAN.md and ship it as PR #1 before any feature work.

---

## 1. Who You Are Working With and How to Collaborate

### About Andrés
- Comfortable with business logic, requirements, data modeling concepts, and structured planning. Newer to hands-on coding than to systems thinking.
- Has done a prior course assignment building a portfolio website (Replit, GitHub Pages), so basic Git and GitHub concepts are somewhat familiar.

### Communication preferences (apply these in every response)
- **Never use em dashes.** Use commas, colons, parentheses, or separate sentences instead.
- **Never use litotes** (phrasing like "not bad," "not unlike," "not uncommon"). Say the positive thing directly.

### How to collaborate on this project
1. **The decisions are his.** The brief explicitly grades his judgment. Offer options with tradeoffs, recommend when asked, but do not silently decide features, schema, or stack. When you make a choice on your own (a library, a column type, a file structure), say so clearly so he can record it honestly in the prompt log and in Plan vs. Reality.
2. **Explain at a high level as you build.** He must be able to explain how the app accepts and stores data and how users interact with it. After each feature, give a short plain-English summary of what changed and where.
3. **One feature per branch, one feature per PR.** Never commit to main. Never bundle features.
4. **Flag your own mistakes.** If you introduce a bug and he catches it, or you catch it, call it out explicitly. Documented bugs earn credit.
5. **Remind him to save prompts.** Each feature branch needs `prompts/<feature>.md`. Offer to append the key prompts and your summarized responses to that file at the end of each feature.
6. **Prioritize working over ambitious.** A small feature that works beats a big one that is half-broken. The clock is tight.
7. **Do not guess what MiTrip is.** Andrés defines the app. Do not infer its purpose from the name, and do not propose domain-specific fields, tables, features, or designs until he has described the idea and shared his sketches. Then build from what he says and what is on the page.
8. **Sketch photos may be hard to read.** If something is ambiguous, ask a specific question rather than guessing. Describe back what you think each screen is before building from it.

---

## 2. Conversation History (What Has Happened So Far)

This section records the planning conversation in claude.ai so nothing is lost.

1. **Sketches.** Andrés said he has photos of notebook pages with sketched mockups for the app and asked whether to send them, noting they might be hard to read. Advice given: yes, send them. Rough sketches are a strong starting point. Tips for legibility: even lighting without harsh shadows, camera held straight above the page, one page per photo, and a short note per page explaining arrows, screen flows, or hard-to-read labels.
2. **Plan to work step by step.** Andrés asked for step-by-step help with the assignment and said he would transition to VS Code with Claude Code once things were kicked off. Suggestion given: finish the planning phase with a project brief that can live in the repo (README, CLAUDE.md, or this file) so Claude Code has full context from the start.
3. **Assignment brief shared.** Andrés pasted the full assignment brief (reproduced in Section 3 below). A day-by-day schedule, a suggested stack, and a list of gotchas were proposed (Sections 5, 6, and 8).
4. **Open question asked, not yet answered:** "What does MiTrip track or collect, in one sentence?" **This is still unanswered.** The sketches will likely answer it.
5. **Handoff.** Andrés decided to move to Claude Code and share the sketch photos there, and asked for this long context document to feed in.

### What is decided
- App name: **MiTrip**.
- Coding agent: **Claude Code** in VS Code.
- Andrés will share notebook sketches with Claude Code directly.

### What is NOT decided yet (all of these need Andrés's call)
- What MiTrip tracks or collects, and what it is for.
- The 3 custom features.
- The database schema beyond the required tables.
- The final tech stack (a suggestion exists in Section 6, but it is only a suggestion).
- Hosting provider and auth approach.
- Visual design direction and inspiration apps.
- The stranger-test person.

---

## 3. The Assignment Brief (Full Text, as Provided by the Instructor)

> The text below is the brief exactly as Andrés pasted it. It is the grading authority.

### The Brief
Pick one thing in your life you'd like to track, collect, or keep, to build a web app for. You'll build it the way professional developers do: plan first, then one feature at a time, with tests, and the code written on branches & merged via Pull Requests.

### What to build? Need an idea?
The only rule for choosing: it has to be something you would actually use this semester. It's good if other people find value in it (in that it should be something others can use), but the actual functionality I'll leave for you to ideate on. Feel free to make this interesting and useful for YOU. A few possible paths:

Climbing log · vinyl collection · plant-watering tracker · board-game win record · sourdough bake journal · wine notes · run log · bookshelf · travel bucket list · restaurant ratings · concert history · coffee shop rankings · houseplant wish list · recipe box · golf scores

### Why this matters
Everything from Classes 1–10 shows up in this app: the vocabulary, the tools, data types, Git and pull requests, databases, testing, and deployments. You'll prompt an AI agent to do most of the building. Your job is the judgment: deciding what to build, checking that it works, and understanding why.

### Pick your tools
Use whichever AI coding agent you like: Replit Agent, Claude Code, Cursor, or another. The same goes for hosting and your database. Your tool choice doesn't affect your grade. Whatever you use, two rules hold:

- Your code lives in a GitHub repo, and nothing is committed directly to main. Everything gets there through a pull request.
- You understand how it works at a high level. How the app is structured to accept and store data, and how users interact with the app.

### Step 1: Write Your Plan (PLAN.md)
Before your agent builds anything, write a PLAN.md in the root of your repo. It's the blueprint for your app. Professional teams write one before they build, and it's also the best brief you can give your agent.

Your plan is your first pull request. Open an Issue, branch, add PLAN.md, open a PR, and merge it before any feature PR. Git timestamps everything, so the order is the deadline.

You can use AI to help you think it through, but the decisions have to be yours, and they have to be specific. "Users can manage their data" is not a plan. "I can log a bake recipe with flour type, hydration %, bake date, and a 1–5 rating" is.

| Section | What to write |
|---|---|
| 1. Pitch | "I'm building ___ because ___." How often you'll use it. |
| 2. Features | Every spine feature plus your 3. Uses the classic "user story" format "As a ___, I want ___, so that ___." Number them in the order you'll build them. |
| 3. Database | Every table, its columns, the type of each column (text, number, date, true/false), the primary key, and how tables connect (one-to-many, many-to-many). A diagram is welcome and highly suggested. |
| 4. Tests | Your 2 required tests (below), each written as "Given ___, when ___, then ___." |
| 5. Technologies | Your coding agent, database, how sign up and login will work, where you'll host it, any third party libraries / plugins. One sentence on why for each. |
| 6. Design | The look and feel: colors, style, as well as an app or two you'd like to borrow inspiration from. |
| 7. Risks and cuts | The feature you're least sure you can build, and what you'll cut first if you run out of time. |

Aim for 1–3 pages. Specific beats long.

### At the end: Plan vs. Reality
Don't rewrite your original plan. When you're done, add one section to the bottom of PLAN.md:

| Planned feature | Shipped / Changed / Cut | Status (Done/Backlogged) | Learning | What changed and why (one line) |
|---|---|---|---|---|

You'll use this table in your reflection, so be honest. A plan that was wrong in interesting ways is worth more than one quietly edited to match.

### Step 2: Build With the Feature Loop
Every feature goes through the same loop. This is exactly how you'll work in the team project. The only difference is that here, you are both the creator and the approver.

1. **Issue:** Open a GitHub Issue describing the feature. Paste its user story from your plan.
2. **Branch:** Create a branch from main named for the feature (e.g., feature/stars).
3. **Prompt:** Have your AI agent build the feature on that branch. Save your key prompts in prompts/<feature>.md on the same branch.
4. **Pull request:** Push the branch and open a PR into main. The description says what changed and includes closes #N to link the Issue.
5. **Merge:** Merge the PR yourself. (No formal review is needed in solo mode. That comes in the team project.)
6. **Deploy:** Publish the updated app so the live URL stays current.

Small PRs are better than big ones. One feature per PR. You should end with at least 9 merged PRs: your plan plus at least 8 features.

### The Spine: Required Features

| # | Feature | What it requires |
|---|---|---|
| 1 | Sign up and login | A new visitor can create their own account from inside your app, then log in and log out. Every account is a row in your users table. Each user sees only their own data. |
| 2 | Data model | A users table plus at least 2 tables of your own, connected by a relationship (e.g., entries belong to categories). |
| 3 | Create / read / update / delete | Add an item, view the list, open one item's detail page, edit it, and delete it with an "are you sure?" confirmation. |
| 4 | Validation | Required fields can't be left blank. Show a friendly message if someone tries. |
| 5 | Stars | Users can star items and see a "starred" view. All stars live in one stars table (a junction table) where each row references a user and an item: "this user starred this item." One table for everyone, not one per user. |
| 6 | Find things | Search or filter, plus sort (e.g., newest first, highest rated). |
| 7 | Dashboard | At least one chart and 2–3 summary stats computed from your data (count, average, best month). |

**Real data:** Your app must contain at least 5 real entries of your own data by the due date. No placeholder text.

### Your 3 features
Add 3 features of your own design. They're graded on whether they work, not on how ambitious they are. A small feature that works beats a big one that's half-broken. Need inspiration? Photo upload · calendar view · map view · CSV import · reminders · a "random pick" button · a public read-only share link · notes history · dark mode · a streak counter

### Tests
Prompt your agent to write 2 tests, matching the Given / When / Then scenarios in your plan:

- **Data isolation:** User B cannot see User A's data.
- **Dashboard:** One of your summary stats calculates correctly.

You don't need to write test code by hand. You do need to prove you understand what each test does. In the PR that adds each test, include:

- **Plain-English explanation:** What does the test check? (e.g., "This test creates two users, adds a bake for User A, logs in as User B, and checks that User B's list is empty.")
- **Red, then green:** Ask the agent to temporarily break the feature. Run the test and screenshot it failing. Revert the break, run it again, and screenshot it passing.
- **What would break it:** One sentence on a real change that would make this test fail.

Bugs are worth documenting. If the agent got something wrong and you caught it, say so in the PR description: what happened, how you noticed, how you fixed it. The judgement earns credit.

### Documentation
- **PLAN.md** in the root of your repo: your original plan plus the Plan vs. Reality section (see Step 1).
- **schema.md** in the root of your repo. List every table, its columns, and how the tables relate, in plain English or a simple diagram. You should have at least 4 tables: users, your main item, a related table, and stars (the junction table connecting users and items). Compare it with section 3 of your plan: did the agent build what you designed?
- **README.md** that lets someone else understand and run your app: what it does, the live URL, the tools you used, and how to run it.

### Solo Demo Day (Wed Nov 4)
**Pick your group's presenter (by Mon Nov 2).** Every student builds and submits an app. Each CodeMates group picks one member to demo live and sends the instructors that student's name. How you decide is up to your group. Only the student who built the app needs to present.

**The live demo: 5 minutes, then 1 minute of Q&A.** A timer is on screen, and it's a hard stop. Your demo must include:

- A live sign up. Create a brand-new account in front of the class.
- Your real app. Log in to your own account and show your real data, your dashboard, and your stars.
- One audience choice. Let the class pick something during the demo, such as which item to star, what to search for, or what to add, so it isn't entirely scripted.
- One question from the audience, answered live.

**Heads up: Team Demo Day must be a different app.** In the team project (Assignment H), each CodeMates group picks one member's solo app and connects it to outside services through APIs. It can't be the app your group demos at Solo Demo Day. Two apps from every group get a turn in the spotlight, so please ensure your apps (and process to build them) are well done.

### Reflection
Two questions. Each needs 400–600 words plus the evidence listed. These can only be answered by the person who built this app, so an answer without its evidence earns at most half credit.

**1. Plan vs. Reality.** Find the single biggest gap between your original PLAN.md and what you shipped.
- Show the trail: link the line in your plan, the PR(s) where things changed, and quote the prompt(s) and agent response(s) from your prompt log where it went sideways.
- Who decided? Was the change your call, or did the agent make it and you went along? How can you tell? What did it cost you?
- Rewrite it: rewrite that section of your plan so that a fresh agent with no memory of your project would build it right the first time.

**2. The stranger test.** Hand your live app to someone who isn't in this class. A spouse / roommate / friend works great for this. They should sign up for their own account and use the app for 10 minutes while you watch without helping. Note every time they hesitate, get confused, or get stuck.
- List their top 3 struggles, in their unaided journey to use your app.
- Fix one problem: Pick the most important struggle, fix it through a PR (link it), and explain why you chose it.
- What did you decide not to fix, and why is that the right tradeoff for now?

### Submission (by Wed Nov 4, before class)
Submit on bCourses:
- [ ] GitHub repo URL (add the instructor and GSI as collaborators, or make the repo public)
- [ ] Live app URL
- [ ] Link to your PLAN.md (including Plan vs. Reality)
- [ ] Screenshot of your dashboard on your own account, with your real data
- [ ] Reflection answers, with evidence

### Grading (12 points)

| Category | Points | Full credit means |
|---|---|---|
| Spine features | 4 | All 7 spine features work on the live URL, with 5+ real entries, and 3 working user created features |
| PLAN.md, schema.md and README | 2 | Plan was merged before any feature PR. All 8 sections, specific to your app, honest Plan vs. Reality. Includes a readme and schema to help others use the app. |
| Feature loop | 2 | 9+ merged PRs, each with a linked Issue, a feature branch, and a prompt log; no direct commits to main |
| Tests | 1 | Both tests pass, each with an explanation, red/green screenshots, and "what would break it". |
| Reflection | 3 | Both questions answered with full evidence, specific to your app |

> Note on "All 8 sections": the brief lists 7 plan sections plus the Plan vs. Reality section added at the end, which makes 8.

---

## 4. Requirements Checklist (Derived From the Brief)

Use this as a running checklist. Check items off as they ship.

### Process
- [ ] GitHub repo created
- [ ] Branch protection on main (require PRs, block direct pushes)
- [ ] Issue #1 opened for PLAN.md
- [ ] Branch `docs/plan` (or similar) created
- [ ] PLAN.md written with all 7 sections, specific to MiTrip
- [ ] PLAN.md PR merged **before any feature PR**
- [ ] Every feature: Issue → branch → prompts/<feature>.md → PR with `closes #N` → merge → deploy
- [ ] 9+ merged PRs total (target 11+: plan, 7 spine, 3 custom, plus stranger-test fix)
- [ ] Zero direct commits to main

### Spine features
- [ ] 1. Sign up, log in, log out; each account is a row in users; users see only their own data
- [ ] 2. Data model: users + at least 2 custom tables with a relationship
- [ ] 3. CRUD: add, list, detail page, edit, delete with "are you sure?" confirmation
- [ ] 4. Validation: required fields enforced with a friendly message
- [ ] 5. Stars: single `stars` junction table (user_id, item_id), plus a "starred" view
- [ ] 6. Find things: search or filter, plus sort
- [ ] 7. Dashboard: at least 1 chart and 2–3 computed summary stats

### Custom features
- [ ] Custom feature A (works on live URL)
- [ ] Custom feature B (works on live URL)
- [ ] Custom feature C (works on live URL)

### Data
- [ ] 5+ real entries in Andrés's own account (no placeholder text)

### Tests
- [ ] Data isolation test (User B cannot see User A's data)
- [ ] Dashboard stat test (one summary stat computes correctly)
- [ ] Each test PR includes: plain-English explanation, red screenshot, green screenshot, "what would break it" sentence

### Documentation
- [ ] PLAN.md (original + Plan vs. Reality table at the bottom, original left unedited)
- [ ] schema.md (at least 4 tables: users, main item, related table, stars; compared against PLAN.md section 3)
- [ ] README.md (what it does, live URL, tools used, how to run it)

### Demo prep
- [ ] Group presenter chosen and sent to instructors by Mon Nov 2
- [ ] Demo rehearsed under 5 minutes: live sign up, log in to real account, real data, dashboard, stars, one audience choice
- [ ] Prepared for 1 audience question

### Reflection
- [ ] Q1 Plan vs. Reality (400–600 words, links to plan line, PRs, quoted prompts and responses, rewritten section)
- [ ] Q2 Stranger test (400–600 words, top 3 struggles, fix PR link, what was not fixed and why)

### Submission on bCourses
- [ ] Repo URL (instructor and GSI added, or repo public)
- [ ] Live app URL
- [ ] PLAN.md link
- [ ] Dashboard screenshot with real data
- [ ] Reflection answers with evidence

---

## 5. Suggested Day-by-Day Schedule

This was proposed in the planning conversation. Adjust as needed, but keep the order: plan first, deploy early.

| Day | Date | Goals |
|---|---|---|
| Thu | Oct 29 | Share sketches. Answer "what does MiTrip track?" Lock the 3 custom features. Write PLAN.md together. Create repo, enable branch protection, merge the plan PR. |
| Fri | Oct 30 | Scaffold the app and deploy a blank version to get the live URL working on day one. Then data model, then sign up and login. |
| Sat | Oct 31 | CRUD, validation, stars. |
| Sun | Nov 1 | Search/filter/sort, dashboard, both tests (capture red/green screenshots in the moment). |
| Mon | Nov 2 | The 3 custom features. Enter 5+ real entries. Group picks its presenter and sends the name to instructors. |
| Tue | Nov 3 | Stranger test (10 minutes, watch without helping). Fix-it PR. schema.md, README.md, Plan vs. Reality table. Write both reflections. |
| Wed | Nov 4 | Final check of the live URL. Submit on bCourses before class. Demo Day. |

**Why deploy on day one:** deployment problems found on Tuesday night are the most common way these projects go sideways. A blank app on a live URL early removes that risk.

---

## 6. Suggested Tech Stack (A Suggestion, Not a Decision)

This was offered as one good option for building with Claude Code. Andrés must confirm or change it, and PLAN.md section 5 needs a one-sentence "why" for each choice in his own words.

| Layer | Suggestion | Why it fits this assignment |
|---|---|---|
| Coding agent | Claude Code (VS Code) | Already decided. Works directly in the repo and with Git. |
| Framework | Next.js (React, TypeScript) | Large ecosystem, easy to deploy, pages and API routes in one project. |
| Database | Supabase (Postgres) | Real relational database with tables, foreign keys, and a visual table editor that helps with schema.md and with explaining the data model. |
| Auth | Supabase Auth (email + password) | Handles sign up, log in, log out out of the box; each user gets an ID that links to their data. |
| Data isolation | Supabase Row Level Security (RLS) | Enforces "each user sees only their own data" at the database level, which makes the isolation test meaningful. |
| File storage | Supabase Storage | Only needed if a custom feature involves file uploads. |
| Hosting | Vercel | Auto-deploys on every merge to main, so the "Deploy" step of the feature loop happens automatically. |
| Charts | Recharts | Simple React chart library for the dashboard. |
| Testing | Vitest (unit) and/or Playwright (end-to-end) | Vitest is quick for the dashboard stat calculation; Playwright or an integration test against Supabase suits the data isolation test. |

Alternatives worth mentioning if Andrés wants something simpler: a single Express or Flask app with SQLite and session auth, hosted on Render or Railway. Fewer moving parts, but more auth work by hand.

---

## 7. What MiTrip Is

This is intentionally left for Andrés to define. Nothing in this document assumes what MiTrip tracks, its fields, its tables, its custom features, or its design. Those come from Andrés and his sketches.

When he shares the idea and sketches, help him get specific in the way the brief asks. The brief's own example of the bar to hit: "I can log a bake recipe with flour type, hydration %, bake date, and a 1–5 rating" is a plan; "Users can manage their data" is not. Ask questions that draw out specifics (which fields, which are required, what gets rated or counted, how items relate) rather than supplying answers.

---

## 8. Gotchas and Rules That Protect the Grade

1. **The first commit problem.** You need something on main to branch from. Creating the repo with GitHub's auto-generated README is the usual approach. Immediately afterward, turn on branch protection for main so every later change goes through a PR. If Andrés is worried about this initial commit counting against him, he can ask the instructor.
2. **Plan PR order is graded by timestamp.** PLAN.md must be merged before any feature PR is even merged. Do not open feature branches with real work until the plan PR is merged.
3. **Prompt logs as you go.** Save key prompts and summarized agent responses to `prompts/<feature>.md` on each branch. Reflection Q1 requires quoting them. Reconstructing later is painful.
4. **Red/green screenshots in the moment.** For each test: temporarily break the feature, run the test, screenshot the failure; revert, run again, screenshot the pass. Commit the screenshots or attach them to the PR.
5. **Agent mistakes earn credit.** When something breaks or the agent misunderstands, write it down: what happened, how it was noticed, how it was fixed. Put it in the PR description.
6. **Never edit the original plan.** Plan vs. Reality goes at the bottom as a new section. Changes in direction during building are fine and expected; record them in the table.
7. **Stars must be one junction table.** Not a boolean column on the item table, not a table per user. One `stars` table with `user_id` and `item_id`.
8. **Delete needs a confirmation step.** "Are you sure?" before deleting.
9. **Validation needs a friendly message.** Browser-default errors may be acceptable, but a clear in-app message is safer.
10. **Data isolation must actually hold.** Test it manually with two accounts as well as with the automated test.
11. **Real data, no placeholders.** Remove any seed or lorem ipsum data from Andrés's account before submission. Seed data in a test environment is fine.
12. **Keep the live URL current.** Deploy after every merge (automatic with Vercel).
13. **Secrets stay out of Git.** Use `.env.local` for keys, add it to `.gitignore`, and set the same variables in the hosting dashboard.
14. **Demo readiness.** Live sign up in front of the class means sign up must work smoothly on the production URL. If email confirmation is on, the demo can stall waiting for an email. Consider turning off email confirmation or testing the flow end to end beforehand.
15. **Repo access.** Add the instructor and GSI as collaborators, or make the repo public, before submitting.
16. **Team project implication.** One solo app per group goes on to the team project (with outside APIs), and it cannot be the one demoed at Solo Demo Day. Clean, well-documented code helps if MiTrip is picked.

---

## 9. Templates

### 9.1 PLAN.md skeleton

```markdown
# MiTrip: PLAN

## 1. Pitch
I'm building MiTrip because ___. I'll use it ___ (how often).

## 2. Features (in build order)
1. **Sign up and login.** As a new visitor, I want to create an account and log in and out, so that my data is private to me.
2. **Data model.** As a user, I want ___, so that ___.
3. **Create / read / update / delete.** As a user, I want to add a ___ with ___ (specific fields), view my list, open one's detail page, edit it, and delete it after confirming, so that ___.
4. **Validation.** As a user, I want a clear message when I leave ___ blank, so that ___.
5. **Stars.** As a user, I want to star ___ and see a starred view, so that ___.
6. **Find things.** As a user, I want to search by ___ and sort by ___, so that ___.
7. **Dashboard.** As a user, I want to see ___ (chart) and ___ (stats), so that ___.
8. **Custom A:** As a user, I want ___, so that ___.
9. **Custom B:** As a user, I want ___, so that ___.
10. **Custom C:** As a user, I want ___, so that ___.

## 3. Database
(Every table, every column with type, primary keys, relationships. Include a diagram.)

## 4. Tests
- **Data isolation:** Given ___, when ___, then ___.
- **Dashboard:** Given ___, when ___, then ___.

## 5. Technologies
- Coding agent: ___ because ___.
- Database: ___ because ___.
- Sign up and login: ___ because ___.
- Hosting: ___ because ___.
- Libraries and plugins: ___ because ___.

## 6. Design
Colors: ___. Style: ___. Inspiration: ___ and ___ (what to borrow from each).

## 7. Risks and cuts
Least sure I can build: ___. First to cut if short on time: ___.

---

## Plan vs. Reality (add at the end, do not edit sections above)

| Planned feature | Shipped / Changed / Cut | Status (Done/Backlogged) | Learning | What changed and why (one line) |
|---|---|---|---|---|
```

### 9.2 GitHub Issue template

```markdown
**Feature:** <name>

**User story (from PLAN.md):**
As a ___, I want ___, so that ___.

**Done when:**
- [ ] ___
- [ ] ___
```

### 9.3 Pull request template

```markdown
## What changed
<plain-English summary of the feature and the main files touched>

## How to check it
1. ___
2. ___

## Bugs caught (if any)
- What happened:
- How I noticed:
- How it was fixed:

## Prompt log
See `prompts/<feature>.md`

closes #N
```

### 9.4 Prompt log template (`prompts/<feature>.md`)

```markdown
# Prompt log: <feature>

## Prompt 1
> <exact prompt text>

**Agent response (summary):** ___
**What I checked / decided:** ___

## Prompt 2
> ...
```

### 9.5 Test PR additions

```markdown
## Test: <name>

**Plain-English explanation:**
This test ___.

**Red:** <screenshot of failing run, plus what was temporarily broken>
**Green:** <screenshot of passing run after revert>

**What would break it:**
<one sentence describing a real code change that would make this fail>
```

### 9.6 Suggested branch names
`docs/plan`, `feature/scaffold`, `feature/data-model`, `feature/auth`, `feature/crud`, `feature/validation`, `feature/stars`, `feature/search-sort`, `feature/dashboard`, `test/data-isolation`, `test/dashboard-stat`, `feature/<custom-a>`, `feature/<custom-b>`, `feature/<custom-c>`, `fix/stranger-test-<issue>`, `docs/schema-readme`, `docs/plan-vs-reality`.

(Tests can ship in their own PRs or inside the feature PRs they test. Either way, each test PR needs the explanation, red/green screenshots, and the "what would break it" sentence.)

---

## 10. Reflection Prep (Collect Evidence While Building)

### For Q1: Plan vs. Reality
Keep a running note (outside the repo or in a scratch file) of:
- Moments where the build diverged from PLAN.md.
- Whether Andrés or the agent made each call, and how he can tell (prompt wording, agent response, diff).
- What each divergence cost (time, a cut feature, a rework).
- PR links and prompt-log lines for each.

At the end, pick the biggest gap and rewrite that plan section so a fresh agent would build it right on the first try.

### For Q2: The stranger test
- Person: someone outside the class. They sign up for their own account on the live URL and use it for 10 minutes. Andrés watches without helping.
- Record every hesitation, confusion, or stuck moment with a timestamp.
- Pick the top 3 struggles, fix the most important one through a PR, link it, and explain why it was chosen and why the others can wait.

---

## 11. Demo Day Script Outline (5 minutes, hard stop)

1. **(0:00–0:30)** Pitch: what MiTrip is and why Andrés uses it.
2. **(0:30–1:30)** Live sign up: create a brand-new account on the production URL.
3. **(1:30–2:00)** Log out, log in to Andrés's real account.
4. **(2:00–3:00)** Real data: list, detail page, quick edit. Audience choice: let the class pick an item to star or a search term.
5. **(3:00–3:45)** Starred view and dashboard (chart plus stats).
6. **(3:45–4:30)** One or two custom features.
7. **(4:30–5:00)** Wrap up. Then 1 minute of audience Q&A.

Rehearse with a timer at least once on Tuesday.

---

## 12. First Actions for Claude Code in This Session

1. Ask Andrés to share the sketch photos (one page per photo, with a note per page if possible).
2. For each photo, describe back what you see (screens, fields, buttons, flows) and ask about anything unclear.
3. Ask the open question: "In one sentence, what does MiTrip track or collect?"
4. Help him choose: main item, related table, 3 custom features, stack, and design direction. Present options with tradeoffs; let him decide.
5. Draft PLAN.md together using the skeleton in Section 9.1. Keep it specific and 1–3 pages.
6. Walk him through: create repo, enable branch protection, open Issue #1, create `docs/plan` branch, commit PLAN.md (and optionally this file as `PROJECT_CONTEXT.md` or `CLAUDE.md`), open a PR with `closes #1`, merge.
7. Only then start `feature/scaffold` and deploy a blank app.

---

*End of handoff document. Generated October 29, 2026.*
