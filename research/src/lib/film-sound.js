// Sound for the two films (the front door's opening film and the workspace film). A film plays with
// sound unless the visitor turned it off on this device. A browser that refuses sound before the
// visitor has clicked anything on the site plays it muted instead, and the film's own button turns
// the sound on. OWNER: landing role.
import { readPrefs, writePrefs } from './store/prefs.js';

/**
 * Starts a media element, with sound when the browser allows it.
 * @param {HTMLMediaElement} el
 * @returns {Promise<boolean>} true when it plays with sound; rejects when it cannot play at all
 */
export async function playWithSound(el) {
  el.muted = readPrefs().filmSoundOff;
  try {
    await el.play();
  } catch (e) {
    if (el.muted || /** @type {any} */ (e)?.name !== 'NotAllowedError') throw e;
    el.muted = true;
    await el.play();
  }
  return !el.muted;
}

/** @param {boolean} on the visitor's choice, kept for the next film on this device */
export const rememberSound = (on) => writePrefs({ filmSoundOff: !on });
