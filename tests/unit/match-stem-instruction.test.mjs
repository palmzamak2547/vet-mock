// A matching question's stem may not tell the student to drag.
//
// The card draws a matching set as one menu per row on every screen
// (MatchDragDrop.jsx: "เลือกคำตอบ ... จากเมนูตัวเลือกในแต่ละข้อ"), and 26 stems
// written for an older drag-and-drop board still say "(ลากการ์ดขวาไปวาง)"
// (hunt of 11 Nov 2026, aquatic-clinic 202471 on a phone). The words are in
// the bank, and a stem edit renames its read-aloud clip and drops its answer
// slide (AGENTS.md), so they wait for an owner's pass with the wording
// proposed in docs/releases/pending/learner-fixes.md: drop the drag clause and
// keep "(มีตัวลวง 2 ตัว)" where it is there. This list may only shrink; a new
// stem with a drag instruction fails here.
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

test('no matching stem outside the waiting list tells the student to drag', async () => {
  const qb = QB.length ? QB : await loadQB();
  const found = qb.filter((q) => q.type === 'match' && DRAG.test(String(q.q || ''))).map((q) => `${q.subject}#${q.id}`);
  const fresh = found.filter((k) => !WAITING.has(k));
  assert.deepEqual(fresh, [], `these matching stems tell the student to drag, which no screen offers: ${fresh.join(', ')}`);
  const fixed = [...WAITING].filter((k) => !found.includes(k));
  assert.deepEqual(fixed, [], `these stems no longer say drag: take them off WAITING so the list only shrinks: ${fixed.join(', ')}`);
});
