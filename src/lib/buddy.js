// ============================================================
// buddy.js — the one study buddy a student keeps
// ============================================================
// A student picks one buddy and every screen that shows a companion shows
// that one: the Pomodoro ring and its celebration, the Mochi page, and (when
// their screens read it) the Home companion card and the Results card. Before
// this, the Home card always said Mochi, the Mochi page's 3D view always
// opened on Moocha, and a buddy picked in Pomodoro stayed in Pomodoro.
//
// The roster is Mochi first, then Kasem's nine clinic mascots in the order
// art.js lists them. Mochi is the default when nothing was picked, so a
// student who tries another buddy can always come back to Mochi.
//
// The pick lives in the existing device-wide key (lib/buddy-stats.js); this
// module adds the roster, the art per moment and the 3D model per buddy.
// ============================================================

import { SQUAD_MASCOTS, SUBJECT_MOCHI } from '../data/art.js';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';
import { getPickedBuddy, setSelectedBuddy } from './buddy-stats.js';

export const MOCHI_ID = 'mochi';

/** Mochi as a buddy. Its 27 drawn poses give it a picture per moment; the
 *  clinic mascots have one picture each. */
export const MOCHI_BUDDY = Object.freeze({
  id: MOCHI_ID,
  name: 'Mochi',
  nameTh: 'โมจิ',
  species: 'ลูกสุนัข (Puppy)',
  role: 'เพื่อนร่วมติวทุกวิชา',
  src: '/motion/assets/mochi.png',
  alt: 'โมจิ ลูกสุนัขผ้าพันคอสีเขียว เพื่อนร่วมติว',
  poses: Object.freeze({
    wave: MOCHI_POSE_ASSETS.wave,
    celebrate: MOCHI_POSE_ASSETS.celebrate,
    read: MOCHI_POSE_ASSETS.read,
    encourage: MOCHI_POSE_ASSETS.encourage,
  }),
});

export const BUDDIES = Object.freeze([MOCHI_BUDDY, ...Object.values(SQUAD_MASCOTS)]);
const BY_ID = Object.freeze(Object.fromEntries(BUDDIES.map((b) => [b.id, b])));

export const isBuddyId = (id) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(BY_ID, id);
export const buddyById = (id) => (isBuddyId(id) ? BY_ID[id] : null);

/** The buddy the student picked, or null when they never picked one (or the
 *  stored id names nobody, e.g. a mascot that was renamed). */
export function pickedBuddyId() {
  const id = getPickedBuddy();
  return isBuddyId(id) ? id : null;
}

/** The picked buddy, else the one this screen falls back to, else Mochi. */
export function currentBuddy(fallbackId = MOCHI_ID) {
  return buddyById(pickedBuddyId()) || buddyById(fallbackId) || MOCHI_BUDDY;
}

/** Keep `id` as the buddy. Unknown ids are ignored, so a stale button can
 *  never store a buddy no screen can draw. */
export function pickBuddy(id) {
  if (!isBuddyId(id)) return false;
  setSelectedBuddy(id);
  return true;
}

/** The picture for a moment ('wave', 'celebrate', ...). Mochi has a drawn
 *  pose for these; a clinic mascot shows its one picture. */
export function buddyArt(buddy, moment) {
  return buddy?.poses?.[moment] || buddy?.src || MOCHI_BUDDY.src;
}

/** How a buddy is drawn in 3D: the clinic mascots load their GLB, Mochi is
 *  built from the Motion Kit's own model (no download). */
export function buddyModel(id) {
  if (id === MOCHI_ID) return { kind: 'mochi' };
  if (SQUAD_MASCOTS[id]) return { kind: 'glb', url: `/art/models/${id}.glb` };
  return null;
}

// Subject -> clinic mascot id, from art.js SUBJECT_MOCHI where the entry is a
// squad mascot (the Mochi-in-uniform pictures there are not buddies).
const SUBJECT_CLINIC = Object.freeze(Object.fromEntries(
  Object.entries(SUBJECT_MOCHI).filter(([, v]) => v?.id && SQUAD_MASCOTS[v.id]).map(([k, v]) => [k, v.id]),
));

/** Results: the buddy the student picked wins; without a pick, a set from
 *  one subject shows that clinic's mascot; otherwise Mochi. */
export function resultsCompanion(questions, pickedId = pickedBuddyId()) {
  if (isBuddyId(pickedId)) return BY_ID[pickedId];
  const list = Array.isArray(questions) ? questions : [];
  const subject = list[0]?.subject;
  const uniform = Boolean(subject) && list.every((q) => q?.subject === subject);
  return (uniform && SQUAD_MASCOTS[SUBJECT_CLINIC[subject]]) || MOCHI_BUDDY;
}

/** Home: the picked buddy, else the season's Mochi picture, else Mochi. */
export function homeCompanion(seasonal, pickedId = pickedBuddyId()) {
  const picked = buddyById(pickedId);
  if (picked) return { id: picked.id, name: picked.nameTh, src: picked.src, alt: picked.alt };
  return {
    id: MOCHI_ID,
    name: 'Mochi',
    src: seasonal?.src || MOCHI_BUDDY.src,
    alt: seasonal?.alt || 'โมจิ เพื่อนร่วมติว',
  };
}

// ── Can this device draw the 3D buddy? ────────────────────────────────────
// three r163+ needs WebGL2. Old iOS, blocked GPUs and some in-app browsers do
// not have it; a 3D switch there would open a picture with an apology, which
// is worse than no switch. Probed once per page load, and the probe context is
// released at once.
let can3D = null;
export function canShow3D() {
  if (can3D !== null) return can3D;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    can3D = Boolean(gl);
    gl?.getExtension?.('WEBGL_lose_context')?.loseContext?.();
  } catch {
    can3D = false;
  }
  return can3D;
}
/** Tests only: forget the probe result. */
export function resetCanShow3D(value = null) { can3D = value; }
