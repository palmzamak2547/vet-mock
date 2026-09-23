// ============================================================
// Every question figure resolves, and says what it shows
// ============================================================
// 57 rows carry a figure. A missing file was handled only by the delivery
// generator, which blocks the question quietly: once the generated file was
// regenerated, the gate stayed green and the question vanished from practice
// without anyone being told. And 55 of the 57 had no imageAlt, so a screen
// reader announced "ภาพประกอบข้อ 821 วิชา com3" instead of the figure.
//
// lint:provenance now fails on a figure path that does not resolve under
// public/, on anything that is neither such a path nor an inline image, and
// on more figures without a real imageAlt (20+ characters) than the budget,
// which may only fall.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { FIGURE_ALT_BUDGET, FIGURE_ALT_MIN, checkFigures, lintRows } from '../../scripts/lint-provenance.mjs';

const LIVE = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) LIVE.push(q);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUBLIC = path.join(ROOT, 'public');

let nextId = 996000;
const row = (extra) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'mcq', ...extra });
const ALT = 'ภาพวาดประกอบที่บรรยายสิ่งที่เห็นในภาพอย่างครบถ้วน';

test('a figure path that does not resolve under public/ fails, however it is blocked downstream', () => {
  const existing = row({ image: '/figures/questions/q105129.webp', imageAlt: ALT });
  const renamed = row({ image: '/figures/questions/q105129-renamed.webp', imageAlt: ALT });
  const res = checkFigures([existing, renamed], { publicDir: PUBLIC, altBudget: 0 });
  assert.equal(res.errors.length, 1, res.errors.join('\n'));
  assert.match(res.errors[0], /q105129-renamed\.webp/);
  assert.equal(res.counts.missing, 1);
});

test('renaming a real figure in a scratch copy of public/ fails the check', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'figs-'));
  try {
    fs.mkdirSync(path.join(tmp, 'figures', 'questions'), { recursive: true });
    const q = row({ image: '/figures/questions/probe.webp', imageAlt: ALT });
    fs.writeFileSync(path.join(tmp, 'figures', 'questions', 'probe.webp'), 'x');
    assert.deepEqual(checkFigures([q], { publicDir: tmp, altBudget: 0 }).errors, []);
    fs.renameSync(path.join(tmp, 'figures', 'questions', 'probe.webp'), path.join(tmp, 'figures', 'questions', 'probe-2.webp'));
    assert.equal(checkFigures([q], { publicDir: tmp, altBudget: 0 }).errors.length, 1);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('an inline image is fine, and anything that is not a local figure is not', () => {
  const inline = row({ image: 'data:image/svg+xml;utf8,%3Csvg%3E%3C%2Fsvg%3E', imageAlt: ALT });
  const remote = row({ image: 'https://example.com/figure.png', imageAlt: ALT });
  const res = checkFigures([inline, remote], { publicDir: PUBLIC, altBudget: 0 });
  assert.equal(res.errors.length, 1);
  assert.match(res.errors[0], /example\.com/);
});

test('a figure without a real imageAlt counts against a budget that may only fall', () => {
  const noAlt = row({ imagePath: '/images/practrum/dystocia/grid-A-L.png' });
  const shortAlt = row({ imagePath: '/images/practrum/dystocia/grid-A-L.png', imageAlt: 'ภาพประกอบ' });
  const good = row({ imagePath: '/images/practrum/dystocia/grid-A-L.png', imageAlt: ALT });
  assert.ok([...ALT].length >= FIGURE_ALT_MIN && [...'ภาพประกอบ'].length < FIGURE_ALT_MIN);

  const over = checkFigures([noAlt, shortAlt, good], { publicDir: PUBLIC, altBudget: 1 });
  assert.equal(over.counts.withoutAlt, 2);
  assert.equal(over.errors.length, 1, 'two rows without alt against a budget of one');

  const at = checkFigures([noAlt, shortAlt, good], { publicDir: PUBLIC, altBudget: 2 });
  assert.deepEqual(at.errors, []);

  const under = checkFigures([good], { publicDir: PUBLIC, altBudget: 2 });
  assert.deepEqual(under.errors, []);
  assert.equal(under.warnings.length, 1, 'a budget above the count asks to be lowered');
});

test('lint:provenance itself fails when one live figure no longer resolves', () => {
  assert.deepEqual(lintRows(LIVE).errors, [], 'the live bank passes as it is');
  const renamed = LIVE.map((q) => (q.id === 104006 ? { ...q, image: '/figures/questions/q104006-renamed.webp' } : q));
  const { errors } = lintRows(renamed);
  assert.equal(errors.length, 1, errors.join('\n'));
  assert.match(errors[0], /q104006-renamed\.webp does not exist under public\//);
});

test('every figure in the live bank resolves and describes itself', () => {
  const rows = LIVE;
  const figures = rows.filter((q) => q.image || q.imagePath);
  assert.ok(figures.length >= 57, `only ${figures.length} figures found`);
  const res = checkFigures(rows, { publicDir: PUBLIC });
  assert.deepEqual(res.errors, []);
  assert.equal(res.counts.withoutAlt, FIGURE_ALT_BUDGET);
  assert.equal(FIGURE_ALT_BUDGET, 0, 'every figure carries an imageAlt');
});

// 104006 asks for the distance a labelled scale marks on the airborne
// transmission figure (deck p.17). Without the figure, 6 feet is as defensible
// as the keyed 3 feet, so the row ships with the real figure cut from the deck.
test('104006 carries the airborne-transmission figure it reads a label from', () => {
  const q = LIVE.find((r) => r.id === 104006);
  assert.ok(q, '104006 is in the bank');
  assert.equal(q.image, '/figures/questions/q104006.webp');
  assert.ok(fs.existsSync(path.join(PUBLIC, q.image)), 'figure file exists');
  assert.ok([...(q.imageAlt || '')].length >= FIGURE_ALT_MIN, 'figure has an imageAlt');
});
