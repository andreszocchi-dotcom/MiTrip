"use client";

import { useRef, useState } from "react";
import { saveTicketImage } from "@/app/trips/ticket-actions";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 10 * 1024 * 1024; // matches the bucket's 10 MB limit

// "Add ticket" / "Replace ticket": picks a photo, screenshot, or PDF (like a
// boarding pass) and uploads it straight to the private tickets bucket.
export function TicketUpload({
  tripId,
  planId,
  hasTicket,
}: {
  tripId: number;
  planId: number;
  hasTicket: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function upload(file: File) {
    setError(undefined);
    // Some phones report a PDF with no type, so the file name counts too.
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf && !file.type.startsWith("image/")) {
      setError("Please choose a photo, screenshot, or PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 10 MB. Try a screenshot instead.");
      return;
    }
    setBusy(true);
    const ext = isPdf ? "pdf" : (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${tripId}/${planId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await createClient()
      .storage.from("tickets")
      .upload(path, file, { contentType: isPdf ? "application/pdf" : file.type });
    const result = uploadError
      ? { error: "The upload didn't go through. Check your connection and try again." }
      : await saveTicketImage(tripId, planId, path);
    setBusy(false);
    if (result.error) setError(result.error);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="mt-4">
      <input
        ref={input}
        type="file"
        accept="image/*,application/pdf,.pdf"
        className="sr-only"
        id={`ticket-${planId}`}
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      <label
        htmlFor={`ticket-${planId}`}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-dashed border-accent/50 px-4 py-3.5 text-center text-base font-medium text-accent transition-colors hover:bg-accent-soft/50"
      >
        <Icon name="ticket" className="h-5 w-5" />
        {busy ? "Uploading…" : hasTicket ? "Replace ticket" : "Add ticket (photo or PDF)"}
      </label>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
