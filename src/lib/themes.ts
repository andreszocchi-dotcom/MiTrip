// Trip colors (PLAN.md section 6). Each trip gets a color and an illustrated
// scene tied to the place (components/trip-scene.tsx).
// soft: light tint for surfaces. strong: accents. ink: text on the scene's
// sky. sky: the top color of the scene's sky, so text areas above a scene
// blend into it with no seam.
export const THEMES = {
  ocean: { label: "Ocean", soft: "#e3f0fb", strong: "#3b82c4", ink: "#1d4a78", sky: "#bcdcf8" },
  sand: { label: "Desert", soft: "#f6efe2", strong: "#a07a3f", ink: "#6e4a1c", sky: "#f9d9b0" },
  forest: { label: "Forest", soft: "#e5f3ea", strong: "#3f8a5a", ink: "#1f5434", sky: "#d3ecdc" },
  sunset: { label: "Sunset", soft: "#fbe9e3", strong: "#c8603f", ink: "#8a3520", sky: "#f7b9a6" },
  mountain: { label: "Mountain", soft: "#ebeef3", strong: "#5b6b82", ink: "#2d3a50", sky: "#c9d6ea" },
} as const;

export type ThemeName = keyof typeof THEMES;

export function themeOf(name: string) {
  return THEMES[name as ThemeName] ?? THEMES.ocean;
}
