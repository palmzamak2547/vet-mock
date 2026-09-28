// Review round 7: a covariate label that names its unit in brackets read "Age (months) per 1 unit"; a bracket ended a
// line or stood alone and a line could start with a following vowel; Bland-Altman panels at 85 mm x 2 collapsed.
// Data: made-up labels and values. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapWords } from '../../src/workspace/charts/frame.js';
import { buildChart } from '../../src/workspace/charts/model.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import workspace from '../../src/i18n/workspace.js';
import models from '../../src/i18n/models.js';
import terms from '../../src/i18n/terms.js';
import graphs from '../../src/i18n/graphs.js';
import { valueLabel } from '../../src/workspace/lib/result-model.js';

for (const [a, m] of Object.entries({ workspace, models, terms, graphs })) registerArea(a, m);

test('a label that names its unit in brackets gives that unit once, singular in English', () => {
  const codebook = { columns: [{ key: 'age', type: 'continuous', unit: null, labelTh: 'อายุ (เดือน)', labelEn: 'Age (months)' }] };
  const cases = { th: 'อายุ ต่อ 1 เดือน', en: 'Age per 1 month' };
  for (const lang of ['th', 'en']) {
    const t = (k, p) => translate(lang, k, p);
    const words = { codebook, columnName: () => (lang === 'th' ? 'อายุ (เดือน)' : 'Age (months)'), levelName: (_c, v) => v, spec: { method: 'reg.logistic', roles: {} } };
    const or = valueLabel('oddsRatio:age', t, 'reg.logistic', words);
    assert.ok(or.includes(cases[lang]), or);
    assert.ok(!or.includes('(') || !or.includes(t('ws.term.unit')), `no second unit: ${or}`);
  }
});

const FOLLOWING = new Set([0x0e30, 0x0e32, 0x0e33, 0x0e45]);
test('a bracket stays with its word and no line starts with a following vowel', () => {
  for (const s of ['อุณหภูมิทางหู (อินฟราเรด)', 'จำนวนวันที่ติดตาม (วัน)', 'สัปดาห์หลังหย่านม', 'เหลืองอ่อน']) {
    for (let room = 20; room <= 120; room += 3) {
      const ls = wrapWords(s, room, 11);
      for (const l of ls) {
        assert.ok(!l.endsWith('(') && l !== ')', `"${l}" in ${JSON.stringify(ls)} at ${room}`);
        assert.ok(!FOLLOWING.has(l.codePointAt(0)), `"${l}" starts with a following vowel at ${room}`);
      }
    }
  }
});

test('a Bland-Altman panel at 40 mm keeps its plot wide and every label inside', () => {
  const points = Array.from({ length: 20 }, (_, i) => ({ mean: 37.5 + (i % 7) * 0.2, diff: ((i % 5) - 2) * 0.1 }));
  const input = {
    points, bias: { value: 0.02, lo: -0.03, hi: 0.07 }, lower: { value: -0.41, lo: -0.5, hi: -0.32 }, upper: { value: 0.45, lo: 0.36, hi: 0.54 },
    xTitle: 'ค่าเฉลี่ยของสองวิธี (องศาเซลเซียส)', yTitle: 'อุณหภูมิทางหู (อินฟราเรด) ลบ อุณหภูมิทางทวารหนัก (ดิจิทัล)', level: 0.95,
  };
  for (const lang of ['th', 'en']) {
    const t = (k, p) => translate(lang, k, p);
    const m = buildChart('blandAltman', input, { widthMm: 40, lang, t });
    // the reference line at 0 spans the plot; tick marks share its stroke but are short
    const plotW = m.marks.filter((n) => n && n.t === 'line' && n.a.stroke === 'soft').reduce((w, n) => Math.max(w, Number(n.a.x2) - Number(n.a.x1)), 0);
    assert.ok(plotW >= m.width * 0.4, `plot width ${plotW} of ${m.width}`);
    for (const n of m.marks.filter((x) => x && x.t === 'text' && !x.a.transform)) {
      assert.ok(Number(n.a.x) >= -0.01 && Number(n.a.x) <= m.width + 0.01, `"${n.text}" at ${n.a.x} of ${m.width}`);
    }
  }
});
