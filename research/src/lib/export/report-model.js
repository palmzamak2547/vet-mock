// The document every export writes: one model built from envelopes, the codebook and the recipe, never
// from typed numbers; .docx and HTML read it, and the scripts read the same analyses [M2-DESIGN.md 6].
// Sentences come from workspace/report/build.js (the draft the Report screen shows), tables from the
// envelope through the stats formatter (the same cells the result view copies to Word), figures from
// the chart kit as SVG passed in by the caller, the participant flow from workspace/report/flow.js, and
// the references from src/data/references.js plus VetMock Research itself. Hidden PII columns never
// appear: an analysis that names a hidden column is left out of the document and said so. Made-up data
// are labelled on the first page. Pure. OWNER: report role.
import { buildDraft, resultParagraphs, columnNameFor, levelNameFor, publicVersion, effectLabel } from '../../workspace/report/build.js';
import { exportTable, isStale, primaryValueName } from '../../workspace/lib/result-model.js';
import { envTableText } from '../../workspace/report/result-words.js';
import { strobeFlow, flowSvg } from '../../workspace/report/flow.js';
import { provenanceLines } from '../runtime/provenance.js';
import { getMethod } from '../runtime/catalog.js';
import { DESIGNS } from '../epi/design.js';
import { describeStep } from '../intake/recipe.js';
import { formatNumber, formatP, formatCi } from '../stats/format.js';
import { referencesFor } from '../../data/references.js';
import { softwareRecord, dateWithEra } from './cite.js';

const DEFAULT_FMT = { formatNumber, formatP, formatCi };
const has = (t, key) => t(key) !== `[${key}]`;

/**
 * @typedef {{ kind: 'heading', level: 1|2|3, text: string }
 *   | { kind: 'paragraph', text: string, style?: 'note'|'reference'|'madeUp' }
 *   | { kind: 'table', caption: string, columns: string[], rows: (string|number|null)[][], note: string|null }
 *   | { kind: 'figure', caption: string, svg: string, widthMm: number, altText: string }
 *   | { kind: 'flow', model: any, caption: string, svg: string, widthMm: number, altText: string }} Block
 */

/** Role values of a spec as a flat list of column keys. */
const roleColumns = (spec) => Object.values(spec?.roles || {}).flat().filter((x) => typeof x === 'string');

/** The column keys the codebook hides (PII). */
const hiddenKeys = (codebook) => new Set((codebook?.columns || []).filter((c) => c.hidden).map((c) => c.key));

/** A method's name in the page language, else its id. */
function methodName(id, t) {
  const row = getMethod(id);
  return row && has(t, row.nameKey) ? t(row.nameKey) : String(id || '');
}

/** "DeLong et al. 1988" / "Bland and Altman 1986", for the sentence that names the method sources. */
export function shortCite(ref, lang, t) {
  const family = (a) => String(a).split(',')[0].trim();
  const a = ref.authors || [];
  const who = a.length === 0 ? ref.title : a.length === 1 ? family(a[0]) : a.length === 2 ? t('report.cite.two', { a: family(a[0]), b: family(a[1]) }) : t('report.cite.etAl', { a: family(a[0]) });
  void lang;
  return `${who} ${ref.year}`;
}

/**
 * @param {{ project: any, dataset: any, analyses: any[], log: any[], lang: 'th'|'en', t: (k: string, p?: any) => string,
 *   fmt?: any, figures?: { analysisId: string, svg: string, widthMm?: number, caption?: string, altText?: string }[],
 *   release?: { version: string, year: number, url?: string, doi?: string|null, authors?: string[] }|null, today?: string }} input
 *   dataset: { codebook, table, steps, rawRows, madeUp }; today: 'YYYY-MM-DD' (the access date of the software citation).
 * @returns {{ title: string, lang: 'th'|'en', blocks: Block[], references: any[], provenance: string[], left: string[] }}
 */
