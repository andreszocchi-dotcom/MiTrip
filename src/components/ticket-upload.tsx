"use client";

import { useRef, useState } from "react";
import { saveTicketImage } from "@/app/trips/ticket-actions";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 10 * 1024 * 1024; // matches the bucket's 10 MB limit

// "Add ticket photo" / "Replace photo": opens the phone's camera roll, then
// uploads straight to the private tickets bucket.
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
    if (!file.type.startsWith("image/")) {
      setError("Please choose a photo or screenshot.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 10 MB. Try a screenshot instead.");
      return;
    }
    setBusy(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${tripId}/${planId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await createClient()
      .storage.from("tickets")
      .upload(path, file, { contentType: file.type });
    const result = uploadError
      ? { error: "The upload didn't go through. Check your connection and try again." }
      : await saveTicketImage(tripId, planId, path);
    setBusy(false);
    if (result.error) setError(result.error);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="mt-5">
      <input
        ref={input}
        type="file"
        accept="image/*"
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
        className="block cursor-pointer rounded-xl border border-dashed border-accent/50 px-4 py-3 text-center text-base font-medium text-accent"
      >
        {busy ? "Uploading…" : hasTicket ? "Replace ticket photo" : "📷 Add ticket photo"}
      </label>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
