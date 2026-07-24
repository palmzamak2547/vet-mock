// ============================================================
// engine.js — Pure calculation functions for generic clinical math
// ============================================================
//
// Pure math calculation module for VetMock clinical calculator.
// Zero side-effects, zero DOM/React dependencies.
// Does NOT provide drug recommendations, dosage guidelines,
// interval guidance, contraindications, or prescribing text.
// ============================================================

import { validatePositiveNumber, convertWeightToKg, roundTabletCount } from './units.js';

export const SAFETY_DISCLAIMER =
  'Academic learning support tool only — not for prescribing or clinical treatment.';

/**
 * 1. Calculate Total Drug Mass (mg) = Body Weight (kg) × Dose Rate (mg/kg)
 *
 * @typedef {Object} DoseByWeightInput
 * @property {number|string} weight - Patient weight
 * @property {'kg'|'lb'} [weightUnit='kg'] - Unit of weight
 * @property {number|string} doseRate - Dose rate
 * @property {'mg_kg'|'mcg_kg'|'g_kg'} [doseUnit='mg_kg'] - Unit of dose rate
 *
 * @param {DoseByWeightInput} input
 * @returns {import('./units.js').CalculationOutput}
 */
export function calcDoseByWeight(input) {
  const { weight, weightUnit = 'kg', doseRate, doseUnit = 'mg_kg' } = input || {};

  const vWeight = validatePositiveNumber(weight, 'Weight');
  if (!vWeight.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'mg',
      formula: '',
      normalizedInputs: [],
      error: vWeight.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  const vDose = validatePositiveNumber(doseRate, 'Dose rate');
  if (!vDose.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'mg',
      formula: '',
      normalizedInputs: [],
      error: vDose.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  const kgWeight = convertWeightToKg(vWeight.num, weightUnit);

  // Normalize dose rate to mg/kg
  let mgKgDose = vDose.num;
  if (doseUnit === 'mcg_kg') {
    mgKgDose = vDose.num / 1000;
  } else if (doseUnit === 'g_kg') {
    mgKgDose = vDose.num * 1000;
  }

  const rawMg = kgWeight * mgKgDose;
  const displayMg = Math.round(rawMg * 1000) / 1000; // display precision 3 decimals

  const normalizedInputs = [
    `Weight: ${vWeight.num} ${weightUnit}${weightUnit === 'lb' ? ` (${kgWeight.toFixed(3)} kg)` : ''}`,
    `Dose Rate: ${vDose.num} ${doseUnit.replace('_', '/')}${doseUnit !== 'mg_kg' ? ` (${mgKgDose} mg/kg)` : ''}`,
  ];

  const formula = `${kgWeight.toFixed(2)} kg × ${mgKgDose} mg/kg = ${displayMg} mg`;

  return {
    success: true,
    rawValue: rawMg,
    displayValue: displayMg,
    unit: 'mg',
    formula,
    normalizedInputs,
    error: null,
    disclaimer: SAFETY_DISCLAIMER,
  };
}

/**
 * 2. Calculate Liquid Volume (mL) = Total Drug Mass (mg) ÷ Concentration (mg/mL)
 *
 * @typedef {Object} VolumeByDoseInput
 * @property {number|string} totalMg - Target drug mass in mg
 * @property {number|string} concentration - Solution concentration
 * @property {'mg_ml'|'mcg_ml'|'g_ml'} [concUnit='mg_ml'] - Concentration unit
 *
 * @param {VolumeByDoseInput} input
 * @returns {import('./units.js').CalculationOutput}
 */
export function calcVolumeByDose(input) {
  const { totalMg, concentration, concUnit = 'mg_ml' } = input || {};

  const vMg = validatePositiveNumber(totalMg, 'Total mg');
  if (!vMg.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'mL',
      formula: '',
      normalizedInputs: [],
      error: vMg.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  const vConc = validatePositiveNumber(concentration, 'Concentration');
  if (!vConc.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'mL',
      formula: '',
      normalizedInputs: [],
      error: vConc.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  let mgMlConc = vConc.num;
  if (concUnit === 'mcg_ml') {
    mgMlConc = vConc.num / 1000;
  } else if (concUnit === 'g_ml') {
    mgMlConc = vConc.num * 1000;
  }

  const rawMl = vMg.num / mgMlConc;
  const displayMl = Math.round(rawMl * 100) / 100; // display precision 2 decimals

  const normalizedInputs = [
    `Total Dose: ${vMg.num} mg`,
    `Concentration: ${vConc.num} ${concUnit.replace('_', '/')}${concUnit !== 'mg_ml' ? ` (${mgMlConc} mg/mL)` : ''}`,
  ];

  const formula = `${vMg.num} mg ÷ ${mgMlConc} mg/mL = ${displayMl} mL`;

  return {
    success: true,
    rawValue: rawMl,
    displayValue: displayMl,
    unit: 'mL',
    formula,
    normalizedInputs,
    error: null,
    disclaimer: SAFETY_DISCLAIMER,
  };
}

/**
 * 3. Calculate Tablet Count = Total Drug Mass (mg) ÷ Tablet Strength (mg)
 *
 * @typedef {Object} TabletsByDoseInput
 * @property {number|string} totalMg - Target drug mass in mg
 * @property {number|string} tabletStrength - Strength per tablet
 * @property {'mg'|'mcg'|'g'} [strengthUnit='mg'] - Unit of tablet strength
 * @property {'exact'|'half'|'quarter'|'whole'} [roundingPolicy='exact'] - Rounding policy
 *
 * @param {TabletsByDoseInput} input
 * @returns {import('./units.js').CalculationOutput}
 */
export function calcTabletsByDose(input) {
  const { totalMg, tabletStrength, strengthUnit = 'mg', roundingPolicy = 'exact' } = input || {};

  const vMg = validatePositiveNumber(totalMg, 'Total mg');
  if (!vMg.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'tablets',
      formula: '',
      normalizedInputs: [],
      error: vMg.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  const vStrength = validatePositiveNumber(tabletStrength, 'Tablet strength');
  if (!vStrength.valid) {
    return {
      success: false,
      rawValue: null,
      displayValue: null,
      unit: 'tablets',
      formula: '',
      normalizedInputs: [],
      error: vStrength.error,
      disclaimer: SAFETY_DISCLAIMER,
    };
  }

  let mgStrength = vStrength.num;
  if (strengthUnit === 'mcg') {
    mgStrength = vStrength.num / 1000;
  } else if (strengthUnit === 'g') {
    mgStrength = vStrength.num * 1000;
  }

  const rawTablets = vMg.num / mgStrength;
  const roundedTablets = roundTabletCount(rawTablets, roundingPolicy);
  const displayTablets = Math.round(roundedTablets * 100) / 100;

  const normalizedInputs = [
    `Total Dose: ${vMg.num} mg`,
    `Tablet Strength: ${vStrength.num} ${strengthUnit}${strengthUnit !== 'mg' ? ` (${mgStrength} mg)` : ''}`,
    `Rounding Policy: ${roundingPolicy}`,
  ];

  const formula = `${vMg.num} mg ÷ ${mgStrength} mg/tablet = ${displayTablets} tablets`;

  return {
    success: true,
    rawValue: rawTablets,
    displayValue: displayTablets,
    unit: 'tablets',
    formula,
    normalizedInputs,
    error: null,
    disclaimer: SAFETY_DISCLAIMER,
  };
}
