// ============================================================
// agent-library-handoff.test.mjs — the agent opens ONE subject's shelf
// ============================================================
// validateAction re-grounds the model's "open the library for subject X"
// against the real catalog and holds that subject's id, then returned only
// its name. CommandPalette.executeAgent had nothing else to hand LibraryView,
// so it typed the Thai name into the free-text search key ('vmx-library-q')
// instead of the exact-id key ('vmx-library-subject') that every subject card
// writes. The search haystack includes each row's own subject name, and a
// dozen curriculum names are strict substrings of a sibling's
// ("อายุรศาสตร์สัตว์เล็ก I" sits inside "อายุรศาสตร์สัตว์เล็ก II"), so a student
// who asked for one subject's documents got two subjects' documents, in flat
// search mode, instead of the shelf with its "วิชา: X" chip.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { buildCatalog, validateAction } from '../../api/_lib/agent-actions.js';
import { indexDocs, filterIndexed } from '../../src/lib/library.js';

const catalog = buildCatalog();

// ── The validator keeps the id it just matched ───────────────────────────

test('a validated library action carries the exact subject id, not only the name', () => {
  const v = validateAction({ type: 'library', params: { subject: 'com1' } }, catalog);
  assert.equal(v.ok, true);
  assert.equal(v.action.type, 'library');
  assert.equal(v.action.subject, 'com1', 'the id the validator matched must reach the client');
  const meta = catalog.librarySubjects.find((s) => s.id === 'com1');
  assert.equal(v.action.subjectName, meta.name, 'the name still rides along for the confirm line');
});

test('the id is always the catalog id, never a spelling the model invented', () => {
  assert.equal(validateAction({ type: 'library', params: { subject: 'made-up-999' } }, catalog).ok, false);
  const v = validateAction({ type: 'library', params: { subject: 'vet-path-1' } }, catalog);
  assert.equal(v.ok, true);
  assert.ok(catalog.librarySubjects.some((s) => s.id === v.action.subject));
});

// ── Why the name alone was never a hand-off ──────────────────────────────
// filterIndexed matches a text query against a haystack that includes the
// row's own subject name. With a real substring pair from the curriculum, the
// name-as-text query returns the sibling's shelf too; the exact id does not.

test('a subject name typed into the search also matches a sibling subject', (t) => {
  const subs = catalog.librarySubjects;
  let pair = null;
  for (const a of subs) {
    const b = subs.find((s) => s.id !== a.id && s.name.toLowerCase().includes(a.name.toLowerCase()));
    if (b) { pair = [a, b]; break; }
  }
  if (!pair) { t.skip('no curriculum subject name sits inside another one any more'); return; }
  const [a, b] = pair;
  const index = indexDocs([
    { id: 'd1', title: 'สไลด์บทที่ 1', subject: a.id, kind: 'slides' },
    { id: 'd2', title: 'สไลด์บทที่ 1', subject: b.id, kind: 'slides' },
  ]);
  assert.deepEqual(
    filterIndexed(index, { query: a.name }).map((d) => d.subject).sort(),
    [a.id, b.id].sort(),
    `searching "${a.name}" as text also returns ${b.id}'s documents`,
  );
  assert.deepEqual(filterIndexed(index, { subject: a.id }).map((d) => d.subject), [a.id]);
});

// ── The palette uses the id, source-text contract ────────────────────────
// CommandPalette imports React, so the dispatch branch is pinned the way
// race-channel-lifetime.test.mjs pins RaceView: by reading the source.

const PALETTE = readFileSync(join(resolve(process.cwd()), 'src/components/CommandPalette.jsx'), 'utf8');

function libraryBranch() {
  const start = PALETTE.indexOf("if (action.type === 'library') {");
  assert.notEqual(start, -1, 'executeAgent must still dispatch library actions');
  const end = PALETTE.indexOf("h.goView?.('library')", start);
  assert.notEqual(end, -1, 'the library branch must still open the shelf');
  return PALETTE.slice(start, end);
}

test('the palette hands the agent\'s subject id to the exact-subject shelf filter', () => {
  const branch = libraryBranch();
  assert.match(branch, /vmx-library-subject/, 'must write the key every subject card writes');
  assert.match(branch, /action\.subject\b/, 'the id comes from the validated action');
});

test('the palette no longer types the subject name into the search box unconditionally', () => {
  const branch = libraryBranch();
  assert.doesNotMatch(
    branch,
    /^\s*try \{ sessionStorage\.setItem\('vmx-library-q'/m,
    'the old name-as-text hand-off is back',
  );
});
