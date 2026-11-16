// The case reader's marks (src/lib/case-marks.js, slice 1):
// the word snap, quotes that find a range again after its passage was edited, the
// undo history, and the key that makes marks the property of the account that made them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  legacyPassageHash, caseKey, marksStorageKey, readCaseMarks, placeRange, resolveRanges, segmentsFor,
} from '../../src/lib/case-marks.js';
import { makeRange, createHistory, applyOp, HISTORY_LIMIT, ADOPT_KEY, writeCaseMarks, quoteAt } from '../../src/lib/case-ops.js';
import { createHandPolicy, PEN_SEEN_KEY } from '../../src/lib/ink/hand-policy.js';
import { snapRange, adoptLegacy } from '../../src/lib/ink/case-hand.js';
import { proseBlocks } from '../../src/lib/rich-blocks.js';

const converted = JSON.parse(readFileSync(new URL('../fixtures/converted-passages-5.202.0.json', import.meta.url), 'utf8'));

function memory(init = {}) {
  const values = new Map(Object.entries(init));
  return {
    values,
    getItem: (k) => (values.has(k) ? values.get(k) : null),
    setItem: (k, v) => { values.set(k, String(v)); },
    removeItem: (k) => { values.delete(k); },
  };
}

// ── the word snap ───────────────────────────────────────────
test('a drag snaps to whole Thai words, which have no spaces between them', () => {
  const text = 'คุณได้ทำการคลำตรวจพบ digital pulse ขาด้านซ้าย แรงมากกว่าขาด้านขวา';
  // From inside คลำ to inside ตรวจ: the words whole, never half a syllable.
  const a = text.indexOf('คลำ') + 1;
  const b = text.indexOf('ตรวจ') + 2;
  const r = snapRange(text, a, b);
  const got = text.slice(r.start, r.end);
  assert.ok(got.startsWith('คลำ') || got.startsWith('การคลำ'), got);
  assert.ok(got.endsWith('ตรวจ') || got.endsWith('ตรวจพบ'), got);
  // Either order of the two ends gives the same range.
  assert.deepEqual(snapRange(text, b, a), r);
});

test('a drag snaps to whole English words and leaves the space at either edge out', () => {
  const text = 'Normal nasal concha, Normal function of larynx and pharynx';
  const r = snapRange(text, text.indexOf('asal'), text.indexOf('cha,') + 2);
  assert.equal(text.slice(r.start, r.end), 'nasal concha');
  // A whole line selected keeps the bracket that closes it.
  const line = 'Bedding material, Sawdust (Chi-squared test, p-value 0.19)';
  assert.equal(line.slice(...Object.values(snapRange(line, 0, line.length))), line);
  // A drag over a space alone covers no word.
  assert.equal(snapRange(text, 6, 7), null);
  // A drag that stays in one word marks that word.
  const one = snapRange(text, text.indexOf('ynx'), text.indexOf('ynx'));
  assert.equal(text.slice(one.start, one.end), 'larynx');
});

test('a snapped range always lies on word boundaries of the text it was cut from', () => {
  for (const { after } of converted) {
    for (let a = 0; a < after.length; a += 37) {
      const r = snapRange(after, a, Math.min(after.length, a + 23));
      if (!r) continue;
      assert.ok(r.start >= 0 && r.end <= after.length && r.end > r.start);
      assert.ok(!/\s/.test(after[r.start]) && !/\s/.test(after[r.end - 1]), `edge on a space at ${r.start}..${r.end}`);
    }
  }
});

// ── quotes ──────────────────────────────────────────────────
test('a range is found again by its quote after the six 5.202.0 passages became tables', () => {
  let found = 0;
  let kept = 0;
  for (const { before, after } of converted) {
    for (let a = 0; a < before.length; a += 19) {
      const r = snapRange(before, a, Math.min(before.length, a + 12));
      if (!r) continue;
      const mark = makeRange(before, r, 'lemon');
      const at = placeRange(after, mark);
      if (at) {
        // Found: on the same words, with enough of the words around them the same.
        assert.equal(after.slice(at.start, at.end), mark.quote.exact);
        found++;
      } else {
        // Its words, or the words around them, are gone from the text: kept unseen, never dropped.
        const { shown, unplaced } = resolveRanges(after, [mark]);
        assert.deepEqual([shown.length, unplaced.length], [0, 1]);
        kept++;
      }
    }
  }
  assert.ok(found > 20 && kept > 0, `found ${found}, kept ${kept}`);
});

