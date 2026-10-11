#!/usr/bin/env node
// ============================================================
// eval-vetwiki-retrieval.mjs — how often ถามคลังความรู้ finds the answer
// ============================================================
// Runs every question in tests/fixtures/vetwiki-ask-eval.json through the
// same retrieval the endpoint uses (src/lib/vetwiki/retrieve.js) and reports:
//
//   hit@5     share of answerable questions with at least one expected
//             section in the top 5 (the model only answers from what it is
//             shown, so a miss here is an answer that cannot be right)
//   recall@5  expected sections found in the top 5 / min(expected, 5),
//             averaged
//   MRR@10    1 / rank of the first expected section, 0 past rank 10
//   empty     of the questions VetWiki does not cover, how many the
//             retrieval recognises: either not covered at all, or covered
//             only around a named term the corpus never uses (that term
//             comes back in `unmatched`, and the endpoint tells the model
//             and the student that VetWiki has nothing on it)
//
// The fixture is checked first: every expected id must exist, every
// evidence string must appear in an expected section, and every `absent`
// term must still be absent from the corpus. A stale key fails loudly
// rather than grading retrieval against an answer that moved.
//
//   node scripts/eval-vetwiki-retrieval.mjs            report + misses
//   node scripts/eval-vetwiki-retrieval.mjs --holdout  the blind second set
//   node scripts/eval-vetwiki-retrieval.mjs --json     machine-readable
//   node scripts/eval-vetwiki-retrieval.mjs --all      every question's top 5
//
// tests/fixtures/vetwiki-ask-eval-holdout.json was written by a second
// author who saw only the corpus, and measured before any change was made
// with it in view. Keep it that way: tune on the main set, read the holdout.
//
// Pure and deterministic: no network, no model.
// ============================================================

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const FIXTURE = new URL('../tests/fixtures/vetwiki-ask-eval.json', import.meta.url);
const HOLDOUT = new URL('../tests/fixtures/vetwiki-ask-eval-holdout.json', import.meta.url);

export function loadEval({ holdout = false } = {}) {
  return JSON.parse(readFileSync(holdout ? HOLDOUT : FIXTURE, 'utf8'));
}

/** Every section of the governed corpus, as the retrieval sees it. */
async function corpusSections() {
  const { listTopics } = await import('../src/lib/vetwiki/index.js');
  const { indexTopic } = await import('../src/lib/vetwiki/search.js');
  const out = new Map();
  for (const t of listTopics()) {
    const idx = indexTopic(t.subject, t.topic);
    for (const s of idx?.sections || []) out.set(s.id, s.text);
  }
  return out;
}

/** Problems with the fixture itself (empty array = sound). */
export async function checkFixture(data = loadEval()) {
  const sections = await corpusSections();
  const problems = [];
  const seen = new Set();
  for (const item of data.items) {
    if (seen.has(item.id)) problems.push(`${item.id}: duplicate id`);
    seen.add(item.id);
    if (!item.q || typeof item.q !== 'string') problems.push(`${item.id}: no question`);
    if (!Array.isArray(item.expect)) { problems.push(`${item.id}: expect must be an array`); continue; }
    if (item.expect.length === 0) {
      if (!Array.isArray(item.absent) || item.absent.length === 0) {
        problems.push(`${item.id}: an expected-empty item must name the absent terms`);
      }
      for (const term of item.absent || []) {
        const where = [...sections].find(([, text]) => text.includes(term.toLowerCase()));
        if (where) problems.push(`${item.id}: "${term}" is no longer absent (found in ${where[0]})`);
      }
      continue;
    }
    for (const id of item.expect) {
      if (!sections.has(id)) problems.push(`${item.id}: unknown section ${id}`);
    }
    for (const ev of item.evidence || []) {
      const found = item.expect.some((id) => (sections.get(id) || '').includes(ev.toLowerCase()));
      if (!found) problems.push(`${item.id}: evidence "${ev}" is in none of the expected sections`);
    }
    if (!item.evidence?.length) problems.push(`${item.id}: no evidence strings`);
  }
  return problems;
}

/**
 * Score a retrieval function over the fixture.
 * @param {(q: string) => { picks: Array<{sectionId: string}>, covered?: boolean }} retrieve
 */
