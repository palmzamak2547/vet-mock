// Computed columns: a tokenizer and Pratt parser for arithmetic, comparisons, and/or/not and a fixed
// function list; typed text is never evaluated as code (no eval, no new Function) [M2-DESIGN.md 4.4].
// OWNER: data role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {string} text
 * @param {{ key: string, name: string }[]} columns   what {name} and bare keys may refer to
 * @returns {{ ok: true, ast: any, refs: string[], type: 'number'|'boolean'|'date' } | { ok: false, key: string, at: number }}
 */
export function parseExpression(text, columns) {
  throw new Error('not implemented: intake/expr.parseExpression');
}

/**
 * @param {any} ast
 * @param {import('../runtime/types.js').WorkingTable} table
 * @returns {{ values: Float64Array, missing: Uint8Array, invalid: number }}
 */
export function evaluateExpression(ast, table) {
  throw new Error('not implemented: intake/expr.evaluateExpression');
}
