// Generated files merge by themselves.
//
// Two pull requests that add questions to different topics used to conflict
// in nearly every generated file (a build time and stored totals moved on the
// same lines in each), or merged without a conflict and left main stale. Each
// generator now writes leaves only, one per line between a header and a footer
// naming it, and the totals are computed where they are read
// (scripts/lib/merge-friendly.mjs).
//
// This builds a small bank, a change A and a change B in different topics,
// renders every derived file for base, A, B and A+B with the generators' own
// code, merges A and B over base with `git merge-file` (the three-way merge
// git and GitHub use), and requires a clean merge equal to the A+B rendering.
//
// Every other pair of changes must never merge clean and wrong: each file
// either conflicts or equals a regeneration. Two different changes to one
// topic (equal numbers of held-back questions on each side, the same edit to
// two questions) conflict on the leaf's digest comment; a question added to a
// topic of a bank changes nothing stored per bank.
//
// Not covered here, with the reason:
//   api/_lib/written-questions.generated.json  JSON cannot carry the header and
//     footer lines; its leaves are questions, so only two pull requests that
//     add written questions next to each other in id order meet there.
//   README.md and docs/content-inventory.md     hold no question counts any
//     more; `npm run stats` prints them (scripts/stats.mjs).
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { buildQCountLeaves, renderQCounts, renderQKindCounts } from '../../scripts/lib/q-count-leaves.mjs';
import { renderShareBank } from '../../scripts/lib/share-bank-leaves.mjs';
import { compareRegistryEntries, renderBankRegistry } from '../../scripts/lib/bank-registry-text.mjs';
import { renderGlossaryRelated } from '../../scripts/lib/glossary-related-leaves.mjs';
import { countTables, kindTables } from '../../src/lib/q-count-tables.js';

// ── a small bank ─────────────────────────────────────────────
// Subject `sa` has topics t1 (hidden), t2, t3 and t5 in three bank files;
// subject `sb` has one topic. Topics t2/t3 and t3/t5 sit next to each other
// in every sorted file, which is where a line-per-leaf layout without header
// and footer lines still conflicted.
let nextId = 1000;
const q = (bank, subject, topic, extra = {}) => ({
  bank, id: nextId++, subject, topic, year: subject === 'sa' ? 5 : 4,
  type: 'mcq', q: `A question on ${topic}`, options: ['a', 'b', 'c', 'd'], answer: 0,
  scope: 'final', ...extra,
});

const base = [
  q('questions-sa-1.js', 'sa', 't1'),
  q('questions-sa-1.js', 'sa', 't2', { q: 'Azotemia in a cat', source: 'past' }),
  q('questions-sa-1.js', 'sa', 't2', { type: 'tf', scope: 'midterm' }),
  q('questions-sa-2.js', 'sa', 't3', { q: 'Azotemia in a dog', current: true }),
  q('questions-sa-2.js', 'sa', 't3', { held: true }),
  q('questions-sa-3.js', 'sa', 't5', { type: 'match', topics: ['t5', 't2'] }),
  q('questions-sb.js', 'sb', 'u1', { high: true, scope: 'both' }),
];
nextId = 2000;
// A: two topics, existing leaves only, in the first and last bank of `sa`.
const changeA = [
  q('questions-sa-1.js', 'sa', 't2', { q: 'Azotemia and the kidney', source: 'past' }),
  q('questions-sa-3.js', 'sa', 't5', { type: 'short' }),
];
nextId = 3000;
// B: the topic between A's two, and a new topic in a new bank file right
// before A's last topic and A's last bank.
const changeB = [
  q('questions-sa-2.js', 'sa', 't3', { q: 'Azotemia, prerenal', scope: 'both' }),
  q('questions-sa-2b.js', 'sa', 't4', { q: 'Azotemia again' }),
];

const GLOSSARY = [
  { key: 'azotemia|universal', strings: ['azotemia'], __scope: 'universal' },
  { key: 'kidney|sa', strings: ['kidney'], __scope: new Set(['sa']) },
];

const countRules = {
  isQuestionDeliverable: (x) => !x.held,
  questionTopicId: (x) => x.topic || '__unassigned__',
  isPastPaperQuestion: (x) => x.source === 'past',
  panicRank: (x) => (x.source === 'past' ? 0 : 2),
  questionInScope: (x, paper) => x.scope === paper || x.scope === 'both',
  scopeOfQuestion: (x) => x.scope ?? null,
  isCurrentScopeQuestion: (x) => Boolean(x.current),
  isHighPredictionQuestion: (x) => Boolean(x.high),
  semesterForSubject: (s) => (s === 'sa' ? 1 : 2),
  hiddenBySubject: { sa: new Set(['t1']) },
};

