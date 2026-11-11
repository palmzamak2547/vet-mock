// ============================================================
// The "ที่มา" line never gives the key away before the answer
// ============================================================
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// The chip under every question printed examOrigin or the source pointer
// while the question was open ("Master 86 p6 (Cysteine + Tyrosine
// semi-essential)" under the question asking for that pair), and "ดูเต็ม"
// opened the checking note and the tags before any answer was given.
//
// The real QSourceChip is compiled with esbuild and rendered with a stub
// React for every question in the bank, closed and with its panel asked
// open, before the key is shown. scripts/lib/answer-leak.mjs judges what it
// says, with the rules lint:source-line runs on the same text. Against the
// chip as it was before 5.189.2 the first test fails on dozens of rows and
// the second on every row with a panel.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformSync } from 'esbuild';
import { QB, loadQB } from '../../src/data/questions.js';
import { panicRank } from '../../src/lib/question-metadata.js';
import { sourceKind, sourceLineBeforeAnswer, followsExamPattern, SOURCE_KIND_LABEL, SOURCE_LINE_WAIT } from '../../src/lib/source-line.js';
import { leakOf, answerParts, figureTextLeak } from '../../scripts/lib/answer-leak.mjs';
import { preAnswerText, figureTextLeaks, FIGURE_TEXT_FIELDS } from '../../scripts/lint-source-line.mjs';

// ── The chip, compiled and rendered without a DOM (as source-label.test.mjs) ──
const CHIP = 'vetmock-test:source-line-chip';
const STUB = 'vetmock-test:source-line-stub:';
const STUBS = {
  react: [
    'const h = () => globalThis.__vmxHooks;',
    'export const useState = (v) => h().useState(v);',
    'export const useEffect = () => {};',
    'export const useMemo = (f) => f();',
    'export const useRef = (v) => ({ current: v });',
    'export const useCallback = (f) => f;',
    // The panel's topic clip (#139) is lazy and renders nothing here: it sits
    // inside the panel, which waits for the key, and this test reads the chip.
    'export const lazy = () => function Lazy() { return null; };',
    'export const Suspense = ({ children }) => children ?? null;',
  ].join('\n'),
  'react/jsx-runtime': [
    "export const Fragment = 'fragment';",
    'export const jsx = (type, props, key) => ({ type, props: props || {}, key });',
    'export const jsxs = jsx;',
  ].join('\n'),
  './NavIcon.jsx': 'export default function NavIcon() { return null; }',
};
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const chipFile = `${repoRoot}src/components/QSourceChip.jsx`;
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === CHIP) return { url: CHIP, shortCircuit: true };
    if (context.parentURL === CHIP) {
      if (Object.hasOwn(STUBS, specifier)) return { url: STUB + specifier, shortCircuit: true };
      return nextResolve(specifier, { ...context, parentURL: pathToFileURL(chipFile).href });
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === CHIP) {
      const { code } = transformSync(readFileSync(chipFile, 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: chipFile });
      return { format: 'module', shortCircuit: true, source: code };
    }
    if (url.startsWith(STUB)) return { format: 'module', shortCircuit: true, source: STUBS[url.slice(STUB.length)] };
    return nextLoad(url, context);
  },
});
const { default: QSourceChip } = await import(CHIP);
await loadQB();

function expand(node) {
  if (node == null || typeof node === 'boolean') return null;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node !== 'object') return node;
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props.children) } };
}
const textOf = (node) => {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(textOf).join(' ');
  if (typeof node !== 'object') return String(node);
  return textOf(node.props.children);
};
const findAll = (node, pred, out = []) => {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) findAll(c, pred, out); return out; }
  if (pred(node)) out.push(node);
  findAll(node.props?.children, pred, out);
  return out;
};
/** The chip as a student meets it. `open` is the panel's state, as if "ดูเต็ม" had been pressed. */
function render(q, { revealed = false, open = false } = {}) {
  globalThis.__vmxHooks = { useState: (v) => [v === false ? open : v, () => {}] };
  const raw = QSourceChip(revealed ? { q, revealed: true } : { q });
  const tree = expand(raw);
  return { raw, tree, text: textOf(tree).replace(/\s+/g, ' ').trim() };
}
const row = (subject, id) => {
  const q = QB.find((x) => x.subject === subject && x.id === id);
  assert.ok(q, `${subject}#${id} is in the bank`);
  return q;
};

