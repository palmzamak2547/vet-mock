import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import * as React from 'react';
import * as jsx from 'react/jsx-runtime';
import * as curriculum from '../../src/data/curriculum.js';
import * as notes from '../../src/data/notes-registry.generated.js';
import * as progress from '../../src/lib/study-progress.js';
import * as scope from '../../src/lib/exam-scope.js';

// Execute the real view and event handlers. Only React's hook lifecycle and
// visual children are replaced; curriculum, scope, and progress are real.
const source = readFileSync(new URL('../../src/views/ReadingChecklistView.jsx', import.meta.url), 'utf8');
const compiled = transformSync(source, { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code;
const children = (node) => Array.isArray(node) ? node.flatMap(children)
  : React.isValidElement(node) ? [node, ...children(node.props.children)] : [];

function checklist({ selectedYear = 5, selectedPhase = '1-mid', saved = {}, accepted = true } = {}) {
  const cells = [], celebrations = [], alerts = [], navigation = [];
  let index = 0, pending = [], tree;
  const props = { selectedYear, selectedPhase, readingChecklist: saved,
    setReadingChecklist: (update) => {
      if (!accepted) return { accepted: false };
      saved = update(saved);
      return { accepted: true };
    },
    setSubject: (id) => navigation.push(['subject', id]),
    setTopic: (id) => navigation.push(['topic', id]),
    setView: (view) => navigation.push(['view', view]),
  };
  const hooks = { ...React,
    useRef(initial) { const slot = index++; return cells[slot] ||= { current: initial }; },
    useEffect(fn, deps) {
      const slot = index++, old = cells[slot];
      if (!old || deps.some((value, i) => !Object.is(value, old[i]))) pending.push(fn);
      cells[slot] = deps;
    },
  };
  const imports = {
    react: hooks, 'react/jsx-runtime': jsx,
    '../data/curriculum.js': curriculum,
    '../data/notes-registry.generated.js': notes,
    '../lib/study-progress.js': progress,
    '../lib/exam-scope.js': scope,
    '../lib/confetti.js': { fireConfetti: (value) => celebrations.push(value) },
    '../lib/dialog.js': { alertDialog: (value) => { alerts.push(value); return Promise.resolve(); } },
    '../data/art.js': { EMPTY_ART: { reading: 'reading' } },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)((path) => {
    if (path in imports) return imports[path];
    if (path.startsWith('../components/')) return () => null;
    throw new Error(`Unexpected view dependency: ${path}`);
  }, module, module.exports);
  const render = (next = {}) => {
    Object.assign(props, next, { readingChecklist: saved });
    index = 0; pending = [];
    tree = module.exports.default(props);
    pending.forEach((effect) => effect());
    return children(tree);
  };
  render();
  return { render, celebrations, alerts, navigation,
    get saved() { return saved; },
    set accepted(value) { accepted = value; },
    remote(next) { saved = next; render(); },
    group(id) { return children(tree).find((node) => node.key === id && node.props.style?.borderLeft); },
    buttons() { return children(tree).filter((node) => node.type === 'button'); },
  };
}

test('checklist uses inherited paper scope and semester without hiding unknown topics', () => {
  const view = checklist();
  assert.equal(Boolean(view.group('epidemiology')), false, 'final topics must stay out of midterm');
  assert.equal(Boolean(view.group('poa-clinical')), false, 'continuous subject topics do not form a written paper');
  const year = curriculum.SUBJECTS_BY_YEAR[5];
  const otherTerm = year.find((subject) => subject.semester === 2 && subject.topics?.length);
  assert.ok(otherTerm, 'a real term-two subject must exercise the semester filter');
  assert.equal(Boolean(view.group(otherTerm.id)), false, 'a known opposite-semester subject stays out');
  const unknown = year.find((subject) => subject.semester === 0
    && subject.topics?.some((topic) => !topic.hidden && scope.scopeForTopic(subject.id, topic.id) === null));
  assert.ok(unknown, 'unknown cross-semester topics must exist in the real curriculum');
  assert.ok(view.group(unknown.id), 'unknown scope is retained, not guessed');
  view.render({ selectedPhase: '1-final' });
  assert.ok(view.group('epidemiology'));
  assert.equal(Boolean(view.group('poa-clinical')), false);
  view.render({ selectedPhase: '2-final' });
  assert.equal(Boolean(view.group('epidemiology')), false, 'same paper kind in another semester is not the same phase');
  assert.ok(view.group(otherTerm.id));
  view.render({ selectedPhase: null });
  assert.ok(view.group('epidemiology'));
  assert.ok(view.group('poa-clinical'));
  assert.ok(view.group(otherTerm.id));
  view.render({ selectedYear: 4, selectedPhase: '1-mid' });
  assert.equal(Boolean(view.group('engprof1')), false, 'unmarked topics inherit the final-only timetable');
  view.render({ selectedPhase: '1-final' });
  assert.ok(view.group('engprof1'));
});

test('phase changes and bulk marking retain every out-of-scope and legacy completion', () => {
  const subject = curriculum.SUBJECTS_BY_YEAR[5].find((s) => s.id === 'milk-meat-hygiene');
  const final = subject.topics.find((t) => !t.hidden && scope.scopeForTopic(subject.id, t.id) === 'final');
  const finalKey = progress.topicProgressKey(subject.id, final.id);
  const original = { [finalKey]: 123, 'topic:elsewhere/hidden': 456, legacyTopic: 789 };
  const view = checklist({ saved: original });
  const bulk = () => children(view.group(subject.id)).find((node) => node.type === 'button' && node.props.title?.startsWith('ติ๊กทุกหัวข้อ'));
  bulk().props.onClick();
  view.render();
  const mid = subject.topics.filter((topic) => !topic.hidden && ['midterm', 'both', null].includes(scope.scopeForTopic(subject.id, topic.id)));
  assert.ok(mid.length > 0);
  for (const topic of mid) assert.ok(progress.isTopicRead(view.saved, subject.id, topic.id));
  for (const [key, value] of Object.entries(original)) assert.equal(view.saved[key], value);
  assert.equal(view.celebrations.length, 1, 'accepted local marking celebrates once');
  view.render({ selectedPhase: '1-final' });
  assert.equal(view.celebrations.length, 1, 'changing phase must not celebrate saved reading');
  assert.equal(view.saved[finalKey], 123);
  view.render({ selectedPhase: '1-mid' });
  bulk().props.onClick();
  view.render();
  for (const topic of mid) assert.equal(progress.isTopicRead(view.saved, subject.id, topic.id), false);
  for (const [key, value] of Object.entries(original)) assert.equal(view.saved[key], value);
  assert.deepEqual(original, { [finalKey]: 123, 'topic:elsewhere/hidden': 456, legacyTopic: 789 });
});

test('rejected individual and bulk writes report failure and cannot celebrate a later remote update', () => {
  const view = checklist({ accepted: false });
  const row = view.buttons().find((node) => node.props['aria-label']?.startsWith('อ่านแล้ว '));
  const bulk = view.buttons().find((node) => node.props.title === 'ติ๊กทุกหัวข้อ');
  assert.ok(row && bulk);
  row.props.onClick();
  bulk.props.onClick();
  assert.equal(view.alerts.length, 2, 'each refused write must be reported');
  assert.deepEqual(view.saved, {});
  const subject = curriculum.SUBJECTS_BY_YEAR[5].find((s) => view.group(s.id));
  const topic = subject.topics.find((t) => !t.hidden && ['midterm', 'both', null].includes(scope.scopeForTopic(subject.id, t.id)));
  view.remote({ [progress.topicProgressKey(subject.id, topic.id)]: 100 });
  assert.equal(view.celebrations.length, 0);
  view.accepted = true;
  view.buttons().find((node) => node.props['aria-label'] === `ยกเลิก ${topic.label}`).props.onClick();
  view.render();
  assert.equal(progress.isTopicRead(view.saved, subject.id, topic.id), false);
});

test('a Notes shortcut carries the exact subject and topic without marking it read', () => {
  const view = checklist();
  const subject = curriculum.SUBJECTS_BY_YEAR[5].find((s) => view.group(s.id)
    && s.topics?.some((t) => notes.hasNoteTopic(s.id, t.id) && !t.hidden
      && ['midterm', 'both', null].includes(scope.scopeForTopic(s.id, t.id))));
  const button = children(view.group(subject.id)).find((node) => node.props['aria-label']?.startsWith('เปิด Notes '));
  const topic = subject.topics.find((t) => `เปิด Notes ${t.label}` === button.props['aria-label']);
  button.props.onClick();
  assert.deepEqual(view.navigation, [['subject', subject.id], ['topic', topic.id], ['view', 'notes']]);
  assert.deepEqual(view.saved, {});
});
