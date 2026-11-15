// The topic screen's reading counter said 24 topics for epidemiology while 19
// cards showed (15 against 13 for One Health; screens hunt, 11 Nov 2026). Not
// a wrong number: the counter is the reading list, every topic of the
// syllabus, and the cards leave out topics with nothing to study yet, which
// sit behind "แสดงหัวข้อที่ยังไม่มีเนื้อหา (N หัวข้อ)". The counter now says
// what it counts. For every Year-5 subject: cards plus hidden topics make the
// counter's total, and wherever the two differ the counter is labelled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStudyCatalog } from '../../src/lib/study-catalog.js';
import { SUBJECTS, yearForSubject } from '../../src/data/curriculum.js';

const src = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8');
// TopicSelectView's own rule for a card (pinned below).
const hasTopicContent = (e) => Boolean(e?.questionCount > 0 || e?.resources?.notes?.enabled || e?.resources?.wiki?.enabled);

test('the counter names its unit, and the view counts as this test does', () => {
  assert.match(src, /อ่านแล้ว <strong>\{subjReadDone\}\/\{topics\.length\}<\/strong> หัวข้อในแผนการสอน/);
  assert.match(src, /อ่านแล้ว \$\{subjReadDone\} จาก \$\{topics\.length\} หัวข้อในแผนการสอน/);
  assert.match(src, /entry\?\.questionCount > 0\s*\|\| entry\?\.resources\?\.notes\?\.enabled\s*\|\| entry\?\.resources\?\.wiki\?\.enabled/);
  assert.match(src, /const visible = showEmptyTopics \? \[\.\.\.ready, \.\.\.empty\] : ready;/);
  assert.match(src, /แสดงหัวข้อที่ยังไม่มีเนื้อหา \(\$\{emptyCount\} หัวข้อ\)/);
});

test('every Year-5 subject: cards and hidden topics add up to the counter', () => {
  const catalog = createStudyCatalog({});
  const year5 = SUBJECTS.filter((s) => yearForSubject(s.id) === 5);
  assert.ok(year5.length >= 10);
  const differ = [];
  for (const s of year5) {
    const topics = catalog.browse({ subject: s.id }).topics || [];
    const cards = topics.filter(hasTopicContent).length;
    const hidden = topics.filter((t) => !hasTopicContent(t)).length;
    assert.equal(cards + hidden, topics.length, s.id);
    if (cards !== topics.length) differ.push(`${s.id} ${cards}/${topics.length}`);
  }
  // The two the hunt saw are among them; each is labelled by the test above.
  assert.ok(differ.some((d) => d.startsWith('epidemiology ')), differ.join(', '));
  assert.ok(differ.some((d) => d.startsWith('one-health ')), differ.join(', '));
});
