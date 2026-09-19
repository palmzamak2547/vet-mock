import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { UPDATE_UNSAFE_VIEWS, isUpdateUnsafe } from '../../src/lib/update-safety.js';

// The harm this guards against, in the words of the comment that has been in
// App.jsx all along: results, review, config and topic-select have no URL, so
// an update applied there lands on Home with the score screen gone. App.jsx
// knew that. The chunk-reload path in app-lifecycle.js did not — it asked only
// whether the view was 'exam' — so a deploy landing while a student read their
// score reloaded them to Home.

test('every view a reload cannot restore is unsafe to update on', () => {
  for (const view of ['exam', 'sr-session', 'race', 'pomodoro', 'results', 'review', 'config', 'topic-select']) {
    assert.equal(isUpdateUnsafe(view), true, `${view} must be update-unsafe`);
  }
  assert.equal(isUpdateUnsafe('home'), false);
  assert.equal(isUpdateUnsafe(undefined), false);
  assert.equal(UPDATE_UNSAFE_VIEWS.length, 8);
});

// Both paths must read the same list. A second hand-written copy is how they
// drifted apart in the first place, so the pin is on the import, not on a
// string of view names that a copy would satisfy just as well.
for (const file of ['src/App.jsx', 'src/lib/app-lifecycle.js']) {
  test(`${file} decides with the shared list`, () => {
    const src = readFileSync(file, 'utf8');
    assert.match(src, /from ['"].*update-safety(\.js)?['"]/, `${file} should import update-safety`);
    assert.ok(
      !/activeView === ['"]exam['"]/.test(src),
      `${file} still checks for the exam view by hand`,
    );
  });
}
