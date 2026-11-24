"use client";

import { useState } from "react";

// Opens the phone's or computer's print screen, where "Save to Files" (iPhone)
// or "Save as PDF" (computer) turns the page into a PDF. It first waits (up
// to 20 seconds) for PDF tickets that are still being drawn as images, so
// they make it into the saved file.
export function PrintButton({ color }: { color: string }) {
  const [waiting, setWaiting] = useState(false);

  async function print() {
    const stillLoading = () => document.querySelector("[data-ticket-loading]") !== null;
    if (stillLoading()) {
      setWaiting(true);
      const started = Date.now();
      while (stillLoading() && Date.now() - started < 20_000) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setWaiting(false);
    }
    window.print();
  }

  return (
    <button
      type="button"
      onClick={print}
      disabled={waiting}
      className="btn w-full text-white print:hidden"
      style={{ backgroundColor: color }}
    >
      {waiting ? "Getting tickets ready…" : "Save as PDF"}
    </button>
  );
}
