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
        className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700"
      >
        {label}
      </button>
    );
  }

  return (
    <div role="alertdialog" className="w-full rounded-2xl bg-red-50 p-4 text-red-800">
      <p className="font-medium">Are you sure?</p>
      <p className="mt-1 text-sm">{warning}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 rounded-xl bg-surface px-4 py-3 text-base font-medium text-foreground ring-1 ring-black/10"
        >
          Cancel
        </button>
        <form action={action} className="flex-1">
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-base font-medium text-white"
          >
            Yes, delete
          </button>
        </form>
      </div>
    </div>
  );
}
