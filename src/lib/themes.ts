// Trip colors (PLAN.md section 6): each trip gets a light color tied to the
// place, used to tint its card and header.
export const THEMES = {
  ocean: { label: "Ocean", soft: "#e3f0fb", strong: "#3b82c4" },
  sand: { label: "Sand", soft: "#f6efe2", strong: "#a07a3f" },
  forest: { label: "Forest", soft: "#e5f3ea", strong: "#3f8a5a" },
  sunset: { label: "Sunset", soft: "#fbe9e3", strong: "#c8603f" },
  mountain: { label: "Mountain", soft: "#ebeef3", strong: "#5b6b82" },
} as const;

export type ThemeName = keyof typeof THEMES;

export function themeOf(name: string) {
  return THEMES[name as ThemeName] ?? THEMES.ocean;
}
