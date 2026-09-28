// Review round 2 (ui): a journal figure prints every group's name and no text below 7 pt. Thinning dropped
// "เสริมยีสต์ 0.1%" from the middle of a three-diet dot plot at 85 mm / 2 columns and 190 mm / 3 columns, and
// the axis-title fitter went down to 6 pt (Bland-Altman y title at 84 mm, the p-value function's x title,
// the pairwise panels of a composite). Checked on the kit's models: at print size the model's unit is the
// point, so a text mark's font-size is its printed size. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { withMadeUpNote } from '../../src/workspace/charts/render.js';
import { panelWidthMm } from '../../src/workspace/charts/figure.js';
import * as F from '../../src/lib/stats/format.js';
import { translate, registerArea } from '../../src/i18n/index.js';
import graphs from '../../src/i18n/graphs.js';
import ws from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';

for (const [a, d] of Object.entries({ graphs, workspace: ws, terms })) registerArea(a, d);
const fmt = { formatNumber: F.formatNumber, formatP: F.formatP, formatCi: F.formatCi };
const tTh = (k, p) => translate('th', k, p);

const DIETS = [
  { label: 'สูตรควบคุม', values: [212, 230, 198, 241, 225, 219, 208] },
  { label: 'เสริมยีสต์ 0.1%', values: [260, 281, 247, 270, 255, 266, 239] },
  { label: 'เสริมยีสต์ 0.2%', values: [240, 258, 233, 262, 251, 229, 247] },
];
const Y_TITLE = 'น้ำหนักที่เพิ่มขึ้นใน 21 วัน (กรัมต่อตัว)';
const LONG_X = 'ความต่างของ น้ำหนักที่เพิ่มขึ้นใน 21 วัน (กรัมต่อตัว) ระหว่างสูตรอาหาร';
const wr = [494, 395, 516, 434, 476, 557, 413, 442, 650, 433, 417, 656, 267, 478, 178, 423, 427];
const mw = [512, 430, 520, 428, 500, 600, 364, 380, 658, 445, 432, 626, 260, 477, 259, 350, 451];

const texts = (m) => m.marks.filter((n) => n && n.t === 'text');

test('every group name is printed under a band axis, at every journal width', () => {
  for (const [total, cols] of [[85, 2], [190, 3], [85, 1], [174, 2]]) {
    for (const kind of ['dot', 'box']) {
      const m = buildChart(kind, { groups: DIETS, yTitle: Y_TITLE, xTitle: 'สูตรอาหาร', center: 'mean', level: 0.95 }, { widthMm: panelWidthMm(total, cols), lang: 'th', t: tTh, fmt });
      const all = texts(m).map((n) => n.text).join(' | ');
      for (const g of DIETS) {
        const words = g.label.split(' ');
        assert.ok(words.every((w) => all.includes(w)), `${kind} ${total} mm / ${cols}: ${g.label} missing from ${all}`);
      }
    }
  }
});

test('no text in an 84/85 mm chart or a composite panel is smaller than 7 pt', () => {
  const cases = [
    ['blandAltman', { points: wr.map((a, i) => ({ mean: (a + mw[i]) / 2, diff: a - mw[i] })), bias: { value: -2.1, lo: -22, hi: 17.8 }, lower: { value: -78, lo: -112, hi: -43 }, upper: { value: 73.9, lo: 39, hi: 108 }, yTitle: 'อุณหภูมิทวารหนัก (เทอร์โมมิเตอร์ดิจิทัล) ลบ อุณหภูมิหู (อินฟราเรด)', xTitle: 'ค่าเฉลี่ยของสองวิธี' }],
    ['ciFunction', { est: 3.11, se: 0.53, label: 'odds ratio', xTitle: 'odds ratio (อัตราส่วนออดส์) ของเวลาที่ได้นมน้ำเหลืองครั้งแรก หลัง 6 ชั่วโมง เทียบกับ ภายใน 6 ชั่วโมงหลังคลอด' }],
    ['ci', { rows: [{ label: 'เสริมยีสต์ 0.1% ลบ สูตรควบคุม', est: 49.75, lo: -1.11, hi: 100.61 }, { label: 'เสริมยีสต์ 0.2% ลบ สูตรควบคุม', est: 30, lo: -5, hi: 65 }], ref: 0, log: false, xTitle: LONG_X, level: 0.95 }],
    ['dot', { groups: DIETS, yTitle: `${Y_TITLE} เฉลี่ยทั้งฝูงต่อวัน`, xTitle: 'สูตรอาหาร', center: 'mean', level: 0.95 }],
  ];
  for (const widthMm of [84, 85, panelWidthMm(85, 2), panelWidthMm(190, 3)]) {
    for (const [kind, input] of cases) {
      const m = withMadeUpNote(buildChart(kind, input, { widthMm, lang: 'th', t: tTh, fmt }), 'ข้อมูลสมมุติ');
      assert.equal(m.unit, 'pt');
      const small = texts(m).filter((n) => Number(n.a['font-size'] ?? m.fontSize) < 7 - 1e-9).map((n) => `${n.text} ${n.a['font-size']} pt`);
      assert.deepEqual(small, [], `${kind} at ${widthMm.toFixed(1)} mm`);
    }
  }
});
