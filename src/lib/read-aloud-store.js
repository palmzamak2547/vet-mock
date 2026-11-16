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

import { readStoredJson } from './stored-json.js';

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

// The speed the student picked last (kept with the voice settings below).
export function savedRate() {
  return getVoicePrefs().rate;
}

// ============================================================
// The voice settings: how the listener wants the read-aloud to sound
// ============================================================
// Speed, tone and which of the device's own voices reads, kept on this device
// in the voice settings' own local key ('vmx-tts-prefs', the one the voice
// settings have always used). Nothing here goes through the sync engine, and
// nothing here ever asks a paid voice for anything: speed plays a stored clip
// faster with its pitch kept, tone and the voice choice apply to the device's
// own voice. They live in this module, which every reader imports, so they never cost a
// request of their own on the first load.
// ============================================================

export const PREFS_KEY = 'vmx-tts-prefs';
// The speed before 5.249.0 lived in its own key: read once when the voice
// settings have never been saved in the new shape.
export const LEGACY_RATE_KEY = 'vmx-read-aloud-rate';

/** The speeds a listener can pick (a stored clip and the device voice alike). */
export const RATES = [0.75, 1, 1.25, 1.5, 2];
/** Tone of the device voice, low to high: SpeechSynthesisUtterance.pitch. */
export const PITCHES = [0.7, 0.85, 1, 1.15, 1.3];

export const DEFAULT_VOICE_PREFS = Object.freeze({ rate: 1, pitch: 1, voiceTh: '', voiceEn: '' });

const nearest = (list, value, fallback) => {
  const n = Number(value);
  if (value === null || value === '' || !Number.isFinite(n)) return fallback;
  return list.reduce((best, x) => (Math.abs(x - n) < Math.abs(best - n) ? x : best), list[0]);
};
const voiceId = (v) => (typeof v === 'string' ? v.slice(0, 200) : '');

/**
 * The settings from what is stored: any shape, any age. `raw` is the parsed
 * JSON of PREFS_KEY (or null); `legacyRate` the old speed key's string.
 * Out-of-range values snap to the nearest allowed one; anything unreadable
 * is the default. A value stored before 5.249.0 ({ afterStem, betweenOpts,
 * afterLast, speed }) has no `v`: its speed set a reader that no longer
 * reads, so the speed the bar used (the old key) carries over instead.
 */
export function sanitizeVoicePrefs(raw, legacyRate = null) {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const fresh = obj.v === 2;
  const rate = fresh
    ? nearest(RATES, obj.rate, DEFAULT_VOICE_PREFS.rate)
    : (typeof legacyRate === 'string' && RATES.includes(Number(legacyRate)) ? Number(legacyRate) : DEFAULT_VOICE_PREFS.rate);
  return {
    rate,
    pitch: fresh ? nearest(PITCHES, obj.pitch, DEFAULT_VOICE_PREFS.pitch) : DEFAULT_VOICE_PREFS.pitch,
    voiceTh: fresh ? voiceId(obj.voiceTh) : '',
    voiceEn: fresh ? voiceId(obj.voiceEn) : '',
  };
}


const storage = () => { try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; } };

let cached = null;
const prefSubs = new Set();

function read() {
  const ls = storage();
  if (!ls) return { ...DEFAULT_VOICE_PREFS };
  const raw = readStoredJson(PREFS_KEY, null, { storage: ls });
  let legacy = null;
  try { legacy = ls.getItem(LEGACY_RATE_KEY); } catch { legacy = null; }
  return sanitizeVoicePrefs(raw, legacy);
}

/** The listener's settings now (read once, then kept until they change). */
export function getVoicePrefs() {
  if (!cached) cached = read();
  return cached;
}

/** Change some settings: saved on this device at once, then every reader told. */
export function setVoicePrefs(patch) {
  const next = sanitizeVoicePrefs({ ...getVoicePrefs(), ...patch, v: 2 });
  cached = next;
  const ls = storage();
  if (ls) {
    try {
      // Fields an older reader left in the same key stay where they are.
      const old = readStoredJson(PREFS_KEY, null, { storage: ls });
      const keep = old && typeof old === 'object' && !Array.isArray(old) ? old : {};
      ls.setItem(PREFS_KEY, JSON.stringify({ ...keep, ...next, v: 2 }));
    } catch { /* private mode or a full store: the setting holds for this visit */ }
  }
  for (const f of prefSubs) f();
  return next;
}

export function subscribeVoicePrefs(f) {
  prefSubs.add(f);
  return () => prefSubs.delete(f);
}

// Another tab of the app changed them: read again.
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('storage', (e) => {
      if (e.key !== PREFS_KEY && e.key !== null) return;
      cached = null;
      for (const f of prefSubs) f();
    });
  } catch { /* no window events */ }
}

/** For tests: forget what was read. */
export function _resetVoicePrefsCache() { cached = null; }
