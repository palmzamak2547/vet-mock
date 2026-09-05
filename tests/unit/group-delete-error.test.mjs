// ============================================================
// group-delete-error.test.mjs — a failed delete must say so
// ============================================================
// GroupDetailView lets the author of a shared question remove it from the
// group. deleteSharedQuestion throws on any PostgREST or network error, and
// the inline async onClick had no try/catch: the student confirmed "ลบ" in
// the danger dialog, the promise rejected unhandled, load() never ran, and
// the row sat in the list exactly as before. Nothing on screen told them
// whether the delete had happened, so they could not tell "failed" from
// "still working" and had no reason to try again.
//
// The view's only error surface was the load-failure StatePanel, which the
// delete path could never reach. GroupsView already handles its own actions
// (create / join / leave) with a try/catch that feeds an inline ⚠️ banner
// through thaiError; the delete now does the same.
//
// This cannot be driven from node (JSX + Supabase), so it pins the contract
// at the source level, the way race-channel-lifetime.test.mjs does.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/GroupDetailView.jsx'), 'utf8');

/** The onClick that deletes a shared question: from its opening to the 🗑 label. */
function deleteHandler() {
  const anchor = SRC.indexOf("'ลบข้อนี้ออกจากกลุ่ม?'");
  assert.notEqual(anchor, -1, 'the delete must still ask before removing a question');
  const start = SRC.lastIndexOf('onClick={async () => {', anchor);
  assert.notEqual(start, -1, 'the delete handler must still be an async onClick');
  const end = SRC.indexOf('}}>🗑</button>', anchor);
  assert.notEqual(end, -1, 'could not find the end of the delete handler');
  return SRC.slice(start, end);
}

test('the delete call is wrapped in try/catch', () => {
  const body = deleteHandler();
  assert.match(body, /deleteSharedQuestion\(q\.id\)/, 'the handler must still call deleteSharedQuestion');
  const tryAt = body.indexOf('try {');
  const callAt = body.indexOf('deleteSharedQuestion(q.id)');
  const catchAt = body.indexOf('catch (');
  assert.ok(tryAt !== -1 && tryAt < callAt, 'deleteSharedQuestion must be called inside a try');
  assert.ok(catchAt > callAt, 'there must be a catch after the delete');
});

test('the catch tells the student in Thai, through thaiError, on screen', () => {
  const body = deleteHandler();
  const m = body.match(/catch \((\w+)\) \{\s*(set\w+)\(thaiError\(\1, '([^']+)'\)\);/);
  assert.ok(m, 'the catch must set an error state with thaiError(e, fallback)');
  const [, , setter, fallback] = m;
  assert.match(fallback, /[ก-๙]/, 'the fallback must be Thai');
  assert.doesNotMatch(fallback, /·|Claude|AI/, 'no middle-dot, no vendor name in user-facing text');
  assert.match(
    SRC,
    /import \{ thaiError \} from '\.\.\/lib\/errors\.js';/,
    'thaiError must come from lib/errors.js like every other view',
  );
  // The state the catch writes must actually reach the screen — a setter
  // with no matching render would be the same silence one level down.
  const decl = SRC.match(new RegExp(`const \\[(\\w+), ${setter}\\] = useState\\(''\\);`));
  assert.ok(decl, `${setter} must have a matching useState`);
  const stateVar = decl[1];
  assert.match(
    SRC,
    new RegExp(`\\{${stateVar} && <div[^>]*>⚠️ \\{${stateVar}\\}</div>\\}`),
    `${stateVar} must render as the inline ⚠️ banner GroupsView uses`,
  );
});

test('a successful delete still refreshes the list', () => {
  const body = deleteHandler();
  assert.match(
    body,
    /await deleteSharedQuestion\(q\.id\);\s*await load\(\);/,
    'load() must follow a successful delete so the row disappears',
  );
});
