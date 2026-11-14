// ============================================================
// Wrap-up "เคยออก N รุ่น": the cohorts that sat an item's cited past papers
// ============================================================
// src/lib/wrap-cohorts.js reads the ids a "มีในข้อสอบเก่า" line cites and
// looks each up in exam-recurrence.generated.js. History only: the tag counts
// cohorts that were asked, and an id the file does not attribute adds nothing.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pastPaperIds, cohortIndex, itemCohorts, cohortList } from '../../src/lib/wrap-cohorts.js';
import { EXAM_RECURRENCE, EXAM_RECURRENCE_CLUSTERS } from '../../src/data/exam-recurrence.generated.js';
import { wrapUpPapers, loadWrapUp } from '../../src/data/exam-wrapups.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('a past-paper citation gives its ids, never a cohort number, a remark or another kind of source', () => {
  assert.deepEqual(pastPaperIds('ข้อสอบเก่า 209058, 209059'), ['209058', '209059']);
  assert.deepEqual(pastPaperIds('ข้อสอบเก่า 209009, 209010 (Vet 80), 209051 (Vet 83)'), ['209009', '209010', '209051']);
  assert.deepEqual(pastPaperIds('ข้อสอบเก่า 209054 (ปลายภาค Vet 78, Vet 81)'), ['209054']);
  assert.deepEqual(pastPaperIds('ข้อฝึกในคลัง 209163'), []);
  assert.deepEqual(pastPaperIds('แนวข้อสอบ 105579'), []);
  assert.deepEqual(pastPaperIds('ข้อสอบเก่า 8351; เดค Swine หน้า 12'), ['8351']);
  assert.deepEqual(pastPaperIds(undefined), []);
});

test('question 209058 resolves to Vet 78, 81 and 85, as the recurrence file files it', () => {
  const index = cohortIndex(EXAM_RECURRENCE, EXAM_RECURRENCE_CLUSTERS, 'swine-clinic');
  assert.deepEqual([...index.get('209058')].sort(), [78, 81, 85]);
  const item = { examined: [{ text: 'x', src: 'ข้อสอบเก่า 209058' }] };
  assert.deepEqual(itemCohorts(item, index), [78, 81, 85]);
  assert.equal(cohortList(itemCohorts(item, index)), 'Vet 78, 81, 85');
});

test('the Swine final\'s PE item: two cited papers, five cohorts, each counted once', async () => {
  const d = await loadWrapUp('swine-clinic', 5, '1-final');
  const pe = d.groups.flatMap((g) => g.items).find((it) => it.name === 'Proliferative enteropathy (PE)');
  const index = cohortIndex(EXAM_RECURRENCE, EXAM_RECURRENCE_CLUSTERS, 'swine-clinic');
  assert.deepEqual(itemCohorts(pe, index), [78, 80, 81, 83, 85]);
});

test('no past paper, or one no cohort is filed for: no cohorts, so no tag', () => {
  const index = cohortIndex(EXAM_RECURRENCE, EXAM_RECURRENCE_CLUSTERS, 'swine-clinic');
  assert.deepEqual(itemCohorts({}, index), []);
  assert.deepEqual(itemCohorts({ examined: [] }, index), []);
  assert.deepEqual(itemCohorts({ examined: [{ src: 'ข้อฝึกในคลัง 209165' }] }, index), []);
  assert.deepEqual(itemCohorts({ examined: [{ src: 'ข้อสอบเก่า 999999' }] }, index), []);
  assert.equal(cohortList([]), '');
});

test('a copy of the same item sat by another cohort counts that cohort too', () => {
  const recurrence = { s: { topics: { t: { sat: { 80: { final: ['s:101'] } } } } } };
  const clusters = [{ cohorts: [80, 84], members: [['s:101', [80]], ['other:909', [84]]] }];
  assert.deepEqual(itemCohorts({ examined: [{ src: 'ข้อสอบเก่า 101' }] }, cohortIndex(recurrence, clusters, 's')), [80, 84]);
  // Another subject's key never answers for this one.
  assert.deepEqual(itemCohorts({ examined: [{ src: 'ข้อสอบเก่า 909' }] }, cohortIndex(recurrence, clusters, 's')), []);
});

test('every cohort a shipped wrap-up shows is a real sitting cohort, below the current one', async () => {
  for (const { year, phase, subject } of wrapUpPapers()) {
    const d = await loadWrapUp(subject, year, phase);
    const index = cohortIndex(EXAM_RECURRENCE, EXAM_RECURRENCE_CLUSTERS, subject);
    for (const it of d.groups.flatMap((g) => g.items)) {
      for (const c of itemCohorts(it, index)) assert.ok(Number.isInteger(c) && c >= 70 && c < 86, `${subject} ${it.name}: Vet ${c}`);
    }
  }
});

test('the view loads the recurrence file lazily and words the tag as history', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /import\('\.\.\/data\/exam-recurrence\.generated\.js'\)/);
  assert.doesNotMatch(view, /^import .*exam-recurrence\.generated/m, 'a static import would put 180 KB in the wrap-up chunk');
  assert.match(view, /เคยออก \{seen\.length\} รุ่น/);
  assert.match(view, /\{seen\.length > 0 && \(/);
});
