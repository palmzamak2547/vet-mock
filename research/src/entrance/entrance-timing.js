// Timeline of the first-visit workspace entrance, in ms from its first frame [M1-DESIGN.md 16]:
// the dots gather, the veil over the workspace lifts once they are on their way, the dots fade, and
// the whole scene ends before 2.5 s. OWNER: landing role.
// gatherStart 150 (review round 2: the gather began after a blank beat that read as loading).
export const ENTRANCE_MS = Object.freeze({ gatherStart: 150, gatherEnd: 1500, veilStart: 850, veilEnd: 1650, fadeStart: 1700, end: 2250 });

/** Later visits on the same device only cross-fade. */
export const CROSSFADE_MS = 220;
