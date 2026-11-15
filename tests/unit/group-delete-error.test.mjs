// ============================================================
// group-delete-error.test.mjs — a failed group action must say so
// ============================================================
// GroupDetailView once let the author of a shared question remove it, and
// the inline async onClick had no try/catch: the student confirmed "ลบ" in
// the danger dialog, the promise rejected unhandled, and nothing on screen
// told them whether the delete had happened.
//
// The shared-questions tab is gone (the multiplayer wave of Nov 2026: the
// app never had a way to share a question), and the page's destructive
// actions are now leaving the group and, for its last admin, deleting it.
// The same contract holds for both: ask first, call inside a try, and on a
// failure say so in Thai, through thaiError, in the page's ⚠️ banner, the
// one GroupsView uses for its own actions.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/GroupDetailView.jsx'), 'utf8').replace(/\r\n/g, '\n');

/** The body of `const <name> = async () => { ... };`. */
function handler(name) {
  const start = SRC.indexOf(`const ${name} = async () => {`);
  assert.notEqual(start, -1, `${name} must still be an async handler`);
  const end = SRC.indexOf('\n  };\n', start);
  assert.notEqual(end, -1, `could not find the end of ${name}`);
  return SRC.slice(start, end);
}

const ACTIONS = [['leave', 'leaveGroup(group.id, user.id)'], ['removeGroup', 'deleteGroup(group.id)']];

test('each destructive action asks first, then calls inside a try', () => {
  for (const [name, call] of ACTIONS) {
    const body = handler(name);
    const askAt = body.indexOf('await confirmDialog(');
    const tryAt = body.indexOf('try {');
    const callAt = body.indexOf(call);
    const catchAt = body.indexOf('catch (');
    assert.ok(askAt !== -1 && askAt < callAt, `${name} must ask before ${call}`);
    assert.match(body, /tone: 'danger'/, `${name} asks with the danger tone`);
    assert.ok(tryAt !== -1 && tryAt < callAt, `${call} must be called inside a try`);
    assert.ok(catchAt > callAt, `there must be a catch after ${call}`);
  }
});

test('the catch tells the student in Thai, through thaiError, on screen', () => {
  assert.match(SRC, /import \{ thaiError \} from '\.\.\/lib\/errors\.js';/, 'thaiError must come from lib/errors.js like every other view');
  for (const [name] of ACTIONS) {
    const body = handler(name);
    const m = body.match(/catch \((\w+)\) \{ (set\w+)\(thaiError\(\1, '([^']+)'\)\); \}/);
    assert.ok(m, `${name}: the catch must set an error state with thaiError(e, fallback)`);
    const [, , setter, fallback] = m;
    assert.match(fallback, /[ก-๙]/, 'the fallback must be Thai');
    assert.doesNotMatch(fallback, /·/, 'no middle dot in user-facing text');
    const decl = SRC.match(new RegExp(`const \\[(\\w+), ${setter}\\] = useState\\(''\\);`));
    assert.ok(decl, `${setter} must have a matching useState`);
    assert.match(SRC, new RegExp(`\\{${decl[1]} && <div[^>]*>⚠️ \\{${decl[1]}\\}</div>\\}`), `${decl[1]} must render as the inline ⚠️ banner`);
  }
});

test('a successful action goes back to the group list, which reloads', () => {
  assert.match(handler('leave'), /await leaveGroup\(group\.id, user\.id\); goBack\(\);/);
  assert.match(handler('removeGroup'), /await deleteGroup\(group\.id\); goBack\(\);/);
});