// ── Every question, before its key is shown ─────────────────────────────
const listed = (rows) => `${rows.length}:\n  ${rows.slice(0, 12).join('\n  ')}${rows.length > 12 ? `\n  ... and ${rows.length - 12} more` : ''}`;

test('no question\'s source chip gives its key away before the answer, closed or with its panel asked open', () => {
  assert.ok(QB.length > 7000, `the whole bank is loaded (${QB.length})`);
  const leaks = { closed: [], open: [] };
  const opened = [];
  let judged = 0;
  for (const q of QB) {
    const closed = render(q);
    const asked = render(q, { open: true });
    if (asked.text !== closed.text) opened.push(`${q.subject}#${q.id}`);
    if (!closed.text) continue;
    if (answerParts(q)) judged += 1;
    const leak = leakOf(q, closed.text);
    if (leak) leaks.closed.push(`${q.subject}#${q.id} ${leak.rule} [${leak.words.join(', ')}]: ${closed.text}`);
    else {
      const more = leakOf(q, asked.text);
      if (more) leaks.open.push(`${q.subject}#${q.id} ${more.rule} [${more.words.join(', ')}]`);
    }
  }
  assert.ok(judged > 7000, `the check reads the key of most questions (${judged})`);
  assert.equal(leaks.closed.length, 0, `the closed line gives the key away on ${listed(leaks.closed)}`);
  assert.equal(leaks.open.length, 0, `"ดูเต็ม" gives the key away on ${listed(leaks.open)}`);
  assert.equal(opened.length, 0, `the panel opens before the key is shown on ${listed(opened)}`);
});

test('before the key the line is a kind of source, the same line lint:source-line reads', () => {
  const pastLine = /^ข้อสอบเก่า(?: Vet \d{2}(?:, \d{2})*)?(?: (?:กลางภาค|ปลายภาค|ควิซ|OSCE|สอบสถานี))?$/;
  const kinds = {};
  for (const q of QB) {
    const kind = sourceKind(q);
    kinds[kind] = (kinds[kind] || 0) + 1;
    const line = sourceLineBeforeAnswer(q);
    if (kind === 'past') assert.match(line, pastLine, `${q.subject}#${q.id}`);
    else assert.equal(line, SOURCE_KIND_LABEL[kind], `${q.subject}#${q.id}`);
    // The kinds follow Panic Mode's bands, through the same predicates.
    assert.equal(kind === 'past', panicRank(q) === 0, `${q.subject}#${q.id} past`);
    assert.equal(kind === 'aligned', panicRank(q) === 1, `${q.subject}#${q.id} aligned`);
  }
  for (const kind of ['past', 'aligned', 'lecture', 'compilation', 'mock', 'unknown']) assert.ok(kinds[kind] > 0, `${kind} still occurs (${kinds[kind] || 0})`);
  // What the lint reads is what the closed chip says.
  for (const q of [row('poultry', 4033), row('food-industry', 207093), row('com4', 1068), row('zoonoses', 208045)]) {
    const said = render(q).text;
    // The flag's warning is drawn by the card, not the chip (its own test is below).
    for (const part of preAnswerText(q).split('\n').filter((p) => !p.startsWith('ข้อมูลขัดแย้ง'))) {
      assert.ok(said.includes(part), `${q.subject}#${q.id}: "${part}" in "${said}"`);
    }
  }
});

// A file label is not a sitting: "COM I Final 86" was gathered FOR Vet 86,
// so its line names the paper and no cohort (exam-origin-parse.js).
test('a past paper names the cohort that sat it, never the cohort a file was gathered for', () => {
  const fileLabels = QB.filter((q) => /(?:^|[^a-z])(?:mid|final|tj)\s*86\b/i.test(String(q.examOrigin || '')) && !/vet\s*8[0-6]\s*-\s*86/i.test(q.examOrigin));
  assert.ok(fileLabels.length > 50, `rows filed under a "... 86" file label (${fileLabels.length})`);
  for (const q of fileLabels) assert.doesNotMatch(sourceLineBeforeAnswer(q), /Vet 86/, `${q.subject}#${q.id} ${q.examOrigin}`);
  assert.equal(sourceLineBeforeAnswer(row('zoonoses', 208045)).startsWith('ข้อสอบเก่า'), true);
});

