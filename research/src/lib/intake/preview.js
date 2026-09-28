// The import preview: every conversion listed before the student confirms [M1-DESIGN.md 8.1].
// buildPreview reads the file once and proposes; answerPreview re-evaluates after each answer (the
// student's choices never re-read the file). The import step the confirm button saves is always the
// one answerPreview returned last, and it is only saveable when `blocking` is empty (G26).
// The main thread may import this module for answerPreview: the xlsx reader (and SheetJS behind it)
// is loaded only inside buildPreview, which runs in the worker.
// OWNER: intake role.
import { decodeBytes, sha256Hex } from './decode.js';
import { parseDelimited } from './csv.js';
import { cleanCell, hasThaiDigit, thaiDigitsToArabic, hasSplitSaraAm, joinSaraAm } from './thai.js';
import { inferColumn, keyForIndex, suggestCluster } from './infer.js';
import { findMissingCodes } from './missing.js';
import { detectPii, maskValue } from './pii.js';
import { sniffDates, parseDate, excelDateIdParts, civilFromDays, excelSerialToDays, isoFromDays } from './dates.js';
import { proposeCodebook } from './codebook.js';
import { applyRecipe } from './recipe.js';

/**
 * @typedef {Object} Conversion
 * @property {string|null} column        column key, or null for the whole file (encoding, ragged rows)
 * @property {'encoding'|'ragged'|'thai-digits'|'be-year'|'two-digit-year'|'feb29'|'excel-serial'|'excel-date-id'|'id-number'|'missing-code'|'trim'|'invisible'|'nfc'|'lookalike'|'type-conflict'|'pii'|'question'} kind
 *                                        'question': a question no other conversion carries (a date column whose
 *                                        order or era the file does not settle); its key is the question's key
 * @property {number} count               cells affected (columns for 'pii'; rows for 'ragged')
 * @property {{ rowId: string, from: string, to: string }[]} examples  at most 5
 * @property {boolean} needsAnswer        true when the student must choose (era, date order, two-digit century, missing reason)
 * @property {boolean} applied            true when the import step applies it as listed; false for
 *                                        things shown but not changed (a look-alike spelling, an ID
 *                                        Excel wrote in scientific notation)
 * @property {string|null} questionId     the question that decides it, when there is one
 * @property {{ value: string, key: string }[]} [options]   the question's options, on conversions a question decides
 * @property {string|null} [answer]       the question's current answer (default included), on those conversions
 * @property {string} key                 i18n key of the sentence
 * @property {Object} params
 */

/**
 * @typedef {Object} Question
 * @property {string} id                  'q:<column>:<kind>[:<code>]'
 * @property {string|null} column
 * @property {'era'|'order'|'two-digit-century'|'excel-system'|'missing-reason'|'excel-date-id'|'id-padding'|'conflict'} kind
 * @property {string} key                 i18n key of the question
 * @property {Object} params
 * @property {{ value: string, key: string, params?: Object }[]} options
 * @property {string|null} default        the proposed answer, preselected; null means the student must choose
 * @property {string|null} answer         the current answer (the default until the student changes it)
 */

/**
 * @typedef {Object} ParsePreview
 * @property {import('../runtime/types.js').RawTable} raw
 * @property {Conversion[]} conversions
 * @property {Question[]} questions
 * @property {Record<string, string>} answers                     question id -> chosen value
 * @property {import('../runtime/types.js').Codebook} codebook   proposed (answers applied)
 * @property {import('../runtime/types.js').RecipeStep} importStep   the 'import-conversions' step the confirm button will save
 * @property {{ key: string, params: Object, questionId: string }[]} blocking   G26 stops: questions without an answer
 * @property {{ fileName: string, format: string, encoding: string, sheet: string|null, sheets: string[]|null, dateSystem: '1900'|'1904'|null, delimiter: string|null, rows: number, columns: number }} file
 * @property {Object} facts               per-column facts kept for answerPreview (not for display)
 */

const EXAMPLES = 5;
/** Columns a file may have (CSV, TSV, XLSX and SPSS alike). */
export const MAX_COLUMNS = 20_000;
const NA_CANDIDATES = new Set(['', '-', '.', 'NA', 'N/A', 'n/a']);
const EXCEL_ID_SCI = /^\d(\.\d+)?E\+\d+$/i;

const pushExample = (list, rowId, from, to) => { if (list.length < EXAMPLES) list.push({ rowId, from, to }); };

function detectFormat(u8, fileName, format) {
  if (format && format !== 'auto') return format;
  // SPSS system file: "$FL2" (.sav) or "$FL3" (.zsav)
  if (u8.length >= 4 && u8[0] === 0x24 && u8[1] === 0x46 && u8[2] === 0x4c && (u8[3] === 0x32 || u8[3] === 0x33)) return 'sav';
  if (u8.length >= 4 && u8[0] === 0x50 && u8[1] === 0x4b && u8[2] === 0x03 && u8[3] === 0x04) return 'xlsx';
  if (u8.length >= 4 && u8[0] === 0xd0 && u8[1] === 0xcf && u8[2] === 0x11 && u8[3] === 0xe0) return 'xlsx';
  if (/\.tsv$|\.tab$/i.test(fileName || '')) return 'tsv';
  return 'csv';
}

