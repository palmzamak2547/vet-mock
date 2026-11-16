// ============================================================
// voice-prefs.test.mjs — the listener's voice settings
// ============================================================
// lib/voice-prefs.js keeps speed, tone and the chosen device voice on this
// device; lib/tts.js reads them for the device voice and the ลองฟัง sample.
// Checked: the defaults, the bounds, a value stored in an older shape, a
// device with no Thai voice, a chosen voice the device no longer has, and
// that the sample never asks the network.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

let voices = [];
const said = [];
let current = null;
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
const synth = {
  speak(u) {
    current = u;
    said.push({ text: u.text, rate: u.rate, pitch: u.pitch, voice: u.voice?.name });
    setTimeout(() => { if (current !== u) return; u.onstart?.(); setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, 5); }, 1);
  },
  cancel() { const u = current; current = null; u?.onerror?.({ error: 'interrupted' }); },
  getVoices: () => voices,
  get speaking() { return Boolean(current); },
  pending: false,
  addEventListener() {}, removeEventListener() {},
};
const mem = new Map();
globalThis.window = {
  speechSynthesis: synth,
  localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) },
  addEventListener() {},
};
globalThis.localStorage = globalThis.window.localStorage;
let fetched = 0;
globalThis.fetch = async () => { fetched += 1; throw new TypeError('no network in this test'); };

const vp = { ...(await import('../../src/lib/voice-prefs.js')), ...(await import('../../src/lib/voice-choices.js')) };
const tts = await import('../../src/lib/tts.js');

const fresh = () => { mem.clear(); vp._resetVoicePrefsCache(); };
const KANYA = { name: 'Kanya', lang: 'th-TH', voiceURI: 'com.apple.voice.compact.th-TH.Kanya' };
const NARISA = { name: 'Narisa', lang: 'th-TH', voiceURI: 'com.apple.voice.enhanced.th-TH.Narisa' };
const PATTARA = { name: 'Microsoft Pattara - Thai (Thailand)', lang: 'th-TH', voiceURI: 'Microsoft Pattara - Thai (Thailand)' };
const SAMANTHA = { name: 'Samantha', lang: 'en-US', voiceURI: 'com.apple.voice.compact.en-US.Samantha' };

test('defaults: normal speed and tone, the reader picks the voice', () => {
  fresh();
  assert.deepEqual(vp.getVoicePrefs(), { rate: 1, pitch: 1, voiceTh: '', voiceEn: '' });
  assert.equal(vp.presetOf(vp.getVoicePrefs()), 'normal');
  assert.deepEqual(vp.sanitizeVoicePrefs(null), vp.DEFAULT_VOICE_PREFS);
  assert.deepEqual(vp.sanitizeVoicePrefs('garbage'), vp.DEFAULT_VOICE_PREFS);
  assert.deepEqual(vp.sanitizeVoicePrefs([1, 2]), vp.DEFAULT_VOICE_PREFS);
});

test('bounds: out-of-range or broken values snap to an allowed one', () => {
  const s = (o) => vp.sanitizeVoicePrefs({ v: 2, ...o });
  assert.equal(s({ rate: 9 }).rate, 2);
  assert.equal(s({ rate: 0.1 }).rate, 0.75);
  assert.equal(s({ rate: 1.3 }).rate, 1.25);
  assert.equal(s({ rate: 'fast' }).rate, 1);
  assert.equal(s({ rate: null }).rate, 1);
  assert.equal(s({ pitch: 5 }).pitch, 1.3);
  assert.equal(s({ pitch: -1 }).pitch, 0.7);
  assert.equal(s({ pitch: 0.9 }).pitch, 0.85);
  assert.equal(s({ pitch: Number.NaN }).pitch, 1);
  assert.equal(s({ voiceTh: 42 }).voiceTh, '');
  assert.equal(s({ voiceTh: 'x'.repeat(500) }).voiceTh.length, 200);
  for (const p of vp.PRESETS) {
    assert.ok(vp.RATES.includes(p.rate) && vp.PITCHES.includes(p.pitch), p.id);
    assert.equal(vp.presetOf(s({ rate: p.rate, pitch: p.pitch })), p.id);
  }
  assert.equal(vp.presetOf(s({ rate: 2, pitch: 1.3 })), null);
  assert.equal(vp.PITCH_LABELS.length, vp.PITCHES.length);
});

