// ============================================================
// read-aloud-live.test.mjs — every question either speaks or says why
// ============================================================
// lib/read-aloud.js reads a question from stored clips, else from the live
// voices: the device's own voice in sentence-sized pieces, else the cloud
// voice. Here the clip host, the cloud voice and the device's speech engine
// are fakes the tests control, so each failure a student can meet is played
// out: no Thai voice on the device, a clip that does not arrive, a long
// explanation, a move to the next question while one is speaking.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

let manifest = [];
const late = new Map(); // clip key -> ms before it arrives
let cloud = 'ok'; // 'ok' | 'signin' (401) | 'offline'
const cloudAsked = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.startsWith('/api/')) {
    if (cloud === 'offline') throw new TypeError('Failed to fetch');
    const { text } = JSON.parse(Buffer.from(String(init.body).slice(4), 'base64').toString('utf8'));
    cloudAsked.push(text);
    if (cloud === 'signin') return new Response('{"error":"signin_required"}', { status: 401 });
    return new Response(new TextEncoder().encode(`cloud:${text}`), { status: 200 });
  }
  if (u.includes('/m/')) return new Response(JSON.stringify(u.includes('/e1/') ? manifest : []), { status: 200 });
  if (u.endsWith('.json')) return new Response('no', { status: 404 });
  const key = u.match(/([0-9a-f]{16})\.mp4$/)[1];
  if (late.has(key)) await new Promise((r, j) => { const t = setTimeout(r, late.get(key)); init.signal?.addEventListener('abort', () => { clearTimeout(t); j(new DOMException('aborted', 'AbortError')); }); });
  return new Response(new TextEncoder().encode(`clip:${key}`), { status: 200 });
};
globalThis.Blob = class { constructor(parts) { this.parts = parts; } };
const blobText = new Map();
globalThis.URL.createObjectURL = (b) => { const id = `blob:t/${blobText.size + 1}`; blobText.set(id, new TextDecoder().decode(new Uint8Array(b.parts[0]))); return id; };
globalThis.URL.revokeObjectURL = () => {};

const PLAY_MS = 30;
const played = []; // what the element played
class FakeAudio {
  constructor() { this.l = {}; this.paused = true; this.ended = false; this.currentTime = 0; this.playbackRate = 1; this.s = ''; }
  get src() { return this.s; }
  set src(v) { this.s = v; this.currentTime = 0; }
  addEventListener(t, f) { (this.l[t] ||= []).push(f); }
  removeEventListener() {}
  emit(t) { for (const f of this.l[t] || []) f(); }
  setAttribute() {}
  removeAttribute(k) { if (k === 'src') this.s = ''; }
  load() {}
  canPlayType() { return 'probably'; }
  play() {
    clearTimeout(this.t);
    this.paused = false; this.ended = false;
    const src = this.s;
    if (src.startsWith('blob:')) played.push(blobText.get(src));
    queueMicrotask(() => { this.emit('loadedmetadata'); this.emit('playing'); });
    this.t = setTimeout(() => { if (this.s !== src) return; this.paused = true; this.ended = true; this.emit('ended'); }, src.startsWith('data:') ? 1 : PLAY_MS);
    return Promise.resolve();
  }
  pause() { clearTimeout(this.t); if (!this.paused) { this.paused = true; this.emit('pause'); } }
}
globalThis.Audio = FakeAudio;

// The device's speech engine: voices the test sets; each utterance starts at
// once and ends SPEAK_MS later unless cancelled. mute: the engine takes
// utterances and never reports back (a device with no voice for them).
const SPEAK_MS = 25;
let voices = [];
let mute = false;
const said = []; // { text, rate, lang }
let current = null;
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
const synth = {
  speak(u) {
    current = u;
    if (mute) return;
    said.push({ text: u.text, rate: u.rate, lang: u.lang });
    setTimeout(() => { if (current !== u) return; u.onstart?.(); u.t = setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, SPEAK_MS); }, 1);
  },
  cancel() { const u = current; current = null; if (u) { clearTimeout(u.t); u.onerror?.({ error: 'interrupted' }); } },
  getVoices: () => voices,
  addEventListener() {}, removeEventListener() {},
};
globalThis.window = {
  speechSynthesis: synth,
  localStorage: (() => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; })(),
  addEventListener() {},
  matchMedia: () => ({ matches: true }),
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const text = await import('../../src/lib/tts-text.js');
const store = await import('../../src/lib/read-aloud-store.js');
const eng = await import('../../src/lib/read-aloud.js');
// The live voices' code and the clip names' hashing, warm as a page has them
// a moment after the first tap (the first call of each builds its tables).
const live = await import('../../src/lib/tts.js');
await live.livePlan({ stem: 'ข้อใด PRRS', options: [] });
await text.clipKey('warm', text.ELEVEN_TTS);

