// The MiTrip wordmark: a map pin dots the i in "Mi" and a dotted flight path
// arcs over to the dot on the i in "Trip". Letters are Geist Bold outlines,
// so the logo looks the same everywhere. Size it with a height class.
const PIN =
  "M103.4 43C95 33 90.4 26 90.4 18a13 13 0 0 1 26 0c0 8-4.6 15-13 25Zm0-20.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z";

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 -14 312 130" role="img" aria-label="MiTrip" className={className}>
      <path className="fill-accent" d="M7.4 100L7.4 29L27.7 29L45.8 80.7L63.8 29L84.1 29L84.1 100L68.9 100L68.9 54L52.2 99.8L39.2 99.8L22.6 54L22.6 100L7.4 100ZM95.9 100L95.9 46.4L110.9 46.4L110.9 100L95.9 100Z" />
      <path className="fill-foreground" d="M142.8 100L142.8 41.8L121.6 41.8L121.6 29L179.3 29L179.3 41.8L158.1 41.8L158.1 100L142.8 100ZM186.1 100L186.1 46.4L200.3 46.4L200.6 57.2Q202.2 51.5 205.3 48.9Q208.4 46.4 213.4 46.4L213.4 46.4L218.3 46.4L218.3 58.8L213.4 58.8Q207 58.8 204.1 61.4Q201.1 64 201.1 69.9L201.1 69.9L201.1 100L186.1 100ZM227.2 100L227.2 46.4L242.2 46.4L242.2 100L227.2 100ZM254.0 115L254.0 46.4L268.4 46.4L268.6 54.5Q270.9 50 275.0 47.6Q279.2 45.2 284.5 45.2L284.5 45.2Q291.8 45.2 296.9 48.8Q302 52.5 304.5 58.8Q307.1 65.2 307.1 73.2L307.1 73.2Q307.1 81.2 304.5 87.5Q301.9 93.9 296.8 97.5Q291.7 101.2 284.4 101.2L284.4 101.2Q279.4 101.2 275.3 98.9Q271.2 96.6 269 92.6L269 92.6L269 115L254.0 115ZM280.3 89.7Q285.6 89.7 288.6 85.3Q291.7 80.8 291.7 73.2L291.7 73.2Q291.7 65.6 288.6 61.1Q285.6 56.7 280.3 56.7L280.3 56.7Q275 56.7 272 60.9Q269 65.2 269 73.2L269 73.2Q269 81.2 271.9 85.5Q274.9 89.7 280.3 89.7L280.3 89.7Z" />
      <path className="fill-foreground" fillRule="evenodd" d={PIN} />
      <path
        className="stroke-accent"
        d="M116 6Q172-30 227 26"
        fill="none"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="0 10"
      />
      <circle className="fill-foreground" cx={234.7} cy={38.5} r={7.5} />
    </svg>
  );
}
