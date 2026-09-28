// Shared by the report role's export tests (not a test file itself): the dictionaries as one `t`, a
// strict small XML parser, a real PNG writer and sample saved analyses. OWNER: report role.
import { zlibSync } from 'fflate';
import { crc32 } from '../../src/lib/export/png.js';
import common from '../../src/i18n/common.js';
import terms from '../../src/i18n/terms.js';
import ws from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import runtime from '../../src/i18n/runtime.js';
import stats from '../../src/i18n/stats.js';
import epi from '../../src/i18n/epi.js';
import intake from '../../src/i18n/intake.js';
import lab from '../../src/i18n/lab.js';
import models from '../../src/i18n/models.js';
import measure from '../../src/i18n/measure.js';
import data from '../../src/i18n/data.js';
import { singularEn } from '../../src/i18n/index.js';

const DICTS = [common, terms, ws, report, runtime, stats, epi, intake, lab, models, measure, data];

/** `t` over every dictionary the report reads, filling {name} placeholders; a missing key prints [key]. */
export const tOf = (lang) => (key, params) => {
  let s;
  for (const d of DICTS) if (d[lang] && Object.prototype.hasOwnProperty.call(d[lang], key)) { s = d[lang][key]; break; }
  if (s === undefined) return `[${key}]`;
  if (!params) return s;
  const out = s.replace(/\{(\w+)\}/g, (m, n) => (params[n] === undefined ? m : String(params[n])));
  return lang === 'en' ? singularEn(out) : out;
};

const ENTITY = /^&(amp|lt|gt|quot|apos|#\d+|#x[0-9A-Fa-f]+);/;

/**
 * A strict XML parser for the test: one root, every tag closed in order, attributes quoted and unique,
 * only the five named entities and character references, no stray '<' or '&'. Throws on anything else.
 * @param {string} src
 * @returns {{ name: string, attrs: Record<string, string>, children: any[], text: string }}
 */
export function parseXml(src) {
  let i = 0;
  const s = src.replace(/^﻿/, '');
  const fail = (why) => { throw new Error(`xml: ${why} at ${i}: ${s.slice(i, i + 40)}`); };
  const decode = (raw) => {
    let out = '';
    for (let k = 0; k < raw.length; k += 1) {
      if (raw[k] === '&') {
        const m = ENTITY.exec(raw.slice(k));
        if (!m) fail(`bad entity in ${raw.slice(k, k + 12)}`);
        const e = m[1];
        out += e === 'amp' ? '&' : e === 'lt' ? '<' : e === 'gt' ? '>' : e === 'quot' ? '"' : e === 'apos' ? "'" : String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
        k += m[0].length - 1;
      } else if (raw[k] === '<') fail('< in text');
      else out += raw[k];
    }
    return out;
  };
  if (s.startsWith('<?xml')) { const e = s.indexOf('?>'); if (e < 0) fail('prolog'); i = e + 2; }
  const ws = () => { while (/\s/.test(s[i] || '')) i += 1; };
  const NAME = /^[A-Za-z_][\w.:-]*/;
  const element = () => {
    if (s[i] !== '<') fail('expected <');
    i += 1;
    const nm = NAME.exec(s.slice(i));
    if (!nm) fail('tag name');
    const node = { name: nm[0], attrs: {}, children: [], text: '' };
    i += nm[0].length;
    for (;;) {
      ws();
      if (s.startsWith('/>', i)) { i += 2; return node; }
      if (s[i] === '>') { i += 1; break; }
      const an = NAME.exec(s.slice(i));
      if (!an) fail('attribute name');
      i += an[0].length;
      ws();
      if (s[i] !== '=') fail('=');
      i += 1;
      ws();
      const q = s[i];
      if (q !== '"' && q !== "'") fail('quote');
      const end = s.indexOf(q, i + 1);
      if (end < 0) fail('unclosed attribute');
      if (Object.prototype.hasOwnProperty.call(node.attrs, an[0])) fail(`duplicate attribute ${an[0]}`);
      node.attrs[an[0]] = decode(s.slice(i + 1, end));
      i = end + 1;
    }
    for (;;) {
      const lt = s.indexOf('<', i);
      if (lt < 0) fail(`unclosed ${node.name}`);
      node.text += decode(s.slice(i, lt));
      i = lt;
      if (s.startsWith('</', i)) {
        i += 2;
        const cn = NAME.exec(s.slice(i));
        if (!cn || cn[0] !== node.name) fail(`close ${cn?.[0]} for ${node.name}`);
        i += cn[0].length;
        ws();
        if (s[i] !== '>') fail('>');
        i += 1;
        return node;
      }
      node.children.push(element());
    }
  };
  ws();
  const root = element();
  ws();
  if (i !== s.length) fail('content after the root');
  return root;
}

/** Every element under a node with the given name, depth first. */
export function findAll(node, name, out = []) {
  if (node.name === name) out.push(node);
  for (const c of node.children) findAll(c, name, out);
  return out;
}

/** The text of a node and all its descendants. */
export const textOf = (node) => node.text + node.children.map(textOf).join('');

/** A real RGB PNG of w x h pixels (all one colour), optionally without a pHYs chunk. */
export function makePng(w, h) {
  const chunk = (type, data) => {
    const out = new Uint8Array(12 + data.length);
    const v = new DataView(out.buffer);
    v.setUint32(0, data.length);
    for (let k = 0; k < 4; k += 1) out[4 + k] = type.charCodeAt(k);
    out.set(data, 8);
    v.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
  };
  const ihdr = new Uint8Array(13);
  const iv = new DataView(ihdr.buffer);
  iv.setUint32(0, w);
  iv.setUint32(4, h);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const raw = new Uint8Array(h * (1 + w * 3));
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) raw.set([30, 120, 90], y * (1 + w * 3) + 1 + x * 3);
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlibSync(raw)), chunk('IEND', new Uint8Array(0))];
  const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

