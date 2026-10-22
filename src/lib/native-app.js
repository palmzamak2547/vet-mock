// ============================================================
// native-app.js — this web build inside the VetMock Android app
// ============================================================
// The Android app (mobile/, docs/ADR-android-app.md) serves this same build
// from its own storage under https://vetmock.com. This file is the one place
// the web code learns that; in a browser it defines nothing and does nothing.
//
// Inside the app it:
//   • defines window.VetMockApp, the small API other modules feature-detect
//     (haptic, studyDay, notifications, reminders, happyMoment, googleIdToken);
//   • fills what Android's WebView lacks: navigator.share with files,
//     speechSynthesis (Android's own voices, for read-aloud without a clip),
//     and display-mode: standalone (the app is installed by definition);
//   • tells the native shell when the first screen has painted (the splash
//     stays until then, so there is no blank frame), which theme the student
//     picked (the next launch opens in it) and the next exam (the widget
//     counts down to it).
// main.jsx imports it before anything that registers the service worker,
// which the app does not use: its bundle and updater do that job.
// ============================================================

const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;

/** True only inside the Android app. */
export const IS_APP = Boolean(cap?.isNativePlatform?.() && cap.getPlatform?.() === 'android');

const call = (method, options = {}) => cap.nativePromise('VetMock', method, options);
const quiet = (method, options) => { call(method, options).catch(() => {}); };

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

/** Replaces a browser property, including a read-only one (an assignment would throw in a module). */
function define(target, key, value) {
  Object.defineProperty(target, key, { value, configurable: true, writable: true, enumerable: true });
}

