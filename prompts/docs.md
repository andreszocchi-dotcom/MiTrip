# Prompt log: docs (schema.md, Plan vs. Reality, README, IDEAS)

Agent: Claude Code (Opus) in VS Code. Session dates: Nov 1 to 2, 2026.

## Prompt 1
> you can log it as a potential idea, what is in that ideas.md? im curious

**Agent response (summary):** Walked me through IDEAS.md (promoted, stretch goals, parked), noticed it still said the AI import uses Sonnet 5.5 when it uses Haiku 5.5, and suggested logging "star trips" there in this docs PR instead of a separate one.

## Prompt 2
> oKAY, LETS DO THE DOCS PR

**Agent response (summary):**
- **schema.md:** read the tables, columns, and rules straight from the live database (read-only) and described each table, how they relate, who can see what, the ticket photo storage, and a comparison with PLAN.md section 3. The agent built what I designed; the differences are small (id types, the database enforcing the rules, days kept in step with trip dates, the tickets bucket, and trip_members with no invite screen).
- **PLAN.md:** added section 8, Plan vs. Reality, at the bottom with every planned feature, what happened, the PRs, and who decided. Sections 1 to 7 are unchanged (the diff is additions only). The Learning column is a draft for me to rewrite.
- **README.md:** listed what the app does now. Removed "Trips can be shared with the people traveling with you", which isn't true because trip members was cut.
- **IDEAS.md:** AI import model corrected to Haiku 5.5; offline download moved to "promoted" as Save trip as PDF; trip members and starring trips added to "parked".

Mistakes the agent caught in its own draft before committing:
- schema.md first said the database removes days when a trip's dates change. It only removes days with no plans, so changing dates never deletes plans. Corrected after checking the migration.
- The Plan vs. Reality row for #19 gave a reason ("cards too thin") the agent hadn't checked. Corrected from `prompts/day-plan-details.md`: I couldn't read the full descriptions on my phone.

**What I checked / decided:** _(fill in after reading Plan vs. Reality and rewriting the Learning column)_
