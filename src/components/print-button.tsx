"use client";

// Opens the phone's or computer's print screen, where "Save to Files" (iPhone)
// or "Save as PDF" (computer) turns the page into a PDF.
export function PrintButton({ color }: { color: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full rounded-xl px-4 py-3 text-base font-semibold text-white print:hidden"
      style={{ backgroundColor: color }}
    >
      Save as PDF
    </button>
  );
}
