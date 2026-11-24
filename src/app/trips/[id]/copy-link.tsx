"use client";

import { useState } from "react";

// The invite link in a read-only box, with a Copy button (or the phone's
// share sheet when there is one).
export function CopyLink({ url, tripName }: { url: string; tripName: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: tripName, text: `Here's our trip on MiTrip: ${tripName}`, url });
        return;
      } catch {
        // Closed the share sheet: fall back to copying.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={url}
        aria-label="Invite link"
        onFocus={(e) => e.currentTarget.select()}
        className="field min-w-0 flex-1 !text-[15px] text-muted"
      />
      <button type="button" onClick={share} className="btn btn-primary shrink-0">
        {copied ? "Copied" : "Share link"}
      </button>
    </div>
  );
}
