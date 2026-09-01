// ============================================================
// audio-unlock — iOS Safari audio gesture chain workaround
// ============================================================
//
// Problem: iOS Safari (and to a lesser extent other browsers) require
// that an audio element's `.play()` be invoked SYNCHRONOUSLY inside a
// user-initiated event handler (click, touchend, keydown). Once any
// `await` boundary is crossed, the call is no longer "in the gesture"
// and the call is silently blocked with:
//   "play() failed because the user didn't interact with the document
//    first"
//
// Our speakQuestion() path crosses `await ensureVoices()` and a fetch
// for Edge TTS audio before calling `new Audio(...).play()`. On iOS
// this fails silently — first 🔊 tap produces no sound; subsequent
// taps may work depending on timing.
//
// Workaround: prime audio playback ONCE on first user gesture. After
// the prime, the page is "audio-unlocked" for the entire session and
// subsequent .play() calls work from async contexts.
//
// Two-pronged prime:
//   1. HTMLAudioElement.play() of an inline silent WAV
//   2. AudioContext.resume() if WebAudio is used elsewhere
//
// The unlock is idempotent — multiple calls are no-ops after the first
// success. Caller pattern: invoke `unlockAudio()` at the TOP of any
// click handler that may eventually trigger audio playback.
// ============================================================

let _unlocked = false;
let _primer = null;

// Tiny inline silent WAV (44 bytes total — 1 sample, mono, 8-bit PCM)
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';

export function isAudioUnlocked() {
  return _unlocked;
}

/**
 * Prime audio playback. Call inside a user-initiated event handler
 * BEFORE any await. Safe to call multiple times — only the first call
 * does real work.
 *
 * Returns immediately; the prime happens async but the gesture is
 * "captured" by the synchronous `.play()` call.
 */
export function unlockAudio() {
  if (_unlocked || typeof window === 'undefined') return;
  try {
    // Prime an HTMLAudioElement. Reuse one element so we don't spam
    // memory if unlockAudio is called repeatedly before unlock succeeds.
    if (!_primer) {
      _primer = new Audio(SILENT_WAV);
      _primer.muted = true;
      _primer.playsInline = true;
    }
    const playPromise = _primer.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          _unlocked = true;
          try { _primer.pause(); _primer.currentTime = 0; } catch {}
        })
        .catch(() => {
          // First attempt may fail if not actually in a gesture (e.g.,
          // called from a setTimeout) — that's fine, the next user
          // click will get another chance.
        });
    }
  } catch {
    // Some restrictive environments throw on `new Audio()` — fail silent
  }

  // There is deliberately NO AudioContext prong here any more. It was
  // described as "cheap insurance" — measured, it was the opposite: the
  // constructor opens the audio output device and blocked the main thread
  // for 304ms on a Windows laptop (Audio.play() above: 0.1ms). Because this
  // unlock fires on the FIRST pointerdown anywhere, that stall landed under
  // the first pen stroke in the PDF reader — a 250-300ms hitch in the ink,
  // once per session, precisely when a person starts writing.
  //
  // The app's two real Web Audio users (PomodoroTimer, LandingView) each
  // construct their own AudioContext inside their own click handlers, where
  // the gesture is their own and a first-time device-open delay is expected.
  // They never depended on this pre-resume.
}