// ── The rows the old chip gave away ──────────────────────────────────────
// Each named its key in the line itself. Shown once the key is on screen it
// still does, so the check above has teeth; before it, nothing is left.
const OLD_LEAKS = [
  ['poultry', 4033, /Cysteine \+ Tyrosine/], // กรดอะมิโนคู่ใดที่จัดเป็น semi-essential ในไก่
  ['poultry', 4032, /Lysine/], // a fill-in whose blank is Lysine
  ['poultry', 4034, /Linoleic/],
  ['cliapprum', 5028, /Cornual nerve block/],
  ['cliapprum', 5060, /tension-relieving/],
  ['food-industry', 207093, /อันตรายต่อสุขภาพ/],
  ['food-industry', 207096, /สัตว์และผลิตภัณฑ์/],
  ['com4', 1068, /Autoimmune/],
];
test('the line that named the key comes back only with the key', () => {
  for (const [subject, id, words] of OLD_LEAKS) {
    const q = row(subject, id);
    const after = render(q, { revealed: true });
    assert.match(after.text, words, `${subject}#${id} shows its full source after the answer`);
    assert.ok(leakOf(q, after.text), `${subject}#${id}: the check reads "${after.text}" as giving the key away`);
    const before = render(q);
    assert.doesNotMatch(before.text, words, `${subject}#${id} before the answer: ${before.text}`);
    assert.equal(leakOf(q, before.text), null);
  }
});

test('"ดูเต็ม" opens the panel only once the key is on screen', () => {
  // Its tags say size-exclusion; the key is "Permeation (size exclusion)".
  const q = row('biochem-1', 70003);
  const rows = (t) => findAll(t, (n) => typeof n.type === 'function' && n.type.name === 'Row');
  assert.equal(rows(render(q, { open: true }).raw).length, 0, 'no panel row before the key');
  const after = render(q, { revealed: true, open: true });
  assert.ok(rows(after.raw).length > 0, 'the panel opens after the key');
  assert.ok(leakOf(q, after.text), 'that panel names the key, which is why it waits');
  // Links (a cited clip minute, the source document) wait with it.
  const clip = row('food-industry', 207000);
  assert.equal(findAll(render(clip, { open: true }).tree, (n) => n.type === 'a').length, 0);
  assert.ok(findAll(render(clip, { revealed: true, open: true }).tree, (n) => n.type === 'a').length > 0);
});

test('the toggle keeps its place and says when the full source comes', () => {
  const q = row('poultry', 4033);
  const button = (r) => findAll(r.raw, (n) => n.type === 'button')[0];
  const before = render(q);
  const after = render(q, { revealed: true });
  assert.equal(button(before).props['aria-disabled'], true);
  assert.equal(button(before).props['aria-expanded'], undefined);
  assert.equal(button(before).props.disabled, undefined, 'not disabled: the browser greys a disabled button below the contrast floor');
  assert.equal(button(after).props['aria-disabled'], undefined);
  assert.equal(button(after).props['aria-expanded'], false);
  // One row, the same three parts, either way: icon, one ellipsised line, the hint.
  for (const r of [before, after]) {
    assert.equal(button(r).props.className, 'vmx-qsource-toggle');
    assert.equal(findAll(button(r), (n) => n.type === 'span').length, 2);
  }
  assert.match(before.text, new RegExp(`^ที่มา: จากชีทรุ่นพี่ ${SOURCE_LINE_WAIT}$`));
  assert.match(after.text, /^ที่มา: Master 86 p6 \(Cysteine \+ Tyrosine semi-essential\) ▾ ดูเต็ม$/);
  // The wait hint and every kind's wording are plain Thai, with no middle dot.
  for (const words of [SOURCE_LINE_WAIT, ...Object.values(SOURCE_KIND_LABEL)]) assert.ok(!words.includes('·'), words);
});

