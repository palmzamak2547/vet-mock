// Review round 5 (ui): Thai y titles lost their tone marks in every saved figure. A rotated line's glyphs reach
// up to ROTATED_REACH em from its baseline (ที่ and ขึ้น stack a tone mark on an upper vowel), and the title sat
// 0.9 em from the edge, so 'น้ำหนักที่เพิ่มขึ้น' printed as 'ขึน'. The estimation plot's right-hand label, rotated
// the other way, sat 0.6 em from its edge. These pin the reach inside the figure and clear of the tick labels.
// Data: made-up. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { ROTATED_REACH } from '../../src/workspace/charts/frame.js';
import { textWidth } from '../../src/workspace/charts/scale.js';

const DESCENT = 0.4; // Thai lower vowels (ุ ู) below the baseline, in em
const groups = [
  { label: 'กลุ่มที่หนึ่ง', values: [412, 398, 455, 430, 401, 388, 420] },
  { label: 'กลุ่มที่สอง', values: [460, 472, 449, 481, 455, 468, 490] },
];
const TITLES = ['น้ำหนักที่เพิ่มขึ้นใน 21 วัน (กรัม)', 'น้ำหนักตัวที่เพิ่มขึ้นในช่วงยี่สิบเอ็ดวันหลังเริ่มให้อาหารสูตรใหม่ที่ขึ้นทะเบียนแล้ว (กรัม)'];
const SIZES = [{ width: 320 }, { width: 390 }, { width: 560 }, { widthMm: 84 }, { widthMm: 85 }, { widthMm: 174 }, { widthMm: 84, fontPt: 7 }, { widthMm: 84, fontPt: 9 }, { widthMm: 84, height: 90 }];

function rotated(m) {
  return m.marks.filter((n) => n && n.t === 'text' && /rotate\(/.test(n.a.transform || '')).map((n) => {
    const [, ang] = /rotate\((-?\d+)/.exec(n.a.transform);
    return { ang: Number(ang), x: Number(n.a.x), y: Number(n.a.y), size: Number(n.a['font-size']), text: n.text };
  });
}

for (const size of SIZES) {
  for (const yTitle of TITLES) {
    test(`y title ${JSON.stringify(size)} "${yTitle.slice(0, 12)}": stacked marks stay inside, clear of the tick labels`, () => {
      const m = buildChart('dot', { groups, yTitle, xTitle: 'สูตรอาหาร' }, { ...size, lang: 'th' });
      const titles = rotated(m).filter((r) => r.ang === -90);
      assert.ok(titles.length >= 1);
      for (const r of titles) assert.ok(r.x - ROTATED_REACH * r.size >= -0.01, `"${r.text}" reaches ${r.x - ROTATED_REACH * r.size} past the left edge`);
      const ticks = m.marks.filter((n) => n && n.t === 'text' && n.a['text-anchor'] === 'end' && !n.a.transform);
      const tickLeft = Math.min(...ticks.map((n) => Number(n.a.x) - textWidth(n.text, Number(n.a['font-size']))));
      for (const r of titles) assert.ok(r.x + DESCENT * r.size <= tickLeft + 0.01, `"${r.text}" (${r.x + DESCENT * r.size}) runs into the tick labels (${tickLeft})`);
    });
  }
  test(`estimation ${JSON.stringify(size)}: the right-hand label's marks stay inside`, () => {
    const m = buildChart('estimation', { groups, yTitle: TITLES[0], diff: { value: 58, lo: 38, hi: 78, label: 'ผลต่างของน้ำหนักที่เพิ่มขึ้น (กลุ่มที่สอง − กลุ่มที่หนึ่ง)' } }, { ...size, lang: 'th' });
    const right = rotated(m).filter((r) => r.ang === 90);
    assert.ok(right.length >= 1);
    for (const r of right) assert.ok(r.x + ROTATED_REACH * r.size <= m.width + 0.01, `"${r.text}" reaches ${r.x + ROTATED_REACH * r.size} past ${m.width}`);
    const dl = m.marks.filter((n) => n && n.t === 'text' && !n.a.transform && !n.a['text-anchor']);
    const dEnd = Math.max(...dl.map((n) => Number(n.a.x) + textWidth(n.text, Number(n.a['font-size']))));
    for (const r of right) assert.ok(r.x - DESCENT * r.size >= dEnd - 0.01, `"${r.text}" (${r.x - DESCENT * r.size}) runs into the difference ticks (${dEnd})`);
    for (const r of rotated(m).filter((x) => x.ang === -90)) assert.ok(r.x - ROTATED_REACH * r.size >= -0.01);
    // round 6: the label runs along the height; it is fitted so neither end leaves the figure
    for (const r of rotated(m)) {
      const half = textWidth(r.text, r.size) / 2;
      assert.ok(r.y - half >= -0.01 && r.y + half <= m.height + 0.01, `"${r.text}" runs ${r.y - half} to ${r.y + half} of ${m.height}`);
    }
  });
}
