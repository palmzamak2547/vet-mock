#!/usr/bin/env node
// ============================================================
// scorecard.mjs — how good is the data, as six numbers
// ============================================================
// Usage:  npm run scorecard                 the six numbers, with the counts behind each
//         npm run scorecard -- --json       the same, plus every defect id, for machines
//         npm run scorecard -- --backtest   the past-paper backtest per subject and per paper
//         npm run scorecard -- --full       also run the slow guards (exam recurrence, ~30 s)
//
// The owner's six properties (14 Nov 2026), each a share of the deliverable
// bank or of the guards, with the counts that move it:
//   1 Organised    every question has one home (topic, paper scope, source
//                  type, sitting cohort for a past paper) and is not a copy
//   2 Correct      its key rests on a primary or reliable source (a library
//                  slide matched to it, a cited moment of this year's lecture,
//                  a reference list) and carries no open doubt
//   3 Linked       its topic, its VetWiki article and its source pointer all
//                  resolve
//   4 Retrievable  every count a button prints equals what the tap serves
//   5 Stable       the guards in lint:data run green with no slack left in
//                  their budgets
//   6 Predictive   the past-paper ordering (Panic Mode's bands) against a
//                  shuffle, on papers it has not seen (scripts/lib/backtest.mjs)
//
// It measures only: nothing is written. It reuses what the repo already
// computes (the generated counts, the delivery gate, the evidence index, the
// recurrence tables, and the exported checks of lint:provenance,
// lint:source-docs, lint:citation-moments, lint:dupes, lint:evidence) and
// runs the remaining lint:data guards as they are. Read docs/DATA-INTEGRITY-
// ROADMAP.md, "Scorecard", before changing what a number means.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

export const PROPERTIES = Object.freeze(['organised', 'correct', 'linked', 'retrievable', 'stable', 'predictive']);
// Guards slower than the rest together; --full runs them.
export const SLOW_GUARDS = Object.freeze(['lint:exam-recurrence']);
// Guards that judge the built bundle, not the data.
const NOT_DATA = new Set(['lint:dist', 'typecheck']);

const pct = (part, whole) => (whole ? Math.round((1000 * part) / whole) / 10 : null);
const key = (q) => `${q.subject}:${q.id}`;

// ── Load ──────────────────────────────────────────────────────────────────

export async function loadContext() {
  const [{ BANK_REGISTRY }, delivery, curriculum, scope, meta, origins, schedule] = await Promise.all([
    imp('src/data/bank-registry.generated.js'),
    imp('src/data/question-delivery.generated.js'),
    imp('src/data/curriculum.js'),
    imp('src/lib/exam-scope.js'),
    imp('src/lib/question-metadata.js'),
    imp('src/data/exam-origins.js'),
    imp('src/data/schedule.js'),
  ]);
  const all = [];
  for (const entry of BANK_REGISTRY) all.push(...(await entry.load()));
  const questions = all.filter(delivery.isQuestionDeliverable);
  const topicsOf = new Map(curriculum.SUBJECTS.map((s) => [s.id, new Map((s.topics || []).map((t) => [t.id, t]))]));
  // A subject with a paper still to sit reaches the cohort studying now; the
  // reach proxy for ranking defects (usage itself is not measured).
  const now = new Date();
  const ahead = new Set();
  for (const entries of Object.values(schedule.EXAM_SCHEDULE)) {
    for (const e of entries || []) {
      if (e?.subject && e.term && schedule.msUntilExam(e, now) + (e.duration_min || 180) * 60_000 > 0) ahead.add(e.subject);
    }
  }
  return { all, questions, blocked: delivery.BLOCKED_QUESTIONS, curriculum, topicsOf, scope, meta, origins, ahead };
}

// ── 1. Organised ──────────────────────────────────────────────────────────