// What scripts/regen-bank-registry.mjs reads from each bank.
function registryEntries(questions) {
  const banks = new Map();
  for (const x of questions) {
    if (!banks.has(x.bank)) banks.set(x.bank, { file: x.bank, export: x.bank.replace(/\W/g, '_').toUpperCase(), questions: [] });
    banks.get(x.bank).questions.push(x);
  }
  return [...banks.values()].map((b) => {
    const years = new Set(b.questions.map((x) => x.year));
    return {
      file: b.file,
      export: b.export,
      year: years.size === 1 ? [...years][0] : null,
      subjects: [...new Set(b.questions.map((x) => x.subject))].sort(),
      leaves: b.questions.map((x) => [x.subject, x.topic, x.year]),
    };
  }).sort(compareRegistryEntries);
}

// Every derived file, rendered by the generators' own code.
function derive(questions) {
  // The generators read banks in registry order.
  const ordered = registryEntries(questions).flatMap((b) => questions.filter((x) => x.bank === b.file));
  const leaves = buildQCountLeaves(ordered, countRules);
  return {
    'src/data/q-counts.js': renderQCounts(leaves),
    'src/data/q-kind-counts.generated.js': renderQKindCounts(leaves),
    'src/data/bank-registry.generated.js': renderBankRegistry(registryEntries(questions)),
    'api/_lib/share-bank.generated.js': renderShareBank(ordered, {
      shareSubjects: ['sa', 'sb'],
      subjectName: (s) => `Subject ${s}`,
      questionTopicId: countRules.questionTopicId,
      isQuestionDeliverable: countRules.isQuestionDeliverable,
      customRange: [900000, 999999],
    }).text,
    'src/data/glossary-related.generated.js': renderGlossaryRelated(GLOSSARY, ordered, {
      entryKey: (e) => e.key,
      searchableStrings: (e) => e.strings,
      isQuestionDeliverable: countRules.isQuestionDeliverable,
      questionTopicId: countRules.questionTopicId,
    }).text,
  };
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-derived-merge-'));
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

// `git merge-file -p ours base theirs`: the exit status is the number of
// conflicts, the output the merged text.
function merge3(ours, ancestor, theirs) {
  const write = (name, text) => { const file = path.join(dir, name); fs.writeFileSync(file, text); return file; };
  const run = spawnSync('git', ['merge-file', '-p', write('ours', ours), write('base', ancestor), write('theirs', theirs)], { encoding: 'utf8' });
  if (run.error) throw run.error;
  return { conflicts: run.status, text: run.stdout };
}

const before = derive(base);
const afterA = derive([...base, ...changeA]);
const afterB = derive([...base, ...changeB]);
const afterBoth = derive([...base, ...changeA, ...changeB]);

for (const file of Object.keys(before)) {
  test(`${file}: changes in different topics merge with no conflict into exactly a regeneration`, () => {
    // The registry moves only for B's new bank: a question added to a topic
    // of an existing bank changes nothing stored per bank.
    if (file === 'src/data/bank-registry.generated.js') assert.equal(afterA[file], before[file]);
    else assert.notEqual(afterA[file], before[file], 'change A must reach this file');
    assert.notEqual(afterB[file], before[file], 'change B must reach this file');
    const merged = merge3(afterA[file], before[file], afterB[file]);
    assert.equal(merged.conflicts, 0, `conflict:\n${merged.text}`);
    assert.equal(merged.text, afterBoth[file]);
    // And the other way round, as when B lands first.
    const reversed = merge3(afterB[file], before[file], afterA[file]);
    assert.equal(reversed.conflicts, 0);
    assert.equal(reversed.text, afterBoth[file]);
  });
}

// The truth after both changes: a question is in the merged bank when neither
// side removed it and at least one side has it.
function union(start, sideA, sideB) {
  const removed = new Set(start.filter((x) => !sideA.includes(x) || !sideB.includes(x)));
  return [...new Set([...start, ...sideA, ...sideB])].filter((x) => !removed.has(x));
}

// The goal: no conflict anywhere, and the merge equals a regeneration.
function assertMergesByItself(start, sideA, sideB) {
  const truth = derive(union(start, sideA, sideB));
  const o = derive(start);
  const a = derive(sideA);
  const b = derive(sideB);
  for (const file of Object.keys(o)) {
    for (const [ours, theirs] of [[a, b], [b, a]]) {
      const merged = merge3(ours[file], o[file], theirs[file]);
      assert.equal(merged.conflicts, 0, `${file}: conflict:\n${merged.text}`);
      assert.equal(merged.text, truth[file], `${file}: merged clean but differs from a regeneration`);
    }
  }
}

// The floor for every other pair of changes: a file either conflicts (git
// stops and somebody regenerates) or merges into exactly a regeneration.
// Never clean and wrong, which turns main red after a green merge.
function assertNeverCleanAndWrong(start, sideA, sideB) {
  const truth = derive(union(start, sideA, sideB));
  const o = derive(start);
  const a = derive(sideA);
  const b = derive(sideB);
  let conflicted = 0;
  for (const file of Object.keys(o)) {
    for (const [ours, theirs] of [[a, b], [b, a]]) {
      const merged = merge3(ours[file], o[file], theirs[file]);
      if (merged.conflicts > 0) { conflicted += 1; continue; }
      assert.equal(merged.text, truth[file], `${file}: merged clean but differs from a regeneration`);
    }
  }
  return conflicted;
}

test('no generated file carries a build time, a date or a stored total', () => {
  const stored = [
    /Built:|\d{4}-\d{2}-\d{2}T\d{2}:/,
    /export const \w+ = \d/,
    /\b\d[\d,]* (?:ids|subjects|runs|banks|questions|Qs)\b/,
    /\bcount: \d/,
  ];
  const checkedIn = Object.fromEntries(Object.keys(afterBoth).map((file) => [
    `checked-in ${file}`, fs.readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8'),
  ]));
  for (const [file, text] of Object.entries({ ...afterBoth, ...checkedIn })) {
    for (const re of stored) assert.doesNotMatch(text, re, file);
  }
});

test('the same topic changed on both sides is still a conflict, never a silent wrong sum', () => {
  // One side adds a question to t3, the other two: the t3 leaf differs and
  // git stops.
  nextId = 4000;
  const one = derive([...base, q('questions-sa-2.js', 'sa', 't3')]);
  nextId = 5000;
  const other = derive([...base, q('questions-sa-2.js', 'sa', 't3'), q('questions-sa-2.js', 'sa', 't3')]);
  for (const file of ['src/data/q-counts.js', 'api/_lib/share-bank.generated.js']) {
    const merged = merge3(one[file], before[file], other[file]);
    assert.ok(merged.conflicts > 0, `${file}: both sides changed the t3 leaf`);
  }
});

test('one question each in different topics of the SAME bank file merges by itself', () => {
  // Nothing stored per bank may move when a bank gains a question in a topic
  // it already has: a per-bank count would be written as the same new line on
  // both sides, merge as one change, and come out one short.
  nextId = 6000;
  const a = [...base, q('questions-sa-1.js', 'sa', 't2')];
  nextId = 6100;
  const b = [...base, q('questions-sa-1.js', 'sa', 't1')];
  assertMergesByItself(base, a, b);
  nextId = 6200;
  const c = [...base, q('questions-sa-2.js', 'sa', 't3', { held: true })];
  nextId = 6300;
  const d = [...base, q('questions-sa-1.js', 'sa', 't2', { held: true })];
  assertMergesByItself(base, c, d);
});

test('equal numbers of held-back questions added to one topic never merge clean and wrong', () => {
  // Held-back questions reach no id list (share-bank and glossary leave them
  // out), so the counts were the only place both sides met: both wrote the
  // same `blocked` number, git took it once, and the true value is the sum.
  nextId = 7000;
  const a = [...base, q('questions-sa-2.js', 'sa', 't3', { held: true })];
  nextId = 7100;
  const b = [...base, q('questions-sa-2.js', 'sa', 't3', { held: true })];
  assert.ok(assertNeverCleanAndWrong(base, a, b) > 0, 'two different changes to one leaf must conflict somewhere');
});

test('equal numbers of plain questions added to one topic never merge clean and wrong', () => {
  nextId = 7200;
  const a = [...base, q('questions-sa-2.js', 'sa', 't3')];
  nextId = 7300;
  const b = [...base, q('questions-sa-2.js', 'sa', 't3')];
  assert.ok(assertNeverCleanAndWrong(base, a, b) > 0);
  // The same edit to two different questions of one topic (each moves one
  // question from the midterm to the final): equal numbers again.
  const start = [...base, q('questions-sa-2.js', 'sa', 't3', { scope: 'midterm' }), q('questions-sa-2.js', 'sa', 't3', { scope: 'midterm' })];
  const [x, y] = start.slice(-2);
  const edit = (target) => start.map((item) => (item === target ? { ...item, scope: 'final' } : item));
  const editX = edit(x);
  const editY = edit(y);
  const truth = derive(start.map((item) => (item === x || item === y ? { ...item, scope: 'final' } : item)));
  const o = derive(start);
  const ea = derive(editX);
  const eb = derive(editY);
  let conflicted = 0;
  for (const file of Object.keys(o)) {
    const merged = merge3(ea[file], o[file], eb[file]);
    if (merged.conflicts > 0) conflicted += 1;
    else assert.equal(merged.text, truth[file], `${file}: merged clean but differs from a regeneration`);
  }
  assert.ok(conflicted > 0);
});

test('a bank whose subjects come from several topics never keeps a subject both sides emptied', () => {
  // A bank with two subjects: each side deletes the last `sa` question of one
  // topic. Each side still has `sa` in the bank, so a subjects line alone
  // would not move on either side and survive the merge.
  nextId = 8000;
  const mixed = [q('questions-mix.js', 'sa', 't2'), q('questions-mix.js', 'sa', 't3'), q('questions-mix.js', 'sb', 'u1')];
  const start = [...base, ...mixed];
  const a = start.filter((x) => x !== mixed[0]);
  const b = start.filter((x) => x !== mixed[1]);
  assert.ok(assertNeverCleanAndWrong(start, a, b) > 0);
});

test('a deleted question and a new subject merge by themselves', () => {
  nextId = 9000;
  const a = base.filter((x) => x !== base[2]);
  const b = [...base, q('questions-sc.js', 'sc', 'w1')];
  assertMergesByItself(base, a, b);
});

test('two new topics next to each other never merge clean and wrong', () => {
  nextId = 9100;
  const a = [...base, q('questions-sa-3.js', 'sa', 't6')];
  nextId = 9200;
  const b = [...base, q('questions-sa-3.js', 'sa', 't7')];
  assertNeverCleanAndWrong(base, a, b);
});

test('the tables computed from the leaves are the sums a reader expects', () => {
  const ordered = [...base, ...changeA, ...changeB];
  const { countLeaves, subjectTerms, kindLeaves } = buildQCountLeaves(ordered, countRules);
  const t = countTables(countLeaves, Object.fromEntries(subjectTerms));
  const live = ordered.filter((x) => !x.held);
  assert.equal(t.QB_TOTAL, live.length);
  assert.equal(t.QB_SOURCE_TOTAL, ordered.length);
  assert.equal(t.QB_BLOCKED_TOTAL, 1);
  assert.deepEqual(t.Q_COUNTS_BY_SUBJECT, { sa: live.filter((x) => x.subject === 'sa').length, sb: 1 });
  assert.equal(t.Q_VISIBLE_COUNTS_BY_SUBJECT.sa, live.filter((x) => x.subject === 'sa' && x.topic !== 't1').length);
  assert.deepEqual(t.Q_COUNTS_BY_TOPIC.sa, { t1: 1, t2: 3, t3: 2, t4: 1, t5: 2 });
  assert.deepEqual(t.Q_PAST_PAPER_COUNTS_BY_TOPIC, { sa: { t2: 2 } });
  assert.deepEqual(t.Q_COUNTS_BY_YEAR, { 4: 1, 5: live.length - 1 });
  // sa is a term-1 subject: its final-paper questions are in 1-final, and the
  // midterm one in 1-mid; `both` counts in each.
  assert.equal(t.Q_COUNTS_BY_TOPIC_BY_SCOPE['1-mid'].sa.t2, 1);
  assert.equal(t.Q_COUNTS_BY_TOPIC_BY_SCOPE['1-final'].sa.t3, 2);
  assert.deepEqual(t.Q_CURRENT_SCOPE_COUNTS, {});
  const k = kindTables(kindLeaves);
  assert.equal(k.Q_KIND_COUNTS_QB_TOTAL, live.length);
  assert.deepEqual(k.Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE['1-final'].sa.t5, { mcq: 0, tf: 0, match: 1, writing: 1 });
  assert.deepEqual(k.Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE['1-final'].sa.t2, { mcq: 2, tf: 0, match: 0, writing: 0, _matchCovers: 1 });
});
