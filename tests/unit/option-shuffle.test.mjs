// ============================================================
// "ทุกข้อถูก" belongs on the last row, and nothing else moves
// ============================================================
// getShuffledOptions pins catch-all rows to the bottom while the rest
// shuffle. Its TAIL_RE knew ถูกทุก… / ทั้ง… / ไม่มีข้อใดถูก, but not the
// catch-alls that START with ทุกข้อ. Eight authored questions end in one:
// "ทุกข้อ", "ทุกข้อถูก", "ทุกข้อข้างต้น", "ทุกข้อที่กล่าวมา ถูกต้องทั้งหมด",
// "ทำได้ทุกข้อที่กล่าวมา". Those shuffled like ordinary rows, so a student
// could read "1. ทุกข้อถูก" above the three options it claims to cover.
//
// Thai ข้อ also means "joint": "ทุกข้อต่อมีการอักเสบ" (every joint is
// inflamed) is a real answer and must keep shuffling.
//
// The shuffle runs on every practice and exam screen, so the permutation of
// every question WITHOUT one of these catch-alls must stay exactly what it
// was. To check that, this file pins the per-load session seed and recomputes
// the order the module produced before the change.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

// Pin SESSION_SEED for a private instance of the module.
const SEED = 0x2f6b1c3d;
const hadOwn = Object.prototype.hasOwnProperty.call(globalThis.crypto, 'getRandomValues');
const realGetRandomValues = globalThis.crypto.getRandomValues;
globalThis.crypto.getRandomValues = (buf) => { buf[0] = SEED; return buf; };
const { getShuffledOptions, mulberry32 } = await import('../../src/lib/option-shuffle.js?pinned-seed');
if (hadOwn) globalThis.crypto.getRandomValues = realGetRandomValues;
else delete globalThis.crypto.getRandomValues;

// The module's behaviour before this change, written out: the tail pattern it
// shipped with, the same seed derivation, Fisher-Yates over the head only.
const PREVIOUS_TAIL_RE = /^(?:ถูก(?:ทั้ง|ทุก)|ผิด(?:ทั้ง|ทุก)|all of the above|none of the above|ทั้ง[ก-ฮa-z]+|ข้อ\s*[a-zก-ฮ]\s*และ|ไม่มีข้อ(?:ใด|ไหน)?(?:ถูก|ผิด))/i;
// ...and the pattern as it shipped with the ทุกข้อ… forms, before ทั้ง… content
// rows were let go and "All correct" / "ไม่มีข้อใดกล่าวผิด" were pinned. The
// bank-wide check at the end compares against this one.
const SHIPPED_TAIL_RE = /^(?:ถูก(?:ทั้ง|ทุก)|ผิด(?:ทั้ง|ทุก)|all of the above|none of the above|ทั้ง[ก-ฮa-z]+|ข้อ\s*[a-zก-ฮ]\s*และ|ไม่มีข้อ(?:ใด|ไหน)?(?:ถูก|ผิด)|(?:ทำได้)?ทุกข้อ(?=\s*$|\s*(?:ถูก|ข้างต้น|ที่กล่าว))|ข้อ(?:ที่)?กล่าวมา(?:แล้ว)?ทั้งหมด)/i;
const previousOrder = (q) => orderUnder(q, (text) => PREVIOUS_TAIL_RE.test(text));
// The order the module produces when exactly the rows `isTail` names are pinned.
function orderUnder(q, isTail) {
  const options = q.options;
  if (options.length <= 1 || q.noShuffle === true) return options.map((_, i) => i);
  const head = [];
  const tail = [];
  options.forEach((o, i) => (isTail(String(o || '').trim(), i) ? tail : head).push(i));
  const idNum = Number.isFinite(q.id)
    ? q.id
    : Array.from(String((q.subject || '') + ':' + (q.id || ''))).reduce((h, ch) => ((h * 31) + ch.charCodeAt(0)) >>> 0, 0);
  const rand = mulberry32((idNum ^ SEED) >>> 0);
  for (let i = head.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [head[i], head[j]] = [head[j], head[i]];
  }
  return head.concat(tail);
}

// The first five are the texts of the eight catch-alls authored in the bank
// (com4 105, surg2 200, repro 233 and 239, poultry 1764 and 1917, surg1
// 94222, livestock-pathology 8247); the last two are the ข้อ…กล่าวมา…ทั้งหมด
// form the same rule covers.
const CATCH_ALLS = [
  'ทุกข้อ',
  'ทุกข้อถูก',
  'ทุกข้อข้างต้น',
  'ทุกข้อที่กล่าวมา ถูกต้องทั้งหมด',
  'ทำได้ทุกข้อที่กล่าวมา',
  'ข้อที่กล่าวมาทั้งหมด',
  'ข้อกล่าวมาแล้วทั้งหมด',
];

