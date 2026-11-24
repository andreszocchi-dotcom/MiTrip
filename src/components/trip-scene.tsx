// Illustrated landscapes for each trip color. Every scene is drawn in code as
// layered SVG (sky, light, distance, foreground) on a 800x400 canvas and
// anchored to the bottom, so it can fill a phone card, a full-width header,
// or a small swatch. Gentle motion (waves, fog, clouds, shimmer) uses the
// scene-* animations in globals.css and stops under "reduce motion".

type SceneProps = { uid: string };

const W = 800;
const H = 400;

// A repeatable "random" number in [0, 1) from integer math only, so the
// server and the browser draw exactly the same trees, buildings, and windows
// (Math.sin can differ in the last digit between the two).
function hash(n: number) {
  let t = (Math.round(n * 1000) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// One decimal place is plenty for drawing and keeps markup identical.
const r1 = (n: number) => Math.round(n * 10) / 10;

// A rolling wave band from y down to the bottom, twice as wide as the canvas
// (plus one wavelength) so it can drift sideways forever without a seam.
function wavePath(y: number, amp: number, wavelength: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x < W * 2 + wavelength; x += wavelength) {
    d += ` q${wavelength / 4} ${-amp} ${wavelength / 2} 0 t${wavelength / 2} 0`;
  }
  return `${d} V${H} H0 Z`;
}

// The crest line of the same wave, for a thin foam highlight.
function crestPath(y: number, amp: number, wavelength: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x < W * 2 + wavelength; x += wavelength) {
    d += ` q${wavelength / 4} ${-amp} ${wavelength / 2} 0 t${wavelength / 2} 0`;
  }
  return d;
}

// A pine tree silhouette: three stacked tiers on a short trunk.
function pine(x: number, base: number, h: number) {
  const w = h * 0.24;
  return (
    `M${x} ${base - h}` +
    `L${x + w * 0.55} ${base - h * 0.64}L${x + w * 0.32} ${base - h * 0.64}` +
    `L${x + w * 0.8} ${base - h * 0.3}L${x + w * 0.5} ${base - h * 0.3}` +
    `L${x + w} ${base - h * 0.04}L${x + w * 0.12} ${base - h * 0.04}L${x + w * 0.12} ${base}` +
    `L${x - w * 0.12} ${base}L${x - w * 0.12} ${base - h * 0.04}L${x - w} ${base - h * 0.04}` +
    `L${x - w * 0.5} ${base - h * 0.3}L${x - w * 0.8} ${base - h * 0.3}` +
    `L${x - w * 0.32} ${base - h * 0.64}L${x - w * 0.55} ${base - h * 0.64}Z`
  );
}

// A ridge of pines on a soft hill. Heights vary in a fixed pattern (no
// randomness), so the server and browser draw the same trees.
function forestLayer(baseY: number, hillAmp: number, treeH: number, spacing: number, phase: number) {
  const hill = (x: number) =>
    r1(baseY - Math.sin((x + phase) / 140) * hillAmp - Math.sin((x + phase) / 53) * hillAmp * 0.3);
  let d = `M0 ${hill(0)}`;
  for (let x = 0; x <= W; x += 20) d += `L${x} ${hill(x)}`;
  d += `V${H}H0Z`;
  for (let x = -spacing / 2 + (phase % spacing); x < W + spacing; x += spacing) {
    const h = r1(treeH * (0.7 + 0.3 * hash(x + phase)));
    d += pine(x, hill(x) + 6, h);
  }
  return d;
}

function Birds({ x, y, scale = 1, color }: { x: number; y: number; scale?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" className="scene-glide">
      <path d="M0 0 q6 -6 12 0 q6 -6 12 0" />
      <path d="M30 -14 q5 -5 10 0 q5 -5 10 0" opacity={0.8} />
      <path d="M-18 -22 q4 -4 8 0 q4 -4 8 0" opacity={0.6} />
    </g>
  );
}

function Cloud({ x, y, s = 1, opacity = 0.9 }: { x: number; y: number; s?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity={opacity}>
      <ellipse cx="0" cy="0" rx="46" ry="14" />
      <ellipse cx="-18" cy="-8" rx="22" ry="14" />
      <ellipse cx="12" cy="-12" rx="26" ry="18" />
    </g>
  );
}