export async function organised(ctx) {
  const { sittingOf, isPaperEvidence } = await imp('scripts/regen-exam-recurrence.mjs');
  const { exactDuplicateGroups, checkNearDuplicates, KNOWN_NEAR_DUPLICATES } = await imp('scripts/lint-q-dupes.mjs');
  const { EXAM_RECURRENCE_CLUSTERS } = await imp('src/data/exam-recurrence.generated.js');
  const types = new Set(Object.keys(ctx.origins.SOURCE_TYPES));
  const d = { noTopic: [], topicNotInCurriculum: [], scopeUnknown: [], noSourceType: [], pastPaperNoCohort: [], duplicateCopies: [] };
  for (const q of ctx.questions) {
    const k = key(q);
    if (!q.topic) d.noTopic.push(k);
    else if (!ctx.topicsOf.get(q.subject)?.has(q.topic)) d.topicNotInCurriculum.push(k);
    if (ctx.scope.scopeOfQuestion(q) == null) d.scopeUnknown.push(k);
    if (!types.has(q.sourceType)) d.noSourceType.push(k);
    if (isPaperEvidence(q) && !sittingOf(q).cohorts.length) d.pastPaperNoCohort.push(k);
  }
  // Copies: exact stem groups, near pairs still waiting for their merge, and
  // same-item clusters that are NOT recurrence evidence (fewer than two
  // sitting cohorts): the same item stored twice. Every copy beyond the first.
  const deliverable = new Set(ctx.questions.map(key));
  const copies = new Set();
  for (const [, group] of exactDuplicateGroups(ctx.questions).groups) for (const q of group.slice(1)) copies.add(key(q));
  // Near pairs lint:dupes lists as known and awaiting a merge, or newly found: the one not kept is the copy.
  const near = checkNearDuplicates(ctx.questions);
  const found = new Set(near.found.map((p) => [p.a, p.b].sort().join('|')));
  for (const e of KNOWN_NEAR_DUPLICATES) {
    if (found.has([...e.pair].sort().join('|'))) copies.add(e.pair.find((x) => x !== e.keep));
  }
  for (const p of near.duplicates) copies.add([p.a, p.b].sort()[1]);
  d.nearContradictions = near.contradictions.map((p) => `${p.a}|${p.b}`);
  for (const c of EXAM_RECURRENCE_CLUSTERS) {
    if (c.cohorts.length >= 2) continue;
    for (const [k] of c.members.slice(1)) if (deliverable.has(k)) copies.add(k);
  }
  d.duplicateCopies = [...copies].sort();
  const { SUBJECT_PAPERS } = await imp('src/data/exam-papers.generated.js');
  // Unknown scope is a defect only where a paper is sat this year. In a course
  // the timetable does not hold, unknown is the true answer (AGENTS.md rule
  // 10: an absence is never read as "no exam"); it is listed, not scored.
  d.scopeUnknownOnPaper = d.scopeUnknown.filter((k) => SUBJECT_PAPERS[k.split(':')[0]]);
  const unknownOnPaper = d.scopeUnknownOnPaper.length;
  const bad = new Set([...d.noTopic, ...d.topicNotInCurriculum, ...d.scopeUnknownOnPaper, ...d.noSourceType, ...d.pastPaperNoCohort, ...d.duplicateCopies]);
  const n = ctx.questions.length;
  return {
    headline: pct(n - bad.size, n),
    label: 'questions with one complete home and no copy',
    behind: {
      'no source type': d.noSourceType.length,
      'paper scope unknown where a paper is sat this year (elsewhere, not scored)': `${unknownOnPaper} (${d.scopeUnknown.length - unknownOnPaper})`,
      'past paper with no sitting cohort': d.pastPaperNoCohort.length,
      'topic missing or not in the curriculum': d.noTopic.length + d.topicNotInCurriculum.length,
      'stored copies of one item': d.duplicateCopies.length,
      'near pairs that contradict each other': d.nearContradictions.length,
    },
    total: n,
    defects: d,
  };
}

// ── 2. Correct ────────────────────────────────────────────────────────────

