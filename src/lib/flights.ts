// Flights: airline lookup, flight number detection, and the links shown on
// flight plans (live status and the airline's own app or site).

type Airline = { name: string; url: string };

// Common airlines by IATA code, linking to each airline's site. On an iPhone
// with the airline's app installed, iOS usually opens the app instead.
export const AIRLINES: Record<string, Airline> = {
  AA: { name: "American", url: "https://www.aa.com" },
  AC: { name: "Air Canada", url: "https://www.aircanada.com" },
  AF: { name: "Air France", url: "https://www.airfrance.com" },
  AM: { name: "Aeroméxico", url: "https://aeromexico.com" },
  AS: { name: "Alaska", url: "https://www.alaskaair.com" },
  AV: { name: "Avianca", url: "https://www.avianca.com" },
  AZ: { name: "ITA Airways", url: "https://www.ita-airways.com" },
  B6: { name: "JetBlue", url: "https://www.jetblue.com" },
  BA: { name: "British Airways", url: "https://www.britishairways.com" },
  CM: { name: "Copa", url: "https://www.copaair.com" },
  CX: { name: "Cathay Pacific", url: "https://www.cathaypacific.com" },
  DL: { name: "Delta", url: "https://www.delta.com" },
  EK: { name: "Emirates", url: "https://www.emirates.com" },
  EY: { name: "Etihad", url: "https://www.etihad.com" },
  F9: { name: "Frontier", url: "https://www.flyfrontier.com" },
  FR: { name: "Ryanair", url: "https://www.ryanair.com" },
  HA: { name: "Hawaiian", url: "https://www.hawaiianairlines.com" },
  IB: { name: "Iberia", url: "https://www.iberia.com" },
  JL: { name: "Japan Airlines", url: "https://www.jal.co.jp" },
  JQ: { name: "Jetstar", url: "https://www.jetstar.com" },
  KL: { name: "KLM", url: "https://www.klm.com" },
  LA: { name: "LATAM", url: "https://www.latamairlines.com" },
  LH: { name: "Lufthansa", url: "https://www.lufthansa.com" },
  LX: { name: "Swiss", url: "https://www.swiss.com" },
  NH: { name: "ANA", url: "https://www.ana.co.jp" },
  NK: { name: "Spirit", url: "https://www.spirit.com" },
  NZ: { name: "Air New Zealand", url: "https://www.airnewzealand.com" },
  QF: { name: "Qantas", url: "https://www.qantas.com" },
  QR: { name: "Qatar Airways", url: "https://www.qatarairways.com" },
  SQ: { name: "Singapore Airlines", url: "https://www.singaporeair.com" },
  TK: { name: "Turkish Airlines", url: "https://www.turkishairlines.com" },
  TP: { name: "TAP Air Portugal", url: "https://www.flytap.com" },
  U2: { name: "easyJet", url: "https://www.easyjet.com" },
  UA: { name: "United", url: "https://www.united.com" },
  VA: { name: "Virgin Australia", url: "https://www.virginaustralia.com" },
  VS: { name: "Virgin Atlantic", url: "https://www.virginatlantic.com" },
  WN: { name: "Southwest", url: "https://www.southwest.com" },
};

// An airline code (two letters, or a letter and a digit) and 1-4 digits,
// with an optional space or dash: "QF1", "QF 1", "NZ-104", "u2 8251".
const FLIGHT_PATTERN = /\b([A-Z][A-Z0-9]|[0-9][A-Z])\s?-?(\d{1,4})\b/g;

export type FlightNumber = { code: string; number: string };

// "qf 001" -> { code: "QF", number: "1" }, or null if it isn't a flight
// number. Any airline code is accepted when the user types it themselves.
export function parseFlightNumber(text: string | null | undefined): FlightNumber | null {
  const match = text?.trim().toUpperCase().match(/^([A-Z][A-Z0-9]|[0-9][A-Z])\s?-?(\d{1,4})[A-Z]?$/);
  if (!match) return null;
  return { code: match[1], number: String(Number(match[2])) };
}

// Finds a flight number written inside other text ("SYD to AKL on NZ 104").
// Only known airline codes count here, so "SYD 2" or a booking reference
// isn't mistaken for a flight.
export function detectFlightNumber(...texts: (string | null | undefined)[]): FlightNumber | null {
  for (const text of texts) {
    if (!text) continue;
    for (const match of text.toUpperCase().matchAll(FLIGHT_PATTERN)) {
      if (AIRLINES[match[1]]) return { code: match[1], number: String(Number(match[2])) };
    }
  }
  return null;
}

// The flight number for a plan: the one typed in, else one found in its
// title, confirmation, or notes.
export function flightOf(plan: {
  type: string;
  flight_number?: string | null;
  title: string;
  confirmation_number?: string | null;
  notes?: string | null;
}): FlightNumber | null {
  if (plan.type !== "flight") return null;
  return parseFlightNumber(plan.flight_number) ?? detectFlightNumber(plan.title, plan.confirmation_number, plan.notes);
}

export function formatFlight(flight: FlightNumber) {
  return `${flight.code} ${flight.number}`;
}

// Google's live flight status card: on time or delayed, times, terminal,
// and gate. Free, with no account or API.
export function flightStatusUrl(flight: FlightNumber) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${flight.code}${flight.number} flight status`)}`;
}

export function airlineOf(flight: FlightNumber): Airline | null {
  return AIRLINES[flight.code] ?? null;
}
