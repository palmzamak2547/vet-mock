import assert from 'node:assert/strict';
import test from 'node:test';

import { FEATURES, IMAGING_URL } from '../../src/lib/feature-registry.js';

test('Imaging Lab always hands off to the canonical imaging product', () => {
  const imaging = FEATURES.find((feature) => feature.id === 'lab');

  assert.ok(imaging, 'Imaging Lab must remain discoverable');
  assert.deepEqual(imaging.invoke, { kind: 'external', url: IMAGING_URL });
  assert.equal(IMAGING_URL, 'https://imaging.cuvetsmo.com');
  assert.equal(
    FEATURES.some((feature) => feature.invoke?.view === 'lab'),
    false,
    'the retired local DICOM route must not be reintroduced',
  );
});
