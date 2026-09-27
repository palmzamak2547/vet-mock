// Column type inference from the WHOLE column, never a prefix [M1-DESIGN.md 8.3; methods.md 5.1].
// Conflicts (numbers mixed with text such as "ไม่ทราบ") are reported, not coerced. OWNER: intake role.

/**
 * @param {string[]} values   cleaned cell text of one column
 * @param {string} header
 * @returns {{ type: import('../runtime/types.js').CodebookEntry['type'], confidence: 'high'|'ask', conflicts: { value: string, count: number }[], distinct: number, level: import('../runtime/types.js').CodebookEntry['level']|null }}
 */
export function inferColumn(values, header) { void values; void header; throw new Error('not implemented: intake/infer.inferColumn'); }

/**
 * Suggest the cluster column: an identifier-like column whose values repeat and group rows (farm,
 * pen, household, litter), taking header words into account (ฟาร์ม, farm, คอก, pen, ครัวเรือน).
 * @param {import('../runtime/types.js').RawTable} raw
 * @returns {{ key: string, groups: number, meanSize: number } | null}
 */
export function suggestCluster(raw) { void raw; throw new Error('not implemented: intake/infer.suggestCluster'); }
