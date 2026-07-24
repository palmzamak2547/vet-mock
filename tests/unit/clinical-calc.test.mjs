// ============================================================
// clinical-calc.test.mjs — Unit tests for clinical calc pure engine
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcDoseByWeight,
  calcVolumeByDose,
  calcTabletsByDose,
  SAFETY_DISCLAIMER,
} from '../../src/lib/clinical-calc/engine.js';
import { convertWeightToKg, roundTabletCount } from '../../src/lib/clinical-calc/units.js';

// ── Generic Math 1: Dose by weight ───────────────────────────
test('Clinical Calc: 1. mg/kg × weight = total mg (10 kg × 5 mg/kg = 50 mg)', () => {
  const result = calcDoseByWeight({ weight: 10, weightUnit: 'kg', doseRate: 5, doseUnit: 'mg_kg' });

  assert.equal(result.success, true);
  assert.equal(result.rawValue, 50);
  assert.equal(result.displayValue, 50);
  assert.equal(result.unit, 'mg');
  assert.equal(result.disclaimer, SAFETY_DISCLAIMER);
  assert.equal(result.error, null);
});

test('Clinical Calc: Explicit lb to kg conversion (22 lb dog)', () => {
  const result = calcDoseByWeight({ weight: 22, weightUnit: 'lb', doseRate: 5, doseUnit: 'mg_kg' });
  const expectedKg = convertWeightToKg(22, 'lb');

  assert.equal(result.success, true);
  assert.equal(result.rawValue, expectedKg * 5);
  assert.equal(result.displayValue, 49.895);
});

// ── Generic Math 2: Volume by dose ───────────────────────────
test('Clinical Calc: 2. total mg ÷ mg/mL = mL (50 mg ÷ 10 mg/mL = 5 mL)', () => {
  const result = calcVolumeByDose({ totalMg: 50, concentration: 10, concUnit: 'mg_ml' });

  assert.equal(result.success, true);
  assert.equal(result.rawValue, 5);
  assert.equal(result.displayValue, 5);
  assert.equal(result.unit, 'mL');
});

// ── Generic Math 3: Tablets by dose ──────────────────────────
test('Clinical Calc: 3. total mg ÷ tablet strength = tablet count (50 mg ÷ 20 mg = 2.5 tablets exact)', () => {
  const result = calcTabletsByDose({
    totalMg: 50,
    tabletStrength: 20,
    strengthUnit: 'mg',
    roundingPolicy: 'exact',
  });

  assert.equal(result.success, true);
  assert.equal(result.rawValue, 2.5);
  assert.equal(result.displayValue, 2.5);
  assert.equal(result.unit, 'tablets');
});

// ── Tablet Rounding Policies ─────────────────────────────────
test('Clinical Calc: Tablet rounding policy: half', () => {
  // 35 mg ÷ 20 mg = 1.75 tablets -> rounds to 2.0 (nearest half)
  const result = calcTabletsByDose({
    totalMg: 35,
    tabletStrength: 20,
    roundingPolicy: 'half',
  });

  assert.equal(result.success, true);
  assert.equal(result.displayValue, 2);
});

test('Clinical Calc: Tablet rounding policy: quarter', () => {
  // 35 mg ÷ 20 mg = 1.75 tablets -> rounds to 1.75 (exact quarter)
  const result = calcTabletsByDose({
    totalMg: 35,
    tabletStrength: 20,
    roundingPolicy: 'quarter',
  });

  assert.equal(result.success, true);
  assert.equal(result.displayValue, 1.75);
});

test('Clinical Calc: Tablet rounding policy: whole', () => {
  // 35 mg ÷ 20 mg = 1.75 tablets -> rounds to 2 (whole tablet)
  const result = calcTabletsByDose({
    totalMg: 35,
    tabletStrength: 20,
    roundingPolicy: 'whole',
  });

  assert.equal(result.success, true);
  assert.equal(result.displayValue, 2);
});

// ── Invalid and Boundary Inputs ──────────────────────────────
test('Clinical Calc: Rejects zero weight', () => {
  const result = calcDoseByWeight({ weight: 0, doseRate: 5 });
  assert.equal(result.success, false);
  assert.match(result.error, /greater than 0/);
});

test('Clinical Calc: Rejects negative concentration', () => {
  const result = calcVolumeByDose({ totalMg: 50, concentration: -10 });
  assert.equal(result.success, false);
  assert.match(result.error, /greater than 0/);
});

test('Clinical Calc: Rejects NaN and Infinity', () => {
  const resultNaN = calcDoseByWeight({ weight: NaN, doseRate: 5 });
  assert.equal(resultNaN.success, false);
  assert.match(resultNaN.error, /valid finite number/);

  const resultInf = calcVolumeByDose({ totalMg: 50, concentration: Infinity });
  assert.equal(resultInf.success, false);
  assert.match(resultInf.error, /valid finite number/);
});

test('Clinical Calc: Rejects invalid non-numeric string', () => {
  const result = calcDoseByWeight({ weight: 'abc', doseRate: 5 });
  assert.equal(result.success, false);
  assert.match(result.error, /valid finite number/);
});
