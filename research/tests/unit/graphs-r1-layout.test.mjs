// Review round 1 (ui): chart text stays inside the drawing. The ROC legend carrying "AUC (95% CI ...)" was cut
// at the right edge at 84 mm and on screen; axis titles were cut at the edge of an 85 mm two-column figure
// panel and a rotated y title ran past the plot height; the M2 CI chart drew long labels over its bars.
// Checked on the kit's models with the kit's own text measure (scale.js textWidth). Also: every file of a
// chart of made-up data carries "made-up data". OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { withMadeUpNote, modelToSvg } from '../../src/workspace/charts/render.js';
import { composeFigure, panelWidthMm } from '../../src/workspace/charts/figure.js';
import { textWidth } from '../../src/workspace/charts/scale.js';
import * as F from '../../src/lib/stats/format.js';
import { translate, registerArea } from '../../src/i18n/index.js';
import graphs from '../../src/i18n/graphs.js';
import ws from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';

for (const [a, d] of Object.entries({ graphs, workspace: ws, terms })) registerArea(a, d);
const fmt = { formatNumber: F.formatNumber, formatP: F.formatP, formatCi: F.formatCi };
const tTh = (k, p) => translate('th', k, p);

/** Horizontal extent of every text mark, by its anchor, and whether it fits [0, width]. */
function overflows(model) {
  const out = [];
  for (const n of model.marks) {
    if (!n || n.t !== 'text' || n.a.transform) continue;
    const fs = Number(n.a['font-size']) || model.fontSize;
    const w = textWidth(n.text, fs);
    const x = Number(n.a.x);
    const anchor = n.a['text-anchor'] || 'start';
    const [lo, hi] = anchor === 'middle' ? [x - w / 2, x + w / 2] : anchor === 'end' ? [x - w, x] : [x, x + w];
    if (lo < -1 || hi > model.width + 1) out.push(`${n.text} [${lo.toFixed(1)}, ${hi.toFixed(1)}] of ${model.width}`);
  }
  return out;
}

/** Rotated titles no longer than the height they are centred in. */
function rotatedTooLong(model) {
  return model.marks.filter((n) => n && n.t === 'text' && /rotate\(-90/.test(n.a.transform || '')).filter((n) => textWidth(n.text, Number(n.a['font-size'])) > model.height).map((n) => n.text);
}

const LONG = 'ค่าที่อ่านได้จากชุดทดสอบเร็ว (0 ถึง 100) ที่ใช้ในฟาร์มทดลอง';
const roc = {
  curves: [{ label: LONG, auc: 0.922, aucLo: 0.861, aucHi: 0.983, points: [{ threshold: -Infinity, se: 1, sp: 0 }, { threshold: 30, se: 0.9, sp: 0.6 }, { threshold: 57.5, se: 0.735, sp: 0.982 }, { threshold: Infinity, se: 0, sp: 1 }], youden: [{ threshold: 57.5, se: 0.735, sp: 0.982 }] }],
  level: 0.95,
};

test('ROC: the legend with its AUC CI wraps inside the drawing at 84 mm and at a phone width', () => {
  for (const opts of [{ widthMm: 84 }, { width: 300 }, { width: 524 }]) {
    const m = buildChart('roc', roc, { ...opts, lang: 'th', t: tTh, fmt });
    assert.deepEqual(overflows(m), [], JSON.stringify(opts));
    const legendText = m.marks.filter((n) => n?.t === 'text').map((n) => n.text).join(' ');
    assert.ok(legendText.includes('0.983'), 'the upper CI bound is drawn');
  }
});

test('ROC table: each number under the column that names it', () => {
  const m = buildChart('roc', roc, { width: 524, lang: 'th', t: tTh, fmt });
  const youden = m.table.rows.filter((r) => /Youden/.test(r[1]));
  assert.equal(youden.length, 2);
  for (const r of youden) { assert.match(r[2], /%$/); assert.equal(r[3], null); }
});

test('pairwise differences in an 85 mm two-column figure: titles fit their panel', () => {
  const pairs = { rows: [{ label: 'สูตรเสริม ลบ สูตรควบคุม', est: 5.67, lo: 2.46, hi: 8.87 }, { label: 'สูตรเข้มข้น ลบ สูตรควบคุม', est: 3, lo: -0.1, hi: 6.1 }], ref: 0, log: false, xTitle: 'ความต่างของ น้ำหนักที่เพิ่มขึ้นใน 21 วัน (กรัมต่อตัว)', level: 0.95 };
  const dots = { groups: [{ label: 'สูตรควบคุม', values: [20, 22, 24] }, { label: 'สูตรเสริม', values: [26, 28, 30] }], yTitle: 'น้ำหนักที่เพิ่มขึ้นใน 21 วัน (กรัมต่อตัวต่อวันเฉลี่ยทั้งฝูง)', xTitle: 'สูตรอาหาร', center: 'mean', level: 0.95 };
  const w = panelWidthMm(85, 2);
  const models = [buildChart('ci', pairs, { widthMm: w, lang: 'th', t: tTh, fmt }), buildChart('dot', dots, { widthMm: w, lang: 'th', t: tTh, fmt })];
  for (const m of models) {
    assert.deepEqual(overflows(m), [], m.kind);
    assert.deepEqual(rotatedTooLong(m), [], m.kind);
  }
  assert.ok(composeFigure(models, { columns: 2, widthMm: 85, labels: true }).svg.length > 0);
});

test('files of made-up data say so: one chart and a composed figure', () => {
  const m = buildChart('roc', roc, { widthMm: 84, lang: 'th', t: tTh, fmt });
  const noted = withMadeUpNote(m, 'ข้อมูลสมมุติ');
  assert.ok(noted.height > m.height && noted.heightMm > m.heightMm);
  assert.ok(modelToSvg(noted).includes('ข้อมูลสมมุติ'));
  assert.ok(!modelToSvg(m).includes('ข้อมูลสมมุติ'));
  const fig = composeFigure([m, m], { columns: 2, widthMm: 174, labels: true, madeUpNote: 'made-up data' });
  assert.ok(fig.svg.includes('made-up data'));
});
