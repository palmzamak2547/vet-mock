// Count questions whose own examScope disagrees with their topic's, and say
// which subjects and topics they sit in. Read-only; prints a table.
//
// The two fields do not mean the same thing. A topic's examScope is THIS
// year's timetable. A question's is the paper it was recorded from, often
// another cohort's. This script exists so the disagreement is measured before
// anybody changes either one.
//
// --check (in lint:exam-scope) fails when the hard disagreements grow: a
// question recorded from one paper filed under a topic this year's timetable
// puts on the OTHER paper (midterm against final), in a year the timetable
// covers. The topic decides, so such a question sits in the other paper's
// pile; often it is simply on the wrong topic (Rule 10 in AGENTS.md). Fix the
// filing or the topic's paper and lower the budget; raise it only with the
// cohort's own sheet as the evidence, in the pull request.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const load = (p) => import(pathToFileURL(path.join(root, p)).href);

const { QB, loadQB } = await load('src/data/questions.js');
const { SUBJECTS } = await load('src/data/curriculum.js');
await loadQB();

const topicScope = new Map();
for (const s of SUBJECTS) {
  for (const t of s.topics || []) {
    if (t?.examScope) topicScope.set(`${s.id}/${t.id}`, t.examScope);
  }
}

let agree = 0, contra = 0, qOnly = 0, tOnly = 0, neither = 0;
const rows = new Map();
for (const q of QB) {
  const ts = topicScope.get(`${q.subject}/${q.topic}`) || null;
  const qs = q.examScope || null;
  if (qs && ts) {
    if (qs === ts) agree++;
    else {
      contra++;
      const key = `${q.subject}/${q.topic}  question=${qs}  topic=${ts}`;
      rows.set(key, (rows.get(key) || 0) + 1);
    }
  } else if (qs) qOnly++;
  else if (ts) tOnly++;
  else neither++;
}

if (process.argv.includes('--check')) {
  const { PAPER_COVERED_YEARS } = await load('src/data/exam-papers.generated.js');
  const { SUBJECTS_BY_YEAR } = await load('src/data/curriculum.js');
  const HARD_CONTRADICTION_BUDGET = 10;
  const covered = new Set(PAPER_COVERED_YEARS.flatMap((y) => (SUBJECTS_BY_YEAR[y] || []).map((s) => s.id)));
  const hard = [...rows.entries()].filter(([key]) => covered.has(key.split('/')[0])
    && /question=(midterm|final) {2}topic=(midterm|final)$/.test(key));
  const n = hard.reduce((sum, [, v]) => sum + v, 0);
  for (const [k, v] of hard) console.log(String(v).padStart(4), k);
  if (n > HARD_CONTRADICTION_BUDGET) {
    console.error(`\n❌ ${n} question(s) recorded from one paper sit on a topic this year puts on the other (budget ${HARD_CONTRADICTION_BUDGET}). Check the filing against the cohort's sheet (AGENTS.md Rule 10).`);
    process.exit(1);
  }
  if (n < HARD_CONTRADICTION_BUDGET) console.log(`⚠️  only ${n} left: lower HARD_CONTRADICTION_BUDGET in ${path.basename(fileURLToPath(import.meta.url))} to ${n}`);
  console.log(`✓ ${n} hard scope contradiction(s) in the timetable's years, budget ${HARD_CONTRADICTION_BUDGET}`);
  process.exit(0);
}

console.log(JSON.stringify({ total: QB.length, agree, contra, questionOnly: qOnly, topicOnly: tOnly, neither }, null, 2));
console.log('');
for (const [k, v] of [...rows.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(String(v).padStart(4), k);
}
