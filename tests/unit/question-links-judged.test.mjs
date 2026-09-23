// The derived question -> article links are written by
// scripts/apply-question-links.mjs from a judged file. That file was not kept
// the first time, so nobody could add a link without hand-editing generated
// output. scripts/question-links.judged.json is now the input, and the
// generated table must be exactly what it produces.
//
// It also carries the links judged for this week's papers: aquatic-clinic and
// equine-repro held 96 questions whose topic has no article. The ones an
// existing section genuinely answers now open it; the rest wait for articles.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { QUESTION_LINKS } from '../../src/lib/vetwiki/question-links.generated.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { articleForQuestion } from '../../src/lib/vetwiki/registry-lite.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const judged = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/question-links.judged.json'), 'utf8'));

test('the generated links are exactly what the judged file produces', () => {
  const fromJudged = Object.fromEntries(judged.links.filter((l) => l.sectionId)
    .map((l) => [String(l.questionId), `${l.sectionId}|${l.confidence}`]));
  const generated = Object.fromEntries(Object.entries(QUESTION_LINKS).map(([id, l]) => [id, `${l.sectionId}|${l.confidence}`]));
  assert.deepEqual(generated, fromJudged, 'run node scripts/apply-question-links.mjs scripts/question-links.judged.json --write');
});

test('every link added by hand says why the section answers the question', () => {
  for (const l of judged.links.filter((x) => x.judged)) {
    assert.ok(l.reason && l.reason.length > 20, `${l.questionId}: no reason recorded`);
    assert.ok(['strong', 'supporting'].includes(l.confidence));
  }
});

test("this week's aquatic and equine-repro questions reach an article where one answers them", async () => {
  await loadQB();
  const byId = new Map(QB.map((q) => [String(q.id), q]));
  for (const id of ['204014', '202191', '202452', '204003', '105488', '105471', '105489', '105490']) {
    const a = articleForQuestion(byId.get(id));
    assert.ok(a?.derived, `${id} opens its judged article`);
  }
  // A section that says Edwardsiella causes "hole in the head" in catfish must
  // not be offered for Hexamita's hole-in-the-head in cichlids: same words,
  // different disease. And carp pox, where the bank and the lecture disagree,
  // is left unlinked rather than sent to a section that takes neither side.
  assert.equal(QUESTION_LINKS['202184'], undefined);
  assert.equal(QUESTION_LINKS['202453'], undefined);
});

test('npm run stats prints each subject\'s question-to-article coverage', async () => {
  await loadQB();
  const run = spawnSync(process.execPath, [path.join(ROOT, 'scripts/stats.mjs')], { cwd: ROOT, encoding: 'utf8' });
  assert.match(run.stdout, /## VetWiki coverage of questions/);
  for (const subject of ['aquatic-clinic', 'equine-repro']) {
    const live = QB.filter((q) => q.subject === subject && isQuestionDeliverable(q));
    const reached = live.filter((q) => articleForQuestion(q)).length;
    const row = run.stdout.split('\n').find((l) => l.startsWith(`| ${subject} |`));
    assert.ok(row, `${subject} has a coverage row`);
    const cells = row.split('|').map((c) => c.trim());
    assert.equal(Number(cells[2]), live.length, `${subject}: questions`);
    assert.equal(Number(cells[3]), reached, `${subject}: reach an article`);
  }
});
