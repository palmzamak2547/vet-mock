// The course examples on the sample-size screen [M1-DESIGN.md 7.22; workspace board "Course"]. The
// course fixture writes each worked example in the course's own words (n0, rho, "p unknown"); the
// engine's sample-size functions name the same inputs baseN, icc and p (lib/epi/samplesize.js). This
// maps one to the other so a loaded example runs exactly the numbers the course item gives, and says
// which inputs it could not use instead of dropping them silently. Pure. OWNER: workspace role.

/** Course input name -> engine param name, when they differ. */
const RENAME = Object.freeze({ n0: 'baseN', n: 'baseN', rho: 'icc' });

/**
 * Engine params from one course item's `input`.
 * @param {{ input?: Record<string, any> }} item
 * @returns {{ params: Record<string, string>, confidence: number|null, unused: string[] }}
 *   params as text for the form fields; confidence separately (it is an option on the screen)
 */
export function exampleParams(item) {
  const params = {};
  const unused = [];
  let confidence = null;
  for (const [k, v] of Object.entries(item?.input || {})) {
    if (k === 'confidence' && typeof v === 'number') { confidence = v; continue; }
    if (k === 'pUnknown') {
      if (v === true) params.p = '0.5';
      continue;
    }
    if (typeof v !== 'number' || !Number.isFinite(v)) { unused.push(k); continue; }
    params[RENAME[k] || k] = String(v);
  }
  return { params, confidence, unused };
}

/**
 * Numbers for the engine from the form's text fields: empty fields are left out (the engine uses its
 * own default or asks for the value); anything that is not a finite number makes the whole set invalid.
 * @param {Record<string, string>} fields
 * @returns {{ ok: boolean, params: Record<string, number>, bad: string[] }}
 */
export function parseParams(fields) {
  const params = {};
  const bad = [];
  for (const [k, raw] of Object.entries(fields || {})) {
    const s = String(raw ?? '').trim();
    if (s === '') continue;
    const n = Number(s);
    if (Number.isFinite(n)) params[k] = n;
    else bad.push(k);
  }
  return { ok: bad.length === 0 && Object.keys(params).length > 0, params, bad };
}
