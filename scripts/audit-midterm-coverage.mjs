// What a student sitting THIS midterm would find missing.
//
// Palm's question was "ว่าอันไหน ข้อไหน ส่วนไหน ยังไม่มี — เอาแค่กลางภาคเท่านั้น".
// This answers it from the data rather than by reading PDFs: for every subject
// sitting a midterm this term, it lists each topic on that paper with the
// number of questions behind it, how many of those came from a real past paper,
// and whether a lecture summary and notes exist for it.
//
// Read-only. Prints a table per subject, worst-covered first.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const load = (p) => import(pathToFileURL(path.join(root, p)).href);

const { QB, loadQB } = await load('src/data/questions.js');
const { SUBJECTS_BY_YEAR, hiddenTopicIdsFor } = await load('src/data/curriculum.js');
const { questionInScope } = await load('src/lib/exam-scope.js');
const { isPastPaperQuestion, questionTopicId } = await load('src/lib/question-metadata.js');
const { isQuestionDeliverable } = await load('src/data/question-delivery.generated.js');
const { VIDEO_META } = await load('src/data/video-summaries-meta.js');
const { hasNoteTopic } = await load('src/data/notes-registry.generated.js');
await loadQB();

const YEAR = Number(process.argv.find((a) => /^--year=/.test(a))?.split('=')[1] || 5);
const PAPER = process.argv.find((a) => /^--paper=/.test(a))?.split('=')[1] || 'midterm';

// A lecture summary is attached to a subject, not a topic, so the best the
// registry can say is how many exist for the subject. Stated as such.
const summariesBySubject = {};
for (const meta of Object.values(VIDEO_META)) {
  if (!meta?.subject) continue;
  summariesBySubject[meta.subject] = (summariesBySubject[meta.subject] || 0) + 1;
}

const rows = [];
for (const subject of SUBJECTS_BY_YEAR[YEAR] || []) {
  const hidden = hiddenTopicIdsFor(subject.id);
  const onPaper = (subject.topics || []).filter((t) => !t.hidden
    && (!t.examScope || t.examScope === PAPER || t.examScope === 'both'));
  if (!onPaper.length) continue;

  const pool = QB.filter((q) => q.subject === subject.id
    && isQuestionDeliverable(q)
    && !hidden.has(q.topic)
    && questionInScope(q, PAPER));

  const byTopic = new Map();
  for (const q of pool) {
    const t = questionTopicId(q);
    const cur = byTopic.get(t) || { n: 0, past: 0 };
    cur.n += 1;
    if (isPastPaperQuestion(q)) cur.past += 1;
    byTopic.set(t, cur);
  }

  rows.push({ subject, onPaper, byTopic, total: pool.length });
}

rows.sort((a, b) => {
  const aThin = a.onPaper.filter((t) => (a.byTopic.get(t.id)?.n || 0) < 5).length;
  const bThin = b.onPaper.filter((t) => (b.byTopic.get(t.id)?.n || 0) < 5).length;
  return bThin - aThin;
});

console.log(`# ${PAPER} coverage, year ${YEAR}\n`);
let thinTotal = 0;
let emptyTotal = 0;
for (const { subject, onPaper, byTopic, total } of rows) {
  const thin = onPaper.filter((t) => (byTopic.get(t.id)?.n || 0) < 5);
  const empty = onPaper.filter((t) => (byTopic.get(t.id)?.n || 0) === 0);
  thinTotal += thin.length;
  emptyTotal += empty.length;
  console.log(`## ${subject.name} (${subject.id}) — ${total} ข้อ, ${onPaper.length} หัวข้อบนกระดาษ`
    + `, สรุปคลิป ${summariesBySubject[subject.id] || 0} คาบ`);
  // The heading counts lecture CLIPS; this column checks written NOTES. Calling
  // both of them สรุป in one table misread as "this topic has a clip summary".
  console.log('| หัวข้อ | ข้อ | จากข้อสอบเก่า | โน้ต |');
  console.log('|---|---:|---:|---|');
  for (const t of [...onPaper].sort((a, b) => (byTopic.get(a.id)?.n || 0) - (byTopic.get(b.id)?.n || 0))) {
    const c = byTopic.get(t.id) || { n: 0, past: 0 };
    console.log(`| ${t.label} | ${c.n} | ${c.past} | ${hasNoteTopic(subject.id, t.id) ? 'มี' : '—'} |`);
  }
  console.log('');
}
console.log(`ว่างเปล่า ${emptyTotal} หัวข้อ · ต่ำกว่า 5 ข้อ ${thinTotal} หัวข้อ`);
