// Codebook proposal at import [M1-DESIGN.md 8.3; methods.md 5.6-5.7]. Everything proposed here is
// shown to the student once at import and stays editable. OWNER: intake role.
import { cleanCell } from './thai.js';
import { inferColumn, keyForIndex, suggestCluster } from './infer.js';
import { detectPii } from './pii.js';
import { findMissingCodes } from './missing.js';

export const TYPES = Object.freeze(['continuous', 'count', 'binary', 'nominal', 'ordinal', 'date', 'id', 'text']);
export const ROLES = Object.freeze(['outcome', 'exposure', 'confounder', 'group', 'cluster', 'id', 'pair', 'rater', 'time', 'none']);
export const LEVELS = Object.freeze(['region', 'farm', 'pen', 'household', 'litter', 'animal', 'sample', 'visit']);
export const CATEGORICAL = Object.freeze(new Set(['binary', 'nominal', 'ordinal']));
export const NUMERIC = Object.freeze(new Set(['continuous', 'count']));

// Two-level columns whose levels say which one is "positive" (the level counted) and which one is the
// reference (the absence). [negative, positive]
const PAIRS = [
  ['ลบ', 'บวก'], ['negative', 'positive'], ['neg', 'pos'], ['no', 'yes'], ['n', 'y'], ['ไม่ใช่', 'ใช่'],
  ['ไม่มี', 'มี'], ['0', '1'], ['false', 'true'], ['absent', 'present'], ['-', '+'], ['ปกติ', 'ผิดปกติ'],
  ['ไม่ป่วย', 'ป่วย'], ['healthy', 'sick'], ['normal', 'abnormal'],
];

/**
 * For a two-level column: which level is the absence (reference) and which is the presence (positive).
 * "ไม่X" against "X" is recognised for any X (ไม่ฉีด / ฉีด, ไม่ซื้อ / ซื้อ).
 * @param {string[]} levels @returns {{ negative: string, positive: string } | null}
 */
export function binaryPolarity(levels) {
  if (levels.length !== 2) return null;
  const [a, b] = levels;
  if (a === `ไม่${b}`) return { negative: a, positive: b };
  if (b === `ไม่${a}`) return { negative: b, positive: a };
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  for (const [neg, pos] of PAIRS) {
    if (la === neg && lb === pos) return { negative: a, positive: b };
    if (lb === neg && la === pos) return { negative: b, positive: a };
  }
  return null;
}

/** A unit written in the header's trailing parentheses: "ขนาดฝูง (ตัว)" -> "ตัว", "น้ำหนัก (kg)" -> "kg". */
export function unitFromHeader(header) {
  const m = String(header || '').match(/[(\[]\s*([^()[\]]{1,15}?)\s*[)\]]\s*$/);
  return m ? m[1] : null;
}

const H_OUTCOME = /^ผล|ผลตรวจ|ผลการตรวจ|result|outcome|status|serostatus/i;

/**
 * Per-column facts the preview computes once and the codebook reuses.
 * @typedef {Object} ColumnFacts
 * @property {string} key
 * @property {string} header
 * @property {string[]} values                cleaned text (NFC, invisible stripped, trimmed)
 * @property {ReturnType<typeof inferColumn>} inference
 * @property {{ code: string, reason: 'unknown'|'not-applicable'|'not-recorded' }[]} missingCodes  accepted candidates
 * @property {ReturnType<typeof detectPii>} pii
 */

/** Facts for every column of a raw table when the preview did not supply them. */
export function columnFacts(raw) {
  return raw.header.map((header, i) => {
    const values = (raw.columns[i] || []).map((c) => cleanCell(c).value);
    const found = findMissingCodes(values);
    const missingCodes = found.map((f) => ({ code: f.code, reason: f.suggestedReason }));
    const pii = detectPii(values, header);
    const inference = inferColumn(values, header, { missingCodes: missingCodes.map((m) => m.code) });
    return { key: keyForIndex(i), header, values, inference, missingCodes, pii };
  });
}

/**
 * Build the codebook the import screen asks the student to confirm once: type, role, levels,
 * labels TH/EN (the header text as the Thai label, empty English label to fill), level of
 * organisation, cluster column, missing codes, PII.
 * @param {import('../runtime/types.js').RawTable} raw
 * @param {{ facts?: ColumnFacts[], cluster?: { key: string, level: string }|null, unitOfAnalysis?: string }} [opts]
 * @returns {import('../runtime/types.js').Codebook}
 */