/**
 * Bytes to a preview: decode or read the sheet, detect the header, clean cells, infer types, find
 * missing codes, dates and PII, and propose the import step.
 * @param {ArrayBuffer|Uint8Array} bytes
 * @param {{ fileName: string, format?: 'auto'|'csv'|'tsv'|'xlsx'|'sav', sheet?: string|null, headerRow?: number, encoding?: 'auto'|'utf-8'|'utf-16le'|'utf-16be'|'windows-874', now?: string }} opts
 *   an SPSS file (.sav, .zsav) is recognised by its first bytes; its value labels, variable labels,
 *   measure levels and user-missing values become proposals in the same preview (M2-DESIGN.md 5)
 *   now: ISO time stamped on the raw table (tests pass a fixed one)
 * @returns {Promise<ParsePreview>}
 */
export async function buildPreview(bytes, opts) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const fileName = opts?.fileName || '';
  const format = detectFormat(u8, fileName, opts?.format);
  const sha256 = await sha256Hex(u8);
  const fileConversions = [];
  let header;
  let rows;
  let headerRow;
  let encoding;
  let sheet = null;
  let dateSystem = null;
  let delimiter = null;
  let excelDateCells = [];
  let ragged = 0;
  let extraColumns = 0;
  let direct = null;
  let sav = null;
  if (format === 'sav') {
    const { readSav } = await import('./sav.js');
    const forced = opts?.encoding && opts.encoding !== 'auto' ? opts.encoding : null;
    const s = await readSav(u8, { encoding: forced });
    header = s.raw.header;
    direct = s.raw.columns;
    rows = [];
    headerRow = 0;
    encoding = s.encoding;
    fileConversions.push({ column: null, kind: 'encoding', count: 0, examples: [], needsAnswer: false, applied: true, questionId: null, key: `data.sav.encoding.${s.encodingFrom}`, params: { encoding: s.encoding, compression: s.compression } });
    for (const note of s.notes) fileConversions.push({ column: null, kind: 'sav-note', count: note.params.count ?? 0, examples: [], needsAnswer: false, applied: false, questionId: null, key: note.key, params: note.params });
    sav = {
      conversions: s.conversions,
      variables: s.variables.map((v, i) => ({ key: keyForIndex(i), name: v.name, label: v.label, measure: v.measure, format: v.format, isDate: v.isDate, labels: v.valueLabels.map((l) => l.label), missingCodes: v.userMissing.codes })),
    };
  } else if (format === 'xlsx') {
    const { readSheet } = await import('./xlsx.js');
    const r = await readSheet(u8, { sheet: opts?.sheet ?? null, headerRow: opts?.headerRow });
    ({ header, rows, headerRow, dateSystem, excelDateCells, ragged, extraColumns } = r);
    sheet = r.sheet;
    encoding = 'xlsx';
  } else {
    const dec = decodeBytes(u8, { encoding: opts?.encoding });
    encoding = dec.encoding;
    fileConversions.push({ column: null, kind: 'encoding', count: 0, examples: [], needsAnswer: false, applied: true, questionId: null, key: dec.reasonKey, params: { encoding: dec.encoding, ...dec.params } });
    const parsed = parseDelimited(dec.text, { delimiter: format === 'tsv' ? '\t' : 'auto', headerRow: opts?.headerRow });
    ({ header, rows, headerRow, delimiter, ragged, extraColumns } = parsed);
  }
  if (ragged) fileConversions.push({ column: null, kind: 'ragged', count: ragged, examples: [], needsAnswer: false, applied: true, questionId: null, key: extraColumns ? 'intake.conv.raggedExtra' : 'intake.conv.ragged', params: { count: ragged, extra: extraColumns } });

  // One column cap for every format: the preview's work grows with the square of the column count, so a very
  // wide CSV ran into the watchdog after a minute instead of saying why (review round 4). An SPSS file is held
  // to the same number by its own reader (SAV_MAX_VARIABLES).
  if (header.length > MAX_COLUMNS) throw Object.assign(new Error('too many columns'), { key: 'intake.tooManyColumns', params: { max: MAX_COLUMNS.toLocaleString('en-US') } });
  header = header.map((h) => String(h).normalize('NFC'));
  const rowCount = direct ? (direct[0] ? direct[0].length : 0) : rows.length;
  const columns = direct || header.map((_, c) => rows.map((r) => r[c] ?? ''));
  const rowIds = Array.from({ length: rowCount }, (_, i) => `r${i + 1}`);
  /** @type {import('../runtime/types.js').RawTable} */
  const raw = {
    header, columns, rowIds, rowCount,
    source: { fileName, bytes: u8.length, sha256, encoding: /** @type {any} */ (encoding), format: /** @type {any} */ (format), sheet, headerRow, importedAt: opts?.now || new Date().toISOString() },
  };

  const facts = analyse(raw, { excelDateCells, dateSystem, sav });
  if (sav) for (const c of sav.conversions) facts.columns.find((f) => f.key === c.column)?.conversions.unshift(c);
  const preview = {
    raw,
    file: { fileName, format, encoding, sheet, sheets: null, dateSystem, delimiter, rows: rowCount, columns: header.length },
    facts: { columns: facts.columns, cluster: facts.cluster, fileConversions, sav: sav ? { variables: sav.variables } : null },
    questions: facts.questions,
    answers: {},
    conversions: [],
    codebook: null,
    importStep: null,
    blocking: [],
  };
  return answerPreview(preview, {});
}

