// What the SPSS syntax and the R script share [M2-DESIGN.md 6.3, 6.4]: the analyses they re-run (kept
// results on the data, in report order, each once), a column lookup by key, the envelope's numbers
// written as comments, and whether a method may claim agreement with R 4.6.0 (only when its envelope is
// verified against the 'r-4.6.0' fixture family). OWNER: report role.
import { scriptColumns, safeIdent } from './analysed-data.js';
import { validateSpec } from '../runtime/spec.js';

/**
 * One line of text: control characters and line or paragraph separators become spaces, so a name or an
 * id read from an imported project file can never end a comment and start code (review round 1).
 */
export const oneLine = (s) => String(s ?? '').replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, ' ');

const SAFE_WORD = /^[A-Za-z0-9_.+-]{0,40}$/;
/** A value a script may print as it is: a finite number, a boolean, a short plain word; else null. */
function plain(x) {
  if (typeof x === 'number') return Number.isFinite(x) ? x : null;
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') return SAFE_WORD.test(x) ? x : null;
  if (Array.isArray(x)) return x.map(plain);
  return null;
}

/**
 * The spec a script is written from: it must pass validateSpec, and every option and typed parameter it
 * prints into code is a finite number, a boolean or a short plain word (the rest become null, which the
 * scripts print as NA). Roles go through the column index (never printed raw) and levels through the
 * string quoting of each language. Null when the spec does not validate: that analysis is left out.
 */
export function scriptSpec(spec) {
  if (!spec) return null;
  const r = validateSpec(spec);
  if (!r.ok) return null;
  const sp = r.spec;
  const options = Object.fromEntries(Object.entries(sp.options || {}).map(([k, x]) => [k, plain(x)]));
  let input = sp.input;
  if (input?.kind === 'params') input = { ...input, params: Object.fromEntries(Object.entries(input.params || {}).map(([k, x]) => [k, plain(x)])) };
  else if (input?.kind === 'counts') input = { ...input, counts: Object.fromEntries(Object.entries(input.counts || {}).map(([k, x]) => [k, plain(x)])) };
  const cluster = sp.cluster ? { ...sp.cluster, route: plain(sp.cluster.route) } : sp.cluster;
  return { ...sp, design: plain(sp.design), options, input, cluster };
}

/** A number as a comment prints it: six significant digits, Inf, -Inf, NA. */
export function num6(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return 'NA';
  if (x === Infinity) return 'Inf';
  if (x === -Infinity) return '-Inf';
  if (typeof x !== 'number') return 'NA';
  return String(Number(x.toPrecision(6)));
}

/** A p-value as a comment prints it: four significant digits, never rounded to 0. */
const pComment = (p) => (typeof p !== 'number' ? 'NA' : p === 0 ? '0' : p < 1e-16 ? '< 1e-16' : String(Number(p.toPrecision(4))));

/**
 * Every value and test of an envelope as short "name = x [lo, hi]" and "test: stat = x, df = y, p = z" strings.
 * @param {any} env
 * @returns {string[]}
 */
export function envNumbers(env, nameOf = (x) => x) {
  const out = [];
  for (const [key, v] of Object.entries(env?.values || {})) {
    if (!v || typeof v !== 'object') continue;
    const name = nameOf(key);
    if (v.value === null || v.value === undefined) { out.push(`${oneLine(name)} = NA`); continue; }
    out.push(`${oneLine(name)} = ${num6(v.value)}${Array.isArray(v.ci) ? ` [${num6(v.ci[0])}, ${num6(v.ci[1])}]` : ''}`);
  }
  for (const test of env?.tests || []) {
    const parts = [];
    if (test.statistic && typeof test.statistic.value === 'number') parts.push(`${oneLine(test.statistic.name)} = ${num6(test.statistic.value)}`);
    const df = Array.isArray(test.dfPair) ? test.dfPair : Array.isArray(test.df) ? test.df : typeof test.df === 'number' ? [test.df] : null;
    if (df) parts.push(`df = ${df.map(num6).join(', ')}`);
    parts.push(`p = ${pComment(test.p)}`);
    out.push(`${oneLine(test.id)}: ${parts.join(', ')}`);
  }
  return out;
}

