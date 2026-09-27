// Routes (M1-DESIGN.md 2). OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, routePath } from '../../src/router.js';

test('known routes round-trip', () => {
  const cases = ['/', '/app', '/app/tools/sample-size', '/licenses', '/app/p/3f2a9c1b-0000-4000-8000-000000000001', '/app/p/abc/data', '/app/p/abc/r/def'];
  for (const p of cases) assert.equal(routePath(parseRoute(p)), p);
});

test('trailing slashes and unknown paths', () => {
  assert.deepEqual(parseRoute('/app/'), { name: 'projects' });
  assert.equal(parseRoute('/app/p/abc/unknownpane').name, 'notFound');
  assert.equal(parseRoute('/wp-admin').name, 'notFound');
  assert.equal(parseRoute('/app/p/a%20b').name, 'notFound');
});
