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
  const exempt = [];
  for (const d of VET_DRUGS) {
    if (d.unit === 'fixed') continue;
    // An entry may declare that its per-animal figure is context rather
    // than the dose — with a reason, so the judgement can be argued with.
    if (d.perAnimalNoteOk) {
      assert.equal(typeof d.perAnimalNoteOk, 'string', `${d.generic}: an exemption must carry its reason`);
      exempt.push(d.generic);
      continue;
    }
    assert.ok(!perAnimal.test(d.note || ''),
      `${d.generic}: note describes a per-animal dose but unit is ${d.unit} — the calculator will multiply it by body weight`);
  }
  // Exemptions are listed, never silent: a growing list is the signal that
  // the data model needs a per-animal field rather than more prose.
  assert.ok(exempt.length <= 2, `too many per-animal exemptions (${exempt.join(', ')}) — add a real field instead`);
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

// ── per-species ceilings ────────────────────────────────────────────
// A cap that lives only in `note` is prose. The number on screen is what
// a student writes down, and enrofloxacin's range topped out at exactly
// the 20 mg/kg that blinds cats.

test('a cat-capped drug never computes above its ceiling for a cat', () => {
  const enro = byId('enrofloxacin');
  assert.equal(enro.speciesMax.cat, 5);
  const cat = drugDose(enro, 4, 'cat');
  assert.equal(cat.hi, 20, '4 kg cat at the 5 mg/kg ceiling');
  assert.equal(cat.cappedFor, 'cat');
  // Uncapped, the same cat would have been offered 80 mg — 20 mg/kg, the
  // dose that produced abnormal ERGs and permanent blindness.
  const uncapped = drugDose(enro, 4, 'dog');
  assert.equal(uncapped.hi, 80);
  assert.equal(uncapped.cappedFor, null);
});

test('the cap applies to the low end too when it sits below it', () => {
  // Meloxicam's range starts at 0.1; the licensed feline maintenance dose
  // is 0.05, so both ends must come down for a cat.
  const mel = drugDose(byId('meloxicam'), 5, 'cat');
  assert.equal(mel.lo, 0.25);
  assert.equal(mel.hi, 0.25);
  assert.equal(mel.cappedFor, 'cat');
});

test('no species selected means no cap is silently applied', () => {
  // The Drug DB species filter is optional. With nothing chosen the full
  // range shows, which is right — but it must not pretend to be capped.
  const d = drugDose(byId('enrofloxacin'), 4, null);
  assert.equal(d.hi, 80);
  assert.equal(d.cappedFor, null);
});

test('every speciesMax is below its own range top, or it does nothing', () => {
  for (const d of VET_DRUGS) {
    if (!d.speciesMax) continue;
    for (const [sp, cap] of Object.entries(d.speciesMax)) {
      assert.ok(['dog', 'cat'].includes(sp), `${d.generic}: speciesMax key ${sp}`);
      assert.ok(Number.isFinite(cap) && cap > 0, `${d.generic}: cap ${cap}`);
      assert.ok(cap < d.doseHi, `${d.generic}: a cap at or above doseHi changes nothing`);
    }
  }
});

test('insulin is a STARTING dose, not a titrated maintenance one', () => {
  // Was 0.25-1 IU/kg. The 1 IU/kg top is where a titrated cat might end
  // up, not where anyone begins: for a 5 kg cat it printed up to 5 IU
  // q12h against a usual starting 1 IU/cat. Both species start at
  // 0.25-0.5 IU/kg (0.5 in a cat whose BG is above ~360 mg/dL).
  const ins = byId('insulin-glargine');
  assert.equal(ins.doseLo, 0.25);
  assert.equal(ins.doseHi, 0.5);
  assert.equal(ins.unit, 'IU/kg');
  const cat = drugDose(ins, 5, 'cat');
  assert.equal(cat.hi, 2.5, 'a 5 kg cat starts at no more than 2.5 IU q12h');
  assert.equal(cat.unit, 'IU');
  // The note has to say it is a starting dose, or the narrower range
  // becomes its own error for a cat already titrated above it.
  assert.match(ins.note, /ขนาดเริ่มต้น|starting/i);
});
