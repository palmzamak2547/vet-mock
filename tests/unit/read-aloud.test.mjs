// ============================================================
// read-aloud.test.mjs — the clip player: order, controls, the iOS primer
// ============================================================
// lib/read-aloud.js plays a question's clips on one audio element. Here the
// element is a fake that "plays" each clip for a few milliseconds, so the
// tests read what the engine did: which pieces, in what order, and what the
// store said. Pure helpers (the text map behind the highlight, a clip's
// length from its MP4 header, long text in pieces) are checked directly.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

const CLIP_MS = 15;
const played = [];
let manifest = [];

// A clip's bytes: the key, then an 'mvhd' box saying 2 s (timescale 1000).
function clipBytes(key) {
  const head = new TextEncoder().encode(key);
  const buf = new ArrayBuffer(64);
  const v = new DataView(buf);
  new Uint8Array(buf).set(head, 0);
  v.setUint32(20, 0x6d766864); // 'mvhd' at 20, version 0
  v.setUint32(36, 1000);       // timescale
  v.setUint32(40, 2000);       // duration
  return buf;
}
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/m/')) return new Response(JSON.stringify(u.includes('/e1/') ? manifest : []), { status: 200 });
  if (u.endsWith('.json')) return new Response('no', { status: 404 });
  const key = u.match(/([0-9a-f]{16})\.mp4$/)[1];
  return new Response(clipBytes(key), { status: 200 });
};
let blobs = 0;
const blobKey = new Map();
globalThis.Blob = class { constructor(parts) { this.parts = parts; } };
globalThis.URL.createObjectURL = (b) => { const id = `blob:test/${++blobs}`; blobKey.set(id, new TextDecoder().decode(new Uint8Array(b.parts[0]).slice(0, 16))); return id; };
globalThis.URL.revokeObjectURL = () => {};

// One fake media element: play() resolves, then 'playing', and CLIP_MS
// later 'ended' (a data: sound ends at once, as the 1-sample primer does).
class FakeAudio {
  constructor() { this.l = {}; this.paused = true; this.ended = false; this.currentTime = 0; this.playbackRate = 1; this.src = ''; this.attrs = {}; }
  addEventListener(t, f) { (this.l[t] ||= []).push(f); }
  removeEventListener() {}
  emit(t) { for (const f of this.l[t] || []) f(); }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return k === 'src' ? this.src : this.attrs[k]; }
  removeAttribute(k) { if (k === 'src') this.src = ''; }
  load() {}
  canPlayType() { return 'probably'; }
  play() {
    clearTimeout(this.t);
    this.paused = false; this.ended = false;
    const src = this.src;
    if (src.startsWith('blob:')) played.push(blobKey.get(src));
    queueMicrotask(() => this.emit('playing'));
    this.t = setTimeout(() => { if (this.src !== src) return; this.paused = true; this.ended = true; this.emit('ended'); }, src.startsWith('data:') ? 1 : CLIP_MS);
    return Promise.resolve();
  }
  pause() { clearTimeout(this.t); if (!this.paused) { this.paused = true; this.emit('pause'); } }
}
globalThis.Audio = FakeAudio;
globalThis.window = { localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, addEventListener() {}, matchMedia: () => ({ matches: true }) };
globalThis.localStorage = globalThis.window.localStorage;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const text = await import('../../src/lib/tts-text.js');
const store = await import('../../src/lib/read-aloud-store.js');
const eng = await import('../../src/lib/read-aloud.js');
const { speechPieces } = await import('../../src/lib/tts.js');

const until = async (cond, ms = 2000) => { const t0 = Date.now(); while (!cond()) { if (Date.now() - t0 > ms) throw new Error('timed out'); await new Promise((r) => setTimeout(r, 5)); } };
async function keysOf(stem, options) {
  const lang = text.questionLang(stem, options);
  const out = [await text.clipKey(text.clipText(stem, lang), text.ELEVEN_TTS)];
  for (let i = 0; i < options.length; i++) out.push(await text.clipKey(text.optionLabel(i, lang), text.ELEVEN_TTS), await text.clipKey(text.clipText(options[i], lang), text.ELEVEN_TTS));
  return out;
}
const job = (id, stem, options) => ({ id, what: 'q', title: 'อ่านคำถาม', subject: `subject-${id}`, stem, options, explain: '', container: () => null });

