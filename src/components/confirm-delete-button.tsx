"use client";

import { useState } from "react";

// Deleting is a two-step tap: the first button asks "Are you sure?".
export function ConfirmDeleteButton({
  action,
  label,
  warning,
}: {
  action: () => Promise<void>;
  label: string;
  warning: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn btn-danger flex-1"
      >
        {label}
      </button>
    );
  }

  return (
    <div role="alertdialog" className="w-full rounded-[22px] bg-[#fdecec] p-5 text-[#7a1a12]">
      <p className="font-medium">Are you sure?</p>
      <p className="mt-1 text-sm">{warning}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="btn flex-1 bg-surface text-foreground"
        >
          Cancel
        </button>
        <form action={action} className="flex-1">
          <button
            type="submit"
            className="btn w-full bg-[#d92d20] text-white hover:bg-[#b42318]"
          >
            Yes, delete
          </button>
        </form>
      </div>
    </div>
  );
}
