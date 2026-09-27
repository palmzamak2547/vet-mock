// CSS mode of the scroll story [M1-DESIGN.md 15.1]: the same layoutValues() sampled into @keyframes
// on a view timeline over the track, so the browser runs them on the compositor and no script
// touches the DOM per frame. The track is taller than the viewport, so its contain range runs from
// track top at the viewport top to track bottom at the viewport bottom: exactly t = 0..1, the same t
// JS mode computes. Port of rsKeyframesCss in work/research-studio/design/story.js, scoped per
// variant. OWNER: landing role. Pure module.
import { layoutValues } from './layout.js';

export const KEYFRAME_STEPS = 100;
/**
 * A step in which a layer's opacity changes fast is cut into this many sub-steps. Between two
 * keyframes the browser interpolates in a straight line, so with 1% steps alone a fade that lasts
 * less than a step (a panel leaving, a card handing over) was smeared across the whole step, and
 * two layers the layout keeps apart overlapped on screen (review round 3).
 */
export const KEYFRAME_REFINE = 8;
const JUMP = 0.25;
const BEND = 0.03;

function decl(r) {
  const p = [];
  if (r.opacity !== undefined) p.push(`opacity:${r.opacity}`);
  if (r.visibility) p.push(`visibility:${r.visibility}`);
  if (r.transform) p.push(`transform:${r.transform}`);
  return p.join(';');
}

/** Keyframe offset in percent, at most three decimals (1/8 of a 1% step). */
export function pctText(t) {
  return String(Number((t * 100).toFixed(3)));
}

/**
 * The progress values one layer's keyframes are sampled at: every 1% step, cut finer where its
 * opacity jumps by more than JUMP across the step, bends away from a straight line by more than BEND,
 * or its visibility flips. Per layer, so a fast fade in one layer adds no frames to the others.
 * @param {(t: number) => Record<string, { opacity?: number, visibility?: string }>} at
 * @param {string} key
 */
export function layerTimes(at, key) {
  const ts = [];
  for (let i = 0; i < KEYFRAME_STEPS; i++) {
    const t0 = i / KEYFRAME_STEPS;
    const t1 = (i + 1) / KEYFRAME_STEPS;
    ts.push(t0);
    const a = at(t0)[key];
    const b = at(t1)[key];
    if (a.opacity === undefined) continue;
    const mid = at((t0 + t1) / 2)[key];
    if (Math.abs(b.opacity - a.opacity) > JUMP || Math.abs(mid.opacity - (a.opacity + b.opacity) / 2) > BEND || a.visibility !== b.visibility) {
      for (let j = 1; j < KEYFRAME_REFINE; j++) ts.push(t0 + ((t1 - t0) * j) / KEYFRAME_REFINE);
    }
  }
  ts.push(1);
  return ts;
}

/**
 * @param {typeof import('./layout.js').VARIANTS.desktop} v
 * @param {number} widen  sqrt(DEFF) from the herd
 * @returns {string} CSS text
 */
export function keyframesCss(v, widen) {
  const cache = new Map();
  const at = (t) => {
    let s = cache.get(t);
    if (!s) {
      s = layoutValues(t, v, false, widen);
      cache.set(t, s);
    }
    return s;
  };
  const scope = `.rs-story[data-variant="${v.id}"][data-rs-mode="css"]`;
  const css = [`.rs-story[data-variant="${v.id}"] [data-rs="track"]{view-timeline-name:--rs-story-${v.id};view-timeline-axis:block}`];
  for (const key of Object.keys(at(0))) {
    const ts = layerTimes(at, key);
    const frames = ts.map((t) => decl(at(t)[key]));
    const last = ts.length - 1;
    const kept = [];
    for (let j = 0; j <= last; j++) {
      if (j === 0 || j === last || frames[j] !== frames[j - 1] || frames[j] !== frames[j + 1]) kept.push(j);
    }
    const name = `rs-${v.id}-${key}`;
    css.push(`@keyframes ${name}{${kept.map((j) => `${pctText(ts[j])}%{${frames[j]}}`).join('')}}`);
    css.push(`${scope} [data-rs="${key}"]{animation:${name} linear both;animation-timeline:--rs-story-${v.id};animation-range:contain 0% contain 100%}`);
  }
  return css.join('\n');
}

/** @returns {boolean} whether this browser runs scroll-driven animations with view timelines */
export function cssTimelinesSupported() {
  try {
    return Boolean(globalThis.CSS?.supports?.('view-timeline-name: --rs') && globalThis.CSS.supports('animation-timeline: --rs'));
  } catch {
    return false;
  }
}
