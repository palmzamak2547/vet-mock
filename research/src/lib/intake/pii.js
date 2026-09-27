// Personal-identifier columns [M1-DESIGN.md 8.3; methods.md 5.9]. Detected at import, hidden from the
// grid and every export by default, masked on screen when shown ('ช*** ร***', '08x-xxx-xx07').
// OWNER: intake role.

/**
 * @param {string[]} values
 * @param {string} header
 * @returns {{ kind: 'name'|'phone'|'national-id'|'address'|'line-id'|'email', share: number } | null}
 *   national-id checks the 13-digit Thai ID checksum; phone matches Thai mobile and landline shapes
 */
export function detectPii(values, header) { void values; void header; throw new Error('not implemented: intake/pii.detectPii'); }

/** @param {string} value @param {'name'|'phone'|'national-id'|'address'|'line-id'|'email'} kind @returns {string} */
export function maskValue(value, kind) { void value; void kind; throw new Error('not implemented: intake/pii.maskValue'); }
