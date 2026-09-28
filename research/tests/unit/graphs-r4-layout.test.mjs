// Review round 4 (copy, ui): Thai forest row labels were cut with a dash and lost the rest of the word on phones
// and in single-column figures, because a Thai column name has no spaces and the last-resort cut dropped what
// did not fit ("เวลาที่ได้นมน้ำเหลือ-" with "งครั้งแรก:" gone). The squares also grew with the label, so the
// least precise term was drawn the largest. And the two-way ANOVA cell-means figure carried the repeated-measures
// note ("means at each time", "faint lines are the individual animals") though it has neither.
// Data: made-up (the calf-survival example's term labels). OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { wrapWords } from '../../src/workspace/charts/frame.js';
import { textWidth } from '../../src/workspace/charts/scale.js';
import { extraCharts } from '../../src/workspace/lib/chart-inputs.js';
import * as F from '../../src/lib/stats/format.js';
import { translate, registerArea } from '../../src/i18n/index.js';
import graphs from '../../src/i18n/graphs.js';
import ws from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';

for (const [a, d] of Object.entries({ graphs, workspace: ws, terms })) registerArea(a, d);
const fmt = { formatNumber: F.formatNumber, formatP: F.formatP, formatCi: F.formatCi };
const squeeze = (s) => String(s).replace(/\s+/g, '');

const TH = [
  { label: 'เวลาที่ได้นมน้ำเหลืองครั้งแรก: หลัง 6 ชั่วโมง เทียบกับ ภายใน 6 ชั่วโมง', est: 3.11, lo: 1.13, hi: 9.25, kind: 'term' },
  { label: 'เพศ: เมีย เทียบกับ ผู้', est: 0.8, lo: 0.3, hi: 2.1, kind: 'term' },
  { label: 'น้ำหนักแรกเกิดของลูกโคที่ชั่งภายในยี่สิบสี่ชั่วโมงหลังคลอด', est: 1.03, lo: 0.95, hi: 1.12, kind: 'term' },
];

const t = (k, p) => translate('th', k, p);
for (const size of [{ width: 320 }, { width: 390 }, { widthMm: 85 }, { widthMm: 84 }]) {
  test(`th ${JSON.stringify(size)}: every Thai term label is printed whole, no dash, no stranded leading vowel`, () => {
    const m = buildChart('forest', { rows: TH, measure: 'OR', xTitle: 'OR', level: 0.95, log: true }, { ...size, lang: 'th', t, fmt });
    const labels = m.marks.filter((n) => n && n.t === 'text' && Number(n.a.x) === 0).map((n) => n.text);
    const joined = squeeze(labels.join(''));
    for (const r of TH) assert.ok(joined.includes(squeeze(r.label)), `"${r.label}" printed whole in ${JSON.stringify(labels)}`);
    for (const l of labels) {
      assert.ok(!/-$/.test(l), `no dash cut: "${l}"`);
      assert.ok(!/[เ-ไ]$/.test(l), `no line ends on a leading vowel: "${l}"`);
      assert.ok(!/^[ัิ-ฺ็-๎]/.test(l), `no line starts with a mark: "${l}"`);
    }
    const squares = m.marks.filter((n) => n && n.t === 'rect' && n.a.fill === 'ink');
    assert.equal(squares.length, 3);
    assert.equal(new Set(squares.map((q) => Number(q.a.width).toFixed(3))).size, 1, 'one square size for every term');
    assert.equal(m.table.columns[0], 'ปัจจัย');
  });
}

test('wrapWords keeps every character, breaks Thai at word boundaries and fits the room', () => {
  const s = 'เวลาที่ได้นมน้ำเหลืองครั้งแรก: หลัง 6 ชั่วโมง';
  for (const room of [30, 55, 80, 140]) {
    const ls = wrapWords(s, room, 11);
    assert.equal(squeeze(ls.join('')), squeeze(s));
    for (const l of ls) assert.ok(textWidth(l, 11) <= room + 1e-9, `"${l}" fits ${room}`);
  }
  assert.deepEqual(wrapWords('Birth weight (kg)', 60, 11).join(' '), 'Birth weight (kg)');
});

test('two-way ANOVA cell means: its own note and column head, no time course, no animal lines', () => {
  const env = {
    status: 'ok', method: { id: 'anova.twoWay' },
    spec: { method: 'anova.twoWay', roles: { outcome: 'y', group: 'diet', factorB: 'sex' }, options: { confLevel: 0.95 } },
    values: {}, tests: [],
    tables: [{ id: 'cellMeans', columns: ['levelA', 'levelB', 'n', 'mean', 'sd', 'lower', 'upper'], rows: [['A', 'M', 4, 10, 1, 8.4, 11.6], ['A', 'F', 4, 11, 1, 9.4, 12.6], ['B', 'M', 4, 12, 1, 10.4, 13.6], ['B', 'F', 4, 14, 1, 12.4, 15.6]] }],
  };
  for (const lang of ['th', 'en']) {
    const tl = (k, p) => translate(lang, k, p);
    const spec = extraCharts(env, (k) => ({ y: 'weight', diet: 'diet', sex: 'sex' }[k]), (k, v) => v, tl).find((c) => c.id === 'cellMeans');
    const m = buildChart(spec.kind, spec.input, { widthMm: 174, lang, t: tl, fmt });
    const note = m.notes.join(' ');
    assert.ok(!/animal|สัตว์แต่ละตัว|each time|แต่ละเวลา/.test(note), `${lang}: ${note}`);
    assert.equal(m.table.columns[1], 'sex');
  }
});

test('a time course names the faint animal lines only when they are drawn', () => {
  const input = { times: ['0', '1'], series: [{ label: 'g', points: [{ time: 0, mean: 1, lo: 0.5, hi: 1.5 }, { time: 1, mean: 2, lo: 1.5, hi: 2.5 }] }], level: 0.95 };
  const en = (k, p) => translate('en', k, p);
  const bare = buildChart('timeCourse', input, { widthMm: 174, lang: 'en', t: en, fmt });
  assert.ok(!/faint/.test(bare.notes.join(' ')));
  const drawn = buildChart('timeCourse', { ...input, animals: [{ series: 0, values: [1.1, 2.2] }] }, { widthMm: 174, lang: 'en', t: en, fmt });
  assert.ok(/faint/.test(drawn.notes.join(' ')));
});