const q = (id, options, extra = {}) => ({ id, options, ...extra });

function assertMapsAgree(question, shuffled, label) {
  const { displayOptions, displayToOriginal, originalToDisplay } = shuffled;
  assert.equal(displayOptions.length, question.options.length, `${label}: row count changed`);
  assert.deepEqual([...displayToOriginal].sort((a, b) => a - b), question.options.map((_, i) => i), `${label}: not a permutation`);
  displayToOriginal.forEach((orig, disp) => {
    assert.equal(displayOptions[disp], question.options[orig], `${label}: row ${disp + 1} shows a different option than it maps to`);
    assert.equal(originalToDisplay[orig], disp, `${label}: the two maps disagree at row ${disp + 1}`);
  });
}

test('each ทุกข้อ… catch-all renders last across 50 seeds', () => {
  for (const tail of CATCH_ALLS) {
    for (const n of [4, 5]) {
      for (let id = 1; id <= 50; id++) {
        const heads = Array.from({ length: n - 1 }, (_, i) => `option-${i}`);
        const question = q(id, [...heads, tail]);
        const { displayOptions } = getShuffledOptions(question);
        assert.equal(displayOptions[n - 1], tail, `"${tail}" (id ${id}, ${n} options) landed on row ${displayOptions.indexOf(tail) + 1}`);
      }
    }
  }
});

test('the pin follows the text, not the authored position', () => {
  for (const tail of CATCH_ALLS) {
    for (let id = 1; id <= 50; id++) {
      const question = q(id, [tail, 'a', 'b', 'c']);
      const shuffled = getShuffledOptions(question);
      assert.equal(shuffled.displayOptions[3], tail, `"${tail}" authored first did not render last for id ${id}`);
      assertMapsAgree(question, shuffled, `"${tail}" id ${id}`);
    }
  }
});

test('ทุกข้อต่อ… (every joint) is a real answer and still shuffles', () => {
  for (const control of ['ทุกข้อต่อมีการอักเสบ', 'ทุกข้อเท้าบวม', 'ข้อกล่าวหาทั้งหมด']) {
    let moved = 0;
    for (let id = 1; id <= 200; id++) {
      const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', control]));
      if (displayOptions[3] !== control) moved++;
    }
    assert.ok(moved > 100, `"${control}" left the last row only ${moved}/200 times: it is being pinned`);
  }
});

test('the answer key maps to the row that shows it, pinned or not', () => {
  for (let id = 1; id <= 100; id++) {
    // The catch-all is the key: the student must be able to pick the last row.
    const keyed = q(id, ['a', 'b', 'c', 'ทุกข้อถูก'], { answer: 3 });
    const k = getShuffledOptions(keyed);
    assert.equal(k.originalToDisplay[3], 3);
    assert.equal(k.displayToOriginal[3], 3);
    assertMapsAgree(keyed, k, `keyed catch-all id ${id}`);
    // A head row is the key: it still lands wherever the shuffle put it and
    // clicking that row records it.
    const head = q(id, ['a', 'b', 'c', 'd', 'ทำได้ทุกข้อที่กล่าวมา'], { answer: 1 });
    const h = getShuffledOptions(head);
    const row = h.originalToDisplay[1];
    assert.ok(row < 4, `id ${id}: the keyed head row was pushed into the tail`);
    assert.equal(h.displayOptions[row], 'b');
    assert.equal(h.displayToOriginal[row], 1);
    assertMapsAgree(head, h, `keyed head id ${id}`);
  }
});

test('two catch-alls keep their authored order at the bottom', () => {
  for (let id = 1; id <= 50; id++) {
    const a = q(id, ['a', 'b', 'c', 'ทุกข้อถูก', 'ไม่มีข้อใดถูก']);
    const sa = getShuffledOptions(a);
    assert.deepEqual(sa.displayOptions.slice(3), ['ทุกข้อถูก', 'ไม่มีข้อใดถูก'], `id ${id}`);
    assertMapsAgree(a, sa, `two tails id ${id}`);

    const b = q(id, ['ไม่มีข้อใดถูก', 'a', 'ทุกข้อข้างต้น', 'b', 'c']);
    const sb = getShuffledOptions(b);
    assert.deepEqual(sb.displayOptions.slice(3), ['ไม่มีข้อใดถูก', 'ทุกข้อข้างต้น'], `id ${id}`);
    assert.deepEqual(sb.displayToOriginal.slice(3), [0, 2], `id ${id}`);
    assertMapsAgree(b, sb, `scattered tails id ${id}`);
  }
});

