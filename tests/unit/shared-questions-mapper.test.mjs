// ============================================================
// shared-questions-mapper.test.mjs — the Shared Q tab tells the truth
// ============================================================
// The group page's Shared Q tab told students to add a question in Question
// Manager and press "Share". There has never been a Share button: api.js
// exports shareQuestion, and nothing in the app has ever called it. The
// Groups hero promised "แชร์ข้อสอบ" the same way. Until a share action
// exists, the copy says sharing into a group is not available yet.
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

/** Every place in src that CALLS shareQuestion, not the one that defines it. */
let callers = null;
function shareCallers() {
  callers ??= sourceFiles('src').filter((file) => {
    const code = src(file).replace(/export async function shareQuestion\(/g, '');
    return /\bshareQuestion\(/.test(code);
  });
  return callers;
}

test('the Shared Q tab does not send students to a Share button that does not exist', () => {
  if (shareCallers().length) return; // a real share action exists; the copy may point at it
  const detail = src('src/views/GroupDetailView.jsx');
  assert.doesNotMatch(detail, /กด\s*"Share"/, 'there is no Share button to press');
  assert.doesNotMatch(detail, /Question Manager/, 'Question Manager has no group action');
  assert.match(detail, /ยังแชร์ข้อสอบเข้ากลุ่มไม่ได้/, 'the tab says sharing is not available yet');
  assert.match(detail, /ยังไม่มีข้อสอบที่แชร์/, 'the empty state stays');
});

test('the Groups hero does not promise sharing questions', () => {
  if (shareCallers().length) return;
  const groups = src('src/views/GroupsView.jsx');
  const hero = groups.slice(groups.indexOf('<div className="vmx-hero">'), groups.indexOf('</div>', groups.indexOf('<div className="vmx-hero">')));
  assert.ok(hero.includes('แข่งคะแนน'), 'the hero is still there');
  assert.doesNotMatch(hero, /แชร์ข้อสอบ/);
});

test('the new copy keeps the house rules', () => {
  for (const file of ['src/views/GroupDetailView.jsx', 'src/views/GroupsView.jsx']) {
    const code = src(file);
    assert.doesNotMatch(code, /·/, `${file}: no middle dot in UI copy`);
    assert.doesNotMatch(code, /นักศึกษา/, `${file}: นิสิต, never นักศึกษา`);
  }
});