function Ocean({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcdcf8" />
          <stop offset="0.62" stopColor="#eaf4fd" />
          <stop offset="1" stopColor="#fdf6e8" />
        </linearGradient>
        <radialGradient id={id("sun")} cx="0.74" cy="0.3" r="0.32">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.25" stopColor="#fff3d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("sea1")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb6e6" />
          <stop offset="1" stopColor="#4a8fd0" />
        </linearGradient>
        <linearGradient id={id("sea2")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b91d3" />
          <stop offset="1" stopColor="#2f72b6" />
        </linearGradient>
        <linearGradient id={id("sea3")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f74b8" />
          <stop offset="1" stopColor="#1b4f86" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <rect width={W} height={H} fill={`url(#${id("sun")})`} />
      <circle cx="592" cy="118" r="30" fill="#fffdf6" />
      <g className="scene-sway-slow">
        <Cloud x={190} y={92} s={1.1} />
        <Cloud x={420} y={58} s={0.7} opacity={0.75} />
      </g>
      <Birds x={250} y={150} color="#5d86ad" />
      {/* Far islands on the horizon */}
      <path d="M-10 236 Q60 200 130 222 Q170 206 220 236 Z" fill="#9ec3e4" />
      <path d="M640 236 Q700 214 770 226 Q800 222 820 236 Z" fill="#a9cbe8" />
      <rect y="234" width={W} height={H - 234} fill={`url(#${id("sea1")})`} />
      {/* The sun's path on the water */}
      <g fill="#ffffff" className="scene-shimmer">
        <rect x="560" y="246" width="64" height="3" rx="1.5" opacity="0.9" />
        <rect x="548" y="256" width="88" height="3" rx="1.5" opacity="0.7" />
        <rect x="570" y="266" width="44" height="3" rx="1.5" opacity="0.8" />
        <rect x="540" y="277" width="104" height="3" rx="1.5" opacity="0.5" />
      </g>
      {/* Sailboat, gently bobbing */}
      <g transform="translate(300 262)">
        <g className="scene-bob">
          <path d="M0 -4 L0 -58 L30 -8 Z" fill="#ffffff" />
          <path d="M-3 -8 L-3 -46 L-24 -8 Z" fill="#f4f8fc" />
          <path d="M-30 -2 L32 -2 L24 10 L-22 10 Z" fill="#1f4f80" />
        </g>
      </g>
      <g className="scene-drift-slow">
        <path d={wavePath(282, 7, 200)} fill={`url(#${id("sea2")})`} opacity="0.9" />
        <path d={crestPath(282, 7, 200)} stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" fill="none" />
      </g>
      <g className="scene-drift">
        <path d={wavePath(322, 10, 160)} fill={`url(#${id("sea3")})`} />
        <path d={crestPath(322, 10, 160)} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" fill="none" />
      </g>
      <g className="scene-drift-fast">
        <path d={wavePath(362, 12, 200)} fill="#173f6d" />
        <path d={crestPath(362, 12, 200)} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2.5" fill="none" />
      </g>
    </>
  );
}

const CAMEL =
  "M2 24 L4 14 Q6 8 12 9 Q15 2 19 8 Q22 3 26 9 Q30 10 31 14 L36 8 Q38 5 41 7 L41 9 L38 10 L34 17 L34 24 L32 24 L31 18 L27 19 L27 24 L25 24 L24 19 L13 19 L12 24 L10 24 L9 18 L6 24 Z";

function Sand({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9d9b0" />
          <stop offset="0.55" stopColor="#fcecd4" />
          <stop offset="1" stopColor="#fdf3e4" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.68" cy="0.36" r="0.4">
          <stop offset="0" stopColor="#fff1cf" />
          <stop offset="0.3" stopColor="#ffdca3" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffdca3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("d1")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c88f" />
          <stop offset="1" stopColor="#e3b272" />
        </linearGradient>
        <linearGradient id={id("d2")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6b06b" />
          <stop offset="1" stopColor="#cf9250" />
        </linearGradient>
        <linearGradient id={id("d3")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4974f" />
          <stop offset="1" stopColor="#b47436" />
        </linearGradient>
        <linearGradient id={id("d4")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bb7c3b" />
          <stop offset="1" stopColor="#8d5824" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <rect width={W} height={H} fill={`url(#${id("glow")})`} />
      <circle cx="544" cy="150" r="70" fill="#fff4dc" opacity="0.22" className="scene-pulse" />
      <circle cx="544" cy="150" r="52" fill="#fff4dc" opacity="0.35" />
      <circle cx="544" cy="150" r="40" fill="#ffe8b8" />
      <Birds x={190} y={120} color="#b98a52" scale={0.9} />
      {/* Distant mesas */}
      <path d="M0 238 L40 238 L52 214 L120 214 L132 238 L300 238 L310 222 L350 222 L360 238 L800 238 V260 H0 Z" fill="#efcfa2" />
      <path d={`M0 250 C120 214 220 214 330 244 S560 268 800 226 V${H} H0 Z`} fill={`url(#${id("d1")})`} />
      {/* A caravan crossing the far dune */}
      <g fill="#a7703a" opacity="0.8">
        <path d={CAMEL} transform="translate(468 226) scale(0.62)" />
        <path d={CAMEL} transform="translate(500 229) scale(0.55)" />
        <path d={CAMEL} transform="translate(528 232) scale(0.5)" />
      </g>
      <path d={`M0 300 C140 248 260 252 380 286 S620 320 800 262 V${H} H0 Z`} fill={`url(#${id("d2")})`} />
      <path d="M0 300 C140 248 260 252 380 286" stroke="#f6d7a6" strokeWidth="3" fill="none" opacity="0.8" />
      <path d={`M0 350 C120 318 230 316 360 340 S600 360 800 316 V${H} H0 Z`} fill={`url(#${id("d3")})`} />
      <path d="M360 340 C480 358 600 360 800 316" stroke="#e8b472" strokeWidth="3" fill="none" opacity="0.7" />
      <path d={`M0 400 L0 384 C160 356 300 360 460 382 S700 394 800 372 V${H} Z`} fill={`url(#${id("d4")})`} />
      {/* Wind lifting sand off the crests */}
      <g stroke="#fff6e6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" className="scene-sway">
        <path d="M250 262 q30 -8 60 -2" />
        <path d="M600 300 q26 -7 52 -2" />
      </g>
    </>
  );
}

function Forest({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3ecdc" />
          <stop offset="0.6" stopColor="#eef8f1" />
          <stop offset="1" stopColor="#f6fbf3" />
        </linearGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("fog")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <circle cx="610" cy="96" r="34" fill="#fbfff2" />
      {/* Morning light through the trees */}
      <g fill={`url(#${id("beam")})`} className="scene-pulse">
        <path d="M600 90 L470 400 L540 400 Z" opacity="0.5" />
        <path d="M610 90 L620 400 L700 400 Z" opacity="0.4" />
        <path d="M620 90 L760 400 L820 400 Z" opacity="0.3" />
      </g>
      <Birds x={200} y={110} color="#5e8f6f" scale={0.9} />
      <path d="M0 200 Q120 150 250 182 T520 170 T800 186 V260 H0 Z" fill="#c4e0cc" />
      <path d={forestLayer(222, 10, 46, 26, 40)} fill="#9fcbad" />
      <rect x="-100" y="200" width={W * 2} height="70" fill={`url(#${id("fog")})`} className="scene-sway-slow" />
      <path d={forestLayer(262, 14, 70, 34, 300)} fill="#6aa883" />
      <rect x="-100" y="250" width={W * 2} height="60" fill={`url(#${id("fog")})`} opacity="0.7" className="scene-sway" />
      <path d={forestLayer(310, 16, 96, 44, 900)} fill="#3f8a5a" />
      <path d={forestLayer(372, 12, 130, 62, 1600)} fill="#245a3a" />
    </>
  );
}

function Sunset({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7b9a6" />
          <stop offset="0.45" stopColor="#fbd2b4" />
          <stop offset="0.72" stopColor="#fde5c6" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.66" r="0.45">
          <stop offset="0" stopColor="#fff1d6" />
          <stop offset="0.35" stopColor="#ffcf9e" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffcf9e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("sun")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0c9" />
          <stop offset="1" stopColor="#ffab73" />
        </linearGradient>
        <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ec9a7c" />
          <stop offset="1" stopColor="#b2574a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <rect width={W} height={H} fill={`url(#${id("glow")})`} />
      <g fill="#fde3d6" className="scene-sway-slow">
        <rect x="80" y="96" width="220" height="7" rx="3.5" opacity="0.9" />
        <rect x="130" y="112" width="140" height="6" rx="3" opacity="0.7" />
        <rect x="500" y="72" width="200" height="7" rx="3.5" opacity="0.85" />
        <rect x="540" y="88" width="120" height="6" rx="3" opacity="0.6" />
      </g>
      <Birds x={470} y={150} color="#a5543f" scale={0.9} />
      <circle cx="400" cy="262" r="74" fill={`url(#${id("sun")})`} />
      <rect y="262" width={W} height={H - 262} fill={`url(#${id("sea")})`} />
      {/* The sun's reflection, shimmering */}
      <g fill="#ffe2bd">
        <rect x="336" y="272" width="128" height="4" rx="2" className="scene-shimmer" />
        <rect x="352" y="284" width="96" height="4" rx="2" opacity="0.85" className="scene-shimmer-alt" />
        <rect x="366" y="296" width="68" height="4" rx="2" opacity="0.75" className="scene-shimmer" />
        <rect x="378" y="309" width="44" height="3" rx="1.5" opacity="0.65" className="scene-shimmer-alt" />
        <rect x="388" y="321" width="24" height="3" rx="1.5" opacity="0.55" className="scene-shimmer" />
      </g>
      {/* A hillside town on the left, a headland on the right */}
      <path d="M-10 262 Q40 196 120 202 Q190 208 250 262 Z" fill="#b8604e" />
      <g fill="#9a4a3c">
        <path d="M40 232 h22 v-16 l-11 -9 l-11 9 Z" />
        <path d="M70 226 h18 v-20 l-9 -7 l-9 7 Z" />
        <path d="M96 220 h14 v-34 h-14 Z" />
        <path d="M94 186 l9 -12 l9 12 Z" />
        <path d="M118 224 h24 v-14 l-12 -8 l-12 8 Z" />
        <path d="M150 232 h20 v-14 l-10 -8 l-10 8 Z" />
        <path d="M178 244 h22 v-10 l-11 -7 l-11 7 Z" />
      </g>
      <g fill="#ffd89e">
        <rect x="47" y="220" width="4" height="5" />
        <rect x="76" y="214" width="4" height="5" />
        <rect x="100" y="198" width="5" height="6" />
        <rect x="126" y="214" width="4" height="5" />
        <rect x="157" y="222" width="4" height="5" />
      </g>
      <path d="M600 262 Q680 222 760 228 Q790 230 820 240 V262 Z" fill="#a85646" />
      <g className="scene-drift-slow">
        <path d={wavePath(330, 4, 200)} fill="#a24f43" opacity="0.6" />
      </g>
      <g className="scene-drift">
        <path d={wavePath(366, 6, 160)} fill="#8a3f36" />
      </g>
    </>
  );
}

function Mountain({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d6ea" />
          <stop offset="0.6" stopColor="#edf1f8" />
          <stop offset="1" stopColor="#f6f8fb" />
        </linearGradient>
        <linearGradient id={id("lake")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9bad3" />
          <stop offset="1" stopColor="#7f93b2" />
        </linearGradient>
        <linearGradient id={id("meadow")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#62728c" />
          <stop offset="1" stopColor="#3e4b60" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <circle cx="660" cy="84" r="24" fill="#ffffff" opacity="0.9" />
      {/* Far range */}
      <path d="M0 250 L70 196 L120 222 L190 170 L250 214 L320 186 L400 230 L470 180 L560 226 L640 176 L720 216 L800 190 V300 H0 Z" fill="#c4cfe0" />
      {/* Main peaks: a lit face, a shadow face, and snow */}
      <path d="M300 92 L110 318 L350 318 L322 238 L334 176 Z" fill="#94a4bd" />
      <path d="M300 92 L334 176 L322 238 L350 318 L520 318 Z" fill="#6b7c97" />
      <path d="M300 92 L262 140 L280 136 L292 150 L306 132 L320 148 L334 176 L320 120 Z" fill="#ffffff" />
      <path d="M300 92 L320 120 L334 176 L326 150 Z" fill="#dfe6f1" />
      <path d="M570 136 L420 318 L600 318 L590 252 L598 200 Z" fill="#8a9ab3" />
      <path d="M570 136 L598 200 L590 252 L600 318 L770 318 Z" fill="#63738e" />
      <path d="M570 136 L540 174 L556 170 L566 184 L578 168 L590 178 L598 200 L586 160 Z" fill="#ffffff" />
      <path d="M120 206 L20 318 L200 318 Z" fill="#7d8da7" />
      <path d="M120 206 L100 232 L114 228 L124 238 L134 226 Z" fill="#f4f7fb" />
      {/* Clouds drifting across the peaks */}
      <g className="scene-sway-slow">
        <Cloud x={430} y={214} s={1.3} opacity={0.85} />
        <Cloud x={190} y={246} s={1} opacity={0.75} />
      </g>
      {/* An alpine lake with the peaks reflected */}
      <rect y="318" width={W} height="40" fill={`url(#${id("lake")})`} />
      <g opacity="0.35" className="scene-shimmer">
        <path d="M300 352 L130 320 L470 320 Z" fill="#5d6e8a" />
        <path d="M570 348 L440 320 L700 320 Z" fill="#5d6e8a" />
      </g>
      <path d={`M0 348 Q120 330 260 344 T540 346 T800 336 V${H} H0 Z`} fill={`url(#${id("meadow")})`} />
      <g fill="#34425a">
        <path d={pine(70, 352, 56)} />
        <path d={pine(102, 356, 44)} />
        <path d={pine(712, 346, 60)} />
        <path d={pine(744, 350, 46)} />
      </g>
    </>
  );
}


type Building = { x: number; w: number; top: number };

// A row of flat-topped buildings standing on baseY.
function skyline(baseY: number, minH: number, maxH: number, minW: number, maxW: number, seed: number) {
  const buildings: Building[] = [];
  let x = -10;
  let i = 0;
  while (x < W + 10) {
    const w = r1(minW + hash(seed + i) * (maxW - minW));
    const h = r1(minH + hash(seed + i + 50) * (maxH - minH));
    buildings.push({ x, w, top: r1(baseY - h) });
    x = r1(x + w + 2 + hash(seed + i + 99) * 4);
    i++;
  }
  return buildings;
}

function buildingsPath(buildings: Building[], baseY: number) {
  return buildings.map((b) => `M${b.x} ${baseY}V${b.top}h${b.w}V${baseY}Z`).join("");
}

// Lit windows on a row of buildings, split into three groups that twinkle
// at different moments.
function windowRects(buildings: Building[], baseY: number, seed: number) {
  const groups: string[] = ["", "", ""];
  buildings.forEach((b, bi) => {
    for (let wx = b.x + 4; wx < b.x + b.w - 5; wx += 8) {
      for (let wy = b.top + 6; wy < baseY - 8; wy += 11) {
        const r = hash(seed + bi * 31 + Math.round(wx) * 7 + Math.round(wy) * 13);
        if (r > 0.58) groups[Math.floor(r * 30) % 3] += `M${wx.toFixed(1)} ${wy.toFixed(1)}h3.5v5h-3.5Z`;
      }
    }
  });
  return groups;
}

function City({ uid }: SceneProps) {
  const id = (n: string) => `${uid}-${n}`;
  const far = skyline(262, 40, 110, 22, 46, 3);
  const mid = skyline(292, 50, 150, 26, 58, 17);
  const near = skyline(330, 40, 130, 34, 70, 41);
  const [lit1, lit2, lit3] = windowRects(near, 330, 7);
  const [mlit1, mlit2] = windowRects(mid, 292, 23);
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3bcee" />
          <stop offset="0.5" stopColor="#e6d8f3" />
          <stop offset="0.8" stopColor="#fde3d6" />
        </linearGradient>
        <radialGradient id={id("moon")} cx="0.79" cy="0.22" r="0.16">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("river")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7b70b8" />
          <stop offset="1" stopColor="#332c66" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("sky")})`} />
      <rect width={W} height={H} fill={`url(#${id("moon")})`} />
      <circle cx="632" cy="86" r="20" fill="#fffaf0" />
      {/* Stars */}
      <g fill="#ffffff">
        <circle cx="120" cy="50" r="1.6" className="scene-shimmer" />
        <circle cx="260" cy="34" r="1.3" className="scene-shimmer-alt" />
        <circle cx="420" cy="62" r="1.5" className="scene-shimmer" />
        <circle cx="520" cy="28" r="1.2" className="scene-shimmer-alt" />
        <circle cx="730" cy="46" r="1.4" className="scene-shimmer" />
        <circle cx="60" cy="110" r="1.1" className="scene-shimmer-alt" />
      </g>
      {/* A plane crossing, its light blinking */}
      <g className="scene-glide">
        <g transform="translate(230 112)">
          <path d="M0 0 L22 -2 L26 -6 L28 -6 L27 -1 L34 -1 Q37 0 34 1 L27 1 L28 6 L26 6 L22 2 Z" fill="#6f64ad" />
          <circle cx="2" cy="0" r="1.6" fill="#ff7a6b" className="scene-shimmer" />
        </g>
      </g>
      {/* Far, mid, and near skylines */}
      <path d={buildingsPath(far, 270)} fill="#d3cbef" />
      <path d={buildingsPath(mid, 300)} fill="#a397d6" />
      {/* Landmarks in the middle row: a spire tower and a dome */}
      <path d="M520 300 V150 h26 V300 Z M526 150 L533 92 L540 150 Z M532 92 V62" fill="#a397d6" stroke="#a397d6" strokeWidth="2" />
      <path d="M232 300 V214 h64 V300 Z M236 214 a28 28 0 0 1 56 0 Z M264 186 V170" fill="#a397d6" stroke="#a397d6" strokeWidth="2" />
      <g fill="#fff1c9" opacity="0.7">
        <path d={mlit1} className="scene-shimmer" />
        <path d={mlit2} />
      </g>
      <path d={buildingsPath(near, 332)} fill="#4c4288" />
      <g fill="#ffd98a">
        <path d={lit1} />
        <path d={lit2} className="scene-shimmer" />
        <path d={lit3} className="scene-shimmer-alt" />
      </g>
      {/* River with the city's lights on the water */}
      <rect y="330" width={W} height={H - 330} fill={`url(#${id("river")})`} />
      <g fill="#ffd98a" opacity="0.55">
        {[60, 150, 270, 380, 470, 590, 690].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={344 + (i % 3) * 12}
            width={18 + (i % 4) * 8}
            height="2.5"
            rx="1.25"
            className={i % 2 ? "scene-shimmer" : "scene-shimmer-alt"}
          />
        ))}
      </g>
      {/* An arched bridge */}
      <g fill="none" stroke="#2c2560" strokeWidth="5" strokeLinecap="round">
        <path d="M-10 338 H330" />
        <path d="M20 338 Q90 296 160 338 Q230 296 300 338" strokeWidth="4" />
      </g>
      <g stroke="#2c2560" strokeWidth="2">
        {[50, 80, 110, 130, 190, 210, 240, 270].map((x) => (
          <path key={x} d={`M${x} 338 V${x < 160 ? 312 + Math.abs(x - 90) * 0.45 : 312 + Math.abs(x - 230) * 0.45}`} />
        ))}
      </g>
      <g className="scene-drift-slow">
        <path d={wavePath(372, 3, 200)} fill="#2a2458" opacity="0.6" />
      </g>
    </>
  );
}

const SCENES = { ocean: Ocean, sand: Sand, forest: Forest, sunset: Sunset, mountain: Mountain, city: City };

export function TripScene({
  theme,
  uid,
  className = "",
  animated = true,
}: {
  theme: string;
  // Unique per scene on the page, so gradient ids don't collide.
  uid: string;
  className?: string;
  animated?: boolean;
}) {
  const Scene = SCENES[theme as keyof typeof SCENES] ?? Ocean;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={`scene pointer-events-none ${animated ? "" : "scene-still"} ${className}`}
    >
      <Scene uid={uid} />
    </svg>
  );
}

// A scene as a wide banner under text on the scene's own sky color. On very
// wide screens the top of the scene is cropped, so its upper edge fades into
// that sky color and there is never a visible seam.
export function SceneBanner({
  theme,
  uid,
  sky,
  className = "",
}: {
  theme: string;
  uid: string;
  sky: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <TripScene theme={theme} uid={uid} className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
        style={{ background: `linear-gradient(to bottom, ${sky}, transparent)` }}
      />
    </div>
  );
}