test('a question without these catch-alls keeps exactly the order it had', () => {
  const plain = [
    ['a', 'b', 'c', 'd'],
    ['a', 'b', 'c', 'd', 'e'],
    ['ทุกข้อต่อมีการอักเสบ', 'b', 'c', 'd'],
    ['a', 'b', 'c', 'ถูกทุกข้อ'],
    ['a', 'b', 'c', 'd', 'ไม่มีข้อใดถูก'],
    ['a', 'b'],
  ];
  for (const options of plain) {
    for (let id = 1; id <= 200; id++) {
      const question = q(id, options);
      assert.deepEqual(getShuffledOptions(question).displayToOriginal, previousOrder(question), `id ${id} ${JSON.stringify(options)}`);
    }
  }
  for (const id of ['x1', 'abc']) {
    const question = q(id, ['a', 'b', 'c', 'd'], { subject: 'swine-clinic' });
    assert.deepEqual(getShuffledOptions(question).displayToOriginal, previousOrder(question), `string id ${id}`);
  }
  const fixed = q(3, ['a', 'ทุกข้อถูก', 'c'], { noShuffle: true });
  assert.deepEqual(getShuffledOptions(fixed).displayToOriginal, [0, 1, 2], 'noShuffle is no longer honoured');
});

// Whether the module pins a row, read from what it does: a pinned row authored
// last stays last for every id.
const pinnedByModule = new Map();
function modulePins(text) {
  if (!pinnedByModule.has(text)) {
    let last = true;
    for (let id = 1; id <= 24 && last; id++) last = getShuffledOptions(q(id, ['a', 'b', 'c', text])).displayToOriginal[3] === 3;
    pinnedByModule.set(text, last);
  }
  return pinnedByModule.get(text);
}

test('across the real bank, only ทั้ง… rows and the All correct / กล่าวผิด catch-alls change how they pin', async () => {
  const all = [];
  for (const bank of BANK_REGISTRY) all.push(...(await bank.load()));
  const mcq = all.filter((x) => Array.isArray(x?.options) && x.options.length > 1);
  assert.ok(mcq.length > 5000, `expected the full bank, loaded ${mcq.length} questions`);
  const freed = [];
  const added = [];
  for (const x of mcq) {
    const label = `${x.subject}:${x.id}`;
    const now = getShuffledOptions(x);
    assertMapsAgree(x, now, label);
    if (x.noShuffle === true) {
      assert.deepEqual(now.displayToOriginal, x.options.map((_, i) => i), `${label}: noShuffle is no longer honoured`);
      continue;
    }
    const texts = x.options.map((o) => String(o || '').trim());
    const before = texts.map((t) => SHIPPED_TAIL_RE.test(t));
    const after = texts.map(modulePins);
    // The head shuffles and the pinned rows follow it in authored order...
    assert.deepEqual(now.displayToOriginal, orderUnder(x, (_, i) => after[i]), `${label}: not a shuffled head above its catch-alls`);
    // ...so a question whose rows all pin as they did keeps its exact order.
    if (before.every((b, i) => b === after[i])) {
      assert.deepEqual(now.displayToOriginal, orderUnder(x, (t) => SHIPPED_TAIL_RE.test(t)), `${label}: its order changed`);
      continue;
    }
    texts.forEach((t, i) => {
      if (before[i] && !after[i]) freed.push(`${label} ${t}`);
      if (!before[i] && after[i]) {
        added.push(`${label} ${t}`);
        assert.ok(after.slice(i).every(Boolean), `${label}: "${t}" was not authored below the options it covers`);
      }
    });
  }
  // Only the ทั้ง… alternative was narrowed, and none of the rows it lets go
  // sums up the other options.
  assert.ok(freed.length >= 1, 'no ทั้ง… row shuffles: the narrowing never fires');
  for (const row of freed) {
    const text = row.slice(row.indexOf(' ') + 1);
    assert.match(text, /^ทั้ง/, `${row}: a row that does not start with ทั้ง lost its pin`);
    assert.doesNotMatch(text, /^ทั้ง(?:หมด|คู่|สอง|สาม)(?:ข้อ)?\s*(?:ถูก(?:ต้อง)?|ผิด)?\s*$/, `${row}: a catch-all lost its pin`);
  }
  assert.ok(added.length >= 1, 'no All correct / กล่าวผิด row pins: the new forms never fire');
  assert.ok(added.length <= 20, `${added.length} rows newly pin; the pin is catching more than catch-alls`);
  for (const row of added) {
    assert.match(row.slice(row.indexOf(' ') + 1), /^(?:all\s+(?:in)?correct|ไม่มีข้อ(?:ใด|ไหน)?กล่าว(?:ถูก|ผิด))\s*\.?$/i, `${row} is not one of the new catch-alls`);
  }
});
