// The herd as a still SVG: every animal at its farm, positives in gold, one ring per farm [M1-DESIGN.md 3].
// Shown when WebGL is missing or its context is lost, and in the reduced-motion story. Static, so SVG
// circles are fine (the rule against SVG strokes is for moving layers). The viewBox holds the outer
// rings whole (stillHalf). OWNER: landing role.
import { useMemo } from 'react';
import { HERD_LAYOUTS, STILL_STYLE, herdData, stillHalf } from './data.js';

/**
 * @param {{ layout?: 'desktop'|'phone', className?: string, style?: import('react').CSSProperties }} props
 */
export default function HerdStill({ layout = 'desktop', className, style }) {
  const L = HERD_LAYOUTS[layout];
  const d = useMemo(() => herdData(L), [L]);
  const s = STILL_STYLE[layout];
  const half = stillHalf(layout);
  const dots = [];
  for (let j = 0; j < d.N; j++) {
    dots.push(
      <circle key={j} cx={d.farm[j * 2].toFixed(1)} cy={d.farm[j * 2 + 1].toFixed(1)} r={d.pos[j] ? s.dot * 1.25 : s.dot} className={d.pos[j] ? 'rs-l-still-pos' : 'rs-l-still-neg'} />,
    );
  }
  const rings = [];
  for (let f = 0; f < d.FARMS; f++) {
    rings.push(<circle key={f} cx={d.centers[f * 2]} cy={d.centers[f * 2 + 1]} r={L.R + s.ringPad} className="rs-l-still-ring" />);
  }
  return (
    <svg className={className} style={style} viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} aria-hidden="true" focusable="false">
      <g>{rings}</g>
      <g>{dots}</g>
    </svg>
  );
}
