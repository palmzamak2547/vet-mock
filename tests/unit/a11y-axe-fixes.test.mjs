// ============================================================
// Accessibility fixes from the axe scan (2026-09-02) — contracts
// ============================================================
// Two findings across the main routes: the subject cards without usable
// content were dimmed as a whole, taking their subtitle and count under
// the 4.5:1 floor; and the dashboard / schedule card titles were h3s
// directly under the page h1. These keep both fixes in place.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../../src/views/HomeView.jsx');
const css = read('../../src/styles.css');
const dashboard = read('../../src/views/DashboardView.jsx');
const schedule = read('../../src/views/ScheduleView.jsx');

test('a subject card is never dimmed as a whole; the quiet state is a class', () => {
  const grid = home.slice(home.indexOf('function SubjectGrid('));
  assert.doesNotMatch(grid, /opacity: hasUsableContent/);
  assert.match(grid, /className=\{`vmx-subject-card\$\{hasUsableContent \|\| shelfDocs > 0 \? '' : ' is-quiet'\}`\}/);
  assert.match(css, /\.vmx-subject-card\.is-quiet \{ border-style: dashed; \}/);
  assert.match(css, /\.vmx-subject-card\.is-quiet \.icon, \.vmx-subject-card\.is-quiet \.accent \{ opacity: 0\.55; \}/);
  // Text never gets an opacity: contrast is decided by its colour tokens.
  assert.doesNotMatch(css, /\.vmx-subject-card\.is-quiet (\.title|\.sub|\.count)[^{]*\{[^}]*opacity/);
});

test('dashboard and schedule card titles are h2 under the page h1', () => {
  assert.equal((dashboard.match(/<h3\b/g) || []).length, 0);
  assert.equal((schedule.match(/<h3\b/g) || []).length, 0);
  assert.ok((dashboard.match(/<h2\b/g) || []).length >= 8);
  assert.match(css, /\.vmx-dash-card h2, \.vmx-dash-card h3 \{ font-family: inherit; font-size: 18px;/);
});
