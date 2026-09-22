// ============================================================
// notes-read-day.test.mjs — NotesView reading credit and search rendering
// ============================================================
// 1. The reading-quest dedupe uses the quest's own day.
//
//    Reading a topic for 10 seconds credits the "read 1 topic" and "read 3
//    topics" quests once per topic per day. NotesView kept its dedupe log
//    under the UTC day (toISOString), while recordQuestEvent credits the
//    quest for quests.js todayKey(), the LOCAL day. In Bangkok (UTC+7) the
//    two disagree from 00:00 to 07:00: a topic re-read after midnight got no
//    credit on the new day until 7 a.m., and a topic read at 06:59 and again
//    at 07:01 counted twice. NotesView now keys the log with the quest's
//    todayKey, so the two days are equal by construction.
//
//    This file pins TZ=Asia/Bangkok itself, so it means the same on a UTC CI
//    runner as on a student's phone (the lesson of ci-runs-in-utc).
//
// 2. Typing in "ค้นหาใน notes" does not re-render every section.
//
//    Every keystroke re-renders NotesView (the box echoes `search` at once;
//    filtering and highlighting wait for the 80 ms debounce). SectionBlock was
//    a plain function and its `conflicts` prop was correctionsFor(...), which
//    returns a fresh [] for any section without corrections, so each key
//    re-rendered and re-split the text of every section. aqua-intro-thailand
//    (127 sections) paid about 5.5 ms of element creation per letter before
//    React even reconciled. SectionBlock is now React.memo and sections with
//    no corrections share one frozen empty list, so a section re-renders only
//    when the debounced query (its highlight) changes.
//
// The view renders JSX, so the pieces are lifted out of the source: the
// dedupe function runs against a storage shim, the real quests.js and a
// mocked clock; the section list's map callback runs with its <SectionBlock>
// element read as a props object, against the real corrections and notes.
// ============================================================

process.env.TZ = 'Asia/Bangkok';

import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/NotesView.jsx'), 'utf8').replace(/\r\n/g, '\n');

const at = (iso) => Date.parse(iso);
mock.timers.enable({ apis: ['Date'], now: at('2026-09-23T00:30:00+07:00') });
test.after(() => mock.timers.reset());

// quests.js reads window.localStorage when an event is recorded.
const store = new Map();
const localStorage = {
  get length() { return store.size; },
  key: (i) => Array.from(store.keys())[i] ?? null,
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  clear: () => store.clear(),
};
globalThis.window = { localStorage, dispatchEvent: () => true, addEventListener() {}, removeEventListener() {} };

const quests = await import('../../src/lib/quests.js');

/** Every name NotesView imports from quests.js, bound to the real module. */
function questImports() {
  const m = SRC.match(/import \{([^}]+)\} from '\.\.\/lib\/quests\.js';/);
  assert.ok(m, 'NotesView must import from lib/quests.js');
  return Object.fromEntries(m[1].split(',').map((s) => s.trim()).filter(Boolean).map((name) => [name, quests[name]]));
}

function loadMarkTopicReadOnce(storage = localStorage) {
  const start = SRC.indexOf('function markTopicReadOnce(');
  assert.notEqual(start, -1, 'NotesView must still dedupe reading credit in markTopicReadOnce');
  const end = SRC.indexOf('\n}\n', start);
  const key = SRC.match(/const READ_LOG_LS = '([^']+)';/);
  assert.ok(key, 'the dedupe log key must still be a module constant');
  return vm.runInNewContext(`(${SRC.slice(start, end + 2)})`, {
    ...questImports(),
    READ_LOG_LS: key[1],
    localStorage: storage,
    Date, // the mocked clock
    JSON,
  });
}

const READ_LOG = SRC.match(/const READ_LOG_LS = '([^']+)';/)[1];
const loggedDay = () => JSON.parse(store.get(READ_LOG)).day;

test('00:30 in Bangkok: the read is logged under the day the quest counts it for', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T00:30:00+07:00'));
  const markTopicReadOnce = loadMarkTopicReadOnce();

  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
  assert.equal(loggedDay(), '2026-09-23', 'the dedupe log used the UTC day (still 22 Sep until 07:00 in Bangkok)');
  assert.equal(typeof quests.todayKey, 'function', 'quests.js must export the day key it credits quests under');
  assert.equal(loggedDay(), quests.todayKey());
});

