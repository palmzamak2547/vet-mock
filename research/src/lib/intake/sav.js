// SPSS system files: .sav (uncompressed and bytecode-compressed) and .zsav (zlib blocks, inflated with
// fflate), little and big endian [M2-DESIGN.md 5]. Records 1 (header), 2 (variables, with their
// continuation records and missing values), 3/4 (value labels), 6 (documents, skipped with a note), 7
// (subtypes 3, 4, 11, 13, 14, 20, 21, 22; any other subtype is skipped and counted) and 999. The layout
// follows the PSPP manual's "System File Format" appendix.
//
// Strict bounds: every read checks the bytes are there, every count is checked against what is left
// in the file before a loop runs, the inflated size of a .zsav is checked against its trailer, and the
// file is capped at 50 MB, so a damaged file fails with a message (SavError, an i18n key under
// data.sav.*) and never hangs or fills memory.
//
// The output feeds the M1 import like a CSV: a RawTable of cell TEXT (numbers as their shortest
// round-trip text, dates as ISO 8601 CE, SYSMIS as a blank, a value with a label as its label text),
// plus what SPSS knew about each variable (labels, measure level, user-missing values) for the import
// preview to propose (never to apply silently).
// OWNER: data role.
import { unzlibSync } from 'fflate';
import { isoFromDays } from './dates.js';

export const MAX_SAV_BYTES = 50 * 1024 * 1024;
const MAX_INFLATED = 400 * 1024 * 1024;
/** Cells and rows a .sav may carry: bytecode compression lets a small file expand into a huge table, and a
 * 29 MB file of one variable read as 29 million rows at 1.8 GB (review round 1). */
export const SAV_MAX_CELLS = 5_000_000;
export const SAV_MAX_ROWS = 1_000_000;
/** Codes proposed for one user-missing range; the note says how many values fall inside it. */
export const SAV_MAX_RANGE_CODES = 200;
/** Days from 1582-10-14 (SPSS's day zero) to 1970-01-01. */
export const SPSS_EPOCH_DAYS = 141428;
/** Format type codes that hold a date as seconds since 1582-10-14 (DATE, ADATE, EDATE, SDATE, JDATE, DATETIME). */
const DATE_FORMATS = new Set([20, 23, 38, 39, 24, 22]);
const FORMAT_NAMES = new Map([
  [1, 'A'], [2, 'AHEX'], [3, 'COMMA'], [4, 'DOLLAR'], [5, 'F'], [6, 'IB'], [7, 'PIBHEX'], [8, 'P'], [9, 'PIB'], [10, 'PK'],
  [11, 'RB'], [12, 'RBHEX'], [15, 'Z'], [16, 'N'], [17, 'E'], [20, 'DATE'], [21, 'TIME'], [22, 'DATETIME'], [23, 'ADATE'],
  [24, 'JDATE'], [25, 'DTIME'], [26, 'WKDAY'], [27, 'MONTH'], [28, 'MOYR'], [29, 'QYR'], [30, 'WKYR'], [31, 'PCT'], [32, 'DOT'],
  [33, 'CCA'], [34, 'CCB'], [35, 'CCC'], [36, 'CCD'], [37, 'CCE'], [38, 'EDATE'], [39, 'SDATE'], [40, 'MTIME'], [41, 'YMDHMS'],
]);
const MEASURES = new Map([[1, 'nominal'], [2, 'ordinal'], [3, 'scale']]);
/** Code page (record 7.3) -> TextDecoder label. */
const CODE_PAGES = new Map([[874, 'windows-874'], [65001, 'utf-8'], [1252, 'windows-1252'], [28591, 'iso-8859-1'], [20127, 'utf-8'], [2, 'utf-8'], [3, 'windows-1252']]);

/** A damaged or unsupported file: `key` is an i18n key (data.sav.*), `params` fill it. */
export class SavError extends Error {
  constructor(key, params = {}) {
    super(key);
    this.key = key;
    this.params = params;
  }
}

