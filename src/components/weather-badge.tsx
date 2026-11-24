"use client";

import { useSyncExternalStore } from "react";
import { describeWeather, type DayWeather } from "@/lib/weather";

// Celsius by default; tapping any temperature switches every temperature to
// Fahrenheit (and back), and the phone remembers the choice.
const KEY = "mitrip-temp-unit";
const listeners = new Set<() => void>();

function readUnit(): "C" | "F" {
  try {
    return localStorage.getItem(KEY) === "F" ? "F" : "C";
  } catch {
    return "C";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toggleUnit() {
  try {
    localStorage.setItem(KEY, readUnit() === "C" ? "F" : "C");
  } catch {
    // Storage blocked: the switch just won't stick.
  }
  listeners.forEach((l) => l());
}

function useUnit() {
  return useSyncExternalStore(subscribe, readUnit, () => "C" as const);
}

function degrees(celsius: number, unit: "C" | "F") {
  return Math.round(unit === "C" ? celsius : (celsius * 9) / 5 + 32);
}

// "☀️ 25° / 18°" with an optional rain chance. size "large" is the day page
// pill; "small" fits a row in the trip's day list.
export function WeatherBadge({
  weather,
  size = "large",
  className = "",
}: {
  weather: DayWeather;
  size?: "large" | "small";
  className?: string;
}) {
  const unit = useUnit();
  const { icon, label } = describeWeather(weather.code);
  const high = degrees(weather.high, unit);
  const low = degrees(weather.low, unit);

  if (size === "small") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleUnit();
        }}
        title={`${label}, high ${high}°${unit}, low ${low}°${unit}. Tap to switch °C/°F.`}
        className={`inline-flex items-center gap-1 tabular-nums ${className}`}
      >
        <span aria-hidden="true">{icon}</span>
        {high}°
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleUnit}
      title="Tap to switch °C/°F"
      className={`inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-1.5 text-[15px] backdrop-blur transition-colors hover:bg-white/75 dark:bg-white/10 dark:hover:bg-white/15 ${className}`}
    >
      <span aria-hidden="true" className="text-lg">
        {icon}
      </span>
      <span className="font-semibold tabular-nums">
        {high}° <span className="font-normal opacity-70">/ {low}°{unit}</span>
      </span>
      <span className="opacity-75">{label}</span>
      {weather.rainChance !== null && weather.rainChance >= 20 && (
        <span className="opacity-75">· {weather.rainChance}% rain</span>
      )}
    </button>
  );
}