export function proposeCodebook(raw, opts = {}) {
  const facts = opts.facts ?? columnFacts(raw);
  const piiKeys = new Set(facts.filter((f) => f.pii).map((f) => f.key));
  const cluster = opts.cluster !== undefined ? opts.cluster : suggestCluster(raw, { skip: piiKeys });
  const unit = opts.unitOfAnalysis ?? 'animal';
  const clusterIndex = cluster ? facts.findIndex((f) => f.key === cluster.key) : -1;
  const clusterValues = clusterIndex >= 0 ? facts[clusterIndex].values : null;

  const columns = facts.map((f) => {
    const inf = f.inference;
    const type = f.pii ? 'text' : inf.type;
    let role = 'none';
    if (cluster && f.key === cluster.key) role = 'cluster';
    else if (!f.pii && type === 'id' && inf.distinct === inf.present && inf.present === raw.rowCount) role = 'id';
    else if (!f.pii && type === 'binary' && H_OUTCOME.test(f.header)) role = 'outcome';
    const categorical = CATEGORICAL.has(type);
    let levels = [];
    let reference = null;
    let positive = null;
    if (categorical) {
      let vals = inf.levels.slice();
      const pol = type === 'binary' ? binaryPolarity(vals) : null;
      if (pol) {
        vals = [pol.negative, pol.positive];
        reference = pol.negative;
        positive = pol.positive;
      }
      levels = vals.map((v) => ({ value: v, labelTh: v, labelEn: '' }));
    }
    // Level of organisation: a column constant within every cluster describes the cluster.
    let level = unit;
    if (clusterValues) {
      if (f.key === cluster.key) level = cluster.level;
      else {
        const seen = new Map();
        let constant = true;
        const codes = new Set(f.missingCodes.map((m) => m.code));
        for (let r = 0; r < f.values.length && constant; r++) {
          const v = f.values[r];
          if (v === '' || codes.has(v)) continue;
          const g = clusterValues[r];
          if (!seen.has(g)) seen.set(g, v);
          else if (seen.get(g) !== v) constant = false;
        }
        if (constant && seen.size > 0) level = cluster.level;
      }
    }
    const numeric = NUMERIC.has(type) && inf.numeric;
    return {
      key: f.key,
      name: f.header,
      labelTh: f.header.trim(),
      labelEn: '',
      type,
      role,
      level,
      unit: NUMERIC.has(type) ? unitFromHeader(f.header) : null,
      levels,
      reference,
      positive,
      missingCodes: f.missingCodes.map((m) => ({ code: m.code, reason: m.reason })),
      range: numeric ? { min: inf.numeric.min, max: inf.numeric.max } : null,
      pii: f.pii ? f.pii.kind : null,
      hidden: !!f.pii,
    };
  });
  return { columns, unitOfAnalysis: unit, clusterKey: cluster ? cluster.key : null };
}

/** Defaults inherit hiding; only a valid choice authored for this column overrides it. */
export function resolveColumnVisibility(entry, inherited = false) {
  const explicit = entry?.hiddenExplicit === true && typeof entry.hidden === 'boolean';
  return { hidden: explicit ? entry.hidden : Boolean(entry?.hidden || inherited), ...(explicit ? { hiddenExplicit: true } : {}) };
}

/**
 * Validate a codebook the student edited (one cluster column at most, levels unique, reference a
 * known level, binary outcome has a positive level).
 * @param {import('../runtime/types.js').Codebook} codebook
 * @returns {{ ok: boolean, issues: { column: string|null, key: string, params?: Object }[] }}
 */
export function checkCodebook(codebook) {
  const issues = [];
  const cols = codebook && Array.isArray(codebook.columns) ? codebook.columns : [];
  const keys = new Set();
  for (const c of cols) {
    if (keys.has(c.key)) issues.push({ column: c.key, key: 'intake.codebook.issue.duplicateKey' });
    keys.add(c.key);
    if (!TYPES.includes(c.type)) issues.push({ column: c.key, key: 'intake.codebook.issue.unknownType' });
    if (!ROLES.includes(c.role)) issues.push({ column: c.key, key: 'intake.codebook.issue.unknownRole' });
    if (!LEVELS.includes(c.level)) issues.push({ column: c.key, key: 'intake.codebook.issue.unknownLevel' });
    if ((c.hiddenExplicit !== undefined && typeof c.hiddenExplicit !== 'boolean')
      || (c.hiddenExplicit === true && typeof c.hidden !== 'boolean')) {
      issues.push({ column: c.key, key: 'intake.codebook.issue.visibilityChoice' });
    }
    const values = (c.levels || []).map((l) => l.value);
    if (new Set(values).size !== values.length) issues.push({ column: c.key, key: 'intake.codebook.issue.duplicateLevel' });
    if (CATEGORICAL.has(c.type)) {
      if (c.reference != null && !values.includes(c.reference)) issues.push({ column: c.key, key: 'intake.codebook.issue.referenceUnknown', params: { level: c.reference } });
      if (c.positive != null && !values.includes(c.positive)) issues.push({ column: c.key, key: 'intake.codebook.issue.positiveUnknown', params: { level: c.positive } });
      if (c.type === 'binary' && values.length > 2) issues.push({ column: c.key, key: 'intake.codebook.issue.binaryLevels', params: { count: values.length } });
      if (c.type === 'binary' && c.role === 'outcome' && c.positive == null) issues.push({ column: c.key, key: 'intake.codebook.issue.outcomeNoPositive' });
    }
    const codes = (c.missingCodes || []).map((m) => m.code);
    if (new Set(codes).size !== codes.length) issues.push({ column: c.key, key: 'intake.codebook.issue.duplicateMissingCode' });
    for (const m of c.missingCodes || []) if (!['unknown', 'not-applicable', 'not-recorded'].includes(m.reason)) issues.push({ column: c.key, key: 'intake.codebook.issue.missingReason', params: { code: m.code } });
  }
  const clusters = cols.filter((c) => c.role === 'cluster');
  if (clusters.length > 1) issues.push({ column: null, key: 'intake.codebook.issue.manyClusters', params: { count: clusters.length } });
  if (codebook && codebook.clusterKey != null) {
    const c = cols.find((x) => x.key === codebook.clusterKey);
    if (!c || c.role !== 'cluster') issues.push({ column: codebook.clusterKey, key: 'intake.codebook.issue.clusterKeyMismatch' });
  } else if (clusters.length === 1) issues.push({ column: clusters[0].key, key: 'intake.codebook.issue.clusterKeyMismatch' });
  if (!codebook || !LEVELS.includes(codebook.unitOfAnalysis)) issues.push({ column: null, key: 'intake.codebook.issue.unitOfAnalysis' });
  return { ok: issues.length === 0, issues };
}
