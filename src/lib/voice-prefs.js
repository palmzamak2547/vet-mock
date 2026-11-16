// ============================================================
// voice-prefs — how the listener wants the read-aloud to sound
// ============================================================
// Speed, tone and which of the device's own voices reads, kept on this device
// in the voice settings' own local key ('vmx-tts-prefs', the one the voice
// settings have always used). Nothing here goes through the sync engine, and
// nothing here ever asks a paid voice for anything: speed plays a stored clip
// faster with its pitch kept, tone and the voice choice apply to the device's
// own voice. Small and free of imports, so the bar and the store can read it
// from the first render.
// ============================================================

import { readStoredJson } from './stored-json.js';

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
const subs = new Set();

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
  for (const f of subs) f();
  return next;
}

export function subscribeVoicePrefs(f) {
  subs.add(f);
  return () => subs.delete(f);
}

// Another tab of the app changed them: read again.
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('storage', (e) => {
      if (e.key !== PREFS_KEY && e.key !== null) return;
      cached = null;
      for (const f of subs) f();
    });
  } catch { /* no window events */ }
}

/** For tests: forget what was read. */
export function _resetVoicePrefsCache() { cached = null; }
