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

  // ELISA: two sera read outside the curve, P05 below every zero-standard well and P11 above every standard
  // well; no other serum does, and the planted list names exactly their wells (M3-DESIGN.md C5).
  const elisaData = await load('elisa-plate');
  const elisa = parse(elisaData.csv);
  const standards = elisa.rows.filter((r) => r[2] !== '');
  const zero = standards.filter((r) => Number(r[2]) === 0).map((r) => Number(r[3]));
  const sera = elisa.rows.filter((r) => r[2] === '');
  assert.deepEqual(sera.filter((r) => Number(r[3]) < Math.min(...zero)).map((r) => r[1]), ['P05']);
  assert.deepEqual(sera.filter((r) => Number(r[3]) > Math.max(...standards.map((s) => Number(s[3])))).map((r) => r[1]), ['P11']);
  assert.deepEqual(elisaData.planted.map((p) => `${p.row}.${p.column}`), sera.filter((r) => ['P05', 'P11'].includes(r[1])).map((r) => `${r[0]}.od450`));
  // Every other M3a example is complete: no blank cell anywhere.
  for (const id of ['dose-arms', 'glucose-tolerance', 'qpcr-two-references', 'herd-panel']) {
    const t = parse((await load(id)).csv);
    assert.ok(t.rows.every((r) => r.every((v) => v !== '')), `${id}: a blank cell`);
    assert.deepEqual((await load(id)).planted, [], id);
  }
});

const mean = (v) => v.reduce((s, x) => s + x, 0) / v.length;
function pearson(a, b) {
  const ma = mean(a);
  const mb = mean(b);
  let sab = 0;
  let saa = 0;
  let sbb = 0;
  for (let i = 0; i < a.length; i++) {
    sab += (a[i] - ma) * (b[i] - mb);
    saa += (a[i] - ma) ** 2;
    sbb += (b[i] - mb) ** 2;
  }
  return sab / Math.sqrt(saa * sbb);
}

