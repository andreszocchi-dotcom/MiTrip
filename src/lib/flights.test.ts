import { describe, expect, it } from "vitest";
import { airlineOf, detectFlightNumber, flightOf, flightStatusUrl, formatFlight, parseFlightNumber } from "@/lib/flights";

describe("flights", () => {
  it("reads flight numbers the way people type them", () => {
    expect(parseFlightNumber("QF1")).toEqual({ code: "QF", number: "1" });
    expect(parseFlightNumber("qf 001")).toEqual({ code: "QF", number: "1" });
    expect(parseFlightNumber("NZ-104")).toEqual({ code: "NZ", number: "104" });
    expect(parseFlightNumber("u2 8251")).toEqual({ code: "U2", number: "8251" });
    expect(parseFlightNumber("Sydney")).toBeNull();
    expect(parseFlightNumber("")).toBeNull();
  });

  it("finds a flight number inside a title or notes, but only for known airlines", () => {
    expect(detectFlightNumber("SYD to AKL on NZ 104")).toEqual({ code: "NZ", number: "104" });
    expect(detectFlightNumber("Qantas QF1 to London")).toEqual({ code: "QF", number: "1" });
    // Airport codes and booking references aren't flights.
    expect(detectFlightNumber("SYD 2 AKL", "SOH-88213")).toBeNull();
  });

  it("uses the typed flight number first, then the plan's text, and only for flights", () => {
    expect(flightOf({ type: "flight", flight_number: "UA 870", title: "SFO to Sydney on QF 74" })).toEqual({ code: "UA", number: "870" });
    expect(flightOf({ type: "flight", flight_number: null, title: "SFO to Sydney", confirmation_number: "QF74" })).toEqual({ code: "QF", number: "74" });
    expect(flightOf({ type: "reservation", title: "Dinner at QF 1 Bistro" })).toBeNull();
  });

  it("builds the status link and finds the airline", () => {
    const flight = { code: "QF", number: "1" };
    expect(formatFlight(flight)).toBe("QF 1");
    expect(flightStatusUrl(flight)).toBe("https://www.google.com/search?q=QF1%20flight%20status");
    expect(airlineOf(flight)?.name).toBe("Qantas");
    expect(airlineOf({ code: "ZZ", number: "1" })).toBeNull();
  });
});