test('a question plays stem, then label and option for each row, then stops', async () => {
  const stem = 'ข้อใดเป็นสาเหตุของ PRRS';
  const options = ['Arterivirus', 'Circovirus'];
  manifest = await keysOf(stem, options);
  played.length = 0;
  store.primePlayer(); // the tap: a silent sound whose 'ended' must not advance the job
  await eng.start(job('a', stem, options));
  await until(() => store.readAloud.get().status === 'idle');
  assert.deepEqual(played, manifest);
  assert.equal(store.readAloud.get().job, null);
});

test('the total length comes from the clips themselves', async () => {
  const stem = 'ข้อใดถูกต้องเกี่ยวกับ ASF';
  const options = ['ติดต่อผ่านเห็บ Ornithodoros', 'มีวัคซีนใช้ทั่วไป'];
  manifest = await keysOf(stem, options);
  played.length = 0;
  await eng.start(job('b', stem, options));
  await until(() => store.readAloud.get().duration === 10); // five clips of 2 s
  assert.equal(store.readAloud.get().points, 3); // the stem and two rows
  eng.stop();
});

test('pausing between two pieces resumes on the next one, not a replay', async () => {
  const stem = 'ข้อใดเป็นเชื้อแบคทีเรีย';
  const options = ['Salmonella', 'Rotavirus'];
  manifest = await keysOf(stem, options);
  played.length = 0;
  await eng.start(job('c', stem, options));
  await until(() => played.length === 1 && store.playerElement().ended); // the stem just ended: in the gap
  eng.toggle();
  assert.equal(store.readAloud.get().status, 'paused');
  await new Promise((r) => setTimeout(r, 500)); // longer than any gap
  assert.equal(played.length, 1, 'nothing plays while paused');
  eng.toggle();
  await until(() => store.readAloud.get().status === 'idle');
  assert.deepEqual(played, manifest);
});

test('next and previous move by point; past the last one the reading ends', async () => {
  const stem = 'ข้อใดเกี่ยวกับ Marek disease';
  const options = ['Herpesvirus', 'Retrovirus', 'Paramyxovirus'];
  manifest = await keysOf(stem, options);
  played.length = 0;
  await eng.start(job('d', stem, options));
  await until(() => played.length === 1);
  eng.next();
  await until(() => store.readAloud.get().option === 0);
  assert.equal(store.readAloud.get().kind, 'label');
  eng.next(); eng.next(); eng.next();
  await until(() => store.readAloud.get().status === 'idle');
});

test('a question with no complete clip set is not played from clips', async () => {
  manifest = [];
  played.length = 0;
  await eng.start(job('e', 'ข้อใดถูก', ['ก', 'ข']));
  assert.equal(store.readAloud.get().device, true);
  assert.equal(played.length, 0);
  eng.stop();
});

test('the shown text maps onto the spoken one: symbols said in words still land on their phrase', () => {
  const spoken = 'fibrinogen มากกว่า 700 มิลลิกรัม';
  const shown = 'fibrinogen > 700 mg';
  const map = eng.align(spoken, shown);
  const at = (word) => spoken.indexOf(word);
  assert.equal(map[at('fibrinogen')], 0);
  assert.equal(map[at('700')], shown.indexOf('700'));
  assert.equal(map[at('มากกว่า')], -1, 'a word the screen does not show maps nowhere');
});

test('a clip length is read from its MP4 header', () => {
  assert.equal(eng.mp4Seconds(clipBytes('0000000000000000')), 2);
  assert.equal(eng.mp4Seconds(new ArrayBuffer(8)), 0);
});

test('long text goes to the live voices in pieces under 1,000 characters', () => {
  const line = 'ก'.repeat(400);
  const pieces = speechPieces(`${line}\n${line}\n${line}`);
  assert.equal(pieces.length, 2);
  assert.ok(pieces.every((p) => p.length <= 900));
  assert.deepEqual(speechPieces('สั้น'), ['สั้น']);
  const words = speechPieces(Array.from({ length: 300 }, () => 'คำ').join(' '));
  assert.ok(words.every((p) => p.length <= 900) && words.join(' ').split(' ').length === 300);
});
