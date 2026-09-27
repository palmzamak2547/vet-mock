// Missing-value codes [M1-DESIGN.md 8.2; methods.md 5.4]. OWNER: intake role.

/** Codes offered as missing when seen in a column; the student confirms per column. */
export const CANDIDATE_MISSING_CODES = Object.freeze(['', 'NA', 'N/A', 'n/a', '-', '.', '999', '9999', 'ไม่ทราบ', 'ไม่ระบุ', 'ไม่รู้', 'ไม่มีข้อมูล']);

/**
 * Count candidate codes in one column. 999 is proposed only for numeric columns where it lies far
 * outside the other values (never silently).
 * @param {string[]} values
 * @returns {{ code: string, count: number, suggestedReason: 'unknown'|'not-applicable'|'not-recorded' }[]}
 */
export function findMissingCodes(values) { void values; throw new Error('not implemented: intake/missing.findMissingCodes'); }
