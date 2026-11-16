// The spelling a recorded clip's voice is sent (scripts/lib/tts-respell.mjs):
// acronyms letter by letter, names and words untouched, numbers untouched.
import test from 'node:test';
import assert from 'node:assert/strict';
import { respell } from '../../scripts/lib/tts-respell.mjs';

test('acronyms are spelled letter by letter', () => {
  assert.equal(respell('ควบคุมโรค APP ไม่ได้ผล'), 'ควบคุมโรค A P P ไม่ได้ผล');
  assert.equal(respell('วัคซีน PRRS และ PCV2'), 'วัคซีน P R R S และ P C V 2');
  assert.equal(respell('(ASF)'), '(A S F)');
});

test('drug names, Latin names, numbers and the acronyms said as words stay as written', () => {
  for (const s of ['ให้ Amoxicillin 10 มิลลิกรัม', 'Brachyspira hyodysenteriae', 'ApxIV', 'COVID-19', 'ระบบ HACCP', 'M. hyorhinis', 'ELISA ตรวจแอนติบอดี']) assert.equal(respell(s), s);
});