test('the M3a examples have the shapes their lab methods need (M3-DESIGN.md 3.1, 7)', async () => {
  // Standard curve: eight standards in duplicate, the zero standard among them, and twelve sera with an OD
  // and no concentration (the rows to interpolate, C4); the mean OD rises with every step of concentration.
  const elisa = parse((await load('elisa-plate')).csv);
  assert.deepEqual(elisa.header, ['well', 'sample', 'conc_pg_ml', 'od450']);
  const standards = elisa.rows.filter((r) => r[2] !== '');
  const levels = [...new Set(standards.map((r) => Number(r[2])))].sort((a, b) => a - b);
  assert.deepEqual(levels, [0, 15.6, 31.3, 62.5, 125, 250, 500, 1000]);
  for (const x of levels) assert.equal(standards.filter((r) => Number(r[2]) === x).length, 2, `standard ${x} in duplicate`);
  const odAt = levels.map((x) => mean(standards.filter((r) => Number(r[2]) === x).map((r) => Number(r[3]))));
  for (let k = 1; k < odAt.length; k++) assert.ok(odAt[k] > odAt[k - 1], `OD rises from ${levels[k - 1]} to ${levels[k]}`);
  const sera = elisa.rows.filter((r) => r[2] === '');
  assert.equal(sera.length, 12);
  assert.ok(sera.every((r) => /^P\d\d$/.test(r[1]) && Number.isFinite(Number(r[3])) && r[3] !== ''));
  assert.equal(new Set(elisa.rows.map((r) => r[0])).size, 28, 'one row per well');

  // Dose-response: two arms, seven concentrations including 0, three wells at each. Growth falls below the
  // drug-free wells at every concentration in both arms, and the exposed arm needs about three times the
  // concentration to halve it (read where the mean crosses half-way, on a log scale between neighbours).
  const dose = parse((await load('dose-arms')).csv);
  const concs = [...new Set(dose.rows.map((r) => Number(r[2])))].sort((a, b) => a - b);
  assert.deepEqual(concs, [0, 0.5, 1, 2, 4, 8, 16]);
  const half = {};
  for (const arm of ['ควบคุม', 'ผ่านยา']) {
    const at = concs.map((x) => {
      const wells = dose.rows.filter((r) => r[1] === arm && Number(r[2]) === x);
      assert.equal(wells.length, 3, `${arm} ${x}`);
      return mean(wells.map((r) => Number(r[3])));
    });
    for (let k = 1; k < at.length; k++) assert.ok(at[k] < at[0], `${arm}: growth at ${concs[k]} below the drug-free wells`);
    assert.ok(at[at.length - 1] < 15, `${arm}: little growth at the top concentration`);
    const mid = (at[0] + at[at.length - 1]) / 2;
    const k = at.findIndex((y) => y < mid);
    assert.ok(k >= 2, `${arm}: half-way is crossed above the lowest concentration`);
    const f = (at[k - 1] - mid) / (at[k - 1] - at[k]);
    half[arm] = Math.exp(Math.log(concs[k - 1]) + f * (Math.log(concs[k]) - Math.log(concs[k - 1])));
  }
  const ratio = half['ผ่านยา'] / half['ควบคุม'];
  assert.ok(ratio > 2 && ratio < 4.5, `the exposed arm's IC50 is about three times the control's: ${ratio}`);

  // Area under the curve and two-factor repeated measures: ten dogs, five per group, each measured once at
  // each of the six times, long; the mean area under the curve (trapezoid rule) is larger with prednisolone.
  const gtt = parse((await load('glucose-tolerance')).csv);
  assert.deepEqual(gtt.header, ['dog_id', 'group', 'minute', 'glucose_mg_dl']);
  const dogs = new Map();
  for (const r of gtt.rows) {
    if (!dogs.has(r[0])) dogs.set(r[0], { group: r[1], t: [], y: [] });
    const d = dogs.get(r[0]);
    assert.equal(d.group, r[1], `${r[0]} keeps one group`);
    d.t.push(Number(r[2]));
    d.y.push(Number(r[3]));
  }
  assert.equal(dogs.size, 10);
  for (const [id, d] of dogs) assert.deepEqual(d.t, [0, 15, 30, 60, 90, 120], id);
  const inGroup = (g) => [...dogs.values()].filter((d) => d.group === g);
  assert.equal(inGroup('ยาหลอก').length, 5);
  assert.equal(inGroup('เพรดนิโซโลน').length, 5);
  const area = (d) => d.t.slice(1).reduce((s, ti, i) => s + (ti - d.t[i]) * (d.y[i] + d.y[i + 1]) / 2, 0);
  assert.ok(mean(inGroup('เพรดนิโซโลน').map(area)) > mean(inGroup('ยาหลอก').map(area)));

  // qPCR: twelve birds, six per feed, one row each; the reference genes do not move with the feed (group means
  // within half a cycle), and MUC2's ΔCt against both references is about two cycles lower with the probiotic.
  const q = parse((await load('qpcr-two-references')).csv);
  assert.deepEqual(q.header, ['bird_id', 'group', 'ct_muc2', 'ct_gapdh', 'ct_actb']);
  const birds = (g) => q.rows.filter((r) => r[1] === g);
  assert.equal(birds('ควบคุม').length, 6);
  assert.equal(birds('โปรไบโอติก').length, 6);
  for (const i of [3, 4]) {
    const shift = mean(birds('โปรไบโอติก').map((r) => Number(r[i]))) - mean(birds('ควบคุม').map((r) => Number(r[i])));
    assert.ok(Math.abs(shift) < 0.5, `${q.header[i]} moves ${shift} with the feed`);
  }
  const dCt = (r) => Number(r[2]) - (Number(r[3]) + Number(r[4])) / 2;
  const ddCt = mean(birds('โปรไบโอติก').map(dCt)) - mean(birds('ควบคุม').map(dCt));
  assert.ok(ddCt > -2.5 && ddCt < -1.5, `ΔΔCt about -2: ${ddCt}`);

  // PCA: sixty cows, all six measures on every cow, three lactation groups; two patterns, the energy measures
  // moving together (BHB with NEFA and milk up, glucose down) and haptoglobin with SCC, more strongly than any
  // pair across the two patterns.
  const h = parse((await load('herd-panel')).csv);
  assert.deepEqual(h.header, ['cow_id', 'parity', 'bhb', 'nefa', 'glucose', 'milk_kg', 'hp', 'scc_k']);
  const counts = {};
  for (const r of h.rows) counts[r[1]] = (counts[r[1]] || 0) + 1;
  assert.deepEqual(counts, { 1: 18, 2: 20, '3+': 22 });
  const v = (name) => h.rows.map((r) => Number(r[h.header.indexOf(name)]));
  const r = (a, b) => pearson(v(a), v(b));
  const energy = ['bhb', 'nefa', 'glucose', 'milk_kg'];
  for (let i = 0; i < energy.length; i++) {
    for (let j = i + 1; j < energy.length; j++) {
      const sign = (energy[i] === 'glucose' || energy[j] === 'glucose') ? -1 : 1;
      assert.ok(sign * r(energy[i], energy[j]) > 0.6, `${energy[i]} with ${energy[j]}: ${r(energy[i], energy[j])}`);
    }
  }
  assert.ok(r('hp', 'scc_k') > 0.6);
  for (const a of energy) for (const b of ['hp', 'scc_k']) assert.ok(Math.abs(r(a, b)) < 0.45, `${a} with ${b}: ${r(a, b)}`);
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
