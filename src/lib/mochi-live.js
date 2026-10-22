// ============================================================
// One Mochi reaction, played on the Motion Kit rig
// ============================================================
// Loaded lazily by MochiLive. The rig is the source every still pose is drawn
// from (scripts/regen-mochi-poses.mjs renders a pose at 0.4 of its state's
// duration), so a reaction can end on the very still the <img> shows: play the
// state once, blend its last frame into that still, then hand back to the
// image. One small SVG, attributes written by ref, stopped when done or when
// the tab hides; nothing loops.
// ============================================================

import { createRig2D } from './motion-kit/mochi/renderer-2d.js';
import { STATES, poseAt } from './motion-kit/mochi/motion.js';

// The frame regen-mochi-poses.mjs draws for a still.
const STILL_AT = 0.4;
// From a reaction's last frame into the still: 240 ms reads as one movement
// settling (under ~100 ms it reads as a cut, the 0.1 s response limit).
const BLEND_S = 0.24;
const smooth = (u) => u * u * (3 - 2 * u);

function mix(from, to, u) {
  const out = { ...to };
  for (const key of Object.keys(to)) {
    if (typeof from[key] === 'number' && typeof to[key] === 'number') out[key] = from[key] + (to[key] - from[key]) * u;
  }
  return out;
}

/** The parameters of a still pose, the frame its image shows. */
export const stillPose = (pose) => poseAt(pose, (STATES[pose]?.duration || 4) * STILL_AT);

/**
 * Plays `state` once inside `host`, ends on `pose`'s still, removes itself and
 * calls onDone. Returns a stop function (also safe after it finished).
 * Same state as the still: it stops on the still's own frame, no blend.
 */
export function playMochi(host, { state, pose, onDone }) {
  const meta = STATES[state];
  if (!host || !meta || !STATES[pose]) { onDone?.(); return () => {}; }
  const stillT = STATES[pose].duration * STILL_AT;
  const still = stillPose(pose);
  const end = state === pose ? stillT : meta.duration;
  const blend = state === pose ? 0 : BLEND_S;
  const rig = createRig2D(host, { label: 'Mochi' });
  rig.element.setAttribute('aria-hidden', 'true');
  let raf = 0;
  let t0 = null;
  let done = false;
  const onVisibility = () => { if (document.visibilityState === 'hidden') stop(); };
  function stop() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibility);
    // The still comes back first, then the rig leaves: no frame shows neither.
    onDone?.();
    rig.destroy();
  }
  const frame = (now) => {
    if (done) return;
    if (t0 === null) t0 = now;
    const t = Math.max(0, (now - t0) / 1000);
    if (t < end) rig.render(poseAt(state, t), t);
    else if (t < end + blend) rig.render(mix(poseAt(state, end), still, smooth((t - end) / blend)), t);
    else { stop(); return; }
    raf = requestAnimationFrame(frame);
  };
  rig.render(poseAt(state, 0), 0);
  document.addEventListener('visibilitychange', onVisibility);
  raf = requestAnimationFrame(frame);
  return stop;
}