test('a mark is never moved onto the same word elsewhere when nothing around it matches', () => {
  const stage3 = 'ม้าเดินกะเผลก lameness ที่ขาหน้าซ้าย หลังวิ่ง 2 ชั่วโมง ตรวจพบ lameness grade 3 ที่ขาหลังขวา';
  const at = stage3.lastIndexOf('lameness');
  const mark = makeRange(stage3, { start: at, end: at + 8 });
  // An earlier, shorter stage of the case: the marked words lie past its end. Not shown, not moved.
  const stage1 = stage3.slice(0, stage3.indexOf('ตรวจพบ'));
  assert.ok(stage1.includes('lameness'));
  assert.equal(placeRange(stage1, mark), null);
  // An edit that took the words around it away: the first "lameness" is not the one the student marked.
  const edited = `${stage3.slice(0, at)}XXXXXXXXXXXXXX`;
  assert.equal(placeRange(edited.slice(0, at - 10) + 'ZZZZZZZZZZ lameness QQQQQQQQ', mark), null);
  const { shown, unplaced } = resolveRanges(stage1, [mark]);
  assert.deepEqual([shown.length, unplaced.length], [0, 1]);
});

test('eight characters that match by chance do not place a mark', () => {
  // The marked words were cut by a release edit. The same word further on shares " in the " (8
  // characters) with the quote's context and nothing else: it is not the place the student marked.
  const before = 'Grade 2 lameness in the left fore after work. The farrier saw grade 3 lameness in the right hind.';
  const at = before.indexOf('lameness');
  const mark = makeRange(before, { start: at, end: at + 'lameness'.length });
  const after = before.slice(before.indexOf('The farrier'));
  assert.equal(placeRange(after, mark), null, 'hidden, never moved');
  // The same edit that leaves the words and their context in place still finds the mark.
  const kept = `Seen on Monday. ${before}`;
  const found = placeRange(kept, mark);
  assert.equal(kept.slice(found.start, found.end), 'lameness');
  assert.equal(found.start, kept.indexOf('lameness'));
});

test('every order of clear, undo, redo and the way back of a clear leaves the marks right', async () => {
  const { restoreOp } = await import('../../src/lib/ink/case-hand.js');
  const a = { id: 'a', kind: 'range', start: 0, end: 1 };
  const b = { id: 'b', kind: 'range', start: 2, end: 3 };
  // A model of the pane: one history, the toast holding what the clear removed, every other action ending it.
  const run = (steps) => {
    const h = createHistory();
    let marks = [a, b];
    let toast = null;
    for (const step of steps) {
      if (step === 'clear') {
        const op = { add: [], remove: marks.slice() };
        marks = applyOp(marks, op); h.push(op); toast = op.remove;
      } else if (step === 'undo') { marks = h.undo(marks) ?? marks; toast = null; }
      else if (step === 'redo') { marks = h.redo(marks) ?? marks; toast = null; }
      else if (step === 'toast') {
        const op = toast && restoreOp(marks, toast);
        toast = null;
        if (op) { marks = applyOp(marks, op); h.push(op); }
      }
    }
    return { marks: marks.map((m) => m.id).sort(), h };
  };
  // The reviewer's sequence: clear, the toolbar's undo, then the toast's ย้อนกลับ, then undo again.
  let r = run(['clear', 'undo', 'toast']);
  assert.deepEqual(r.marks, ['a', 'b']);
  assert.deepEqual(run(['clear', 'undo', 'toast', 'undo']).marks, ['a', 'b'], 'the toast did nothing after the undo, and a further undo has nothing left to take back');
  assert.deepEqual(run(['clear', 'undo', 'toast', 'redo']).marks, [], 'redo clears again');
  assert.deepEqual(run(['clear', 'toast']).marks, ['a', 'b']);
  assert.deepEqual(run(['clear', 'toast', 'undo']).marks, [], 'undo takes back the restore');
  assert.deepEqual(run(['clear', 'toast', 'undo', 'undo']).marks, ['a', 'b'], 'and then the clear');
  assert.deepEqual(run(['clear', 'toast', 'toast']).marks, ['a', 'b']);
  assert.deepEqual(run(['clear', 'undo', 'redo', 'toast']).marks, [], 'the toast is gone after redo');
  assert.deepEqual(run(['clear', 'undo', 'redo', 'undo']).marks, ['a', 'b']);
  // Whatever the order, no mark appears twice.
  for (const seq of [['clear', 'toast', 'redo'], ['clear', 'undo', 'toast', 'redo', 'undo'], ['clear', 'toast', 'undo', 'redo']]) {
    const m = run(seq).marks;
    assert.equal(new Set(m).size, m.length, seq.join(' '));
  }
  // restoreOp counts only what is missing.
  assert.equal(restoreOp([a, b], [a, b]), null);
  assert.deepEqual(restoreOp([a], [a, b]).add, [b]);
});

