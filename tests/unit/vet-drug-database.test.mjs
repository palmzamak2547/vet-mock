// The drug database is the one place in this repo where a wrong number
// could reach an animal. These are the checks that would have caught what
// shipped: a dose whose unit contradicts its own note, a per-animal dose
// wearing mg/kg, and a display unit inferred from magnitude instead of
// being read off the drug.
import test from 'node:test';
import assert from 'node:assert/strict';
import { VET_DRUGS } from '../../src/data/vet-drug-database.js';

const UNITS = new Set(['mg/kg', 'µg/kg', 'IU/kg', 'mg/m²', 'mg/kg/day', 'fixed']);

test('every drug declares a unit the calculator understands', () => {
  for (const d of VET_DRUGS) {
    assert.ok(UNITS.has(d.unit), `${d.generic}: unknown unit ${JSON.stringify(d.unit)}`);
    if (d.unit === 'fixed') {
      assert.ok(d.fixedUnit, `${d.generic}: a fixed dose must name its unit (e.g. mg/cat)`);
    }
  }
});

test('a note saying "per cat/dog/animal" is not filed as a per-kg dose', () => {
  // Methimazole shipped as doseLo 2.5 unit mg/kg with a note reading
  // "Start 2.5 mg/cat q12h". The row disagreed with itself, and the
  // calculator believed the row: a 5 kg cat was shown 12.5-25 mg.
  const perAnimal = /\b\d[\d.]*\s*(?:mg|g|mcg|µg|IU)\s*\/\s*(?:cat|dog|animal)\b|\bper (?:cat|dog|animal)\b/i;
  for (const d of VET_DRUGS) {
    if (d.unit === 'fixed') continue;
    assert.ok(!perAnimal.test(d.note || ''),
      `${d.generic}: note describes a per-animal dose but unit is ${d.unit} — the calculator will multiply it by body weight`);
  }
});

test('dose ranges are ordered and plausible', () => {
  for (const d of VET_DRUGS) {
    assert.ok(Number.isFinite(d.doseLo) && Number.isFinite(d.doseHi), `${d.generic}: non-numeric dose`);
    assert.ok(d.doseLo > 0, `${d.generic}: doseLo must be positive`);
    assert.ok(d.doseHi >= d.doseLo, `${d.generic}: doseHi ${d.doseHi} < doseLo ${d.doseLo}`);
    // Nothing in small-animal practice is dosed above 200 mg/kg; a number
    // past that is far more likely a gram written as a milligram, or a
    // tenfold slip like afoxolaner's 25-50 against a 2.5 mg/kg label.
    if (d.unit === 'mg/kg') {
      assert.ok(d.doseHi <= 200, `${d.generic}: ${d.doseHi} mg/kg is out of range for a small-animal dose`);
    }
  }
});

test('species is one the filter can match', () => {
  for (const d of VET_DRUGS) {
    assert.ok(['dog', 'cat', 'both'].includes(d.species), `${d.generic}: species ${d.species}`);
  }
});

test('ids are unique — a duplicate would shadow a drug in the list', () => {
  const seen = new Set();
  for (const d of VET_DRUGS) {
    assert.ok(!seen.has(d.id), `duplicate id: ${d.id}`);
    seen.add(d.id);
  }
});

// ── the dose the calculator actually prints ─────────────────────────
// Same function the component calls, not a hand-copy of its arithmetic.
import { drugDose } from '../../src/hooks/utils.js';

const byId = (id) => VET_DRUGS.find((d) => d.id === id);

test('the displayed unit comes from the drug, not from how small its number is', () => {
  // Furosemide is 1-4 mg/kg. The old expression asked `doseLo > 1`, said
  // no, and printed µg — a thousandfold understatement on a diuretic.
  const f = drugDose(byId('furosemide'), 20);
  assert.equal(f.unit, 'mg');
  assert.equal(f.lo, 20);
  assert.equal(f.hi, 80);

  // Insulin is the only non-mg row in the file; it must not read µg either.
  const ins = drugDose(byId('insulin-glargine'), 4);
  assert.equal(ins.unit, 'IU');

  // Nothing in the database should ever print µg while its unit is mg/kg.
  for (const d of VET_DRUGS) {
    const got = drugDose(d, 10);
    if (d.unit === 'mg/kg') assert.equal(got.unit, 'mg', `${d.generic} printed ${got.unit}`);
  }
});

test('a per-animal dose is not multiplied by body weight', () => {
  const m = byId('methimazole');
  assert.equal(m.unit, 'fixed');
  const a = drugDose(m, 3);
  const b = drugDose(m, 8);
  assert.deepEqual([a.lo, a.hi], [b.lo, b.hi], 'a fixed dose must not change with weight');
  assert.equal(a.unit, 'mg/cat');
  // What the row shipped as: 2.5-5 mg/kg on a 5 kg cat is 12.5-25 mg,
  // against a real 1.25-2.5 mg per cat.
  assert.ok(a.hi <= 5, 'methimazole must stay a per-cat dose');
});

test('no weight yet means no number, rather than a wrong one', () => {
  const f = drugDose(byId('furosemide'), NaN);
  assert.equal(f.lo, null);
  assert.equal(f.hi, null);
  assert.equal(f.unit, 'mg');
});