// ------------------------------------------------------------------ static analysis (file read once)

function analyse(raw, { excelDateCells, dateSystem, sav = null }) {
  const cleanedCols = raw.header.map((_, i) => raw.columns[i].map((c) => cleanCell(c).value));
  const dateCellsByCol = new Map();
  for (const d of excelDateCells) {
    if (!dateCellsByCol.has(d.col)) dateCellsByCol.set(d.col, []);
    dateCellsByCol.get(d.col).push(d);
  }
  const piiKeys = new Set();
  const cols = raw.header.map((header, i) => {
    const key = keyForIndex(i);
    const rawVals = raw.columns[i];
    const values = cleanedCols[i];
    const f = { key, header, index: i, values, conversions: [], questions: [] };
    // cleaning
    const trim = [];
    const invisible = [];
    const nfc = [];
    const thai = [];
    let trimN = 0;
    let invN = 0;
    let nfcN = 0;
    let thaiN = 0;
    for (let r = 0; r < rawVals.length; r++) {
      const c = cleanCell(rawVals[r]);
      if (c.trimmed) { trimN += 1; pushExample(trim, raw.rowIds[r], rawVals[r], c.value); }
      if (c.invisible) { invN += 1; pushExample(invisible, raw.rowIds[r], rawVals[r], c.value); }
      if (c.normalized) { nfcN += 1; pushExample(nfc, raw.rowIds[r], rawVals[r], c.value); }
      if (hasThaiDigit(c.value)) { thaiN += 1; pushExample(thai, raw.rowIds[r], c.value, thaiDigitsToArabic(c.value)); }
    }
    const conv = (kind, count, examples, key, params = {}) => f.conversions.push({ column: key === null ? null : f.key, kind, count, examples, needsAnswer: false, applied: true, questionId: null, key, params: { column: header, count, ...params } });
    if (thaiN) conv('thai-digits', thaiN, thai, 'intake.conv.thaiDigits');
    if (trimN) conv('trim', trimN, trim, 'intake.conv.trim');
    if (invN) conv('invisible', invN, invisible, 'intake.conv.invisible');
    if (nfcN) conv('nfc', nfcN, nfc, 'intake.conv.nfc');
    f.pii = detectPii(values, header);
    if (f.pii) piiKeys.add(key);
    f.found = findMissingCodes(values);
    // SPSS user-missing values: proposed like any other code, their reason asked (G26)
    const spss = sav ? sav.variables[i]?.missingCodes || [] : [];
    for (const code of spss) {
      const hit = f.found.find((m) => m.code === code);
      if (hit) { hit.fromSpss = true; continue; }
      const rows = [];
      for (let r = 0; r < values.length; r++) if (values[r] === code) rows.push(r);
      if (rows.length) f.found.push({ code, count: rows.length, suggestedReason: 'unknown', rows, fromSpss: true });
    }
    return f;
  });

  // "-" or blank exactly on the rows where another short column has one value (parity "-" on the males): not applicable
  for (const f of cols) {
    for (const m of f.found) {
      if (!NA_CANDIDATES.has(m.code) || m.suggestedReason === 'not-applicable') continue;
      const set = new Set(m.rows);
      for (const g of cols) {
        if (g === f || piiKeys.has(g.key)) continue;
        const by = new Map();
        for (const r of m.rows) by.set(g.values[r], (by.get(g.values[r]) || 0) + 1);
        if (by.size !== 1) continue;
        const [v] = [...by.keys()];
        if (v === '') continue;
        let total = 0;
        const distinct = new Set();
        for (let r = 0; r < g.values.length; r++) { distinct.add(g.values[r]); if (g.values[r] === v) total += 1; }
        if (distinct.size > 6 || total !== set.size) continue;
        m.suggestedReason = 'not-applicable';
        m.evidence = { column: g.header, value: v };
        break;
      }
    }
  }

  const cluster = suggestCluster(raw, { skip: piiKeys });
  const clusterFacts = cluster ? cols.find((c) => c.key === cluster.key) : null;
  const questions = [];

  for (const f of cols) {
    // missing codes: each one a question with the suggested reason preselected
    for (const m of f.found) {
      const qid = `q:${f.key}:missing:${m.code}`;
      const options = ['unknown', 'not-applicable', 'not-recorded'].map((r) => ({ value: r, key: `intake.missing.reason.${r}` }));
      if (m.code !== '') options.push({ value: 'keep', key: 'intake.question.missing.keep' });
      questions.push({ id: qid, column: f.key, kind: 'missing-reason', key: m.fromSpss ? 'data.sav.question.userMissing' : m.code === '' ? 'intake.question.missing.blank' : 'intake.question.missing.code', params: { column: f.header, code: m.code, count: m.count, ...(m.evidence ? { evidenceColumn: m.evidence.column, evidenceValue: m.evidence.value } : {}) }, options, default: m.suggestedReason, answer: null });
      const ex = [];
      for (const r of m.rows) pushExample(ex, raw.rowIds[r], m.code, '');
      f.missingConv = f.missingConv || [];
      f.missingConv.push({ code: m.code, count: m.count, rows: m.rows, examples: ex, qid, evidence: m.evidence || null });
    }
    const codes = f.found.map((m) => m.code);
    f.inference = inferColumn(f.values, f.header, { missingCodes: codes });
    const dateCells = dateCellsByCol.get(f.index) || [];

    // PII
    if (f.pii) {
      const ex = [];
      for (let r = 0; r < f.values.length && ex.length < 2; r++) if (f.values[r]) pushExample(ex, raw.rowIds[r], '', maskValue(f.values[r], f.pii.kind));
      f.conversions.push({ column: f.key, kind: 'pii', count: 1, examples: ex, needsAnswer: false, applied: true, questionId: null, key: `intake.conv.pii.${f.pii.kind}`, params: { column: f.header, distinct: new Set(f.values.filter((v) => v !== '')).size } });
      continue;
    }

    // dates
    if (f.inference.type === 'date') {
      const present = f.values.filter((v) => v !== '' && !codes.includes(v));
      const sniff = sniffDates(present);
      f.sniff = sniff;
      if (f.inference.excelSerial) {
        questions.push({ id: `q:${f.key}:excel-system`, column: f.key, kind: 'excel-system', key: 'intake.question.excelSystem', params: { column: f.header }, options: [{ value: '1900', key: 'intake.question.excelSystem.1900' }, { value: '1904', key: 'intake.question.excelSystem.1904' }], default: '1900', answer: null });
      }
      if (sniff.numeric > 0) {
        questions.push({ id: `q:${f.key}:order`, column: f.key, kind: 'order', key: 'intake.question.order', params: { column: f.header, example: sniff.evidence.find((e) => e.params.example)?.params.example ?? '' }, options: [{ value: 'dmy', key: 'intake.question.order.dmy' }, { value: 'mdy', key: 'intake.question.order.mdy' }], default: sniff.orderConflict ? null : sniff.order ?? 'dmy', answer: null });
      }
      const four = sniff.fourDigit.be + sniff.fourDigit.ce + sniff.fourDigit.other;
      if (four > 0) {
        const mixed = sniff.fourDigit.be > 0 && sniff.fourDigit.ce > 0;
        const options = [{ value: 'BE', key: 'intake.question.era.BE' }, { value: 'CE', key: 'intake.question.era.CE' }];
        if (mixed) options.push({ value: 'mixed', key: 'intake.question.era.mixed' });
        const feb = sniff.feb29;
        questions.push({ id: `q:${f.key}:era`, column: f.key, kind: 'era', key: 'intake.question.era', params: { column: f.header, be: sniff.fourDigit.be, ce: sniff.fourDigit.ce, ...(feb ? { feb29: feb.example } : {}) }, options, default: mixed ? null : sniff.era, answer: null });
      }
      if (sniff.twoDigitYears > 0) {
        questions.push({ id: `q:${f.key}:two-digit`, column: f.key, kind: 'two-digit-century', key: 'intake.question.twoDigit', params: { column: f.header, count: sniff.twoDigitYears, example: sniff.twoDigitExample }, options: [{ value: '2500', key: 'intake.question.twoDigit.2500' }, { value: '1900', key: 'intake.question.twoDigit.1900' }, { value: '2000', key: 'intake.question.twoDigit.2000' }], default: null, answer: null });
      }
      if (dateCells.length) f.conversions.push({ column: f.key, kind: 'excel-serial', count: dateCells.length, examples: dateCells.slice(0, EXAMPLES).map((d) => ({ rowId: raw.rowIds[d.row], from: d.shown, to: f.values[d.row] })), needsAnswer: false, applied: true, questionId: null, key: 'intake.conv.excelDates', params: { column: f.header, count: dateCells.length, system: dateSystem } });
      continue;
    }

    // IDs Excel turned into dates ("4-7" typed, "7-Apr" shown)
    if (f.inference.type === 'id' || f.inference.type === 'text') {
      const hits = [];
      const dateByRow = new Map(dateCells.map((d) => [d.row, d]));
      for (let r = 0; r < f.values.length; r++) {
        let parts = excelDateIdParts(f.values[r]);
        const shown = dateByRow.get(r)?.shown ?? f.values[r];
        if (!parts && dateByRow.has(r)) {
          const days = excelSerialToDays(dateByRow.get(r).serial, dateSystem || '1900');
          if (Number.isFinite(days)) { const [, m, d] = civilFromDays(days); parts = { day: d, month: m }; }
        }
        if (parts) hits.push({ r, parts, shown, value: f.values[r] });
      }
      if (hits.length && hits.length < 0.5 * f.values.filter((v) => v !== '').length) {
        const proposals = proposeIdFixes(f, hits, clusterFacts, raw);
        const qid = `q:${f.key}:excel-date-id`;
        const anyProposal = proposals.some((p) => p.to);
        const options = anyProposal ? [{ value: 'use-proposed', key: 'intake.question.excelDateId.use' }, { value: 'keep', key: 'intake.question.excelDateId.keep' }] : [{ value: 'keep', key: 'intake.question.excelDateId.keep' }];
        questions.push({ id: qid, column: f.key, kind: 'excel-date-id', key: 'intake.question.excelDateId', params: { column: f.header, count: hits.length }, options, default: null, answer: null });
        f.idFixes = proposals;
        f.conversions.push({ column: f.key, kind: 'excel-date-id', count: hits.length, examples: proposals.slice(0, EXAMPLES).map((p) => ({ rowId: p.rowId, from: p.shown, to: p.to || '' })), needsAnswer: true, applied: false, questionId: qid, key: anyProposal ? 'intake.conv.excelDateId' : 'intake.conv.excelDateIdNoProposal', params: { column: f.header, count: hits.length } });
      }
      // IDs Excel turned into numbers: lost leading zeros, or scientific notation
      const sci = f.values.map((v, r) => [v, r]).filter(([v]) => EXCEL_ID_SCI.test(v));
      if (sci.length) f.conversions.push({ column: f.key, kind: 'id-number', count: sci.length, examples: sci.slice(0, EXAMPLES).map(([v, r]) => ({ rowId: raw.rowIds[r], from: v, to: '' })), needsAnswer: false, applied: false, questionId: null, key: 'intake.conv.idScientific', params: { column: f.header, count: sci.length } });
      const pad = paddingProposal(f.values);
      if (pad) {
        const qid = `q:${f.key}:id-padding`;
        questions.push({ id: qid, column: f.key, kind: 'id-padding', key: 'intake.question.idPadding', params: { column: f.header, count: pad.fixes.length, width: pad.width }, options: [{ value: 'pad', key: 'intake.question.idPadding.pad' }, { value: 'keep', key: 'intake.question.idPadding.keep' }], default: null, answer: null });
        f.padFixes = pad.fixes.map((x) => ({ rowId: raw.rowIds[x.r], from: x.from, to: x.to }));
        f.conversions.push({ column: f.key, kind: 'id-number', count: pad.fixes.length, examples: f.padFixes.slice(0, EXAMPLES), needsAnswer: true, applied: false, questionId: qid, key: 'intake.conv.idPadding', params: { column: f.header, count: pad.fixes.length, width: pad.width } });
      }
    }

    // levels that look the same but are spelled differently (SARA AM typed as two keys)
    if (['binary', 'nominal', 'ordinal', 'text'].includes(f.inference.type)) {
      const distinct = new Set(f.values);
      for (const v of distinct) {
        if (!hasSplitSaraAm(v)) continue;
        const joined = joinSaraAm(v);
        if (!distinct.has(joined)) continue;
        const count = f.values.filter((x) => x === v).length;
        f.conversions.push({ column: f.key, kind: 'lookalike', count, examples: [], needsAnswer: false, applied: false, questionId: null, key: 'intake.conv.lookalike', params: { column: f.header, a: v, b: joined, count } });
      }
    }
  }
  return { columns: cols, cluster, questions };
}

