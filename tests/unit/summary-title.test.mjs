// A lecture summary always has a heading and a file name to save under, even
// when its entry was filed with `title: null`; and no shipped entry carries a
// length the modal cannot read.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summaryTitle, summaryFileName, SUMMARY_TITLE_FALLBACK } from '../../src/lib/summary-title.js';
import { loadAllVideoSummaries } from '../../src/data/video-summaries.js';

test('the title on record, else the summary heading, else a plain label', () => {
  assert.equal(summaryTitle({ title: 'ปฐมนิเทศ OSCE', summary: '# อื่น' }), 'ปฐมนิเทศ OSCE');
  assert.equal(summaryTitle({ title: null, summary: 'intro\n# ชี้แจงรายวิชา ปี 6\n## 1. ภาพรวม' }), 'ชี้แจงรายวิชา ปี 6');
  assert.equal(summaryTitle({ title: null, summary: '## 1. ภาพรวม' }), SUMMARY_TITLE_FALLBACK);
});

test('saving never throws and keeps Thai in the file name', () => {
  assert.equal(summaryFileName({ title: 'ปฐมนิเทศ OSCE' }), 'ปฐมนิเทศ_OSCE.md');
  assert.equal(summaryFileName({ title: null, videoId: 'r-LT4yGdHCY', summary: '## 1.' }), 'r-LT4yGdHCY.md');
});

test('every shipped summary shows a heading, and none uses the unread duration string', async () => {
  const all = Object.values(await loadAllVideoSummaries());
  assert.ok(all.length > 600);
  assert.deepEqual(all.filter((s) => !summaryTitle(s)).map((s) => s.videoId), []);
  assert.deepEqual(all.filter((s) => 'duration' in s).map((s) => s.videoId), []);
});