class Reader {
  constructor(u8, pos = 0) {
    this.u8 = u8;
    this.dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    this.pos = pos;
    this.le = true;
  }
  left() { return this.u8.length - this.pos; }
  need(n) {
    if (!(n >= 0) || this.pos + n > this.u8.length) throw new SavError('data.sav.truncated', { at: this.pos });
  }
  i32() { this.need(4); const v = this.dv.getInt32(this.pos, this.le); this.pos += 4; return v; }
  f64() { this.need(8); const v = this.dv.getFloat64(this.pos, this.le); this.pos += 8; return v; }
  /** A 64-bit integer that must fit in 2^53 (offsets and sizes). */
  i64() {
    this.need(8);
    const lo = this.dv.getUint32(this.pos + (this.le ? 0 : 4), this.le);
    const hi = this.dv.getInt32(this.pos + (this.le ? 4 : 0), this.le);
    this.pos += 8;
    if (hi < 0 || hi > 0x1fffff) throw new SavError('data.sav.badZlib', { at: this.pos - 8 });
    return hi * 0x100000000 + lo;
  }
  bytes(n) { this.need(n); const b = this.u8.subarray(this.pos, this.pos + n); this.pos += n; return b; }
  skip(n) { this.need(n); this.pos += n; }
}

let latin1 = null;
/** Bytes as ASCII/Latin-1 text (names, record 7.14): a decoder, never a spread of a large array. */
const ascii = (b) => { if (!latin1) latin1 = new TextDecoder('iso-8859-1'); return latin1.decode(b); };
const rtrim = (s) => s.replace(/[\s\u0000]+$/u, '');
const numText = (x) => (x === 0 ? '0' : String(x));

/**
 * Read an SPSS system file.
 * @param {ArrayBuffer|Uint8Array} bytes
 * @param {{ encoding?: string|null }} [opts]  a TextDecoder label the student chose, when the file does not say
 * @returns {Promise<{ raw: import('../runtime/types.js').RawTable, variables: SavVariable[], encoding: string, encodingFrom: 'record-7.20'|'code-page'|'utf-8-check'|'chosen', compression: 'none'|'bytecode'|'zlib', conversions: any[], notes: { key: string, params: Object }[], fileLabel: string }>}
 *   raw.source carries fileName '' and sha256 ''; the import preview fills both
 */
export async function readSav(bytes, opts = {}) {
  return readSavSync(bytes, opts);
}

/**
 * @typedef {Object} SavVariable
 * @property {string} name             the long name (record 7.13) or the short name
 * @property {string} shortName
 * @property {string|null} label
 * @property {'numeric'|'string'} type
 * @property {number} width            0 for numeric, bytes for strings
 * @property {string} format           e.g. 'F8.2', 'A3', 'DATE11'
 * @property {boolean} isDate
 * @property {'nominal'|'ordinal'|'scale'|'unknown'} measure
 * @property {{ value: string, label: string }[]} valueLabels   value as the text the cell would carry without the label
 * @property {{ values: string[], range: [number, number]|null, codes: string[] }} userMissing   values as text; range bounds may be
 *   -Infinity/Infinity (LO, HI); `codes` are the cell texts to propose as missing codes (labels applied,
 *   and every value in the data that falls inside the range)
 */

