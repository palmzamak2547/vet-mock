import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseUserBackup } from '../../src/lib/user-data-schema.js';
import { QB } from '../../src/data/questions.js';
import { yearForSubject } from '../../src/data/curriculum.js';

// Render the actual Dashboard and its charts. Only compile JSX; keep the real
// React hooks, imported schema and history readers (no copied chart arithmetic).
const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), {
        loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url,
      });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
const { default: DashboardView } = await import('../../src/views/DashboardView.jsx');

const render = (history, t) => {
  // React 18 SSR warns for each existing SVG title with multiple children.
  // Allow only that known warning; any new render warning still fails the test.
  t.mock.method(console, 'error', (message) => {
    assert.match(String(message), /^Warning: A title element received an array/);
  });
  return renderToStaticMarkup(createElement(DashboardView, {
    history, selectedYear: 5, bookmarks: [], customQuestions: [], notes: {}, srCards: {},
    analytics: { totalAttempts: history.length, overallPct: 0, bySubject: {}, weakQuestions: [], weakTags: [] },
    setView() {},
  }));
};
const chart = (html, label) => {
  const value = html.match(new RegExp(`<svg[^>]*aria-label="${label}"[\\s\\S]*?</svg>`))?.[0];
  assert.ok(value, `${label} must remain visible`);
  assert.doesNotMatch(value, /NaN|Invalid Date/);
  return value;
};
const row = (questionId, date, correct = true) => ({ questionId, subject: 'com5', year: 5, date, correct });

test('Dashboard plots equivalent numeric and legacy ISO dates in both charts', (t) => {
  const date = Date.now();
  const history = Array.from({ length: 6 }, (_, i) => row(i + 1,
    i % 2 ? new Date(date).toISOString() : date, i < 4));
  const original = structuredClone(history);
  const html = render(history, t);
  assert.match(chart(html, 'กราฟการฝึก 7 วันล่าสุด'), /6 ข้อ, 67%/);
  assert.match(chart(html, 'กราฟความแม่นยำรายวิชา'), /67% \(6 ข้อ\)/);
  assert.deepEqual(history, original, 'chart reads must never rewrite stored history');
});

test('a schema-valid undated backup keeps Dashboard usable without inventing a study day', (t) => {
  const history = Array.from({ length: 5 }, (_, i) => row(i + 1, Date.now()));
  history.push({ questionId: 6, subject: 'com5', year: 5, correct: false });
  const parsed = parseUserBackup({ history });
  assert.equal(parsed.success, true, 'the existing backup contract explicitly permits a missing date');
  const html = render(parsed.data.history, t);
  assert.match(chart(html, 'กราฟการฝึก 7 วันล่าสุด'), /5 ข้อ, 100%/);
  assert.match(chart(html, 'กราฟความแม่นยำรายวิชา'), /100% \(5 ข้อ\)/);
  assert.equal(parsed.data.history.length, 6, 'undated records remain available to lifetime statistics');
  assert.equal(parsed.data.history[5].date, undefined);
});

test('a cold Dashboard scopes legacy history by the curriculum before question banks load', (t) => {
  assert.equal(QB.length, 0, 'the regression needs a genuinely cold bank');
  assert.equal(yearForSubject('com5'), 4);
  assert.equal(yearForSubject('equine-medicine'), 5);
  const history = ['com5', 'equine-medicine'].flatMap((subject) =>
    Array.from({ length: 5 }, (_, i) => ({ questionId: i + 1, subject, date: Date.now(), correct: true })));
  const parsed = parseUserBackup({ history });
  assert.equal(parsed.success, true, 'legacy rows without a year are valid backups');
  const html = render(parsed.data.history, t);
  assert.match(chart(html, 'กราฟการฝึก 7 วันล่าสุด'), /5 ข้อ, 100%/);
  assert.doesNotMatch(chart(html, 'กราฟความแม่นยำรายวิชา'), /COM V/);
  assert.equal(history.length, 10, 'other-year history is filtered only for this view');
});
