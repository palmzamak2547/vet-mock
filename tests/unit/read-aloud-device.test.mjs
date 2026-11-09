// ============================================================
// read-aloud-device.test.mjs — the live voices, for a question with no clips
// ============================================================
// lib/read-aloud.js hands a question with no complete clip set to the live
// voices in lib/tts.js (device mode). Here the device has one Windows Thai
// voice, the standard kind, so the cloud voices behind /api read first. The
// requests, the audio they send back and the device's own speech are fakes
// the tests control.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

// /api/tts-iapp and /api/tts. Text with อัลฟา (the first question) gets its
// answer late, a server error, unless its request is aborted first; the rest
// answer at once, with their own text as the audio.
const LATE_MS = 300;
let offline = false;
const requests = []; // { text, signal }
globalThis.fetch = async (url, init = {}) => {
  if (offline || !String(url).startsWith('/api/')) throw new TypeError('Failed to fetch');
  const { text } = JSON.parse(Buffer.from(String(init.body).slice(4), 'base64').toString('utf8'));
  const { signal } = init;
  requests.push({ text, signal });
  if (!/อัลฟา/.test(text)) return new Response(new TextEncoder().encode(text), { status: 200 });
  const aborted = () => new DOMException('The operation was aborted', 'AbortError');
  if (signal?.aborted) throw aborted();
  await new Promise((resolve, reject) => {
    const t = setTimeout(resolve, LATE_MS);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(aborted()); }, { once: true });
  });
  return new Response('bad gateway', { status: 502 });
};

// Each sentence's audio is a blob URL that remembers its text.
globalThis.Blob = class { constructor(parts) { this.parts = parts; } };
const blobText = new Map();
globalThis.URL.createObjectURL = (b) => {
  const id = `blob:test/${blobText.size + 1}`;
  blobText.set(id, new TextDecoder().decode(new Uint8Array(b.parts[0])));
  return id;
};
globalThis.URL.revokeObjectURL = () => {};

// The read-aloud's own element cannot decode the clips, so every question
// goes to the live voices. Each sentence's Audio "plays" for SENTENCE_MS and
// records whether something paused it before its end.
const SENTENCE_MS = 1000;
const heard = []; // { text, cut }
class FakeAudio extends EventTarget {
  constructor(src = '') { super(); this.src = src; this.paused = true; this.ended = false; this.currentTime = 0; this.playbackRate = 1; }
  setAttribute() {}
  removeAttribute(k) { if (k === 'src') this.src = ''; }
  load() {}
  canPlayType() { return ''; }
  play() {
    this.paused = false;
    this.rec = { text: blobText.get(this.src), cut: false };
    heard.push(this.rec);
    this.t = setTimeout(() => { this.paused = true; this.ended = true; this.dispatchEvent(new Event('ended')); }, SENTENCE_MS);
    return Promise.resolve();
  }
  pause() {
    clearTimeout(this.t);
    if (!this.paused && !this.ended && this.rec) this.rec.cut = true;
    this.paused = true;
  }
}
globalThis.Audio = FakeAudio;

// One Windows voice, Pattara. speaks: whether the device can say a sentence;
// when it cannot, the utterance fails at once.
let speaks = true;
const spoken = [];
const pattara = { name: 'Microsoft Pattara - Thai (Thailand)', lang: 'th-TH', voiceURI: 'Microsoft Pattara - Thai (Thailand)', localService: true };
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
globalThis.window = {
  speechSynthesis: {
    speak(u) {
      spoken.push(u.text);
      setTimeout(() => { if (speaks) { u.onstart?.(); u.onend?.(); } else u.onerror?.(); }, 1);
    },
    cancel() {},
    getVoices: () => [pattara],
    addEventListener() {},
    removeEventListener() {},
  },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  addEventListener() {},
  matchMedia: () => ({ matches: true }),
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const store = await import('../../src/lib/read-aloud-store.js');
const eng = await import('../../src/lib/read-aloud.js');
const iapp = await import('../../src/lib/tts-iapp.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (cond, ms = 2000) => { const t0 = Date.now(); while (!cond()) { if (Date.now() - t0 > ms) throw new Error('timed out'); await sleep(5); } };
const job = (id, stem, options) => ({ id, what: 'q', title: 'อ่านคำถาม', subject: 'subject-without-clips', stem, options, explain: '', container: () => null });

test('a reading stopped while its voice downloads stops those downloads, and cuts off nothing after it', async () => {
  await eng.start(job('q1', 'ข้อใดเป็นสาเหตุของโรคอัลฟา', ['เชื้อไวรัสอัลฟา', 'เชื้อแบคทีเรียอัลฟา']));
  assert.equal(store.readAloud.get().device, true);
  await until(() => requests.length > 0); // the first question's voice is downloading
  await eng.start(job('q2', 'ข้อใดเป็นสาเหตุของโรคเบตา', ['เชื้อราเบตา', 'พยาธิเบตา'])); // the student moves on
  await until(() => heard.length > 0); // the second question's stem plays
  const first = requests.filter((r) => /อัลฟา/.test(r.text));
  assert.ok(first.length > 0 && first.every((r) => r.signal?.aborted), 'the first question\'s downloads stopped with it');
  await sleep(LATE_MS + 100); // past the time its server would have failed
  assert.match(heard[0].text, /เบตา/);
  assert.equal(heard[0].cut, false, 'the second question\'s stem plays on');
  assert.equal(iapp.isIAppAvailable(), true, 'no voice is turned off for the rest of the session');
  eng.stop();
});

test('a device that cannot read the question says so, and the note stays until the student closes it', async () => {
  offline = true; // the cloud voices are out of reach
  speaks = false; // and the device cannot say it either
  spoken.length = 0;
  try {
    await eng.start(job('e1', 'Which drug treats canine heartworm?', ['Melarsomine', 'Amoxicillin']));
    await until(() => spoken.length > 0);
    await sleep(30);
    const s = store.readAloud.get();
    assert.equal(s.job?.id, 'e1', 'the bar is still up');
    assert.equal(s.status, 'error');
    assert.equal(s.note, 'ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง');
    eng.stop(); // the student closes the bar
    assert.equal(store.readAloud.get().job, null);
  } finally {
    offline = false;
    speaks = true;
  }
});