test('re-reading a topic after local midnight earns the new day\'s credit', () => {
  store.clear();
  const markTopicReadOnce = loadMarkTopicReadOnce();

  mock.timers.setTime(at('2026-09-22T23:00:00+07:00'));
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);

  mock.timers.setTime(at('2026-09-23T00:30:00+07:00'));
  assert.equal(
    markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'),
    true,
    'a new local day began at midnight, but the topic stayed "already read" until 07:00',
  );
});

test('06:59 and 07:01 are the same local day, so the topic counts once', () => {
  store.clear();
  const markTopicReadOnce = loadMarkTopicReadOnce();

  mock.timers.setTime(at('2026-09-23T06:59:00+07:00'));
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'), true);

  mock.timers.setTime(at('2026-09-23T07:01:00+07:00'));
  assert.equal(
    markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'),
    false,
    'the UTC day turned over at 07:00 and credited the same topic twice in one day',
  );
});

test('within one day each topic still counts once, and different topics each count', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T10:00:00+07:00'));
  const markTopicReadOnce = loadMarkTopicReadOnce();

  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), false);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'), true);
  assert.equal(markTopicReadOnce('zoonoses', 'aqua-intro-thailand'), true, 'the key is subject:topic');
  assert.deepEqual(JSON.parse(store.get(READ_LOG)).topics, [
    'aquatic-clinic:aqua-intro-thailand',
    'aquatic-clinic:aqua-fish-biology',
    'zoonoses:aqua-intro-thailand',
  ]);
});

test('a log written before this change (same YYYY-MM-DD shape) is still read', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T10:00:00+07:00'));
  store.set(READ_LOG, JSON.stringify({ day: '2026-09-23', topics: ['aquatic-clinic:aqua-intro-thailand'] }));
  const markTopicReadOnce = loadMarkTopicReadOnce();
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), false);
});

test('with storage disabled the read is still credited', () => {
  const broken = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  const markTopicReadOnce = loadMarkTopicReadOnce(broken);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
});

// ── 2. Typing in the search box does not re-render every section ──────────

const { correctionsFor } = await import('../../src/lib/vetwiki/corrections.js');
const { sectionId } = await import('../../src/lib/vetwiki/schema.js');
const { loadNotesSubject } = await import('../../src/data/note-corpus.js');

/** The source from the first `open` at or after `from` to its matching `close`. */
function balanced(text, from, open, close) {
  const start = text.indexOf(open, from);
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === open) depth += 1;
    else if (text[i] === close && --depth === 0) return text.slice(start, i + 1);
  }
  throw new Error(`unbalanced ${open}${close} in NotesView source`);
}

/**
 * The callback NotesView maps its sections through, with the <SectionBlock>
 * element rewritten as the props object React would hand to it.
 */
function sectionElementFactory() {
  const anchor = '{filteredSections.map';
  const at = SRC.indexOf(anchor);
  assert.notEqual(at, -1, 'NotesView must still render filteredSections');
  const call = balanced(SRC, at + anchor.length, '(', ')');
  let callback = call.slice(1, -1).trim();
  const tag = callback.indexOf('<SectionBlock');
  assert.notEqual(tag, -1, 'each section must still render a SectionBlock');
  let i = tag + '<SectionBlock'.length;
  const props = [];
  for (;;) {
    while (/\s/.test(callback[i])) i += 1;
    if (callback.startsWith('/>', i)) { i += 2; break; }
    const attr = /^(\w+)=/.exec(callback.slice(i));
    assert.ok(attr, `unexpected SectionBlock attribute syntax: ${callback.slice(i, i + 40)}`);
    i += attr[0].length;
    const expr = balanced(callback, i, '{', '}');
    props.push(`${JSON.stringify(attr[1])}: (${expr.slice(1, -1)})`);
    i += expr.length;
  }
  callback = `${callback.slice(0, tag)}({ ${props.join(', ')} })${callback.slice(i)}`;
  // Module-scope constants the callback may close over (EMPTY_SECTIONS & co).
  const constants = [...SRC.matchAll(/^const (\w+) = (Object\.freeze\((?:\[\]|\{\})\));$/gm)]
    .map(([, name, value]) => `const ${name} = ${value};`)
    .join('\n');
  const context = vm.createContext({ correctionsFor, sectionId, subject: '', validTopic: '', debouncedSearch: '' });
  const render = vm.runInContext(`${constants}\n(${callback})`, context);
  return {
    context,
    /** One render of the section list: the props each SectionBlock receives. */
    renderList: (sections) => sections.map((section, idx) => render(section, idx)),
  };
}

