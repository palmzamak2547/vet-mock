// Count questions whose own examScope disagrees with their topic's, and say
// which subjects and topics they sit in. Read-only; prints a table.
//
// The two fields do not mean the same thing. A topic's examScope is THIS
// year's timetable. A question's is the paper it was recorded from, often
// another cohort's. This script exists so the disagreement is measured before
// anybody changes either one.
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

console.log(JSON.stringify({ total: QB.length, agree, contra, questionOnly: qOnly, topicOnly: tOnly, neither }, null, 2));
console.log('');
for (const [k, v] of [...rows.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(String(v).padStart(4), k);
}
