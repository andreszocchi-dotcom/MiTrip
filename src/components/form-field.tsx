// Shared pieces for forms: input styling that turns red on a problem, and
// the friendly message shown under a field.

export function inputClass(hasError?: boolean) {
  return `rounded-xl border bg-surface px-4 py-3 text-base font-normal outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-black/10 focus:border-accent focus:ring-accent-soft"
  }`;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-normal text-red-700">
      {message}
    </p>
  );
}

// Props that link an input to its message for screen readers.
export function errorProps(name: string, message?: string) {
  return message
    ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` }
    : {};
}
