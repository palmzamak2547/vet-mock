// A fill-in item partly right is marked as partly right (review of pull request 247).
// Its verdict read "✗ ถูก 2 จาก 3 ช่อง": a cross beside the word ถูก, in the colour of
// a wrong answer. Review already draws a partial match as ◐ in the partly-right colour;
// the card's fill-in verdict now does the same.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const card = read('src/components/Question.jsx');
const css = read('src/styles.css');

test('a partly right fill-in verdict carries ◐, never the cross of a wrong answer', () => {
  assert.match(card, /headline=\{!fillOk && fillRight > 0 \? `◐ ถูก \$\{fillRight\} จาก/);
  assert.doesNotMatch(card, /`✗ ถูก \$\{fillRight\}/);
  assert.match(card, /partial=\{!fillOk && fillRight > 0\}/);
});

test('the verdict panel takes the partly-right colour for a partial result', () => {
  assert.match(card, /\$\{ok \? 'is-ok' : partial \? 'is-part' : 'is-no'\}/);
  const at = css.indexOf('.vmx-instant-feedback.is-part {');
  assert.ok(at > 0, 'no rule for the partial panel');
  assert.match(css.slice(at, css.indexOf('}', at)), /border-left: 4px solid var\(--clr-part\);/);
});
