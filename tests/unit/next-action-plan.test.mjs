import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Render the real component, including its planner; no copied selection logic.
const compiled = buildSync({
  entryPoints: [fileURLToPath(new URL('../../src/components/NextActionCard.jsx', import.meta.url))],
  bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', packages: 'external', write: false,
});
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const NextActionCard = mod.exports.default;
const render = (props = {}) => renderToStaticMarkup(createElement(NextActionCard, {
  history: [{ correct: true }], subjects: [{ id: 'com3', name: 'COM III' }],
  practiceCounts: { all: 100, com3: 100 }, ...props,
}));

test('recommendations do not call high accuracy, missing subjects, or an empty paper a weakness', () => {
  for (const props of [
    { accBySubject: { com3: { total: 10, correct: 10 } } },
    { accBySubject: { com3: { total: 20, correct: 15 } } },
    { accBySubject: { missing: { total: 10, correct: 0 } } },
    { accBySubject: { com3: { total: 10, correct: 0 } }, practiceCounts: { all: 100, com3: 0 } },
    { accBySubject: { com3: { total: Infinity, correct: 0 } } },
  ]) {
    const html = render(props);
    assert.match(html, /data-kind="practice"/);
    assert.doesNotMatch(html, /data-kind="weak"/);
  }
  assert.match(render({ accBySubject: { com3: { total: 10, correct: 3 } } }), /data-kind="weak"/);
});

test('imminent exam is first and the plan explains its budget and actual pool limit', () => {
  const html = render({
    cardStats: { due: 200 }, practiceCounts: { all: 3, com3: 3 },
    nextExam: { subject: 'com3', subject_name: 'COM III', date: '2026-09-26', daysLeft: 0 },
  });
  assert.deepEqual([...html.matchAll(/data-kind="(\w+)"/g)].map(m => m[1]), ['exam', 'sr']);
  assert.match(html, /เตรียม COM III 3 ข้อ/);
  assert.match(html, /เผื่ออ่านเฉลย 12 นาที/);
});

test('resume and the first question stay ahead of a full plan', () => {
  const resume = render({ pendingResume: { answered: 2, qCount: 5, ageMin: 1 } });
  assert.deepEqual([...resume.matchAll(/data-kind="(\w+)"/g)].map(m => m[1]), ['resume']);
  assert.doesNotMatch(resume, /vmx-daily-minutes/);
  const first = render({ history: [] });
  assert.match(first, /ลองทำ 1 ข้อแรก/);
  assert.doesNotMatch(first, /vmx-daily-minutes/);
});
