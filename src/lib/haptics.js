// ============================================================
// Short vibrations for answer feedback, on phones that have them
// ============================================================
// Android browsers implement navigator.vibrate; iOS Safari does not, so there
// this is a no-op. A pulse under about 10 ms does not spin up a phone's
// vibration motor and one over about 30 ms reads as a buzz, so a tick is
// 14 ms; "wrong" is two soft ticks 70 ms apart (two distinct taps, the gap
// is above the ~50 ms at which they fuse into one), and a milestone is
// three, the last longer.
// ============================================================

const PATTERNS = Object.freeze({
  correct: [14],
  wrong: [10, 70, 10],
  milestone: [14, 60, 14, 60, 28],
});

export const hapticPattern = (kind) => PATTERNS[kind] || null;

// Inside the VetMock Android app, src/lib/native-app.js defines
// window.VetMockApp, whose haptic(kind) uses the phone's own haptic effects
// for the same three kinds. On the web it is undefined.
const appHaptic = (win) => (typeof win?.VetMockApp?.haptic === 'function' ? win.VetMockApp.haptic : null);

/** A device where a vibration can be felt: the app, or the API and a touch screen. */
export function canVibrate(win = typeof window === 'undefined' ? undefined : window) {
  if (appHaptic(win)) return true;
  const nav = win?.navigator;
  if (!nav || typeof nav.vibrate !== 'function') return false;
  return Boolean(win.matchMedia?.('(pointer: coarse)').matches);
}

/**
 * Vibrate for `kind` when the student allows it. Chrome refuses (and logs)
 * a vibration before the page has had a tap or key, so that case is skipped
 * here; a hidden tab never vibrates.
 */
export function haptic(kind, preferences, win = typeof window === 'undefined' ? undefined : window) {
  if (!preferences?.haptics || preferences.mode === 'off') return false;
  const pattern = hapticPattern(kind);
  if (!pattern) return false;
  const app = appHaptic(win);
  if (app) { try { app(kind); return true; } catch { return false; } }
  if (!canVibrate(win)) return false;
  if (win.document?.visibilityState === 'hidden') return false;
  if (win.navigator.userActivation && !win.navigator.userActivation.hasBeenActive) return false;
  try { return win.navigator.vibrate(pattern) === true; } catch { return false; }
}
