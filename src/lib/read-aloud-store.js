// ============================================================
// read-aloud-store — the read-aloud player's state and its one audio
// element, small enough to load with the question
// ============================================================
// The engine (read-aloud.js) loads on the first tap; the buttons, the bar and
// the highlights read this store from the first render. One HTMLAudioElement
// plays every clip: iOS lets an element play from async code once a tap has
// played it, and one element keeps playing from clip to clip with the screen
// locked, where a new element per clip would need a new tap.
// ============================================================

import { getVoicePrefs } from './voice-prefs.js';

const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
let audio = null;

export function playerElement() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio();
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.setAttribute?.('playsinline', '');
  }
  return audio;
}

// First thing in a tap that may start reading, before any await: playing a
// silent sound on the element inside the tap is what lets the clip that
// arrives later play on iOS. Never interrupts a clip that is playing.
export function primePlayer() {
  const el = playerElement();
  // Playing, or holding a paused job's clip: the element is already
  // unlocked, and replacing its clip would lose where that job stopped.
  if (!el || !el.paused || el.src.startsWith('blob:')) return;
  try {
    el.muted = true;
    el.src = SILENT_WAV;
    el.play()?.then?.(() => { if (el.src === SILENT_WAV) el.pause(); }, () => {});
  } catch { /* a page with no audio support */ }
}

// status: idle | loading | playing | paused | error
// job: { id, what: 'q' | 'explain', title } of what is being read, or null.
// part, kind, option: the piece being read (option = its display index).
// time, duration: seconds through the whole job at 1x; device: live voices.
const IDLE = { job: null, status: 'idle', part: -1, kind: null, option: -1, time: 0, duration: 0, points: 0, rate: 1, note: null, device: false };
let state = IDLE;
const subs = new Set();

export const readAloud = {
  get: () => state,
  set(patch) {
    state = { ...state, ...patch };
    for (const f of subs) f();
  },
  reset(patch = {}) {
    state = { ...IDLE, rate: state.rate, ...patch };
    for (const f of subs) f();
  },
  subscribe(f) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

// The voice settings' sample and the reader never sound together: a sample
// pauses the reading through the reader's own pause (the bar shows it
// paused), and the reader stops a sample before it plays. `session.cloudRefused`:
// the cloud voice refused this visitor, so the device voice reads.
export const session = { cloudRefused: false, pause: null, stopSample: null };
export function pauseReading() { session.pause?.(); }
export function stopSampleSound() { const f = session.stopSample; session.stopSample = null; f?.(); }

// The speeds a student can pick, and the one they picked last (voice-prefs.js
// keeps it with the rest of the voice settings).
export { RATES } from './voice-prefs.js';
export function savedRate() {
  return getVoicePrefs().rate;
}
