// Intake end to end on the made-up 728-cow serosurvey (tests/fixtures/serosurvey/, windows-874 bytes).
// Pins: numbers.json, written by work/research-studio/workspace/build-data.mjs and recomputed
// independently by check.py (SciPy, 47 of 47); its `conv` block names every conversion the import
// must find, and `table1` the ages the recipe must produce [M1-DESIGN.md 8.6]. OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPreview, answerPreview, summarizeConversions } from '../../src/lib/intake/preview.js';
import { applyRecipe, makeStep, nextDerivedKey } from '../../src/lib/intake/recipe.js';
import { checkCodebook } from '../../src/lib/intake/codebook.js';
import { MISSING } from '../../src/lib/intake/missing.js';

const bytes = new Uint8Array(readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url)));
const N = JSON.parse(readFileSync(new URL('../fixtures/serosurvey/numbers.json', import.meta.url), 'utf8'));
const C = N.conv;
const NOW = '2026-09-27T00:00:00.000Z';

const preview = await buildPreview(bytes, { fileName: N.file.name, now: NOW });
const keyOf = (name) => preview.codebook.columns.find((c) => c.name === name).key;
const convs = (kind, name) => preview.conversions.filter((c) => c.kind === kind && (!name || c.column === keyOf(name)));
const total = (list) => list.reduce((n, c) => n + c.count, 0);

test('the file: bytes, sha256, windows-874 after strict UTF-8 fails at byte 0 (numbers.json file)', () => {
  assert.equal(preview.raw.source.bytes, N.file.bytes);
  assert.equal(preview.raw.source.sha256, N.file.sha256);
  assert.equal(preview.raw.source.encoding, N.file.encoding);
  assert.equal(N.file.utf8Fails, true);
  const enc = preview.conversions.find((c) => c.kind === 'encoding');
  assert.equal(enc.key, 'intake.encoding.fallback874');
  assert.equal(enc.params.byte, N.file.firstNonAsciiByte);
  assert.equal(preview.raw.rowCount, N.file.rows);
  assert.equal(preview.raw.header.length, N.file.columns);
  assert.deepEqual(preview.raw.header, N.header);
});

test('every conversion numbers.json conv names, counted over all 728 rows', () => {
  assert.equal(total(convs('thai-digits')), C.thaiDigitCells);
  assert.equal(total(convs('be-year')), C.beDateCells);
  const two = convs('two-digit-year');
  assert.equal(total(two), C.twoDigitYearCells);
  assert.equal(two[0].params.example, C.twoDigitExample);
  const feb = convs('feb29');
  assert.equal(total(feb), C.feb29.count);
  assert.equal(feb[0].key, C.feb29.validAsBE && !C.feb29.validAsCE ? 'intake.conv.feb29OnlyBE' : 'unexpected');
  assert.equal(feb[0].params.example, C.feb29.raw);
  assert.equal(feb[0].examples[0].to, C.feb29.ce);
  assert.equal(total(convs('trim')), C.trailingSpaceCells);
  assert.deepEqual(convs('trim').map((c) => c.column), [keyOf('พันธุ์')]);
  for (const [name, codes] of Object.entries(C.missing)) {
    for (const [code, count] of Object.entries(codes)) {
      const c = convs('missing-code', name).find((x) => x.params.code === (code === '(ว่าง)' ? '' : code));
      assert.ok(c, `${name} ${code}`);
      assert.equal(c.count, count, `${name} ${code}`);
    }
  }
  const ids = convs('excel-date-id', 'รหัสโค')[0];
  assert.deepEqual(ids.examples.map((e) => e.from), C.excelDateIds);
  assert.deepEqual(ids.examples.map((e) => e.to), ['F04-007', 'F04-012'], 'F04 runs 001 to 015 and misses only these two');
  const pii = convs('pii');
  assert.deepEqual(pii.map((c) => preview.raw.header[Number(c.column.slice(1)) - 1]), C.piiColumns);
  for (const c of pii) assert.equal(c.params.distinct, C.piiDistinct[c.params.column]);
  assert.equal(pii.find((c) => c.params.column === 'ชื่อเจ้าของ').examples[0].to, C.nameMaskExample);
  assert.equal(pii.find((c) => c.params.column === 'เบอร์โทร').examples[0].to, C.phoneMaskExample);
});

test('missing reasons are suggested, and parity "-" falls exactly on the males (not applicable)', () => {
  const q = (name, code) => preview.questions.find((x) => x.id === `q:${keyOf(name)}:missing:${code}`);
  assert.equal(q('จำนวนครั้งที่คลอด', '-').default, 'not-applicable');
  assert.deepEqual([q('จำนวนครั้งที่คลอด', '-').params.evidenceColumn, q('จำนวนครั้งที่คลอด', '-').params.evidenceValue], ['เพศ', 'ผู้']);
  assert.equal(q('จำนวนครั้งที่คลอด', '999').default, 'unknown');
  assert.equal(q('วันเกิด', 'ไม่ทราบ').default, 'unknown');
  assert.equal(q('วันเกิด', '-').default, 'not-recorded');
  assert.equal(q('พันธุ์', '').default, 'not-recorded');
});