export async function correct(ctx) {
  const { citesIn } = await imp('scripts/lint-citation-moments.mjs');
  const { evidenceHash } = await imp('src/lib/evidence-hash.js');
  const { lintEvidence } = await imp('scripts/lint-evidence.mjs');
  const evidenceDir = path.join(ROOT, 'src/data/evidence');
  const slide = new Map();
  for (const f of fs.readdirSync(evidenceDir).filter((x) => x.endsWith('.generated.js') && x !== 'loaders.generated.js')) {
    const { EVIDENCE } = await import(pathToFileURL(path.join(evidenceDir, f)).href);
    const subject = f.replace('.generated.js', '');
    for (const [id, row] of Object.entries(EVIDENCE?.q || {})) slide.set(`${subject}:${id}`, row?.[5]);
  }
  const d = { openFlagMajor: [], openFlagMinor: [], openFlagUnclear: [], noPrimarySource: [], slideStale: [] };
  let bySlide = 0; let byLecture = 0; let byReference = 0;
  for (const q of ctx.questions) {
    const k = key(q);
    const hash = slide.get(k);
    const slideOk = hash != null && hash === evidenceHash(q);
    if (hash != null && !slideOk) d.slideStale.push(k);
    const lecture = [q.verified, q.source].some((t) => typeof t === 'string' && citesIn(t).length > 0);
    const reference = (Array.isArray(q.verificationSources) && q.verificationSources.length > 0) || q.answerStatus === 'verified';
    if (slideOk) bySlide++; if (lecture) byLecture++; if (reference) byReference++;
    if (!slideOk && !lecture && !reference) d.noPrimarySource.push(k);
    if (q.flag) {
      const sev = String(q.flag.severity || 'unclear').toLowerCase();
      (sev === 'major' ? d.openFlagMajor : sev === 'minor' ? d.openFlagMinor : d.openFlagUnclear).push(k);
    }
  }
  d.heldForReview = ctx.blocked.map((b) => b.key);
  const ev = await lintEvidence();
  const bad = new Set([...d.noPrimarySource, ...d.openFlagMajor, ...d.openFlagMinor, ...d.openFlagUnclear]);
  const n = ctx.questions.length;
  return {
    headline: pct(n - bad.size, n),
    label: 'questions whose key a machine can follow to a primary or reliable source, with no open doubt',
    behind: {
      'key on a library slide matched to it': bySlide,
      'key on a cited moment of the lecture': byLecture,
      'key on a reference list or a verified status': byReference,
      'no primary or reliable source': d.noPrimarySource.length,
      'open doubt on the card (major/minor/unclear)': `${d.openFlagMajor.length}/${d.openFlagMinor.length}/${d.openFlagUnclear.length}`,
      'held out of every pool, waiting for a check': d.heldForReview.length,
      'slides waiting to be matched again': ev.stale,
    },
    total: n,
    defects: d,
  };
}

// ── 3. Linked ─────────────────────────────────────────────────────────────

