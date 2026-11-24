import { describe, expect, it } from "vitest";
import { dayPlace, readPlace, shortPlace, todayIn } from "@/lib/places";
import { describeWeather } from "@/lib/weather";
import { tripCountdown } from "@/lib/dates";

const sydney = { place_name: "Sydney, Australia", latitude: -33.87, longitude: 151.21, timezone: "Australia/Sydney" };
const none = { place_name: null, latitude: null, longitude: null, timezone: null };

describe("places and time zones", () => {
  it("uses the day's own place, or else the trip's", () => {
    const queenstown = { place_name: "Queenstown, New Zealand", latitude: -45.03, longitude: 168.66, timezone: "Pacific/Auckland" };
    expect(dayPlace(queenstown, sydney)?.place_name).toBe("Queenstown, New Zealand");
    expect(dayPlace(none, sydney)?.place_name).toBe("Sydney, Australia");
    expect(dayPlace(none, none)).toBeNull();
    expect(shortPlace(sydney)).toBe("Sydney");
  });

  it("knows it's already tomorrow in Sydney when it's evening in California", () => {
    // 8 PM on Jan 9 in Los Angeles is 3 PM on Jan 10 in Sydney.
    const now = new Date("2027-01-10T04:00:00Z");
    expect(todayIn("America/Los_Angeles", now)).toBe("2027-01-09");
    expect(todayIn("Australia/Sydney", now)).toBe("2027-01-10");
    // So a trip starting Jan 10 is "Happening now" by Sydney's date.
    expect(tripCountdown("2027-01-10", "2027-01-20", todayIn("Australia/Sydney", now))).toBe("Happening now");
    expect(tripCountdown("2027-01-10", "2027-01-20", todayIn("America/Los_Angeles", now))).toBe("Tomorrow");
  });

  it("only accepts a complete, sensible place from the form", () => {
    const form = (fields: Record<string, string>) => {
      const f = new FormData();
      Object.entries(fields).forEach(([k, v]) => f.set(k, v));
      return f;
    };
    expect(readPlace(form({ place_name: "Sydney, Australia", latitude: "-33.87", longitude: "151.21", timezone: "Australia/Sydney" }))).toEqual(sydney);
    expect(readPlace(form({ place_name: "Sydney", latitude: "-33.87", longitude: "151.21", timezone: "Not/AZone" }))).toBeNull();
    expect(readPlace(form({ place_name: "Sydney", latitude: "123", longitude: "151.21", timezone: "Australia/Sydney" }))).toBeNull();
    expect(readPlace(form({ place_name: "", latitude: "1", longitude: "1", timezone: "UTC" }))).toBeNull();
  });

  it("turns weather codes into an icon and words", () => {
    expect(describeWeather(0).label).toBe("Clear");
    expect(describeWeather(63).label).toBe("Rain");
    expect(describeWeather(96).label).toBe("Thunderstorms");
  });
});
