// CSS mode of the scroll story [M1-DESIGN.md 15.1]: the same layoutValues() sampled into @keyframes
// on a view timeline over the track, so the browser runs them on the compositor and no script
// touches the DOM per frame. The track is taller than the viewport, so its contain range runs from
// track top at the viewport top to track bottom at the viewport bottom: exactly t = 0..1, the same t
// JS mode computes. Port of rsKeyframesCss in work/research-studio/design/story.js, scoped per
// variant. OWNER: landing role. Pure module.
import { layoutValues } from './layout.js';

export const KEYFRAME_STEPS = 100;

function decl(r) {
  const p = [];
  if (r.opacity !== undefined) p.push(`opacity:${r.opacity}`);
  if (r.visibility) p.push(`visibility:${r.visibility}`);
  if (r.transform) p.push(`transform:${r.transform}`);
  return p.join(';');
}

/**
 * @param {typeof import('./layout.js').VARIANTS.desktop} v
 * @param {number} widen  sqrt(DEFF) from the herd
 * @returns {string} CSS text
 */
export function keyframesCss(v, widen) {
  const samples = [];
  for (let i = 0; i <= KEYFRAME_STEPS; i++) samples.push(layoutValues(i / KEYFRAME_STEPS, v, false, widen));
  const scope = `.rs-story[data-variant="${v.id}"][data-rs-mode="css"]`;
  const css = [`.rs-story[data-variant="${v.id}"] [data-rs="track"]{view-timeline-name:--rs-story-${v.id};view-timeline-axis:block}`];
  for (const key of Object.keys(samples[0])) {
    const frames = samples.map((s) => decl(s[key]));
    const kept = [];
    for (let j = 0; j <= KEYFRAME_STEPS; j++) {
      if (j === 0 || j === KEYFRAME_STEPS || frames[j] !== frames[j - 1] || frames[j] !== frames[j + 1]) kept.push(j);
    }
    const name = `rs-${v.id}-${key}`;
    css.push(`@keyframes ${name}{${kept.map((j) => `${(j * 100 / KEYFRAME_STEPS).toFixed(1).replace(/\.0$/, '')}%{${frames[j]}}`).join('')}}`);
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
