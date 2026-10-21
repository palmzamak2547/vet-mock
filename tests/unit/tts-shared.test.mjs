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
let manifest = [];
globalThis.fetch = async (url) => {
  requested.push(String(url));
  if (String(url).includes('/m/')) return new Response(JSON.stringify(manifest), { status: 200 });
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