// The card's "อิงแนวเดิม" chip showed for any examOrigin, so a row written from
// a recording or a senior's summary ("Kim TJ86") read อิงแนวเดิม at the top and
// เขียนจากเนื้อหาที่เรียน in the line below it. It now follows the line's kind.
test('the "อิงแนวเดิม" chip agrees with the source line, on the card and in Review', () => {
  let shown = 0;
  let dropped = 0;
  for (const q of QB) {
    const kind = sourceKind(q);
    if (followsExamPattern(q)) {
      shown += 1;
      assert.ok(['past', 'aligned', 'mock'].includes(kind), `${q.subject}#${q.id} shows อิงแนวเดิม as ${kind}`);
    } else if (q.examOrigin) {
      dropped += 1;
      assert.ok(['lecture', 'compilation'].includes(kind), `${q.subject}#${q.id} lost the chip as ${kind}`);
    }
  }
  assert.ok(shown > 3000 && dropped > 0, `chip on ${shown}, off on ${dropped} rows that carry an origin`);
  for (const file of ['src/components/Question.jsx', 'src/views/ReviewView.jsx']) {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    assert.match(src, /\{followsExamPattern\((?:currentQ|q)\) && \(\s*<span className="vmx-origin-chip"/, file);
  }
});

test('the topic screen calls past papers ข้อสอบเก่า, and Review prints the whole origin', () => {
  // อิงแนวเดิม on the card is a wider set (marked points and mocks too); the
  // topic screen counts isPastPaperQuestion, which the source line calls ข้อสอบเก่า.
  const topics = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8');
  // The chip says the share as a sentence; its title keeps the count (5.214).
  assert.match(topics, /เป็นข้อสอบเก่า \{ppPct\}%/);
  assert.match(topics, /title=\{`ข้อสอบเก่า \$\{ppCount\} จาก \$\{count\} ข้อ`\}/);
  assert.doesNotMatch(topics, /อิงแนวเดิม \{ppCount\}/);
  // After a timed paper Review is the only place the full source shows.
  const review = readFileSync(new URL('../../src/views/ReviewView.jsx', import.meta.url), 'utf8');
  assert.match(review, /q\.examOrigin && readableSource\(q\.examOrigin\)/);
});

test('the question card hands the chip whether the key is on screen, and the data lint runs the same check', () => {
  const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8');
  assert.match(card, /<QSourceChip key=\{compoundId\} q=\{currentQ\} revealed=\{keyShown\} \/>/);
  assert.match(card, /<FlagChip key=\{compoundId\} flag=\{currentQ\.flag\} revealed=\{keyShown\} \/>/);
  assert.match(card, /const keyShown = mcqRevealed \|\| tfRevealed \|\| Boolean\(revealAnswer && matchFilled\) \|\| Boolean\(writtenRevealPanel\);/);
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['lint:source-line'], 'node scripts/lint-source-line.mjs');
  assert.match(pkg.scripts['lint:data'], /npm run lint:source-line/);
});

// ── The topic chip in the card's meta row ────────────────────────────────
// The row above the stem prints the type, the course, the topic and the
// paper. On 129 questions the topic label alone named the key ("Autoimmune
// Skin Diseases" above "Sebaceous Adenitis เป็นโรคที่"). The real
// QuestionComponent is bundled with its heavy children stubbed (as
// reveal-timing-shared.test.mjs does) and every question's row is read as a
// student reads it before answering: hidden text (aria-hidden) is not read.
const fr = await import('../helpers/fake-react.mjs');
const nothing = 'export default function Stub() { return null; }';
const CARD_STUBS = [
  { match: '/data/questions\\.js$', contents: "export { SUBJECTS } from './src/data/curriculum.js';" },
  { match: '/lib/richtext\\.jsx$', contents: 'export function RichText({ text }) { return text ?? null; }' },
  { match: '/lib/option-shuffle\\.js$', contents: 'export const getShuffledOptions = () => ({ displayOptions: [], displayToOriginal: [], originalToDisplay: [] });' },
  { match: '/lib/safe-url\\.js$', contents: 'export const safeImageUrl = () => null;' },
  { match: '/lib/audio-unlock\\.js$', contents: 'export const unlockAudio = () => {};' },
  { match: '/lib/dialog\\.js$', contents: 'export const promptDialog = async () => null; export const alertDialog = async () => {};' },
  { match: '/lib/feedback-client\\.js$', contents: 'export const sendFeedback = async () => ({ ok: true });' },
  { match: 'MotionFeedback\\.jsx$', contents: 'export const MotionEnter = ({ children }) => children ?? null; export const useMotionFeedback = () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
  ...['WikiLinkForQuestion', 'TermLinkedRichText', 'SmartPassage', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'QSourceChip', 'PinButton', 'MissCoach', 'Mochi', 'AiGradePanel', 'MatchDragDrop']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: nothing })),
];
const { default: QuestionCard, FlagChip } = await fr.loadModule('src/components/Question.jsx', { stubs: CARD_STUBS });

