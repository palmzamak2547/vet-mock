// Timeline of the first-visit workspace entrance, in ms from its first frame [M1-DESIGN.md 16]:
// the greeting and the herd come in, the dots gather, the veil over the workspace lifts once they are
// on their way, the dots fade, and the whole scene ends before 2.5 s. OWNER: landing role.
// Review round 2: the gather began after a blank beat that read as loading (gatherStart moved to 150).
// Review round 3: the greeting and the herd took 200 ms to come up on blank paper with the skip button
// alone on it, so they come in over inEnd (100 ms) and the rest of the scene starts 30 to 50 ms sooner;
// the skip button stayed about a second after the dots had settled, so it leaves over skipOut before
// gatherEnd.
import { smooth } from '../landing/story/layout.js';

export const ENTRANCE_MS = Object.freeze({ inEnd: 100, gatherStart: 120, gatherEnd: 1450, skipOut: 250, veilStart: 800, veilEnd: 1600, fadeStart: 1650, end: 2200 });

/** Later visits on the same device only cross-fade. */
export const CROSSFADE_MS = 220;

/**
 * Opacity of the skip button e ms into the entrance: it comes in with the greeting (never alone on
 * the blank veil) and is gone once the dots have gathered, when there is nothing left to skip.
 * @param {number} e
 */
export function skipOpacity(e, M = ENTRANCE_MS) {
  return smooth(0, M.inEnd, e) * (1 - smooth(M.gatherEnd - M.skipOut, M.gatherEnd, e));
}