test('of two places that hold the same words, the quote picks the one with its context', () => {
  const text = 'ELISA บวก 102 ตัว และ ELISA ลบ 38 ตัว';
  const second = text.lastIndexOf('ELISA');
  const mark = { kind: 'range', start: second, end: second + 5, quote: quoteAt(text, second, second + 5) };
  const edited = `ตารางใหม่ ${text}`;
  const at = placeRange(edited, mark);
  assert.equal(at.start, edited.lastIndexOf('ELISA'));
});

test('a range whose text is still at its offsets keeps them', () => {
  const text = 'abc def ghi';
  const mark = makeRange(text, { start: 4, end: 7 });
  assert.deepEqual(placeRange(text, mark), { start: 4, end: 7 });
  // A longer stage of the same case: the shorter passage is its start, so offsets hold.
  assert.deepEqual(placeRange(`${text} jkl mno`, mark), { start: 4, end: 7 });
});

// ── typeset offsets ─────────────────────────────────────────
test('every piece the typeset blocks hand to the renderer sits at its own offset in the passage', () => {
  // RichBlocks ProseBlock calls renderText(piece, offset); CaseText puts each piece in a <span data-off>.
  const q209588 = 'คุณได้ทำการคลำตรวจพบ digital pulse\nFlexion test\nLower limb (Negative)\nFetlock (Negative)\nCarpus (Negative)\nPalmar digital nerve block (negative)\nRBC (10⁶/μl): 5.1 | 6.0–12.0\nPCV (%): 38 | 32–53\nWBC (10³/μl): 9.1 | 5.5–12.5\n1. Flexion test\n2. Joint block';
  const pieces = [];
  for (const b of proseBlocks(q209588)) {
    if (b.type === 'para') pieces.push([q209588.slice((b.lines[0]).start, b.lines[b.lines.length - 1].end), b.lines[0].start]);
    if (b.lead) pieces.push([b.lead.text, b.lead.start]);
    for (const { start, parts } of b.type === 'para' ? [] : b.lines) {
      if (b.type === 'results') { pieces.push([parts.label + parts.gap, start], [parts.result + parts.tail, start + parts.label.length + parts.gap.length]); }
      if (b.type === 'pairs') {
        pieces.push([parts.label + parts.sep, start], [parts.value, start + parts.label.length + parts.sep.length]);
        if (b.range) pieces.push([parts.range, start + parts.label.length + parts.sep.length + parts.value.length + parts.bar.length]);
      }
      if (b.type === 'list') pieces.push([parts.body, start + parts.indent.length + parts.marker.length + parts.gap.length]);
    }
  }
  assert.ok(pieces.length > 10);
  for (const [str, off] of pieces) assert.equal(q209588.slice(off, off + str.length), str);
  // And the RichBlocks source passes exactly those offsets.
  const src = readFileSync(new URL('../../src/components/RichBlocks.jsx', import.meta.url), 'utf8');
  assert.match(src, /renderText\(parts\.body, start \+ parts\.indent\.length \+ parts\.marker\.length \+ parts\.gap\.length\)/);
  assert.match(src, /renderText\(parts\.result \+ parts\.tail, start \+ parts\.label\.length \+ parts\.gap\.length\)/);
});