/** What a student reads: text outside any aria-hidden part, function components expanded. */
function readable(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(readable).join(' ');
  if (typeof node.type === 'function') return readable(node.type(node.props || {}));
  if (node.props?.['aria-hidden'] === true || node.props?.['aria-hidden'] === 'true') return '';
  return readable(node.props?.children);
}
/** The card's meta row for one question, with or without its key on screen. */
function metaRow(q, { answered = false } = {}) {
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}) };
  const inst = fr.mount(QuestionCard, {
    currentQ: q, currentAnswer: answered ? q.answer : undefined, answerCurrent: () => {},
    isBookmarked: false, toggleBookmark: () => {}, note: '', onNoteChange: () => {},
    showNote: false, setShowNote: () => {}, revealAnswer: true,
  });
  const [row] = fr.findAll(inst.tree, (n) => n.props?.className === 'vmx-qtype-badge vmx-q-meta');
  inst.unmount();
  return row;
}

test('no question\'s meta row gives its key away before the answer', () => {
  const leaks = [];
  let read = 0;
  for (const q of QB) {
    const row = metaRow(q);
    if (!row) continue;
    read += 1;
    const text = readable(row).replace(/\s+/g, ' ').trim();
    const leak = leakOf(q, text);
    if (leak) leaks.push(`${q.subject}#${q.id} ${leak.rule} [${leak.words.join(', ')}]: ${text}`);
  }
  assert.ok(read > 7000, `the row is read on most questions (${read})`);
  assert.equal(leaks.length, 0, `the meta row gives the key away before the answer on ${listed(leaks)}`);
});

// ── The data-conflict flag under the stem ────────────────────────────────
// "ข้อมูลขัดแย้ง" shows on every flagged question, timed papers included, and
// one tap opened its note and sources: "ควรเป็น InPouch TF-Feline หรือ PCR",
// "Answer set to inspiratory". The chip stays as a warning; what it opens
// waits for the key, like the source panel.
test('a flag chip warns before the answer and opens only once the key is on screen', () => {
  const flagged = QB.filter((q) => q.flag);
  assert.ok(flagged.length > 50, `flagged questions (${flagged.length})`);
  const press = (q, revealed) => {
    const inst = fr.mount(FlagChip, { flag: q.flag, revealed });
    const [button] = fr.findAll(inst.tree, (n) => n.type === 'button');
    button.props.onClick?.();
    inst.flush();
    const text = readable(inst.tree).replace(/\s+/g, ' ').trim();
    inst.unmount();
    return text;
  };
  const leaks = [];
  for (const q of flagged) {
    const text = press(q, false);
    assert.match(text, /ข้อมูลขัดแย้ง/, `${q.subject}#${q.id} still warns`);
    const leak = leakOf(q, text);
    if (leak) leaks.push(`${q.subject}#${q.id} ${leak.rule} [${leak.words.join(', ')}]: ${text.slice(0, 160)}`);
  }
  assert.equal(leaks.length, 0, `the flag gives the key away before the answer on ${listed(leaks)}`);
  // With the key on screen the same press opens the note.
  const q = row('com5', 568);
  assert.ok(press(q, true).includes(String(q.flag.note).slice(0, 30)));
});

test('a held topic shows with the key, in a part that keeps its size', async () => {
  const { holdsTopicChip, TOPIC_CHIP_WAIT } = await import('../../src/lib/source-line.js');
  const { topicLabelOf } = await import('../../scripts/lint-source-line.mjs');
  // com4#1068: "Autoimmune Skin Diseases" above "Sebaceous Adenitis เป็นโรคที่".
  const q = row('com4', 1068);
  assert.equal(holdsTopicChip(q), true);
  const label = topicLabelOf(q);
  assert.match(label, /Autoimmune/);
  const part = (r) => fr.findAll(r, (n) => n.props?.className === 'vmx-q-topic-hold')[0];
  const before = metaRow(q);
  const after = metaRow(q, { answered: true });
  assert.doesNotMatch(readable(before), new RegExp(label));
  assert.match(readable(before), new RegExp(TOPIC_CHIP_WAIT));
  assert.match(readable(after), new RegExp(label));
  assert.doesNotMatch(readable(after), new RegExp(TOPIC_CHIP_WAIT));
  // Both texts sit in the part either way, only which one is hidden changes,
  // so the grid cell (and the row) is the same size before and after.
  const texts = (r) => fr.findAll(part(r), (n) => n.type === 'span' && n !== part(r)).map((n) => [fr.textOf(n), n.props['aria-hidden'] === true]);
  assert.deepEqual(texts(before), [[label, true], [TOPIC_CHIP_WAIT, false]]);
  assert.deepEqual(texts(after), [[label, false], [TOPIC_CHIP_WAIT, true]]);
  // A topic that names nothing is printed as before, with no stand-in.
  const plain = QB.find((x) => x.type === 'mcq' && x.topic && !holdsTopicChip(x) && metaRow(x));
  assert.equal(part(metaRow(plain)), undefined);
});

