// The opening film's on/off switch. public/intro-gate.js decides before the first paint and marks
// <html data-intro="pending">; this side only reads that mark, and clears it when the film ends.
// "Seen" lives in the app's one preferences entry (lib/store/prefs.js). OWNER: landing role.
import { writePrefs } from '../../lib/store/prefs.js';

export const introPending = () => typeof document !== 'undefined' && document.documentElement.dataset.intro === 'pending';

export function endIntro() {
  writePrefs({ introSeen: true });
  document.documentElement.removeAttribute('data-intro');
}