/** One failing piece of the app layer must never stop the page from starting. */
function guarded(name, fn) {
  try { return fn(); } catch (err) { console.error(`[native-app] ${name} failed`, err); return undefined; }
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

// ---- navigator.share, with files ---------------------------------------
const SHARE_FILE_MAX = 10 * 1024 * 1024;

function installShare() {
  if (typeof navigator.share === 'function') return;
  define(navigator, 'canShare', (data = {}) => {
    const files = data.files ? Array.from(data.files) : [];
    return files.every((f) => f instanceof Blob && f.size <= SHARE_FILE_MAX) && Boolean(files.length || data.text || data.url || data.title);
  });
  define(navigator, 'share', async (data = {}) => {
    if (!navigator.canShare(data)) throw new TypeError('Nothing this phone can share');
    const files = await Promise.all(Array.from(data.files || []).map(async (f, i) => ({
      name: f.name || `vetmock-${i}`,
      type: f.type || 'application/octet-stream',
      data: bytesToBase64(new Uint8Array(await f.arrayBuffer())),
    })));
    await call('share', { title: data.title, text: data.text, url: data.url, files });
  });
}

// ---- speechSynthesis, from Android's text-to-speech ----------------------
function installSpeech() {
  // The WebView's own speechSynthesis, where it exists, has no voices: Android's text-to-speech replaces it.
  const pending = new Map();
  let voices = [];
  let nextId = 0;
  const fire = (target, type, extra = {}) => {
    const ev = Object.assign(new Event(type), extra);
    try { target[`on${type}`]?.(ev); } catch { /* one handler must not stop the rest */ }
    for (const fn of target._listeners?.get(type) || []) { try { fn(ev); } catch { /* same */ } }
  };
  const eventTarget = (obj) => {
    obj._listeners = new Map();
    obj.addEventListener = (type, fn) => { if (!obj._listeners.has(type)) obj._listeners.set(type, new Set()); obj._listeners.get(type).add(fn); };
    obj.removeEventListener = (type, fn) => obj._listeners.get(type)?.delete(fn);
    return obj;
  };

  class SpeechSynthesisUtterance {
    constructor(text = '') {
      Object.assign(this, { text, lang: '', voice: null, rate: 1, pitch: 1, volume: 1 });
      eventTarget(this);
    }
  }

  const synth = eventTarget({
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => voices.slice(),
    speak(utterance) {
      const id = `u${++nextId}`;
      pending.set(id, utterance);
      synth.pending = true;
      const lang = utterance.voice?.lang || utterance.lang || 'th-TH';
      call('speak', { id, text: String(utterance.text || ''), lang, rate: utterance.rate || 1, pitch: utterance.pitch || 1 })
        .catch(() => { pending.delete(id); fire(utterance, 'error', { error: 'synthesis-unavailable' }); });
    },
    cancel() {
      quiet('stopSpeaking');
      for (const u of pending.values()) fire(u, 'end');
      pending.clear();
      Object.assign(synth, { speaking: false, pending: false });
    },
    pause() {},
    resume() {},
  });
  cap.addListener('VetMock', 'speech', ({ id, type }) => {
    const u = pending.get(id);
    if (!u) return;
    if (type === 'start') { synth.speaking = true; fire(u, 'start'); return; }
    pending.delete(id);
    Object.assign(synth, { speaking: pending.size > 0, pending: pending.size > 0 });
    fire(u, type === 'error' ? 'error' : 'end', type === 'error' ? { error: 'synthesis-failed' } : {});
  });

  // Android binds its speech engine asynchronously: ask until it answers.
  const loadVoices = (attempt = 0) => call('speechLanguages').then(({ languages = [] }) => {
    const wanted = languages.filter((l) => /^(th|en)\b/i.test(l));
    if (!wanted.length) { if (attempt < 4) setTimeout(() => loadVoices(attempt + 1), 400 * (attempt + 1)); return; }
    voices = wanted.map((lang) => ({
      name: /^th/i.test(lang) ? 'Android ไทย' : `Android ${lang}`,
      lang, voiceURI: `android:${lang}`, localService: true, default: /^th/i.test(lang),
    }));
    fire(synth, 'voiceschanged');
  }).catch(() => {});
  loadVoices();

  define(window, 'speechSynthesis', synth);
  define(window, 'SpeechSynthesisUtterance', SpeechSynthesisUtterance);
}

// ---- display-mode: standalone ---------------------------------------------
function installStandalone() {
  const matchMedia = window.matchMedia.bind(window);
  define(window, 'matchMedia', (query) => {
    if (/display-mode:\s*(standalone|fullscreen|minimal-ui)/.test(query)) {
      const standalone = /standalone/.test(query);
      return { matches: standalone, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false };
    }
    return matchMedia(query);
  });
}

// ---- first paint, theme, next exam ------------------------------------------
function reportFirstPaint() {
  const root = document.getElementById('root');
  const done = () => requestAnimationFrame(() => requestAnimationFrame(() => quiet('ready')));
  if (root?.firstElementChild) return done();
  const watch = new MutationObserver(() => {
    if (!root?.firstElementChild) return;
    watch.disconnect();
    done();
  });
  if (root) watch.observe(root, { childList: true });
  else window.addEventListener('DOMContentLoaded', reportFirstPaint, { once: true });
}

function syncTheme() {
  const send = () => {
    let pref = 'system';
    try { pref = JSON.parse(localStorage.getItem('vmx-theme')) || 'system'; } catch { /* default */ }
    const shown = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    quiet('setTheme', { pref, shown });
  };
  send();
  new MutationObserver(send).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

async function syncExam() {
  try {
    const year = JSON.parse(localStorage.getItem('vmx-selected-year'));
    if (!year) return;
    const { examWindowFor } = await import('./exam-countdown.js');
    const w = examWindowFor(`y${year}`);
    quiet('setExam', w ? { label: w.label, date: w.next.date } : {});
  } catch { /* the widget simply shows no exam */ }
}

// ---- the API other modules call ---------------------------------------------
if (IS_APP) {
  guarded('share', installShare);
  guarded('speech', installSpeech);
  guarded('standalone', installStandalone);

  window.VetMockApp = Object.freeze({
    /** Mochi's states as Android haptics: 'correct', 'wrong', 'milestone', 'tap'. */
    haptic(kind) { quiet('haptic', { kind }); return true; },
    /** After a saved set: updates the widget and cancels today's reminder. */
    studyDay({ streak = 0, answeredToday = 0, day } = {}) {
      quiet('studyDay', { streak, answeredToday, day });
      syncExam();
    },
    notifications: Object.freeze({
      status: () => call('notificationStatus').then((r) => r.state),
      request: () => call('requestNotifications').then((r) => r.state),
      openSettings: () => call('openNotificationSettings'),
    }),
    reminders: Object.freeze({
      get: () => call('getReminder'),
      /** minute = minutes past midnight in Bangkok; leave it out to follow the student's usual time. */
      set: ({ enabled = true, minute } = {}) => call('setReminder', { enabled, minute }),
    }),
    /** 'perfect-set' or 'streak-milestone': the app may ask for a Play review, at most once in 120 days. */
    happyMoment(kind) { quiet('happyMoment', { kind }); },
    /** Google sign-in through Android's account sheet: { idToken, nonce } for supabase.auth.signInWithIdToken. */
    async googleIdToken() {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) throw new Error('NO_GOOGLE_CLIENT_ID');
      const nonce = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
      const { idToken } = await call('googleIdToken', { clientId, nonce: await sha256Hex(nonce) });
      return { idToken, nonce };
    },
    bundle: () => call('bundleStatus'),
  });

  guarded('first paint', reportFirstPaint);
  guarded('theme', syncTheme);
  syncExam();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncExam(); });
}
