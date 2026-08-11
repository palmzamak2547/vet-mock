import assert from 'node:assert/strict';
import test from 'node:test';

import { FEATURES, IMAGING_PRO_URL } from '../../src/lib/feature-registry.js';

test('VetMock keeps a local practical Imaging Lab', () => {
  const practical = FEATURES.find((feature) => feature.id === 'lab');

  assert.ok(practical, 'Practical Imaging must remain discoverable');
  assert.equal(practical.fab, true, 'Practical Imaging belongs in quick tools');
  assert.match(practical.label, /Practical/);
  assert.deepEqual(practical.invoke, { kind: 'view', view: 'lab' });
});

test('the full Imaging Pro workstation stays a distinct external feature', () => {
  const pro = FEATURES.find((feature) => feature.id === 'imaging-pro');

  assert.ok(pro, 'Imaging Pro must remain discoverable');
  assert.notEqual(pro.id, 'lab');
  assert.deepEqual(pro.invoke, { kind: 'external', url: IMAGING_PRO_URL });
  assert.equal(IMAGING_PRO_URL, 'https://imaging.cuvetsmo.com');
});