export async function linked(ctx) {
  const { articleForQuestion } = await imp('src/lib/vetwiki/registry-lite.js');
  const cm = await imp('scripts/lint-citation-moments.mjs');
  const sd = await imp('scripts/lint-source-docs.mjs');
  const { checkFigures } = await imp('scripts/lint-provenance.mjs');
  const [{ SOURCE_DOCS }, recordings] = await Promise.all([imp('src/data/source-docs.js'), cm.loadRecordings(ROOT)]);
  const moments = cm.checkCitationMoments({ questions: ctx.questions, recordings });
  const docs = sd.checkSourceDocs({ questions: ctx.questions, docs: SOURCE_DOCS, subjects: new Set(ctx.curriculum.SUBJECTS.map((s) => s.id)) });
  const figures = checkFigures(ctx.questions);
  const brokenAt = new Set([...moments.faults.map((f) => f.where.split(' ')[0]), ...docs.errors.map((e) => e.split(':')[0])]
    .map((w) => w.replace('#', ':')));
  const evidenceDir = path.join(ROOT, 'src/data/evidence');
  const slides = new Set();
  for (const f of fs.readdirSync(evidenceDir).filter((x) => x.endsWith('.generated.js') && x !== 'loaders.generated.js')) {
    const { EVIDENCE } = await import(pathToFileURL(path.join(evidenceDir, f)).href);
    for (const id of Object.keys(EVIDENCE?.q || {})) slides.add(`${f.replace('.generated.js', '')}:${id}`);
  }
  const d = { topicUnresolved: [], noWikiArticle: [], pointerTextOnly: [], noPointer: [], brokenPointer: [] };
  for (const q of ctx.questions) {
    const k = key(q);
    if (!q.topic || !ctx.topicsOf.get(q.subject)?.has(q.topic)) d.topicUnresolved.push(k);
    if (!articleForQuestion(q)) d.noWikiArticle.push(k);
    if (brokenAt.has(k)) { d.brokenPointer.push(k); continue; }
    const structured = Array.isArray(q.sourcePages) && q.sourcePages.length > 0;
    const video = [q.verified, q.source].some((t) => typeof t === 'string' && cm.citesIn(t).length > 0);
    if (structured || video || slides.has(k)) continue;
    const pages = sd.citationChunks(q).some((c) => sd.pageNumbers(c).length > 0);
    (pages ? d.pointerTextOnly : d.noPointer).push(k);
  }
  const bad = new Set(Object.values(d).flat());
  const n = ctx.questions.length;
  return {
    headline: pct(n - bad.size, n),
    label: 'questions whose topic, wiki article and source pointer all resolve',
    behind: {
      'no VetWiki article reachable': d.noWikiArticle.length,
      'source pointer is page text a machine cannot follow': d.pointerTextOnly.length,
      'no page, slide or lecture-moment pointer at all': d.noPointer.length,
      'pointer that does not resolve': d.brokenPointer.length,
      'topic that does not resolve': d.topicUnresolved.length,
      'figures missing on disk': figures.counts.missing,
      'lecture moments checked / faults': `${moments.checked}/${moments.faults.length}`,
    },
    total: n,
    defects: d,
  };
}

// ── 4. Retrievable ────────────────────────────────────────────────────────