test('a run is cut into pieces that join back to it, each mark on its own words', () => {
  const str = 'abcdefghij';
  const ranges = [{ id: 'a', start: 12, end: 14 }, { id: 'b', start: 13, end: 30 }];
  const segs = segmentsFor(str, 10, ranges);
  assert.equal(segs.map((s) => s.text).join(''), str);
  assert.deepEqual(segs.filter((s) => s.mark).map((s) => [s.mark.id, s.text]), [['a', 'cd'], ['b', 'efghij']]);
});

// ── undo and redo ───────────────────────────────────────────
test('undo and redo walk every kind of mark, and a new mark ends the redo trail', () => {
  const h = createHistory();
  const a = { id: 'a', kind: 'range', start: 0, end: 1 };
  const b = { id: 'b', kind: 'px', points: [[0, 0, 0.5]] };
  let marks = [];
  const act = (op) => { marks = applyOp(marks, op); h.push(op); };
  act({ add: [a], remove: [] });
  act({ add: [b], remove: [] });
  act({ add: [], remove: [a, b] });   // clear all
  assert.deepEqual(marks, []);
  marks = h.undo(marks);
  assert.deepEqual(marks.map((m) => m.id).sort(), ['a', 'b']);
  marks = h.undo(marks);
  assert.deepEqual(marks.map((m) => m.id), ['a']);
  marks = h.redo(marks);
  assert.deepEqual(marks.map((m) => m.id), ['a', 'b']);
  assert.equal(h.canRedo, true);
  act({ add: [{ id: 'c', kind: 'range', start: 2, end: 3 }], remove: [] });
  assert.equal(h.canRedo, false);
  assert.equal(h.redo(marks), null);
});

test('the history keeps the last 100 steps', () => {
  const h = createHistory();
  let marks = [];
  for (let i = 0; i < HISTORY_LIMIT + 20; i++) {
    const op = { add: [{ id: `m${i}`, kind: 'range', start: i, end: i + 1 }], remove: [] };
    marks = applyOp(marks, op);
    h.push(op);
  }
  let n = 0;
  while (h.canUndo) { marks = h.undo(marks); n++; }
  assert.equal(n, HISTORY_LIMIT);
  assert.equal(marks.length, 20);
});

// ── owner-scoped keys and adoption ──────────────────────────
// Longer than the 200 characters a case key reads, as the equine cases are.
const PASSAGE = 'ระหว่างการฝึกงาน ณ ไร่ฝึกสัตวแพทย์ จังหวัดนครปฐม อาจารย์ผู้ดูแลการฝึกคลินิกปฏิบัติม้า '.repeat(3);
const where = (ownerId) => ({ ownerId, subject: 'equine-medicine', title: 'เคส POA: ม้าขาเจ็บ', passage: PASSAGE });
const legacy = `vmx-pass-${legacyPassageHash(PASSAGE)}`;
const oldMarks = () => ({
  [`${legacy}-hl`]: JSON.stringify([{ id: 7, start: 0, end: 7, color: 'green' }]),
  [`${legacy}-dr`]: JSON.stringify([{ color: '#1a1a1a', width: 2, points: [[1, 2, 0.5], [9, 9, 0.5]] }]),
});

test('marks are kept per account and per case, never under the passage alone', () => {
  const key = caseKey(where('u1'));
  assert.equal(marksStorageKey('u1', key), `vmx-case-u1-${key}`);
  assert.equal(marksStorageKey(null, key), `vmx-case-guest-${key}`);
  assert.notEqual(marksStorageKey('u1', key), marksStorageKey('u2', key));
  // The key is the case's, so a stage that extends the passage keeps it ...
  assert.equal(caseKey({ ...where('u1'), passage: `${PASSAGE} ต่อมา` }), key);
  // ... and another case's title or subject does not.
  assert.notEqual(caseKey({ ...where('u1'), title: 'Read this article' }), key);
  assert.notEqual(caseKey({ ...where('u1'), subject: 'epidemiology' }), key);
});

