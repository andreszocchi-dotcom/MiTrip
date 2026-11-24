import { describe, expect, it } from "vitest";
import { dayRouteLinks, routeStops } from "@/lib/maps";

const decode = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe("day route in Google Maps", () => {
  it("keeps plan order, skips plans with no address, and drops repeated stops", () => {
    const stops = routeStops([
      { address: "Park Hyatt Sydney" },
      { address: null },
      { address: "park hyatt sydney " },
      { address: "Sydney Opera House" },
      { address: "  " },
      { address: "Bondi Beach" },
    ]);
    expect(stops).toEqual(["Park Hyatt Sydney", "Sydney Opera House", "Bondi Beach"]);
  });

  it("makes no route for a day with fewer than two stops", () => {
    expect(dayRouteLinks([])).toEqual([]);
    expect(dayRouteLinks(["Bondi Beach"])).toEqual([]);
  });

  it("starts at your location and visits every stop in order", () => {
    const [link] = dayRouteLinks(["A", "B", "C"]);
    const params = decode(link);
    expect(link.startsWith("https://www.google.com/maps/dir/?")).toBe(true);
    expect(params.origin).toBeUndefined();
    expect(params.waypoints).toBe("A|B");
    expect(params.destination).toBe("C");
    expect(params.travelmode).toBeUndefined();
  });

  it("splits a 12-stop day into two connected parts", () => {
    const stops = Array.from({ length: 12 }, (_, i) => `Stop ${i + 1}`);
    const links = dayRouteLinks(stops);
    expect(links).toHaveLength(2);

    const first = decode(links[0]);
    expect(first.origin).toBeUndefined();
    expect(first.waypoints.split("|")).toHaveLength(9);
    expect(first.destination).toBe("Stop 10");

    const second = decode(links[1]);
    expect(second.origin).toBe("Stop 10");
    expect(second.waypoints).toBe("Stop 11");
    expect(second.destination).toBe("Stop 12");
  });

  it("fits exactly 10 stops in one link", () => {
    const stops = Array.from({ length: 10 }, (_, i) => `Stop ${i + 1}`);
    expect(dayRouteLinks(stops)).toHaveLength(1);
  });
});
