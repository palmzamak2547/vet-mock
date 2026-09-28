// Review round 3 (copy, ui): the regression forest (logistic OR, Poisson IRR) ran each long term label under the
// row's marker at every width, drew every term as a pooled-estimate diamond and carried the Mantel-Haenszel note
// about strata and a pooled diamond. Checked on the kit's model: every label line ends left of the row's marks,
// terms are squares with an interval, the note is the regression one and the empty note column is gone.
// Data: made-up (the calf-survival example's term labels). OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { textWidth } from '../../src/workspace/charts/scale.js';
import * as F from '../../src/lib/stats/format.js';
import { translate, registerArea } from '../../src/i18n/index.js';
import graphs from '../../src/i18n/graphs.js';
import ws from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';

for (const [a, d] of Object.entries({ graphs, workspace: ws, terms })) registerArea(a, d);
const fmt = { formatNumber: F.formatNumber, formatP: F.formatP, formatCi: F.formatCi };

const ROWS = {
  th: [
    { label: 'เวลาที่ได้นมน้ำเหลืองครั้งแรก: หลัง 6 ชั่วโมง เทียบกับ ภายใน 6 ชั่วโมงหลังคลอด', est: 3.11, lo: 1.1, hi: 8.8, kind: 'term' },
    { label: 'เพศ: เมีย เทียบกับ ผู้', est: 0.8, lo: 0.3, hi: 2.1, kind: 'term' },
    { label: 'น้ำหนักแรกเกิด (กิโลกรัม)', est: 1.03, lo: 0.95, hi: 1.12, kind: 'term' },
  ],
  en: [
    { label: 'First colostrum: After 6 hours vs Within 6 hours of birth', est: 3.11, lo: 1.1, hi: 8.8, kind: 'term' },
    { label: 'Sex: Female vs Male', est: 0.8, lo: 0.3, hi: 2.1, kind: 'term' },
    { label: 'Birth weight (kg)', est: 1.03, lo: 0.95, hi: 1.12, kind: 'term' },
  ],
};

for (const lang of ['th', 'en']) {
  const t = (k, p) => translate(lang, k, p);
  for (const widthMm of [84, 120, 140, 174]) {
    test(`${lang} ${widthMm} mm: every regression term label ends left of its marks, squares not diamonds`, () => {
      const m = buildChart('forest', { rows: ROWS[lang], measure: 'OR', xTitle: 'OR', level: 0.95, log: true }, { widthMm, lang, t, fmt });
      const fs = Number(m.fontSize);
      const rects = m.marks.filter((n) => n && n.t === 'rect' && n.a.fill === 'ink');
      assert.equal(rects.length, 3, 'one square per term');
      const minMark = Math.min(...rects.map((r) => Number(r.a.x)), ...m.marks.filter((n) => n && n.t === 'line' && n.a.stroke === 'ink').map((l) => Math.min(Number(l.a.x1), Number(l.a.x2))));
      const labels = m.marks.filter((n) => n && n.t === 'text' && Number(n.a.x) === 0);
      for (const l of labels) {
        const size = Number(l.a['font-size'] ?? fs);
        const right = textWidth(l.text, size);
        // a label line, or the interval text under it on a narrow chart, never reaches the plot marks
        assert.ok(right < minMark, `"${l.text}" ends at ${right.toFixed(1)}, marks start at ${minMark.toFixed(1)}`);
      }
      // the whole label is printed (joined lines hold every word)
      const all = labels.map((l) => l.text).join(' ');
      for (const r of ROWS[lang]) for (const w of r.label.split(' ')) assert.ok(all.includes(w.replace(/-$/, '')) || all.includes(w.slice(0, 3)), `${w} missing`);
      // no pooled diamond: no closed path filled like a summary
      assert.ok(!m.marks.some((n) => n && n.t === 'path' && /Z$/.test(n.a.d) && n.a.fill === 's0'), 'no diamond');
      assert.ok(!m.marks.some((n) => n && n.t === 'text' && n.a['font-weight'] === 600), 'no bold summary rows');
    });
  }

  test(`${lang}: the regression forest has its own note and no empty note column`, () => {
    const m = buildChart('forest', { rows: ROWS[lang], measure: 'OR', xTitle: 'OR', level: 0.95, log: true }, { widthMm: 174, lang, t, fmt });
    const note = m.notes.join(' ');
    assert.ok(!/stratum|per stratum|ข้าวหลามตัด|diamond/.test(note), note);
    assert.ok(note.includes('OR'), note);
    assert.equal(m.table.columns.length, 3);
    assert.ok(m.table.rows.every((r) => r.length === 3));
  });
}
