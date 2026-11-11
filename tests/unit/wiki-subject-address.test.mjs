// /wiki/<subject> (a subject with no topic) opened the plain /wiki index and
// dropped the subject (screens hunt, 11 Nov 2026: /wiki/com5 landed on /wiki).
// A subject address now opens the index at that subject and keeps its
// address; an unknown subject falls back to the index.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listTopics } from '../../src/lib/vetwiki/index.js';
import { wikiEntry } from '../../src/lib/vetwiki/url.js';

const topics = listTopics();
const subjects = [...new Set(topics.map((t) => t.subject))];

test('the shelf has subjects to check', () => {
  assert.ok(subjects.length >= 5, `only ${subjects.length} wiki subjects`);
});

test('every wiki subject address opens the index at that subject', () => {
  for (const subject of subjects) {
    for (const path of [`/wiki/${subject}`, `/wiki/${subject}/`, `/wiki/${encodeURIComponent(subject)}`]) {
      assert.deepEqual(wikiEntry(path, topics), { kind: 'subject', subject }, path);
    }
  }
});

test('every topic address still opens its article', () => {
  for (const t of topics) {
    assert.deepEqual(wikiEntry(`/wiki/${t.subject}/${t.topic}`, topics), { kind: 'article', id: t.id });
  }
});

test('an unknown subject, an unknown article and the bare index fall back to the index', () => {
  assert.deepEqual(wikiEntry('/wiki/no-such-subject', topics), { kind: 'index', missing: false });
  assert.deepEqual(wikiEntry(`/wiki/${subjects[0]}/no-such-topic`, topics), { kind: 'index', missing: true });
  assert.deepEqual(wikiEntry('/wiki', topics), { kind: 'index', missing: false });
  assert.deepEqual(wikiEntry('/wiki/', topics), { kind: 'index', missing: false });
  assert.deepEqual(wikiEntry('/app/study', topics), { kind: 'none' });
});

test('KnowledgeView seeds the index focus from the address and keeps that address', () => {
  const src = readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8');
  assert.match(src, /wikiEntry\(window\.location\.pathname, topics\)/);
  assert.match(src, /entry\.kind === 'subject' \? \{ subject: entry\.subject, nonce: 'address' \}/);
  assert.match(src, /if \(indexFocus\?\.nonce !== 'address'\) syncUrl\(openId, true\);/);
});