export const CODEBOOK = {
  clusterKey: 'c4',
  columns: [
    { key: 'c1', name: 'animal_id', labelTh: 'รหัสสัตว์', labelEn: 'animal ID', type: 'id', levels: [] },
    { key: 'c2', name: 'elisa', labelTh: 'ผล ELISA', labelEn: 'ELISA result', type: 'binary', levels: [{ value: 'pos', labelTh: 'บวก', labelEn: 'positive' }, { value: 'neg', labelTh: 'ลบ', labelEn: 'negative' }], positive: 'pos' },
    { key: 'c3', name: 'vaccine', labelTh: 'ฉีดวัคซีน', labelEn: 'vaccinated', type: 'binary', levels: [{ value: 'yes', labelTh: 'ฉีด', labelEn: 'yes' }, { value: 'no', labelTh: 'ไม่ฉีด', labelEn: 'no' }], reference: 'no' },
    { key: 'c4', name: 'farm', labelTh: 'ฟาร์ม', labelEn: 'farm', type: 'nominal', levels: [{ value: 'F1', labelTh: '', labelEn: '' }, { value: 'F2', labelTh: '', labelEn: '' }] },
    { key: 'c5', name: 'owner phone', labelTh: 'เบอร์เจ้าของ', labelEn: 'owner phone', type: 'text', levels: [], pii: 'phone', hidden: true },
    { key: 'c6', name: 'weight kg', labelTh: 'น้ำหนัก', labelEn: 'weight', type: 'continuous', levels: [] },
  ],
};

/** A working table of five animals; r4 was excluded by step s3. */
export const TABLE = {
  rowIds: ['r1', 'r2', 'r3', 'r4', 'r5'],
  n: 5,
  excluded: { r4: 's3' },
  fingerprint: 'abcdef0123456789',
  columns: {
    c1: { key: 'c1', kind: 'text', values: ['A1', 'A2', 'A3', 'A4', 'A5'], missing: new Uint8Array(5) },
    c2: { key: 'c2', kind: 'category', levels: ['pos', 'neg'], values: new Int32Array([0, 1, 0, 1, -1]), missing: new Uint8Array([0, 0, 0, 0, 1]) },
    c3: { key: 'c3', kind: 'category', levels: ['yes', 'no'], values: new Int32Array([0, 0, 1, 1, 1]), missing: new Uint8Array(5) },
    c4: { key: 'c4', kind: 'category', levels: ['F1', 'F2'], values: new Int32Array([0, 0, 1, 1, 1]), missing: new Uint8Array(5) },
    c5: { key: 'c5', kind: 'text', values: ['081', '082', '083', '084', '085'], missing: new Uint8Array(5) },
    c6: { key: 'c6', kind: 'number', values: new Float64Array([412.5, 0.1 + 0.2, 380, NaN, -0]), missing: new Uint8Array([0, 0, 0, 1, 0]) },
  },
};