const kanya = { name: 'Kanya', lang: 'th-TH', voiceURI: 'Kanya', localService: true };
const samantha = { name: 'Samantha', lang: 'en-US', voiceURI: 'Samantha', localService: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (cond, ms = 4000) => { const t0 = Date.now(); while (!cond()) { if (Date.now() - t0 > ms) throw new Error('timed out'); await sleep(5); } };
const job = (id, stem, options, extra = {}) => ({ id, what: 'q', title: 'อ่านคำถาม', subject: `s-${id}`, stem, options, explain: '', container: () => null, ...extra });
async function keysOf(stem, options) {
  const lang = text.questionLang(stem, options);
  const out = [await text.clipKey(text.clipText(stem, lang), text.ELEVEN_TTS)];
  for (let i = 0; i < options.length; i++) out.push(await text.clipKey(text.optionLabel(i, lang), text.ELEVEN_TTS), await text.clipKey(text.clipText(options[i], lang), text.ELEVEN_TTS));
  return out;
}
function reset() { manifest = []; late.clear(); cloud = 'ok'; cloudAsked.length = 0; played.length = 0; said.length = 0; voices = [kanya, samantha]; mute = false; }

test('a device with a good Thai voice reads a question with no clips at once, in its own voice', async () => {
  reset();
  const t0 = Date.now();
  await eng.start(job('a', 'ข้อใดเป็นสาเหตุของโรค PRRS ในสุกร', ['Arterivirus', 'Circovirus']));
  await until(() => store.readAloud.get().status === 'playing');
  assert.ok(Date.now() - t0 < 1000, 'speaking within a second');
  assert.equal(store.readAloud.get().device, true);
  await until(() => store.readAloud.get().status === 'idle');
  assert.equal(said.length, 5, 'stem, then label and option for each row');
  assert.equal(cloudAsked.length, 0, 'nothing went to the cloud voice');
  assert.match(said[1].text, /ตัวเลือก A/);
});

test('no Thai voice on the device: the cloud voice reads it on the same player', async () => {
  reset();
  voices = [samantha];
  await eng.start(job('b', 'ข้อใดเป็นสาเหตุของโรค PRRS ในสุกร', ['Arterivirus', 'Circovirus']));
  await until(() => store.readAloud.get().status === 'idle');
  assert.equal(said.length, 0);
  assert.equal(played.length, 5);
  assert.ok(played.every((p) => p.startsWith('cloud:')));
});

test('no Thai voice and no cloud voice: a plain note says why and what to do, never silence', async () => {
  reset();
  voices = [samantha];
  cloud = 'signin';
  await eng.start(job('c', 'ข้อใดเป็นสาเหตุของโรค PRRS ในสุกร', ['Arterivirus', 'Circovirus']));
  await until(() => store.readAloud.get().status === 'error');
  assert.match(store.readAloud.get().note, /ไม่มีเสียงอ่านภาษาไทย/);
  assert.match(store.readAloud.get().note, /ตั้งค่า/);
  // Play tries again from the first choice: with the cloud voice back it reads.
  cloud = 'ok';
  eng.resume();
  await until(() => played.length > 0);
  eng.stop();
});

test('signed out with no Thai voice: the note names the sign-in, and the next question does not ask the cloud again', async () => {
  reset();
  voices = [samantha];
  cloud = 'signin';
  await eng.start(job('c2', 'ข้อใดเป็นสาเหตุของโรค PRRS ในสุกร', ['Arterivirus']));
  await until(() => store.readAloud.get().status === 'error');
  assert.match(store.readAloud.get().note, /เข้าสู่ระบบด้วยอีเมลจุฬา/);
  const asked = cloudAsked.length;
  await eng.start(job('c3', 'ข้อใดเป็นยาปฏิชีวนะ', ['Amoxicillin']));
  await until(() => store.readAloud.get().status === 'error' && store.readAloud.get().job?.id === 'c3');
  assert.equal(cloudAsked.length, asked, 'no second refused request');
  assert.match(store.readAloud.get().note, /เข้าสู่ระบบด้วยอีเมลจุฬา/);
  eng.stop();
});

test('a note given before any piece existed: play still tries again', async () => {
  reset();
  // A question with nothing to say (only marks) has no pieces: the note comes first.
  await eng.start(job('e0', '✅', []));
  await until(() => store.readAloud.get().status === 'error');
  const seen = [];
  const off = store.readAloud.subscribe(() => seen.push(store.readAloud.get().status));
  eng.resume();
  await until(() => seen.includes('loading') && store.readAloud.get().status === 'error');
  off();
  eng.stop();
});

test('the device voice is given every letter of an English question', async () => {
  reset();
  await eng.start(job('en', 'Which drug is used against Ascaris suum in pigs? Give the dose.', ['Ivermectin', 'Fenbendazole tablets']));
  await until(() => store.readAloud.get().status === 'idle');
  const heard = said.map((s) => s.text).join(' | ');
  for (const w of ['is used', 'Ascaris suum', 'pigs', 'dose', 'Fenbendazole tablets']) assert.ok(heard.includes(w), `"${w}" in ${heard}`);
});

test('a device that takes the speech and never speaks is found out, and the cloud voice reads instead', async () => {
  reset();
  mute = true; // Kanya is listed, but nothing ever starts
  const t0 = Date.now();
  await eng.start(job('d', 'ข้อใดเป็นสาเหตุของโรค PRRS ในสุกร', ['Arterivirus']));
  await until(() => played.length > 0, eng.NO_START_FIRST_MS + 2000);
  assert.ok(Date.now() - t0 < eng.NO_START_FIRST_MS + 1000);
  eng.stop();
  mute = false;
});

test('a stored clip that does not arrive in time: the live voice reads the whole question, in one voice', async () => {
  reset();
  const stem = 'ข้อใดเป็นอาการของโรค ASF';
  const options = ['ไข้สูง', 'ขาเจ็บ'];
  manifest = await keysOf(stem, options);
  late.set(manifest[0], eng.FIRST_WAIT_MS + 3000);
  const t0 = Date.now();
  await eng.start(job('e', stem, options));
  await until(() => said.length > 0, eng.FIRST_WAIT_MS + 1500);
  const waited = Date.now() - t0;
  assert.ok(waited >= eng.FIRST_WAIT_MS - 50 && waited < eng.FIRST_WAIT_MS + 1000, `fell back after ${waited} ms`);
  await until(() => store.readAloud.get().status === 'idle');
  assert.equal(played.length, 0, 'no clip joined in late: one voice for the question');
  assert.equal(said.length, 5);
});

test('a long explanation is spoken to its end, in pieces every engine can say', async () => {
  reset();
  const sentence = 'ยา Tiamulin ขนาด 10 mg/kg ใช้รักษาโรคบิดมูกเลือดในสุกร และต้องหยุดยาก่อนส่งโรงฆ่าตามระยะหยุดยา. ';
  const explain = sentence.repeat(30); // about 2,800 characters
  const ex = { id: 'f:explain', what: 'explain', title: 'อ่านเหตุผล', subject: 's-f', stem: '', options: [], explain, container: () => null };
  await eng.start(ex);
  await until(() => store.readAloud.get().status === 'idle', 15000);
  assert.ok(said.length >= 15, `${said.length} pieces`);
  assert.ok(said.every((s) => s.text.length <= 400), 'no piece near the length engines cut off');
  const heard = said.map((s) => s.text).join(' ');
  assert.equal((heard.match(/10 มิลลิกรัม ต่อ กิโลกรัม|10 มิลลิกรัมต่อกิโลกรัม/g) || []).length, 30, 'every sentence, the last one too');
});

test('moving to the next question stops the old voice at once; nothing of it is heard after', async () => {
  reset();
  const long = 'ข้อใดถูกต้องเกี่ยวกับการให้วัคซีนอหิวาต์สุกรในฟาร์มที่มีการระบาด. '.repeat(6);
  await eng.start(job('g1', long, ['ก', 'ข']));
  await until(() => said.length === 1);
  await eng.start(job('g2', 'ข้อใดเป็นยาปฏิชีวนะ', ['Amoxicillin', 'Ivermectin']));
  await until(() => store.readAloud.get().status === 'idle');
  const fromFirst = said.slice(1).filter((s) => /อหิวาต์/.test(s.text));
  assert.equal(fromFirst.length, 0, 'the first question said nothing more');
});

test('the device voice pauses, resumes on the same sentence, and takes the speed', async () => {
  reset();
  const stem = 'ข้อใดเป็นสาเหตุของโรคไข้หวัดใหญ่ในสุกร. สุกรมีไข้และไอ. '.repeat(3);
  eng.setRate(1.5);
  await eng.start(job('h', stem, ['Influenza A', 'PRRSV']));
  await until(() => said.length === 1);
  assert.ok(Math.abs(said[0].rate - 1.5) < 0.01, `rate ${said[0].rate}`);
  eng.pause();
  assert.equal(store.readAloud.get().status, 'paused');
  await sleep(SPEAK_MS * 3);
  assert.equal(said.length, 1, 'nothing spoken while paused');
  eng.resume();
  await until(() => said.length === 2);
  assert.equal(said[1].text, said[0].text, 'the interrupted sentence again');
  eng.next();
  await until(() => said.length >= 3);
  eng.stop();
  eng.setRate(1);
});