// ── The caption and the credit under a figure ────────────────────────────
// Epidemiology 100004 asks which animal is the mixing vessel and which the
// natural reservoir. Under its picture, before any answer, the card printed
// "สุกรเป็น mixing vessel; นกป่าและนกอพยพเป็น natural reservoir". leakOf passes that
// line: every word of the key is in the stem or in another option, and the
// four options differ only in which animal goes with which role. A caption is
// held to more (figureTextLeak), and the review card now shows it too.
test('the caption that gave epidemiology 100004 away is caught, whole or by either half', () => {
  const q = row('epidemiology', 100004);
  const old = 'สุกรเป็น mixing vessel; นกป่าและนกอพยพเป็น natural reservoir — แตะภาพเพื่อขยาย';
  assert.equal(leakOf(q, old), null, 'the source-line rules alone do not see it');
  assert.deepEqual(figureTextLeak(q, old), { rule: 'restates-key', words: ['สุกร เป็น mixing', 'อพยพ เป็น natural'] });
  assert.equal(figureTextLeak(q, 'สุกรเป็น mixing vessel')?.rule, 'restates-key', 'half of the key narrows four options to two');
  assert.equal(figureTextLeak(q, 'นกป่าและนกอพยพเป็น natural reservoir')?.rule, 'restates-key');
  // A caption that says what the picture is, or where it comes from, passes.
  for (const neutral of ['การเกิด reassortant H1N1', 'แผนภาพจาก Pawariya et al. (2009)', 'ภาพจากสไลด์ Introduction to Epidemiology; Pawariya et al. (2009)']) {
    assert.equal(figureTextLeak(q, neutral), null, neutral);
  }
  assert.equal(q.imageCaption, undefined, 'the question no longer carries that caption');
});

test('a caption is held to one word, one number or the whole of the key, where a source line is not', () => {
  // One Thai word: the country the map question asks for.
  const map = row('epidemiology', 100002);
  assert.equal(leakOf(map, 'อินโดนีเซียมีผู้ป่วยสะสม 195 ราย'), null);
  assert.deepEqual(figureTextLeak(map, 'อินโดนีเซียมีผู้ป่วยสะสม 195 ราย'), { rule: 'key-words', words: ['อินโดนีเซีย'] });
  assert.equal(figureTextLeak(map, 'ข้อมูล WHO/GIP ณ 24 มกราคม 2014'), null, 'its own caption names the data, not the country');
  // One number: the rate a calculation question asks for. The stem's own numbers are not a hint.
  const rate = row('epidemiology', 100003);
  assert.deepEqual(figureTextLeak(rate, 'case fatality rate เกือบ 60%'), { rule: 'key-words', words: ['60'] });
  assert.equal(figureTextLeak(rate, 'ผู้ป่วย 433 ราย เสียชีวิต 262 ราย'), null);
  // The key word for word, though the stem names both choices.
  const either = { id: 1, subject: 'epidemiology', type: 'mcq', q: 'ภาพนี้เป็น pneumothorax หรือ pleural effusion', options: ['pneumothorax', 'pleural effusion'], answer: 1 };
  assert.equal(leakOf(either, 'ภาพรังสี pleural effusion ด้านขวา'), null);
  assert.deepEqual(figureTextLeak(either, 'ภาพรังสี pleural effusion ด้านขวา'), { rule: 'restates-key', words: ['pleural effusion'] });
  assert.equal(figureTextLeak(either, 'pneumothorax เทียบกับ pleural effusion'), null, 'a caption that names every choice picks none');
  // A written item: the blank itself.
  const fill = { id: 2, subject: 'epidemiology', type: 'fill', q: 'อวัยวะในภาพคือ ___', blanks: ['ตับ'] };
  assert.equal(figureTextLeak(fill, 'ภาพตัดขวางของตับสุนัข')?.rule, 'key-words');
  assert.equal(figureTextLeak(fill, 'ภาพตัดขวางช่องท้องสุนัข'), null);
  // A true/false item has no option to restate; the source-line rules still apply.
  assert.equal(figureTextLeak({ id: 3, subject: 'epidemiology', type: 'tf', q: 'ตับอยู่ในช่องอก', answer: false, explain: 'ตับอยู่ในช่องท้อง' }, 'ภาพช่องท้อง'), null);
});

