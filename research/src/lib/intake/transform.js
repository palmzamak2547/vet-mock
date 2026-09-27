// The structural recipe steps: merge (many-to-one, by key), reshape long and wide, aggregate to a level.
// Pure; called by recipe.js [M2-DESIGN.md 4].
// OWNER: data role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {any} left       the recipe's working state
 * @param {any} right      the other dataset after its own recipe
 * @param {{ leftKey: string, rightKey: string, columns: string[] }} params
 * @returns {{ state: any, report: { matched: number, unmatchedLeft: string[], unmatchedRight: string[], duplicateRightKeys: string[] } }}
 */
export function mergeTables(left, right, params) {
  throw new Error('not implemented: intake/transform.mergeTables');
}

/**
 * @param {any} state
 * @param {{ idColumns: string[], stubs: { target: string, columns: string[] }[], timeTarget: string, times: string[] }} params
 * @returns {any}
 */
export function reshapeLong(state, params) {
  throw new Error('not implemented: intake/transform.reshapeLong');
}

/**
 * @param {any} state
 * @param {{ idColumn: string, timeColumn: string, valueColumns: string[] }} params
 * @returns {{ state: any, report: { conflicts: { id: string, time: string }[] } }}
 */
export function reshapeWide(state, params) {
  throw new Error('not implemented: intake/transform.reshapeWide');
}

/**
 * @param {any} state
 * @param {{ by: string, summaries: { column: string, fn: 'mean'|'median'|'sum'|'min'|'max'|'count'|'any'|'all'|'first'|'proportion', level?: string, target: string }[] }} params
 * @returns {any}
 */
export function aggregateRows(state, params) {
  throw new Error('not implemented: intake/transform.aggregateRows');
}