export function scoreRetrieval(retrieve, data = loadEval()) {
  const k = data.k || 5;
  const rows = [];
  for (const item of data.items) {
    const result = retrieve(item.q);
    const picks = Array.isArray(result) ? result : (result?.picks || []);
    const covered = Array.isArray(result) ? picks.length > 0 : result?.covered !== false && picks.length > 0;
    const unmatched = Array.isArray(result) ? [] : (result?.unmatched || []);
    const ids = picks.map((p) => p.sectionId);
    if (item.expect.length === 0) {
      rows.push({ id: item.id, lang: item.lang, empty: true, ok: !covered || unmatched.length > 0, unmatched, top: ids.slice(0, k) });
      continue;
    }
    const want = new Set(item.expect);
    const topK = ids.slice(0, k);
    const found = topK.filter((id) => want.has(id)).length;
    const firstRank = ids.slice(0, 10).findIndex((id) => want.has(id));
    rows.push({
      id: item.id,
      lang: item.lang,
      empty: false,
      hit: found > 0,
      recall: found / Math.min(want.size, k),
      rr: firstRank >= 0 ? 1 / (firstRank + 1) : 0,
      rank: firstRank >= 0 ? firstRank + 1 : null,
      covered,
      top: topK,
    });
  }
  const answerable = rows.filter((r) => !r.empty);
  const empties = rows.filter((r) => r.empty);
  const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const byLang = {};
  for (const lang of [...new Set(answerable.map((r) => r.lang))].sort()) {
    const rs = answerable.filter((r) => r.lang === lang);
    byLang[lang] = { n: rs.length, hit: mean(rs.map((r) => (r.hit ? 1 : 0))) };
  }
  return {
    k,
    answerable: answerable.length,
    expectedEmpty: empties.length,
    hitAtK: mean(answerable.map((r) => (r.hit ? 1 : 0))),
    recallAtK: mean(answerable.map((r) => r.recall)),
    mrr10: mean(answerable.map((r) => r.rr)),
    emptyCorrect: mean(empties.map((r) => (r.ok ? 1 : 0))),
    byLang,
    rows,
  };
}

/** The production retrieval, wrapped for scoring. */
export async function productionRetrieve() {
  const mod = await import('../src/lib/vetwiki/retrieve.js');
  if (typeof mod.retrieveForQuestion === 'function') {
    return (q) => mod.retrieveForQuestion(q, { maxSections: 10 });
  }
  return (q) => mod.retrieveSections(q, { maxSections: 10 });
}

const pct = (x) => `${(100 * x).toFixed(1)}%`;

async function main() {
  const args = new Set(process.argv.slice(2));
  const data = loadEval({ holdout: args.has('--holdout') });
  const problems = await checkFixture(data);
  if (problems.length) {
    console.error(`The eval fixture has ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  const report = scoreRetrieval(await productionRetrieve(), data);
  if (args.has('--json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`VetWiki retrieval eval${args.has('--holdout') ? ' (blind holdout)' : ''} — ${report.answerable} answerable + ${report.expectedEmpty} not covered`);
  console.log(`  hit@${report.k}     ${pct(report.hitAtK)}`);
  console.log(`  recall@${report.k}  ${pct(report.recallAtK)}`);
  console.log(`  MRR@10    ${report.mrr10.toFixed(3)}`);
  console.log(`  not covered, said so: ${pct(report.emptyCorrect)}`);
  for (const [lang, v] of Object.entries(report.byLang)) console.log(`  ${lang.padEnd(6)} hit@${report.k} ${pct(v.hit)} (n=${v.n})`);
  const show = args.has('--all') ? report.rows : report.rows.filter((r) => (r.empty ? !r.ok : !r.hit));
  if (show.length) console.log(args.has('--all') ? '\nEvery question:' : '\nMisses:');
  for (const r of show) {
    const q = data.items.find((i) => i.id === r.id);
    const mark = r.empty ? (r.ok ? 'empty ok' : 'empty MISS') : (r.hit ? `hit r${r.rank}` : 'MISS');
    console.log(`\n[${mark}] ${r.id}: ${q.q}`);
    if (!r.empty) console.log(`  want: ${q.expect.join('  ')}`);
    else console.log(`  unmatched: ${(r.unmatched || []).join(', ') || '(none)'}`);
    for (const id of r.top) console.log(`   - ${id}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