/** Propose the ID each Excel date stood for, from the other IDs in the same cluster (farm). */
function proposeIdFixes(f, hits, clusterFacts, raw) {
  const all = new Set(f.values);
  const hitRows = new Set(hits.map((h) => h.r));
  return hits.map(({ r, parts, shown, value }) => {
    const group = clusterFacts && clusterFacts !== f ? clusterFacts.values[r] : null;
    const shapes = new Map();
    for (let i = 0; i < f.values.length; i++) {
      if (hitRows.has(i)) continue;
      if (group !== null && clusterFacts.values[i] !== group) continue;
      const m = /^(.*?)(\d+)$/.exec(f.values[i]);
      if (!m) continue;
      const k = `${m[1]}\u0000${m[2].length}`;
      if (!shapes.has(k)) shapes.set(k, { c: 0, min: Infinity, max: -Infinity });
      const s = shapes.get(k);
      s.c += 1;
      s.min = Math.min(s.min, Number(m[2]));
      s.max = Math.max(s.max, Number(m[2]));
    }
    let best = null;
    for (const [k, s] of shapes) if (!best || s.c > best.s.c) best = { k, s };
    let to = null;
    if (best) {
      const [prefix, w] = best.k.split('\u0000');
      const width = Number(w);
      // Excel read the typed "a-b" as a day and a month, so the ID used one of the two numbers. Keep
      // the numbers no other row uses; when both are free, the one inside the group's own run wins.
      const idOf = (x) => prefix + String(x).padStart(width, '0');
      let free = [...new Set([parts.day, parts.month])].filter((x) => String(x).length <= width && !all.has(idOf(x)));
      if (free.length > 1) free = free.filter((x) => x >= best.s.min && x <= best.s.max);
      if (free.length === 1) to = idOf(free[0]);
    }
    return { rowId: raw.rowIds[r], from: value, shown, to };
  });
}