const MEASURE_SHORT = Object.freeze({ oddsRatio: 'OR', rateRatio: 'IRR', riskRatio: 'RR', b: 'b', median: 'median' });

/**
 * A value's name in a script comment by the column names the script uses: "oddsRatio:c2=after 6 h" becomes
 * "OR colostrum: after 6 h vs within 6 h" (review round 3: internal ids and raw values in the comments).
 * @param {ReturnType<typeof columnIndex>} ix
 * @param {(k: string, p?: any) => string} t
 */
export function valueNamer(ix, t) {
  const vs = t('report.script.versus');
  const versus = vs && !vs.startsWith('[') && vs !== 'report.script.versus' ? vs : 'vs';
  return (name) => {
    const m = /^([A-Za-z]+):(.+)$/.exec(String(name));
    if (!m) return name;
    const head = MEASURE_SHORT[m[1]] || m[1];
    const rest = m[2];
    const eq = rest.indexOf('=');
    if (eq <= 0) return `${head} ${ix.col(rest)?.name ?? rest}`;
    const key = rest.slice(0, eq);
    const level = rest.slice(eq + 1);
    const c = ix.col(key);
    if (!c) return name;
    return `${head} ${c.name}: ${level}${c.reference != null && c.reference !== level ? ` ${versus} ${c.reference}` : ''}`;
  };
}

/** The envelope passed a fixture computed with R 4.6.0 (so the script may say the numbers matched). */
export function matchesR(env) {
  return Boolean(env?.verified) && (env?.provenance?.validatedAgainst || []).includes('r-4.6.0');
}

/**
 * The analyses a script re-runs: kept, computed, in order; the same method with the same roles, options,
 * levels and route once (an older and a newer run of one analysis). Analyses on typed parameters stay
 * (they re-run from their parameters, not from the CSV).
 * @param {any[]} analyses
 */
export function scriptAnalyses(analyses) {
  const seen = new Set();
  const out = [];
  for (const a of analyses || []) {
    const env = a?.envelope;
    if (!env || env.status !== 'ok') continue;
    // The envelope's spec (it carries a route's resolved method) when it validates, else the analysis's own;
    // never an unchecked one: an imported file's envelope is only loosely validated (review round 1).
    const spec = scriptSpec(env.spec) || scriptSpec(a.spec);
    if (!spec) continue;
    const sig = JSON.stringify([spec?.method, spec?.roles, spec?.levels, spec?.options, spec?.cluster, spec?.input?.kind === 'params' ? spec.input.params : null]);
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push({ id: a.id, spec, env });
  }
  return out;
}

/**
 * Column lookup by key for a script.
 * @param {any} codebook
 * @param {import('./analysed-data.js').ScriptColumn[]|null} [columns]
 * @param {'th'|'en'} [lang]
 */
export function columnIndex(codebook, columns = null, lang = 'th') {
  const list = columns || scriptColumns(codebook, null, lang);
  const byKey = new Map(list.map((c) => [c.key, c]));
  return {
    list,
    /** The variable name of a column key; the key made safe when the column is not exported (hidden). */
    v: (key) => byKey.get(key)?.name || safeIdent(key),
    col: (key) => byKey.get(key) || null,
    /** Levels of a categorical column except the given one. */
    others: (key, level) => (byKey.get(key)?.levels || []).filter((l) => l !== level),
  };
}

/** Role values of a spec as a flat list. */
export const rolesOf = (spec, role) => [].concat(spec?.roles?.[role] || []).filter((x) => typeof x === 'string' && x);

/** Wrap a comment text to lines of at most `max` characters at spaces (Thai runs stay whole). */
export function wrapComment(text, max = 100) {
  const words = oneLine(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && cur.length + 1 + w.length > max) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}