/** Synchronous core of readSav (the worker calls it through readSav). */
export function readSavSync(bytes, opts = {}) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (u8.length > MAX_SAV_BYTES) throw new SavError('data.sav.tooBig', { max: 50 });
  if (u8.length < 176) throw new SavError('data.sav.notSav');
  const magic = ascii(u8.subarray(0, 4));
  if (magic !== '$FL2' && magic !== '$FL3') throw new SavError('data.sav.notSav');
  const r = new Reader(u8, 64);
  // layout code 2 or 3 tells the byte order
  r.le = true;
  let layout = r.dv.getInt32(64, true);
  if (layout !== 2 && layout !== 3) {
    r.le = false;
    layout = r.dv.getInt32(64, false);
    if (layout !== 2 && layout !== 3) throw new SavError('data.sav.badHeader');
  }
  r.pos = 68;
  const nominalCaseSize = r.i32();
  const compressionCode = r.i32();
  r.i32(); // weight index
  const nCases = r.i32();
  const bias = r.f64();
  r.skip(9 + 8); // creation date and time (not part of the data)
  const fileLabelBytes = r.bytes(64);
  r.skip(3);
  if (![0, 1, 2].includes(compressionCode)) throw new SavError('data.sav.badHeader');
  if ((compressionCode === 2) !== (magic === '$FL3')) throw new SavError('data.sav.badHeader');
  if (!Number.isFinite(bias)) throw new SavError('data.sav.badHeader');

  // ---- the dictionary
  const segs = []; // one per variable record that is not a continuation
  let elements = 0;
  const labelSets = [];
  const notes = [];
  const ext = { longNames: null, veryLong: null, encoding: null, codePage: null, sysmis: -Number.MAX_VALUE, highest: Number.MAX_VALUE, lowest: -Number.MAX_VALUE, measures: null, longLabels: [], longMissing: [] };
  let skipped = 0;
  let documents = 0;
  for (;;) {
    const at = r.pos;
    const type = r.i32();
    if (type === 999) { r.i32(); break; }
    if (type === 2) {
      const width = r.i32();
      const hasLabel = r.i32();
      const nMissing = r.i32();
      const print = r.i32();
      r.i32(); // write format
      const name = r.bytes(8);
      let label = null;
      if (hasLabel === 1) {
        const len = r.i32();
        if (len < 0 || len > 65535) throw new SavError('data.sav.badRecord', { type, at });
        label = r.bytes(len);
        r.skip((4 - (len % 4)) % 4);
      } else if (hasLabel !== 0) throw new SavError('data.sav.badRecord', { type, at });
      if (![0, 1, 2, 3, -2, -3].includes(nMissing)) throw new SavError('data.sav.badRecord', { type, at });
      const missing = [];
      for (let i = 0; i < Math.abs(nMissing); i++) missing.push(r.bytes(8));
      elements += 1;
      if (width === -1) {
        if (!segs.length || segs[segs.length - 1].width === 0) throw new SavError('data.sav.badRecord', { type, at });
        segs[segs.length - 1].elems += 1;
        continue;
      }
      if (width < 0 || width > 255) throw new SavError('data.sav.badRecord', { type, at });
      segs.push({ dictIndex: elements, width, name, label, nMissing, missing, print, elems: 1 });
      continue;
    }
    if (type === 3) {
      const count = r.i32();
      if (count < 0 || count > r.left() / 9) throw new SavError('data.sav.badRecord', { type, at });
      const labels = [];
      for (let i = 0; i < count; i++) {
        const value = r.bytes(8);
        r.need(1);
        const len = r.u8[r.pos];
        r.pos += 1;
        const text = r.bytes(len);
        r.skip((8 - ((len + 1) % 8)) % 8);
        labels.push({ value, text });
      }
      const at4 = r.pos;
      if (r.i32() !== 4) throw new SavError('data.sav.badRecord', { type: 4, at: at4 });
      const nVars = r.i32();
      if (nVars < 1 || nVars > r.left() / 4) throw new SavError('data.sav.badRecord', { type: 4, at: at4 });
      const vars = [];
      for (let i = 0; i < nVars; i++) vars.push(r.i32());
      labelSets.push({ labels, vars });
      continue;
    }
    if (type === 4) throw new SavError('data.sav.badRecord', { type, at });
    if (type === 6) {
      const n = r.i32();
      if (n < 0 || n > r.left() / 80) throw new SavError('data.sav.badRecord', { type, at });
      r.skip(80 * n);
      documents += n;
      continue;
    }
    if (type === 7) {
      const subtype = r.i32();
      const size = r.i32();
      const count = r.i32();
      if (size < 0 || count < 0 || (size > 0 && count > r.left() / size)) throw new SavError('data.sav.badRecord', { type, at });
      const data = r.bytes(size * count);
      readExtension(subtype, size, count, data, r.le, ext, at);
      if (![3, 4, 11, 13, 14, 16, 20, 21, 22].includes(subtype)) skipped += 1;
      continue;
    }
    throw new SavError('data.sav.badRecord', { type, at });
  }
  if (!segs.length) throw new SavError('data.sav.noVariables');
  for (const s of segs) {
    const want = s.width === 0 ? 1 : Math.ceil(s.width / 8);
    if (s.elems !== want) throw new SavError('data.sav.badRecord', { type: 2, at: 0 });
  }
  if (nominalCaseSize !== -1 && nominalCaseSize !== elements) throw new SavError('data.sav.badHeader');
  if (documents) notes.push({ key: 'data.sav.note.documents', params: { count: documents } });
  if (skipped) notes.push({ key: 'data.sav.note.skipped', params: { count: skipped } });

  // ---- the text encoding
  let encoding;
  let encodingFrom;
  if (opts.encoding) { encoding = opts.encoding; encodingFrom = 'chosen'; }
  else if (ext.encoding) { encoding = decoderLabel(ascii(ext.encoding).trim()); encodingFrom = 'record-7.20'; }
  else if (ext.codePage != null && CODE_PAGES.has(ext.codePage)) { encoding = CODE_PAGES.get(ext.codePage); encodingFrom = 'code-page'; }
  else encodingFrom = 'utf-8-check';
  let decoder;
  if (encoding) {
    try { decoder = new TextDecoder(encoding, { fatal: false }); } catch { throw new SavError('data.sav.encodingUnknown', { name: encoding }); }
    encoding = decoder.encoding;
  }

  // ---- logical variables (very long strings joined)
  const veryLong = ext.veryLong ? parsePairs(ascii(ext.veryLong)) : new Map();
  const longNames = ext.longNames ? parsePairs(bytesText(ext.longNames, decoder || new TextDecoder('utf-8'))) : new Map();
  const vars = [];
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const shortName = rtrim(ascii(s.name));
    const vlw = veryLong.get(shortName);
    if (vlw !== undefined) {
      const width = Number(vlw);
      const n = Math.ceil(width / 252);
      if (!(width > 255 && width <= 32767) || i + n > segs.length) throw new SavError('data.sav.badRecord', { type: 7, at: 0 });
      // The number of segments and their widths follow the 252-byte rule (PSPP's manual), but each
      // segment but the last carries 255 bytes of the string, as SPSS and ReadStat write it: the
      // haven fixture's 900-byte Thai text only comes back whole this way.
      const parts = [];
      let remaining = width;
      for (let j = 0; j < n; j++) {
        const g = segs[i + j];
        const alloc = j < n - 1 ? 255 : width - (n - 1) * 252;
        if (g.width !== alloc) throw new SavError('data.sav.badRecord', { type: 7, at: 0 });
        const used = Math.min(j < n - 1 ? 255 : alloc, remaining);
        remaining -= used;
        parts.push({ seg: i + j, used });
      }
      if (remaining !== 0) throw new SavError('data.sav.badRecord', { type: 7, at: 0 });
      vars.push({ s, shortName, width, parts, segIndex: i });
      i += n - 1;
      continue;
    }
    vars.push({ s, shortName, width: s.width, parts: [{ seg: i, used: s.width }], segIndex: i });
  }

  // Offsets of each segment in the case (in 8-byte elements)
  const segStart = [];
  {
    let o = 0;
    for (const s of segs) { segStart.push(o); o += s.elems; }
  }

  // ---- the data: every element of every case
  const compression = compressionCode === 0 ? 'none' : compressionCode === 1 ? 'bytecode' : 'zlib';
  let stream;
  if (compression === 'none') stream = rawStream(u8, r.pos, elements, nCases);
  else if (compression === 'bytecode') stream = bytecodeStream(u8, r.pos, u8.length, bias);
  else {
    const inflated = inflateZsav(r);
    stream = bytecodeStream(inflated, 0, inflated.length, bias);
  }
  // Each case is read element by element and turned at once into one number or one string's bytes
  // per variable, so memory grows with the cells, not with the 8-byte elements.
  const nums = vars.map(() => []);
  const strs = vars.map(() => []);
  const maxCases = Math.min(SAV_MAX_ROWS, Math.floor(SAV_MAX_CELLS / Math.max(1, vars.length)));
  const row = new Array(elements);
  let nRead = 0;
  let stringBytesTotal = 0;
  for (;;) {
    if (nCases >= 0 && nRead >= nCases) break;
    const first = stream.next();
    if (first === null) break;
    if (nRead >= maxCases) throw new SavError('data.sav.tooManyRows', { rows: SAV_MAX_ROWS.toLocaleString('en-US'), cells: SAV_MAX_CELLS.toLocaleString('en-US') });
    row[0] = first;
    for (let e = 1; e < elements; e++) {
      const el = stream.next();
      if (el === null) throw new SavError('data.sav.truncated', { at: u8.length });
      row[e] = el;
    }
    vars.forEach((v, vi) => {
      if (v.width > 0) {
        const b = stringBytes(row, v, segs, segStart);
        stringBytesTotal += b.length;
        strs[vi].push(b);
        return;
      }
      const el = row[segStart[v.parts[0].seg]];
      nums[vi].push(el.k === 'num' ? el.v : el.k === 'raw' ? new DataView(el.buf.buffer, el.buf.byteOffset + el.off, 8).getFloat64(0, r.le) : NaN);
    });
    if (stringBytesTotal > MAX_INFLATED) throw new SavError('data.sav.tooBig', { max: 50 });
    nRead += 1;
  }
  if (nCases > 0 && nRead < nCases) throw new SavError('data.sav.truncated', { at: u8.length });

  // ---- decode
  const decodeText = (b) => decoder.decode(b);
  // Before the encoding is settled from the strings themselves, check every string byte is UTF-8.
  if (!decoder) {
    const all = [];
    for (const col of strs) for (const b of col) all.push(b);
    for (const s of segs) if (s.label) all.push(s.label);
    for (const set of labelSets) for (const l of set.labels) all.push(l.text);
    for (const b of all) {
      if (!validUtf8(b)) throw new SavError('data.sav.encodingUnknown', { name: ext.codePage == null ? '' : String(ext.codePage) });
    }
    decoder = new TextDecoder('utf-8');
    encoding = 'utf-8';
  }

  // measure levels (7.11): 2 or 3 numbers per variable record, or per variable
  let measureAt = null;
  if (ext.measures) {
    const c = ext.measures.count;
    if (c && c % segs.length === 0 && [2, 3].includes(c / segs.length)) { const k = c / segs.length; measureAt = (v) => ext.measures.values[v.segIndex * k]; }
    else if (c && c % vars.length === 0 && [2, 3].includes(c / vars.length)) { const k = c / vars.length; measureAt = (v, i) => ext.measures.values[i * k]; }
  }
  const variables = vars.map((v, vi) => {
    const s = v.s;
    const fmtType = (s.print >>> 16) & 0xff;
    const fmtWidth = (s.print >>> 8) & 0xff;
    const fmtDec = s.print & 0xff;
    const fname = FORMAT_NAMES.get(fmtType) || 'F';
    const format = v.width > 255 ? `A${v.width}` : `${fname}${fmtWidth}${fmtDec ? `.${fmtDec}` : ''}`;
    const isDate = v.width === 0 && DATE_FORMATS.has(fmtType);
    const measure = measureAt ? MEASURES.get(measureAt(v, vi)) || 'unknown' : 'unknown';
    return {
      name: rtrim(longNames.get(v.shortName) ?? v.shortName).normalize('NFC'),
      shortName: v.shortName,
      label: s.label ? rtrim(decodeText(s.label)).normalize('NFC') : null,
      type: v.width === 0 ? 'numeric' : 'string',
      width: v.width,
      format,
      isDate,
      measure,
      valueLabels: [],
      userMissing: { values: [], range: null },
      _v: v,
    };
  });

  // value labels (records 3 and 4): the variables are named by their first element (1-based)
  const byDictIndex = new Map(variables.map((x) => [x._v.s.dictIndex, x]));
  for (const set of labelSets) {
    for (const idx of set.vars) {
      const x = byDictIndex.get(idx);
      if (!x) throw new SavError('data.sav.badRecord', { type: 4, at: 0 });
      for (const l of set.labels) {
        const value = x.type === 'numeric' ? valueText(new DataView(l.value.buffer, l.value.byteOffset, 8).getFloat64(0, r.le), x) : rtrim(decodeText(l.value));
        x.valueLabels.push({ value, label: decodeText(l.text).normalize('NFC') });
      }
    }
  }
  // long string value labels (7.21) and missing values (7.22), named by variable
  const byName = new Map();
  for (const x of variables) { byName.set(x.shortName, x); byName.set(x.name, x); }
  for (const rec of ext.longLabels) {
    const x = byName.get(rtrim(decodeText(rec.name)));
    if (!x) continue;
    for (const l of rec.labels) x.valueLabels.push({ value: rtrim(decodeText(l.value)), label: decodeText(l.label).normalize('NFC') });
  }
  for (const rec of ext.longMissing) {
    const x = byName.get(rtrim(decodeText(rec.name)));
    if (!x) continue;
    for (const b of rec.values) x.userMissing.values.push(rtrim(decodeText(b)));
  }
  // user-missing values from record 2
  for (const x of variables) {
    const s = x._v.s;
    if (!s.nMissing) continue;
    if (x.type === 'string') {
      for (const b of s.missing) x.userMissing.values.push(rtrim(decodeText(b)));
      continue;
    }
    const nums = s.missing.map((b) => new DataView(b.buffer, b.byteOffset, 8).getFloat64(0, r.le));
    const edge = (v) => (v === ext.lowest || v <= -Number.MAX_VALUE ? -Infinity : v === ext.highest || v >= Number.MAX_VALUE ? Infinity : v);
    if (s.nMissing > 0) x.userMissing.values = nums.map((v) => valueText(v, x));
    else {
      x.userMissing.range = [edge(nums[0]), edge(nums[1])];
      if (s.nMissing === -3) x.userMissing.values = [valueText(nums[2], x)];
    }
  }

  // ---- the cells, as text
  const n = nRead;
  const header = variables.map((x) => x.name);
  const columns = [];
  const conversions = [];
  for (const [vi, x] of variables.entries()) {
    const col = new Array(n);
    const labelOf = new Map(x.valueLabels.map((l) => [l.value, l.label]));
    let labelled = 0;
    let dates = 0;
    const exLabels = [];
    const exDates = [];
    for (let i = 0; i < n; i++) {
      if (x.type === 'string') {
        const t = rtrim(decodeText(strs[vi][i])).normalize('NFC');
        const lab = labelOf.get(t);
        if (lab !== undefined && t !== '') { labelled += 1; if (exLabels.length < 5) exLabels.push({ rowId: `r${i + 1}`, from: t, to: lab }); col[i] = lab; } else col[i] = t;
        continue;
      }
      const num = nums[vi][i];
      if (Number.isNaN(num) || num === ext.sysmis) { col[i] = ''; continue; }
      const text = valueText(num, x);
      const lab = labelOf.get(text);
      if (lab !== undefined) { labelled += 1; if (exLabels.length < 5) exLabels.push({ rowId: `r${i + 1}`, from: text, to: lab }); col[i] = lab; continue; }
      if (x.isDate) { dates += 1; if (exDates.length < 5) exDates.push({ rowId: `r${i + 1}`, from: numText(num), to: text }); }
      col[i] = text;
    }
    columns.push(col);
    const key = `c${columns.length}`;
    if (labelled) conversions.push({ column: key, kind: 'value-labels', count: labelled, examples: exLabels, needsAnswer: false, applied: true, questionId: null, key: 'data.sav.conv.valueLabels', params: { column: x.name, count: labelled } });
    if (dates) conversions.push({ column: key, kind: 'sav-date', count: dates, examples: exDates, needsAnswer: false, applied: true, questionId: null, key: 'data.sav.conv.dates', params: { column: x.name, count: dates, format: x.format } });
  }
  // A user-missing value is proposed as a missing code in the text the cell carries (its label when
  // labelled); for a range, every value in the data that falls inside it is proposed.
  variables.forEach((x, vi) => {
    const labelOf = new Map(x.valueLabels.map((l) => [l.value, l.label]));
    const codes = new Set(x.userMissing.values.map((t) => labelOf.get(t) ?? t));
    const range = x.userMissing.range;
    if (range && x.type === 'numeric') {
      // A Set (a list with includes() was O(k^2): 100,000 distinct values took 10 s), and at most
      // SAV_MAX_RANGE_CODES proposed codes; the rest are counted for the note (review round 1).
      const inRange = new Set();
      for (const num of nums[vi]) if (!Number.isNaN(num) && num !== ext.sysmis && num >= range[0] && num <= range[1]) inRange.add(num);
      const sorted = [...inRange].sort((a, b) => a - b);
      let left = 0;
      for (const num of sorted) {
        const t = valueText(num, x);
        const c = labelOf.get(t) ?? t;
        if (codes.has(c)) continue;
        if (codes.size >= SAV_MAX_RANGE_CODES) { left += 1; continue; }
        codes.add(c);
      }
      if (left) {
        x.userMissing.inRange = sorted.length;
        notes.push({ key: 'data.sav.note.rangeCodes', params: { column: x.name, count: sorted.length, shown: SAV_MAX_RANGE_CODES } });
      }
    }
    x.userMissing.codes = [...codes];
    delete x._v;
  });

  const rowIds = Array.from({ length: n }, (_, i) => `r${i + 1}`);
  /** @type {import('../runtime/types.js').RawTable} */
  const raw = {
    header, columns, rowIds, rowCount: n,
    source: { fileName: '', bytes: u8.length, sha256: '', encoding: /** @type {any} */ (encoding), format: /** @type {any} */ ('sav'), sheet: null, headerRow: 0, importedAt: new Date().toISOString() },
  };
  return {
    raw, variables, encoding, encodingFrom, compression, conversions, notes,
    fileLabel: rtrim(decoder.decode(fileLabelBytes)).normalize('NFC'),
  };

  function valueText(num, x) {
    if (x.isDate) return isoFromDays(Math.floor(num / 86400) - SPSS_EPOCH_DAYS);
    return numText(num);
  }
}

