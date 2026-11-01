# Prompt log: ticket-upload (custom feature)

Agent: Claude Code (Opus) in VS Code. Session date: Nov 1, 2026.

## Prompt 1
> done! merged, yeah go for it

(In reply to the agent asking whether to start ticket upload, my 2nd custom feature.)

**Agent response (summary):** Built ticket photos for plans (PLAN.md feature 10):
- **Private "tickets" bucket** in Supabase Storage (migration `supabase/migrations/20261101223000_create_tickets_bucket.sql`). Each photo is stored at `<trip>/<plan>/<random name>` and the plan's `ticket_image` column holds that path.
- **Same privacy as plans:** anyone who can see the trip can view its tickets; only the trip owner can upload or remove them, and only under a plan in that trip.
- **On the plan page** (owner): "📷 Add ticket photo" opens the phone's photos or camera. The ticket shows on the page; tap it to open full size. "Replace ticket photo" swaps it (the old file is deleted) and "Remove photo" removes it. People the trip is shared with see the photo without the buttons.
- Deleting a plan also deletes its photo, so no files are left behind.
- Photos up to 10 MB; anything that isn't an image gets a friendly message.

Choices the agent made on its own:
- **Photos upload straight from the phone to Supabase Storage**, not through the app's server. Next.js caps form uploads at 1 MB and Vercel at about 4.5 MB, and a full-size phone photo can be bigger. The server only saves the file's path, after checking it belongs to that plan.
- The page shows the photo through a private link that expires after an hour, so a copied link stops working.
- The new migration was tested on the separate "MiTrip test" database first.

## Testing
Phone-sized browser run with the app running locally against the "MiTrip test" database, plus direct Storage calls as a second user. 16 of 16 checks passed:
- The owner can upload a photo; it appears and loads, is saved under the right trip and plan, and is the only file stored.
- Replacing swaps the photo and deletes the old file.
- **A second user, using their own login straight against Storage, can't get a link to the ticket, download it, list the trip's tickets, or upload into the trip.**
- Removing hides the photo and deletes the file. Deleting the plan deletes its photo.

The screenshot uses a test image labelled "SAMPLE TICKET · NOT VALID". Test accounts were deleted afterward.

**What I checked / decided:** _(fill in after adding a real ticket on my phone)_
