import type { CSSProperties } from "react";

// Trip colors (PLAN.md section 6). Each trip gets a color and an illustrated
// scene tied to the place (components/trip-scene.tsx).
// soft: light tint for surfaces. strong: accents. ink: text on the scene's
// sky. sky: the top color of the scene's sky, so text areas above a scene
// blend into it with no seam. night: the same roles in dark mode, matching
// the scene's night version.
export const THEMES = {
  ocean: {
    label: "Ocean",
    soft: "#e3f0fb",
    strong: "#3b82c4",
    ink: "#1d4a78",
    sky: "#bcdcf8",
    night: { soft: "#102236", strong: "#6aaef0", ink: "#dcebfc", sky: "#0b1a33" },
  },
  sand: {
    label: "Desert",
    soft: "#f6efe2",
    strong: "#a07a3f",
    ink: "#6e4a1c",
    sky: "#f9d9b0",
    night: { soft: "#2a2116", strong: "#e0b36b", ink: "#f7e3c4", sky: "#1b1430" },
  },
  forest: {
    label: "Forest",
    soft: "#e5f3ea",
    strong: "#3f8a5a",
    ink: "#1f5434",
    sky: "#d3ecdc",
    night: { soft: "#12241b", strong: "#72c595", ink: "#d3ecdd", sky: "#0a1a16" },
  },
  sunset: {
    label: "Sunset",
    soft: "#fbe9e3",
    strong: "#c8603f",
    ink: "#8a3520",
    sky: "#f7b9a6",
    night: { soft: "#2c1915", strong: "#f08d6b", ink: "#fcd8ca", sky: "#24122e" },
  },
  mountain: {
    label: "Mountain",
    soft: "#ebeef3",
    strong: "#5b6b82",
    ink: "#2d3a50",
    sky: "#c9d6ea",
    night: { soft: "#171e2c", strong: "#9bb0cf", ink: "#dbe3f0", sky: "#0c1324" },
  },
  city: {
    label: "City",
    soft: "#eeebf9",
    strong: "#6a5cb8",
    ink: "#352c6e",
    sky: "#c3bcee",
    night: { soft: "#1b1836", strong: "#a698f5", ink: "#e0dbff", sky: "#100d2a" },
  },
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName];

export function themeOf(name: string): Theme {
  return THEMES[name as ThemeName] ?? THEMES.ocean;
}

// A trip's day and night colors as CSS variables. Put tripScope(theme) on
// an element (className and style), and inside it use T.sky, T.ink, T.soft,
// and T.strong: they switch to the night colors in dark mode.
export function tripScope(theme: Theme): { className: string; style: CSSProperties } {
  return {
    className: "t-scope",
    style: {
      ["--t-sky" as string]: theme.sky,
      ["--t-ink" as string]: theme.ink,
      ["--t-soft" as string]: theme.soft,
      ["--t-strong" as string]: theme.strong,
      ["--t-sky-n" as string]: theme.night.sky,
      ["--t-ink-n" as string]: theme.night.ink,
      ["--t-soft-n" as string]: theme.night.soft,
      ["--t-strong-n" as string]: theme.night.strong,
    },
  };
}

export const T = {
  sky: "var(--tc-sky)",
  ink: "var(--tc-ink)",
  soft: "var(--tc-soft)",
  strong: "var(--tc-strong)",
} as const;