export function buildReportModel(input) {
  const { project = {}, dataset = {}, lang, t } = input;
  const fmt = input.fmt || DEFAULT_FMT;
  const codebook = dataset.codebook || null;
  const hidden = hiddenKeys(codebook);
  const all = (input.analyses || []).filter((a) => a && a.envelope);
  // Hidden columns stay on the device screen only: an analysis built on one is left out of every export.
  const left = all.filter((a) => roleColumns(a.envelope.spec || a.spec).some((k) => hidden.has(k))).map((a) => a.id);
  const analyses = all.filter((a) => !left.includes(a.id));
  const columnName = columnNameFor(codebook, lang);
  const levelName = levelNameFor(codebook, lang);
  const designRow = DESIGNS.find((d) => d.id === project.design) || null;
  const nameKeyOf = (id) => getMethod(id)?.nameKey || null;
  const steps = dataset.steps || [];
  const blocks = [];
  let tableNo = 0;
  let figureNo = 0;

  const title = String(project.name || t('report.doc.untitled'));
  blocks.push({ kind: 'heading', level: 1, text: title });
  if (dataset.madeUp || project.madeUp || project.example) blocks.push({ kind: 'paragraph', text: t('report.doc.madeUp'), style: 'madeUp' });

  // Methods: the same paragraph the Report screen shows, then the sources of the methods.
  const draft = buildDraft({ analyses, steps, project, table: dataset.table || null, codebook }, { t, fmt, lang, nameKeyOf, designNameKey: designRow?.nameKey || null, describeStep, designRow });
  blocks.push({ kind: 'heading', level: 2, text: t('report.doc.methods') });
  if (draft.methods) blocks.push({ kind: 'paragraph', text: draft.methods });
  const flow = dataset.table || dataset.rawRows != null
    ? strobeFlow({ rawRows: dataset.rawRows ?? null, steps, analyses, codebook, excluded: dataset.table?.excluded })
    : null;
  const hasFlow = Boolean(flow && analyses.some((a) => (a.envelope.spec || a.spec)?.input?.kind === 'dataset'));
  const used = analyses.map((a) => ({ method: a.envelope.spec?.method || a.spec?.method, route: a.envelope.spec?.cluster?.route || null }));
  const refs = referencesFor(used, { flow: hasFlow, design: project.design || null });
  if (refs.length) {
    const cites = refs.filter((r) => r.id !== 'strobeVet2016' && r.id !== 'arrive2020').map((r) => shortCite(r, lang, t));
    if (cites.length) blocks.push({ kind: 'paragraph', text: t('report.doc.sources', { cites: cites.join(lang === 'th' ? ', ' : '; ') }) });
  }

  // Results: the participant flow, then each kept result with its sentences, tables and figures.
  blocks.push({ kind: 'heading', level: 2, text: t('report.doc.results') });
  if (draft.stale.length) {
    const names = analyses.filter((a) => draft.stale.includes(a.id)).map((a) => methodName(a.envelope.method?.id || a.spec?.method, t));
    blocks.push({ kind: 'paragraph', text: t('report.doc.stale', { methods: names.join(', ') }), style: 'note' });
  }
  if (hasFlow) {
    figureNo += 1;
    const drawn = flowSvg(flow, { t, methodName: (id) => methodName(id, t), columnName });
    blocks.push({ kind: 'flow', model: flow, svg: drawn.svg, widthMm: 160, caption: t('report.doc.figureCaption', { n: figureNo, title: t('report.doc.flowTitle') }), altText: drawn.text.join(' ') });
  }
  const figures = input.figures || [];
  for (const a of analyses) {
    const env = a.envelope;
    const name = methodName(env.method?.id || env.spec?.method, t);
    blocks.push({ kind: 'heading', level: 3, text: name });
    const para = resultParagraphs(env, { t, fmt, lang, codebook, designRow, nameKeyOf });
    if (para.results) blocks.push({ kind: 'paragraph', text: para.results });
    let lines = [];
    try { lines = provenanceLines(env, lang, t, columnName); } catch { lines = []; }
    const note = lines.join(' ') || null;
    if (env.status === 'ok') {
      const primary = primaryValueName(env, designRow);
      // The same words as the screen: model terms, levels and pairs by the codebook (review round 2: 'c2=หลัง 6
      // ชม.', '(Intercept)' and raw Thai group codes reached the English Word file).
      const words = { spec: env.spec, env, codebook, columnName, levelName };
      const main = exportTable(env, { t, fmt, lang, caption: name, note: note || '', primary, columnName, words });
      // Effects of one model (two-way and repeated-measures ANOVA) are named by their columns, not "F".
      const nValues = Object.keys(env.values || {}).length;
      (env.tests || []).forEach((test, k) => {
        const label = effectLabel(test, env.spec, { t, lang, columnName });
        if (label && main.rows[nValues + k]) main.rows[nValues + k][0] = label;
      });
      if (main.rows.length) {
        tableNo += 1;
        blocks.push({ kind: 'table', caption: t('report.doc.tableCaption', { n: tableNo, title: name }), columns: main.columns, rows: main.rows, note });
      }
      for (const tb of env.tables || []) {
        if (!Array.isArray(tb?.columns) || !Array.isArray(tb?.rows) || !tb.rows.length) continue;
        const tx = envTableText(tb, t, { spec: env.spec, codebook, columnName, levelName });
        tableNo += 1;
        blocks.push({ kind: 'table', caption: t('report.doc.tableCaption', { n: tableNo, title: tx.caption }), columns: tx.columns, rows: tx.rows, note: tx.notes.length ? tx.notes.join(' ') : null });
      }
    }
    for (const f of figures.filter((x) => x && x.analysisId === a.id && typeof x.svg === 'string' && x.svg)) {
      figureNo += 1;
      const title = f.caption || (f.title ? `${name}: ${f.title}` : name);
      const caption = f.note ? t('report.doc.figureCaptionNote', { n: figureNo, title, note: f.note }) : t('report.doc.figureCaption', { n: figureNo, title });
      blocks.push({ kind: 'figure', svg: f.svg, widthMm: f.widthMm || 140, caption, altText: f.altText || title });
    }
  }
  if (left.length) blocks.push({ kind: 'paragraph', text: t('report.doc.leftOut', { n: left.length }), style: 'note' });

  // References: the method sources, then VetMock Research at the version the results were computed with.
  const engine = analyses.map((a) => a.envelope?.provenance?.engineVersion).find(Boolean);
  // The version the results were computed with; a release record is used only when it is that version.
  const computedVersion = publicVersion(engine) || '';
  const version = computedVersion || input.release?.version || '';
  const release = input.release && input.release.version === version ? input.release : null;
  const today = input.today || new Date().toISOString().slice(0, 10);
  const year = release?.year || Number(today.slice(0, 4));
  const software = version ? softwareRecord({ ...(release || {}), version, year }, today) : null;
  const references = [...refs, ...(software ? [software] : [])];
  if (references.length) blocks.push({ kind: 'heading', level: 2, text: t('report.doc.references') });

  const fp = dataset.table?.fingerprint || analyses.map((a) => a.envelope?.provenance?.dataFingerprint).find(Boolean) || '';
  const provenance = [
    t('report.doc.prov.made', { version: version || '—', date: dateWithEra(today, lang, t) }),
    fp ? t('report.doc.prov.data', { hash: fp }) : null,
    t('report.doc.prov.device'),
  ].filter(Boolean);
  return { title, lang, blocks, references, provenance, left, tables: tableNo, figures: figureNo };
}

export { NUMERIC_CELL } from './cells.js';