/** React.memo's default check: re-render unless every prop is Object.is-equal. */
function wouldRerender(prev, next) {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.delete('key');
  return [...keys].some((k) => !Object.is(prev[k], next[k]));
}

const SUBJECT = 'aquatic-clinic';
const TOPIC = 'aqua-intro-thailand';
const notes = await loadNotesSubject(SUBJECT);
const sections = notes[TOPIC]?.sections || [];

test('the fixture is the long topic from the report, with and without corrections', () => {
  assert.ok(sections.length >= 100, `${TOPIC} should still be the long topic (${sections.length} sections)`);
  const withCorrections = sections.filter((s) => correctionsFor(sectionId(SUBJECT, TOPIC, s.heading)).length > 0);
  assert.ok(withCorrections.length > 0, 'some sections must carry corrections so both paths are exercised');
  assert.ok(withCorrections.length < sections.length);
});

test('SectionBlock is memoised with React\'s default shallow compare', () => {
  assert.ok(/^import \{[^}]*\bmemo\b[^}]*\} from 'react';$/m.test(SRC), 'memo must come from react');
  assert.ok(/^const SectionBlock = memo\(function SectionBlock\(/m.test(SRC),
    'SectionBlock re-rendered on every keystroke because nothing let React skip it');
});

test('a keystroke before the debounce fires re-renders no section', () => {
  const { context, renderList } = sectionElementFactory();
  Object.assign(context, { subject: SUBJECT, validTopic: TOPIC, debouncedSearch: '' });
  // The student types "r": NotesView re-renders with a new `search` while the
  // debounced query, and so the filtered list, are unchanged.
  const before = renderList(sections);
  const after = renderList(sections);
  const changed = new Set();
  let rerendered = 0;
  before.forEach((props, i) => {
    if (!wouldRerender(props, after[i])) return;
    rerendered += 1;
    for (const k of Object.keys(props)) if (!Object.is(props[k], after[i][k])) changed.add(k);
  });
  assert.equal(
    rerendered,
    0,
    `${rerendered} of ${sections.length} sections would re-render on one keystroke (changed props: ${[...changed].join(', ')})`,
  );
});

test('each section still gets exactly its own corrections, and the shared empty list cannot be written to', () => {
  const { context, renderList } = sectionElementFactory();
  Object.assign(context, { subject: SUBJECT, validTopic: TOPIC, debouncedSearch: '' });
  for (const props of renderList(sections)) {
    const expected = correctionsFor(sectionId(SUBJECT, TOPIC, props.section.heading));
    assert.equal(props.conflicts.length, expected.length);
    if (expected.length > 0) assert.equal(props.conflicts, expected, 'a section with corrections gets the stored list');
    else assert.ok(Object.isFrozen(props.conflicts), 'one empty list is shared by every section, so it must be frozen');
    assert.equal(props.figSectionId, sectionId(SUBJECT, TOPIC, props.section.heading));
  }
});

test('when the debounced query changes, every section re-renders once so its highlight follows', () => {
  const { context, renderList } = sectionElementFactory();
  Object.assign(context, { subject: SUBJECT, validTopic: TOPIC, debouncedSearch: '' });
  const before = renderList(sections);
  context.debouncedSearch = 'กุ้ง';
  const after = renderList(sections);
  assert.ok(after.every((p) => p.highlight === 'กุ้ง'));
  assert.equal(before.filter((p, i) => wouldRerender(p, after[i])).length, sections.length);
});
