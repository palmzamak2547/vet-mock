// ============================================================
// wiki-bylines.test.mjs: "บรรยายโดย" names a person or nobody
// ============================================================
// Review of 5.146.0. The article's byline, new under the title, read
// "บรรยายโดย TBD" on 8 topics, a field of study on the 9 built from MSD
// tables ("บรรยายโดย Herpetological Medicine") and an internal note on 2. The
// notes now carry no lecturer where there is no person (the notes, the
// reading list and the wiki all read the same field), and the view still
// names nobody for a "TBD" that comes back.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';

const topics = listTopics().map((t) => ({ t, k: loadTopic(t.subject, t.topic) }));

test('no lecturer is a placeholder or a working note', () => {
  for (const { t, k } of topics) {
    if (!k.lecturer) continue;
    assert.doesNotMatch(k.lecturer, /^TBD\b|initials on slide|\(ดู /i, `${t.id}: "${k.lecturer}"`);
  }
});

test('a topic built only from MSD tables names no lecturer', () => {
  const msd = topics.filter(({ k }) => k.sections.length && k.sections.every((s) => /^MSD Veterinary Manual/.test(s.sourceRefs?.[0]?.locator || '')));
  assert.ok(msd.length >= 9, `the MSD-built topics are found (${msd.length})`);
  for (const { t, k } of msd) assert.equal(k.lecturer, '', `${t.id}: "${k.lecturer}"`);
});

test('the article names nobody for TBD', () => {
  const view = readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8');
  assert.match(view, /knowledge\.lecturer && !\/\^tbd\\b\/i\.test\(knowledge\.lecturer\) && <p className="vw-byline">/);
});
