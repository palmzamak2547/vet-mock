// ResultEnvelope helpers [M1-DESIGN.md 10.2]. OWNER: runtime role.

/**
 * @typedef {import('./types.js').ResultEnvelope} ResultEnvelope
 * @typedef {import('./types.js').Value} Value
 */

/**
 * A reported number. Use nullValue() when the quantity is undefined; never report 0 for "cannot be
 * computed".
 * @param {number} value
 * @param {Partial<Value>} [extra]  ci, ciLevel, ciMethod, se
 * @returns {Value}
 */
export function value(value, extra = {}) {
  void value; void extra;
  throw new Error('not implemented: runtime/envelope.value');
}

/**
 * An undefined quantity: value null, shown as "—" with the sentence at `reasonKey`.
 * @param {string} reasonKey  i18n key, e.g. 'stats.undefined.zeroVariance'
 * @returns {Value}
 */
export function nullValue(reasonKey) {
  void reasonKey;
  throw new Error('not implemented: runtime/envelope.nullValue');
}

/**
 * Assemble the envelope from a method's output, the guardrail findings and the provenance.
 * Withholds p-values (sets them null with reasonKey 'epi.guard.G1.withheld') when a stop is present.
 * @param {Object} args
 * @param {import('./types.js').AnalysisSpec} args.spec   normalised spec
 * @param {import('./registry.js').MethodOutput|null} args.output  null when stopped before running
 * @param {{stops: any[], warnings: any[], notes: any[]}} args.guard
 * @param {import('./types.js').Provenance} args.provenance
 * @param {boolean} args.verified
 * @returns {ResultEnvelope}
 */
export function makeEnvelope(args) {
  void args;
  throw new Error('not implemented: runtime/envelope.makeEnvelope');
}

/**
 * JSON for the project file: Infinity and -Infinity become the strings 'Infinity' / '-Infinity',
 * NaN is never present (undefined values are null already). reviveEnvelope() reverses it.
 * @param {ResultEnvelope} env
 * @returns {string}
 */
export function serializeEnvelope(env) {
  void env;
  throw new Error('not implemented: runtime/envelope.serializeEnvelope');
}

/** @param {string} json @returns {ResultEnvelope} */
export function reviveEnvelope(json) {
  void json;
  throw new Error('not implemented: runtime/envelope.reviveEnvelope');
}
