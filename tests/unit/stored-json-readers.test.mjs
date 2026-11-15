// Every place that parses a stored value itself, outside the one safe reader
// (src/lib/stored-json.js readStoredJson, which storage.get in useStorage.js
// uses). A stored null, the text "undefined" or a cut-off JSON string read
// that way blanked the whole app (vmx-consent-prefs) and put Home's error card
// up (vmx-quests-streak) until 11 Nov 2026. New code reads through
// readStoredJson; this list (45 files, 66 reads on 11 Nov) may only shrink:
// a file not on it may hold no direct read, and a count must match exactly,
// so moving a read to readStoredJson means lowering its number here.
// A direct read: JSON.parse of a .getItem(...) call, or of a name assigned
// from one in the same file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readStoredJson, isPlainObject } from '../../src/lib/stored-json.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export function directReads(src) {
  const names = new Set();
  for (const m of src.matchAll(/(?:\b(?:const|let|var)\s+)?\b([A-Za-z_$][\w$]*)\s*=\s*[^;\n]*?\.getItem\(/g)) names.add(m[1]);
  let n = 0;
  for (const m of src.matchAll(/JSON\.parse\(\s*([^)]*?)(?:\)|,)/g)) {
    const arg = m[1];
    if (/\.getItem\(/.test(arg) || /^[\w$.?]*getItem\(/.test(arg)) { n++; continue; }
    const id = arg.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1];
    if (id && names.has(id)) n++;
  }
  return n;
}

// [file, direct reads, why it is still here]
const KNOWN = [
  ['src/App.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/components/CommandPalette.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/components/OSCEDrill.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/components/Question.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/components/SmartGrader.jsx', 4, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/components/SmartPassage.jsx', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/data/how-to.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/hooks/useExamSession.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/hooks/useOnlineCount.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/account-local-purge.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/buddy-stats.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/changelog-seen.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/chula.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/daily-q.js', 3, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/dicom/recent-files.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/exam-recovery.js', 3, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/external-doc-client.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/feedback-client.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/first-tip.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/guide-progress.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/id-migration.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/image-occlusion.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/library.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/local-extras.js', 3, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/motion-preferences.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/native-app.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/nav-usage.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/notebook.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/pdf-annotations.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/phase-wrapped.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/pomodoro.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/pomodoro-run.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/quests.js', 2, 'readStreak checks its own shape (stored null fix); readState not yet moved'],
  ['src/lib/reading-layout.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/storage-gc.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/tts.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/user-data-atomic.js', 3, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/user-data-sync.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/web-vitals.js', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/lib/xp.js', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/views/BenchView.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/views/HomeView.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/views/NotesView.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/views/ResultsView.jsx', 1, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
  ['src/views/VideoView.jsx', 2, 'not yet moved to readStoredJson; no screen broke through it in the 11 Nov stored-key sweep'],
];

const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(n) ? [p] : [];
});

test('no stored value is parsed outside readStoredJson, except the listed ones', () => {
  const known = new Map(KNOWN.map(([f, n]) => [f, n]));
  const found = new Map();
  for (const f of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, f).replaceAll('\\', '/');
    if (rel === 'src/lib/stored-json.js') continue;
    const n = directReads(readFileSync(f, 'utf8'));
    if (n) found.set(rel, n);
  }
  for (const [f, n] of found) {
    assert.ok(known.has(f), `${f} parses a stored value itself (${n}): read it with readStoredJson (src/lib/stored-json.js)`);
    assert.ok(n <= known.get(f), `${f} has ${n} direct reads, more than the ${known.get(f)} listed: read the new one with readStoredJson`);
  }
  for (const [f, n] of known) {
    assert.equal(found.get(f) || 0, n, `${f} now has ${found.get(f) || 0} direct reads: lower its number in this list to match`);
  }
});

test('every listed file says why it is still there', () => {
  for (const [f, , why] of KNOWN) assert.ok(why && why.length > 10, f);
});

test('readStoredJson: missing, corrupt, null, "undefined" and refused values read as the fallback', () => {
  const map = new Map(Object.entries({ corrupt: '{"a":', nul: 'null', undef: 'undefined', arr: '[1]', obj: '{"a":1}', zero: '0' }));
  const storage = { getItem: (k) => (map.has(k) ? map.get(k) : null) };
  const def = { a: 0 };
  for (const k of ['missing', 'corrupt', 'nul', 'undef']) assert.equal(readStoredJson(k, def, { storage }), def, k);
  assert.equal(readStoredJson('arr', def, { storage, accept: isPlainObject }), def);
  assert.deepEqual(readStoredJson('obj', def, { storage, accept: isPlainObject }), { a: 1 });
  assert.equal(readStoredJson('zero', 5, { storage }), 0);
  assert.equal(readStoredJson('x', 'none', { storage: { getItem() { throw new Error('denied'); } } }), 'none');
});

test('the storage hook reads through readStoredJson', () => {
  const src = readFileSync(join(ROOT, 'src/hooks/useStorage.js'), 'utf8');
  assert.match(src, /return readStoredJson\(key, fallback\);/);
});
