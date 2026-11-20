import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LENGTH_PX } from "../constants.js";

// Right half of each nail outline: 9 points from the tip (top center) to the base
// (bottom center), in a 100x100 box. The left half is mirrored automatically.
// Every shape has the same point count, so any two shapes can be interpolated.
const RIGHT_HALF = {
  round:    [[50, 0], [69.1, 4.4], [85.4, 14.6], [96.2, 30.9], [100, 50], [96.2, 69.1], [85.4, 85.4], [69.1, 95.6], [50, 100]],
  almond:   [[50, 0], [68, 12], [82, 30], [92, 50], [97, 68], [94, 82], [82, 95], [67, 100], [50, 100]],
  square:   [[50, 0], [86, 0], [97, 6], [100, 24], [100, 50], [100, 76], [97, 94], [86, 100], [50, 100]],
  coffin:   [[50, 0], [78, 0], [81, 12], [88, 32], [96, 58], [99, 78], [98, 94], [90, 100], [50, 100]],
  stiletto: [[50, 0], [62, 20], [72, 40], [82, 58], [90, 74], [94, 86], [96, 94], [92, 100], [50, 100]],
};

function toPolygon(shape) {
  const r = RIGHT_HALF[shape];
  const left = [];
  for (let i = 7; i >= 1; i--) left.push([100 - r[i][0], r[i][1]]);
  return [...r, ...left]; // 16 points, clockwise
}

function lerpPolygon(a, b, t) {
  return a.map(([x, y], i) => [x + (b[i][0] - x) * t, y + (b[i][1] - y) * t]);
}

function toD(pts) {
  return "M" + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L") + " Z";
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Animates the outline from wherever it currently is to the new shape.
// Re-targeting mid-animation continues smoothly from the current frame.
function useMorph(shape, duration = 650) {
  const target = useMemo(() => toPolygon(shape), [shape]);
  const [pts, setPts] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      current.current = target;
      setPts(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const next = lerpPolygon(from, target, easeInOut(t));
      current.current = next;
      setPts(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return pts;
}

// Returns the fill and any overlay/defs for each nail design.
function designParts(design, id, color) {
  const g = `${id}-${design}`;
  switch (design) {
    case "french":
      return { fill: color, overlay: <rect x="0" y="0" width="100" height="26" fill="#ffffff" /> };

    case "ombre":
      return {
        fill: `url(#${g})`,
        defs: (
          <linearGradient id={g} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor="#f3dcd9" />
          </linearGradient>
        ),
      };

    case "polka":
      return {
        fill: color,
        defs: (
          <pattern id={g} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="2.6" fill="#ffffff" />
          </pattern>
        ),
        overlay: <rect width="100" height="100" fill={`url(#${g})`} />,
      };

    case "stripes":
      return {
        fill: color,
        defs: (
          <pattern id={g} width="19" height="100" patternUnits="userSpaceOnUse">
            <rect x="11" y="0" width="8" height="100" fill="#ffffff" />
          </pattern>
        ),
        overlay: <rect width="100" height="100" fill={`url(#${g})`} />,
      };

    case "glitter":
      return {
        fill: color,
        defs: (
          <pattern id={g} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.8" fill="#ffffff" />
            <circle cx="10" cy="8" r="0.7" fill="#ffffff" />
            <circle cx="6" cy="11" r="0.6" fill="#ffd78c" />
          </pattern>
        ),
        overlay: <rect width="100" height="100" fill={`url(#${g})`} />,
      };

    case "marble":
      return {
        fill: color,
        overlay: (
          <g fill="none">
            <path d="M-5 62 Q 40 18 105 42" stroke="#ffffff" strokeWidth="5" opacity="0.85" />
            <path d="M-5 30 Q 50 70 105 58" stroke="#785a6e" strokeWidth="6" opacity="0.25" />
          </g>
        ),
      };

    case "chrome":
      return {
        fill: `url(#${g})`,
        defs: (
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9d9e4" />
            <stop offset="0.25" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#9d9db3" />
            <stop offset="0.6" stopColor="#ffffff" />
            <stop offset="0.8" stopColor="#bcbccc" />
            <stop offset="1" stopColor="#e7e7f0" />
          </linearGradient>
        ),
      };

    case "tips":
      return { fill: color, overlay: <rect x="0" y="60" width="100" height="40" fill="#1d1822" /> };

    case "check":
      return {
        fill: color,
        defs: (
          <pattern id={g} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="7" height="7" fill="#ffffff" />
            <rect x="7" y="7" width="7" height="7" fill="#ffffff" />
          </pattern>
        ),
        overlay: <rect width="100" height="100" fill={`url(#${g})`} />,
      };

    default:
      return { fill: color };
  }
}

export default function NailShape({
  shape = "almond",
  length = "medium",
  color = "#e88aa0",
  design = "solid",
  scale = 1,
  className = "",
}) {
  // Strip characters that are not valid in SVG ids (useId returns ":r0:" style strings)
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pts = useMorph(shape);
  const d = toD(pts);
  const parts = designParts(design, id, color);

  return (
    <svg
      className={`nail ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ height: LENGTH_PX[length], transform: `scale(${scale})` }}
      role="img"
      aria-label={`${shape} nail, ${length}`}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={d} />
        </clipPath>
        {parts.defs}
      </defs>
      <path d={d} fill={parts.fill} />
      {parts.overlay && <g clipPath={`url(#clip-${id})`}>{parts.overlay}</g>}
    </svg>
  );
}