/** Digit-only IDs where most carry leading zeros to a fixed width and a few lost them. */
function paddingProposal(values) {
  const digits = values.map((v, r) => ({ v: thaiDigitsToArabic(v), r })).filter((x) => /^\d+$/.test(x.v));
  if (digits.length < 5) return null;
  const withZero = digits.filter((x) => x.v.length > 1 && x.v[0] === '0');
  if (withZero.length < 0.5 * digits.length) return null;
  const widths = new Map();
  for (const x of withZero) widths.set(x.v.length, (widths.get(x.v.length) || 0) + 1);
  let width = 0;
  let top = 0;
  for (const [w, c] of widths) if (c > top) { width = w; top = c; }
  const all = new Set(digits.map((x) => x.v));
  const fixes = digits.filter((x) => x.v.length < width).map((x) => ({ r: x.r, from: values[x.r], to: x.v.padStart(width, '0') })).filter((x) => !all.has(x.to));
  return fixes.length ? { width, fixes } : null;
}

// ------------------------------------------------------------------ answers -> step, codebook, conversions

/**
 * Apply the student's answers (merged over the ones already given) and re-evaluate. Pure: returns a
 * new preview object; the raw table and the facts are shared, never changed.
 * @param {ParsePreview} preview
 * @param {Record<string, string|null>} answers   question id -> option value (null clears an answer)
 * @returns {ParsePreview}
 */
