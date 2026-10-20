// ============================================================
// tts-silent-fallback.test.mjs — a read-aloud that cannot speak ends
// ============================================================
// Sweep 2026-10-20: with the voice server unreachable the app falls back to
// the device's own speech. A device with no voice for the language never
// fires `end` or `error` on the utterance, so the read-aloud promise waited
// forever and the button stayed on "หยุดอ่านออกเสียง" until the next
// question. The fallback must end, and must say it could not speak.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

const unhandled = [];
process.on('unhandledRejection', (e) => unhandled.push(e));

globalThis.fetch = async () => { throw new TypeError('network down'); };
class Utterance { constructor(text) { this.text = text; } }
globalThis.SpeechSynthesisUtterance = Utterance;
const spoken = [];
globalThis.window = {
  speechSynthesis: {
    // A device with no matching voice: it accepts the utterance and never
    // reports anything back.
    speak: (u) => spoken.push(u.text),
    cancel() {},
    getVoices: () => [],
    addEventListener() {},
    removeEventListener() {},
  },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
globalThis.localStorage = globalThis.window.localStorage;

const tts = await import('../../src/lib/tts.js');

test('a fallback that never hears back from the device ends and reports it', async () => {
  let ended = false;
  let failed = null;
  await Promise.race([
    tts.speakQuestion({
      stem: 'ข้อใดถูก',
      options: ['ก'],
      controller: { cancelled: false },
      onEnd: () => { ended = true; },
      onFail: (why) => { failed = why; },
    }),
    new Promise((r) => setTimeout(r, 20_000).unref()),
  ]);
  assert.equal(ended, true, 'the read-aloud must end so the button returns to its idle state');
  assert.ok(failed, 'the student must be told nothing could be read aloud');
  assert.ok(spoken.length > 0, 'the device voice was tried');
  await new Promise((r) => setTimeout(r, 50));
  assert.deepEqual(unhandled.map((e) => String(e?.message || e)), [], 'aborted downloads must not surface as unhandled errors');
});
