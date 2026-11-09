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
let clipMs = CLIP_MS; // how long the fake element "plays" a clip
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
// Per key: a download that fails (until removed) or arrives late.
const failing = new Set();
const late = new Map(); // key -> ms
const delivered = []; // keys of the clips delivered
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/m/')) return new Response(JSON.stringify(u.includes('/e1/') ? manifest : []), { status: 200 });
  if (u.endsWith('.json')) return new Response('no', { status: 404 });
  const key = u.match(/([0-9a-f]{16})\.mp4$/)[1];
  if (late.has(key)) await new Promise((r) => setTimeout(r, late.get(key)));
  if (failing.has(key)) throw new TypeError('Failed to fetch');
  delivered.push(key);
  return new Response(clipBytes(key), { status: 200 });
};
let blobs = 0;
const blobKey = new Map();
globalThis.Blob = class { constructor(parts) { this.parts = parts; } };
globalThis.URL.createObjectURL = (b) => { const id = `blob:test/${++blobs}`; blobKey.set(id, new TextDecoder().decode(new Uint8Array(b.parts[0]).slice(0, 16))); return id; };
globalThis.URL.revokeObjectURL = () => {};

// One fake media element: play() resolves, then 'playing', and CLIP_MS
// later 'ended' (a data: sound ends at once, as the 1-sample primer does).
// A new src starts at 0, as in a browser. refuse: how many clips' play() it
// turns down, as a browser that will not play them does (it stays paused).
let refuse = 0;
class FakeAudio {
  constructor() { this.l = {}; this.paused = true; this.ended = false; this.currentTime = 0; this.playbackRate = 1; this.src = ''; this.attrs = {}; }
  get src() { return this.s; }
  set src(v) { this.s = v; this.currentTime = 0; }
  addEventListener(t, f) { (this.l[t] ||= []).push(f); }
  removeEventListener() {}
  emit(t) { for (const f of this.l[t] || []) f(); }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return k === 'src' ? this.src : this.attrs[k]; }
  removeAttribute(k) { if (k === 'src') this.src = ''; }
  load() {}
  canPlayType() { return 'probably'; }
  play() {
    if (refuse > 0 && this.src.startsWith('blob:')) { refuse--; return Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError')); }
    clearTimeout(this.t);
    this.paused = false; this.ended = false;
    const src = this.src;
    if (src.startsWith('blob:')) played.push(blobKey.get(src));
    queueMicrotask(() => { this.emit('loadedmetadata'); this.emit('playing'); });
    this.t = setTimeout(() => { if (this.src !== src) return; this.paused = true; this.ended = true; this.emit('ended'); }, src.startsWith('data:') ? 1 : clipMs);
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

// ---- the second review's cases (each failed on the code before its fix) ----

test('a clip that failed to download plays once the network is back', async () => {
  const stem = 'ข้อใดเป็นอาการของ Newcastle disease';
  const options = ['torticollis', 'cyanosis'];
  manifest = await keysOf(stem, options);
  failing.add(manifest[0]);
  played.length = 0;
  await eng.start(job('r1', stem, options));
  await until(() => store.readAloud.get().status === 'error');
  failing.delete(manifest[0]);
  eng.resume();
  await until(() => store.readAloud.get().status === 'idle');
  assert.deepEqual(played, manifest, 'the stem plays, then every row: nothing skipped, nothing stale');
});

test('seeking to a piece still downloading stops the old one at once', async () => {
  const stem = 'ข้อใดเป็นเชื้อก่อโรค PRRS';
  const options = ['Arterivirus', 'Asfivirus'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  late.set(manifest.at(-1), 600); // the last option arrives late
  played.length = 0;
  await eng.start(job('r2', stem, options));
  await until(() => played.length === 1);
  eng.seek(9); // inside the last option (five clips of 2 s)
  assert.equal(store.playerElement().paused, true, 'the stem stopped');
  await until(() => store.readAloud.get().status === 'idle', 4000);
  assert.deepEqual(played, [manifest[0], manifest.at(-1)], 'the target played; the stem did not end the job');
  clipMs = CLIP_MS;
  late.clear();
});

test('a pause taken in the gap belongs to that gap, not to the next jump', async () => {
  const stem = 'ข้อใดเป็นวัคซีนเชื้อเป็น';
  const options = ['Live vaccine', 'Killed vaccine'];
  manifest = await keysOf(stem, options);
  played.length = 0;
  await eng.start(job('r3', stem, options));
  await until(() => played.length === 1 && store.playerElement().ended); // in the gap after the stem
  eng.pause();
  eng.next(); // to row A's label
  await until(() => store.readAloud.get().kind === 'label');
  eng.resume();
  await until(() => played.length === 2);
  assert.equal(played[1], manifest[1], 'row A is read from its label');
  eng.stop();
});

test('stopping while a piece downloads keeps that piece as the place to resume', async () => {
  const stem = 'ข้อใดเป็นโรคติดต่อจากสัตว์สู่คน';
  const options = ['Rabies', 'Parvovirus'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  late.set(manifest[3], 800); // row B's label
  played.length = 0;
  await eng.start(job('r4', stem, options));
  await until(() => played.length === 1);
  // Every length is real by now except row B's label (late): 2+2+2+0.83+2 s.
  await until(() => store.readAloud.get().duration > 8);
  store.playerElement().currentTime = 1.5; // the stem, 1.5 s in
  eng.seek(6.1); // row B's label, still downloading
  assert.equal(store.readAloud.get().kind, 'label');
  eng.stop();
  late.clear();
  played.length = 0;
  await eng.start(job('r4', stem, options));
  await until(() => played.length === 1);
  assert.equal(played[0], manifest[3], 'it resumes at the piece it was moving to');
  // 0.1 s into that piece, where the seek put it: not 1.5 s, the stem's time.
  const t = store.playerElement().currentTime;
  assert.ok(Math.abs(t - 0.1) < 0.01, `resumed ${t} s into the piece`);
  eng.stop();
  clipMs = CLIP_MS;
});

test('the lock screen\'s pause never resumes, and its play never pauses', async () => {
  const stem = 'ข้อใดเป็นยาปฏิชีวนะ';
  const options = ['Amoxicillin', 'Ivermectin'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  played.length = 0;
  await eng.start(job('r5', stem, options));
  await until(() => store.readAloud.get().status === 'playing');
  eng.resume();
  assert.equal(store.readAloud.get().status, 'playing');
  eng.pause();
  eng.pause();
  assert.equal(store.readAloud.get().status, 'paused');
  eng.stop();
  clipMs = CLIP_MS;
});

// ---- a seek within one piece, next past the end, a refused clip ----
// (each failed on the code before its fix)

test('back within a piece that just ended reads that piece again', async () => {
  const stem = 'ข้อใดเป็นเชื้อแบคทีเรียก่อโรคในสุกร';
  const options = ['Salmonella', 'Rotavirus'];
  manifest = await keysOf(stem, options);
  // Paused in the gap after the stem, then back to its start, then play.
  played.length = 0;
  await eng.start(job('s1', stem, options));
  await until(() => played.length === 1 && store.playerElement().ended);
  eng.pause();
  eng.prev();
  eng.resume();
  await until(() => played.length === 2);
  assert.equal(played[1], manifest[0], 'paused in the gap: the stem again, not row A');
  eng.stop();
  // The same while the gap runs.
  played.length = 0;
  await eng.start(job('s2', stem, options));
  await until(() => played.length === 1 && store.playerElement().ended);
  eng.prev();
  await until(() => played.length === 2);
  assert.equal(played[1], manifest[0], 'in the gap: the stem again, not row A');
  eng.stop();
});

test('a seek within the piece still downloading starts it there, and is kept on stop', async () => {
  const stem = 'ข้อใดเป็นอาการที่พบบ่อยที่สุดของโรคไข้หวัดนกในไก่ไข่';
  const options = ['ซึม', 'ท้องเสีย'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  // The stem arrives late; the scrubber already works on the estimated lengths.
  late.set(manifest[0], 300);
  played.length = 0;
  eng.start(job('s3', stem, options));
  await until(() => store.readAloud.get().duration > 0);
  eng.seek(1.5);
  await until(() => played.length === 1);
  let t = store.playerElement().currentTime;
  assert.ok(Math.abs(t - 1.5) < 0.01, `the stem started ${t} s in`);
  eng.stop();
  // Stopped before it arrives: reopening starts at the seek.
  played.length = 0;
  eng.start(job('s3b', stem, options));
  await until(() => store.readAloud.get().duration > 0);
  eng.seek(1.5);
  eng.stop();
  late.clear();
  await eng.start(job('s3b', stem, options));
  await until(() => played.length === 1);
  t = store.playerElement().currentTime;
  assert.ok(Math.abs(t - 1.5) < 0.01, `reopened ${t} s into the stem`);
  eng.stop();
  clipMs = CLIP_MS;
});

test('a seek within a piece whose download failed plays it from there', async () => {
  const stem = 'ข้อใดเป็นอาการของโรคนิวคาสเซิลในไก่';
  const options = ['torticollis', 'cyanosis'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  failing.add(manifest[0]);
  played.length = 0;
  await eng.start(job('s4', stem, options));
  await until(() => store.readAloud.get().status === 'error');
  failing.delete(manifest[0]);
  eng.seek(1.5);
  eng.resume();
  await until(() => played.length === 1);
  assert.equal(played[0], manifest[0]);
  const t = store.playerElement().currentTime;
  assert.ok(Math.abs(t - 1.5) < 0.01, `the stem started ${t} s in`);
  eng.stop();
  clipMs = CLIP_MS;
});

test('next past the last point finishes the reading: playing it again starts at the stem', async () => {
  const stem = 'ข้อใดเป็นโรคที่ติดต่อผ่านยุง';
  const options = ['Heartworm', 'Leptospirosis'];
  manifest = await keysOf(stem, options);
  clipMs = 400;
  played.length = 0;
  await eng.start(job('n1', stem, options));
  await until(() => store.readAloud.get().duration === 10); // the points are 0, 2 and 6 s
  eng.next(); // row A
  await until(() => played.length === 2);
  eng.next(); // row B
  await until(() => played.length === 3);
  eng.next(); // past the last point
  assert.equal(store.readAloud.get().status, 'idle');
  played.length = 0;
  await eng.start(job('n1', stem, options));
  await until(() => played.length === 1);
  assert.equal(played[0], manifest[0], 'from the stem, as after reading to the end');
  eng.stop();
  clipMs = CLIP_MS;
});

test('a clip the browser refuses hands the reading to the live voices and leaves the element empty', async () => {
  const stem = 'ข้อใดเป็นเชื้อก่อโรคปากและเท้าเปื่อย';
  const options = ['Aphthovirus', 'Morbillivirus'];
  manifest = await keysOf(stem, options);
  const errors = [];
  const onError = (e) => errors.push(String(e?.message || e));
  process.on('unhandledRejection', onError);
  try {
    refuse = 1;
    delivered.length = 0;
    played.length = 0;
    await eng.start(job('f1', stem, options));
    assert.equal(store.readAloud.get().device, true, 'the live voices took over');
    // The other clips land after the hand-over.
    await until(() => manifest.every((k) => delivered.includes(k)));
    await new Promise((r) => setTimeout(r, 20));
    eng.stop();
    assert.deepEqual(errors, [], 'a clip that lands after the hand-over is no error');
    const el = store.playerElement();
    assert.equal(el.src.startsWith('blob:'), false, 'the refused clip left the element');
    store.primePlayer(); // the next tap
    assert.ok(el.src.startsWith('data:'), 'the next tap primes the element again');
  } finally {
    process.off('unhandledRejection', onError);
    refuse = 0;
  }
});
