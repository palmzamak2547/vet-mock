// ============================================================
// voice-error-map.test.mjs — the mic never shows a speech-API code
// ============================================================
// The dictation button beside the short-answer box (VoiceInputButton) turned
// every SpeechRecognition failure except 'not-allowed' into
// `ผิดพลาด: ${e.error}`, so a student with no microphone read
// "ผิดพลาด: audio-capture", and a dropped connection read "ผิดพลาด: network".
// Those are codes from the Web Speech spec, not sentences.
//
// The mapping now lives in lib/errors.js next to thaiError, where node can
// run it: each code becomes a Thai sentence with a next step, and the two
// codes that are not failures ('aborted' after a stop, 'no-speech' after a
// pause) stay quiet as before.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as errors from '../../src/lib/errors.js';

// Every SpeechRecognitionErrorEvent.error value in the spec, plus one a
// future browser might add.
const FAILURES = [
  'not-allowed', 'service-not-allowed', 'audio-capture', 'network',
  'language-not-supported', 'bad-grammar', 'phrases-not-supported', 'some-future-code',
];

test('lib/errors.js exports the speech error mapper', () => {
  assert.equal(typeof errors.speechErrorText, 'function', 'speechErrorText must be exported from lib/errors.js');
});

test('every speech failure code becomes Thai with no raw code in it', () => {
  for (const code of FAILURES) {
    const text = errors.speechErrorText?.(code);
    assert.equal(typeof text, 'string', `${code}: must produce a message`);
    assert.match(text, /[ก-๙]/, `${code}: must be Thai, got ${JSON.stringify(text)}`);
    assert.doesNotMatch(text, /[A-Za-z]/, `${code}: carries Latin text: ${JSON.stringify(text)}`);
    assert.doesNotMatch(text, /ผิดพลาด:/, `${code}: still the old "ผิดพลาด: <code>" form`);
    assert.doesNotMatch(text, /·/, `${code}: no middle dot in UI copy`);
  }
});

test('each code says what to do about it', () => {
  const say = (code) => errors.speechErrorText?.(code);
  assert.equal(say('not-allowed'), 'อนุญาตไมค์ในเบราว์เซอร์ก่อน', 'the permission message is unchanged');
  assert.equal(say('service-not-allowed'), say('not-allowed'), 'a refused speech service reads like a refused mic');
  assert.match(say('audio-capture') || '', /ไมโครโฟน/, 'no microphone is named as such');
  assert.match(say('network') || '', /เชื่อมต่อ/, 'a network failure says the connection failed');
  assert.match(say('language-not-supported') || '', /ลอง/, 'anything else says to try again');
});

test('a stop or a silent pause is not an error', () => {
  for (const quiet of ['aborted', 'no-speech', '', undefined, null]) {
    assert.equal(errors.speechErrorText?.(quiet), null, `${String(quiet)} must stay quiet`);
  }
});

test('the mic button shows the mapped sentence, not the code', () => {
  const src = readFileSync(resolve('src/components/VoiceInputButton.jsx'), 'utf8');
  assert.doesNotMatch(src, /\$\{e\.error\}/, 'the raw speech code is still interpolated into the UI');
  assert.match(src, /import \{ speechErrorText \} from '\.\.\/lib\/errors\.js';/);
  assert.match(src, /speechErrorText\(e\.error\)/, 'onerror must route the code through speechErrorText');
});
