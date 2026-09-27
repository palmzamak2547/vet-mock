// Codebook proposal at import [M1-DESIGN.md 8.3; methods.md 5.6-5.7]. OWNER: intake role.

/**
 * Build the codebook the import screen asks the student to confirm once: type, role, levels,
 * labels TH/EN (the header text as the Thai label, empty English label to fill), level of
 * organisation, cluster column, missing codes, PII.
 * @param {import('../runtime/types.js').RawTable} raw
 * @returns {import('../runtime/types.js').Codebook}
 */
export function proposeCodebook(raw) { void raw; throw new Error('not implemented: intake/codebook.proposeCodebook'); }

/**
 * Validate a codebook the student edited (one cluster column at most, levels unique, reference a
 * known level, binary outcome has a positive level).
 * @param {import('../runtime/types.js').Codebook} codebook
 * @returns {{ ok: boolean, issues: { column: string|null, key: string }[] }}
 */
export function checkCodebook(codebook) { void codebook; throw new Error('not implemented: intake/codebook.checkCodebook'); }
