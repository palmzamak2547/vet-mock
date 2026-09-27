// Double-entry comparison: two files typed by different people, matched by a key column, every cell that
// differs listed by row id and column (EpiData-style). The student settles each difference as a cell-edit
// step [M2-DESIGN.md 4.6].
// OWNER: data role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {import('../runtime/types.js').RawTable} a
 * @param {import('../runtime/types.js').RawTable} b
 * @param {{ keyA: string, keyB: string, columnPairs: [string, string][] }} opts
 * @returns {{ differences: { key: string, rowIdA: string, rowIdB: string, column: string, a: string, b: string }[], onlyInA: string[], onlyInB: string[], duplicateKeys: { a: string[], b: string[] }, cellsCompared: number }}
 */
export function compareEntries(a, b, opts) {
  throw new Error('not implemented: intake/double-entry.compareEntries');
}
