// ============================================================
// units.js — Explicit unit conversion & input validation helpers
// ============================================================

/**
 * Validates whether a value is a positive finite number.
 * @param {any} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string|null, num: number|null }}
 */
export function validatePositiveNumber(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required`, num: null };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { valid: false, error: `${fieldName} must be a valid finite number`, num: null };
  }
  if (num <= 0) {
    return { valid: false, error: `${fieldName} must be greater than 0`, num: null };
  }
  return { valid: true, error: null, num };
}

/**
 * Convert weight explicitly to kg. Never converts silently without caller request.
 * @param {number} val
 * @param {'kg'|'lb'} unit
 * @returns {number}
 */
export function convertWeightToKg(val, unit) {
  if (unit === 'lb') {
    // 1 lb = 0.45359237 kg exact
    return val * 0.45359237;
  }
  return val;
}

/**
 * Round tablet count according to policy.
 * @param {number} rawCount
 * @param {'exact'|'half'|'quarter'|'whole'} policy
 * @returns {number}
 */
export function roundTabletCount(rawCount, policy) {
  if (policy === 'half') {
    return Math.round(rawCount * 2) / 2;
  }
  if (policy === 'quarter') {
    return Math.round(rawCount * 4) / 4;
  }
  if (policy === 'whole') {
    return Math.round(rawCount);
  }
  // 'exact' or default
  return rawCount;
}
