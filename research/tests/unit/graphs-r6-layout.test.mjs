// Review round 5 (copy, minor): at 85 mm with two panels a row, labels broke mid-word. English words were cut
// at graphemes ('Da / ys / fo ll ow ed'), a number left its unit ('หลัง 6 / ชั่วโมง') and ICU's 'หลังค|ลอด'
// printed as 'ชั่วโมงหลังค / ลอด'. Data: made-up labels. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapWords } from '../../src/workspace/charts/frame.js';

test('a word without Thai letters is never broken, even when it is wider than the room', () => {
  for (const room of [12, 20, 30]) {
    const ls = wrapWords('Days followed', room, 11);
    assert.deepEqual(ls, ['Days', 'followed']);
  }
});

test('a number stays with the word after it when the pair fits', () => {
  assert.deepEqual(wrapWords('หลัง 6 ชั่วโมง', 40, 11), ['หลัง 6', 'ชั่วโมง']);
  assert.ok(wrapWords('น้ำหนักที่เพิ่มขึ้นใน 21 วัน', 55, 11).some((l) => /21 วัน/.test(l)));
});

test('Thai cluster initials go with their word (หลัง|คลอด, not หลังค|ลอด)', () => {
  const ls = wrapWords('ชั่วโมงหลังคลอด', 40, 11);
  assert.equal(ls.join(''), 'ชั่วโมงหลังคลอด');
  assert.ok(!ls.some((l) => /ค$/.test(l)), JSON.stringify(ls));
  assert.ok(ls.includes('คลอด'), JSON.stringify(ls));
});

test('scroll cue: a scroller names the side that still hides columns', async () => {
  const { moreSides } = await import('../../src/workspace/lib/scroll-cue.js');
  assert.equal(moreSides({ scrollWidth: 524, clientWidth: 524, scrollLeft: 0 }), '');
  assert.equal(moreSides({ scrollWidth: 1046, clientWidth: 524, scrollLeft: 0 }), 'right');
  assert.equal(moreSides({ scrollWidth: 1046, clientWidth: 524, scrollLeft: 200 }), 'both');
  assert.equal(moreSides({ scrollWidth: 1046, clientWidth: 524, scrollLeft: 522 }), 'left');
});

test('a value of a model term has one pair of brackets at most, and the gloss is not repeated per row', async () => {
  const { registerArea, translate } = await import('../../src/i18n/index.js');
  const { valueLabel } = await import('../../src/workspace/lib/result-model.js');
  for (const [a, m] of Object.entries({ workspace: (await import('../../src/i18n/workspace.js')).default, models: (await import('../../src/i18n/models.js')).default, terms: (await import('../../src/i18n/terms.js')).default })) registerArea(a, m);
  const t = (k, p) => translate('th', k, p);
  const words = { columnName: (k) => (k === 'c2' ? 'เวลาที่ได้นม' : k), levelName: (_c, v) => v };
  const intercept = valueLabel('b:(Intercept)', t, 'reg.logistic', words);
  assert.ok(!/\([^()]*\(/.test(intercept), `no nested brackets: "${intercept}"`);
  const or = valueLabel('oddsRatio:sex', t, 'reg.logistic', words);
  assert.ok(!or.includes('อัตราส่วนออดส์'), `the gloss is not on every row: "${or}"`);
  assert.equal((or.match(/\(/g) || []).length <= 1, true, or);
  const irr = valueLabel('rateRatio:sex', t, 'reg.poisson', words);
  assert.ok(/^IRR/.test(irr), irr);
});
