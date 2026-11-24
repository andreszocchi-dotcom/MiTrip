import { ImageResponse } from "next/og";

// The MiTrip app icon: the logo's map pin and dotted flight path in white on
// the MiTrip blue. Drawn full-bleed and square; iPhones round the corners.
const PIN =
  "M103.4 43C95 33 90.4 26 90.4 18a13 13 0 0 1 26 0c0 8-4.6 15-13 25Zm0-20.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z";

export function appIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(145deg, #5aa3e6 0%, #3b82c4 45%, #2a66a3 100%)",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 180 180">
          {/* Flight path arcing from the pin to the destination dot */}
          <path
            d="M66 57 Q104 11 130 75"
            fill="none"
            stroke="white"
            strokeOpacity="0.95"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="0 15"
          />
          <circle cx="131" cy="89" r="10" fill="white" />
          <path d={PIN} fill="white" fillRule="evenodd" transform="translate(-150 53) scale(2.1)" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
