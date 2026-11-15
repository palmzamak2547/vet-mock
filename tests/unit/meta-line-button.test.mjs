// The question's header line is a button only when a tap would show more (review of
// pull request 247). On a phone the line wraps whole, and on a wide card it often fits:
// a tap then only flipped aria-expanded, and a screen reader heard "button, collapsed"
// on every question, one more Tab stop on every card. It is plain text unless cut off.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { metaLineCut } from '../../src/lib/meta-line.js';

const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('the line counts as cut off only when its text is wider than its box', () => {
  assert.equal(metaLineCut({ scrollWidth: 412, clientWidth: 300 }), true, 'an ellipsised line');
  assert.equal(metaLineCut({ scrollWidth: 300, clientWidth: 300 }), false, 'a line that fits');
  assert.equal(metaLineCut({ scrollWidth: 301, clientWidth: 300 }), false, 'a sub-pixel rounding is not a cut');
  assert.equal(metaLineCut(null), false);
});

test('cut off it is a button with aria-expanded; otherwise a div with no tab stop and nothing announced', () => {
  assert.match(card, /const MetaLine = metaCut \|\| metaOpen \? 'button' : 'div';/);
  assert.match(card, /\? \{ type: 'button', 'aria-expanded': metaOpen, onClick: \(\) => setMetaOpenFor\(metaOpen \? null : compoundId\) \}\n\s+: \{\};/);
  assert.match(card, /<MetaLine ref=\{metaRef\} className="vmx-qtype-badge vmx-q-meta" data-open=\{metaOpen \|\| undefined\} title=\{metaTitle\} \{\.\.\.metaProps\}>/);
  assert.doesNotMatch(card, /<button type="button" className="vmx-qtype-badge vmx-q-meta"/);
  // Measured after layout and again whenever the line's box changes size.
  assert.match(card, /setMetaCut\(metaLineCut\(el\)\)/);
  assert.match(card, /new ResizeObserver\(check\)/);
});
