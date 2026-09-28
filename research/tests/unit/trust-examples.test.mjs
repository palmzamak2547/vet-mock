// The example datasets [M2-DESIGN.md 11.4; competitor-gaps.md D7]: the generator is PCG32 (checked against
// the reference output of pcg32-demo), every committed file redraws byte for byte from its recorded seed,
// every file is labelled made-up, the list in src/data/examples.js agrees with the files, each codebook hint
// describes exactly the columns and values in the file, and the gaps and mistakes written in on purpose
// are exactly the ones the files contain. OWNER: trust role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pcg32, SPECS, STREAM, renderExample } from '../../scripts/make-examples.mjs';
import { EXAMPLES, getExample } from '../../src/data/examples.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { DESIGN_IDS } from '../../src/lib/runtime/spec.js';
import trust from '../../src/i18n/trust.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const committed = (id) => readFileSync(here(`../../src/data/examples/${id}.js`), 'utf8').replace(/\r\n/g, '\n');
const load = async (id) => (await getExample(id).load()).default;
/** @param {string} csv */
function parse(csv) {
  const lines = csv.replace(/\n$/, '').split('\n');
  const header = lines[0].split(',');
  return { header, rows: lines.slice(1).map((l) => l.split(',')) };
}

test('PCG32 gives the reference output of pcg32-demo for seed 42, stream 54 (O\'Neill 2014)', () => {
  const rng = pcg32(42, 54);
  const got = Array.from({ length: 6 }, () => rng.next().toString(16).padStart(8, '0'));
  assert.deepEqual(got, ['a15c02b7', '7b47f409', 'ba1d3330', '83d2f293', 'bfa4784b', 'cbed606e']);
  assert.equal(STREAM, 54);
  // A different seed gives a different stream (the check can fail).
  assert.notEqual(pcg32(43, 54).next(), 0xa15c02b7);
});

test('bounded draws stay in range and a shuffle keeps every element', () => {
  const rng = pcg32(7);
  for (let i = 0; i < 2000; i++) {
    const n = 1 + (i % 17);
    const r = rng.bounded(n);
    assert.ok(Number.isInteger(r) && r >= 0 && r < n);
  }
  const arr = Array.from({ length: 50 }, (_, i) => i);
  assert.deepEqual([...rng.shuffle(arr.slice())].sort((a, b) => a - b), arr);
});

test('every committed example redraws byte for byte from its seed, and a changed value is caught', () => {
  assert.deepEqual(SPECS.map((s) => s.id), EXAMPLES.map((e) => e.id));
  for (const spec of SPECS) {
    const text = renderExample(spec);
    assert.equal(committed(spec.id), text, `stale: run node scripts/make-examples.mjs (${spec.id})`);
    assert.ok(text.includes(`seed ${spec.seed}`) && text.includes('ข้อมูลสมมุติ'));
  }
  // The proof that this test can fail: one digit changed in a committed file no longer matches.
  const tampered = committed('thermometers').replace(/rectal_c,ear_c\\nD01,(\d)/, (m, d) => m.slice(0, -1) + String((Number(d) + 1) % 10));
  assert.notEqual(tampered, renderExample(SPECS.find((s) => s.id === 'thermometers')));
});

test('the example list agrees with the files, designs, methods and words', async () => {
  const methodIds = new Set(METHODS.map((m) => m.id));
  for (const e of EXAMPLES) {
    const d = await load(e.id);
    assert.equal(d.id, e.id);
    assert.equal(d.madeUp, true);
    assert.equal(d.generator.seed, SPECS.find((s) => s.id === e.id).seed);
    const first = parse(d.csv);
    assert.equal(first.rows.length, e.rows, `${e.id} rows`);
    assert.equal(first.header.length, e.columns, `${e.id} columns`);
    for (const r of first.rows) assert.equal(r.length, first.header.length, `${e.id} ragged row`);
    assert.equal(d.second ? parse(d.second.csv).rows.length : null, e.secondRows, `${e.id} second file`);
    assert.ok(DESIGN_IDS.includes(e.design), `${e.id} design ${e.design}`);
    for (const m of e.methods) assert.ok(methodIds.has(m), `${e.id} method ${m}`);
    for (const lang of ['th', 'en']) {
      assert.ok(trust[lang][e.titleKey], `${lang} ${e.titleKey}`);
      assert.ok(trust[lang][e.descKey], `${lang} ${e.descKey}`);
    }
    assert.ok(/\.csv$/.test(d.fileName));
  }
});

const TYPES = new Set(['continuous', 'count', 'binary', 'nominal', 'ordinal', 'date', 'id', 'text']);
const ROLES = new Set(['outcome', 'exposure', 'confounder', 'group', 'cluster', 'id', 'pair', 'rater', 'time', 'none']);
const LEVELS = new Set(['region', 'farm', 'pen', 'household', 'litter', 'animal', 'sample', 'visit']);

