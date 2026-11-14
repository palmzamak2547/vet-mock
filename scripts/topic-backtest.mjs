// Topic-level backtest of the past-paper order (scripts/lib/topic-backtest.mjs).
// Usage: node scripts/topic-backtest.mjs [--json]
// History only: it measures earlier cohorts' papers and changes no ordering.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);
const { currentOrderFrom, universeFrom, taughtFrom } = await imp('scripts/lib/topic-backtest-inputs.mjs');
const { runTopicBacktest } = await imp('scripts/lib/topic-backtest.mjs');
const { EXAM_RECURRENCE } = await imp('src/data/exam-recurrence.generated.js');
const { BANK_REGISTRY } = await imp('src/data/bank-registry.generated.js');
const delivery = await imp('src/data/question-delivery.generated.js');
const curriculum = await imp('src/data/curriculum.js');
const { SYLLABI } = await imp('src/data/course-syllabi.js');

const all = [];
for (const e of BANK_REGISTRY) all.push(...(await e.load()));
const questions = all.filter(delivery.isQuestionDeliverable);
const bt = runTopicBacktest(EXAM_RECURRENCE, {
  universeOf: universeFrom(curriculum.SUBJECTS),
  currentOrder: currentOrderFrom(questions, EXAM_RECURRENCE),
  taughtOf: taughtFrom(SYLLABI),
});
if (process.argv.includes('--json')) { console.log(JSON.stringify(bt, null, 2)); process.exit(0); }
const names = Object.keys(bt.overall.mean);
const line = (label, s) => `${label.padEnd(20)} ${String(s.papers).padStart(3)} ${String(s.items).padStart(5)} ${s.conclusive ? ' ' : '*'} | `
  + names.map((n) => `${s.mean[n]['share@5']}`.padStart(5)).join(' ') + ' | rho ' + names.map((n) => `${s.mean[n].rho}`.padStart(6)).join(' ');
console.log(`share@5 mean per paper; columns: ${names.join(', ')}; * = too small to conclude`);
for (const s of bt.subjects) console.log(line(s.subject, s));
console.log(line('ALL', bt.overall));
console.log('\nshare@3 / share@half overall:');
for (const n of names) console.log(`  ${n.padEnd(22)} ${bt.overall.mean[n]['share@3']} / ${bt.overall.mean[n]['share@half']}   weighted@5 ${bt.overall.weighted[n]['share@5']}`);
console.log('\nverdicts vs current order:');
for (const [n, v] of Object.entries(bt.verdicts)) {
  const p = v.vsCurrent['share@5'];
  console.log(`  ${n.padEnd(22)} diff@5 ${p.meanDiff} [${p.lo}, ${p.hi}] +${p.better}/-${p.worse}/=${p.tied} | @3 ${v.vsCurrent['share@3'].meanDiff} @half ${v.vsCurrent['share@half'].meanDiff} rho ${v.vsCurrent.rho.meanDiff} | vsUniform ${v.vsUniform.meanDiff} [${v.vsUniform.lo}, ${v.vsUniform.hi}] | ${JSON.stringify(v.checks)} ${v.passes ? 'PASS' : 'fail'}`);
  console.log(`      subject gaps: ${v.subjectGaps.map((g) => `${g.subject} ${g.gap}`).join(', ')}`);
}
console.log('\nbaselines:', JSON.stringify(bt.baselines));
console.log('chosen:', bt.chosen, '| skipped', bt.skipped.small, 'small,', bt.skipped.noHistory, 'no earlier cohort');
