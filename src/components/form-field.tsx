// Shared pieces for forms: input styling that turns red on a problem, and
// the friendly message shown under a field.

export function inputClass(hasError?: boolean) {
  return hasError ? "field field-error" : "field";
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-normal text-danger">
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
