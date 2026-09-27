// Whether the workspace film plays: only at a student's first entrance to the project list on this
// device (the moment the full entrance plays, prefs.entranceSeen), never under reduced motion, never
// for automation, never on Save-Data or a 2G connection, and only where the browser plays H.264 MP4.
// ?film=1 plays it again, ?film=0 skips it. OWNER: landing role.
import { readPrefs } from '../lib/store/prefs.js';

/** @param {{ name: string } | undefined} route */
export function workspaceFilmPending(route) {
  try {
    if (route?.name !== 'projects') return false;
    const q = new URLSearchParams(location.search).get('film');
    if (q === '0') return false;
    if (!document.createElement('video').canPlayType('video/mp4; codecs="avc1.640029"')) return false;
    if (q === '1') return true;
    if (readPrefs().entranceSeen || navigator.webdriver) return false;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const c = /** @type {any} */ (navigator).connection;
    return !(c && (c.saveData || /2g$/.test(c.effectiveType || '')));
  } catch {
    return false;
  }
}
