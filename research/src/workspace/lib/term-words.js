// The student's own words for what an M2 envelope names by internal ids (review round 1): a model term
// ('(Intercept)', 'c2=B', 'c12') by its column label and level label, a level of a group column by its
// codebook label in the page language, an ANOVA effect ('A', 'B', 'A:B', 'residual', 'groupTime') by the
// columns the student chose, a pair ('B-A') by its two level labels, a column key in a table (the items of
// Cronbach's alpha) by its label. Every table of every M2 method that carries such a cell is listed here,
// so a new table column is named in one place. Pure. OWNER: ui-analysis role.
import { keyPart } from './keys.js';

/**
 * @typedef {{ t: (k: string, p?: any) => string, spec?: any, env?: any, codebook?: any,
 *   columnName?: (key: string) => string, levelName?: (key: string, value: string) => string }} WordsCtx
 */

const has = (t, key) => t(key) !== `[${key}]`;
const roleOf = (spec, r) => {
  const v = spec?.roles?.[r];
  return Array.isArray(v) ? v[0] ?? null : v ?? null;
};

/** The reference level of each category covariate, as the model's 'references' table gives it. */
function referencesOf(env) {
  const tb = (env?.tables || []).find((x) => x.id === 'references');
  return new Map((tb?.rows || []).map((r) => [String(r[0]), r[1]]));
}

/** Codebook types that hold numbers (intake/codebook.js NUMERIC). */
const NUMBER_TYPES = new Set(['continuous', 'count']);
/** Model values that are the effect of a term (a test of the term is not). */
const EFFECTS = new Set(['oddsRatio', 'rateRatio', 'b']);

/** Column label, or the key when the codebook does not know it. */
const colName = (ctx, key) => (ctx.columnName ? ctx.columnName(key) : key);
/** Level label of a column, or the value as the file has it. */
const lvlName = (ctx, key, value) => (key && ctx.levelName ? ctx.levelName(key, value) : value);
const isColumn = (ctx, key) => Boolean(ctx.codebook?.columns?.some((c) => c.key === key)) || (ctx.columnName && ctx.columnName(key) !== key);

/**
 * A model term: '(Intercept)' -> the intercept word; 'col=level' -> "Column: level vs reference"; a number
 * covariate 'col' -> its label. Anything else is returned as it is.
 * @param {string} term
 * @param {WordsCtx} ctx
 */
export function termText(term, ctx) {
  const s = String(term);
  const { t } = ctx;
  if (s === '(Intercept)') return t('term.intercept');
  if (s.startsWith('models.cell.') && has(t, s)) return t(s);
  const eq = s.indexOf('=');
  if (eq > 0) {
    const col = s.slice(0, eq);
    const level = s.slice(eq + 1);
    if (isColumn(ctx, col)) {
      const ref = referencesOf(ctx.env).get(col);
      const lv = lvlName(ctx, col, level);
      return ref !== undefined && ref !== null
        ? t('ws.term.levelVsRef', { column: colName(ctx, col), level: lv, reference: lvlName(ctx, col, ref) })
        : t('ws.term.level', { column: colName(ctx, col), level: lv });
    }
  }
  return isColumn(ctx, s) ? colName(ctx, s) : s;
}

/**
 * A model term as the effect it carries: the odds ratio, rate ratio or coefficient of a number covariate is per
 * one unit of it, "น้ำหนักแรกเกิด ต่อ 1 kg" (review round 6: "odds ratio (น้ำหนักแรกเกิด) 1.03" did not say per
 * what). The unit is the codebook's (the header's own brackets); without one the term reads "per 1 unit". A
 * label that already ends in the unit's brackets drops them. Any other term reads as termText has it.
 * @param {string} term
 * @param {WordsCtx} ctx
 */
export function perUnitTerm(term, ctx) {
  const c = ctx.codebook?.columns?.find((x) => x.key === String(term));
  if (!c || !NUMBER_TYPES.has(c.type)) return termText(term, ctx);
  // The unit is not printed: the codebook's unit and a label's brackets are guesses from the file's header ("(1-5)",
  // "(rectal)" are not units, and a Thai page got "month"; review round 8), and the label the student wrote already
  // says the unit when it has one.
  return ctx.t('ws.term.perUnit', { column: colName(ctx, c.key) });
}

/**
 * The words of the part after the colon of a value or test name ('oddsRatio:c2=B', 'median:ผู้', 'lr:c10').
 * @param {string|null} methodId
 * @param {string} suffix
 * @param {WordsCtx|null} ctx
 */
export function suffixText(methodId, suffix, ctx, measure = null) {
  if (!ctx) return suffix;
  if (methodId === 'reg.logistic' || methodId === 'reg.poisson') return EFFECTS.has(measure) ? perUnitTerm(suffix, ctx) : termText(suffix, ctx);
  if (methodId === 'surv.kaplanMeier') return lvlName(ctx, roleOf(ctx.spec, 'group'), suffix);
  return suffix;
}

/** The levels a pair cell is made of, split where both halves are known levels. */
function splitPair(cell, levels) {
  const s = String(cell);
  for (let i = s.indexOf('-'); i > 0; i = s.indexOf('-', i + 1)) {
    const a = s.slice(0, i);
    const b = s.slice(i + 1);
    if (levels.has(a) && levels.has(b)) return [a, b];
  }
  return null;
}