test('no question\'s figure gives its key away in its caption or its credit', () => {
  const leaks = [];
  let read = 0;
  for (const q of QB) {
    read += FIGURE_TEXT_FIELDS.filter((f) => typeof q[f] === 'string' && q[f].trim()).length;
    for (const { field, text, leak } of figureTextLeaks(q)) leaks.push(`${q.subject}#${q.id} ${field} ${leak.rule} [${leak.words.join(', ')}]: ${text}`);
  }
  assert.ok(read >= 3, `captions and credits read (${read})`);
  assert.equal(leaks.length, 0, `a figure's caption or credit gives the key away before the answer on ${listed(leaks)}`);
  // No caption tells the student to tap: the strip under the picture says ขยายภาพ.
  for (const q of QB) assert.doesNotMatch(String(q.imageCaption || ''), /แตะ|กดเพื่อ|คลิก/, `${q.subject}#${q.id}: ${q.imageCaption}`);
});

test('the fields the check reads are the ones the three cards print under a figure', () => {
  assert.deepEqual(FIGURE_TEXT_FIELDS, ['imageCaption', 'imageCredit']);
  for (const [file, name] of [['src/components/Question.jsx', 'currentQ'], ['src/views/SRSessionView.jsx', 'currentQ'], ['src/views/ReviewView.jsx', 'q']]) {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    assert.ok(src.includes(`caption={${name}.imageCaption}`), `${file} hands the figure its caption`);
    assert.ok(src.includes(`credit={${name}.imageCredit}`), `${file} hands the figure its credit`);
  }
  // The figure prints those two and a link; nothing else of the question reaches it.
  const figure = readFileSync(new URL('../../src/components/ZoomableImage.jsx', import.meta.url), 'utf8');
  assert.match(figure, /\{caption && <span>\{caption\}<\/span>\}/);
  assert.match(figure, /<span className="vmx-figure-credit">\s*\{credit\}/);
});

test('a past paper\'s cohort is one the parser reads in its origin, or none', async () => {
  const { COHORT_UNCONFIRMED } = await import('../../src/data/source-line.generated.js');
  const { parseExamOrigin, cohortList } = await import('../../src/lib/exam-origin-parse.js');
  const { unconfirmedCohorts } = await import('../../scripts/lint-source-line.mjs');
  assert.deepEqual([...COHORT_UNCONFIRMED].sort(), [...unconfirmedCohorts()].sort(), 'run npm run regen:source-line');
  let named = 0;
  for (const q of QB.filter((x) => sourceKind(x) === 'past')) {
    const shown = /Vet ([\d, ]+)/.exec(sourceLineBeforeAnswer(q))?.[1].split(', ').map(Number) || [];
    if (!shown.length) continue;
    named += 1;
    assert.deepEqual(shown, cohortList(parseExamOrigin(q.examOrigin).cohort), `${q.subject}#${q.id} ${q.examOrigin}`);
  }
  assert.ok(named > 1000, `past papers that name their cohort (${named})`);
});

test('the held topics are exactly the labels the check reads as giving the key away', async () => {
  const { TOPIC_CHIP_HELD } = await import('../../src/data/source-line.generated.js');
  const { topicLabelOf } = await import('../../scripts/lint-source-line.mjs');
  const shouldHold = new Set(QB.filter((q) => topicLabelOf(q) && leakOf(q, topicLabelOf(q))).map((q) => `${q.subject}:${q.id}`));
  const missing = [...shouldHold].filter((k) => !TOPIC_CHIP_HELD.has(k));
  const extra = [...TOPIC_CHIP_HELD].filter((k) => !shouldHold.has(k));
  assert.deepEqual({ missing, extra }, { missing: [], extra: [] }, 'run npm run regen:source-line');
  assert.ok(TOPIC_CHIP_HELD.size > 100, `labels held (${TOPIC_CHIP_HELD.size})`);
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['regen:source-line'], 'node scripts/lint-source-line.mjs --write');
  assert.match(pkg.scripts['regen:all'], /npm run regen:source-line/);
});