test('each codebook hint describes exactly the columns and the values in the files', async () => {
  for (const e of EXAMPLES) {
    const d = await load(e.id);
    const tables = [parse(d.csv), ...(d.second ? [parse(d.second.csv)] : [])];
    const headers = new Set(tables.flatMap((t) => t.header));
    assert.deepEqual(new Set(d.codebook.map((c) => c.name)), headers, `${e.id}: codebook names`);
    for (const c of d.codebook) {
      assert.ok(TYPES.has(c.type) && ROLES.has(c.role) && LEVELS.has(c.level), `${e.id}.${c.name}: ${c.type}/${c.role}/${c.level}`);
      assert.ok(c.labelTh && c.labelEn, `${e.id}.${c.name}: labels`);
      const values = tables.flatMap((t) => {
        const i = t.header.indexOf(c.name);
        return i < 0 ? [] : t.rows.map((r) => r[i]);
      }).filter((v) => v !== '');
      if (c.levels.length) {
        const allowed = new Set(c.levels.map((l) => l.value));
        for (const v of values) assert.ok(allowed.has(v), `${e.id}.${c.name}: value ${v} has no level`);
        for (const l of c.levels) assert.ok(l.labelTh && l.labelEn, `${e.id}.${c.name}: level labels`);
      }
      if (c.reference !== null) assert.ok(c.levels.some((l) => l.value === c.reference), `${e.id}.${c.name}: reference`);
      if (c.positive !== null) assert.ok(c.levels.some((l) => l.value === c.positive), `${e.id}.${c.name}: positive`);
      if (c.range && c.name !== 'farm_id') {
        for (const v of values) {
          const x = Number(v);
          assert.ok(Number.isFinite(x) && x >= c.range.min && x <= c.range.max, `${e.id}.${c.name}: ${v} outside ${c.range.min}..${c.range.max}`);
        }
      }
    }
  }
});

test('the gaps and mistakes written in on purpose are exactly what the files hold', async () => {
  // Piglets: P09 missed the last weighing; nobody else did.
  const growth = parse((await load('piglet-growth')).csv);
  const blanks = growth.rows.flatMap((r) => r.map((v, i) => (v === '' ? `${r[0]}.${growth.header[i]}` : null)).filter(Boolean));
  assert.deepEqual(blanks, ['P09.wt_w6']);

  // Questionnaire: R23 left item 4 blank.
  const q = parse((await load('questionnaire')).csv);
  const qBlanks = q.rows.flatMap((r) => r.map((v, i) => (v === '' ? `${r[0]}.${q.header[i]}` : null)).filter(Boolean));
  assert.deepEqual(qBlanks, ['R23.q4']);

  // Merge: one goat carries the farm code F1O, which is not in the farm file; every other code is.
  const m = await load('merge-farms');
  const animals = parse(m.csv);
  const farms = new Set(parse(m.second.csv).rows.map((r) => r[0]));
  const unmatched = animals.rows.filter((r) => !farms.has(r[1])).map((r) => `${r[0]}:${r[1]}`);
  assert.deepEqual(unmatched, ['F10-03:F1O']);
  assert.equal(farms.size, 12);

  // Double entry: the differences between the two typists are exactly the planted ones.
  const de = await load('double-entry');
  const a = parse(de.csv);
  const b = parse(de.second.csv);
  const byKey = (t) => new Map(t.rows.map((r) => [r[0], r]));
  const ka = byKey(a);
  const kb = byKey(b);
  const found = [];
  for (const [k, ra] of ka) {
    const rb = kb.get(k);
    if (!rb) continue;
    for (let i = 1; i < a.header.length; i++) if (ra[i] !== rb[i]) found.push({ row: k, column: a.header[i], a: ra[i], b: rb[i] });
  }
  const onlyA = [...ka.keys()].filter((k) => !kb.has(k));
  const onlyB = [...kb.keys()].filter((k) => !ka.has(k));
  assert.deepEqual(onlyA, ['D028']);
  assert.deepEqual(onlyB, ['D082']);
  const planted = de.planted.filter((p) => p.column !== 'record_no');
  assert.deepEqual(found, planted);
  assert.equal(found.length, 4);
  assert.ok(found.some((f) => f.column === 'age_years' && f.b === `${f.a}.0`), 'the "1" against "1.0" case is present');
});

test('each example has the shape its method needs', async () => {
  // Two-way ANOVA: 3 diets x 2 sexes, 8 birds in every cell (balanced, so Tukey is offered).
  const feed = parse((await load('feed-trial')).csv);
  const cells = new Map();
  for (const r of feed.rows) cells.set(`${r[1]}|${r[2]}`, (cells.get(`${r[1]}|${r[2]}`) || 0) + 1);
  assert.equal(cells.size, 6);
  assert.ok([...cells.values()].every((n) => n === 8));

  // Kaplan-Meier: events and censored animals in both groups, follow-up within 1..90 days.
  const calves = parse((await load('calf-survival')).csv);
  for (const g of ['ภายใน 6 ชม.', 'หลัง 6 ชม.']) {
    const rows = calves.rows.filter((r) => r[1] === g);
    assert.ok(rows.some((r) => r[5] === 'ตาย') && rows.some((r) => r[5] === 'มีชีวิต'), g);
  }
  for (const r of calves.rows) assert.equal(r[6] === '', r[5] === 'ตาย', `${r[0]}: end_reason blank only for deaths`);

  // ROC: both reference classes present; Bland-Altman: two numeric columns on every dog.
  const roc = parse((await load('rapid-test')).csv);
  assert.equal(roc.rows.filter((r) => r[3] === 'บวก').length, 34);
  const ba = parse((await load('thermometers')).csv);
  assert.ok(ba.rows.every((r) => Number.isFinite(Number(r[1])) && Number.isFinite(Number(r[2]))));

  // Cronbach: six Likert items scored 1..5.
  const q = parse((await load('questionnaire')).csv);
  assert.deepEqual(q.header.slice(2), ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']);
});
