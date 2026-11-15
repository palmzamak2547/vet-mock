// Two lines about the system rather than the page (5.214): the loading
// screen's "first load, next time is faster" and the faculty list's count of
// profiles, papers and its check date under the title.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('the loading screen says it is loading, and nothing about later loads', () => {
  const bar = read('src/components/TopLoadingBar.jsx');
  assert.ok(bar.includes('กำลังโหลด…'));
  assert.ok(!bar.includes('โหลดครั้งแรก ครั้งต่อไปจะเร็วขึ้น'));
});

test('the faculty list opens on its title and search, with no stats line', () => {
  const view = read('src/views/FacultyView.jsx');
  assert.ok(!/โปรไฟล์, ผลงานวิจัยคัดเลือก/.test(view));
  assert.ok(!/ตรวจสอบล่าสุด 12 ส\.ค\. 2569/.test(view));
});
