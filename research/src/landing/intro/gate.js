// The opening film's on/off switch. public/intro-gate.js decides before the first paint and marks
// <html data-intro="pending">; this side only reads that mark, and clears it when the film ends.
// OWNER: landing role.

export const introPending = () => typeof document !== 'undefined' && document.documentElement.dataset.intro === 'pending';

export function endIntro() {
  try {
    window.localStorage.setItem('rs.intro.seen', '1');
  } catch {
    // Storage blocked: the film may play again on the next visit, which is harmless.
  }
  document.documentElement.removeAttribute('data-intro');
}