export function answerPreview(preview, answers) {
  const merged = { ...preview.answers };
  for (const [k, v] of Object.entries(answers || {})) { if (v == null) delete merged[k]; else merged[k] = String(v); }
  const qs = preview.questions.map((q) => ({ ...q, answer: merged[q.id] ?? q.default ?? null }));
  const ans = (id) => qs.find((q) => q.id === id)?.answer ?? null;
  const { raw } = preview;
  const factCols = preview.facts.columns;

  // codebook from the facts with the chosen missing codes
  const codebookFacts = factCols.map((f) => ({
    key: f.key, header: f.header, values: f.values, pii: f.pii,
    missingCodes: (f.missingConv || []).map((m) => ({ code: m.code, reason: ans(m.qid) })).filter((m) => m.reason && m.reason !== 'keep'),
  }));
  for (const cf of codebookFacts) cf.inference = inferColumn(cf.values, cf.header, { missingCodes: cf.missingCodes.map((m) => m.code) });
  const codebook = proposeCodebook(raw, { facts: codebookFacts, cluster: preview.facts.cluster });
  if (preview.facts.sav) applySavHints(codebook, preview.facts.sav);

  // the import step
  const perColumn = {};
  for (const f of factCols) {
    const s = { thaiDigits: true, trim: true, nfc: true, invisible: true, dates: null, missingCodes: [], cellFixes: [] };
    s.missingCodes = codebookFacts.find((c) => c.key === f.key).missingCodes;
    const entry = codebook.columns.find((c) => c.key === f.key);
    if (entry.type === 'date') {
      const century = ans(`q:${f.key}:two-digit`);
      s.dates = {
        order: f.sniff && f.sniff.numeric > 0 ? ans(`q:${f.key}:order`) : f.sniff?.order === 'ymd' ? 'ymd' : 'dmy',
        era: ans(`q:${f.key}:era`) ?? (f.sniff && f.sniff.fourDigit.be + f.sniff.fourDigit.ce + f.sniff.fourDigit.other ? null : 'CE'),
        twoDigitCentury: century == null ? null : Number(century),
        excelSystem: f.inference?.excelSerial ? ans(`q:${f.key}:excel-system`) : null,
      };
    }
    if (f.idFixes && ans(`q:${f.key}:excel-date-id`) === 'use-proposed') for (const p of f.idFixes) if (p.to) s.cellFixes.push({ rowId: p.rowId, from: p.from, to: p.to, why: 'excel-date-id' });
    if (f.padFixes && ans(`q:${f.key}:id-padding`) === 'pad') for (const p of f.padFixes) s.cellFixes.push({ ...p, why: 'id-padding' });
    perColumn[f.key] = s;
  }

  // Dry run: which cells still cannot be read as their type? Each column with such cells gets a
  // question (treat them as missing, keep them as unreadable, or make the column text).
  const at = raw.source.importedAt;
  const stepFor = (pc) => ({ id: 's1', seq: 1, kind: 'import-conversions', params: { encoding: raw.source.encoding, perColumn: pc }, reason: null, at });
  let table = applyRecipe(raw, codebook, [stepFor(perColumn)]);
  const conflictQs = [];
  let changed = false;
  for (const [key, bad] of Object.entries(table.invalid)) {
    const f = factCols.find((x) => x.key === key);
    const entry = codebook.columns.find((c) => c.key === key);
    const qid = `q:${key}:conflict`;
    const real = realConflicts(bad);
    if (!real.count) continue; // only cells waiting for a date question: answering it settles them
    conflictQs.push({ id: qid, column: key, kind: 'conflict', key: 'intake.question.conflict', params: { column: f.header, count: real.count, type: entry.type }, options: [{ value: 'missing', key: 'intake.question.conflict.missing' }, { value: 'invalid', key: 'intake.question.conflict.invalid' }, { value: 'text', key: 'intake.question.conflict.text' }], default: null, answer: merged[qid] ?? null });
    const a = merged[qid];
    if (a === 'missing') {
      for (const { value: code } of real.values) if (!perColumn[key].missingCodes.some((m) => m.code === code)) perColumn[key].missingCodes.push({ code, reason: 'unknown' });
      entry.missingCodes = perColumn[key].missingCodes.slice();
      changed = true;
    } else if (a === 'text') {
      entry.type = 'text';
      entry.levels = [];
      entry.reference = null;
      entry.positive = null;
      entry.range = null;
      perColumn[key].dates = null;
      changed = true;
    }
  }
  if (changed) table = applyRecipe(raw, codebook, [stepFor(perColumn)]);
  const allQs = qs.concat(conflictQs);

  // conversions
  const conversions = preview.facts.fileConversions.slice();
  for (const f of factCols) {
    const entry = codebook.columns.find((c) => c.key === f.key);
    for (const c of f.conversions) conversions.push({ ...c, needsAnswer: c.questionId ? ans(c.questionId) == null : c.needsAnswer, applied: c.questionId ? ans(c.questionId) === 'use-proposed' || ans(c.questionId) === 'pad' : c.applied });
    for (const m of f.missingConv || []) {
      const reason = ans(m.qid);
      const kept = reason === 'keep';
      conversions.push({ column: f.key, kind: 'missing-code', count: m.count, examples: m.examples.map((e) => ({ ...e, rowId: e.rowId })), needsAnswer: false, applied: !kept, questionId: m.qid, key: kept ? 'intake.conv.missingKept' : m.code === '' ? 'intake.conv.missingBlank' : 'intake.conv.missingCode', params: { column: f.header, code: m.code, count: m.count, reason: reason || '' } });
    }
    if (entry.type === 'date' && f.sniff) {
      const rule = perColumn[f.key].dates;
      const s = f.sniff;
      if (s.fourDigit.be + s.ymdBE > 0) {
        const ex = [];
        const beRe = /(^|\D)(2[4-6]\d\d)(\D|$)/;
        for (let r = 0; r < f.values.length && ex.length < EXAMPLES; r++) {
          const v = thaiDigitsToArabic(f.values[r]);
          if (!beRe.test(v)) continue;
          const d = parseDate(v, rule);
          pushExample(ex, raw.rowIds[r], f.values[r], 'days' in d ? isoFromDays(d.days) : '');
        }
        // BE years in d/m/y cells follow the era answer; a BE year inside an ISO date cell (typed into a
        // CE date cell in Excel) is always read as BE, and is listed here too
        const pending = s.fourDigit.be > 0 && rule.era == null;
        const count = (rule.era === 'BE' || rule.era === 'mixed' || pending ? s.fourDigit.be : 0) + s.ymdBE;
        if (count > 0) conversions.push({ column: f.key, kind: 'be-year', count, examples: ex, needsAnswer: pending, applied: !pending, questionId: s.fourDigit.be > 0 ? `q:${f.key}:era` : null, key: 'intake.conv.beYears', params: { column: f.header, count } });
      }
      if (s.twoDigitYears > 0) {
        const ex = [];
        for (let r = 0; r < f.values.length && ex.length < EXAMPLES; r++) {
          const v = f.values[r];
          if (!/[/\-.]\d{2}$/.test(thaiDigitsToArabic(v))) continue;
          const d = parseDate(v, rule);
          pushExample(ex, raw.rowIds[r], v, 'days' in d ? isoFromDays(d.days) : '');
        }
        conversions.push({ column: f.key, kind: 'two-digit-year', count: s.twoDigitYears, examples: ex, needsAnswer: rule.twoDigitCentury == null, applied: rule.twoDigitCentury != null, questionId: `q:${f.key}:two-digit`, key: 'intake.conv.twoDigit', params: { column: f.header, count: s.twoDigitYears, example: s.twoDigitExample } });
      }
      if (s.feb29) {
        const ex = [];
        for (let r = 0; r < f.values.length && ex.length < EXAMPLES; r++) {
          const v = thaiDigitsToArabic(f.values[r]);
          if (!/^29[/\-.]0?2[/\-.]\d{4}$/.test(v) && !/^0?2[/\-.]29[/\-.]\d{4}$/.test(v)) continue;
          const d = parseDate(v, rule);
          pushExample(ex, raw.rowIds[r], f.values[r], 'days' in d ? isoFromDays(d.days) : '');
        }
        const onlyBE = s.feb29.validAsBE === s.feb29.count && s.feb29.validAsCE === 0;
        const onlyCE = s.feb29.validAsCE === s.feb29.count && s.feb29.validAsBE === 0;
        conversions.push({ column: f.key, kind: 'feb29', count: s.feb29.count, examples: ex, needsAnswer: false, applied: true, questionId: `q:${f.key}:era`, key: onlyBE ? 'intake.conv.feb29OnlyBE' : onlyCE ? 'intake.conv.feb29OnlyCE' : 'intake.conv.feb29Both', params: { column: f.header, count: s.feb29.count, example: s.feb29.example } });
      }
      if (f.inference.excelSerial) conversions.push({ column: f.key, kind: 'excel-serial', count: f.inference.present, examples: [], needsAnswer: false, applied: true, questionId: `q:${f.key}:excel-system`, key: 'intake.conv.excelSerials', params: { column: f.header, count: f.inference.present, system: rule.excelSystem || '' } });
    }
  }
  for (const [key, bad] of Object.entries(table.invalid)) {
    const f = factCols.find((x) => x.key === key);
    const real = realConflicts(bad);
    if (!real.count) continue;
    const qid = `q:${key}:conflict`;
    const q = allQs.find((x) => x.id === qid);
    conversions.push({ column: key, kind: 'type-conflict', count: real.count, examples: real.examples.map((e) => ({ rowId: e.rowId, from: e.value, to: '' })), needsAnswer: !!q && q.answer == null, applied: true, questionId: q ? qid : null, key: 'intake.conv.typeConflict', params: { column: f.header, count: real.count, reasonKey: real.examples[0]?.key || '' } });
  }

  // Every question still without an answer is carried by a conversion with needsAnswer: true, and
  // every conversion that a question decides carries the question's options, so a screen that walks
  // the conversion list alone can ask each question (value -> answerPreview({ [questionId]: value })).
  const names = Object.fromEntries(factCols.map((f) => [f.key, f.header]));
  for (const q of allQs) {
    const carried = conversions.filter((c) => c.questionId === q.id);
    for (const c of carried) { c.options = q.options; c.answer = q.answer; }
    if (q.answer == null && !carried.some((c) => c.needsAnswer)) {
      conversions.push({ column: q.column, kind: 'question', count: 0, examples: [], needsAnswer: true, applied: false, questionId: q.id, key: q.key, params: { ...q.params, column: q.column ? names[q.column] : '' }, options: q.options, answer: null });
    }
  }

  // G26: every question without an answer blocks the confirm button
  const blocking = allQs.filter((q) => q.answer == null).map((q) => ({ key: `intake.blocking.${q.kind}`, params: { column: q.column ? names[q.column] : '' }, questionId: q.id }));

  const importStep = stepFor(perColumn);
  return { ...preview, answers: merged, questions: allQs, codebook, importStep, conversions, blocking };
}