export async function retrievable(ctx) {
  const counts = await imp('src/data/q-counts.js');
  const { buildExamPool } = await imp('src/lib/exam-pool.js');
  const { yearForSubject } = ctx.curriculum;
  const cells = [];
  // A named subject's pool starts from that subject's rows, so handing it
  // only those rows serves the same set, thousands of times faster.
  const rowsOf = new Map();
  for (const q of ctx.all) {
    if (!rowsOf.has(q.subject)) rowsOf.set(q.subject, []);
    rowsOf.get(q.subject).push(q);
  }
  const pool = (subject, extra = {}) => buildExamPool({
    questions: rowsOf.get(subject) || [], practiceMode: 'all', subject, topic: null, questionCategory: 'all',
    selectedYear: yearForSubject ? yearForSubject(subject) : null, selectedPhase: null, ...extra,
  });
  const check = (where, promised, served) => cells.push({ where, promised, served, ok: promised === served });
  for (const [subject, n] of Object.entries(counts.Q_VISIBLE_COUNTS_BY_SUBJECT || {})) {
    const p = pool(subject);
    check(`subject ${subject}`, n, p.length);
    if (counts.Q_PANIC_COUNTS_BY_SUBJECT && subject in counts.Q_PANIC_COUNTS_BY_SUBJECT) {
      check(`panic ${subject}`, counts.Q_PANIC_COUNTS_BY_SUBJECT[subject], ctx.meta.panicPool(p.slice()).length);
    }
  }
  // A topic cell no card prints (no topic, or one the curriculum does not
  // list) is not a promise; it is counted apart, and its questions are the
  // defect under Organised and Linked.
  const carded = (subject, topic) => ctx.topicsOf.get(subject)?.has(topic);
  let uncarded = 0;
  for (const [subject, topics] of Object.entries(counts.Q_COUNTS_BY_TOPIC || {})) {
    for (const [topic, n] of Object.entries(topics)) {
      if (!carded(subject, topic)) { uncarded++; continue; }
      check(`topic ${subject}/${topic}`, n, pool(subject, { topic }).length);
      const past = counts.Q_PAST_PAPER_COUNTS_BY_TOPIC?.[subject]?.[topic];
      if (past != null) check(`past ${subject}/${topic}`, past, pool(subject, { topic, onlyPastPaper: true }).length);
    }
  }
  // Once a paper is chosen: the same promises, per phase.
  for (const [phase, subjects] of Object.entries(counts.Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE || {})) {
    for (const [subject, n] of Object.entries(subjects)) check(`subject ${subject} @${phase}`, n, pool(subject, { selectedPhase: phase }).length);
  }
  for (const [phase, subjects] of Object.entries(counts.Q_COUNTS_BY_TOPIC_BY_SCOPE || {})) {
    for (const [subject, topics] of Object.entries(subjects)) {
      for (const [topic, n] of Object.entries(topics)) {
        if (!carded(subject, topic)) { uncarded++; continue; }
        check(`topic ${subject}/${topic} @${phase}`, n, pool(subject, { topic, selectedPhase: phase }).length);
        const past = counts.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE?.[phase]?.[subject]?.[topic];
        if (past != null) check(`past ${subject}/${topic} @${phase}`, past, pool(subject, { topic, selectedPhase: phase, onlyPastPaper: true }).length);
      }
    }
  }
  // A question no topic card opens: its topic is missing, unknown to the
  // curriculum, or hidden. It is still in the subject's set, so it is not
  // lost, but no tap on a topic finds it.
  const d = { countMismatch: cells.filter((c) => !c.ok), noTopicCard: [] };
  for (const q of ctx.questions) {
    const t = ctx.topicsOf.get(q.subject)?.get(q.topic);
    if (!t || t.hidden) d.noTopicCard.push(key(q));
  }
  // A question is retrievable when a topic card opens it and every count
  // printed for its subject and topic equals what the tap serves.
  const wrongCell = new Set();
  for (const c of d.countMismatch) {
    const m = c.where.match(/^(?:subject|panic|topic|past) ([^/@\s]+)(?:\/([^@\s]+))?/);
    if (m) wrongCell.add(m[2] ? `${m[1]}/${m[2]}` : m[1]);
  }
  const noCard = new Set(d.noTopicCard);
  const reachable = ctx.questions.filter((q) => !noCard.has(key(q)) && !wrongCell.has(q.subject) && !wrongCell.has(`${q.subject}/${q.topic}`)).length;
  return {
    headline: pct(reachable, ctx.questions.length),
    label: 'questions a topic card opens, under counts that equal what the tap serves',
    behind: {
      'count cells compared': cells.length,
      'cells that disagree': d.countMismatch.length,
      'cells no card prints (topic outside the curriculum), not compared': uncarded,
      'questions no topic card opens': d.noTopicCard.length,
    },
    total: ctx.questions.length,
    defects: d,
  };
}

// ── 5. Stable ─────────────────────────────────────────────────────────────

/** The node commands lint:data runs, expanded through npm run chains. */
export function dataGuards(pkg) {
  const scripts = pkg.scripts || {};
  const out = [];
  const seen = new Set();
  const walk = (name) => {
    if (seen.has(name) || NOT_DATA.has(name)) return;
    seen.add(name);
    for (const part of String(scripts[name] || '').split('&&').map((s) => s.trim()).filter(Boolean)) {
      const npm = part.match(/^npm run ([\w:-]+)(?:\s+--\s+(.*))?$/);
      if (npm && !npm[2]) walk(npm[1]);
      else if (npm) out.push({ name: npm[1], cmd: `${scripts[npm[1]]} ${npm[2]}`.trim() });
      else if (/^node\s/.test(part)) out.push({ name, cmd: part });
    }
  };
  walk('lint:data');
  return out;
}