test('a value stored in the older shape: its speed came from the bar, its pauses stay', () => {
  fresh();
  mem.set('vmx-tts-prefs', JSON.stringify({ afterStem: 90, betweenOpts: 40, afterLast: 20, speed: 1.2 }));
  mem.set('vmx-read-aloud-rate', '1.5');
  assert.deepEqual(vp.getVoicePrefs(), { rate: 1.5, pitch: 1, voiceTh: '', voiceEn: '' });
  vp.setVoicePrefs({ pitch: 1.15 });
  const stored = JSON.parse(mem.get('vmx-tts-prefs'));
  assert.equal(stored.v, 2);
  assert.equal(stored.rate, 1.5);
  assert.equal(stored.pitch, 1.15);
  assert.equal(stored.afterStem, 90, 'a field an older reader left stays');
  // Read back as a new visit would.
  vp._resetVoicePrefsCache();
  assert.deepEqual(vp.getVoicePrefs(), { rate: 1.5, pitch: 1.15, voiceTh: '', voiceEn: '' });
  // Once saved in the new shape, the old speed key no longer counts.
  mem.set('vmx-read-aloud-rate', '0.75');
  vp._resetVoicePrefsCache();
  assert.equal(vp.getVoicePrefs().rate, 1.5);
  // An unreadable old speed is the default.
  fresh();
  mem.set('vmx-read-aloud-rate', '3');
  assert.equal(vp.getVoicePrefs().rate, 1);
  fresh();
  mem.set('vmx-tts-prefs', '{not json');
  assert.deepEqual(vp.getVoicePrefs(), vp.DEFAULT_VOICE_PREFS);
});

test('a change tells every reader and survives a storage that refuses it', () => {
  fresh();
  let told = 0;
  const off = vp.subscribeVoicePrefs(() => { told += 1; });
  vp.setVoicePrefs({ rate: 1.25 });
  assert.equal(told, 1);
  assert.equal(vp.getVoicePrefs().rate, 1.25);
  const set = globalThis.window.localStorage.setItem;
  globalThis.window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  vp.setVoicePrefs({ rate: 2 });
  assert.equal(vp.getVoicePrefs().rate, 2, 'held for this visit');
  globalThis.window.localStorage.setItem = set;
  off();
  vp.setVoicePrefs({ rate: 1 });
  assert.equal(told, 2);
});

test('voice choices: Thai and English voices by name, others left out', () => {
  const c = vp.voiceChoices([NARISA, KANYA, SAMANTHA, { name: 'Thomas', lang: 'fr-FR', voiceURI: 'Thomas' }, KANYA, null]);
  assert.deepEqual(c.th.map((v) => v.name), ['Kanya', 'Narisa']);
  assert.deepEqual(c.en.map((v) => v.name), ['Samantha']);
  assert.deepEqual(vp.voiceChoices([]), { th: [], en: [] });
});

test('a device with no Thai voice: no choice, the sample says so, nothing asks the network', async () => {
  fresh();
  voices = [SAMANTHA];
  vp.setVoicePrefs({ voiceTh: KANYA.voiceURI });
  assert.equal(vp.chosenVoice(voices, 'th'), null);
  assert.deepEqual((await tts.deviceVoices()).th, []);
  const before = said.length;
  const res = await tts.speakSample('th');
  assert.deepEqual(res, { ok: false, reason: 'no-voice' });
  assert.equal(said.length, before);
  assert.equal(fetched, 0);
});

test('the chosen device voice reads, with the tone and speed set; a missing one falls back', async () => {
  fresh();
  voices = [PATTARA, KANYA, SAMANTHA];
  // Unset: the better voice reads (Kanya over the plain Windows voice).
  let plan = await tts.livePlan({ stem: 'สุกรป่วยด้วยโรคใด', options: [] });
  assert.equal(plan.voice.name, 'Kanya');
  assert.equal(plan.chosen, false);
  // Chosen: that voice, even a plain one.
  vp.setVoicePrefs({ voiceTh: PATTARA.voiceURI, pitch: 0.85, rate: 1.25 });
  plan = await tts.livePlan({ stem: 'สุกรป่วยด้วยโรคใด', options: [] });
  assert.equal(plan.voice.name, PATTARA.name);
  assert.equal(plan.chosen, true);
  // An English question keeps its own voice.
  plan = await tts.livePlan({ stem: 'Which drug is used for swine dysentery?', options: [] });
  assert.equal(plan.voice.name, 'Samantha');
  // The sample: the chosen voice, the tone, the speed times the voice's own pace.
  const res = await tts.speakSample('th');
  assert.deepEqual(res, { ok: true });
  const last = said.at(-1);
  assert.equal(last.voice, PATTARA.name);
  assert.equal(last.pitch, 0.85);
  assert.ok(Math.abs(last.rate - 0.88 * 1.25) < 1e-9, `rate ${last.rate}`);
  assert.equal(last.text, tts.SAMPLE_TEXT.th);
  // The voice was removed from the device: the reader picks again.
  voices = [KANYA];
  plan = await tts.livePlan({ stem: 'สุกรป่วยด้วยโรคใด', options: [] });
  assert.equal(plan.voice.name, 'Kanya');
  assert.equal(plan.chosen, false);
  assert.equal(fetched, 0);
});