/** Every level a group column can print: the codebook's and those in the result's own group table. */
function groupLevels(ctx, key, env) {
  const out = new Set();
  const c = ctx.codebook?.columns?.find((x) => x.key === key);
  for (const l of c?.levels || []) if (l && typeof l.value === 'string') out.add(l.value);
  const g = (env?.tables || []).find((x) => x.id === 'groups');
  for (const r of g?.rows || []) if (typeof r[0] === 'string') out.add(r[0]);
  return out;
}

/** An effect row of an ANOVA table. */
function effectText(cell, ctx) {
  const { t, spec } = ctx;
  const m = spec?.method;
  const byRole = m === 'anova.twoWay' ? { A: 'group', B: 'factorB' } : { group: 'group', time: 'time' };
  if (byRole[cell] && roleOf(spec, byRole[cell])) return colName(ctx, roleOf(spec, byRole[cell]));
  if ((cell === 'A:B' || cell === 'AB') && roleOf(spec, 'group') && roleOf(spec, 'factorB')) return t('ws.test.interaction', { a: colName(ctx, roleOf(spec, 'group')), b: colName(ctx, roleOf(spec, 'factorB')) });
  if (cell === 'groupTime' && roleOf(spec, 'group') && roleOf(spec, 'time')) return t('ws.test.interaction', { a: colName(ctx, roleOf(spec, 'group')), b: colName(ctx, roleOf(spec, 'time')) });
  const k = `lab.source.${keyPart(cell)}`;
  return has(t, k) ? t(k) : cell;
}

/**
 * What a cell of an M2 table reads, or undefined when this table and column carry no id to resolve (the
 * caller then uses its own word lookup).
 * @param {string} tableId
 * @param {number} col   column index
 * @param {any} cell
 * @param {any[]} row
 * @param {WordsCtx} ctx
 * @returns {string|undefined}
 */
export function cellText(tableId, col, cell, row, ctx) {
  if (typeof cell !== 'string') return undefined;
  const { spec } = ctx;
  const m = spec?.method;
  const group = roleOf(spec, 'group');
  switch (m) {
    case 'anova.twoWay':
      if (tableId === 'anova' && col === 0) return effectText(cell, ctx);
      if (tableId === 'cellMeans') return col === 0 ? lvlName(ctx, group, cell) : col === 1 ? lvlName(ctx, roleOf(spec, 'factorB'), cell) : undefined;
      if (tableId === 'marginalMeans') {
        const key = row[0] === 'B' ? roleOf(spec, 'factorB') : group;
        return col === 0 ? colName(ctx, key) : col === 1 ? lvlName(ctx, key, cell) : undefined;
      }
      if ((tableId === 'tukeyA' || tableId === 'tukeyB') && col === 0) return pairText(cell, tableId === 'tukeyB' ? roleOf(spec, 'factorB') : group, ctx);
      return undefined;
    case 'anova.repeated':
      if (tableId === 'anova' && col === 0) return effectText(cell, ctx);
      if (tableId === 'means') return col === 0 ? lvlName(ctx, roleOf(spec, 'time'), cell) : col === 1 ? lvlName(ctx, group, cell) : undefined;
      return undefined;
    case 'test.friedman':
    case 'diag.brownForsythe':
    case 'diag.shapiro':
      return col === 0 ? lvlName(ctx, group, cell) : undefined;
    case 'posthoc.dunn':
    case 'posthoc.gamesHowell':
    case 'posthoc.dunnett':
      if (tableId === 'pairs' && col === 0) return pairText(cell, group, ctx);
      if (tableId === 'groups' && col === 0) return lvlName(ctx, group, cell);
      return undefined;
    case 'reg.logistic':
    case 'reg.poisson':
      if (tableId === 'coefficients' && col === 0) return perUnitTerm(cell, ctx);
      if ((tableId === 'lrTests' || tableId === 'references') && col === 0) return termText(cell, ctx);
      if (tableId === 'references' && col === 1) return lvlName(ctx, row[0], cell);
      if (tableId === 'separation' && col === 0) return termText(cell, ctx);
      if (tableId === 'separation' && col === 1) return cell.startsWith('models.cell.') ? ctx.t(cell) : lvlName(ctx, row[0], cell);
      return undefined;
    case 'surv.kaplanMeier':
      return col === 0 ? lvlName(ctx, group, cell) : undefined;
    case 'roc.delong':
      if (col === 0 && (cell === 'test' || cell === 'test2')) return colName(ctx, roleOf(spec, cell));
      return undefined;
    case 'agree.blandAltman':
      // the row of the file the pair came from, as its number (the id 'r12' is internal; review round 2)
      if (tableId === 'points' && col === 0) { const mm = /^r(\d+)$/.exec(cell); return mm ? mm[1] : cell; }
      return undefined;
    case 'rel.cronbach':
      return tableId === 'items' && col === 0 ? colName(ctx, cell) : undefined;
    case 'design.sampling':
      if ((tableId === 'selected' && col === 1) || (tableId === 'strata' && col === 0)) return lvlName(ctx, roleOf(spec, 'strata'), cell);
      return undefined;
    default:
      return undefined;
  }
}

/** A pair 'B-A' as "label of B minus label of A". */
export function pairText(cell, groupKey, ctx) {
  const parts = splitPair(cell, groupLevels(ctx, groupKey, ctx.env));
  if (!parts) return String(cell);
  return ctx.t('ws.term.pair', { a: lvlName(ctx, groupKey, parts[0]), b: lvlName(ctx, groupKey, parts[1]) });
}
