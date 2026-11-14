// ============================================================
// Wrap-up differential board: every cell is the wrap-up's own words, cited
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOARD_MIN, boardKey, freshBoardPrefs, readBoardPrefs, resolveBoard,
} from '../../src/lib/wrap-board.js';
import { BOARD_LOADERS } from '../../src/data/wrapup-boards/index.js';

const wrap = {
  subject: 'pigs',
  exam: { date: '2026-11-23' },
  groups: [
    {
      id: 'g1',
      lecturer: 'อ.หนึ่ง',
      items: [
        {
          topic: 't1', name: 'Differential of things',
          keywords: ['Stool pH: bacteria > 7, virus < 7'],
          emphasis: [{ text: 'โรคจากแบคทีเรียมักกระจุกเป็นกลุ่ม โรคจากไวรัสกระจายทั้งฝูง', src: '2_2M9bEGpmE [8:39]' }],
        },
        {
          topic: 't2', name: 'Swine dysentery (Brachyspira)', th: 'บิดมูกเลือด',
          emphasis: [{ text: 'ถ่ายเป็นมูกปนเลือดสด เพราะเลือดออกที่ลำไส้ใหญ่', src: 'เดค Enteric หน้า 60' }],
          examined: [{ text: 'สุกรขุนถ่ายมูกเลือด', src: 'ข้อสอบเก่า 209058' }],
          pitfall: 'darkfield บอกได้แค่สงสัย',
        },
        { topic: 't3', name: 'Yersinia infection', keywords: ['Dark watery feces with occasional flecks of blood'] },
      ],
    },
  ],
};
const D = 'Differential';
const SD = 'Swine dysentery';
const Y = 'Yersinia';
const board = {
  v: 1,
  subject: 'pigs',
  exam: '2026-11-23',
  title: 'ท้องเสีย',
  frame: D,
  steps: [
    {
      title: 'ดูการกระจาย',
      rows: [
        { clue: ['กระจุกเป็นกลุ่ม', D, 'e0'], to: [{ text: ['โรคจากแบคทีเรีย', D, 'e0'] }] },
        { clue: ['กระจายทั้งฝูง', D, 'e0'], to: [{ text: ['โรคจากไวรัส', D, 'e0'] }] },
      ],
    },
    {
      title: 'ดูอุจจาระ',
      rows: [
        { clue: ['มูกปนเลือดสด', SD, 'e0'], to: [{ item: SD, notes: [['เลือดออกที่ลำไส้ใหญ่', SD, 'e0']] }] },
        { clue: ['Dark watery feces', Y, 'k0'], to: [{ item: Y }] },
        { clue: ['สุกรขุน', SD, 'x0'], to: [{ item: SD }, { item: Y }], note: ['ถ่ายมูกเลือด', SD, 'x0'] },
      ],
    },
  ],
};

test('the key is per subject, term and paper, under vmx-wrap-', () => {
  assert.equal(boardKey('swine-clinic', '2569-1', '1-final'), 'vmx-wrap-board-swine-clinic-2569-1-1-final');
  assert.match(boardKey('a b', null, undefined), /^vmx-wrap-board-a_b-none-none$/);
});

test('a missing, corrupt, old or foreign value starts with names shown', () => {
  for (const raw of [null, undefined, '', '{', 'null', '42', '"x"', JSON.stringify({ v: 0, hide: true }), JSON.stringify([1]), JSON.stringify({ v: 1, hide: 'yes' })]) {
    assert.deepEqual(readBoardPrefs(raw), freshBoardPrefs(), String(raw));
  }
  assert.equal(readBoardPrefs(JSON.stringify({ v: 1, hide: true })).hide, true);
});

test('a board resolves every cell to the line it quotes, with that line\'s citation', () => {
  const r = resolveBoard(board, wrap);
  assert.ok(r);
  assert.deepEqual(r.dropped, []);
  assert.equal(r.title, 'ท้องเสีย');
  assert.equal(r.frame, 1);
  assert.deepEqual(r.items, [2, 3], 'the diseases on the board, by their page number');
  const [s1, s2] = r.steps;
  assert.equal(s1.rows[0].clue.text, 'กระจุกเป็นกลุ่ม');
  assert.deepEqual(s1.rows[0].to, [{ kind: 'text', text: 'โรคจากแบคทีเรีย', n: 1 }]);
  assert.deepEqual(s1.cites, [{ n: 1, src: '2_2M9bEGpmE [8:39]', kind: 'emphasis' }], 'one line cited once');
  const sd = s2.rows[0].to[0];
  assert.equal(sd.kind, 'item');
  assert.equal(sd.n, 2);
  assert.equal(sd.name, 'Swine dysentery (Brachyspira)');
  assert.equal(sd.short, 'Swine dysentery', 'the node reads the start of the name, the card the whole');
  assert.deepEqual(sd.notes, ['เลือดออกที่ลำไส้ใหญ่']);
  assert.equal(s2.rows[2].note, 'ถ่ายมูกเลือด');
  assert.deepEqual(s2.cites.map((c) => [c.n, c.kind]), [[2, 'emphasis'], [2, 'examined'], [3, 'keywords']]);
});

