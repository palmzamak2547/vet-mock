// Rows of the chapter "what statistics CUVET papers use" [M1-DESIGN.md 15.3]. Joins the method
// catalogue's families (src/lib/runtime/catalog.js FAMILIES[].evidence) with the committed Europe PMC
// evidence files, so every count on the page is read from a file and every status from the catalogue.
// Pure: the evidence objects and the status function are passed in, so node --test runs it on the
// files as they sit on disk. OWNER: landing role.

/** Evidence file names; the check date of each is read from its name (YYYY-MM-DD). */
export const EVIDENCE_FILES = Object.freeze(['epmc-methods-2026-09-25.json', 'epmc-methods-2026-09-27.json']);

/** Repository links for the evidence and the counting script (the repo is public). */
export const EVIDENCE_BASE_URL = 'https://github.com/palmzamak2547/vet-mock/blob/main/research/src/landing/evidence/';

/** @param {string} file @returns {string} ISO date from the file name */
export function fileDate(file) {
  const m = /(\d{4}-\d{2}-\d{2})/.exec(file);
  if (!m) throw new Error(`no date in ${file}`);
  return m[1];
}

/** Read "<top>.<key>" where the key may itself contain dots or slashes (split on the first dot). */
export function evidenceAt(obj, dotted) {
  const i = dotted.indexOf('.');
  return obj?.[dotted.slice(0, i)]?.[dotted.slice(i + 1)];
}

/** Where the counts come from; printed in the chapter's source note. */
export const EVIDENCE_API = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';

/**
 * Join the catalogue's families with the evidence files into the one table the chapter prints:
 * research/src/data/cuvet-methods.json is exactly this object (build-cuvet-methods.mjs writes it, and
 * landing-chart.test.mjs fails when it differs from the files on disk).
 * @param {{ id: string, evidence: { file: string, path: string }[] }[]} families
 * @param {Record<string, any>} files file name -> parsed JSON
 */
export function joinEvidence(families, files) {
  const later = files['epmc-methods-2026-09-27.json'];
  const earlier = files['epmc-methods-2026-09-25.json'];
  const denominator = later?.with_full_text;
  if (!Number.isInteger(denominator) || denominator !== earlier?.cuvet?.with_full_text) {
    throw new Error('the two evidence files disagree on the number of full-text papers');
  }
  const out = families.map((f) => {
    const e = f.evidence[0];
    const count = evidenceAt(files[e.file], e.path);
    if (!Number.isInteger(count) || count < 0) throw new Error(`${f.id}: no count at ${e.file} ${e.path}`);
    return { id: f.id, count, file: e.file, path: e.path, checked: fileDate(e.file) };
  });
  out.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  return {
    source: 'Europe PMC',
    api: EVIDENCE_API,
    query: later.base,
    denominator,
    denominatorMeans: 'papers matching the query that have full text in Europe PMC (query AND HAS_FT:Y)',
    counted: 'papers whose METHODS section matches the family terms; a paper can count in several families; a keyword count is a usage signal, not a census',
    checked: EVIDENCE_FILES.map((file) => ({ file, date: fileDate(file), url: `${EVIDENCE_BASE_URL}${file}` })),
    script: `${EVIDENCE_BASE_URL}epmc-methods-2026-09-27.py`,
    families: out,
  };
}

/**
 * @typedef {Object} MethodRow
 * @property {string} id        family id
 * @property {number} count     papers whose METHODS section matched
 * @property {number} share     count / denominator
 * @property {string} file      evidence file the count came from
 * @property {string} checked   ISO date of that file
 * @property {'now'|'M1'|'M2'|'M3'|'later'} status
 */

/**
 * Rows of the chart from the joined table and the catalogue's status function.
 * @param {ReturnType<typeof joinEvidence>} joined  research/src/data/cuvet-methods.json
 * @param {(id: string) => ('now'|'M1'|'M2'|'M3'|'later')} statusOf
 * @returns {{ rows: MethodRow[], denominator: number, query: string, max: number, checked: string[] }}
 */
export function buildRows(joined, statusOf) {
  const { denominator } = joined;
  if (!Number.isInteger(denominator) || denominator <= 0) throw new Error('no denominator');
  const rows = joined.families.map((f) => {
    if (!Number.isInteger(f.count) || f.count < 0 || f.count > denominator) throw new Error(`${f.id}: bad count`);
    return { id: f.id, count: f.count, share: f.count / denominator, file: f.file, checked: f.checked, status: statusOf(f.id) };
  });
  rows.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  return { rows, denominator, query: joined.query, max: rows.length ? rows[0].count : 0, checked: joined.checked.map((c) => c.date) };
}

/** Share of the denominator as a percent string with one decimal. @param {number} share */
export function sharePercent(share) {
  return (share * 100).toFixed(1);
}
