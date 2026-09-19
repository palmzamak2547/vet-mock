import test from 'node:test';
import assert from 'node:assert/strict';
import { publishUpdateStatus } from '../../src/lib/update-safety.js';

test('update status carries no exception messages or learner input', () => {
  const events = [];
  const target = { document: { documentElement: { dataset: {} } },
    CustomEvent: class { constructor(type, { detail }) { Object.assign(this, { type, detail }); } },
    dispatchEvent: e => events.push(e),
  };
  assert.deepEqual(publishUpdateStatus(target, 'preload-error'), { state: 'deferred', reason: 'preload-error', version: null });
  assert.deepEqual(events.map(e => e.type), ['vmx-update-deferred', 'vmx-sw-update']);
  publishUpdateStatus(target, 'service-worker', 'next');
  assert.equal(target.document.documentElement.dataset.vmxUpdateStatus, 'ready');
});