function decoderLabel(name) {
  const n = name.toLowerCase();
  if (n === 'tis-620' || n === 'tis620' || n === 'cp874' || n === 'x-windows-874') return 'windows-874';
  return name;
}

function bytesText(b, decoder) {
  return decoder.decode(b);
}

/** "A=x\tB=y" (7.13) or "A=00900\0\tB=..." (7.14) into a Map. */
function parsePairs(text) {
  const out = new Map();
  for (const part of text.split(/[\t\u0000]+/)) {
    if (!part) continue;
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    out.set(part.slice(0, eq).trim(), part.slice(eq + 1));
  }
  return out;
}

function readExtension(subtype, size, count, data, le, ext, at) {
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const bad = () => { throw new SavError('data.sav.badRecord', { type: 7, at }); };
  switch (subtype) {
    case 3:
      if (size !== 4 || count !== 8) bad();
      ext.codePage = dv.getInt32(28, le);
      break;
    case 4:
      if (size !== 8 || count !== 3) bad();
      ext.sysmis = dv.getFloat64(0, le);
      ext.highest = dv.getFloat64(8, le);
      ext.lowest = dv.getFloat64(16, le);
      break;
    case 11: {
      if (size !== 4) bad();
      const values = [];
      for (let i = 0; i < count; i++) values.push(dv.getInt32(i * 4, le));
      ext.measures = { values, count };
      break;
    }
    case 13: ext.longNames = data; break;
    case 14: ext.veryLong = data; break;
    case 20: ext.encoding = data; break;
    case 21: {
      const rr = sub(data, le);
      while (rr.left() > 0) {
        const name = rr.bytes(rr.i32());
        rr.i32(); // width
        const n = rr.i32();
        if (n < 0 || n > rr.left() / 8) bad();
        const labels = [];
        for (let i = 0; i < n; i++) {
          const value = rr.bytes(checkLen(rr.i32(), rr, bad));
          const label = rr.bytes(checkLen(rr.i32(), rr, bad));
          labels.push({ value, label });
        }
        ext.longLabels.push({ name, labels });
      }
      break;
    }
    case 22: {
      const rr = sub(data, le);
      while (rr.left() > 0) {
        const name = rr.bytes(checkLen(rr.i32(), rr, bad));
        rr.need(1);
        const n = rr.u8[rr.pos];
        rr.pos += 1;
        if (n > 3) bad();
        const len = rr.i32();
        if (len !== 8) bad();
        const values = [];
        for (let i = 0; i < n; i++) values.push(rr.bytes(len));
        ext.longMissing.push({ name, values });
      }
      break;
    }
    default:
      break;
  }
}

