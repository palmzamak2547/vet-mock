// ============================================================
// tts-shared.test.mjs — pre-generated clips play first, in screen order
// ============================================================
// The read-aloud plays the clips scripts/tts-clips.mjs stored on
// tts.vetmock.com when the subject's manifest lists every one, and falls
// back to the live voices otherwise. The clip names are hashes of the
// spoken text: if the text rules change, every stored clip stops matching,
// so the first test pins one name.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

const played = [];
const requested = [];
let manifest = [];       // every generation's, unless manifestE1 is set
let manifestE1 = null;   // the ElevenLabs generation's own
globalThis.fetch = async (url) => {
  requested.push(String(url));
  const e1 = String(url).includes('/e1/m/') && manifestE1;
  if (String(url).includes('/m/')) return new Response(JSON.stringify(e1 || manifest), { status: 200 });
  const key = String(url).match(/([0-9a-f]{16})\.mp4$/)[1];
  return new Response(new TextEncoder().encode(key), { status: 200 });
};
globalThis.Blob = class { constructor(parts) { this.parts = parts; } };
globalThis.URL.createObjectURL = (b) => new TextDecoder().decode(b.parts[0]);
globalThis.URL.revokeObjectURL = () => {};
globalThis.Audio = class {
  constructor(src) { this.src = src; this.l = {}; }
  addEventListener(t, f) { this.l[t] = f; }
  dispatchEvent(e) { this.l[e.type]?.(); }
  pause() {}
  canPlayType() { return 'probably'; }
  play() { played.push({ key: this.src, rate: this.playbackRate }); setTimeout(() => this.l.ended?.(), 1); return Promise.resolve(); }
};
const spoken = [];
globalThis.window = {
  speechSynthesis: { speak: (u) => spoken.push(u), cancel() {}, getVoices: () => [], addEventListener() {}, removeEventListener() {} },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };

const text = await import('../../src/lib/tts-text.js');
const tts = await import('../../src/lib/tts.js');

test('clip text and names are stable (stored clips depend on them)', async () => {
  const t = text.clipText('ให้ **Enrofloxacin** 5 mg/kg q12h', 'th');
  assert.equal(t, 'ให้ Enrofloxacin 5 มิลลิกรัม ต่อ กิโลกรัม ทุก 12 ชั่วโมง');
  assert.equal(await text.clipKey(t), await text.clipKey(t));
  assert.equal(await text.clipKey('ตัวเลือก A'), 'c9490775ac83b134');
  assert.equal(text.optionLabel(1, 'th'), 'ตัวเลือก B');
  assert.equal(text.questionLang('Which of the following?'), 'en');
  assert.equal(text.questionLang('ข้อใดถูกต้องเกี่ยวกับ Marek disease'), 'th');
});

async function keysFor(stem, options, lang) {
  const k = (s) => text.clipKey(s);
  const out = [await k(text.clipText(stem, lang))];
  for (let i = 0; i < options.length; i++) out.push(await k(text.optionLabel(i, lang)), await k(text.clipText(options[i], lang)));
  return out;
}

test('every clip listed: plays stem, then label + option in the order given', async () => {
  const stem = 'ข้อใดเป็นสาเหตุของ Marek disease';
  const options = ['Herpesvirus', 'Avian leukosis virus'];
  const keys = await keysFor(stem, options, 'th');
  manifest = keys;
  played.length = 0; spoken.length = 0;
  let started = 0, ended = 0;
  await tts.speakQuestion({ stem, options, subject: 'avian-medicine', controller: { cancelled: false }, onStart: () => started++, onEnd: () => ended++ });
  assert.deepEqual(played.map((p) => p.key), keys);
  assert.equal(started, 1);
  assert.equal(ended, 1);
  assert.equal(spoken.length, 0, 'the device voice is not used');
  assert.ok(requested.some((u) => u === 'https://tts.vetmock.com/g1/m/avian-medicine.json'));
});

test('one clip missing from the manifest: nothing shared plays, the live chain runs', async () => {
  const stem = 'ข้อใดถูก';
  const options = ['ก', 'ข'];
  manifest = (await keysFor(stem, options, 'th')).slice(0, -1);
  played.length = 0;
  let ended = 0;
  await tts.speakQuestion({ stem, options, subject: 'other-subject', controller: { cancelled: false }, onEnd: () => ended++, onFail: () => {} });
  assert.equal(played.filter((p) => manifest.includes(p.key)).length, 0);
  assert.ok(ended >= 1, 'the read-aloud still ends');
});

