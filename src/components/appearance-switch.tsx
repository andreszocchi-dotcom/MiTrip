"use client";

import { useSyncExternalStore } from "react";

// Auto (follow the phone), Light, or Dark. The choice lives on this device
// (localStorage) and shows as data-theme on <html>, which globals.css reads.
// THEME_SCRIPT applies it before the page paints, so there's no flash.
export const THEME_KEY = "mitrip-theme";
type Choice = "auto" | "light" | "dark";

const STATUS_BAR = { light: "#f5f5f7", dark: "#000000" };

// Runs in <head> before anything paints (kept tiny and dependency-free).
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",t==="dark"?"${STATUS_BAR.dark}":"${STATUS_BAR.light}")})})}}catch(e){}})();`;

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function read(): Choice {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "auto";
  } catch {
    return "auto";
  }
}

function apply(choice: Choice) {
  try {
    if (choice === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Storage blocked: the switch still works until the page reloads.
  }
  const root = document.documentElement;
  if (choice === "auto") delete root.dataset.theme;
  else root.dataset.theme = choice;
  // The phone's status bar color follows the choice too.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const media = meta.getAttribute("media") ?? "";
    const forMode = choice === "auto" ? (media.includes("dark") ? "dark" : "light") : choice;
    meta.setAttribute("content", STATUS_BAR[forMode]);
  });
  listeners.forEach((l) => l());
}

const OPTIONS: { value: Choice; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// A small segmented control, like the ones in iOS Settings.
export function AppearanceSwitch() {
  const choice = useSyncExternalStore(subscribe, read, () => "auto" as const);
  return (
    <div role="radiogroup" aria-label="Appearance" className="inline-flex rounded-full bg-foreground/[0.06] p-0.5">
      {OPTIONS.map((option) => {
        const active = choice === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => apply(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              active ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
