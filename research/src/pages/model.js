// Pure data behind the public pages [M2-DESIGN.md 11]: the /methods rows (from the catalogue and the
// generated fixture list, nothing typed), the /guide pages, the date and link helpers. No React here, so
// tests/unit/trust-pages.test.mjs reads it directly. OWNER: trust role.

/** The public repository the fixture files and tests live in. */
export const REPO_BLOB = 'https://github.com/palmzamak2547/vet-mock/blob/main/research/';

/** @param {string} file path under research/tests/fixtures/ */
export const fixtureUrl = (file) => `${REPO_BLOB}tests/fixtures/${file}`;
/** @param {string} name file name under research/tests/unit/ */
export const testUrl = (name) => `${REPO_BLOB}tests/unit/${name}`;
/** @param {string} p a path from the repository root, e.g. research/tests/fixtures/r/anova.R */
export const repoUrl = (p) => `${REPO_BLOB.replace(/research\/$/, '')}${p}`;

function utc(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * A calendar date with its era: "28 ก.ย. พ.ศ. 2569", "28 Sep 2026 CE". ISO dates are read in UTC so no time
 * zone can move them.
 * @param {string} iso YYYY-MM-DD
 * @param {'th'|'en'} lang
 */
export function formatDate(iso, lang) {
  const d = utc(iso);
  if (lang === 'th') {
    const dm = new Intl.DateTimeFormat('th-TH-u-nu-latn', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
    return `${dm} พ.ศ. ${d.getUTCFullYear() + 543}`;
  }
  const mon = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(d);
  return `${d.getUTCDate()} ${mon} ${d.getUTCFullYear()} CE`;
}

/** The year in the page's era. @param {number} year CE @param {'th'|'en'} lang */
export const eraYear = (year, lang) => (lang === 'th' ? `พ.ศ. ${year + 543}` : `${year}`);

/** Today as YYYY-MM-DD in the device's own calendar day. @param {Date} [now] */
export function localIsoDate(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export const GROUP_ORDER = Object.freeze(['now', 'M1', 'M2', 'M3', 'later']);

/**
 * @typedef {{ id: string, nameKey: string, milestone: string, shipped: boolean, verified: boolean,
 *   validatedAgainst: string[] }} CatalogEntryLike
 * @typedef {{ file: string, family: string, kind: string, methods: string[], tests: string[], source: any,
 *   tolerance: any[], sha: string, lastPassed: string|null }} FixtureLike
 */

/**
 * One row per catalogue method, grouped by what a reader can do with it today.
 * @param {CatalogEntryLike[]} catalog
 * @param {readonly FixtureLike[]} fixtures
 */
export function buildMethodsModel(catalog, fixtures) {
  const byMethod = new Map();
  for (const f of fixtures) for (const m of f.methods) {
    if (!byMethod.has(m)) byMethod.set(m, []);
    byMethod.get(m).push(f);
  }
  const rows = catalog.map((c) => {
    const own = (byMethod.get(c.id) || []).slice().sort((a, b) => (a.kind === b.kind ? (a.file < b.file ? -1 : 1) : a.kind === 'pin' ? -1 : 1));
    return {
      id: c.id,
      nameKey: c.nameKey,
      milestone: c.milestone,
      group: c.shipped ? 'now' : c.milestone,
      status: c.verified ? 'verified' : c.shipped ? 'shipped' : 'planned',
      families: c.validatedAgainst,
      fixtures: own,
    };
  });
  const groups = GROUP_ORDER.map((g) => ({ id: g, rows: rows.filter((r) => r.group === g) })).filter((g) => g.rows.length > 0);
  return {
    rows,
    groups,
    total: rows.length,
    shipped: rows.filter((r) => r.group === 'now').length,
    verified: rows.filter((r) => r.status === 'verified').length,
  };
}

/**
 * The words for one tolerance entry, as a dictionary key and its parameters.
 * @param {{ scope: string, rel?: string, lre?: number, text?: string }} tol
 * @returns {{ key: string, params: Record<string, string|number> }}
 */
export function toleranceWords(tol) {
  if (tol.rel !== undefined) {
    if (tol.scope === 'closed') return { key: 'trust.methods.tol.closed', params: { rel: tol.rel } };
    if (tol.scope === 'iterative') return { key: 'trust.methods.tol.iterative', params: { rel: tol.rel } };
    if (tol.scope === 'all') return { key: 'trust.methods.tol.relAll', params: { rel: tol.rel } };
    return { key: 'trust.methods.tol.rel', params: { scope: tol.scope, rel: tol.rel } };
  }
  if (tol.lre !== undefined) return { key: 'trust.methods.tol.lre', params: { scope: tol.scope, lre: tol.lre } };
  if (tol.scope === 'all') return { key: 'trust.methods.tol.textAll', params: { text: tol.text || '' } };
  return { key: 'trust.methods.tol.text', params: { scope: tol.scope, text: tol.text || '' } };
}

/**
 * The /guide pages, in reading order: the dictionary holds trust.guide.<id>.title, .lead, .step1..stepN
 * and .watch1..watchM; `example` is the example dataset that walks through it.
 */
export const GUIDE = Object.freeze([
  { id: 'start', steps: 7, watch: 2, example: 'feed-trial' },
  { id: 'farms', steps: 4, watch: 2, example: 'merge-farms' },
  { id: 'lab', steps: 5, watch: 2, example: 'feed-trial' },
  { id: 'repeated', steps: 4, watch: 2, example: 'piglet-growth' },
  { id: 'survival', steps: 4, watch: 1, example: 'calf-survival' },
  { id: 'diagnostic', steps: 4, watch: 2, example: 'rapid-test' },
  { id: 'agreement', steps: 4, watch: 1, example: 'thermometers' },
  { id: 'prepare', steps: 4, watch: 1, example: 'double-entry' },
  { id: 'warnings', steps: 0, watch: 0, example: null, warnings: ['G1', 'G3', 'G5', 'G7', 'G8', 'G14', 'G26'] },
]);

/** Every dictionary key the guide shows. */
export function guideKeys() {
  const keys = ['trust.page.guide.title', 'trust.guide.intro', 'trust.guide.pages', 'trust.guide.steps', 'trust.guide.watch',
    'trust.guide.try', 'trust.guide.tryBody', 'trust.guide.back', 'trust.guide.next', 'trust.guide.warnFromData'];
  for (const p of GUIDE) {
    keys.push(`trust.guide.${p.id}.title`, `trust.guide.${p.id}.lead`);
    for (let i = 1; i <= p.steps; i++) keys.push(`trust.guide.${p.id}.step${i}`);
    for (let i = 1; i <= p.watch; i++) keys.push(`trust.guide.${p.id}.watch${i}`);
    for (const g of p.warnings || []) keys.push(`trust.guide.${p.id}.${g}`);
  }
  return keys;
}

/** The guide page a location hash names, or null for the list. @param {string} hash */
export function guidePageFromHash(hash) {
  const id = String(hash || '').replace(/^#/, '');
  return GUIDE.find((p) => p.id === id) || null;
}