test('speech text: markers dropped, comparisons said, step orders and pauses kept', () => {
  const say = (s) => text.clipText(s, 'th');
  assert.equal(say('❌ ทำไมข้ออื่นผิด\n— ข้อ ก ✅'), 'ทำไมข้ออื่นผิด\n— ข้อ ก');
  assert.equal(say('fibrinogen > 700 mg'), 'fibrinogen มากกว่า 700 มิลลิกรัม');
  assert.equal(say('> 700'), 'มากกว่า 700');
  assert.equal(say('2 > 4 > 1 > 3'), '2, 4, 1, 3');
  assert.equal(say('> อ้างอิง'), 'อ้างอิง');
  assert.equal(say('~135-150°C'), 'ประมาณ 135 ถึง 150 องศาเซลเซียส');
  assert.equal(say('มากกว่า 10^6 ตัว'), 'มากกว่า 10 ยกกำลัง 6 ตัว');
  assert.equal(say('P(D+|T+) = a'), 'P(D+|T+) = a');
  assert.equal(say('3.5 ซม. | edema · cervix'), '3.5 ซม.\nedema\ncervix');
  assert.equal(say('↑ Ca, ↓ K'), 'สูง Ca, ต่ำ K');
  // One '>' after a name ending in a digit compares; it does not order.
  assert.equal(say('HCO3 >32'), 'HCO3 มากกว่า 32');
  assert.equal(say('1.0\n> 1 มีแนวโน้ม shock'), '1.0\nมากกว่า 1 มีแนวโน้ม shock');
  assert.equal(say('pH 7.4 -> 7.2'), 'pH 7.4 ไป 7.2');
  assert.equal(say('ตัวผู้ ♂ ตัวเมีย ♀ A ↔ B'), 'ตัวผู้ ตัวผู้ ตัวเมีย ตัวเมีย A กับ B');
});

test('clip names carry the voice: the same text names a different ElevenLabs clip', async () => {
  const t = 'ตัวเลือก A';
  assert.equal(await text.clipKey(t), 'c9490775ac83b134');
  assert.notEqual(await text.clipKey(t, text.ELEVEN_TTS), await text.clipKey(t));
  assert.equal(text.clipUrl('abc', text.ELEVEN_TTS), 'https://tts.vetmock.com/e1/abc.mp4');
});

async function keysIn(g, stem, options, lang) {
  const k = (s) => text.clipKey(s, g);
  const out = [await k(text.clipText(stem, lang))];
  for (let i = 0; i < options.length; i++) out.push(await k(text.optionLabel(i, lang)), await k(text.clipText(options[i], lang)));
  return out;
}

test('the ElevenLabs voice reads a question that has every clip in it', async () => {
  const stem = 'ข้อใดเป็นสาเหตุของ PRRS';
  const options = ['Arterivirus', 'Circovirus'];
  const e1 = await keysIn(text.ELEVEN_TTS, stem, options, 'th');
  manifestE1 = e1;
  manifest = await keysIn(text.SHARED_TTS, stem, options, 'th');
  played.length = 0;
  await tts.speakQuestion({ stem, options, subject: 'swine-clinic', controller: { cancelled: false } });
  assert.deepEqual(played.map((p) => p.key), e1);
});

test('one ElevenLabs clip missing: the whole question reads in the older voice, never a mix', async () => {
  const stem = 'ข้อใดถูกต้องเกี่ยวกับ ASF';
  const options = ['ติดต่อผ่านเห็บ Ornithodoros', 'มีวัคซีนใช้ทั่วไป'];
  manifestE1 = (await keysIn(text.ELEVEN_TTS, stem, options, 'th')).slice(0, -1);
  const g1 = await keysIn(text.SHARED_TTS, stem, options, 'th');
  manifest = g1;
  played.length = 0;
  await tts.speakQuestion({ stem, options, subject: 'swine-ii', controller: { cancelled: false } });
  assert.deepEqual(played.map((p) => p.key), g1);
});

test('an explanation is one clip: read as a stem with no options', async () => {
  const explain = 'PPV คือโอกาสที่สัตว์ที่ให้ผลบวกจะเป็นโรคจริง\n❌ ทำไมข้ออื่นผิด\n— sensitivity เริ่มจากสัตว์ที่ป่วย';
  const key = await text.clipKey(text.clipText(explain, text.questionLang(explain, [])), text.ELEVEN_TTS);
  manifestE1 = [key];
  manifest = [];
  played.length = 0; spoken.length = 0;
  await tts.speakQuestion({ stem: explain, options: [], subject: 'epidemiology', controller: { cancelled: false } });
  assert.deepEqual(played.map((p) => p.key), [key]);
  assert.equal(spoken.length, 0);
  manifestE1 = null;
});