const prov = (methodId, extra = {}) => ({ methodId, options: {}, engineVersion: 'research-studio-m2-0.2.0', engineTier: 'A', rowsUsed: 3, rowsDropped: [{ reason: 'missing', column: 'c2', count: 1 }], dataFingerprint: 'abcdef0123456789', recipeRev: 3, computedAt: '2026-09-28T00:00:00Z', validatedAgainst: [], ...extra });

/** A 2x2 result (M1 shape) and a split-plot repeated-measures ANOVA result (M2 shape). */
export function sampleAnalyses() {
  const s1 = { specVersion: 1, method: 'epi.twoByTwo', input: { kind: 'dataset', datasetId: 'd1', recipeRev: 3 }, design: 'cross-sectional', roles: { outcome: 'c2', exposure: 'c3' }, levels: { outcomePositive: 'pos', exposureLevel: 'yes', referenceLevel: 'no' }, options: { confLevel: 0.95, orCi: 'woolf', rrCi: 'wald-log', rdCi: 'wald' }, cluster: { route: 'none', column: 'c4' } };
  const e1 = {
    envelopeVersion: 1, status: 'ok', method: { id: 'epi.twoByTwo', family: 'chisq', milestone: 'M1' }, spec: s1,
    values: { PR: { value: 2.1739214756712502, ci: [1.4691, 3.2167], ciLevel: 0.95 }, PD: { value: 0.12345, ci: [0.05, 0.2], ciLevel: 0.95 } },
    tests: [{ id: 'chisq', statistic: { name: 'X2', value: 16.3812 }, df: 1, p: 0.0000518, alternative: 'two.sided', variant: 'pearsonX2' }],
    tables: [{ id: 'counts', columns: ['row', 'positive', 'negative', 'total'], rows: [['exposed', 30, 70, 100], ['reference', 12, 88, 100]] }],
    guard: { stops: [], warnings: [], notes: [] }, provenance: prov('epi.twoByTwo', { validatedAgainst: ['r-4.6.0', 'serosurvey-numbers'] }), verified: true,
  };
  const s2 = { specVersion: 1, method: 'anova.repeated', input: { kind: 'dataset', datasetId: 'd1', recipeRev: 3 }, design: 'experiment', roles: { outcome: 'c6', subject: 'c1', time: 'c3', group: 'c4' }, levels: {}, options: { confLevel: 0.95, sphericity: 'gg', mauchly: true }, cluster: { route: 'none', column: null } };
  const e2 = {
    envelopeVersion: 1, status: 'ok', method: { id: 'anova.repeated', family: 'anovaRm', milestone: 'M2' }, spec: s2,
    values: { epsGG: { value: 0.61 }, epsHF: { value: 0.87 } },
    tests: [
      { id: 'group', statistic: { name: 'F', value: 4.3165098374679403 }, dfPair: [1, 6], p: 0.083007513791233611, alternative: 'two.sided', variant: 'none' },
      { id: 'time', statistic: { name: 'F', value: 134.61849710982574 }, dfPair: [3, 18], p: 1.619958068333379e-12, alternative: 'two.sided', variant: 'gg' },
      { id: 'groupTime', statistic: { name: 'F', value: 3.1734104046242431 }, dfPair: [3, 18], p: 0.085, alternative: 'two.sided', variant: 'gg' },
    ],
    tables: [],
    guard: { stops: [], warnings: [], notes: [] }, provenance: prov('anova.repeated'), verified: false,
  };
  return [
    { id: 'a1', spec: s1, envelope: e1, dataFingerprint: 'abcdef0123456789', createdAt: '2026-09-28T01:00:00Z' },
    { id: 'a2', spec: s2, envelope: e2, dataFingerprint: 'abcdef0123456789', createdAt: '2026-09-28T02:00:00Z' },
  ];
}

export const STEPS = [
  { id: 's1', seq: 1, kind: 'import-conversions', params: { perColumn: {} }, reason: null, at: '2026-09-28T00:00:00Z' },
  { id: 's2', seq: 2, kind: 'row-add', params: { rowId: 'r5', values: {} }, reason: null, at: '2026-09-28T00:00:00Z' },
  { id: 's3', seq: 3, kind: 'row-exclude', params: { rowId: 'r4', category: 'measurement-error' }, reason: 'ELISA plate read twice', at: '2026-09-28T00:00:00Z' },
];