test('G26: two questions block the import until answered (two-digit years, IDs Excel turned into dates)', () => {
  assert.deepEqual(preview.blocking.map((b) => b.key).sort(), ['intake.blocking.excel-date-id', 'intake.blocking.two-digit-century']);
  const era = preview.questions.find((x) => x.id === `q:${keyOf('วันเกิด')}:era`);
  assert.equal(era.default, 'BE');
  assert.equal(era.params.feb29, C.feb29.raw);
  const kinds = summarizeConversions(preview.conversions);
  assert.equal(kinds.find((k) => k.kind === 'be-year').count, C.beDateCells);
  assert.deepEqual(kinds.find((k) => k.kind === 'be-year').columns.length, 2);
});

const answered = answerPreview(preview, { [`q:${keyOf('รหัสโค')}:excel-date-id`]: 'use-proposed', [`q:${keyOf('วันที่เก็บตัวอย่าง')}:two-digit`]: '2500' });

test('after the two answers: nothing blocks, no unreadable cell, the codebook checks out', () => {
  assert.deepEqual(answered.blocking, []);
  assert.equal(answered.conversions.filter((c) => c.kind === 'type-conflict').length, 0);
  assert.deepEqual(checkCodebook(answered.codebook), { ok: true, issues: [] });
  assert.equal(answered.codebook.clusterKey, keyOf('ฟาร์ม'));
  const two = answered.conversions.find((c) => c.kind === 'two-digit-year');
  assert.equal(two.examples[0].from, C.twoDigitExample);
  assert.equal(two.examples[0].to, '2026-08-08');
  // levels as numbers.json codebook reads them: farm-level columns are constant within each farm
  for (const c of N.codebook) {
    const e = answered.codebook.columns.find((x) => x.name === c.name);
    assert.equal(e.level, c.level === 'ฟาร์ม' ? 'farm' : 'animal', c.name);
  }
  // the preview never changed its input
  assert.deepEqual(preview.answers, {});
});

test('the recipe on the answered import: 146 positives, 716 known ages, median age 30 (21 to 43) as numbers.json table1', () => {
  const steps = [answered.importStep];
  const d = nextDerivedKey(answered.codebook, steps);
  steps.push(makeStep(steps, 'derive-age', { birth: keyOf('วันเกิด'), event: keyOf('วันที่เก็บตัวอย่าง'), unit: 'months', target: d }));
  const tb = applyRecipe(answered.raw, answered.codebook, steps);
  assert.deepEqual(tb.rejected, []);
  assert.deepEqual(Object.keys(tb.invalid), []);
  const elisa = tb.columns[keyOf('ผล ELISA')];
  assert.equal([...elisa.values].filter((v) => elisa.levels[v] === 'บวก').length, N.prev.x);
  const ages = [...tb.columns[d].values].filter(Number.isFinite).sort((a, b) => a - b);
  assert.equal(ages.length, N.table1.animals.all.n - N.table1.animals.all.ageMissing);
  const q7 = (p) => { const h = (ages.length - 1) * p; const lo = Math.floor(h); return ages[lo] + (h - lo) * ((ages[lo + 1] ?? ages[lo]) - ages[lo]); };
  assert.deepEqual([q7(0.5), q7(0.25), q7(0.75)], N.table1.animals.all.age);
  // the first twelve rows' ages as numbers.json sample lists them
  N.sample.forEach((s, i) => assert.equal(Number.isFinite(tb.columns[d].values[i]) ? tb.columns[d].values[i] : null, s.age, `row ${i + 1}`));
  // parity: 6 unknown (999), 19 not applicable (the males), never silently missing
  const par = tb.columns[keyOf('จำนวนครั้งที่คลอด')].missing;
  const count = (m) => [...par].filter((x) => x === m).length;
  assert.equal(count(MISSING.unknown), C.missing['จำนวนครั้งที่คลอด']['999']);
  assert.equal(count(MISSING['not-applicable']), C.missing['จำนวนครั้งที่คลอด']['-']);
  // the IDs Excel turned into dates are back
  const ids = tb.columns[keyOf('รหัสโค')].values;
  assert.equal(new Set(ids).size, 728);
  assert.ok(ids.includes('F04-007') && ids.includes('F04-012') && !ids.includes('7-Apr'));
  // farms: 49 clusters of 15, one of 8
  const farm = tb.columns[keyOf('ฟาร์ม')].values;
  assert.equal(new Set(farm).size, N.farms.length);
});
