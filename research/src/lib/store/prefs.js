// Per-device preferences: the only localStorage key the app writes [M1-DESIGN.md 9.5].
// Wrapped in try/catch (private windows throw); capped under 1 KB; never localStorage.clear().
// OWNER: runtime role.

export const PREFS_KEY = 'vmx-research-prefs-v1';

/**
 * @typedef {Object} Prefs
 * @property {'th'|'en'} lang             default 'th'
 * @property {'system'|'light'|'dark'} theme
 * @property {boolean} entranceSeen       the workspace entrance has played on this device
 * @property {boolean} introSeen          the front door's opening film has played on this device
 * @property {boolean} filmSoundOff       the visitor turned the films' sound off on this device
 * @property {string|null} lastProjectId  landing offers "ทำต่อ" when set and the project exists
 * @property {string|null} lastProjectOwner  the owner scope that project belongs to; the landing offers
 *   it only to that owner (after sign-out the guest cannot open an account's project)
 * @property {boolean} guestClaimDone     the first sign-in on this browser has happened; guest projects
 *   made after it stay guest until the student moves them (auth/claim-guest.js)
 */

/** @type {Prefs} */
export const DEFAULT_PREFS = Object.freeze({ lang: 'th', theme: 'system', entranceSeen: false, introSeen: false, filmSoundOff: false, lastProjectId: null, lastProjectOwner: null, guestClaimDone: false });

/** @returns {Prefs} defaults merged with whatever valid fields are stored */
export function readPrefs() {
  try {
    const raw = globalThis.localStorage?.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const v = JSON.parse(raw);
    return {
      lang: v.lang === 'en' ? 'en' : 'th',
      theme: v.theme === 'light' || v.theme === 'dark' ? v.theme : 'system',
      entranceSeen: v.entranceSeen === true,
      introSeen: v.introSeen === true,
      filmSoundOff: v.filmSoundOff === true,
      lastProjectId: typeof v.lastProjectId === 'string' && v.lastProjectId.length <= 64 ? v.lastProjectId : null,
      lastProjectOwner: typeof v.lastProjectOwner === 'string' && v.lastProjectOwner.length <= 72 ? v.lastProjectOwner : null,
      guestClaimDone: v.guestClaimDone === true,
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/** @param {Partial<Prefs>} patch @returns {Prefs} the merged prefs (stored when storage works) */
export function writePrefs(patch) {
  const next = { ...readPrefs(), ...patch };
  try {
    globalThis.localStorage?.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: prefs live for this page only */
  }
  return next;
}
