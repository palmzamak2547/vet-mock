import assert from 'node:assert/strict';
import test from 'node:test';

import {
  APP_VIEW_ROUTES,
  appPathForView,
  isAppPath,
  viewForAppPath,
} from '../../src/lib/view-route.js';

test('stable app views round-trip through readable paths', () => {
  for (const [view, path] of Object.entries(APP_VIEW_ROUTES)) {
    assert.equal(appPathForView(view), path);
    if (view !== 'home') assert.equal(viewForAppPath(path), view);
  }
});

test('path parsing tolerates a trailing slash but rejects unknown routes', () => {
  assert.equal(viewForAppPath('/app/videos/'), 'videos');
  assert.equal(viewForAppPath('/app/not-a-feature'), null);
  assert.equal(viewForAppPath('/'), null, 'root still respects the first-run landing gate');
});

test('stateful flows are deliberately not encoded as app paths', () => {
  for (const view of ['config', 'topic-select', 'exam', 'results', 'review']) {
    assert.equal(appPathForView(view), null);
  }
  assert.equal(isAppPath('/app/tools/pdf'), true);
  assert.equal(isAppPath('/wiki/com5/rabies'), false);
});
