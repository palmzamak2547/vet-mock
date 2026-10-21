// plainSeparators: no middle dot reaches the screen through RichText.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from '../helpers/fake-react.mjs';

const { plainSeparators } = await loadModule('src/lib/richtext.jsx');

test('a dot between words reads as a comma', () => {
  assert.equal(plainSeparators('**Physicochemical property** — pH · density · freezing point'), '**Physicochemical property** — pH, density, freezing point');
  assert.equal(plainSeparators('สี · กลิ่น · viscosity'), 'สี, กลิ่น, viscosity');
});

test('a British decimal becomes a point, a leading dot goes', () => {
  assert.equal(plainSeparators('229 of 902 samples (25·4%)'), '229 of 902 samples (25.4%)');
  assert.equal(plainSeparators('· first\n· second'), 'first\nsecond');
});

test('text without a middle dot is returned as it was', () => {
  const s = 'Rabies, DFA = main Dx; 3 ป + 5 ย.';
  assert.equal(plainSeparators(s), s);
});
