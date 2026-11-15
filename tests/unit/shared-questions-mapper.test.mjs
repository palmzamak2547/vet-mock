// ============================================================
// shared-questions-mapper.test.mjs — the group page tells the truth about sharing
// ============================================================
// DA-09. The group page's Shared Q tab told students to add a question in
// Question Manager and press "Share". There has never been a Share button,
// and nothing in the app ever called shareQuestion. The copy was changed to
// say sharing was not available yet.
//
// The multiplayer wave (Nov 2026) removed the tab and the client code behind
// it (getSharedQuestions, deleteSharedQuestion, shareQuestion and the
// readSharedQuestion mapper of DA-05): production held 0 shared questions,
// and a tab that can never fill only crowds the page. What still binds:
//   - no screen promises a Share action that does not exist;
//   - nothing reads shared_questions without a mapper at the read boundary
//     (DA-05: rows are JSON another member wrote; one with a string for its
//     tags once blanked the whole tab). A share feature that comes back must
//     bring a reader that maps its rows, and this test will ask for it.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const src = (p) => readFileSync(join(ROOT, p), 'utf8');

function sourceFiles(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${name}`;
    if (statSync(join(ROOT, rel)).isDirectory()) sourceFiles(rel, out);
    else if (/\.(jsx?|mjs)$/.test(name)) out.push(rel);
  }
  return out;
}

test('DA-09: the group page sends nobody to a Share button that does not exist', () => {
  const detail = src('src/views/GroupDetailView.jsx');
  assert.doesNotMatch(detail, /กด\s*"Share"/, 'there is no Share button to press');
  assert.doesNotMatch(detail, /Question Manager/, 'Question Manager has no group action');
  assert.doesNotMatch(detail, /ข้อที่แชร์/, 'no tab for questions nobody can share');
});

test('DA-09: the Groups hero does not promise sharing questions', () => {
  const groups = src('src/views/GroupsView.jsx');
  const hero = groups.slice(groups.indexOf('<div className="vmx-hero">'), groups.indexOf('</div>', groups.indexOf('<div className="vmx-hero">')));
  assert.ok(hero.includes('แข่งคะแนน'), 'the hero is still there');
  assert.doesNotMatch(hero, /แชร์ข้อสอบ/);
});

test('DA-09: the palette and the shared-link cover do not promise sharing questions either', () => {
  for (const file of ['src/lib/feature-registry.js', 'src/data/og-covers.js']) {
    assert.doesNotMatch(src(file), /แชร์ข้อสอบ/, file);
  }
});

test('DA-09: the copy keeps the house rules', () => {
  for (const file of ['src/views/GroupDetailView.jsx', 'src/views/GroupsView.jsx']) {
    const code = src(file);
    assert.doesNotMatch(code, /·/, `${file}: no middle dot in UI copy`);
    assert.doesNotMatch(code, /นักศึกษา/, `${file}: นิสิต, never นักศึกษา`);
  }
});

test('DA-05: nothing reads shared_questions without a mapper at the read boundary', () => {
  const readers = sourceFiles('src').filter((file) => /from\(['"]shared_questions['"]\)/.test(src(file)));
  for (const file of readers) {
    assert.match(src(file), /function readSharedQuestion\(/, `${file} reads shared_questions: map each row (DA-05) before a screen draws it`);
  }
});
