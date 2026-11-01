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
// chip as it was before 5.179.1 the first test fails on dozens of rows and
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
import { leakOf, answerParts } from '../../scripts/lib/answer-leak.mjs';
import { preAnswerText } from '../../scripts/lint-source-line.mjs';

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
    for (const part of preAnswerText(q).split('\n')) assert.ok(said.includes(part), `${q.subject}#${q.id}: "${part}" in "${said}"`);
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

test('the question card hands the chip whether the key is on screen, and the data lint runs the same check', () => {
  const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8');
  assert.match(card, /<QSourceChip key=\{compoundId\} q=\{currentQ\} revealed=\{keyShown\} \/>/);
  assert.match(card, /const keyShown = mcqRevealed \|\| tfRevealed \|\| Boolean\(revealAnswer && matchFilled\) \|\| Boolean\(writtenRevealPanel\);/);
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['lint:source-line'], 'node scripts/lint-source-line.mjs');
  assert.match(pkg.scripts['lint:data'], /npm run lint:source-line/);
});
