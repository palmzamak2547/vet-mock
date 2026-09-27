// The herd as a still SVG: every animal at its farm, positives in gold, one ring per farm [M1-DESIGN.md 3].
// Shown when WebGL is missing or its context is lost, and in the reduced-motion story. Static, so SVG
// circles are fine (the rule against SVG strokes is for moving layers). OWNER: landing role.
import { useMemo } from 'react';
import { HERD_LAYOUTS, herdData } from './data.js';

/**
 * @param {{ layout?: 'desktop'|'phone', className?: string, style?: import('react').CSSProperties }} props
 */
export default function HerdStill({ layout = 'desktop', className, style }) {
  const L = HERD_LAYOUTS[layout];
  const d = useMemo(() => herdData(L), [L]);
  const half = 3 * L.S + L.R + 4;
  const r = layout === 'phone' ? 2.1 : 3.2;
  const dots = [];
  for (let j = 0; j < d.N; j++) {
    dots.push(
      <circle key={j} cx={d.farm[j * 2].toFixed(1)} cy={d.farm[j * 2 + 1].toFixed(1)} r={d.pos[j] ? r * 1.25 : r} className={d.pos[j] ? 'rs-l-still-pos' : 'rs-l-still-neg'} />,
    );
  }
  const rings = [];
  for (let f = 0; f < d.FARMS; f++) {
    rings.push(<circle key={f} cx={d.centers[f * 2]} cy={d.centers[f * 2 + 1]} r={L.R + (layout === 'phone' ? 5 : 7)} className="rs-l-still-ring" />);
  }
  return (
    <svg className={className} style={style} viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} aria-hidden="true" focusable="false">
      <g>{rings}</g>
      <g>{dots}</g>
    </svg>
  );
}
