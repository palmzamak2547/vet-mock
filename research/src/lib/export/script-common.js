// What the SPSS syntax and the R script share [M2-DESIGN.md 6.3, 6.4]: the analyses they re-run (kept
// results on the data, in report order, each once), a column lookup by key, the envelope's numbers
// written as comments, and whether a method may claim agreement with R 4.6.0 (only when its envelope is
// verified against the 'r-4.6.0' fixture family). OWNER: report role.
import { scriptColumns } from './analysed-data.js';

/** A number as a comment prints it: six significant digits, Inf, -Inf, NA. */
export function num6(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return 'NA';
  if (x === Infinity) return 'Inf';
  if (x === -Infinity) return '-Inf';
  if (typeof x !== 'number') return String(x);
  return String(Number(x.toPrecision(6)));
}

/** A p-value as a comment prints it: four significant digits, never rounded to 0. */
const pComment = (p) => (typeof p !== 'number' ? 'NA' : p === 0 ? '0' : p < 1e-16 ? '< 1e-16' : String(Number(p.toPrecision(4))));

/**
 * Every value and test of an envelope as short "name = x [lo, hi]" and "test: stat = x, df = y, p = z" strings.
 * @param {any} env
 * @returns {string[]}
 */
export function envNumbers(env) {
  const out = [];
  for (const [name, v] of Object.entries(env?.values || {})) {
    if (!v || typeof v !== 'object') continue;
    if (v.value === null || v.value === undefined) { out.push(`${name} = NA`); continue; }
    out.push(`${name} = ${num6(v.value)}${Array.isArray(v.ci) ? ` [${num6(v.ci[0])}, ${num6(v.ci[1])}]` : ''}`);
  }
  for (const test of env?.tests || []) {
    const parts = [];
    if (test.statistic && typeof test.statistic.value === 'number') parts.push(`${test.statistic.name} = ${num6(test.statistic.value)}`);
    const df = Array.isArray(test.dfPair) ? test.dfPair : Array.isArray(test.df) ? test.df : typeof test.df === 'number' ? [test.df] : null;
    if (df) parts.push(`df = ${df.map(num6).join(', ')}`);
    parts.push(`p = ${pComment(test.p)}`);
    out.push(`${test.id}: ${parts.join(', ')}`);
  }
  return out;
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
    const spec = env.spec || a.spec;
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
    /** The variable name of a column key; the key itself when the column is not exported (hidden). */
    v: (key) => byKey.get(key)?.name || String(key || ''),
    col: (key) => byKey.get(key) || null,
    /** Levels of a categorical column except the given one. */
    others: (key, level) => (byKey.get(key)?.levels || []).filter((l) => l !== level),
  };
}

/** Role values of a spec as a flat list. */
export const rolesOf = (spec, role) => [].concat(spec?.roles?.[role] || []).filter((x) => typeof x === 'string' && x);

/** Wrap a comment text to lines of at most `max` characters at spaces (Thai runs stay whole). */
export function wrapComment(text, max = 100) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && cur.length + 1 + w.length > max) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}
