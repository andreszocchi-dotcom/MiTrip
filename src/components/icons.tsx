// Small line icons in one consistent style (2px strokes, rounded ends),
// sized with a class and colored with currentColor.
const PATHS = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  search: "M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14zM16.5 16.5L21 21",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  people: "M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.5a3.3 3.3 0 0 1 0 6.4M18 14.8c1.9.7 3.2 2.5 3.5 5.2",
  route: "M6 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4zM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  pencil: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  clock: "M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM12 7v5l3 2",
  pin: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z",
  ticket: "M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3zM14 4v16",
  hash: "M5 9h14M5 15h14M10 4L8 20M16 4l-2 16",
  plane: "M10.5 21l1.5-1 1.5 1v-3l-1.5-1v-4.5l7.5 2.5v-2l-7.5-4.5V4a1.5 1.5 0 0 0-3 0v4.5L1.5 13v2l7.5-2.5V17L7.5 18v3l3-1z",
  phone: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM11 18h2",
  wallet: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9h16M4 12h16M16 15.5h1.5",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