test('the account signed in when a case is first shown adopts the old marks, and the next account sees none', () => {
  const s = memory(oldMarks());
  const before = { ...Object.fromEntries(s.values) };
  const first = readCaseMarks(s, where('u1'), adoptLegacy);
  assert.equal(first.ok, true);
  assert.equal(first.adopted, true);
  const hl = first.marks.find((m) => m.kind === 'range');
  // Converted exactly: the same offsets, the colour mapped off the verdicts' green, the quote computed now.
  assert.deepEqual([hl.start, hl.end, hl.color, hl.quote.exact], [0, 7, 'sky', PASSAGE.slice(0, 7)]);
  assert.equal(first.marks.filter((m) => m.kind === 'px').length, 1);
  assert.equal(JSON.parse(s.getItem(ADOPT_KEY)).owner, 'u1');
  // The old keys are the backup: byte for byte where they were.
  for (const k of Object.keys(before)) assert.equal(s.getItem(k), before[k]);

  // u1 signs out, u2 signs in on the same device: nothing of u1's.
  const second = readCaseMarks(s, where('u2'), adoptLegacy);
  assert.deepEqual([second.ok, second.marks.length, second.adopted], [true, 0, false]);
  // Nor a visitor.
  assert.equal(readCaseMarks(s, where(null), adoptLegacy).marks.length, 0);
  // u1 again: their marks.
  assert.equal(readCaseMarks(s, where('u1'), adoptLegacy).marks.length, 2);
});

test('a visitor on the device at first run keeps the old marks as the visitor', () => {
  const s = memory(oldMarks());
  assert.equal(readCaseMarks(s, where(null), adoptLegacy).marks.length, 2);
  assert.equal(readCaseMarks(s, where('u1'), adoptLegacy).marks.length, 0);
});

test('adoption happens once: a cleared case stays cleared, and the old keys are never written', () => {
  const s = memory(oldMarks());
  const got = readCaseMarks(s, where('u1'), adoptLegacy);
  writeCaseMarks(s, got.key, []);
  const again = readCaseMarks(s, where('u1'), adoptLegacy);
  assert.deepEqual([again.marks.length, again.adopted], [0, false]);
  assert.ok(s.getItem(`${legacy}-hl`));
  assert.ok(s.getItem(`${legacy}-dr`));
});

test('storage that cannot be read gives no marks and nothing to write over', () => {
  const s = memory(oldMarks());
  s.getItem = () => { throw new Error('denied'); };
  const got = readCaseMarks(s, where('u1'), adoptLegacy);
  assert.equal(got.ok, false);
  const broken = memory({ ...oldMarks(), [marksStorageKey('u1', caseKey(where('u1')))]: '{' });
  assert.equal(readCaseMarks(broken, where('u1'), adoptLegacy).ok, false);
});

// ── the hand ────────────────────────────────────────────────
test('a pen marks, a finger scrolls, and once a pen is seen a finger never marks', () => {
  const s = memory();
  const hand = createHandPolicy(s);
  assert.equal(hand.marks('touch'), false, 'a finger scrolls');
  assert.equal(hand.marks('touch', { writeSwitch: true }), true, 'the finger switch lets one finger write');
  assert.equal(hand.marks('mouse', { button: 0 }), true);
  assert.equal(hand.marks('mouse', { button: 2 }), false);
  assert.equal(hand.offersSwitch, true);
  assert.equal(hand.marks('pen'), true);
  assert.equal(s.getItem(PEN_SEEN_KEY), '1');
  assert.equal(hand.offersSwitch, false);
  assert.equal(hand.marks('touch', { writeSwitch: true }), false, 'a palm beside the pen');
  // The device remembers.
  assert.equal(createHandPolicy(s).penSeen, true);
});
