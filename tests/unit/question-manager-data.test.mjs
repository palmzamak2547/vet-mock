import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { parseCustomQuestion, parseUserBackup } from '../../src/lib/user-data-schema.js';
import { buildExamPool, WEAK_POOL_CAP } from '../../src/lib/exam-pool.js';
import { stillWrong } from '../../src/lib/wrong-pool.js';
import { assignCustomQuestionIds, appendCustomQuestions, CUSTOM_QUESTION_ID_RANGE } from '../../src/lib/custom-question-ids.js';

const alerts = [];
let confirmation = async () => true;
globalThis.__questionManagerDialogs = {
  alertDialog: message => alerts.push(message),
  confirmDialog: (...args) => confirmation(...args),
  promptDialog: async () => null,
};
const { default: QuestionManager } = await loadModule('src/views/QuestionManagerView.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = []; export const SUBJECTS = [{ id: "surg2", name: "Surgery" }];' },
  { match: '/components/(Mochi|EmptyState)\\.jsx$', contents: 'export default () => null;' },
  { match: '/lib/dialog\\.js$', contents: 'export const { alertDialog, confirmDialog, promptDialog } = globalThis.__questionManagerDialogs;' },
] });
const fixture = (extra = {}) => ({ id: 'imported-id', type: 'tf', q: 'Existing question', subject: 'surg2', answer: false, ...extra });
const button = (view, label) => findAll(view.tree, n => n.type === 'button' && textOf(n) === label)[0];
function click(view, label) {
  const result = button(view, label).props.onClick({ stopPropagation() {} });
  view.flush();
  return result;
}
function input(view, id, value) {
  findAll(view.tree, n => n.props.id === id)[0].props.onChange({ target: { value } });
  view.flush();
}
function setup(initial, { reject = false } = {}) {
  alerts.length = 0;
  confirmation = async () => true;
  let questions = initial;
  const view = mount(QuestionManager, { customQuestions: questions, goHome() {},
    setCustomQuestions(update) {
      if (reject) return { accepted: false, error: { message: 'พื้นที่จัดเก็บเต็ม' } };
      questions = typeof update === 'function' ? update(questions) : update;
      return { accepted: true };
    },
  });
  return { view, get questions() { return questions; },
    replace(next) { questions = next; view.update({ customQuestions: questions }); },
  };
}

test('new custom questions get stable IDs independent of string IDs and unloaded banks', () => {
  const backup = parseUserBackup({ customQuestions: [fixture()] });
  assert.equal(backup.success, true);
  const state = setup(backup.data.customQuestions);
  click(state.view, 'เพิ่มข้อสอบ');
  input(state.view, 'vmx-custom-question', 'New question');
  input(state.view, 'vmx-custom-type', 'tf');
  click(state.view, 'บันทึก');
  const added = state.questions[1];
  assert.equal(parseCustomQuestion(added).success, true, 'the saved record must survive backup validation');
  assert.ok(Number.isSafeInteger(added.id) && added.id >= 60000 && added.id <= 69999,
    'custom IDs must stay in their reserved range regardless of the loaded bank subset');
  assert.equal(JSON.parse(JSON.stringify(added)).id, added.id);
});

test('editing imported short/essay questions preserves answers, source and scope metadata, including ID zero', () => {
  for (const type of ['short', 'essay']) {
    const original = fixture({ id: 0, type, model_answer: 'Reference answer', keywords: ['key'],
      topic: 'surg-topic', examScope: 'final', source: 'My notes', review: { verified: true }, image: 'https://example.test/old.png' });
    const state = setup([original]);
    click(state.view, 'แก้');
    input(state.view, 'vmx-custom-question', 'Edited wording');
    input(state.view, 'vmx-custom-image', '');
    click(state.view, 'บันทึก');
    assert.equal(state.questions.length, 1, 'ID zero edits the existing question');
    assert.deepEqual(state.questions[0], { ...original, q: 'Edited wording', image: '', year: 4, tags: [], explain: '' });
  }
});

test('manual form uses the same validation as import and keeps invalid drafts open', () => {
  const state = setup([]);
  click(state.view, 'เพิ่มข้อสอบ');
  input(state.view, 'vmx-custom-question', 'Fill ____');
  input(state.view, 'vmx-custom-type', 'fill');
  click(state.view, 'บันทึก');
  assert.equal(state.questions.length, 0);
  assert.ok(button(state.view, 'บันทึก'), 'the draft remains editable');
  assert.match(alerts.at(-1), /อย่างน้อย 1 ช่อง/);
});

test('a delayed import appends to the latest questions, preserves other changes and assigns distinct IDs', async () => {
  const state = setup([fixture()]);
  const previousReader = globalThis.FileReader;
  let reader;
  globalThis.FileReader = class { constructor() { reader = this; } readAsText() {} };
  try {
    const fileInput = findAll(state.view.tree, n => n.props.type === 'file')[0];
    fileInput.props.onChange({ target: { files: [{ size: 20 }], value: 'questions.json' } });
    let approve;
    confirmation = () => new Promise(resolve => { approve = resolve; });
    const pending = reader.onload({ target: { result: JSON.stringify([fixture(), fixture()]) } });
    const other = fixture({ id: 'another-tab', q: 'Added while confirming' });
    state.replace([fixture(), other]);
    approve(true);
    await pending;
    assert.equal(state.questions.length, 4);
    assert.deepEqual(state.questions[1], other);
    assert.equal(new Set(state.questions.map(q => q.id)).size, 4);
    assert.ok(state.questions.every(q => parseCustomQuestion(q).success));
  } finally { globalThis.FileReader = previousReader; }
});