function sub(data, le) {
  const rr = new Reader(data, 0);
  rr.le = le;
  return rr;
}

function checkLen(n, rr, bad) {
  if (n < 0 || n > rr.left()) bad();
  return n;
}

/** Elements of an uncompressed file: 8 raw bytes each. */
function rawStream(u8, start, elements, nCases) {
  let pos = start;
  return {
    next() {
      if (pos + 8 > u8.length) {
        if (pos < u8.length && nCases < 0) throw new SavError('data.sav.truncated', { at: pos });
        return null;
      }
      const el = { k: 'raw', off: pos, buf: u8 };
      pos += 8;
      return el;
    },
  };
}

/**
 * Elements of a bytecode-compressed stream: a block of eight one-byte codes, then the 8-byte values
 * the codes 253 ask for. 0 is padding, 1..251 the number code - bias, 252 the end of the data, 253 the
 * next 8 raw bytes, 254 eight spaces, 255 the system-missing value.
 */
function bytecodeStream(u8, start, end, bias) {
  let pos = start;
  let codes = null;
  let ci = 8;
  let done = false;
  const buf = u8;
  return {
    next() {
      for (;;) {
        if (done) return null;
        if (ci >= 8) {
          if (pos >= end) { done = true; return null; }
          if (pos + 8 > end) throw new SavError('data.sav.truncated', { at: pos });
          codes = buf.subarray(pos, pos + 8);
          pos += 8;
          ci = 0;
        }
        const c = codes[ci++];
        if (c === 0) continue;
        if (c === 252) { done = true; return null; }
        if (c === 253) {
          if (pos + 8 > end) throw new SavError('data.sav.truncated', { at: pos });
          const el = { k: 'raw', off: pos, buf };
          pos += 8;
          return el;
        }
        if (c === 254) return { k: 'spaces' };
        if (c === 255) return { k: 'sysmis' };
        return { k: 'num', v: c - bias };
      }
    },
  };
}

