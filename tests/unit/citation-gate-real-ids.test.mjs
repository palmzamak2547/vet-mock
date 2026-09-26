// ============================================================
// citation-gate-real-ids.test.mjs — the gate must find real questions
// ============================================================
// getEligibleCitationForQuestion rejected every non-string and then compared
// a string to the bank's numeric ids, so it returned null for every real
// question and the "Citation" block in QSourceChip never rendered. The
// eligibility guards (approved page, approved anchor, mappingEligible,
// a sourceApprovalRef) are untouched — this only proves the lookup works.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { QB, loadQB } from '../../src/data/questions.js';
import { getEligibleCitationForQuestion } from '../../src/lib/citation-gate.js';
import { parseWikiPath } from '../../src/lib/vetwiki/url.js';
import { VETWIKI_TOPIC_KEYS } from '../../src/lib/vetwiki/topic-keys.generated.js';
import { articleForQuestion } from '../../src/lib/vetwiki/registry-lite.js';

await loadQB();

test('a numeric bank id resolves to its citation', () => {
  const c = getEligibleCitationForQuestion(501, 'com5');
  assert.ok(c, 'com5:501 carries an approved, verified wiki reference');
  // B26: the URL names a real article (/wiki/<subject>/<topic>), not the
  // reference's page id, which parseWikiPath read as a subject and sent to
  // the index.
  assert.equal(c.url, '/wiki/com5/cve');
  assert.equal(c.mappingEligible, true);
});

test('the same id as a string resolves the same way', () => {
  assert.deepEqual(getEligibleCitationForQuestion('501', 'com5'), getEligibleCitationForQuestion(501, 'com5'));
});

test('a question object is still refused — the gate takes ids, not payloads', () => {
  const q = QB.find((x) => x.id === 501 && x.subject === 'com5');
  assert.equal(getEligibleCitationForQuestion(q, 'com5'), null);
});

test('the subject scopes the lookup, because ids repeat across banks', () => {
  const dup = QB.filter((x) => x.id === 501);
  assert.ok(dup.length >= 1);
  assert.equal(getEligibleCitationForQuestion(501, 'no-such-subject'), null);
});

test('more than a handful of real questions are eligible now', () => {
  let eligible = 0;
  for (const q of QB) {
    if (!(q.questionWikiRef || (Array.isArray(q.wikiRefs) && q.wikiRefs.length))) continue;
    if (getEligibleCitationForQuestion(q.id, q.subject)) eligible++;
  }
  assert.ok(eligible >= 3, `expected eligible citations in the real corpus, found ${eligible}`);
});

// B26: every 'อ้างอิง VetWiki' row pointed at /wiki/<pageId>#<anchorId>, a
// path with no article behind it (163 of 163 landed on the index). Each
// eligible citation must now open the question's own article.
test('every eligible citation opens a real VetWiki article', () => {
  const keys = new Set(VETWIKI_TOPIC_KEYS);
  let checked = 0;
  for (const q of QB) {
    if (!(q.questionWikiRef || (Array.isArray(q.wikiRefs) && q.wikiRefs.length))) continue;
    const c = getEligibleCitationForQuestion(q.id, q.subject);
    if (!c) continue;
    checked++;
    const parsed = parseWikiPath(c.url.split('#')[0]);
    assert.ok(parsed.subject && parsed.topic, `${q.subject}:${q.id} → ${c.url} has no topic`);
    assert.ok(keys.has(`${parsed.subject}--${parsed.topic}`), `${q.subject}:${q.id} → ${c.url} is not an article`);
    const a = articleForQuestion(q);
    assert.equal(`${parsed.subject}/${parsed.topic}`, `${a.subject}/${a.topic}`, `${q.subject}:${q.id}`);
  }
  assert.ok(checked >= 150, `expected the 163 cited questions, checked ${checked}`);
});

test('the source chip opens the cited article in a new tab, never a same-tab jump out of the question', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/components/QSourceChip.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.doesNotMatch(src, /__vetmock_navigate/, 'a hook nothing defines');
  const link = src.slice(src.indexOf('href={eligibleCitation.url}'), src.indexOf('<Row label="อ้างอิง VetWiki"'));
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener"/);
});
