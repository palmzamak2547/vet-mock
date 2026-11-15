// Three quieter wrap-up screens, from the production walk of 15 Nov 2026 (5.217.0 shipped them):
// - the revision deck said "think before you open" twice on one screen; the hint beside the card stays;
// - "ต้องทวน 0" was a button that opened an empty pile; an empty pile is now a line that opens nothing;
// - the Swine final's overview ran 11 lines at 390 px and pushed every item below the first screen; any
//   overview longer than four lines on the screen it is drawn on opens folded to two, with "อ่านต่อ".
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INTRO_FOLDED_LINES, INTRO_MAX_LINES, introFolds, linesOf } from '../../src/lib/wrap-intro.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const VIEW = read('src/views/WrapUpView.jsx');
const DECK = read('src/components/WrapDeck.jsx');
const CSS = read('src/styles-wrap.css');

test('the overview folds by one rule: more than four lines on screen', () => {
  assert.equal(INTRO_MAX_LINES, 4);
  assert.equal(INTRO_FOLDED_LINES, 2);
  const lh = 22.4; // .vmx-wrap-intro: 14 px at line-height 1.6
  assert.equal(linesOf(11 * lh, lh), 11);
  assert.equal(introFolds(11 * lh, lh), true, 'the Swine final at 390 px');
  assert.equal(introFolds(5 * lh, lh), true);
  assert.equal(introFolds(4 * lh, lh), false, 'four lines stay whole');
  assert.equal(introFolds(2 * lh, lh), false);
  assert.equal(introFolds(0, lh), false, 'not measured yet: never fold');
  assert.equal(introFolds(300, Number.NaN), false, 'a line height it cannot read: never fold');
});

test('the wrap-up draws its overview through the folding paragraph, for every paper', () => {
  assert.doesNotMatch(VIEW, /<p className="vmx-wrap-intro">/, 'no overview drawn whole by hand');
  assert.match(VIEW, /<WrapIntro text=\{shown\.intro\} \/>/);
  assert.match(VIEW, /introFolds\(el\.scrollHeight, parseFloat\(getComputedStyle\(el\)\.lineHeight\)\)/, 'measured, not listed by subject');
  assert.match(VIEW, /aria-expanded="false" aria-controls="vmx-wrap-intro" onClick=\{\(\) => setOpen\(true\)\}>อ่านต่อ<\/button>/);
  const folded = CSS.slice(CSS.indexOf('.vmx-wrap-intro.is-folded {'), CSS.indexOf('}', CSS.indexOf('.vmx-wrap-intro.is-folded {')));
  assert.match(folded, /-webkit-line-clamp: 2;/);
  assert.match(folded, /overflow: hidden;/);
  const more = CSS.slice(CSS.indexOf('.vmx-wrap-intro-more {'), CSS.indexOf('}', CSS.indexOf('.vmx-wrap-intro-more {')));
  assert.match(more, /min-height: var\(--touch-min\)/, 'a thumb-sized target');
});

test('the deck says "think before you open" once, beside the card', () => {
  assert.doesNotMatch(VIEW, /นึกให้ได้ก่อน/);
  assert.doesNotMatch(VIEW, /vmx-wrap-mode-note/);
  assert.doesNotMatch(CSS, /\.vmx-wrap-mode-note/);
  assert.match(DECK, /<p className="vmx-deck-hint">นึกก่อน แล้วค่อยเปิด<\/p>/);
});

test('an empty pile is a line, not a button that opens nothing', () => {
  assert.match(DECK, /\{againCount > 0 \? \(\n\s*<button ref=\{pileRef\} type="button" className="vmx-deck-pile-btn"/);
  assert.match(DECK, /\) : \(\n\s*<span className="vmx-deck-pile-empty">ยังไม่มีใบที่ต้องทวน<\/span>\n\s*\)\}/);
  const empty = CSS.slice(CSS.indexOf('.vmx-deck-pile-empty {'), CSS.indexOf('}', CSS.indexOf('.vmx-deck-pile-empty {')));
  assert.doesNotMatch(empty, /cursor: pointer/);
  assert.match(empty, /color: var\(--clr-ink-soft\)/);
});