/** Inflate every zlib block of a .zsav into one bytecode stream, checking sizes against the trailer. */
function inflateZsav(r) {
  const zheaderAt = r.pos;
  const zheaderOfs = r.i64();
  const ztrailerOfs = r.i64();
  const ztrailerLen = r.i64();
  if (zheaderOfs !== zheaderAt || ztrailerOfs < r.pos || ztrailerOfs + ztrailerLen > r.u8.length) throw new SavError('data.sav.badZlib', { at: zheaderAt });
  const t = new Reader(r.u8, ztrailerOfs);
  t.le = r.le;
  t.f64(); // bias, as in the header
  t.i64(); // zero
  const blockSize = t.i32();
  const nBlocks = t.i32();
  if (blockSize <= 0 || nBlocks < 0 || ztrailerLen !== 24 + 24 * nBlocks) throw new SavError('data.sav.badZlib', { at: ztrailerOfs });
  const blocks = [];
  let total = 0;
  for (let i = 0; i < nBlocks; i++) {
    const uofs = t.i64();
    const cofs = t.i64();
    const usize = t.i32();
    const csize = t.i32();
    // zlib cannot expand data more than about 1032 to 1, so a block that claims more is damaged
    if (usize < 0 || usize > blockSize || csize < 0 || usize > csize * 1100 + 64 || cofs < r.pos || cofs + csize > ztrailerOfs) throw new SavError('data.sav.badZlib', { at: ztrailerOfs });
    total += usize;
    if (total > MAX_INFLATED) throw new SavError('data.sav.tooBig', { max: 50 });
    blocks.push({ uofs, cofs, usize, csize });
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const b of blocks) {
    let chunk;
    try {
      chunk = unzlibSync(r.u8.subarray(b.cofs, b.cofs + b.csize), new Uint8Array(b.usize));
    } catch {
      throw new SavError('data.sav.badZlib', { at: b.cofs });
    }
    if (chunk.length !== b.usize) throw new SavError('data.sav.badZlib', { at: b.cofs });
    out.set(chunk, o);
    o += b.usize;
  }
  return out;
}

/** The bytes of one string variable in one case, segments joined, padding cut. */
function stringBytes(row, v, segs, segStart) {
  const parts = [];
  let total = 0;
  for (const p of v.parts) {
    const s = segs[p.seg];
    const bytes = new Uint8Array(s.elems * 8);
    for (let e = 0; e < s.elems; e++) {
      const el = row[segStart[p.seg] + e];
      if (el.k === 'raw') bytes.set(el.buf.subarray(el.off, el.off + 8), e * 8);
      else if (el.k === 'spaces') bytes.fill(0x20, e * 8, e * 8 + 8);
      else throw new SavError('data.sav.badRecord', { type: 2, at: 0 });
    }
    parts.push(bytes.subarray(0, p.used));
    total += p.used;
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const b of parts) { out.set(b, o); o += b.length; }
  return out;
}


let strictUtf8 = null;
function validUtf8(b) {
  if (!strictUtf8) strictUtf8 = new TextDecoder('utf-8', { fatal: true });
  try {
    strictUtf8.decode(b);
    return true;
  } catch {
    return false;
  }
}
