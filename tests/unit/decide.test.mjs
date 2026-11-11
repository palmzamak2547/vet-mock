// decide.test.mjs — the decide-for-student registry (src/lib/decide.js): a
// table per decision, the student's own choice winning, a bad stored value
// ignored and removed, a store that throws, and purity.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DECIDE_PREFIX, YOURS_WHY, decisionIds, decisionFor, defineDecision,
  decide, recall, remember, rememberRows, forget, adjustOpen, setAdjustOpen,
} from '../../src/lib/decide.js';
import { PRACTICE_SETUP, SR_SETUP, PHASE_FIRST_RUN, HOME_MODE } from '../../src/lib/decisions/index.js';
import { readFileSync, readdirSync } from 'node:fs';

const DECISION_IDS = decisionIds();
import { ladderPreset } from '../../src/lib/practice-ladder.js';

const memory = (seed = {}) => {
  const m = new Map(Object.entries(seed));
  return { m, get: (k) => (m.has(k) ? m.get(k) : null), set: (k, v) => m.set(k, String(v)), remove: (k) => m.delete(k) };
};
const throwing = { get() { throw new Error('blocked'); }, set() { throw new Error('blocked'); }, remove() { throw new Error('blocked'); } };

test('every entry carries the fields the registry promises', () => {
  assert.deepEqual([...DECISION_IDS].sort(), ['home.mode', 'phase.firstRun', 'practice.setup', 'sr.setup']);
  assert.deepEqual([PRACTICE_SETUP, SR_SETUP, PHASE_FIRST_RUN, HOME_MODE], ['practice.setup', 'sr.setup', 'phase.firstRun', 'home.mode']);
  for (const id of DECISION_IDS) {
    const e = decisionFor(id);
    assert.equal(e.id, id);
    assert.equal(typeof e.auto, 'function');
    assert.equal(typeof e.valid, 'function');
  }
  // Every decision file says which principle it applies, and the index lists every file.
  const dir = new URL('../../src/lib/decisions/', import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js');
  const index = readFileSync(new URL('index.js', dir), 'utf8');
  for (const f of files) {
    assert.match(readFileSync(new URL(f, dir), 'utf8'), /^\/\/ Principle: /m, `${f} names its principle`);
    assert.ok(index.includes(`'./${f}'`), `${f} is listed in decisions/index.js`);
  }
  assert.equal(files.length, DECISION_IDS.length);
  assert.throws(() => decide('nope', {}, memory()), /no decision/);
  assert.throws(() => defineDecision({ id: 'broken' }), /needs an id/);
});

test('practice.setup wraps the ladder preset: the same set a topic tap has always made', () => {
  const rows = [
    // signals, expected value fields
    [{ step: 'understand', available: 153, timePerQ: 60, instantFeedback: false }, { numQuestions: 10, useTimer: false, instantFeedback: true }],
    [{ step: 'understand', available: 4, timePerQ: 30 }, { numQuestions: 4, useTimer: false, timePerQ: 30 }],
    [{ step: 'timed', available: 153, timePerQ: 45, instantFeedback: false }, { numQuestions: 20, useTimer: true, timePerQ: 45, instantFeedback: false }],
    [{ step: 'timed', available: null, timePerQ: 2 }, { numQuestions: 20, useTimer: true, timePerQ: 60, instantFeedback: true }],
    // the exam rung is never recalled for a topic tap; it opens rung 1
    [{ step: 'exam', available: 200 }, { numQuestions: 10, useTimer: false, step: 'understand' }],
  ];
  for (const [signals, expected] of rows) {
    const d = decide('practice.setup', signals, memory());
    assert.equal(d.by, 'auto');
    for (const [k, v] of Object.entries(expected)) assert.equal(d.value[k], v, `${JSON.stringify(signals)} → ${k}`);
    const preset = ladderPreset(d.value.step, { available: signals.available > 0 ? signals.available : null, timePerQ: signals.timePerQ });
    assert.equal(d.value.numQuestions, preset.numQuestions, 'the count is the ladder preset\'s');
    assert.equal(d.value.useTimer, preset.useTimer);
    assert.ok(d.why.length > 0 && d.why.length <= 80, 'one short line of why');
    assert.ok(!d.why.includes('·'), 'no middle dot in Thai copy');
  }
});

test('practice.setup says why in the student\'s situation', () => {
  assert.match(decide('practice.setup', { step: 'understand' }, memory()).why, /^เริ่มขั้นแรก/);
  assert.match(decide('practice.setup', { step: 'understand', hasHistory: true }, memory()).why, /^ขั้นทำความเข้าใจ/);
  assert.match(decide('practice.setup', { step: 'timed' }, memory()).why, /^ขั้นใช้ความรู้/);
  // The house hedge, and the order the set really gets (B9).
  assert.match(decide('practice.setup', { step: 'understand' }, memory()).why, /^เริ่มขั้นแรก ข้อที่น่าจะง่ายมาก่อน$/);
  assert.match(decide('practice.setup', { step: 'understand', pick: 'adaptive', hasHistory: true }, memory()).why, /^ขั้นทำความเข้าใจ เลือกข้อตามระดับของคุณ/);
  // A rung picked by hand and one reached through results read the same and both true (A6).
  assert.match(decide('practice.setup', { step: 'timed' }, memory()).why, /^ขั้นใช้ความรู้ ขั้นล่าสุดที่คุณฝึก/);
  // Timely, with no day count that could disagree with Home's clock (B3, B9).
  for (const days of [0, 1, 3, 14]) {
    const why = decide('practice.setup', { step: 'understand', daysToPaper: days }, memory()).why;
    assert.match(why, /ใกล้สอบแล้ว ลองขั้นแบบสอบใน "ปรับเอง"$/, `${days}`);
    assert.doesNotMatch(why, /\d+ วัน/);
  }
  assert.doesNotMatch(decide('practice.setup', { step: 'understand', daysToPaper: 30 }, memory()).why, /ใกล้สอบ/);
  assert.doesNotMatch(decide('practice.setup', { step: 'understand', daysToPaper: null }, memory()).why, /ใกล้สอบ/);
});

test('a remembered row equal to the choice the app makes is not called theirs', () => {
  const io = memory();
  rememberRows('practice.setup', { numQuestions: 10, useTimer: false }, io);
  const d = decide('practice.setup', { step: 'understand', available: 153 }, io);
  assert.equal(d.by, 'auto', 'nothing differs, so there is nothing to restore');
  assert.notEqual(d.why, YOURS_WHY);
  assert.equal(decide('practice.setup', { step: 'timed', available: 153 }, io).by, 'you', 'on rung 2 the same rows do differ');
});

test('validators read only their own fields and survive hostile stored values (A7)', () => {
  const key = `${DECIDE_PREFIX}practice.setup`;
  for (const bad of ['{"constructor":5}', '{"__proto__":1}', '{"toString":1}']) {
    const io = memory({ [key]: bad });
    assert.doesNotThrow(() => decide('practice.setup', { step: 'understand', available: 50 }, io), bad);
    assert.equal(decide('practice.setup', { step: 'understand', available: 50 }, io).by, 'auto', bad);
  }
  assert.equal(remember('practice.setup', { numQuestions: 1945 }, memory()), true, 'a whole-bank count is a count');
});

test('a remembered row wins, merged over the rest and capped to the pool', () => {
  const io = memory();
  assert.equal(rememberRows('practice.setup', { numQuestions: 30 }, io), true);
  assert.equal(rememberRows('practice.setup', { useTimer: true, timePerQ: 30 }, io), true);
  assert.deepEqual(JSON.parse(io.get(`${DECIDE_PREFIX}practice.setup`)), { numQuestions: 30, useTimer: true, timePerQ: 30 });
  const d = decide('practice.setup', { step: 'understand', available: 153, timePerQ: 60 }, io);
  assert.equal(d.by, 'you');
  assert.equal(d.why, YOURS_WHY);
  assert.equal(d.value.numQuestions, 30);
  assert.equal(d.value.useTimer, true);
  assert.equal(d.value.timePerQ, 30);
  assert.equal(d.value.step, 'timed', 'the rung follows the clock');
  assert.equal(decide('practice.setup', { step: 'understand', available: 12 }, io).value.numQuestions, 12, 'never more than the pool holds');
  forget('practice.setup', io);
  const back = decide('practice.setup', { step: 'understand', available: 153 }, io);
  assert.equal(back.by, 'auto');
  assert.equal(back.value.numQuestions, 10);
});

test('an invalid stored value is ignored and removed', () => {
  const key = `${DECIDE_PREFIX}practice.setup`;
  for (const bad of ['{"numQuestions":0}', '{"pick":"panic"}', '{"oops":1}', '[]', '{}', 'not json', '"10"']) {
    const io = memory({ [key]: bad });
    const d = decide('practice.setup', { step: 'understand', available: 50 }, io);
    assert.equal(d.by, 'auto', bad);
    assert.equal(io.m.has(key), false, `${bad} is removed`);
  }
  assert.equal(remember('practice.setup', { numQuestions: -3 }, memory()), false, 'an invalid choice is never stored');
  assert.equal(remember('phase.firstRun', { phase: '1-final' }, memory()), false, 'a decision with no key stores nothing');
});

test('a store that throws never breaks a decision', () => {
  for (const id of DECISION_IDS) assert.doesNotThrow(() => decide(id, {}, throwing), id);
  assert.equal(decide('practice.setup', { step: 'timed', available: 40 }, throwing).value.numQuestions, 20);
  assert.equal(remember('practice.setup', { numQuestions: 5 }, throwing), false);
  assert.doesNotThrow(() => forget('practice.setup', throwing));
  assert.doesNotThrow(() => forget('sr.setup', throwing));
  assert.equal(recall('practice.setup', throwing), null);
  assert.equal(adjustOpen('config', throwing), false);
  assert.doesNotThrow(() => setAdjustOpen('config', true, throwing));
  // no storage at all (a worker, a test runner)
  assert.equal(decide('practice.setup', { step: 'understand' }, null).by, 'auto');
});

test('same inputs give the same output, and a rule never mutates its signals', () => {
  for (const [id, signals] of [
    ['practice.setup', { step: 'timed', available: 33, timePerQ: 40, instantFeedback: false, daysToPaper: 5, hasHistory: true }],
    ['sr.setup', { planSize: 12, dueReviewed: 3, newCount: 9 }],
    ['phase.firstRun', { current: '1-final' }],
    ['home.mode', { cards: ['weak', 'pick-count'], weakPct: 40 }],
  ]) {
    const frozen = structuredClone(signals);
    const a = decide(id, signals, memory());
    const b = decide(id, signals, memory());
    assert.deepEqual(a, b, id);
    assert.deepEqual(signals, frozen, `${id} leaves its signals alone`);
  }
});

test('sr.setup: today\'s plan, else a day\'s size; the planner\'s own keys are the student\'s choice', () => {
  const rows = [
    [{ planSize: 12 }, 12, /^ตามแผนวันนี้/],
    [{ dueReviewed: 40, newCount: 3 }, 25, /^ใบที่ค้างนานสุดมาก่อน$/],
    [{ dueReviewed: 0, newCount: 300 }, 25, /^ไม่มีใบค้าง วันนี้เป็นใบใหม่ทั้งหมด$/],
    [{}, 25, /^$/],
  ];
  for (const [signals, size, why] of rows) {
    const d = decide('sr.setup', signals, memory());
    assert.equal(d.by, 'auto');
    assert.equal(d.value.size, size);
    assert.deepEqual({ ...d.value, size: 0 }, { yearScope: 'current', subject: 'all', phaseScope: 'current', size: 0 });
    assert.match(d.why, why);
  }
  // The planner writes every row on first mount: defaults stored are not a choice.
  const defaults = memory({ 'vmx-sr-session-size': '25', 'vmx-sr-subject-filter': '"all"', 'vmx-sr-year-scope': '"current"', 'vmx-sr-phase-scope': '"current"', 'vmx-sr-scheduler': 'sm2' });
  assert.equal(decide('sr.setup', {}, defaults).by, 'auto');
  const own = memory({ 'vmx-sr-session-size': '50', 'vmx-sr-subject-filter': '"zoonoses"', 'vmx-sr-scheduler': 'fsrs' });
  const d = decide('sr.setup', { dueReviewed: 9 }, own);
  assert.equal(d.by, 'you');
  assert.equal(d.value.size, 50);
  assert.equal(d.value.subject, 'zoonoses');
  // a plan's size is for that one session and wins over a saved size alone
  assert.equal(decide('sr.setup', { planSize: 8 }, memory({ 'vmx-sr-session-size': '50' })).by, 'auto');
  assert.equal(decide('sr.setup', { planSize: 8 }, own).value.size, 8);
  // Only a size the planner offers is anyone's choice (A3): Home's plan wrote
  // 7 into this key until 5.192.1, and -4 is broken.
  for (const size of ['7', '-4', '12', '"lots"']) {
    assert.equal(decide('sr.setup', { dueReviewed: 9 }, memory({ 'vmx-sr-session-size': size })).by, 'auto', size);
  }
  // The scheduler is a device preference, never part of a reset (A9).
  assert.equal(decide('sr.setup', {}, memory({ 'vmx-sr-scheduler': 'fsrs' })).by, 'auto');
  forget('sr.setup', own);
  assert.deepEqual([...own.m.keys()], ['vmx-sr-scheduler'], 'a reset leaves the scheduler alone');
});

test('phase.firstRun: the timetable\'s paper, or ask when it has none', () => {
  const rows = [
    [{ current: '1-final' }, { phase: '1-final', ask: false }, 'ตามตารางสอบ'],
    [{ current: '1-mid' }, { phase: '1-mid', ask: false }, 'ตามตารางสอบ'],
    [{ current: null }, { phase: null, ask: true }, ''],
    [{ current: 'garbage' }, { phase: null, ask: true }, ''],
    [{ current: '1-final', scaffold: true }, { phase: null, ask: false }, ''],
  ];
  for (const [signals, value, why] of rows) {
    const d = decide('phase.firstRun', signals, memory());
    assert.deepEqual(d.value, value, JSON.stringify(signals));
    assert.equal(d.why, why);
    assert.equal(d.by, 'auto');
  }
});

test('home.mode: near a paper, then wrong answers, then the weak topic, then this term\'s slides', () => {
  const all = ['near-exam', 'wrong', 'weak', 'current-scope', 'pick-count'];
  const rows = [
    // วันนี้ / พรุ่งนี้ as Home's clock says it, a space before the name (B3); further out the
    // card's own subject and date are the reason, and no line repeats them.
    [{ cards: all, daysToPaper: 4, paperSubject: 'ระบาดวิทยา', wrongCount: 3, weakPct: 40 }, 'near-exam', ''],
    [{ cards: all, daysToPaper: 1, paperSubject: 'One Health' }, 'near-exam', 'พรุ่งนี้สอบ One Health'],
    [{ cards: all, daysToPaper: 0, paperSubject: 'English for Vet Profession I' }, 'near-exam', 'วันนี้สอบ English for Vet Profession I'],
    [{ cards: all, daysToPaper: 20, wrongCount: 3, weakPct: 40 }, 'wrong', 'มีข้อที่ยังตอบผิด 3 ข้อ'],
    // Only what HomeView measured (B10); a reason that restates its card is left out.
    [{ cards: ['near-exam', 'weak', 'current-scope'], daysToPaper: 20, wrongCount: 3, weakPct: 40 }, 'weak', 'หัวข้อที่คุณตอบถูก 40% ใน 90 วันล่าสุด'],
    [{ cards: ['current-scope', 'pick-count'], wrongCount: 0 }, 'current-scope', ''],
    [{ cards: ['pick-count', 'mock-exam'] }, 'pick-count', ''],
    [{ cards: ['near-exam', 'pick-count'], daysToPaper: -1 }, 'pick-count', ''],
  ];
  for (const [signals, value, why] of rows) {
    const d = decide('home.mode', signals, memory());
    assert.equal(d.value, value, JSON.stringify(signals));
    assert.equal(d.why, why);
    assert.doesNotMatch(d.why, /อีก \d+ วัน/);
  }
});

test('the ปรับเอง disclosure remembers its state per screen', () => {
  const io = memory();
  assert.equal(adjustOpen('config', io), false, 'closed by default');
  setAdjustOpen('config', true, io);
  assert.equal(adjustOpen('config', io), true);
  assert.equal(adjustOpen('sr', io), false);
  setAdjustOpen('config', false, io);
  assert.equal(adjustOpen('config', io), false);
  assert.equal(io.m.size, 0);
});

test('a why carried to the next screen is read once', async () => {
  const { leaveWhy, peekWhy, takeWhy } = await import('../../src/lib/decide.js');
  const io = memory();
  leaveWhy('home', 'เลือกเทอม 1 ปลายภาคให้ตามตารางสอบ', io);
  assert.equal(peekWhy('home', io), 'เลือกเทอม 1 ปลายภาคให้ตามตารางสอบ', 'a render may read it');
  assert.equal(takeWhy('home', io), 'เลือกเทอม 1 ปลายภาคให้ตามตารางสอบ');
  assert.equal(takeWhy('home', io), null, 'once');
  leaveWhy('home', '', io);
  assert.equal(peekWhy('home', io), null, 'an empty why leaves nothing');
  assert.doesNotThrow(() => leaveWhy('home', 'x', throwing));
  assert.equal(takeWhy('home', throwing), null);
});
