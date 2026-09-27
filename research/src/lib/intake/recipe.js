// The recipe: every change is a step replayed over the raw table, which is never edited
// [M1-DESIGN.md 8.4; methods.md 5.5; competitor-gaps.md D4(a)(b)]. Deterministic: the same raw
// table, codebook and steps always give the same WorkingTable. OWNER: intake role.

/** Step kinds and their params (M1-DESIGN.md 8.4 has the full table). */
export const STEP_KINDS = Object.freeze([
  'import-conversions', 'set-type', 'missing-code', 'cell-edit', 'row-add', 'row-exclude',
  'recode', 'bin', 'reference', 'filter', 'derive-age',
]);

/**
 * @param {import('../runtime/types.js').RawTable} raw
 * @param {import('../runtime/types.js').Codebook} codebook
 * @param {import('../runtime/types.js').RecipeStep[]} steps
 * @returns {import('../runtime/types.js').WorkingTable}  fingerprint left '' (runtime fills it)
 */
export function applyRecipe(raw, codebook, steps) { void raw; void codebook; void steps; throw new Error('not implemented: intake/recipe.applyRecipe'); }

/**
 * Make a new step with the next id and seq; validates params for its kind (throws with an i18n key).
 * @param {import('../runtime/types.js').RecipeStep[]} steps
 * @param {import('../runtime/types.js').RecipeStep['kind']} kind
 * @param {Object} params
 * @param {string|null} [reason]
 * @returns {import('../runtime/types.js').RecipeStep}
 */
export function makeStep(steps, kind, params, reason = null) { void steps; void kind; void params; void reason; throw new Error('not implemented: intake/recipe.makeStep'); }

/**
 * One line per step for the project log and the methods paragraph, e.g. "รวมระดับ 'ไม่ทราบ' กับ 'ไม่ระบุ' เป็นค่าที่หายไป".
 * @param {import('../runtime/types.js').RecipeStep} step
 * @param {(key: string, params?: Object) => string} t
 * @returns {string}
 */
export function describeStep(step, t) { void step; void t; throw new Error('not implemented: intake/recipe.describeStep'); }