function run(cmd) {
  return new Promise((resolve) => {
    const [, ...args] = cmd.split(/\s+/);
    const child = spawn(process.execPath, args, { cwd: ROOT, env: { ...process.env, FORCE_COLOR: '0' } });
    let text = '';
    child.stdout.on('data', (b) => { text += b; });
    child.stderr.on('data', (b) => { text += b; });
    child.on('close', (code) => resolve({ code, text }));
    child.on('error', (e) => resolve({ code: -1, text: String(e) }));
  });
}

export const SLACK = /lower [\w.]+ to \d+|under the budget of|below its budget|lower it to \d+/i;
export const MISSING_DEPENDENCY = /ERR_MODULE_NOT_FOUND|Cannot find (?:package|module)/;

export async function stable(ctx, { full = false } = {}) {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const guards = dataGuards(pkg).filter((g) => full || !SLOW_GUARDS.includes(g.name));
  const results = await Promise.all(guards.map(async (g) => ({ ...g, ...(await run(g.cmd)) })));
  const d = { red: [], slack: [], notRun: [], skipped: full ? [] : [...SLOW_GUARDS] };
  let tight = 0;
  for (const r of results) {
    if (r.code !== 0 && MISSING_DEPENDENCY.test(r.text)) { d.notRun.push(r.name); continue; }
    if (r.code !== 0) { d.red.push({ guard: r.name, tail: r.text.trim().split('\n').slice(-3).join(' | ').slice(0, 300) }); continue; }
    const slack = r.text.split('\n').filter((l) => SLACK.test(l));
    if (slack.length) d.slack.push({ guard: r.name, lines: slack.map((l) => l.trim().slice(0, 200)) });
    else tight++;
  }
  const ran = results.length - d.notRun.length;
  return {
    headline: pct(tight, ran),
    label: 'data guards green with no slack in their budgets',
    behind: {
      'guards run': ran,
      red: d.red.length,
      'green with budget slack': d.slack.length,
      'not run (a dependency is missing: npm ci)': d.notRun.length,
      'skipped as slow (--full runs them)': d.skipped.length,
    },
    total: ran,
    defects: d,
  };
}

// ── 6. Predictive ─────────────────────────────────────────────────────────

export async function predictive(ctx) {
  const { runBacktest } = await imp('scripts/lib/backtest.mjs');
  const bt = runBacktest(ctx.questions);
  const f = bt.overall.windows.forward['sibling.depth'];
  const conclusive = bt.subjects.filter((s) => s.conclusive).map((s) => s.subject);
  return {
    headline: f.lift,
    unit: 'x',
    label: 'past-paper order against a shuffle: siblings of an unseen paper in a topic\'s first 10, earlier cohorts only',
    behind: {
      'papers tested / items hidden': `${bt.overall.papers}/${bt.overall.items}`,
      'hidden items with any sibling left in their topic': bt.overall.windows.forward.coverable.sibling,
      'covered in the first 10: band order / shuffle (% of hidden)': `${f.appShare}/${f.randomShare}`,
      'papers where the order beat / lost to / tied a shuffle': `${f.papersBetter}/${f.papersWorse}/${f.papersTied}`,
      'subjects with enough papers to conclude': conclusive.length ? conclusive.join(', ') : 'none',
    },
    total: bt.overall.items,
    defects: { inconclusiveSubjects: bt.subjects.filter((s) => !s.conclusive).map((s) => s.subject) },
    backtest: bt,
  };
}

// ── Report ────────────────────────────────────────────────────────────────

export async function scorecard({ full = false } = {}) {
  const started = Date.now();
  const ctx = await loadContext();
  const [o, c, l, r, s, p] = await Promise.all([
    organised(ctx), correct(ctx), linked(ctx), retrievable(ctx), stable(ctx, { full }), predictive(ctx),
  ]);
  return {
    generatedAt: new Date().toISOString(),
    bank: { deliverable: ctx.questions.length, held: ctx.blocked.length, subjectsWithPaperAhead: [...ctx.ahead].sort() },
    properties: { organised: o, correct: c, linked: l, retrievable: r, stable: s, predictive: p },
    seconds: Math.round((Date.now() - started) / 100) / 10,
  };
}

