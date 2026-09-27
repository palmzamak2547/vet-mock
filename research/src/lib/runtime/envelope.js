// ResultEnvelope helpers [M1-DESIGN.md 10.2]. Numbers are stored at full precision; formatting happens
// only at display. An undefined quantity is null with a reasonKey, never 0. OWNER: runtime role.

/**
 * @typedef {import('./types.js').ResultEnvelope} ResultEnvelope
 * @typedef {import('./types.js').Value} Value
 */

/** Key used for every p-value withheld by a G1 stop (cluster column repeats, no route chosen). */
export const G1_WITHHELD_KEY = 'epi.guard.G1.withheld';

/**
 * A reported number. Use nullValue() when the quantity is undefined; never report 0 for "cannot be
 * computed". A NaN value is turned into null with 'runtime.value.notANumber' so NaN never reaches a
 * screen or a file.
 * @param {number} value
 * @param {Partial<Value>} [extra]  ci, ciLevel, ciMethod, se
 * @returns {Value}
 */
export function value(value, extra = {}) {
  if (typeof value !== 'number' || Number.isNaN(value)) return nullValue(extra.reasonKey || 'runtime.value.notANumber');
  /** @type {Value} */
  const out = { value };
  if (extra.ci !== undefined) out.ci = cleanCi(extra.ci);
  if (extra.ciLevel !== undefined) out.ciLevel = extra.ciLevel;
  if (extra.ciMethod !== undefined) out.ciMethod = extra.ciMethod;
  if (extra.se !== undefined) out.se = typeof extra.se === 'number' && !Number.isNaN(extra.se) ? extra.se : null;
  if (extra.reasonKey !== undefined) out.reasonKey = extra.reasonKey;
  if (extra.noteKey !== undefined) out.noteKey = extra.noteKey;
  return out;
}

/**
 * An undefined quantity: value null, shown as "—" with the sentence at `reasonKey`.
 * @param {string} reasonKey  i18n key, e.g. 'stats.undefined.zeroVariance'
 * @returns {Value}
 */
export function nullValue(reasonKey) {
  if (typeof reasonKey !== 'string' || !reasonKey) throw new Error('nullValue needs a reasonKey');
  return { value: null, reasonKey };
}

/** @param {any} ci @returns {[number|null, number|null]} */
function cleanCi(ci) {
  if (!Array.isArray(ci) || ci.length !== 2) return [null, null];
  return /** @type {[number|null, number|null]} */ (ci.map((b) => (typeof b === 'number' && !Number.isNaN(b) ? b : null)));
}

/** Every p-value in the output, withheld: null with the stop's key. Never mutates the input. */
function withholdTests(tests, key) {
  return (tests || []).map((t) => ({ ...t, p: null, reasonKey: key }));
}

/**
 * Assemble the envelope from a method's output, the guardrail findings and the provenance.
 * Withholds p-values (sets them null with reasonKey 'epi.guard.G1.withheld', or the stop's own key)
 * when a stop is present, even if a caller passes an output together with a stop.
 * @param {Object} args
 * @param {import('./types.js').AnalysisSpec} args.spec   normalised spec
 * @param {import('./registry.js').MethodOutput|null} args.output  null when stopped before running
 * @param {{stops: any[], warnings: any[], notes: any[]}} args.guard
 * @param {import('./types.js').Provenance} args.provenance
 * @param {boolean} args.verified
 * @param {{ id: string, family: string, milestone: 'M1'|'M2'|'M3'|'later' }} [args.method]
 * @param {Object<string, Value>} [args.extraValues]  values shown with a stop (the G1 panel: icc, deff, nEff)
 * @param {Object|null} [args.clusterPanel]
 * @param {{ path: string, key: string }[]} [args.issues]  validation issues when status is 'invalid'
 * @param {{ key: string, detail?: string }|null} [args.error]  a method that failed while running
 * @returns {ResultEnvelope}
 */
export function makeEnvelope(args) {
  const { spec, output = null, provenance, verified = false } = args;
  const guard = {
    stops: [...(args.guard?.stops || [])],
    warnings: [...(args.guard?.warnings || [])],
    notes: [...(args.guard?.notes || [])],
  };
  const stopped = guard.stops.length > 0;
  let status = 'ok';
  if (args.issues?.length || args.error || output?.status === 'invalid') status = 'invalid';
  if (stopped) status = 'stopped';

  const withheldKey = stopped ? (guard.stops.some((s) => s.id === 'G1') ? G1_WITHHELD_KEY : guard.stops[0].key) : null;
  const values = { ...(stopped ? {} : output?.values || {}), ...(args.extraValues || {}) };
  const tests = stopped ? withholdTests(output?.tests, withheldKey) : [...(output?.tests || [])];
  const tables = stopped ? [] : [...(output?.tables || [])];

  /** @type {ResultEnvelope} */
  const env = {
    envelopeVersion: 1,
    status: /** @type {'ok'|'stopped'|'invalid'} */ (status),
    method: args.method || { id: spec?.method ?? '', family: '', milestone: 'M1' },
    spec,
    values,
    tests,
    tables,
    guard,
    provenance,
    verified: status === 'ok' && Boolean(verified),
  };
  if (args.clusterPanel) env.clusterPanel = args.clusterPanel;
  if (args.issues?.length) env.issues = args.issues;
  if (args.error) env.error = args.error;
  return env;
}

/** True when a p-value is present anywhere in the envelope (used by tests and by the report). */
export function hasPValue(env) {
  return (env.tests || []).some((t) => typeof t.p === 'number');
}

/**
 * JSON for the project file: Infinity and -Infinity become the strings 'Infinity' / '-Infinity',
 * NaN is never present (undefined values are null already). reviveEnvelope() reverses it.
 * @param {ResultEnvelope} env
 * @returns {string}
 */
export function serializeEnvelope(env) {
  return JSON.stringify(env, (_k, v) => {
    if (typeof v === 'number') {
      if (v === Infinity) return 'Infinity';
      if (v === -Infinity) return '-Infinity';
      if (Number.isNaN(v)) return null;
    }
    if (ArrayBuffer.isView(v)) return Array.from(/** @type {any} */ (v));
    return v;
  });
}

/** @param {string} json @returns {ResultEnvelope} */
export function reviveEnvelope(json) {
  return JSON.parse(json, (_k, v) => {
    if (v === 'Infinity') return Infinity;
    if (v === '-Infinity') return -Infinity;
    return v;
  });
}

/** Deep version of the Infinity round trip for objects that are already parsed (project files). */
export function reviveNumbers(obj) {
  return reviveEnvelope(JSON.stringify(obj));
}