test('a rejected storage write retains the editable draft', () => {
  const state = setup([], { reject: true });
  click(state.view, 'เพิ่มข้อสอบ');
  input(state.view, 'vmx-custom-question', 'Keep this draft');
  input(state.view, 'vmx-custom-type', 'tf');
  click(state.view, 'บันทึก');
  assert.ok(button(state.view, 'บันทึก'));
  assert.match(alerts.at(-1), /พื้นที่จัดเก็บเต็ม/);
});

test('a retired question import cannot append or show a late read error', async () => {
  const state = setup([]);
  const previousReader = globalThis.FileReader;
  let reader, approve;
  globalThis.FileReader = class { constructor() { reader = this; } readAsText() {} };
  confirmation = () => new Promise(resolve => { approve = resolve; });
  try {
    findAll(state.view.tree, n => n.props.type === 'file')[0].props.onChange({
      target: { files: [{ size: 20 }], value: 'questions.json' },
    });
    const pending = reader.onload({ target: { result: JSON.stringify([fixture()]) } });
    state.view.unmount();
    approve(true);
    await pending;
    assert.equal(state.questions.length, 0, 'confirmation from a retired view cannot admit a write');
    reader.onerror();
    assert.equal(alerts.length, 0, 'a retired reader cannot show an error in the new view');
  } finally { globalThis.FileReader = previousReader; }
});

test('editing can clear matching distractors while keeping unedited shuffle metadata', () => {
  const original = fixture({ type: 'match', pairs: [{ left: 'A', right: 'B' }], distractors: ['C'], shuffle: false });
  const state = setup([original]);
  click(state.view, 'แก้');
  findAll(state.view.tree, n => n.props['aria-label'] === 'ตัวลวงที่ 1')[0].props.onChange({ target: { value: '' } });
  state.view.flush();
  click(state.view, 'บันทึก');
  assert.deepEqual(state.questions[0].distractors, []);
  assert.equal(state.questions[0].shuffle, false);
});

test('a delayed delete preserves questions added after its confirmation opened', async () => {
  const state = setup([fixture()]);
  let approve;
  confirmation = () => new Promise(resolve => { approve = resolve; });
  click(state.view, '🗑');
  const other = fixture({ id: 'another-tab' });
  state.replace([fixture(), other]);
  approve(true);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(state.questions, [other]);
});

test('the custom question editor is remounted when the account changes', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(/<QuestionManagerView key=\{user\?\.id \|\| 'guest'\}/.test(app));
});

test('weak practice preserves canonical numeric and imported string IDs after scoring', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  const body = app.split('const analytics = useMemo(() => {')[1].split('}, [history, allQuestions]);')[0];
  assert.ok(body, 'the actual analytics body is evaluated');
  const questions = [fixture({ id: 20, year: 4 }), fixture({ id: 'external-id', year: 4 }), fixture({ id: 'recovered', year: 4 })];
  const history = questions.map((q, i) => ({ questionId: q.id, subject: q.subject, correct: false, date: i + 1 }));
  history.push({ questionId: 'recovered', subject: 'surg2', correct: true, date: 10 });
  const analytics = new Function('history', 'allQuestions', 'SUBJECTS', 'stillWrong', 'WEAK_POOL_CAP', 'WEAK_TAG_MAX_PCT', body)(
    history, questions, [], stillWrong, WEAK_POOL_CAP, 70,
  );
  assert.deepEqual(analytics.weakQuestions, [20, 'external-id']);
  const pool = buildExamPool({ questions, practiceMode: 'weak', selectedYear: 4, weakQuestions: analytics.weakQuestions });
  assert.deepEqual(pool.map(q => q.id), [20, 'external-id']);
});

test('custom ID allocation handles numeric strings, same-tick collisions and exhaustion without partial import', () => {
  const [min, max] = CUSTOM_QUESTION_ID_RANGE;
  const almostFull = Array.from({ length: max - min }, (_, i) => ({ id: String(min + i) }));
  const saved = assignCustomQuestionIds([fixture()], [...almostFull, { id: 'external-id' }, { id: NaN }]);
  assert.equal(saved[0].id, max);
  assert.throws(() => assignCustomQuestionIds([fixture(), fixture()], almostFull), /เต็มแล้ว/);
  assert.equal(almostFull.length, max - min, 'the input is never changed on failure');
  const random = Math.random;
  try {
    Math.random = () => 0;
    const batch = assignCustomQuestionIds([fixture(), fixture()], [{ id: min }]);
    const followup = assignCustomQuestionIds([fixture()], [{ id: min }, ...batch]);
    assert.deepEqual([...batch, ...followup].map(q => q.id), [min + 1, min + 2, min + 3]);
  } finally { Math.random = random; }
});

test('a retired question ID is never reassigned while history, notes, bookmarks or SR still reference it', () => {
  const random = Math.random;
  try {
    Math.random = () => 0;
    const data = { customQuestions: [], history: [{ questionId: 60000 }], bookmarks: [60001],
      notes: { 60002: 'old note' }, srCards: { 60003: { questionId: 60003 } } };
    const [created] = appendCustomQuestions(data, [fixture()]);
    assert.equal(created.id, 60004);
  } finally { Math.random = random; }
});