const TITLES = { organised: 'Organised', correct: 'Correct', linked: 'Linked', retrievable: 'Retrievable', stable: 'Stable', predictive: 'Predictive' };

export function renderText(card) {
  const lines = [`VetMock data scorecard — ${card.bank.deliverable} deliverable questions (${card.bank.held} held for review)`, ''];
  PROPERTIES.forEach((name, i) => {
    const p = card.properties[name];
    const value = p.headline == null ? 'n/a' : p.unit === 'x' ? `${p.headline}x` : `${p.headline}%`;
    lines.push(`${i + 1}. ${TITLES[name].padEnd(12)} ${value.padStart(7)}  ${p.label}`);
    for (const [k, v] of Object.entries(p.behind)) lines.push(`${' '.repeat(23)}${k}: ${v}`);
    lines.push('');
  });
  lines.push(`measured in ${card.seconds} s; --json lists every defect id, --backtest the per-subject figures`);
  return lines.join('\n');
}

export function renderBacktest(bt) {
  const lines = ['Backtest — Panic Mode band order against a shuffle, one hidden paper at a time', ''];
  lines.push(`rule: papers with >= ${bt.rule.minItems} items; depth ${bt.rule.depth}; conclusive needs >= ${bt.rule.minPapers} papers and >= ${bt.rule.minCoverable} hidden items with a sibling left`);
  lines.push(`skipped: ${bt.skipped.papers} recorded papers under ${bt.rule.minItems} items (${bt.skipped.items} items)`, '');
  const head = 'subject              papers items | forward: sib@10 order/shuffle lift (+/-/=) | panic set lift | same item@10 | leave-one-out sib@10 lift';
  lines.push(head, '-'.repeat(head.length));
  const row = (s) => {
    const f = s.windows.forward; const l = s.windows.leaveOneOut;
    const a = f['sibling.depth']; const ps = f['sibling.panic']; const it = f['item.depth']; const lo = l['sibling.depth'];
    return `${String(s.subject || 'ALL').padEnd(20)} ${String(s.papers).padStart(6)} ${String(s.items).padStart(5)} | `
      + `${a.appShare}%/${a.randomShare}% x${a.lift ?? '-'} (+${a.papersBetter}/-${a.papersWorse}/=${a.papersTied}) | x${ps.lift ?? '-'} | `
      + `${it.appShare}%/${it.randomShare}% | x${lo.lift ?? '-'}${s.conclusive ? ''
        : s.papers < bt.rule.minPapers ? '   too few papers to conclude' : '   too few coverable items to conclude'}`;
  };
  for (const s of bt.subjects) lines.push(row(s));
  lines.push('-'.repeat(head.length), row(bt.overall), '');
  lines.push('per paper (forward window, sibling@10 order/shuffle, % of hidden items):');
  for (const p of bt.papers) {
    const a = p.windows.forward['sibling.depth'];
    lines.push(`  ${p.id.padEnd(34)} ${String(p.items).padStart(4)} items  ${((100 * a.app) / p.items).toFixed(1)}% / ${((100 * a.random) / p.items).toFixed(1)}%  (${p.windows.forward.coverable.sibling} coverable)`);
  }
  return lines.join('\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = new Set(process.argv.slice(2));
  if (args.has('--backtest')) {
    const ctx = await loadContext();
    const p = await predictive(ctx);
    if (args.has('--json')) process.stdout.write(`${JSON.stringify(p.backtest, null, 2)}\n`);
    else console.log(renderBacktest(p.backtest));
  } else {
    const card = await scorecard({ full: args.has('--full') });
    if (args.has('--json')) process.stdout.write(`${JSON.stringify(card, null, 2)}\n`);
    else console.log(renderText(card));
  }
}
