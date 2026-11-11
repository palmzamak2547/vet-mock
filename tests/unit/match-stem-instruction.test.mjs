// A matching question's stem may not tell the student to drag.
//
// The card draws a matching set as one menu per row on every screen
// (MatchDragDrop.jsx: "เลือกคำตอบ ... จากเมนูตัวเลือกในแต่ละข้อ"), and 26 stems
// written for an older drag-and-drop board still say "(ลากการ์ดขวาไปวาง)"
// (hunt of 11 Nov 2026, aquatic-clinic 202471 on a phone). The words are in
// the bank, and a stem edit renames its read-aloud clip and drops its answer
// slide (AGENTS.md), so the stored text stays and the card drops the clause
// when it draws the stem (lib/match-stem.js), keeping "(มีตัวลวง 2 ตัว)". This
// list may only shrink; a new stem with a drag instruction fails here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { QB, loadQB } from '../../src/data/questions.js';
import { readFileSync } from 'node:fs';

const WAITING = new Set([
  'aquatic-clinic#202471', 'avian-medicine#206144', 'avian-medicine#206145', 'avian-medicine#206151', 'avian-medicine#206155',
  'equine-medicine#202394',
  'milk-meat-hygiene#203001', 'milk-meat-hygiene#203002', 'milk-meat-hygiene#203003', 'milk-meat-hygiene#203004',
  'milk-meat-hygiene#203005', 'milk-meat-hygiene#203006', 'milk-meat-hygiene#203007', 'milk-meat-hygiene#207133',
  'milk-meat-hygiene#207134', 'milk-meat-hygiene#207148', 'milk-meat-hygiene#207149', 'milk-meat-hygiene#207150',
  'milk-meat-hygiene#207204', 'milk-meat-hygiene#207205', 'milk-meat-hygiene#207206', 'milk-meat-hygiene#207262',
  'milk-meat-hygiene#207263', 'milk-meat-hygiene#207264', 'milk-meat-hygiene#207265',
  'vet-pharm-2#53001',
]);
const DRAG = /ลากการ์ด|ลาก(?:ไป|มา)วาง|ลากคำตอบ|\bdrag\b/i;

test('the card draws a matching set as menus, not cards to drag', () => {
  const src = readFileSync(new URL('../../src/components/MatchDragDrop.jsx', import.meta.url), 'utf8');
  assert.match(src, /<select/);
  assert.doesNotMatch(src, /draggable|onDragStart|onDrop=/, 'the card can drag again: this test and its list are out of date');
});

test('the card shows the 26 without the drag clause, and the voice and the answer slide read the stem unchanged', async () => {
  const { displayStem } = await import('../../src/lib/match-stem.js');
  const { wholeStem } = await import('../../src/lib/rich-blocks.js');
  const qb = QB.length ? QB : await loadQB();
  const rows = qb.filter((q) => WAITING.has(`${q.subject}#${q.id}`));
  assert.equal(rows.length, WAITING.size);
  for (const q of rows) {
    const shown = displayStem(q);
    assert.doesNotMatch(shown, DRAG, `${q.subject}#${q.id} still shows: ${shown}`);
    assert.ok(shown.length >= String(q.q).length - 40, `${q.subject}#${q.id}: more than the clause went`);
    if (/มีตัวลวง/.test(q.q)) assert.match(shown, /\(มีตัวลวง 2 ตัว\)/, `${q.subject}#${q.id} keeps its distractor note`);
    assert.equal(wholeStem(q), q.say || q.q, 'the read-aloud and the evidence hash read the stored stem');
  }
  // Only matching stems are touched, and only the exact clause.
  assert.equal(displayStem({ type: 'mcq', q: 'ข้อใด (ลากการ์ดขวาไปวาง)' }), 'ข้อใด (ลากการ์ดขวาไปวาง)');
  assert.equal(displayStem({ type: 'match', q: 'จับคู่ (ลากเส้น)' }), 'จับคู่ (ลากเส้น)');
  const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8');
  assert.match(card, /<TermLinkedRichText text=\{shownStem\}/, 'the card draws the displayed stem');
  for (const [file, name] of [['src/views/ReviewView.jsx', 'q'], ['src/views/SRSessionView.jsx', 'currentQ']]) {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    assert.ok(src.includes(`<RichText text={displayStem(${name})} />`), `${file} draws the displayed stem`);
  }
  assert.doesNotMatch(readFileSync(new URL('../../src/lib/rich-blocks.js', import.meta.url), 'utf8'), /displayStem/, 'wholeStem must not read the display');
});

test('no matching stem outside the waiting list tells the student to drag', async () => {
  const qb = QB.length ? QB : await loadQB();
  const found = qb.filter((q) => q.type === 'match' && DRAG.test(String(q.q || ''))).map((q) => `${q.subject}#${q.id}`);
  const fresh = found.filter((k) => !WAITING.has(k));
  assert.deepEqual(fresh, [], `these matching stems tell the student to drag, which no screen offers: ${fresh.join(', ')}`);
  const fixed = [...WAITING].filter((k) => !found.includes(k));
  assert.deepEqual(fixed, [], `these stems no longer say drag: take them off WAITING so the list only shrinks: ${fixed.join(', ')}`);
});
