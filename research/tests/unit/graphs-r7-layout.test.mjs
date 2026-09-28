// Review round 6 (copy, minors): at 85 mm the forest label น้ำหนักแรกเกิด printed as 'น้ำหนักแรกเกิ / ด' (a rule glued
// every short segment to its neighbour, so the whole name was one unit cut by letters), and on screen
// 'เวลาที่ได้นมน้ำ / เหลืองครั้งแรก' cut นมน้ำเหลือง; a numeric covariate's odds ratio did not say per what; the two-way
// ANOVA's cell means table headed its level columns 'ระดับของปัจจัยแรก' next to a chart that says 'สูตรอาหาร'.
// Data: made-up labels and values. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapWords, graphemes } from '../../src/workspace/charts/frame.js';
import { textWidth } from '../../src/workspace/charts/scale.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import workspace from '../../src/i18n/workspace.js';
import models from '../../src/i18n/models.js';
import terms from '../../src/i18n/terms.js';
import lab from '../../src/i18n/lab.js';
import { valueLabel } from '../../src/workspace/lib/result-model.js';
import { envTableText } from '../../src/workspace/report/result-words.js';

for (const [a, m] of Object.entries({ workspace, models, terms, lab })) registerArea(a, m);
const squeeze = (s) => s.replace(/\s+/g, '');

test('a Thai name too wide for the line breaks between its words, evenly: น้ำหนัก / แรกเกิด', () => {
  const s = 'น้ำหนักแรกเกิด';
  for (const f of [0.6, 0.7, 0.85]) assert.deepEqual(wrapWords(s, textWidth(s, 11) * f, 11), ['น้ำหนัก', 'แรกเกิด'], `at ${f}`);
});

test('no line is a lone letter, every line fits, and no character is lost', () => {
  const labels = ['น้ำหนักแรกเกิด', 'เวลาที่ได้นมน้ำเหลืองครั้งแรก', 'ชั่วโมงหลังคลอด', 'น้ำหนักที่เพิ่มขึ้นใน 21 วัน', 'ผล ชั่วโมงหลังคลอด 6 วัน'];
  for (const s of labels) {
    // a one-letter line is only ever a whole word (น้ำ, ที่), never a letter cut from one
    const words = new Set(Array.from(new Intl.Segmenter('th', { granularity: 'word' }).segment(s), (x) => x.segment));
    // from 28 px (about three Thai letters at 11 px); below that even a two-letter word such as เวลา must be cut
    for (let room = 28; room <= 140; room += 4) {
      const ls = wrapWords(s, room, 11);
      assert.equal(squeeze(ls.join('')), squeeze(s), `${s} at ${room}`);
      for (const l of ls) {
        assert.ok(graphemes(l.replace(/\s+/g, '')).length > 1 || words.has(l) || /^\d+$/.test(l), `"${l}" alone in ${JSON.stringify(ls)} at ${room}`);
        assert.ok(textWidth(l, 11) <= room + 1e-9 || !/\s/.test(l), `"${l}" is wider than ${room}`);
      }
    }
  }
});

test('น้ำ stays with the word after it when another break of the same count of lines fits', () => {
  const s = 'เวลาที่ได้นมน้ำเหลืองครั้งแรก';
  const room = textWidth('น้ำเหลืองครั้งแรก', 11) + 1;
  const ls = wrapWords(s, room, 11);
  assert.ok(!ls.slice(0, -1).some((l) => l.endsWith('น้ำ')), JSON.stringify(ls));
});

test('a word cut by letters shares its line with nothing', () => {
  assert.deepEqual(wrapWords('ชั่วโมงหลังคลอด', 26, 11), ['ชั่ว', 'โมง', 'หลัง', 'คลอด']);
  const ls = wrapWords('ผล ชั่วโมงหลังคลอด 6 วัน', 29, 11);
  assert.ok(ls.includes('ชั่ว') && ls.includes('โมง'), JSON.stringify(ls));
});

test('the effect of a number covariate is per one unit of it; a category term and the intercept are not', () => {
  const codebook = { columns: [
    { key: 'c3', type: 'continuous', unit: 'kg', labelTh: 'น้ำหนักแรกเกิด', labelEn: 'Birth weight' },
    { key: 'c4', type: 'continuous', unit: 'kg', labelTh: 'น้ำหนักแม่ (kg)', labelEn: 'Dam weight (kg)' },
    { key: 'c5', type: 'count', unit: null, labelTh: 'ลำดับท้อง', labelEn: 'Parity' },
    { key: 'c2', type: 'nominal', unit: null, labelTh: 'เพศ', labelEn: 'Sex' },
  ] };
  for (const lang of ['th', 'en']) {
    const t = (k, p) => translate(lang, k, p);
    const name = (k) => codebook.columns.find((c) => c.key === k)?.[lang === 'th' ? 'labelTh' : 'labelEn'] ?? k;
    const words = { codebook, columnName: name, levelName: (_c, v) => v, spec: { method: 'reg.logistic', roles: {} } };
    const per = lang === 'th' ? 'ต่อ 1' : 'per 1';
    const or3 = valueLabel('oddsRatio:c3', t, 'reg.logistic', words);
    assert.ok(or3.includes(`${name('c3')} ${per} kg`), or3);
    const or4 = valueLabel('oddsRatio:c4', t, 'reg.logistic', words);
    assert.ok(or4.includes(`${per} kg`) && !or4.includes('(kg)'), `the unit is said once: ${or4}`);
    const irr = valueLabel('rateRatio:c5', t, 'reg.poisson', { ...words, spec: { method: 'reg.poisson', roles: {} } });
    assert.ok(irr.includes(`${per} ${t('ws.term.unit')}`), irr);
    const b = valueLabel('b:c3', t, 'reg.logistic', words);
    assert.ok(b.includes(`${per} kg`), b);
    for (const other of ['oddsRatio:c2=M', 'b:(Intercept)']) assert.ok(!valueLabel(other, t, 'reg.logistic', words).includes(per), other);
  }
});

test('the cell means table heads its level columns with the factors’ names', () => {
  const table = { id: 'cellMeans', columns: ['levelA', 'levelB', 'n', 'mean', 'sd', 'lower', 'upper'], rows: [['A', 'M', 4, 10, 1, 8.4, 11.6]] };
  const spec = { method: 'anova.twoWay', roles: { outcome: 'y', group: 'diet', factorB: 'sex' } };
  for (const lang of ['th', 'en']) {
    const t = (k, p) => translate(lang, k, p);
    const names = lang === 'th' ? { diet: 'สูตรอาหาร', sex: 'เพศ' } : { diet: 'Diet', sex: 'Sex' };
    const tx = envTableText(table, t, { spec, columnName: (k) => names[k] ?? k });
    assert.deepEqual(tx.columns.slice(0, 2), [names.diet, names.sex], JSON.stringify(tx.columns));
  }
});