/**
 * What SPSS knew about each variable, as proposals the student sees in the codebook: the variable
 * label as the Thai label when it is in Thai script (else the English label), the order of the value
 * labels as the order of the levels, and "ordinal" when SPSS said so. Nothing here changes a cell.
 */
function applySavHints(codebook, sav) {
  const thai = /[\u0e00-\u0e7f]/;
  for (const v of sav.variables) {
    const entry = codebook.columns.find((c) => c.key === v.key);
    if (!entry) continue;
    if (v.label) {
      if (thai.test(v.label)) entry.labelTh = v.label;
      else entry.labelEn = v.label;
    }
    if (['binary', 'nominal', 'ordinal'].includes(entry.type) && v.labels.length) {
      const order = v.labels;
      const rank = (x) => { const i = order.indexOf(x.value); return i < 0 ? order.length : i; };
      if (entry.type !== 'binary') entry.levels = entry.levels.map((l, i) => ({ l, i })).sort((a, b) => rank(a.l) - rank(b.l) || a.i - b.i).map((x) => x.l);
      if (v.measure === 'ordinal' && entry.type === 'nominal') entry.type = 'ordinal';
    }
  }
}

/** Unreadable cells, leaving out those that only wait for a date question (era, order, two-digit century). */
function realConflicts(bad) {
  const waiting = (k) => /Unanswered$/.test(k);
  let count = bad.count;
  for (const [k, c] of Object.entries(bad.byKey || {})) if (waiting(k)) count -= c;
  return { count, examples: bad.examples.filter((e) => !waiting(e.key)), values: (bad.values || []).filter((v) => !waiting(v.key)) };
}

/**
 * Group conversions by kind for a short summary ("แปลงแล้ว 6 เรื่อง"): kind, total cells, columns.
 * @param {Conversion[]} conversions
 * @returns {{ kind: string, count: number, columns: string[], needsAnswer: boolean, applied: boolean }[]}
 */
export function summarizeConversions(conversions) {
  const by = new Map();
  for (const c of conversions) {
    if (!by.has(c.kind)) by.set(c.kind, { kind: c.kind, count: 0, columns: [], needsAnswer: false, applied: false });
    const g = by.get(c.kind);
    g.count += c.count;
    if (c.column && !g.columns.includes(c.column)) g.columns.push(c.column);
    g.needsAnswer = g.needsAnswer || c.needsAnswer;
    g.applied = g.applied || c.applied;
  }
  return [...by.values()];
}
