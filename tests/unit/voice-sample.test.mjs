// ============================================================
// voice-sample.test.mjs — ลองฟัง sounds like the reading, and never over it
// ============================================================
// The voice settings' sample (lib/tts.js speakSample) takes the reader's own
// path on this device (readerSource): the device voice with the tone, or the
// cloud voice at the speed set. It pauses a reading through the reader's own
// pause first, and the reader stops a sample before it plays. The dialog's
// stylesheet keeps Thai text at 14 px or more.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

let voices = [];
const said = [];
let current = null;
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
const synth = {
  speak(u) {
    current = u;
    said.push({ text: u.text, pitch: u.pitch, voice: u.voice?.name });
    setTimeout(() => { if (current !== u) return; u.onstart?.(); u.t = setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, 40); }, 1);
  },
  cancel() { const u = current; current = null; if (u) { clearTimeout(u.t); u.onerror?.({ error: 'interrupted' }); } },
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
const asked = [];
globalThis.fetch = async (url) => { asked.push(String(url)); throw new TypeError('no network in this test'); };

const vp = await import('../../src/lib/read-aloud-store.js');
const store = await import('../../src/lib/read-aloud-store.js');
const tts = await import('../../src/lib/tts.js');

const KANYA = { name: 'Kanya', lang: 'th-TH', voiceURI: 'Kanya' };
const PATTARA = { name: 'Microsoft Pattara - Thai (Thailand)', lang: 'th-TH', voiceURI: 'Pattara' };
const fresh = (prefs = {}) => { mem.clear(); vp._resetVoicePrefsCache(); if (Object.keys(prefs).length) vp.setVoicePrefs(prefs); asked.length = 0; store.session.cloudRefused = false; };

test('the reader\'s rule: a plain device voice leaves the reading to the cloud voice, unless chosen or toned', () => {
  fresh();
  voices = [PATTARA];
  const plain = tts.voiceNow('th');
  assert.equal(tts.readerSource(plain), 'cloud');
  assert.equal(tts.readerSource(plain, true), 'speech', 'a refused cloud voice: the device reads');
  vp.setVoicePrefs({ pitch: 1.15 });
  assert.equal(tts.readerSource(plain), 'speech', 'a tone is only heard on the device voice, so it reads');
  assert.equal(tts.readingVoice('th').source, 'speech');
  vp.setVoicePrefs({ pitch: 1, voiceTh: 'Pattara' });
  assert.equal(tts.readerSource(tts.voiceNow('th')), 'speech', 'a chosen voice reads');
  voices = [KANYA];
  fresh();
  assert.equal(tts.readerSource(tts.voiceNow('th')), 'speech', 'a good device voice reads');
  assert.deepEqual(tts.readingVoice('th'), { source: 'speech', name: 'Kanya' });
});

test('ลองฟัง takes the same path: the cloud voice where the reader would use it, the device voice with the tone otherwise', async () => {
  fresh();
  voices = [PATTARA];
  const n = said.length;
  // Plain voice, no tone: the reader would ask the cloud voice, so the sample
  // does (unreachable here), then the device voice says it, as the reader does.
  const res = await tts.speakSample('th');
  assert.ok(asked.some((u) => u.includes('/api/tts')), `cloud asked: ${asked}`);
  assert.equal(res.ok, true);
  assert.equal(said.length, n + 1);
  // With a tone the device voice reads, so the sample never asks the cloud.
  fresh({ pitch: 0.85 });
  const r2 = await tts.speakSample('th');
  assert.equal(asked.length, 0);
  assert.deepEqual(r2, { ok: true, via: 'speech' });
  assert.equal(said.at(-1).pitch, 0.85);
});

test('ลองฟัง pauses a reading through the reader\'s own pause, and a reading that starts stops the sample', async () => {
  fresh({ voiceTh: 'Kanya' });
  voices = [KANYA];
  const order = [];
  store.session.pause = () => order.push('pause');
  const speak = synth.speak;
  synth.speak = (u) => { order.push('speak'); speak(u); };
  // Long enough to stop it halfway.
  const p = tts.speakSample('th');
  await new Promise((r) => setTimeout(r, 15));
  assert.deepEqual(order, ['pause', 'speak'], 'paused before the sample spoke');
  assert.equal(typeof store.session.stopSample, 'function', 'the sample can be stopped by the reader');
  store.stopSampleSound();
  assert.deepEqual(await p, { ok: true, via: 'speech' });
  assert.equal(synth.speaking, false, 'nothing of the sample is left speaking');
  assert.equal(store.session.stopSample, null);
  synth.speak = speak;
  store.session.pause = null;
});

test('a voice list that arrives late is not "no Thai voice"', async () => {
  fresh();
  voices = [];
  const early = await tts.deviceVoices();
  assert.equal(early.loaded, false);
  assert.deepEqual(early.th, []);
  voices = [KANYA];
  const late = await tts.deviceVoices();
  assert.equal(late.loaded, true);
  assert.deepEqual(late.th.map((v) => v.name), ['Kanya']);
});

test('the voice settings keep Thai text at 14 px or more', () => {
  const css = fs.readFileSync('src/styles-voice.css', 'utf8');
  const small = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1])).filter((px) => px < 14);
  assert.deepEqual(small, []);
});
