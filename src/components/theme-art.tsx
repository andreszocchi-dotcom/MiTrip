import { themeOf } from "@/lib/themes";

// Soft line drawings for each trip color (stranger test idea: "waves for
// ocean, dunes for sand"). One stroke color, thin lines, low contrast, so the
// scene sits quietly along the bottom of a trip card or header.
const SCENES: Record<string, React.ReactNode> = {
  ocean: (
    <>
      <path d="M0 70 Q25 58 50 70 T100 70 T150 70 T200 70 T250 70 T300 70 T350 70 T400 70" />
      <path d="M0 88 Q25 76 50 88 T100 88 T150 88 T200 88 T250 88 T300 88 T350 88 T400 88" opacity="0.7" />
      <path d="M0 106 Q25 94 50 106 T100 106 T150 106 T200 106 T250 106 T300 106 T350 106 T400 106" opacity="0.45" />
      <path d="M318 40 q6 -6 12 0 q6 -6 12 0" />
      <path d="M290 24 q5 -5 10 0 q5 -5 10 0" opacity="0.7" />
    </>
  ),
  sand: (
    <>
      <circle cx="320" cy="38" r="16" />
      <path d="M0 96 C60 60 120 60 180 92 S300 120 400 78" />
      <path d="M0 116 C80 86 160 84 240 108 S360 118 400 104" opacity="0.6" />
      <path d="M70 70 v-22 M70 56 q-8 0 -8 -8 M70 60 q8 0 8 -8" opacity="0.8" />
    </>
  ),
  forest: (
    <>
      {[
        [220, 40, 1],
        [252, 56, 0.75],
        [284, 32, 1],
        [318, 52, 0.75],
        [350, 38, 1],
        [380, 60, 0.6],
      ].map(([x, top, o]) => (
        <g key={x} opacity={o}>
          <path d={`M${x} ${top} L${x - 16} 112 L${x + 16} 112 Z`} />
          <path d={`M${x} 112 v8`} />
        </g>
      ))}
      <path d="M0 114 H400" opacity="0.5" />
    </>
  ),
  sunset: (
    <>
      <path d="M260 100 a50 50 0 0 1 100 0" />
      {[-60, -30, 0, 30, 60].map((angle) => (
        <path
          key={angle}
          d="M310 38 v-16"
          transform={`rotate(${angle} 310 100)`}
          opacity="0.7"
        />
      ))}
      <path d="M0 100 H400" />
      <path d="M40 112 H180 M220 112 H380" opacity="0.5" />
    </>
  ),
  mountain: (
    <>
      <path d="M150 116 L240 36 L290 80 L330 48 L400 112" />
      <path d="M222 52 L240 36 L258 52 L248 48 L240 56 L232 48 Z" opacity="0.7" />
      <path d="M0 116 L70 74 L120 100 L170 80" opacity="0.5" />
    </>
  ),
};

export function ThemeArt({ theme, className = "" }: { theme: string; className?: string }) {
  const scene = SCENES[theme] ?? SCENES.ocean;
  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      fill="none"
      stroke={themeOf(theme).strong}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g opacity="0.55">{scene}</g>
    </svg>
  );
}
