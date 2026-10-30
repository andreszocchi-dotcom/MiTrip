"use server";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { refresh } from "next/cache";
import { z } from "zod";
import { formatDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

// The model is one setting so it's easy to switch (e.g. to "claude-sonnet-5-5").
const IMPORT_MODEL = "claude-haiku-5-5";
// Claude Haiku 5.5 prices per million tokens (prompts under 100K tokens).
const PRICE_PER_MILLION = { input: 0.1, output: 0.5 };
// Guardrail: about 30,000 words. Keeps one paste from running up the bill.
const MAX_ITINERARY_CHARS = 200_000;

const PlanSchema = z.object({
  title: z.string().describe("Short name, e.g. 'SFO to Sydney' or 'Sydney Opera House tour'"),
  type: z.enum(["flight", "hotel", "reservation", "ticket", "activity"]),
  start_time: z.string().nullable().describe("24-hour HH:MM, only if the itinerary gives a time"),
  end_time: z.string().nullable().describe("24-hour HH:MM, only if the itinerary gives a time"),
  address: z
    .string()
    .nullable()
    .describe(
      "Something Google Maps can search: the street address if given, otherwise the place name plus city (e.g. 'PR1 Hotel, Sydney'). Null if there is no physical place.",
    ),
  confirmation_number: z.string().nullable().describe("Booking reference or flight number, only if written in the itinerary"),
  notes: z.string().nullable().describe("Useful details and tips from the itinerary, kept short"),
});

const ImportSchema = z.object({
  days: z.array(
    z.object({
      date: z.string().describe("YYYY-MM-DD, one of the trip's dates"),
      greeting: z.string().nullable().describe("A short, warm line for the top of the day (max 6 words)"),
      summary: z.string().nullable().describe("One sentence previewing this day, shown the evening before as the 'Tomorrow' snapshot"),
      plans: z.array(PlanSchema),
    }),
  ),
});

const SYSTEM_PROMPT = `You turn a traveler's itinerary into a day-by-day plan for the MiTrip app.

Rules:
- Use only the trip dates you are given. If the itinerary names weekdays or "Day 3" instead of dates, map them onto the trip dates.
- Each plan is one thing the traveler does or needs: a flight, a hotel stay or check-in, a reservation (restaurant, spa, tour booking), a ticket (museum, cruise, show, game), or an activity (sightseeing, a walk, free time).
- Never invent facts. Leave times, confirmation numbers, and addresses null unless the itinerary states them or the place name makes the location clear.
- For any physical place, set address to something Google Maps can find: the street address if given, otherwise the place name plus the city.
- Keep the traveler's own wording for tips in notes. Skip filler.
- List each day's plans in the order they happen, even when they have no time.
- Return every trip date. Give each one a greeting in your own words that fits the day, like "Get excited!" on departure day or "Congrats, you landed!" on arrival day. Don't copy headings from the itinerary.
- Give each day a one-sentence summary of what's coming, written to the traveler ("Tomorrow you take the early ferry to Manly.").`;

export type ImportState =
  | { ok: true; planCount: number; dayCount: number; skippedDays: number; costUsd: number; inputTokens: number; outputTokens: number }
  | { ok: false; error: string }
  | undefined;

export async function importItinerary(tripId: number): Promise<ImportState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Please log in again." };
  }

  const { data: trip } = await supabase
    .from("trips")
    .select("id, name, owner_id, itinerary_text, days(id, date, greeting, summary)")
    .eq("id", tripId)
    .order("date", { referencedTable: "days" })
    .maybeSingle();
  if (!trip || trip.owner_id !== user.id) {
    return { ok: false, error: "Only the trip owner can import an itinerary." };
  }
  const text = trip.itinerary_text?.trim();
  if (!text) {
    return { ok: false, error: "Paste an itinerary into this trip first (Edit trip)." };
  }
  if (text.length > MAX_ITINERARY_CHARS) {
    return { ok: false, error: "This itinerary is too long to import. Trim it under about 30,000 words." };
  }

  const dateList = trip.days
    .map((d, i) => `Day ${i + 1}: ${d.date} (${formatDay(d.date)})`)
    .join("\n");

  const client = new Anthropic();
  let response;
  try {
    // Streamed because a long trip's plans can be a large response; the SDK
    // requires streaming for big max_tokens. finalMessage() waits for it all.
    response = await client.messages
      .stream({
        model: IMPORT_MODEL,
        max_tokens: 32000,
        output_config: { effort: "medium", format: zodOutputFormat(ImportSchema) },
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Trip: ${trip.name}\nTrip dates:\n${dateList}\n\nItinerary:\n${text}`,
          },
        ],
      })
      .finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "The AI service is busy. Try again in a minute." };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, error: `The AI service returned an error (${error.status}). Try again later.` };
    }
    throw error;
  }

  if (response.stop_reason === "refusal") {
    return { ok: false, error: "The AI declined to read this itinerary. Try trimming it or add plans by hand." };
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    return { ok: false, error: "The itinerary was too long to finish in one pass. Try importing a shorter part." };
  }

  const dayByDate = new Map(trip.days.map((d) => [d.date, d]));
  const time = (t: string | null) => (t && /^\d{2}:\d{2}$/.test(t) ? t : null);
  const rows = [];
  let skippedDays = 0;
  let dayCount = 0;

  for (const day of response.parsed_output.days) {
    const match = dayByDate.get(day.date);
    if (!match) {
      skippedDays++;
      continue;
    }
    dayCount++;
    // Fill in the day's greeting and summary only where they're still empty.
    const dayUpdate = {
      ...(!match.greeting && day.greeting ? { greeting: day.greeting } : {}),
      ...(!match.summary && day.summary ? { summary: day.summary } : {}),
    };
    if (Object.keys(dayUpdate).length > 0) {
      await supabase.from("days").update(dayUpdate).eq("id", match.id);
    }
    for (const plan of day.plans) {
      rows.push({
        day_id: match.id,
        title: plan.title.trim() || "Untitled plan",
        type: plan.type,
        start_time: time(plan.start_time),
        end_time: time(plan.end_time),
        address: plan.address,
        confirmation_number: plan.confirmation_number,
        notes: plan.notes,
      });
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("plans").insert(rows);
    if (error) {
      return { ok: false, error: "We couldn't save the imported plans. Try again." };
    }
  }

  const { input_tokens, output_tokens } = response.usage;
  const costUsd =
    (input_tokens * PRICE_PER_MILLION.input + output_tokens * PRICE_PER_MILLION.output) / 1_000_000;

  refresh();
  return {
    ok: true,
    planCount: rows.length,
    dayCount,
    skippedDays,
    costUsd,
    inputTokens: input_tokens,
    outputTokens: output_tokens,
  };
}
