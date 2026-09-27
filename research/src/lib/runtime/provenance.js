// The human provenance line under every result [M1-DESIGN.md 10.5; engine.md 7]. OWNER: runtime role.

/**
 * One or two lines in the page language, built only from the envelope:
 *   method name | options that change numbers | rows used and dropped with reasons |
 *   data fingerprint (first 8 hex) | engine version | "ตรวจเทียบแล้ว" / "verified" only when verified.
 * No middle dot, no ellipsis; separators are " | " exactly as engine.md 7 shows.
 * @param {import('./types.js').ResultEnvelope} env
 * @param {'th'|'en'} lang
 * @param {(key: string, params?: Object) => string} t
 * @returns {string[]}
 */
export function provenanceLines(env, lang, t) {
  void env; void lang; void t;
  throw new Error('not implemented: runtime/provenance.provenanceLines');
}
