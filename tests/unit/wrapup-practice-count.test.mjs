// ============================================================
// The wrap-up's practice button serves what it says (B05, B50)
// ============================================================
// WrapUpView read one cell of the kind table, `kindTable[topic][format]`.
// A lecturer whose format is 'all' has no such cell, and a disease covered
// only by a matching set filed under another topic has match 0 with a
// `_matchCovers` beside it. So every item of equine medicine, equine repro
// and zoonoses, and six avian diseases, lost the ฝึก button, and other avian
// items printed "1 ชุด" while the session served 2 or 3. LecturerSets already
// counted these right; both now use src/lib/lecturer-count.js.
//
// Driven through the real WrapUpView source (fake-react harness) and the
// real session pool (buildExamPool with the arguments startLecturerPractice
// passes): every button's number equals the pool it opens, and an item with
// no button is one the session could not serve anything for.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { loadQB, QB } from '../../src/data/questions.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { WRAPUP_SUBJECTS, WRAPUP_SCOPE } from '../../src/data/exam-wrapups.js';
import { lecturerCount, topicPractice } from '../../src/lib/lecturer-count.js';
import { LECTURER_SETS } from '../../src/data/lecturer-sets.js';

let WrapUpView;
let LecturerSets;
before(async () => {
  await loadQB();
  const mod = await loadModule('src/views/WrapUpView.jsx', {
    stubs: [
      { match: '/lib/library\\.js$', contents: 'export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(null), fresh: Promise.resolve(null) }); export const readerPayload = (d) => d; export const recordRecentDoc = () => {};' },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
    ],
  });
  WrapUpView = mod.default;
  LecturerSets = (await loadModule('src/components/LecturerSets.jsx', {
    stubs: [{ match: '/lib/library\\.js$', contents: 'export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(null), fresh: Promise.resolve(null) }); export const readerPayload = (d) => d; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' }],
  })).default;
});

const served = (subject, topics, questionCategory, onlyPastPaper = false) => buildExamPool({
  questions: QB,
  practiceMode: 'all',
  subject,
  topic: null,
  questionCategory: questionCategory || 'all',
  selectedYear: WRAPUP_SCOPE.year,
  selectedPhase: WRAPUP_SCOPE.phase,
  onlyTopics: new Set(topics),
  onlyPastPaper,
}).length;

test('lecturerCount: all sums the kinds and skips the markers; match adds covers only when asked', () => {
  const table = { a: { mcq: 3, tf: 2, match: 0, writing: 1, _matchCovers: 2 }, b: { match: 1 } };
  assert.equal(lecturerCount(table, ['a'], 'all'), 6);
  assert.equal(lecturerCount(table, ['a'], 'match'), 0);
  assert.equal(lecturerCount(table, ['a'], 'match', { covers: true }), 2);
  assert.equal(lecturerCount(table, ['a', 'b'], 'match', { covers: true }), 3);
  assert.equal(lecturerCount(table, ['missing'], 'all'), 0);
  assert.deepEqual(topicPractice(table, ['a'], 'tf'), { format: 'tf', count: 2, fellBack: false });
  assert.deepEqual(topicPractice({ c: { mcq: 4, tf: 0 } }, ['c'], 'tf'), { format: 'all', count: 4, fellBack: true });
  assert.deepEqual(topicPractice({}, ['c'], 'tf'), { format: 'all', count: 0, fellBack: false });
});

for (const subject of WRAPUP_SUBJECTS) {
  test(`${subject}: every wrap-up practice button serves the number it prints`, async () => {
    const calls = [];
    const inst = mount(WrapUpView, { subject, subjectName: subject, goBack: () => {}, onStartTopic: (a) => calls.push(a), selectedPhase: WRAPUP_SCOPE.phase });
    const tree = await settle(inst);
    const articles = findAll(tree, (n) => n.type === 'article' && String(n.props.className || '').includes('vmx-wrap-item'));
    assert.ok(articles.length > 0, `${subject}: the wrap-up rendered no items`);
    const problems = [];
    for (const art of articles) {
      const topic = String(art.props.id).replace(/^wrap-/, '').replace(/-\d+$/, '');
      const btn = findAll(art, (n) => n.type === 'button' && String(n.props.className || '').includes('vmx-lect-btn'))[0];
      if (!btn) {
        const any = served(subject, [topic], 'all');
        if (any > 0) problems.push(`${topic}: no button, the session serves ${any}`);
        continue;
      }
      calls.length = 0;
      btn.props.onClick();
      assert.equal(calls.length, 1);
      const { topics, questionCategory } = calls[0];
      const m = /\((\d+) (ข้อ|ชุด)\)/.exec(textOf(btn));
      assert.ok(m, `${topic}: the button carries no count: "${textOf(btn)}"`);
      const shown = Number(m[1]);
      const pool = served(subject, topics, questionCategory);
      if (shown !== pool) problems.push(`${topic}: button says ${shown} (${questionCategory}), the session serves ${pool}`);
      if (questionCategory !== 'match' && m[2] === 'ชุด') problems.push(`${topic}: counts ชุด for ${questionCategory}`);
    }
    inst.unmount();
    assert.deepEqual(problems, []);
  });
}

// The lecturer card now reads the shared helper too; its buttons must still
// serve exactly what they print (it had 0 mismatches before the move).
for (const subject of Object.keys(LECTURER_SETS)) {
  test(`${subject}: every lecturer-card button serves the number it prints`, () => {
    const calls = [];
    const inst = mount(LecturerSets, { subject, topics: [], onStart: (a) => calls.push(a), selectedPhase: WRAPUP_SCOPE.phase });
    const buttons = findAll(inst.tree, (n) => n.type === 'button' && /vmx-lect-(cover-hit|btn)/.test(String(n.props.className || '')));
    assert.ok(buttons.length > 0, `${subject}: no lecturer buttons`);
    const problems = [];
    for (const btn of buttons) {
      if (btn.props.disabled) continue;
      calls.length = 0;
      btn.props.onClick();
      const a = calls[0];
      if (!a || a.numQuestions) continue; // the fixed-size mock set prints its size, not a pool
      const m = /(\d+) (?:ข้อ|ชุด)\)?$/.exec(textOf(btn).trim());
      assert.ok(m, `${subject}: a button carries no count: "${textOf(btn)}"`);
      const pool = served(subject, a.topics, a.questionCategory, Boolean(a.pastPaperOnly));
      if (Number(m[1]) !== pool) problems.push(`${a.topics.join(',')} ${a.questionCategory}${a.pastPaperOnly ? ' past' : ''}: says ${m[1]}, serves ${pool}`);
    }
    inst.unmount();
    assert.deepEqual(problems, []);
  });
}