test('a cell whose words are not in its line is dropped and listed, never shown', () => {
  const drift = structuredClone(board);
  drift.steps[1].rows[0].to[0].notes[0][0] = 'เลือดออกที่ลำไส้เล็ก';
  drift.steps[1].rows[1].clue[0] = 'Black feces';
  const r = resolveBoard(drift, wrap);
  assert.deepEqual(r.steps[1].rows[0].to[0].notes, []);
  assert.equal(r.steps[1].rows.length, 2, 'a row whose clue fails goes');
  assert.equal(r.dropped.length, 2);
  assert.match(r.dropped[0], /เลือดออกที่ลำไส้เล็ก/);
});

test('a target naming no item, or two, is dropped; a row left with none goes', () => {
  const b = structuredClone(board);
  b.steps[1].rows[1].to = [{ item: 'Nothing here' }];
  b.steps[1].rows[0].to.push({ item: 'S' });
  const r = resolveBoard(b, { ...wrap, groups: [{ ...wrap.groups[0], items: [...wrap.groups[0].items, { topic: 't4', name: 'Salmonella' }] }] });
  assert.equal(r.steps[1].rows.length, 2);
  assert.equal(r.steps[1].rows[0].to.length, 1, 'an ambiguous prefix is not guessed');
});

test('a board for another paper, or with too little left, is no board at all', () => {
  assert.equal(resolveBoard(board, { ...wrap, exam: { date: '2027-11-23' } }), null);
  assert.equal(resolveBoard(board, { ...wrap, subject: 'cows' }), null);
  assert.equal(resolveBoard(null, wrap), null);
  assert.equal(resolveBoard(board, null), null);
  const thin = structuredClone(board);
  thin.steps = [thin.steps[1]];
  assert.equal(resolveBoard(thin, wrap), null, `fewer than ${BOARD_MIN.steps} steps`);
  const few = structuredClone(board);
  few.steps[1].rows = few.steps[1].rows.slice(0, 1);
  assert.equal(resolveBoard(few, wrap), null, `fewer than ${BOARD_MIN.rows} rows`);
});

// The shipped boards against the shipped wrap-ups: every cell must still be
// found in the line it quotes, so an edit to a wrap-up that breaks a cell
// fails here instead of quietly thinning the board.
test('every shipped board resolves whole against its own wrap-up', async () => {
  const { WRAPUPS } = await import('../../src/data/exam-wrapups.js');
  const loaders = [];
  for (const years of Object.values(WRAPUPS)) {
    for (const phases of Object.values(years)) {
      for (const subjects of Object.values(phases)) {
        for (const [subject, load] of Object.entries(subjects)) loaders.push([subject, load]);
      }
    }
  }
  let checked = 0;
  for (const [subject, loadBoards] of Object.entries(BOARD_LOADERS)) {
    const { BOARD } = await loadBoards();
    const matches = [];
    for (const [s, load] of loaders) {
      if (s !== subject) continue;
      const { WRAPUP } = await load();
      const r = resolveBoard(BOARD, WRAPUP);
      if (r) matches.push(r);
    }
    assert.equal(matches.length, 1, `${subject}: exactly one wrap-up takes this board`);
    assert.deepEqual(matches[0].dropped, [], `${subject}: cells not found in their line`);
    checked += 1;
  }
  assert.ok(checked >= 1);
});

test('the Swine final board: the steps and diseases the data supports', async () => {
  const { BOARD } = await BOARD_LOADERS['swine-clinic']();
  const { WRAPUP } = await import('../../src/data/wrapups/swine-clinic-final.js');
  const r = resolveBoard(BOARD, WRAPUP);
  assert.ok(r.steps.length >= 4);
  assert.equal(r.frame, 1);
  for (const n of r.items) assert.ok(n >= 2 && n <= 10, `item ${n} is one of the enteric topics`);
  for (const step of r.steps) {
    assert.ok(step.cites.length > 0, `${step.title} cites its lines`);
    assert.doesNotMatch(step.title, /·/);
  }
});
